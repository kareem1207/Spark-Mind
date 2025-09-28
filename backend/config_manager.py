import yaml
from typing import Dict, Any


class ConfigManager:
	@staticmethod
	def load_agents_config(path: str) -> Dict[str, Any]:
		with open(path, "r", encoding="utf-8") as f:
			return yaml.safe_load(f)