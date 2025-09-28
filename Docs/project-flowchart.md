# Dementia Early Detection System - Project Flowchart

## Complete System Architecture Flow

```mermaid
graph TB
    %% User Authentication Flow
    A[User Visits Website] --> B{Authenticated?}
    B -->|No| C[Google OAuth Login]
    B -->|Yes| D[Dashboard]
    C --> E[Google Authentication]
    E --> F{Login Success?}
    F -->|Yes| G[Create/Update Session]
    F -->|No| H[Login Error]
    G --> D
    H --> C

    %% Dashboard and Navigation
    D --> I[User Dashboard]
    I --> J[View Progress Charts]
    I --> K[Access Cognitive Games]
    I --> L[View Results & Reports]
    I --> M[API Configuration]

    %% Cognitive Games Flow
    K --> N{Select Game Type}
    N -->|Stroop Test| O[Stroop Color Test]
    N -->|Memory| P[Memory Card Game]
    N -->|Matching| Q[Object-Purpose Matching]
    N -->|Speech| R[Speech Fluency Test]

    %% Stroop Color Test Flow
    O --> O1[Display Instructions]
    O1 --> O2[Start Timer - 60 seconds]
    O2 --> O3[Show Color Word]
    O3 --> O4[User Selects Color]
    O4 --> O5{Correct Answer?}
    O5 -->|Yes| O6[Increment Score]
    O5 -->|No| O7[Record Incorrect]
    O6 --> O8{Time Remaining?}
    O7 --> O8
    O8 -->|Yes| O3
    O8 -->|No| O9[Calculate Final Score]
    O9 --> SA[Submit to API]

    %% Memory Game Flow
    P --> P1[Select Difficulty Level]
    P1 --> P2[Generate Card Pairs]
    P2 --> P3[Display Cards Face Down]
    P3 --> P4[User Flips Two Cards]
    P4 --> P5{Cards Match?}
    P5 -->|Yes| P6[Keep Cards Face Up]
    P5 -->|No| P7[Flip Cards Back]
    P6 --> P8{All Pairs Found?}
    P7 --> P8
    P8 -->|No| P4
    P8 -->|Yes| P9[Calculate Time & Score]
    P9 --> SB[Submit to API]

    %% Object-Purpose Matching Flow
    Q --> Q1[Load Object-Purpose Pairs]
    Q1 --> Q2[Display Objects & Purposes]
    Q2 --> Q3[User Drags Object to Purpose]
    Q3 --> Q4{Correct Match?}
    Q4 -->|Yes| Q5[Mark as Matched]
    Q4 -->|No| Q6[Increment Incorrect Attempts]
    Q5 --> Q7{All Items Matched?}
    Q6 --> Q7
    Q7 -->|No| Q3
    Q7 -->|Yes| Q8[Calculate Score & Accuracy]
    Q8 --> SC[Submit to API]

    %% Speech Test Flow
    R --> R1[Display Task Instructions]
    R1 --> R2[Show Speaking Prompt]
    R2 --> R3[Request Microphone Access]
    R3 --> R4{Permission Granted?}
    R4 -->|Yes| R5[Start Recording]
    R4 -->|No| R6[Permission Error]
    R5 --> R7[Timer Countdown]
    R7 --> R8{Time Up or User Stops?}
    R8 -->|Continue| R7
    R8 -->|Stop| R9[Save Audio Blob]
    R9 --> R10{More Tasks?}
    R10 -->|Yes| R2
    R10 -->|No| R11[Process All Recordings]
    R11 --> SD[Upload Audio to API]

    %% API Integration Flow
    SA --> API1[POST /api/games/results]
    SB --> API1
    SC --> API1
    SD --> API2[POST /api/speech/upload]

    API1 --> API3[Backend Processing]
    API2 --> API4[Speech-to-Text Analysis]
    API4 --> API5[Sentiment Analysis]
    API3 --> DB[(Database Storage)]
    API5 --> DB

    %% Results and Reports Flow
    L --> RES1[GET /api/results]
    RES1 --> RES2[Display User Results]
    RES2 --> RES3[Show Progress Charts]
    RES3 --> RES4[Calculate Risk Score]
    RES4 --> RES5{Generate Report?}
    RES5 -->|Yes| RES6[POST /api/results/report]
    RES6 --> RES7[Generate PDF Report]
    RES7 --> RES8[Download PDF]
    RES5 -->|No| RES9[View Online Results]

    %% Backend Processing Details
    DB --> BP1[AI Analysis Engine]
    BP1 --> BP2[Memory Score Calculation]
    BP1 --> BP3[Speech Pattern Analysis]
    BP1 --> BP4[Cognitive Performance Metrics]
    BP2 --> BP5[Risk Assessment Algorithm]
    BP3 --> BP5
    BP4 --> BP5
    BP5 --> BP6[Generate Risk Score]
    BP6 --> BP7[Create Recommendations]

    %% Error Handling
    R6 --> ERR1[Show Error Message]
    ERR1 --> R3
    H --> ERR2[Display Login Error]
    ERR2 --> C

    %% Styling
    classDef userAction fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef systemProcess fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef apiCall fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef database fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef error fill:#ffebee,stroke:#c62828,stroke-width:2px

    class A,C,D,I,K,O4,P4,Q3,R2,R5 userAction
    class E,G,O9,P9,Q8,R11,BP1,BP2,BP3,BP4,BP5,BP6,BP7 systemProcess
    class SA,SB,SC,SD,API1,API2,RES1,RES6 apiCall
    class DB database
    class H,R6,ERR1,ERR2 error
```

