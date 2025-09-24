// API utility functions for backend integration

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Helper function to get auth headers
const getAuthHeaders = (session) => {
  return {
    "Content-Type": "application/json",
    Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : "",
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.blob();
    }
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};

// Health check
export const checkBackendHealth = async () => {
  try {
    const response = await apiRequest("/health");
    return { status: "connected", data: response };
  } catch (error) {
    return { status: "error", error: error.message };
  }
};

// Game results submission
export const submitGameResults = async (gameData, session) => {
  try {
    const response = await apiRequest("/api/games/results", {
      method: "POST",
      headers: getAuthHeaders(session),
      body: JSON.stringify({
        userId: session?.user?.id,
        gameType: gameData.gameType,
        score: gameData.score,
        accuracy: gameData.accuracy,
        duration: gameData.duration,
        timestamp: new Date().toISOString(),
        metadata: gameData.metadata || {},
        ...gameData,
      }),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error("Error submitting game results:", error);
    return { success: false, error: error.message };
  }
};

// Speech recording upload
export const uploadSpeechRecording = async (audioBlob, taskData, session) => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, `speech-recording-${Date.now()}.webm`);
    formData.append("userId", session?.user?.id || "");
    formData.append("taskType", taskData.taskType);
    formData.append("taskPrompt", taskData.prompt);
    formData.append("duration", taskData.duration.toString());
    formData.append("timestamp", new Date().toISOString());

    const response = await fetch(`${API_BASE_URL}/api/speech/upload`, {
      method: "POST",
      headers: {
        Authorization: session?.accessToken
          ? `Bearer ${session.accessToken}`
          : "",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Speech upload failed: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error uploading speech recording:", error);
    return { success: false, error: error.message };
  }
};

// Get user results
export const getUserResults = async (session, filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/api/results${queryParams ? `?${queryParams}` : ""}`;

    const response = await apiRequest(endpoint, {
      headers: getAuthHeaders(session),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching user results:", error);
    return { success: false, error: error.message };
  }
};

// Get risk score
export const getUserRiskScore = async (session) => {
  try {
    const response = await apiRequest("/api/results/score", {
      headers: getAuthHeaders(session),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching risk score:", error);
    return { success: false, error: error.message };
  }
};

// Generate PDF report
export const generatePDFReport = async (
  session,
  reportType = "comprehensive"
) => {
  try {
    const response = await apiRequest("/api/results/report", {
      method: "POST",
      headers: getAuthHeaders(session),
      body: JSON.stringify({
        userId: session?.user?.id,
        reportType,
        period: "last-30-days",
        timestamp: new Date().toISOString(),
      }),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error("Error generating PDF report:", error);
    return { success: false, error: error.message };
  }
};

// Download PDF report
export const downloadPDFReport = async (session, reportId = null) => {
  try {
    const endpoint = reportId
      ? `/api/results/report/${reportId}`
      : "/api/results/report";
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(session),
    });

    if (!response.ok) {
      throw new Error(`Report download failed: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cognitive-assessment-report-${reportId || Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Error downloading PDF report:", error);
    return { success: false, error: error.message };
  }
};

// AI Analysis request
export const requestAIAnalysis = async (data, session) => {
  try {
    const response = await apiRequest("/api/ai-analysis", {
      method: "POST",
      headers: getAuthHeaders(session),
      body: JSON.stringify({
        userId: session?.user?.id,
        analysisType: data.type,
        inputData: data.data,
        timestamp: new Date().toISOString(),
        ...data,
      }),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error("Error requesting AI analysis:", error);
    return { success: false, error: error.message };
  }
};

// Memory game score submission
export const submitMemoryGameScore = async (scoreData, session) => {
  try {
    const response = await apiRequest("/api/memory-game-score", {
      method: "POST",
      headers: getAuthHeaders(session),
      body: JSON.stringify({
        userId: session?.user?.id,
        score: scoreData.score,
        level: scoreData.level,
        attempts: scoreData.attempts,
        duration: scoreData.duration,
        accuracy: scoreData.accuracy,
        timestamp: new Date().toISOString(),
        ...scoreData,
      }),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error("Error submitting memory game score:", error);
    return { success: false, error: error.message };
  }
};

// Sentiment analysis request
export const requestSentimentAnalysis = async (textData, session) => {
  try {
    const response = await apiRequest("/api/sentiment-analysis", {
      method: "POST",
      headers: getAuthHeaders(session),
      body: JSON.stringify({
        userId: session?.user?.id,
        text: textData.text,
        context: textData.context || "cognitive-assessment",
        timestamp: new Date().toISOString(),
        ...textData,
      }),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error("Error requesting sentiment analysis:", error);
    return { success: false, error: error.message };
  }
};

// Test all API endpoints
export const testAllEndpoints = async (session) => {
  const endpoints = [
    { name: "Health Check", test: () => checkBackendHealth() },
    {
      name: "Game Results",
      test: () => submitGameResults({ gameType: "test", score: 100 }, session),
    },
    { name: "Risk Score", test: () => getUserRiskScore(session) },
    { name: "User Results", test: () => getUserResults(session) },
  ];

  const results = {};

  for (const endpoint of endpoints) {
    try {
      const result = await endpoint.test();
      results[endpoint.name] = result.success !== false;
    } catch (error) {
      results[endpoint.name] = false;
    }
  }

  return results;
};
