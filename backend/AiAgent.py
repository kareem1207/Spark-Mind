import os
import json
from datetime import datetime
from typing import Dict, Any, Optional
import argparse
import time

from dotenv import load_dotenv
from fpdf import FPDF
from crewai import LLM, Agent, Task, Crew
import yaml

from SpeechToText import SpeechToTextAnalyzer
from SentimentAnalyzer import SentimentAnalyzer
# Optional search tool (Google freshness) via Serper (Google Search API)
def _init_search_tool():  # lazy import to avoid hard failure if key missing
	api_key = os.getenv("SERPER_API_KEY")
	if not api_key:
		return None
	try:
		from crewai_tools import SerperDevTool  # type: ignore
		tool = SerperDevTool()
		print("[INFO] Search tool enabled (SerperDevTool).")
		return tool
	except Exception as e:
		print(f"[WARN] Failed to initialize search tool: {e}")
		return None


def load_agents_config(path: str) -> Dict[str, Any]:
	with open(path, "r", encoding="utf-8") as f:
		return yaml.safe_load(f)


def collect_scores(audio_path: Optional[str] = None, skip_audio: bool = False, fast: bool = False, sentiment_dir: Optional[str] = None, offline_sentiment: bool = False) -> Dict[str, Any]:
	print("[STAGE] Collecting scores & analytics...")
	# Placeholder game scores – replace with real integrations later
	stroop_score = 0
	memory_game_score = 0
	matching_score = 0
	try:
		if skip_audio:
			print("[WARN] Skipping audio transcription as requested (--skip-audio).")
			transcription = {"text": "(Audio skipped by user)", "segments": []}
			speech_metrics = {}
		else:
			stt_kwargs = {}
			if audio_path:
				stt_kwargs["audio_path"] = audio_path
				print(f"[INFO] Using custom audio file: {audio_path}")
				if not os.path.exists(audio_path):
					print("[FATAL] Provided audio file does not exist. Please check path, spelling, quotes, or convert file. Aborting speech analysis.")
					raise FileNotFoundError(f"Audio file not found: {audio_path}")
			stt = SpeechToTextAnalyzer(**stt_kwargs)
			setup_info = stt.get_setup_info()
			print(f"[DEBUG] STT setup: {setup_info}")
			if not setup_info.get("ffmpeg_on_path"):
				print("[WARN] ffmpeg not detected on PATH; transcription may fail or hang.")
			stt_model = stt.ensure_model()
			audio_fp = stt.audio_path
			if os.path.exists(audio_fp):
				try:
					fsize = os.path.getsize(audio_fp) / 1024 / 1024
					print(f"[INFO] Audio file size: {fsize:.2f} MB")
				except OSError:
					pass
			print("[INFO] Starting Whisper transcription... (this can take time for long audio)")
			t0 = time.time()
			transcription = stt.transcribe(stt_model)
			t1 = time.time()
			print(f"[DONE] Transcription completed in {t1 - t0:.2f}s")
			segs = transcription.get("segments", [])
			print(f"[INFO] Segments captured: {len(segs)}")
			if segs:
				preview = " | ".join(seg.get("text", "").strip() for seg in segs[:2])
				print(f"[PREVIEW] {preview[:160]}")
			if fast and transcription.get("segments"):
				print("[FAST] Reducing transcript to first 3 segments for quicker iteration.")
				transcription["segments"] = transcription["segments"][:3]
				# Rebuild text from first 3 segments
				transcription["text"] = " ".join(seg.get("text", "") for seg in transcription["segments"])
			speech_metrics = stt.compute_metrics(transcription)
	except Exception as e:
		print(f"[ERROR] Speech analysis failed: {e}")
		transcription = {"text": ""}
		speech_metrics = {}

	try:
		if sentiment_dir:
			print(f"[SENTIMENT] Using custom sentiment dir: {sentiment_dir}")
		sentiment = SentimentAnalyzer(cache_dir=sentiment_dir, offline=offline_sentiment) if sentiment_dir else SentimentAnalyzer(offline=offline_sentiment)
		sent_model_tok, sent_model = sentiment.ensure_model()
		text_for_sent = transcription.get("text", "")
		sent_prediction = sentiment.predict(text_for_sent, sent_model_tok, sent_model)
	except Exception as e:
		print(f"[ERROR] Sentiment analysis failed: {e}")
		text_for_sent = transcription.get("text", "")
		sent_prediction = {}

	bundle = {
		"stroop_colour": stroop_score,
		"memory_game": memory_game_score,
		"matching_object_purpose": matching_score,
		"speech_metrics": speech_metrics,
		"sentiment": sent_prediction,
		"transcribed_text": text_for_sent,
	}
	print("[INFO] Score bundle prepared.")
	return bundle


