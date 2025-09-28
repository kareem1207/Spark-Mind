import json
from typing import Dict, Any


class PromptBuilder:
	@staticmethod
	def build_doctor_prompt(scores: Dict[str, Any], disclaimer: str) -> str:
		speech_metrics_list = scores["speech_metrics"]
		sentiment_list = scores["sentiment"]
		combined_sentiment = scores.get("combined_sentiment", {})
		transcriptions = scores.get("transcriptions", [])
		print(scores)
		base = {
			"stroop_colour": scores["stroop_colour"],
			"memory_game": scores["memory_game"],
			"image_recall": scores["image_recall"],
			"speech_metrics_per_file": speech_metrics_list,  
			"sentiment_per_file": sentiment_list,           
			"combined_sentiment": combined_sentiment,       
			"audio_files_count": len(transcriptions),
		}
		return (
			"You are to write a comprehensive detailed cognitive assessment report. "
			"Use ONLY the JSON metrics provided (do not fabricate missing game scores). "
			"Explain methodology, interpretation, influencing factors (speech pauses, fillers, lexical diversity, sentiment), and recommendations. "
			"Go full in detail, so that users can understand what is the current situation"
			"If additional up-to-date general cognitive health context is beneficial you may invoke the provided search tool.\n"
			f"Metrics JSON: {json.dumps(base, indent=2)}\n"
			f"Transcript (verbatim): {scores['transcribed_text'][:1200]}\n"
			f"Include this disclaimer exactly once at the end: {disclaimer}"
		)
	
	@staticmethod
	def build_summary_prompt(doctor_report: str, disclaimer: str) -> str:
		return (
			"Summarize the following clinical-style report into: (1) concise paragraph, (2) bullet highlights, (3) next steps checklist. (4) One word report summary explaining overall cognitive risk level (Low, Mild, Moderate, Elevated). "
			"Preserve numeric values. Explicitly state the heuristic cognitive risk category & probability (do not re-calc). End with the disclaimer.\n" + doctor_report + "\nDISCLAIMER:" + disclaimer
		)
	
	@staticmethod
	def build_email_prompt(summary: str, disclaimer: str) -> str:
		return (
			"Write a polite thank-you email to the user summarizing the assessment outcome. No diagnosis. Under 220 words. "
			"Reference major metrics (by descriptive names). End with the disclaimer.\n" + summary + "\nDISCLAIMER:" + disclaimer
		)


if __name__ == "__main__":
    sample_scores = {
        "stroop_colour": 8,
        "memory_game": 25,
        "image_recall": 2,
        "speech_metrics": [{"wpm": 120, "pauses": 5}],
        "sentiment": [{"positive": 0.7, "negative": 0.1}],
        "combined_sentiment": {"overall": "positive"},
        "transcriptions": [{"text": "Sample transcription text."}],
        "transcribed_text": "This is a sample transcribed text from the audio files."
    }
    disclaimer_text = "This report is for informational purposes only and is not a diagnosis."
    doctor_prompt = PromptBuilder.build_doctor_prompt(sample_scores, disclaimer_text)
    summary_prompt = PromptBuilder.build_summary_prompt("Sample doctor report content.", disclaimer_text)
    email_prompt = PromptBuilder.build_email_prompt("Sample summary content.", disclaimer_text)
    
    print("Doctor Prompt:\n", doctor_prompt)
    print("\nSummary Prompt:\n", summary_prompt)
    print("\nEmail Prompt:\n", email_prompt)