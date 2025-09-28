"""
Early Spark AI Agent - Refactored with Class-Based Architecture

This module provides cognitive assessment capabilities using AI agents and fallback mechanisms.
The code has been refactored into logical classes for better maintainability and debugging:

Classes:
- SearchToolManager: Handles search tool initialization
- RetryManager: Manages retry logic with exponential backoff
- FallbackContentGenerator: Generates content when AI services fail
- ConfigManager: Manages configuration loading
- ScoreCollector: Handles audio processing and sentiment analysis
- PromptBuilder: Builds prompts for different AI agents
- PDFGenerator: Generates PDF reports with error handling
- AIAgentManager: Orchestrates AI agents and task execution

Main Function:
- run_pipeline(): Orchestrates the entire cognitive assessment process
"""

import os
import json
from datetime import datetime
from typing import Dict, Any, Optional
import time
import random

from dotenv import load_dotenv
from fpdf import FPDF
from crewai import LLM, Agent, Task, Crew
import yaml

from SpeechToText import SpeechToTextAnalyzer
from SentimentAnalyzer import SentimentAnalyzer


class SearchToolManager:
	"""Manages search tool initialization and configuration"""
	
	@staticmethod
	def initialize_search_tool():
		"""Initialize search tool if API key is available"""
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


class RetryManager:
	"""Handles retry logic with exponential backoff"""
	
	@staticmethod
	def retry_with_backoff(func, max_retries=3, base_delay=2, max_delay=60):
		"""Retry function with exponential backoff"""
		for attempt in range(max_retries):
			try:
				return func()
			except Exception as e:
				if attempt == max_retries - 1:
					raise e
				
				delay = min(base_delay * (2 ** attempt) + random.uniform(0, 1), max_delay)
				print(f"[RETRY] Attempt {attempt + 1} failed: {str(e)[:100]}... Retrying in {delay:.1f}s")
				time.sleep(delay)


