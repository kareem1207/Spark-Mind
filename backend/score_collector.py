import os
import time
from typing import Dict, Any, Optional

from SpeechToText import SpeechToTextAnalyzer
from SentimentAnalyzer import SentimentAnalyzer


class ScoreCollector:
	@staticmethod
	def collect_scores(scores:dict[str,int],audio_path: list[str] = [], sentiment_dir: Optional[str] = None, offline_sentiment: bool = False) -> Dict[str, Any]:
		print("[STAGE] Collecting scores & analytics...")
		#! Change it to 0, for testing purposes the values are updated
		stroop_score = scores.get("stroop_colour", 0)
		memory_game_score = scores.get("memory_game", 0)
		image_recall = scores.get("image_recall", 0)
		transcriptions: list[dict[str, Any]] = []
		speech_metrics_list: list[dict[str, Any]] = []
		sentiment_predictions: list[dict[str, Any]] = []
		combined_transcribed_text = ""
    
		try:
			if not audio_path:
				print("[WARN] No audio files provided. Using empty audio analysis.")
				transcriptions = [{"text": "", "segments": []}]
				speech_metrics_list = [{}]
				combined_transcribed_text = ""
			else:
				print(f"[INFO] Processing {len(audio_path)} audio files: {audio_path}")

				valid_files = []
				for path in audio_path:
					if os.path.exists(path):
						valid_files.append(path)
					else:
						print(f"[WARN] Audio file does not exist, skipping: {path}")
				
				if not valid_files:
					print("[WARN] No valid audio files found. Using empty audio analysis.")
					transcriptions = [{"text": "", "segments": []}]
					speech_metrics_list = [{}]
					combined_transcribed_text = ""
				else:
					for i, audio_file_path in enumerate(valid_files):
						print(f"[INFO] Processing audio file {i+1}/{len(valid_files)}: {audio_file_path}")
						
						try:
							stt = SpeechToTextAnalyzer(audio_path=audio_file_path)
							setup_info = stt.get_setup_info()
							print(f"[DEBUG] STT setup for file {i+1}: {setup_info}")
							
							if not setup_info.get("ffmpeg_on_path"):
								print("[WARN] ffmpeg not detected on PATH; transcription may fail or hang.")
							
							stt_model = stt.ensure_model()
							
							if os.path.exists(audio_file_path):
								try:
									fsize = os.path.getsize(audio_file_path) / 1024 / 1024
									print(f"[INFO] Audio file {i+1} size: {fsize:.2f} MB")
								except OSError:
									pass
							
							print(f"[INFO] Starting Whisper transcription for file {i+1}...")
							t0 = time.time()
							transcription = stt.transcribe(stt_model)
							t1 = time.time()
							print(f"[DONE] Transcription {i+1} completed in {t1 - t0:.2f}s")
							
							segs = transcription.get("segments", [])
							print(f"[INFO] File {i+1} segments captured: {len(segs)}")
							if segs:
								preview = " | ".join(seg.get("text", "").strip() for seg in segs[:2])
								print(f"[PREVIEW] File {i+1}: {preview[:160]}")
							
							speech_metrics = stt.compute_metrics(transcription)
							
							transcriptions.append(transcription)
							speech_metrics_list.append(speech_metrics)
							
							file_text = transcription.get("text", "")
							combined_transcribed_text += f" {file_text}".strip()
							
						except Exception as audio_error:
							print(f"[ERROR] Processing audio file {i+1} failed: {audio_error}")
							transcriptions.append({"text": "", "segments": []})
							speech_metrics_list.append({})
		except Exception as e:
			print(f"[ERROR] Speech analysis setup failed: {e}")
			transcriptions = [{"text": "", "segments": []}]
			speech_metrics_list = [{}]
			combined_transcribed_text = ""

		try:
			if sentiment_dir:
				print(f"[SENTIMENT] Using custom sentiment dir: {sentiment_dir}")
			sentiment = SentimentAnalyzer(cache_dir=sentiment_dir, offline=offline_sentiment) if sentiment_dir else SentimentAnalyzer(offline=offline_sentiment)
			sent_model_tok, sent_model = sentiment.ensure_model()
			
			if combined_transcribed_text.strip():
				combined_sentiment = sentiment.predict(combined_transcribed_text, sent_model_tok, sent_model)
			else:
				combined_sentiment = {}
			
			individual_sentiments = []
			for i, transcription in enumerate(transcriptions):
				file_text = transcription.get("text", "")
				if file_text.strip():
					file_sentiment = sentiment.predict(file_text, sent_model_tok, sent_model)
					individual_sentiments.append(file_sentiment)
				else:
					individual_sentiments.append({})
			
			sentiment_predictions = individual_sentiments
			
		except Exception as e:
			print(f"[ERROR] Sentiment analysis failed: {e}")
			combined_sentiment = {}
			sentiment_predictions = [{}] * len(transcriptions)

		bundle = {
			"stroop_colour": stroop_score,
			"memory_game": memory_game_score,
			"image_recall": image_recall,
			"speech_metrics": speech_metrics_list,  
			"sentiment": sentiment_predictions,     
			"combined_sentiment": combined_sentiment,  
			"transcriptions": transcriptions,       
			"transcribed_text": combined_transcribed_text,  
		}
		print("[INFO] Score bundle prepared.")
		return bundle