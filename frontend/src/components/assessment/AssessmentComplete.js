"use client";

import { Brain, Clock } from "lucide-react";
import { useAssessment } from "@/contexts/AssessmentContext";
import { useState, useEffect } from "react";
import AssessmentSummary from "./AssessmentSummary";

export default function AssessmentComplete({ onReset }) {
  const { aiResults, isProcessing, isSubmitting } = useAssessment();
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Show results after a brief delay for better UX
    if (aiResults && !isProcessing && !isSubmitting) {
      const timer = setTimeout(() => setShowResults(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [aiResults, isProcessing, isSubmitting]);

  // Show loading state while submitting, processing, or waiting to show results
  if (isSubmitting || isProcessing || (aiResults && !showResults)) {
    return (
      <div
        className="min-h-screen py-8 flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Loading Animation */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center animate-pulse"
                style={{ backgroundColor: "#dbeafe" }}
              >
                <Brain className="h-16 w-16 text-blue-600 animate-spin" />
              </div>
              <div className="absolute -inset-3 rounded-full border-4 border-blue-200 animate-ping"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isSubmitting && !aiResults
              ? "Submitting Assessment..."
              : "Analyzing Your Assessment"}
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {isSubmitting && !aiResults
              ? "Sending your responses to our AI system for analysis..."
              : "Our AI system is processing your responses and generating a comprehensive cognitive analysis report."}
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Clock className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">
                Processing...
              </span>
            </div>

            <div className="space-y-4 text-left text-gray-700">
              {isSubmitting && !aiResults ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <span>Uploading assessment data...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span>Waiting for AI analysis...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span>Generating report...</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Analyzing memory test results</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Processing Stroop test performance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Evaluating image recall accuracy</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <span>Analyzing speech patterns...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <span>Generating personalized recommendations...</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500">
            This usually takes 30-60 seconds. Please don't close this page.
          </p>
        </div>
      </div>
    );
  }

  // Show AI results when available
  if (aiResults && showResults) {
    // Transform aiResults to match AssessmentSummary expected data format
    const summaryData = {
      scores: {
        memory_score: aiResults.memory_score,
        stroop_score: aiResults.stroop_score,
        image_recall_score: aiResults.image_recall_score,
        speech_analysis:
          aiResults.speech_analysis || "Speech analysis completed",
        mood_assessment: aiResults.mood_score || aiResults.sentiment_score,
      },
      summary_report: aiResults.summary_report,
      risk_category: aiResults.cognitive_risk?.category || "Unknown",
      recommendations: aiResults.recommendations || [
        "Continue regular cognitive exercises",
        "Maintain a healthy lifestyle",
        "Consider follow-up assessments as needed",
      ],
    };

    return <AssessmentSummary data={summaryData} isLoading={false} />;
  }

  // Fallback loading state
  return (
    <div
      className="min-h-screen py-8 flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse"
              style={{ backgroundColor: "#dbeafe" }}
            >
              <Brain className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <div className="absolute -inset-2 rounded-full border-4 border-blue-200 animate-ping"></div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Processing Assessment
        </h1>

        <p className="text-lg text-gray-600">
          Please wait while we prepare your results...
        </p>
      </div>
    </div>
  );
}