def compute_cognitive_risk(scores: Dict[str, Any]) -> Dict[str, Any]:
	"""Heuristic dementia risk probability.

	This is NOT a diagnosis. It combines a few proxy indicators from speech & sentiment:
	- Higher pause density and filler frequency may correlate with executive/fluency issues.
	- Lower lexical diversity may indicate reduced vocabulary richness or retrieval difficulty.
	- Very negative sentiment weighting could reflect mood factors that can confound cognitive interpretation.

	Produces a probability (0-1) and categorical label.
	"""
	sm = scores.get("speech_metrics", {}) or {}
	sent = scores.get("sentiment", {}) or {}
	pause = float(sm.get("Pause density (%)", 0.0))
	filler_freq = float(sm.get("Filler frequency (%)", 0.0))
	lex_div = float(sm.get("Lexical diversity (%)", 0.0))
	fluency = float(sm.get("Speech fluency (words/sec)", 0.0))
	weighted_sent = float(sent.get("weighted_score", 50.0))  # 0-100

	# Normalize components into partial risk scores (0-1 bounds)
	# Empirical scaling choices (placeholder heuristics):
	r_pause = min(pause / 60.0, 1.0)          # 60% pause density => max risk component
	r_filler = min(filler_freq / 30.0, 1.0)    # 30% filler freq => max
	r_lex = 1.0 - min(lex_div / 70.0, 1.0)     # Lower diversity increases risk
	r_flu = 1.0 - min(fluency / 90.0, 1.0)     # Lower fluency value increases risk
	r_mood = 0.0
	if weighted_sent < 40:
		r_mood = 0.15
	elif weighted_sent < 55:
		r_mood = 0.05
	elif weighted_sent > 80:
		# Elevated positive affect alone not strongly protective; slight negative weight
		r_mood = -0.03

	raw = (0.25 * r_pause) + (0.2 * r_filler) + (0.25 * r_lex) + (0.25 * r_flu) + r_mood
	raw = max(0.0, min(raw, 1.0))
	if raw < 0.25:
		category = "low"
	elif raw < 0.45:
		category = "mild"
	elif raw < 0.65:
		category = "moderate"
	else:
		category = "elevated"
	return {
		"probability": round(raw, 3),
		"category": category,
		"factors": {
			"pause_density_pct": pause,
			"filler_frequency_pct": filler_freq,
			"lexical_diversity_pct": lex_div,
			"speech_fluency": fluency,
			"sentiment_weighted": weighted_sent,
		},
		"disclaimer": "Heuristic risk estimate only; not a medical diagnosis." 
	}


def build_doctor_prompt(scores: Dict[str, Any], disclaimer: str, risk: Dict[str, Any]) -> str:
	sm = scores["speech_metrics"]
	sent = scores["sentiment"]
	base = {
		"stroop_colour": scores["stroop_colour"],
		"memory_game": scores["memory_game"],
		"matching_object_purpose": scores["matching_object_purpose"],
		"speech": sm,
		"sentiment": sent,
		"heuristic_cognitive_risk": risk,
	}
	return (
		"You are to write a comprehensive cognitive assessment report. "
		"Use ONLY the JSON metrics provided (do not fabricate missing game scores). "
		"Explain methodology, interpretation, influencing factors (speech pauses, fillers, lexical diversity, sentiment), and recommendations. "
		"Include a dedicated 'Heuristic Cognitive Risk Assessment' section that: (a) restates the provided probability (0-1) and categorical label, (b) explains contributing factors, (c) clearly states this is NOT a diagnosis, only a screening signal. "
		"If additional up-to-date general cognitive health context is beneficial you may invoke the provided search tool.\n"
		f"Metrics JSON: {json.dumps(base, indent=2)}\n"
		f"Transcript (verbatim): {scores['transcribed_text'][:1200]}\n"
		f"Include this disclaimer exactly once at the end: {disclaimer}"
	)


