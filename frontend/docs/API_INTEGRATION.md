# API Integration Documentation

This document describes the API integration between the frontend and backend components of the Dementia Early Detection System.

## Frontend API Integration

### Configuration

The frontend uses environment variables to configure API endpoints:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### API Utilities (`src/lib/api.js`)

All backend communication is handled through centralized API utilities:

#### Core Functions

- `checkBackendHealth()` - Checks if backend is running
- `submitGameResults(gameData, session)` - Submits cognitive game results
- `uploadSpeechRecording(audioBlob, taskData, session)` - Uploads speech recordings
- `getUserResults(session, filters)` - Retrieves user's historical results
- `getUserRiskScore(session)` - Gets calculated risk assessment
- `generatePDFReport(session, reportType)` - Generates PDF reports
- `downloadPDFReport(session, reportId)` - Downloads PDF reports
- `requestAIAnalysis(data, session)` - Requests AI analysis
- `requestSentimentAnalysis(textData, session)` - Analyzes speech sentiment

### Game Integration

Each cognitive game automatically submits results to the backend:

#### Stroop Color Test
```javascript
const gameResults = {
  gameType: "stroop",
  duration: 60 - timeLeft,
  score,
  accuracy: Math.round(accuracy),
  avgResponseTime: Math.round(avgResponseTime),
  totalQuestions,
  correctAnswers,
  metadata: {
    gameMode: "Stroop Color Test",
    difficulty: "standard",
    timeLimit: 60
  }
};
```

#### Memory Game
```javascript
const apiData = {
  score: Math.max(0, finalScore),
  level: difficulty,
  attempts: moves,
  duration: totalTime,
  accuracy: matchedCards.length === cards.length ? 100 : (matchedCards.length / cards.length) * 100,
  metadata: {
    gameMode: "Memory Game",
    pairs: setting.pairs,
    difficulty
  }
};
```

#### Object-Purpose Matching
```javascript
const apiData = {
  gameType: "matching",
  duration: totalTime,
  score,
  accuracy,
  incorrectAttempts,
  levelsCompleted: currentLevel,
  metadata: {
    gameMode: "Object-Purpose Matching",
    totalItems: gameItems.length,
    difficulty: "progressive"
  }
};
```

#### Speech Fluency Test
- Uploads audio recordings as WebM files  
- Submits task metadata (prompt, duration, etc.)
- Requests sentiment analysis if transcription available

## Backend API Endpoints

### Expected Backend Endpoints

The frontend expects these backend endpoints to be available:

#### Health Check
```
GET /health
Response: { status: "ok", timestamp: "2025-01-11T..." }
```

#### Game Results
```
POST /api/games/results
Headers: Authorization: Bearer <token>
Body: {
  userId: string,
  gameType: string,
  score: number,
  accuracy: number,
  duration: number,
  timestamp: string,
  metadata: object
}
```

#### Memory Game Score
```
POST /api/memory-game-score  
Headers: Authorization: Bearer <token>
Body: {
  userId: string,
  score: number,
  level: string,
  attempts: number,
  duration: number,
  accuracy: number,
  timestamp: string
}
```

#### Speech Recording Upload
```
POST /api/speech/upload
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
FormData:
- audio: File (WebM)
- userId: string
- taskType: string
- taskPrompt: string  
- duration: string
- timestamp: string
```

#### User Results
```
GET /api/results?period=<period>&gameType=<type>
Headers: Authorization: Bearer <token>
Response: Array of game results
```

#### Risk Score
```
GET /api/results/score
Headers: Authorization: Bearer <token>
Response: {
  overall: number,
  trend: string,
  confidence: number,
  lastUpdate: string
}
```

#### PDF Report Generation
```
POST /api/results/report
Headers: Authorization: Bearer <token>
Body: {
  userId: string,
  reportType: string,
  period: string,
  timestamp: string
}
Response: { reportId: string }
```

#### PDF Report Download
```
GET /api/results/report/<reportId>
Headers: Authorization: Bearer <token>
Response: PDF file blob
```

#### AI Analysis
```
POST /api/ai-analysis
Headers: Authorization: Bearer <token>
Body: {
  userId: string,
  analysisType: string,
  inputData: any,
  timestamp: string
}
```

#### Sentiment Analysis
```
POST /api/sentiment-analysis
Headers: Authorization: Bearer <token>
Body: {
  userId: string,
  text: string,
  context: string,
  timestamp: string
}
```

## Authentication

### Session Management

The frontend uses NextAuth.js for authentication:
- Google OAuth provider
- Session tokens passed in Authorization header
- Automatic session refresh
- Protected routes redirect to sign-in

### API Request Headers

All authenticated requests include:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <session.accessToken>'
}
```

## Error Handling

### API Error Responses

All API functions return a consistent format:
```javascript
// Success
{ success: true, data: responseData }

// Error  
{ success: false, error: errorMessage }
```

### Frontend Error Handling

- API failures gracefully fall back to mock data
- User-friendly error messages displayed
- Console logging for debugging
- Network connectivity checks

## Testing

### API Testing Tool

The API Config page (`/api-config`) provides:
- Backend connectivity testing
- Individual endpoint testing
- Configuration validation
- Real-time status monitoring

### Test Function

```javascript
const results = await testAllEndpoints(session);
// Tests all configured endpoints and returns status
```

## Data Flow

### Game Result Submission Flow

1. User completes cognitive game
2. Game calculates metrics (score, accuracy, duration)
3. Frontend formats data for API
4. POST request to backend with game results
5. Backend processes and stores results
6. Success/error response returned to frontend
7. User feedback displayed

### Report Generation Flow

1. User requests PDF report
2. Frontend calls `generatePDFReport()` API
3. Backend processes user data and generates PDF
4. Report ID returned to frontend
5. Frontend automatically triggers download
6. PDF file downloaded to user's device

## Configuration

### Environment Variables

Frontend requires these environment variables:

```bash
# Required
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional
OPENAI_API_KEY=your-openai-key
```

### Backend Compatibility

The frontend is designed to work with the Python backend located in `/backend`:
- FastAPI framework expected
- JSON request/response format
- File upload support for speech recordings
- PDF generation capabilities
- Database integration for result storage

## Development

### Local Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Configure environment variables
4. Start backend server on port 8000
5. Start frontend: `npm run dev`
6. Test API connectivity via `/api-config` page

### Production Deployment

- Update `NEXT_PUBLIC_BACKEND_URL` for production backend
- Configure proper CORS settings on backend
- Use HTTPS for all API communications
- Implement proper authentication token management
- Set up monitoring for API health checks