## Detailed Component Architecture

```mermaid
graph LR
    %% Frontend Components
    subgraph "Frontend (Next.js)"
        subgraph "Pages"
            HOME[Home Page]
            AUTH[Auth Pages]
            DASH[Dashboard]
            GAMES[Game Pages]
            RESULTS[Results Page]
            REPORTS[Reports Page]
            CONFIG[API Config]
        end

        subgraph "Components"
            NAV[Navigation]
            LAYOUT[Layout]
            STROOP[Stroop Game Component]
            MEMORY[Memory Game Component]
            MATCHING[Matching Game Component]
            SPEECH[Speech Test Component]
            CHARTS[Chart Components]
            SESSION[Session Provider]
        end

        subgraph "API Layer"
            APILIB[API Utilities]
            AUTH_LIB[NextAuth Config]
            HOOKS[Custom Hooks]
        end
    end

    %% Backend Components
    subgraph "Backend (Python)"
        subgraph "API Endpoints"
            HEALTH[Health Check]
            GAME_API[Game Results API]
            SPEECH_API[Speech Upload API]
            RESULTS_API[Results API]
            REPORT_API[Report Generation API]
        end

        subgraph "Core Services"
            AI_AGENT[AI Agent]
            SENTIMENT[Sentiment Analyzer]
            STT[Speech-to-Text]
            MEMORY_SCORE[Memory Game Scorer]
        end

        subgraph "Data Layer"
            DB_MODELS[Database Models]
            FILE_STORAGE[File Storage]
            METRICS[Metrics Storage]
        end
    end

    %% External Services
    subgraph "External APIs"
        GOOGLE_AUTH[Google OAuth]
        OPENAI[OpenAI API]
        CLOUD_STT[Cloud Speech API]
    end

    %% Connections
    HOME --> DASH
    AUTH --> GOOGLE_AUTH
    GAMES --> STROOP
    GAMES --> MEMORY
    GAMES --> MATCHING
    GAMES --> SPEECH

    APILIB --> GAME_API
    APILIB --> SPEECH_API
    APILIB --> RESULTS_API
    APILIB --> REPORT_API

    AI_AGENT --> OPENAI
    STT --> CLOUD_STT
    SPEECH_API --> STT
    GAME_API --> MEMORY_SCORE
    SPEECH_API --> SENTIMENT

    RESULTS_API --> DB_MODELS
    REPORT_API --> METRICS
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant B as Backend API
    participant D as Database
    participant AI as AI Services

    %% Authentication Flow
    U->>F: Visit Application
    F->>A: Check Authentication
    A->>F: Not Authenticated
    F->>U: Show Login Page
    U->>F: Click Google Login
    F->>A: Initiate OAuth
    A->>U: Google Auth Popup
    U->>A: Provide Credentials
    A->>F: Return Session Token
    F->>U: Redirect to Dashboard

    %% Game Play Flow
    U->>F: Select Cognitive Game
    F->>U: Show Game Instructions
    U->>F: Start Game
    F->>F: Track Game Metrics
    U->>F: Complete Game
    F->>B: POST /api/games/results
    B->>D: Store Game Results
    B->>AI: Analyze Performance
    AI->>B: Return Analysis
    B->>F: Confirm Submission
    F->>U: Show Game Results

    %% Speech Test Flow
    U->>F: Start Speech Test
    F->>U: Request Microphone
    U->>F: Grant Permission
    F->>F: Record Audio
    U->>F: Complete Recording
    F->>B: POST /api/speech/upload
    B->>AI: Speech-to-Text
    AI->>B: Return Transcription
    B->>AI: Sentiment Analysis
    AI->>B: Return Sentiment Score
    B->>D: Store Speech Data
    B->>F: Confirm Upload
    F->>U: Show Completion

    %% Results and Reports Flow
    U->>F: View Results
    F->>B: GET /api/results
    B->>D: Query User Data
    D->>B: Return Results
    B->>AI: Calculate Risk Score
    AI->>B: Return Risk Assessment
    B->>F: Send Results & Risk Score
    F->>U: Display Dashboard

    U->>F: Request PDF Report
    F->>B: POST /api/results/report
    B->>AI: Generate Report Content
    AI->>B: Return Report Data
    B->>B: Create PDF
    B->>F: Send PDF Download Link
    F->>U: Download PDF Report
```

