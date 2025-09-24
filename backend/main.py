import os
import shutil
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

from AiAgent import run_pipeline

app = FastAPI(title="Spark Mind Cognitive Assessment API", version="0.1.0")

origins = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	os.getenv("FRONTEND_ORIGIN", "*")
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)


class GameScores(BaseModel):
	stroop_colour: float = 0
	memory_game: float = 0
	matching_object_purpose: float = 0


class AssessmentRequest(BaseModel):
	scores: GameScores = Field(default_factory=GameScores)
	skip_audio: bool = True
	fast: bool = False
	offline_sentiment: bool = False


@app.get("/api/health")
def health():
	return {"status": "ok"}


@app.post("/api/assessment")
async def create_assessment(payload: AssessmentRequest):
	# Currently game scores inside AiAgent are placeholder; we could patch them post-call
	result = run_pipeline(skip_audio=payload.skip_audio, fast=payload.fast, offline_sentiment=payload.offline_sentiment)
	# Override placeholder scores with provided ones for transparency
	result["scores"].update({
		"stroop_colour": payload.scores.stroop_colour,
		"memory_game": payload.scores.memory_game,
		"matching_object_purpose": payload.scores.matching_object_purpose,
	})
	# Persist merged metrics
	metrics_path = os.path.join(OUTPUT_DIR, "metrics_latest.json")
	try:
		import json
		with open(metrics_path, "w", encoding="utf-8") as f:
			json.dump(result, f, indent=2)
	except Exception:
		pass
	return {
		"risk": result.get("risk"),
		"pdf": os.path.basename(result.get("pdf_path")),
		"summary": result.get("summary"),
		"scores": result.get("scores"),
	}


@app.post("/api/assessment/speech")
async def create_speech_assessment(
	audio: UploadFile = File(...),
	stroop_colour: float = Form(0),
	memory_game: float = Form(0),
	matching_object_purpose: float = Form(0),
	fast: bool = Form(False),
	offline_sentiment: bool = Form(False),
):
	# Save uploaded audio to temp file inside backend/audio
	audio_dir = os.path.join(os.path.dirname(__file__), 'audio')
	os.makedirs(audio_dir, exist_ok=True)
	target_path = os.path.join(audio_dir, audio.filename)
	with open(target_path, 'wb') as f:
		shutil.copyfileobj(audio.file, f)

	result = run_pipeline(audio_path=target_path, skip_audio=False, fast=fast, offline_sentiment=offline_sentiment)
	result["scores"].update({
		"stroop_colour": stroop_colour,
		"memory_game": memory_game,
		"matching_object_purpose": matching_object_purpose,
	})
	return {
		"risk": result.get("risk"),
		"pdf": os.path.basename(result.get("pdf_path")),
		"summary": result.get("summary"),
		"scores": result.get("scores"),
		"audio_file": os.path.basename(target_path),
	}


@app.get("/api/assessment/latest")
def latest_assessment():
	# Find latest doctor_report_*.pdf
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
	return FileResponse(file_path, media_type="application/pdf")


if __name__ == "__main__":
	import uvicorn
	uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
