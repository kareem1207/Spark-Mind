from typing import Any, Dict
import os
import shutil
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from SpeechToText import SpeechToTextAnalyzer


class SentimentAnalyzer:
    def __init__(self, model_name: str = "tabularisai/multilingual-sentiment-analysis", cache_dir: str = r"D:\\Models\\Sentiment") -> None:
        self.model_name = model_name
        self.cache_dir = cache_dir
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.labels = ["very negative", "negative", "neutral", "positive", "very positive"]
        self.weights = [0.2, 0.4, 0.6, 0.8, 1.0]

    def _snapshot_root(self) -> str:
        return os.path.join(self.cache_dir, "models--" + self.model_name.replace("/", "--"))

    def ensure_model(self) -> Any:
        os.makedirs(self.cache_dir, exist_ok=True)
        try:
            tok = AutoTokenizer.from_pretrained(self.model_name, cache_dir=self.cache_dir)
            mdl = AutoModelForSequenceClassification.from_pretrained(self.model_name, cache_dir=self.cache_dir, torch_dtype=torch.float32)
        except OSError:
            snap = self._snapshot_root()
            if os.path.isdir(snap):
                shutil.rmtree(snap, ignore_errors=True)
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