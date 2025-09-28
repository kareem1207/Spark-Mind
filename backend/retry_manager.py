import time
import random


class RetryManager:
	
	@staticmethod
	def retry_with_backoff(func, max_retries=3, base_delay=2, max_delay=60):
		for attempt in range(max_retries):
			try:
				return func()
			except Exception as e:
				if attempt == max_retries - 1:
					raise e
				
				delay = min(base_delay * (2 ** attempt) + random.uniform(0, 1), max_delay)
				print(f"[RETRY] Attempt {attempt + 1} failed: {str(e)[:100]}... Retrying in {delay:.1f}s")
				time.sleep(delay)