class FallbackContentGenerator:
	"""Generates fallback content when AI services are unavailable"""
	
	@staticmethod
	def generate_doctor_report(scores: Dict[str, Any], disclaimer: str) -> str:
		"""Generate a fallback report when AI services are unavailable"""
		speech_metrics_list = scores.get("speech_metrics", [])
		sentiment_list = scores.get("sentiment", [])
		combined_sentiment = scores.get("combined_sentiment", {})
		transcriptions = scores.get("transcriptions", [])
		transcribed_text = scores.get("transcribed_text", "")
		
		report = f"""# COGNITIVE ASSESSMENT REPORT
**Generated on:** {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}
**Assessment Method:** Automated Cognitive Screening

## OVERVIEW
This automated cognitive assessment analyzed multiple cognitive domains including memory performance, attention control (Stroop test), visual recall, speech pattern analysis, and emotional sentiment indicators.

## ASSESSMENT METRICS

### Game-Based Assessments
- **Memory Game Score:** {scores.get('memory_game', 0)}
- **Stroop Color Test Score:** {scores.get('stroop_colour', 0)}
- **Image Recall Score:** {scores.get('image_recall', 0)}

### Speech Analysis Summary
- **Audio Files Processed:** {len(transcriptions)}
- **Total Speech Content:** {len(transcribed_text)} characters
- **Transcription Available:** {'Yes' if transcribed_text.strip() else 'No'}

### Speech Metrics Analysis
"""
		
		if speech_metrics_list:
			for i, metrics in enumerate(speech_metrics_list, 1):
				if metrics:
					report += f"\n**Audio File {i} Metrics:**\n"
					for key, value in metrics.items():
						if isinstance(value, (int, float)):
							report += f"- {key.replace('_', ' ').title()}: {value:.3f}\n"
						else:
							report += f"- {key.replace('_', ' ').title()}: {value}\n"
		else:
			report += "\nNo detailed speech metrics available.\n"
		
		report += "\n### Sentiment Analysis Summary\n"
		if sentiment_list:
			for i, sentiment in enumerate(sentiment_list, 1):
				if sentiment:
					report += f"\n**Audio File {i} Sentiment:**\n"
					for key, value in sentiment.items():
						if isinstance(value, (int, float)):
							report += f"- {key.replace('_', ' ').title()}: {value:.3f}\n"
						else:
							report += f"- {key.replace('_', ' ').title()}: {value}\n"
		else:
			report += "No detailed sentiment analysis available.\n"
		
		report += f"""\n## HEURISTIC COGNITIVE RISK ASSESSMENT

**Risk Category:** Preliminary Assessment Required
**Probability:** Not Available (AI services temporarily unavailable)

This automated screening provides initial cognitive performance indicators. The assessment captures multiple cognitive domains but requires professional clinical evaluation for definitive interpretation.

**Contributing Factors:**
- Game-based cognitive performance scores
- Speech pattern analysis (when available)
- Emotional indicators from speech content

**Important Note:** This is NOT a medical diagnosis, only a preliminary screening tool. Professional medical evaluation is recommended regardless of results.

## RECOMMENDATIONS

1. **Immediate Steps:**
   - Review results with a healthcare provider
   - Discuss any concerns about memory or cognitive function
   - Consider comprehensive neuropsychological evaluation if indicated

2. **General Cognitive Health:**
   - Maintain regular physical exercise
   - Engage in mentally stimulating activities
   - Ensure adequate sleep and nutrition
   - Manage stress and maintain social connections

3. **Follow-up:**
   - Schedule regular check-ups with healthcare provider
   - Monitor for any changes in cognitive function
   - Consider repeat assessment in 6-12 months

## TRANSCRIPT EXCERPT
{transcribed_text[:500]}{'...' if len(transcribed_text) > 500 else ''}

---
{disclaimer}"""
		
		return report
	
	@staticmethod
	def generate_summary(doctor_report: str, disclaimer: str) -> str:
		"""Generate a fallback summary when AI services are unavailable"""
		return f"""## ASSESSMENT SUMMARY

**Cognitive Screening Completed:** Preliminary automated assessment has been conducted across multiple cognitive domains.

**Key Highlights:**
• Multi-domain cognitive assessment completed
• Speech pattern analysis performed (when audio provided)
• Emotional indicators evaluated
• Baseline cognitive performance metrics captured

**Next Steps Checklist:**
☐ Schedule consultation with healthcare provider
☐ Discuss assessment results and any cognitive concerns
☐ Consider comprehensive neuropsychological evaluation if recommended
☐ Implement cognitive health maintenance strategies
☐ Plan follow-up assessment in 6-12 months

**Overall Assessment:** Preliminary screening completed - Professional medical evaluation recommended for comprehensive interpretation.

{disclaimer}"""
	
	@staticmethod
	def generate_email(summary: str, disclaimer: str) -> str:
		"""Generate a fallback email when AI services are unavailable"""
		return f"""Dear Valued User,

Thank you for completing the Early Spark cognitive assessment. Your comprehensive screening has been successfully processed, analyzing multiple cognitive domains including memory performance, attention control, and speech patterns.

Your assessment results are now available for review. While our advanced AI analysis services experienced temporary availability issues, we've ensured your core assessment data has been safely processed and preserved.

Key assessment areas covered:
• Memory game performance
• Stroop color test results  
• Visual recall capabilities
• Speech pattern analysis
• Emotional sentiment indicators

We recommend discussing these results with your healthcare provider for professional interpretation and guidance on next steps.

Thank you for choosing Early Spark for your cognitive health screening.

Best regards,
The Early Spark Team

{disclaimer}"""


class ConfigManager:
	"""Manages configuration loading and validation"""
	
	@staticmethod
	def load_agents_config(path: str) -> Dict[str, Any]:
		"""Load agent configuration from YAML file"""
		with open(path, "r", encoding="utf-8") as f:
			return yaml.safe_load(f)


class ScoreCollector:
	"""Handles audio processing, transcription, and sentiment analysis"""
	
	@staticmethod
	def collect_scores(audio_path: list[str] = [], sentiment_dir: Optional[str] = None, offline_sentiment: bool = False) -> Dict[str, Any]:
		"""Collect scores from audio files and sentiment analysis"""
		print("[STAGE] Collecting scores & analytics...")
		#! Change it to 0, for testing purposes the values are updated
		stroop_score = 10
		memory_game_score = 30
		image_recall = 1
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