def build_summary_prompt(doctor_report: str, disclaimer: str) -> str:
	return (
		"Summarize the following clinical-style report into: (1) concise paragraph, (2) bullet highlights, (3) next steps checklist. "
		"Preserve numeric values. Explicitly state the heuristic cognitive risk category & probability (do not re-calc). End with the disclaimer.\n" + doctor_report + "\nDISCLAIMER:" + disclaimer
	)


def build_email_prompt(summary: str, disclaimer: str) -> str:
	return (
		"Write a polite thank-you email to the user summarizing the assessment outcome. No diagnosis. Under 220 words. "
		"Reference major metrics (by descriptive names). End with the disclaimer.\n" + summary + "\nDISCLAIMER:" + disclaimer
	)


def generate_pdf(logo_path: str, title: str, doctor_report: str, output_path: str, disclaimer: str) -> str:
	pdf = FPDF()
	pdf.add_page()
	if os.path.exists(logo_path):
		pdf.image(logo_path, x=10, y=8, w=25)
	pdf.set_xy(40, 10)
	pdf.set_font("Helvetica", "B", 16)
	pdf.cell(0, 10, title, ln=1)
	pdf.set_font("Helvetica", size=11)
	pdf.ln(4)
	lines = doctor_report.splitlines()
	for line in lines:
		pdf.multi_cell(0, 6, line)
	pdf.ln(4)
	pdf.set_font("Helvetica", "I", 9)
	pdf.multi_cell(0, 5, disclaimer)
	pdf.output(output_path)
	return output_path


