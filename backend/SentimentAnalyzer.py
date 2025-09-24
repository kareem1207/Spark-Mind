from typing import Any, Dict
import os
import shutil
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from SpeechToText import SpeechToTextAnalyzer


class SentimentAnalyzer:
    def __init__(self, model_name: str = "tabularisai/multilingual-sentiment-analysis", cache_dir: str | None = None, offline: bool = False) -> None:
        env_dir = os.getenv("SENTIMENT_MODEL_DIR")
        if cache_dir is None and env_dir:
            cache_dir = env_dir
        if cache_dir is None:
            cache_dir = r"D:\\Models\\Sentiment"
        self.model_name = model_name
        self.cache_dir = cache_dir
        self.offline = offline or bool(os.getenv("SENTIMENT_OFFLINE"))
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.labels = ["very negative", "negative", "neutral", "positive", "very positive"]
        self.weights = [0.2, 0.4, 0.6, 0.8, 1.0]

    def _snapshot_root(self) -> str:
        return os.path.join(self.cache_dir, "models--" + self.model_name.replace("/", "--"))

    def ensure_model(self) -> Any:
        os.makedirs(self.cache_dir, exist_ok=True)
        print(f"[SENTIMENT] Using cache dir: {self.cache_dir}")
        # Check for existing model files to avoid unnecessary downloads
        snapshot_root = self._snapshot_root()
        force_download = False
        if not os.path.isdir(snapshot_root):
            print("[SENTIMENT] Local snapshot not found.")
        else:
            print("[SENTIMENT] Found existing snapshot; loading without forced download.")
        local_only_flag = self.offline
        if self.offline and not os.path.isdir(snapshot_root):
            print("[SENTIMENT] Offline mode AND model not present -> will use fallback heuristic sentiment.")
            return None, None
        try:
            tok = AutoTokenizer.from_pretrained(self.model_name, cache_dir=self.cache_dir, local_files_only=local_only_flag)
            mdl = AutoModelForSequenceClassification.from_pretrained(self.model_name, cache_dir=self.cache_dir, torch_dtype=torch.float32, local_files_only=local_only_flag)
        except OSError as e:
            if self.offline:
                print(f"[SENTIMENT] Offline load failed: {e}; using fallback heuristic sentiment.")
                return None, None
            print(f"[SENTIMENT] Standard load failed: {e}")
            if os.path.isdir(snapshot_root):
                print("[SENTIMENT] Corrupted snapshot detected; removing and retrying download.")
                shutil.rmtree(snapshot_root, ignore_errors=True)
            tok = AutoTokenizer.from_pretrained(self.model_name, cache_dir=self.cache_dir, force_download=True)
            mdl = AutoModelForSequenceClassification.from_pretrained(self.model_name, cache_dir=self.cache_dir, force_download=True, torch_dtype=torch.float32)
        mdl.to(self.device)
        return tok, mdl

    def get_text(self) -> str:
        stt = SpeechToTextAnalyzer()
        whisper_model = stt.ensure_model()
        transcription = stt.transcribe(whisper_model)
        return transcription["text"]

    def predict(self, text: str, tokenizer: Any, model: Any) -> Dict[str, Any]:
        if tokenizer is None or model is None:
            # Very naive heuristic fallback
            lowered = text.lower()
            negative_hits = sum(1 for w in ["bad","worse","awful","sad","depressed","angry","upset"] if w in lowered)
            positive_hits = sum(1 for w in ["good","great","happy","calm","better","improve","glad"] if w in lowered)
            score = 0.5
            label = "neutral"
            if positive_hits > negative_hits:
                label = "positive"
                score = 0.75
            elif negative_hits > positive_hits:
                label = "negative"
                score = 0.35
            return {"label": label, "probs": [], "weighted_score": round(score * 100,3), "mode": "heuristic"}
        inputs = tokenizer(text, return_tensors="pt")
        # if self.device == "cuda":
        #     inputs = {k: v.to(self.device) for k, v in inputs.items()}
        with torch.inference_mode():
            outputs = model(**inputs)
            pred = torch.softmax(outputs.logits, dim=1)
        probs = pred[0].tolist()
        label = self.labels[int(torch.argmax(pred))]
        weighted = round(float(sum(p * w for p, w in zip(probs, self.weights)) * 100), 3)
        return {"label": label, "probs": probs, "weighted_score": weighted}

    def run(self) -> Dict[str, Any]:
        tokenizer, model = self.ensure_model()
        text = self.get_text()
        result = self.predict(text, tokenizer, model)
        return {"text": text, "result": result}


if __name__ == "__main__":
    analyzer = SentimentAnalyzer()
    output = analyzer.run()
    print(output)