class PromptBuilder:
	"""Builds prompts for different AI agents"""
	
	@staticmethod
	def build_doctor_prompt(scores: Dict[str, Any], disclaimer: str) -> str:
		"""Build prompt for clinical evaluator agent"""
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
			"Include a dedicated 'Heuristic Cognitive Risk Assessment' section that: (a) restates the provided probability (0-1) and categorical label, (b) explains contributing factors, (c) clearly states this is NOT a diagnosis, only a screening signal. "
			"If additional up-to-date general cognitive health context is beneficial you may invoke the provided search tool.\n"
			f"Metrics JSON: {json.dumps(base, indent=2)}\n"
			f"Transcript (verbatim): {scores['transcribed_text'][:1200]}\n"
			f"Include this disclaimer exactly once at the end: {disclaimer}"
		)
	
	@staticmethod
	def build_summary_prompt(doctor_report: str, disclaimer: str) -> str:
		"""Build prompt for summary analyst agent"""
		return (
			"Summarize the following clinical-style report into: (1) concise paragraph, (2) bullet highlights, (3) next steps checklist. (4) One word report summary explaining overall cognitive risk level (Low, Mild, Moderate, Elevated). "
			"Preserve numeric values. Explicitly state the heuristic cognitive risk category & probability (do not re-calc). End with the disclaimer.\n" + doctor_report + "\nDISCLAIMER:" + disclaimer
		)
	
	@staticmethod
	def build_email_prompt(summary: str, disclaimer: str) -> str:
		"""Build prompt for email composer agent"""
		return (
			"Write a polite thank-you email to the user summarizing the assessment outcome. No diagnosis. Under 220 words. "
			"Reference major metrics (by descriptive names). End with the disclaimer.\n" + summary + "\nDISCLAIMER:" + disclaimer
		)


class PDFGenerator:
	"""Handles PDF generation with error handling"""
	
	@staticmethod
	def generate_pdf(logo_path: str, title: str, doctor_report: str, output_path: str, disclaimer: str) -> str:
		"""Generate PDF report with improved error handling and text formatting"""
		try:
			pdf = FPDF()
			pdf.add_page()
			
			if os.path.exists(logo_path):
				try:
					pdf.image(logo_path, x=10, y=8, w=25)
				except Exception as e:
					print(f"[WARN] Could not add logo: {e}")
			pdf.set_xy(40, 10)
			pdf.set_font("Helvetica", "B", 16)
			pdf.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
			pdf.set_font("Helvetica", size=10) 
			pdf.ln(4)
			lines = doctor_report.replace('\r\n', '\n').replace('\r', '\n').splitlines()
			
			for line in lines:
				if not line.strip():
					pdf.ln(3)
					continue
				if line.startswith('# '):
					pdf.set_font("Helvetica", "B", 14)
					clean_line = line[2:].strip()
				elif line.startswith('## '):
					pdf.set_font("Helvetica", "B", 12)
					clean_line = line[3:].strip()
				elif line.startswith('**') and line.endswith('**'):
					pdf.set_font("Helvetica", "B", 10)
					clean_line = line[2:-2].strip()
				else:
					pdf.set_font("Helvetica", size=10)
					clean_line = line.strip()
				
				# Remove problematic characters and limit line length
				clean_line = clean_line.encode('latin-1', 'ignore').decode('latin-1')
				
				# Split very long lines
				max_chars = 90  # Approximate max characters per line
				if len(clean_line) > max_chars:
					words = clean_line.split(' ')
					current_line = ""
					
					for word in words:
						if len(current_line + word + " ") <= max_chars:
							current_line += word + " "
						else:
							if current_line.strip():
								try:
									pdf.multi_cell(0, 5, current_line.strip())
								except Exception as e:
									print(f"[WARN] Skipping problematic line: {e}")
							current_line = word + " "
					
					# Add remaining text
					if current_line.strip():
						try:
							pdf.multi_cell(0, 5, current_line.strip())
						except Exception as e:
							print(f"[WARN] Skipping final line segment: {e}")
				else:
					try:
						pdf.multi_cell(0, 5, clean_line)
					except Exception as e:
						print(f"[WARN] Skipping line due to formatting issue: {e}")
			
			# Disclaimer
			pdf.ln(4)
			pdf.set_font("Helvetica", "I", 9)
			disclaimer_clean = disclaimer.encode('latin-1', 'ignore').decode('latin-1')
			try:
				pdf.multi_cell(0, 4, disclaimer_clean)
			except Exception as e:
				print(f"[WARN] Could not add disclaimer: {e}")
			
			pdf.output(output_path)
			print(f"[SUCCESS] PDF generated: {output_path}")
			return output_path
			
		except Exception as e:
			print(f"[ERROR] PDF generation failed: {e}")
			# Create a simple fallback PDF
			try:
				pdf = FPDF()
				pdf.add_page()
				pdf.set_font("Helvetica", size=12)
				pdf.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
				pdf.ln(10)
				pdf.multi_cell(0, 8, "Assessment completed successfully. Full report generation encountered formatting issues. Please contact support for assistance.")
				pdf.output(output_path)
				print(f"[SUCCESS] Fallback PDF generated: {output_path}")
				return output_path
			except Exception as fallback_error:
				print(f"[FATAL] Even fallback PDF failed: {fallback_error}")
				# Create empty file to prevent further errors
				with open(output_path, 'w') as f:
					f.write("PDF generation failed")
				return output_path


