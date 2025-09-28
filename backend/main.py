import os
import shutil
import json
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from fastapi import Request
import time

from AiAgent import run_pipeline

load_dotenv()

app = FastAPI(title="Early Spark Cognitive Assessment API", version="0.1.0")

origins = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	"http://localhost:3001", 
	"http://127.0.0.1:3001",
	os.getenv("FRONTEND_ORIGIN", "*")
]

SERVER_HOST = os.getenv("SERVER_HOST", "127.0.0.1")
SERVER_PORT = int(os.getenv("SERVER_PORT", "8000"))
SUMMARY_FILE_PATH = os.getenv("SUMMARY_FILE_PATH", "backend/output/summary_20250924_041735.txt")
UPLOADS_DIR = os.getenv("UPLOADS_DIR", "uploads")

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    print(f"🌐 {request.method} {request.url}")
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"✅ Response: {response.status_code} (took {process_time:.2f}s)")
    return response

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)


class GameScores(BaseModel):
	stroop_colour: float = 0
	memory_game: float = 0
	image_recall: float = 0


class AssessmentRequest(BaseModel):
	scores: GameScores = Field(default_factory=GameScores)
	skip_audio: bool = True
	fast: bool = False
	offline_sentiment: bool = False


@app.get("/api/health")
def health():
	return {"status": "ok"}

@app.post("/api/submit-tests")
async def submit_tests(
	memory_score: int = Form(...),
	stroop_score: int = Form(...), 
	image_recall_score: int = Form(...),
	audio_q1: Optional[UploadFile] = File(None),
	audio_q2: Optional[UploadFile] = File(None),
	audio_q3: Optional[UploadFile] = File(None),
	audio_q4: Optional[UploadFile] = File(None)
):
	try:
		print(f"🔥 Backend /api/submit-tests endpoint hit!")
		print(f"Received scores - Memory: {memory_score}, Stroop: {stroop_score}, Image Recall: {image_recall_score}")
		if memory_score is None or stroop_score is None or image_recall_score is None:
			raise HTTPException(status_code=400, detail="All numeric scores (memory_score, stroop_score, image_recall_score) are required")
		
		uploads_path = os.path.join(os.path.dirname(__file__), UPLOADS_DIR)
		os.makedirs(uploads_path, exist_ok=True)
		
		audio_files = []
		audio_uploads = [
			("audio_q1", audio_q1),
			("audio_q2", audio_q2), 
			("audio_q3", audio_q3),
			("audio_q4", audio_q4)
		]
		
		for _, audio_file in audio_uploads:
			if audio_file and audio_file.filename:
				file_path = os.path.join(uploads_path, audio_file.filename)
				with open(file_path, "wb") as buffer:
					shutil.copyfileobj(audio_file.file, buffer)
				audio_files.append(audio_file.filename)
				print(f"Saved audio file: {audio_file.filename}")

		audio_file_paths: list[str] = []
		if audio_files:
			for filename in audio_files:
				file_path = os.path.join(uploads_path, filename)
				audio_file_paths.append(file_path)
				print(f"Prepared audio file for AI analysis: {file_path}")

		print("🤖 Running AI analysis pipeline...")
		ai_result = {}
		try:
			if not audio_files:
				raise ValueError("Audio files are required for cognitive assessment")
			scores: dict[str, int] = {
				"stroop_colour": stroop_score,
				"memory_game": memory_score,
				"image_recall": image_recall_score,
			}
			ai_result = run_pipeline(
				sentiment_dir="D:/Models/Sentiment",
				scores=scores,
				audio_path=audio_file_paths,
				offline_sentiment=False
			)
			
			
			print("✅ AI analysis completed successfully")
			print(f"Generated files: PDF={os.path.basename(ai_result.get('pdf_path', 'none'))}")
			
		except Exception as ai_error:
			print(f"❌ AI analysis failed: {str(ai_error)}")
		response_data = {
			"memory_score": memory_score,
			"stroop_score": stroop_score,
			"image_recall_score": image_recall_score,
			"audio_files": audio_files,
			"summary_report": ai_result.get("summary", "Analysis completed"),
			"doctor_report": ai_result.get("doctor_report", "Report generated"),
			"email_content": ai_result.get("email", "Assessment completed"),
			"cognitive_risk": ai_result.get("risk", {"category": "unknown", "probability": 0.0}),
			"pdf_filename": os.path.basename(ai_result.get("pdf_path", "")) if ai_result.get("pdf_path") else None,
			"all_scores": ai_result.get("scores", {}),
			"status": "completed",
			"ai_analysis_success": "ai_error" not in ai_result,
			"ai_error": ai_result.get("ai_error", None),
			"fallback_mode": ai_result.get("fallback_mode", False),
			"ai_service_status": ai_result.get("ai_service_status", "unknown")
		}
		
		print(f"Assessment submission completed successfully. Audio files: {len(audio_files)}")
		return response_data
		
	except Exception as e:
		print(f"Unexpected error in submit_tests: {str(e)}")
		raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/api/assessment")
async def create_assessment(payload: AssessmentRequest):
	raise HTTPException(status_code=400, detail="Audio files are required for cognitive assessment. Use /api/submit-tests endpoint instead.")


@app.post("/api/assessment/speech")
async def create_speech_assessment(
	audio: UploadFile = File(...),
	stroop_colour: int = Form(0),
	memory_game: int = Form(0),
	image_recall: int = Form(0),
	offline_sentiment: bool = Form(False),
):
	scores: dict[str, int] = {
		"stroop_colour": stroop_colour,
		"memory_game": memory_game,
		"image_recall": image_recall,
	}
	audio_dir = os.path.join(os.path.dirname(__file__), 'uploads')
	os.makedirs(audio_dir, exist_ok=True)
	if not audio.filename:
		raise HTTPException(status_code=400, detail="Audio file must have a filename.")
	target_path:list[str] = []
	for existing_file in os.listdir(audio_dir):
		target_path.append(os.path.join(audio_dir, existing_file))
		try:
			if os.path.isfile(existing_file):
				os.remove(existing_file)
		except Exception as e:
			print(f"Error deleting file {existing_file}: {e}")

	result = run_pipeline(scores=scores, sentiment_dir="D:/Models/Sentiment", audio_path=target_path, offline_sentiment=offline_sentiment)
	return {
		"summary": result.get("summary"),
		"scores": result.get("scores"),
		"audio_file": os.path.basename(target_path[0]) if target_path else None,
	}


@app.get("/api/assessment/latest")
def latest_assessment():
	pdf_files = [f for f in os.listdir(OUTPUT_DIR) if f.startswith("doctor_report_") and f.endswith('.pdf')]
	if not pdf_files:
		return JSONResponse(status_code=404, content={"detail": "No assessments found"})
	pdf_files.sort(reverse=True)
	latest_pdf = pdf_files[0]
	return {"pdf": latest_pdf}


@app.get("/api/reports/{filename}")
def get_report(filename: str):
	file_path = os.path.join(OUTPUT_DIR, filename)
	if not os.path.isfile(file_path):
		return JSONResponse(status_code=404, content={"detail": "File not found"})
	return FileResponse(file_path, media_type="application/pdf", filename=filename)


if __name__ == "__main__":
	import uvicorn
	uvicorn.run("main:app", host=SERVER_HOST, port=SERVER_PORT, reload=True)
