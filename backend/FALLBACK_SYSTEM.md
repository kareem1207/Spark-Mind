# Early Spark AI Pipeline - Fallback System Documentation

## Problem Solved

The AI pipeline was failing when external AI services (VertexAI/Gemini) became unavailable with 503 Service Unavailable errors. This document explains the robust fallback system implemented to handle such scenarios.

## Original Error

```
litellm.ServiceUnavailableError: VertexAIException - {
  "error": {
    "code": 503,
    "message": "The service is currently unavailable.",
    "status": "UNAVAILABLE"
  }
}
```

## Solution Overview

The updated `AiAgent.py` now includes:

1. **Retry Mechanisms** - Automatic retry with exponential backoff
2. **Fallback Content Generation** - Local content generation when AI services fail
3. **Graceful Degradation** - Continue processing even when some components fail
4. **Status Reporting** - Clear indication of fallback mode usage

## Key Features

### 1. Retry with Exponential Backoff

```python
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
```

### 2. Fallback Content Generators

- **`generate_fallback_doctor_report()`** - Creates comprehensive medical-style reports
- **`generate_fallback_summary()`** - Generates assessment summaries
- **`generate_fallback_email()`** - Creates user-friendly email content

### 3. Multi-Audio File Support

The system now properly handles 1-4 audio files:

```python
def collect_scores(audio_path: list[str] = [], ...):
    # Process multiple audio files
    for i, audio_file_path in enumerate(audio_path):
        # Individual file processing
        # Results stored as lists for each file
```

### 4. Robust Error Handling

Each component (Doctor Report, Summary, Email) has independent error handling:

```python
try:
    # Try AI generation with retries
    doctor_report = retry_with_backoff(run_doctor_analysis, max_retries=3)
except Exception as e:
    # Fall back to local generation
    doctor_report = generate_fallback_doctor_report(scores, disclaimer)
    use_fallback = True
```

## API Response Changes

The API now returns additional status information:

```json
{
  "memory_score": 85,
  "stroop_score": 92,
  "image_recall_score": 78,
  "audio_files": ["audio1.mp3", "audio2.mp3"],
  "summary_report": "Assessment completed...",
  "doctor_report": "Comprehensive report...",
  "email_content": "Thank you email...",
  "fallback_mode": false,
  "ai_service_status": "available",
  "status": "completed"
}
```

## Fallback Mode Indicators

- **`fallback_mode: true`** - AI services were unavailable, local generation used
- **`ai_service_status: "unavailable"`** - External AI services not accessible
- **`ai_service_status: "available"`** - Normal AI processing completed

## Testing the Fallback System

Use the provided test script:

```bash
cd backend
python test_fallback.py
```

This will test both normal and fallback modes automatically.

## Data Structure Changes

### Audio Processing Results

Results are now structured as lists to support multiple audio files:

```python
{
  "speech_metrics": [        # List of metrics per audio file
    {"pause_count": 5, "speech_rate": 150},  # File 1
    {"pause_count": 3, "speech_rate": 145}   # File 2
  ],
  "sentiment": [             # List of sentiment per audio file
    {"compound": 0.7, "positive": 0.8},      # File 1  
    {"compound": 0.5, "positive": 0.6}       # File 2
  ],
  "transcriptions": [        # List of transcriptions per audio file
    {"text": "First audio content..."},       # File 1
    {"text": "Second audio content..."}       # File 2
  ]
}
```

## Configuration Requirements

Ensure your `Agents/agent.yaml` contains appropriate configuration:

```yaml
disclaimer_line: "It is a test done by AI; if the score is too high it is suggested to consult a doctor immediately, if not then also it is better to meet a doctor."

clinical_evaluator:
  role: "Cognitive Assessment Physician"
  goal: "Generate comprehensive cognitive assessment reports"
  backstory: "Expert in neuropsychological assessment"
  llm: "gemini/gemini-2.0-flash"  # or your preferred model

summary_analyst:
  role: "Medical Summary Specialist"
  # ... other config

email_composer:
  role: "Patient Communication Specialist"
  # ... other config
```

## Benefits

1. **High Availability** - System continues to work even when AI services are down
2. **User Experience** - Users still receive meaningful reports and assessments
3. **Transparency** - Clear indication when fallback mode is used
4. **Data Preservation** - All user data and scores are preserved regardless of AI service status
5. **Multi-File Support** - Robust handling of 1-4 audio files with aggregated results

## Error Recovery

The system handles various error scenarios:

- **Service Unavailable (503)** - Retry with backoff, then fallback
- **Rate Limiting (429)** - Retry with exponential backoff
- **Network Timeouts** - Retry mechanism handles temporary network issues
- **Empty AI Responses** - Fallback generation ensures content is always provided
- **Missing Audio Files** - Graceful handling with appropriate error messages

## Monitoring

Look for these log messages to understand system behavior:

- `[RETRY] Attempt X failed` - Retry mechanism active
- `[WARN] AI X generation failed` - AI service issue detected
- `[INFO] Using fallback X generation` - Fallback mode activated
- `[INFO] Assessment completed using fallback mode` - Final fallback status

This ensures your Early Spark cognitive assessment system remains reliable and user-friendly even during AI service outages.