class AIAgentManager:
	"""Manages AI agents and task execution"""
	
	def __init__(self, agents_config: Dict[str, Any], search_tool=None):
		self.agents_config = agents_config
		self.search_tool = search_tool
	
	def _create_agent(self, section: str, verbose: bool = False):
		"""Create an AI agent based on configuration"""
		spec = self.agents_config[section]
		llm_name = spec["llm"]
		print(f"[AGENT] Initializing {section} with model {llm_name}")
		llm = LLM(model=llm_name)
		kwargs = {}
		if self.search_tool:
			kwargs["tools"] = [self.search_tool]
		return Agent(
			role=spec["role"],
			goal=spec["goal"],
			backstory=spec["backstory"],
			llm=llm,
			verbose=verbose,
			**kwargs,
		)
	
	def generate_doctor_report(self, scores: Dict[str, Any], disclaimer: str) -> str:
		"""Generate doctor report using AI agent"""
		def run_doctor_analysis():
			evaluator_agent = self._create_agent("clinical_evaluator", verbose=True)
			doctor_task = Task(
				description=PromptBuilder.build_doctor_prompt(scores, disclaimer),
				agent=evaluator_agent,
				expected_output=(
					"A detailed structured report with sections: Overview, Metrics Explanation, Memory game Analysis, Image recall, Stroop color, Speech Analysis and Sentiment Analysis, "
					"Heuristic Cognitive Risk Assessment, Integrated Interpretation, Recommendations, Disclaimer"
				),
			)
			print("[STAGE] Running clinical evaluator agent...")
			crew_doctor = Crew(agents=[evaluator_agent], tasks=[doctor_task])
			return str(crew_doctor.kickoff())
		
		result = RetryManager.retry_with_backoff(run_doctor_analysis, max_retries=3)
		return result if result is not None else FallbackContentGenerator.generate_doctor_report(scores, disclaimer)
	
	def generate_summary(self, doctor_report: str, disclaimer: str) -> str:
		"""Generate summary using AI agent"""
		def run_summary_analysis():
			summary_agent = self._create_agent("summary_analyst")
			summary_task = Task(
				description=PromptBuilder.build_summary_prompt(doctor_report, disclaimer),
				agent=summary_agent,
				expected_output="Summary paragraph, bullet highlights, checklist, disclaimer",
			)
			print("[STAGE] Running summary agent...")
			return str(Crew(agents=[summary_agent], tasks=[summary_task]).kickoff())
		
		result = RetryManager.retry_with_backoff(run_summary_analysis, max_retries=2)
		return result if result is not None else FallbackContentGenerator.generate_summary(disclaimer, disclaimer)
	
	def generate_email(self, summary_text: str, disclaimer: str) -> str:
		"""Generate email using AI agent"""
		def run_email_analysis():
			email_agent = self._create_agent("email_composer")
			email_task = Task(
				description=PromptBuilder.build_email_prompt(summary_text, disclaimer),
				agent=email_agent,
				expected_output="A concise, empathetic email with disclaimer",
			)
			print("[STAGE] Running email agent...")
			return str(Crew(agents=[email_agent], tasks=[email_task]).kickoff())
		
		result = RetryManager.retry_with_backoff(run_email_analysis, max_retries=2)
		return result if result is not None else FallbackContentGenerator.generate_email(summary_text, disclaimer)


