import os
import json
from datetime import datetime
from typing import Dict, Any, Optional

from dotenv import load_dotenv

from search_tool_manager import SearchToolManager
from config_manager import ConfigManager
from score_collector import ScoreCollector
from pdf_generator import PDFGenerator
from ai_agent_manager import AIAgentManager


def run_pipeline(scores: dict[str, int], audio_path: list[str], sentiment_dir: Optional[str] = None, offline_sentiment: bool = False) -> Dict[str, Any]:
	print("[STAGE] Loading environment variables...")
	load_dotenv()
	cfg_path = os.path.join(os.path.dirname(__file__), "Agents", "agent.yaml")
	print(f"[STAGE] Loading agents config from {cfg_path}")
	agents_cfg = ConfigManager.load_agents_config(cfg_path)
	disclaimer = agents_cfg.get("disclaimer_line", "")
	scores = ScoreCollector.collect_scores(scores,audio_path=audio_path, sentiment_dir=sentiment_dir, offline_sentiment=offline_sentiment)

	output_dir = os.path.join(os.path.dirname(__file__), "output")
	os.makedirs(output_dir, exist_ok=True)
	print(f"[INFO] Output directory: {output_dir}")

	metrics_path = os.path.join(output_dir, "metrics_latest.json")
	with open(metrics_path, "w", encoding="utf-8") as mf:
		json.dump(scores, mf, indent=2)
	print(f"[INFO] Metrics JSON saved -> {metrics_path}")

	search_tool = SearchToolManager.initialize_search_tool()
	agent_manager = AIAgentManager(agents_cfg, search_tool)
	
	print("[STAGE] Generating doctor report...")
	doctor_report = agent_manager.generate_doctor_report(scores, disclaimer)
	print(f"[DONE] Doctor report generated (length: {len(doctor_report)} chars)")
	
	print("[STAGE] Generating summary...")
	summary_text = agent_manager.generate_summary(doctor_report, disclaimer)
	print(f"[DONE] Summary generated (length: {len(summary_text)} chars)")
	
	print("[STAGE] Generating email...")
	email_text = agent_manager.generate_email(summary_text, disclaimer)
	print(f"[DONE] Email text generated (length: {len(email_text)} chars)")

	timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
	pdf_path = os.path.join(output_dir, f"doctor_report_{timestamp}.pdf")
	summary_path = os.path.join(output_dir, f"summary_{timestamp}.txt")
	email_path = os.path.join(output_dir, f"email_{timestamp}.txt")

	print("[STAGE] Generating PDF...")
	PDFGenerator.generate_pdf(
		logo_path=os.path.join(os.path.dirname(__file__), "public", "logo.jpg"),
		title="Early Spark", 
		doctor_report=doctor_report, 
		output_path=pdf_path, 
		disclaimer=disclaimer,
	)
	
	print("[STAGE] Saving text outputs...")
	with open(summary_path, "w", encoding="utf-8") as sf:
		sf.write(summary_text)
	with open(email_path, "w", encoding="utf-8") as ef:
		ef.write(email_text)

	print("[OUTPUT] PDF report ->", pdf_path)
	print("[OUTPUT] Summary text ->", summary_path)
	print("[OUTPUT] Email text ->", email_path)
	
	return {
		"scores": scores,
		"doctor_report": doctor_report,
		"summary": summary_text,
		"email": email_text,
		"pdf_path": pdf_path,
		"summary_path": summary_path,
		"email_path": email_path,
		"metrics_path": metrics_path,
		"ai_service_status": "available"
	}


if __name__ == "__main__":
	audio_path: list[str] = ["D:/Early Spark/backend/uploads/audio_q1.webm", "D:/Early Spark/backend/uploads/audio_q2.webm", "D:/Early Spark/backend/uploads/audio_q3.webm","D:/Early Spark/backend/uploads/audio_q4.webm"]
	sentiment_dir: str = "D:/Models/Sentiment"
	try:
		scores: dict[str, int] = {
			"stroop_colour": 30,
			"memory_game": 33,
			"image_recall": 1,
		}
		result = run_pipeline(scores=scores, audio_path=audio_path, sentiment_dir=sentiment_dir, offline_sentiment=False)
		print("[SUCCESS] Pipeline finished.")
	except Exception as exc:
		print(f"[FATAL] Pipeline failed: {exc}")
		raise