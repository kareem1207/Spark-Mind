import os
import shutil
from typing import Any, Dict, Optional
import json as js
import numpy as np
import torch
import whisper as ws

class SpeechToTextAnalyzer:

    def __init__(
        self,
        audio_path: str = r"d:\Spark Mind\backend\audio\audio2.mp3",
        cache_dir: str = r"D:\Models\whisper_cache",
        model_size: str = "small",
        save_json_path: Optional[str] = "transcription.json",
    ) -> None:
        self.audio_path = audio_path
        self.cache_dir = cache_dir
        self.model_size = model_size
        self.save_json_path = save_json_path
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    def get_setup_info(self) -> Dict[str, Any]:
        info = {
            "torch_version": torch.__version__,
            "cuda_available": bool(torch.cuda.is_available()),
            "ffmpeg_on_path": bool(shutil.which("ffmpeg")),
            "audio_exists": os.path.exists(self.audio_path),
            "device": self.device,
            "cache_dir": self.cache_dir,
            "model_size": self.model_size,
        }
        return info

    def _model_file_path(self) -> str:
        return os.path.join(self.cache_dir, f"{self.model_size}.pt")

    def ensure_model(self) -> Any:
        os.makedirs(self.cache_dir, exist_ok=True)
        model_file = self._model_file_path()
        if not os.path.exists(model_file):
            print(f"Model weights not found -> downloading to {model_file}...")
        else:
            print(f"Model weights found at {model_file} -> loading without download.")

        model = ws.load_model(self.model_size, device=self.device, download_root=self.cache_dir)
        return model

    def transcribe(self, model: Any) -> Dict[str, Any]:
        if not os.path.exists(self.audio_path):
            raise FileNotFoundError(f"Audio file not found: {self.audio_path}")
        result: Dict[str, Any] = model.transcribe(
            self.audio_path,
            fp16=False,
            word_timestamps=True,
        )
        if self.save_json_path:
            with open(self.save_json_path, "w", encoding="utf-8") as f:
                js.dump(result, f, ensure_ascii=False, indent=4)

        return result

    def preprocess_text(self, text: str) -> str:
        replacements = [
            ("\n", " "), (".", " "), (",", " "), ("!", " "), ("?", " "),
            (";", " "), (":", " "), ('"', " "), ("'", " "), ("(", " "), (")", " "),
            ("[", " "), ("]", " "), ("{", " "), ("}", " "), ("-", " "), ("_", " "),
        ]
        new_text = text
        for a, b in replacements:
            new_text = new_text.replace(a, b)
        return new_text

    def compute_metrics(self, transcription: Dict[str, Any]) -> Dict[str, float]:
        total_time: float = -0.0
        total_pause_time: float = 0.0
        for segment in transcription.get("segments", []):
            total_time = max(total_time, float(segment.get("end", 0)))
            seg_len = abs(float(segment.get("end", 0)) - float(segment.get("start", 0)))
            if seg_len > 0.8:
                total_pause_time += seg_len

        pause_density: float = np.round(
            (total_pause_time / (total_pause_time + total_time) * 100) if (total_pause_time + total_time) > 0 else 0.0,
            4,
        )
        words_count: Dict[str, int] = {}
        raw_text: str = transcription.get("text", "")
        new_text: str = self.preprocess_text(raw_text)
        for word in new_text.split():
            w = word.lower()
            words_count[w] = words_count.get(w, 0) + 1
        repeated_words: int = 0
        for w, c in words_count.items():
            if c > 1:
                repeated_words += (c - 1)
        filler_list = [
            "um", "uh", "like", "you know", "so", "actually", "basically",
            "right", "i mean", "and", "but", "or",
        ]
        filler_count: int = 0
        for fw in filler_list:
            filler_count += words_count.get(fw, 0)

        total_tokens = int(np.sum(list(words_count.values()))) if words_count else 0
        filler_frequency: float = np.round(
            (filler_count / total_tokens * 100) if total_tokens > 0 else 0.0,
            4,
        )
        unique_words: int = sum(1 for c in words_count.values() if c == 1)
        lexical_diversity: float = np.round(
            (unique_words / total_tokens * 100) if total_tokens > 0 else 0.0,
            4,
        )
        speech_fluency: float = np.round(
            100 - (pause_density * 0.6) - (filler_frequency * 0.8) - (repeated_words * 1.5) + (lexical_diversity * 0.2),
            2,
        )

        final_rest: Dict[str, float] = {
            "Total time": float(total_time),
            "Total pause time": float(total_pause_time),
            "Pause density (%)": float(pause_density),
            "Repeated words": float(repeated_words),
            "Filler words": float(filler_count),
            "Filler frequency (%)": float(filler_frequency),
            "Unique words": float(unique_words),
            "Lexical diversity (%)": float(lexical_diversity),
            "Speech fluency (words/sec)": float(speech_fluency),
        }
        return final_rest
    def run(self) -> Dict[str, Any]:
        setup = self.get_setup_info()
        model = self.ensure_model()
        transcription = self.transcribe(model)
        print(f"{transcription}")
        results = self.compute_metrics(transcription)
        return {"setup": setup, "results": results}


if __name__ == "__main__":
    analyzer = SpeechToTextAnalyzer()
    output = analyzer.run()
    print("\nSetup:")
    for k, v in output["setup"].items():
        print(f"  {k}: {v}")
    print("\nResults:")
    for k, v in output["results"].items():
        print(f"  {k}: {v}")