def run_pipeline(audio_path: list[str], sentiment_dir: Optional[str] = None, offline_sentiment: bool = False) -> Dict[str, Any]:
	print("[STAGE] Loading environment variables...")
	load_dotenv()
	cfg_path = os.path.join(os.path.dirname(__file__), "Agents", "agent.yaml")
	print(f"[STAGE] Loading agents config from {cfg_path}")
	agents_cfg = ConfigManager.load_agents_config(cfg_path)
	disclaimer = agents_cfg.get("disclaimer_line", "")
	scores = ScoreCollector.collect_scores(audio_path=audio_path, sentiment_dir=sentiment_dir, offline_sentiment=offline_sentiment)

	output_dir = os.path.join(os.path.dirname(__file__), "output")
	os.makedirs(output_dir, exist_ok=True)
	print(f"[INFO] Output directory: {output_dir}")

	metrics_path = os.path.join(output_dir, "metrics_latest.json")
	with open(metrics_path, "w", encoding="utf-8") as mf:
		json.dump(scores, mf, indent=2)
	print(f"[INFO] Metrics JSON saved -> {metrics_path}")

	search_tool = SearchToolManager.initialize_search_tool()
	use_fallback = False
	
	# Initialize AI Agent Manager
	agent_manager = AIAgentManager(agents_cfg, search_tool)
	
	doctor_report = ""
	summary_text = ""
	email_text = ""

	# Generate doctor report
	try:
		doctor_report = agent_manager.generate_doctor_report(scores, disclaimer)
		if doctor_report:
			print("[DONE] Doctor report generated (length: %d chars)" % len(doctor_report))
		else:
			print("[WARN] Doctor report generation returned empty result")
			doctor_report = FallbackContentGenerator.generate_doctor_report(scores, disclaimer)
			use_fallback = True
		
	except Exception as e:
		print(f"[WARN] AI doctor report generation failed after retries: {str(e)[:200]}...")
		print("[INFO] Using fallback doctor report generation")
		doctor_report = FallbackContentGenerator.generate_doctor_report(scores, disclaimer)
		use_fallback = True

	# Generate summary
	try:
		if not use_fallback and doctor_report:
			summary_text = agent_manager.generate_summary(doctor_report, disclaimer)
			if summary_text:
				print("[DONE] Summary generated (length: %d chars)" % len(summary_text))
			else:
				print("[WARN] Summary generation returned empty result")
				raise Exception("Empty summary result")
		else:
			raise Exception("Using fallback mode")
		
	except Exception as e:
		print(f"[WARN] AI summary generation failed: {str(e)[:100]}...")
		print("[INFO] Using fallback summary generation")
		if doctor_report:
			summary_text = FallbackContentGenerator.generate_summary(doctor_report, disclaimer)
		else:
			summary_text = FallbackContentGenerator.generate_summary("Assessment completed with limited data", disclaimer)
		use_fallback = True

	# Generate email
	try:
		if not use_fallback and summary_text:
			email_text = agent_manager.generate_email(summary_text, disclaimer)
			if email_text:
				print("[DONE] Email text generated (length: %d chars)" % len(email_text))
			else:
				print("[WARN] Email generation returned empty result")
				raise Exception("Empty email result")
		else:
			raise Exception("Using fallback mode")
		
	except Exception as e:
		print(f"[WARN] AI email generation failed: {str(e)[:100]}...")
		print("[INFO] Using fallback email generation")
		if summary_text:
			email_text = FallbackContentGenerator.generate_email(summary_text, disclaimer)
		else:
			email_text = FallbackContentGenerator.generate_email("Assessment completed successfully.", disclaimer)
		use_fallback = True

	timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
	pdf_path = os.path.join(output_dir, f"doctor_report_{timestamp}.pdf")
	summary_path = os.path.join(output_dir, f"summary_{timestamp}.txt")
	email_path = os.path.join(output_dir, f"email_{timestamp}.txt")

	PDFGenerator.generate_pdf(
		logo_path=os.path.join(os.path.dirname(__file__), "public", "logo.jpg"),
		title="Early Spark", doctor_report=doctor_report or "Report generation failed", output_path=pdf_path, disclaimer=disclaimer,
	)
	with open(summary_path, "w", encoding="utf-8") as sf:
		sf.write(summary_text or "Summary generation failed")
	with open(email_path, "w", encoding="utf-8") as ef:
		ef.write(email_text or "Email generation failed")

	print("[OUTPUT] PDF report ->", pdf_path)
	print("[OUTPUT] Summary text ->", summary_path)
	print("[OUTPUT] Email text ->", email_path)

	if use_fallback:
		print("[INFO] Assessment completed using fallback mode due to AI service unavailability")
	
	return {
		"scores": scores,
		"doctor_report": doctor_report,
		"summary": summary_text,
		"email": email_text,
		"pdf_path": pdf_path,
		"summary_path": summary_path,
		"email_path": email_path,
		"metrics_path": metrics_path,
		"fallback_mode": use_fallback,
		"ai_service_status": "unavailable" if use_fallback else "available"
	}


if __name__ == "__main__":
	audio_path:list[str] = ["D:/Early Spark/backend/audio/audio.mp3", "D:/Early Spark/backend/audio/audio2.mp3", "D:/Early Spark/backend/audio/speech.webm"]
	sentiment_dir:str = "D:/Models/Sentiment"
	try:
		result = run_pipeline(audio_path, sentiment_dir, offline_sentiment=False)
		print("[SUCCESS] Pipeline finished.")
	except Exception as exc:
		print(f"[FATAL] Pipeline failed: {exc}")
		raise