def run_pipeline(audio_path: Optional[str] = None, skip_audio: bool = False, fast: bool = False, sentiment_dir: Optional[str] = None, offline_sentiment: bool = False) -> Dict[str, Any]:
	print("[STAGE] Loading environment variables...")
	load_dotenv()
	cfg_path = os.path.join(os.path.dirname(__file__), "Agents", "agent.yaml")
	print(f"[STAGE] Loading agents config from {cfg_path}")
	agents_cfg = load_agents_config(cfg_path)
	disclaimer = agents_cfg.get("disclaimer_line", "")
	scores = collect_scores(audio_path=audio_path, skip_audio=skip_audio, fast=fast, sentiment_dir=sentiment_dir, offline_sentiment=offline_sentiment)

	# Prepare output directory
	output_dir = os.path.join(os.path.dirname(__file__), "output")
	os.makedirs(output_dir, exist_ok=True)
	print(f"[INFO] Output directory: {output_dir}")

	# Persist raw metrics for transparency
	metrics_path = os.path.join(output_dir, "metrics_latest.json")
	with open(metrics_path, "w", encoding="utf-8") as mf:
		json.dump(scores, mf, indent=2)
	print(f"[INFO] Metrics JSON saved -> {metrics_path}")

	search_tool = _init_search_tool()

	def _mk_agent(section: str, verbose: bool = False):
		spec = agents_cfg[section]
		llm_name = spec["llm"]
		print(f"[AGENT] Initializing {section} with model {llm_name}")
		llm = LLM(model=llm_name)
		kwargs = {}
		if search_tool:
			kwargs["tools"] = [search_tool]
		return Agent(
			role=spec["role"],
			goal=spec["goal"],
			backstory=spec["backstory"],
			llm=llm,
			verbose=verbose,
			**kwargs,
		)

	# Doctor report
	evaluator_agent = _mk_agent("clinical_evaluator", verbose=True)
	risk = compute_cognitive_risk(scores)
	doctor_task = Task(
		description=build_doctor_prompt(scores, disclaimer, risk),
		agent=evaluator_agent,
		expected_output=(
			"A detailed structured report with sections: Overview, Metrics Explanation, Speech Analysis, Sentiment Analysis, "
			"Heuristic Cognitive Risk Assessment, Integrated Interpretation, Recommendations, Disclaimer"
		),
	)
	print("[STAGE] Running clinical evaluator agent...")
	crew_doctor = Crew(agents=[evaluator_agent], tasks=[doctor_task])
	doctor_report = str(crew_doctor.kickoff())
	print("[DONE] Doctor report generated (length: %d chars)" % len(doctor_report))

	# Summary
	summary_agent = _mk_agent("summary_analyst")
	summary_task = Task(
		description=build_summary_prompt(doctor_report, disclaimer),
		agent=summary_agent,
		expected_output="Summary paragraph, bullet highlights, checklist, disclaimer",
	)
	print("[STAGE] Running summary agent...")
	summary_text = str(Crew(agents=[summary_agent], tasks=[summary_task]).kickoff())
	print("[DONE] Summary generated (length: %d chars)" % len(summary_text))

	# Email
	email_agent = _mk_agent("email_composer")
	email_task = Task(
		description=build_email_prompt(summary_text, disclaimer),
		agent=email_agent,
		expected_output="A concise, empathetic email with disclaimer",
	)
	print("[STAGE] Running email agent...")
	email_text = str(Crew(agents=[email_agent], tasks=[email_task]).kickoff())
	print("[DONE] Email text generated (length: %d chars)" % len(email_text))

	# Outputs
	timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
	pdf_path = os.path.join(output_dir, f"doctor_report_{timestamp}.pdf")
	summary_path = os.path.join(output_dir, f"summary_{timestamp}.txt")
	email_path = os.path.join(output_dir, f"email_{timestamp}.txt")

	generate_pdf(
		logo_path=os.path.join(os.path.dirname(__file__), "public", "logo.jpg"),
		title="Spark Mind", doctor_report=doctor_report, output_path=pdf_path, disclaimer=disclaimer,
	)
	with open(summary_path, "w", encoding="utf-8") as sf:
		sf.write(summary_text)
	with open(email_path, "w", encoding="utf-8") as ef:
		ef.write(email_text)

	print("[OUTPUT] PDF report ->", pdf_path)
	print("[OUTPUT] Summary text ->", summary_path)
	print("[OUTPUT] Email text ->", email_path)

	return {
		"scores": scores,
		"risk": risk,
		"doctor_report": doctor_report,
		"summary": summary_text,
		"email": email_text,
		"pdf_path": pdf_path,
		"summary_path": summary_path,
		"email_path": email_path,
		"metrics_path": metrics_path,
	}


if __name__ == "__main__":
	parser = argparse.ArgumentParser(description="Run Spark Mind cognitive assessment pipeline.")
	parser.add_argument("--audio", dest="audio", help="Path to audio file to transcribe", required=False)
	parser.add_argument("--skip-audio", action="store_true", help="Skip audio transcription (for debugging)")
	parser.add_argument("--fast", action="store_true", help="Fast mode: limit transcript to first 3 segments")
	parser.add_argument("--sentiment-dir", dest="sentiment_dir", help="Directory containing cached sentiment model", required=False)
	parser.add_argument("--offline-sentiment", action="store_true", help="Use heuristic fallback sentiment only (no downloads)")
	args = parser.parse_args()
	try:
		result = run_pipeline(audio_path=args.audio, skip_audio=args.skip_audio, fast=args.fast, sentiment_dir=args.sentiment_dir, offline_sentiment=args.offline_sentiment)
		print("[SUCCESS] Pipeline finished.")
	except Exception as exc:
		print(f"[FATAL] Pipeline failed: {exc}")
		raise
