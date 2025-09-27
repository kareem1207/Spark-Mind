# FastAPI Backend - Submit Tests Endpoint

## Overview
The `/submit-tests` endpoint accepts dementia assessment results from the frontend and processes them according to the requirements.

## Endpoint Details

**URL:** `POST /submit-tests`  
**Content-Type:** `multipart/form-data`

### Required Fields
- `memory_score` (int): Score from memory test
- `stroop_score` (int): Score from Stroop color test  
- `image_recall_score` (int): Score from image recall test

### Optional Fields
- `audio_q1` (file): Audio file for question 1
- `audio_q2` (file): Audio file for question 2
- `audio_q3` (file): Audio file for question 3
- `audio_q4` (file): Audio file for question 4

### Response Format
```json
{
  "memory_score": 85,
  "stroop_score": 92,
  "image_recall_score": 78,
  "audio_files": ["question1.mp3", "question2.mp3"],
  "summary_report": "This cognitive assessment reveals...",
  "status": "completed",
  "evaluation": {
    "evaluation_complete": true,
    "processed_audio_files": 2,
    "total_score": 255
  }
}
```

### Error Responses

#### 400 Bad Request
- Missing required numeric scores
- Invalid form data format

#### 500 Internal Server Error  
- Summary file not found
- File system errors
- Unexpected server errors

## Configuration

The server uses environment variables from `.env` file:

```env
SERVER_HOST=127.0.0.1
SERVER_PORT=8000
SUMMARY_FILE_PATH=backend/output/summary_20250924_041735.txt
UPLOADS_DIR=uploads
FRONTEND_ORIGIN=http://localhost:3000
```

## File Structure

```
backend/
├── main.py                    # Main FastAPI application
├── .env                       # Environment configuration
├── uploads/                   # Audio file storage
├── output/                    # Summary files and reports
├── start_server.py           # Server startup script
└── test_submit_endpoint.py    # Testing script
```

## Running the Server

### Method 1: Direct
```bash
cd backend
python main.py
```

### Method 2: Using startup script
```bash
cd backend  
python start_server.py
```

### Method 3: Using uvicorn directly
```bash
cd backend
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## Testing

Run the test script to verify the endpoint:
```bash
cd backend
python test_submit_endpoint.py
```

## Future Enhancements

The code includes placeholders for:
- Database storage integration
- Advanced AI-powered analysis  
- PDF report generation
- Email notification system
- Enhanced risk assessment algorithms

## Dependencies

Key dependencies from `requirements.txt`:
- `fastapi>=0.110.0`
- `uvicorn[standard]>=0.29.0`
- `python-multipart>=0.0.9`
- `python-dotenv>=1.0.0`