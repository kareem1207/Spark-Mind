"use client";

import { createContext, useContext, useReducer, useState } from "react";

const AssessmentContext = createContext();

// Assessment stages
export const ASSESSMENT_STAGES = {
  MEMORY: "memory",
  STROOP: "stroop",
  IMAGE_RECALL: "image_recall",
  SPEECH: "speech",
  COMPLETE: "complete",
};

const initialState = {
  currentStage: ASSESSMENT_STAGES.MEMORY,
  scores: {
    memory_score: null,
    stroop_score: null,
    image_recall_score: null,
  },
  audioRecordings: {
    audio_q1: null,
    audio_q2: null,
    audio_q3: null,
    audio_q4: null,
  },
  isSubmitting: false,
  isComplete: false,
  error: null,
  submissionSuccess: false,
};

function assessmentReducer(state, action) {
  switch (action.type) {
    case "SET_STAGE":
      return { ...state, currentStage: action.payload };

    case "SET_SCORE":
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.payload.test]: action.payload.score,
        },
      };

    case "SET_AUDIO":
      return {
        ...state,
        audioRecordings: {
          ...state.audioRecordings,
          [action.payload.question]: action.payload.blob,
        },
      };

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isSubmitting: false };

    case "SET_SUCCESS":
      return {
        ...state,
        submissionSuccess: true,
        isSubmitting: false,
        isComplete: true,
      };

    case "RESET_ASSESSMENT":
      return initialState;

    default:
      return state;
  }
}

export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  const setCurrentStage = (stage) => {
    dispatch({ type: "SET_STAGE", payload: stage });
  };

  const setScore = (test, score) => {
    dispatch({ type: "SET_SCORE", payload: { test, score } });
  };

  const setAudioRecording = (question, blob) => {
    dispatch({ type: "SET_AUDIO", payload: { question, blob } });
  };

  const nextStage = () => {
    const stages = Object.values(ASSESSMENT_STAGES);
    const currentIndex = stages.indexOf(state.currentStage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const prevStage = () => {
    const stages = Object.values(ASSESSMENT_STAGES);
    const currentIndex = stages.indexOf(state.currentStage);
    if (currentIndex > 0) {
      setCurrentStage(stages[currentIndex - 1]);
    }
  };

  const submitAssessment = async (userEmail) => {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const formData = new FormData();

      // Add user email
      formData.append("user_email", userEmail);

      // Add scores
      formData.append("memory_score", state.scores.memory_score || 0);
      formData.append("stroop_score", state.scores.stroop_score || 0);
      formData.append(
        "image_recall_score",
        state.scores.image_recall_score || 0
      );

      // Add audio recordings
      Object.entries(state.audioRecordings).forEach(([key, blob]) => {
        if (blob) {
          formData.append(key, blob, `${key}.webm`);
        }
      });

      const response = await fetch("/api/submit-tests", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      dispatch({ type: "SET_SUCCESS" });

      return result;
    } catch (error) {
      console.error("Assessment submission failed:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const resetAssessment = () => {
    dispatch({ type: "RESET_ASSESSMENT" });
  };

  const value = {
    ...state,
    setCurrentStage,
    setScore,
    setAudioRecording,
    nextStage,
    prevStage,
    submitAssessment,
    resetAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
}
