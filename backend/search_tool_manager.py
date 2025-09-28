import os


class SearchToolManager:
	@staticmethod
	def initialize_search_tool():
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