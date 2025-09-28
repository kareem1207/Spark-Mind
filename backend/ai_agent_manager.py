from typing import Dict, Any
from crewai import LLM, Agent, Task, Crew

from retry_manager import RetryManager
from prompt_builder import PromptBuilder


class AIAgentManager:
	
	def __init__(self, agents_config: Dict[str, Any], search_tool=None):
		self.agents_config = agents_config
		self.search_tool = search_tool
	
	def _create_agent(self, section: str, verbose: bool = False):
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
	

    #TODO: Fix it
	def generate_doctor_report(self, scores: Dict[str, Any], disclaimer: str) -> str:
		def run_doctor_analysis() -> str:
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
		if result is None:
			raise Exception("Doctor report generation failed after all retries")
		return str(result)
	
	def generate_summary(self, doctor_report: str, disclaimer: str) -> str:
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
		if result is None:
			raise Exception("Summary generation failed after all retries")
		return str(result)
	
	def generate_email(self, summary_text: str, disclaimer: str) -> str:
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
		if result is None:
			raise Exception("Email generation failed after all retries")
		return str(result)