## Technology Stack Overview

```mermaid
graph TB
    subgraph "Frontend Stack"
        NEXTJS[Next.js 15.5.4]
        REACT[React 19.1.0]
        TAILWIND[Tailwind CSS 4]
        NEXTAUTH[NextAuth.js]
        CHARTS_LIB[Chart.js & Recharts]
        FRAMER[Framer Motion]
        AXIOS[Axios]
    end

    subgraph "Backend Stack"
        PYTHON[Python]
        FASTAPI[FastAPI]
        OPENAI_LIB[OpenAI API]
        STT_LIB[Speech Recognition]
        PDF_LIB[PDF Generation]
        DATABASE[SQLite/PostgreSQL]
    end

    subgraph "External Services"
        GOOGLE_OAUTH[Google OAuth 2.0]
        OPENAI_API[OpenAI GPT API]
        SPEECH_API[Speech-to-Text API]
    end

    subgraph "Development Tools"
        VSCODE[VS Code]
        GIT[Git Version Control]
        NPM[NPM Package Manager]
        PIP[Python Package Manager]
    end

    NEXTJS --> REACT
    NEXTJS --> TAILWIND
    NEXTJS --> NEXTAUTH
    NEXTAUTH --> GOOGLE_OAUTH
    PYTHON --> FASTAPI
    FASTAPI --> OPENAI_LIB
    OPENAI_LIB --> OPENAI_API
    STT_LIB --> SPEECH_API
```

## File Structure Overview

```
ForeKnow/
├── frontend/                    # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                # App Router Pages
│   │   │   ├── page.js         # Home Page
│   │   │   ├── dashboard/      # Dashboard Pages
│   │   │   ├── games/          # Game Pages
│   │   │   │   ├── stroop/     # Stroop Color Test
│   │   │   │   ├── memory/     # Memory Game
│   │   │   │   ├── matching/   # Object-Purpose Matching
│   │   │   │   └── speech/     # Speech Fluency Test
│   │   │   ├── results/        # Results & Analytics
│   │   │   ├── reports/        # PDF Reports
│   │   │   └── auth/           # Authentication Pages
│   │   ├── components/         # Reusable Components
│   │   │   ├── games/          # Game Components
│   │   │   ├── ui/             # UI Components
│   │   │   └── charts/         # Chart Components
│   │   └── lib/                # Utilities & API
│   │       ├── api.js          # API Integration
│   │       ├── auth.js         # Authentication Config
│   │       └── utils.js        # Helper Functions
│   ├── public/                 # Static Assets (SVG Icons)
│   ├── docs/                   # Documentation
│   └── package.json            # Dependencies
├── backend/                    # Python Backend
│   ├── main.py                 # FastAPI Main Application
│   ├── AiAgent.py              # AI Analysis Engine
│   ├── SentimentAnalyzer.py    # Sentiment Analysis
│   ├── SpeechToText.py         # Speech Processing
│   ├── MemoryGameScore.py      # Memory Game Scoring
│   ├── audio/                  # Audio File Storage
│   ├── output/                 # Generated Reports
│   └── requirements.txt        # Python Dependencies
└── docs/                       # Project Documentation
    ├── architecture.md         # System Architecture
    ├── project-flowchart.md    # This Flowchart Document
    └── README.md               # Project Overview
```

## Key Features & Workflows

### 1. **User Authentication Workflow**

- Google OAuth 2.0 integration
- Session management with NextAuth.js
- Protected routes and middleware
- Automatic token refresh

### 2. **Cognitive Assessment Games**

- **Stroop Color Test**: Measures cognitive flexibility and attention
- **Memory Game**: Assesses working memory and pattern recognition
- **Object-Purpose Matching**: Evaluates semantic memory and reasoning
- **Speech Fluency Test**: Analyzes verbal fluency and language processing

### 3. **AI-Powered Analysis**

- Real-time performance scoring
- Speech-to-text transcription
- Sentiment analysis of speech patterns
- Risk assessment algorithms
- Personalized recommendations

### 4. **Results & Reporting**

- Interactive dashboard with progress charts
- Comprehensive PDF report generation
- Risk score visualization
- Historical data tracking
- Export capabilities

### 5. **Technical Implementation**

- Responsive design with Tailwind CSS
- Real-time data synchronization
- Error handling and loading states
- Cross-browser compatibility
- Performance optimization

This flowchart provides a complete overview of the Dementia Early Detection System, showing how all components work together to deliver a comprehensive cognitive assessment platform.
