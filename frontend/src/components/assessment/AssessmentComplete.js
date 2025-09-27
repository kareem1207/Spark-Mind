"use client";

import {
  CheckCircle,
  RotateCcw,
  Home,
  FileBarChart,
  Brain,
  AlertTriangle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useAssessment } from "@/contexts/AssessmentContext";
import { useState, useEffect } from "react";

export default function AssessmentComplete({ onReset }) {
  const { aiResults, isProcessing } = useAssessment();
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Show results after a brief delay for better UX
    if (aiResults && !isProcessing) {
      const timer = setTimeout(() => setShowResults(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [aiResults, isProcessing]);

  // Show loading state while processing
  if (isProcessing || (aiResults && !showResults)) {
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
                className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse"
                style={{ backgroundColor: "#dbeafe" }}
              >
                <Brain className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              <div className="absolute -inset-2 rounded-full border-4 border-blue-200 animate-ping"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analyzing Your Assessment
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Our AI system is processing your responses and generating a
            comprehensive cognitive analysis report.
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Clock className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">
                Processing...
              </span>
            </div>

            <div className="space-y-3 text-left text-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Analyzing memory test results</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Processing Stroop test performance</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Evaluating image recall accuracy</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Analyzing speech patterns...</span>
              </div>
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
    return (
      <div
        className="min-h-screen py-8"
        style={{
          background:
            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#dcfce7" }}
                >
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Assessment Complete!
            </h1>
            <p className="text-lg text-gray-600">
              Your AI-powered cognitive analysis is ready
            </p>
          </div>

          {/* AI Results Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Cognitive Risk Assessment */}
            {aiResults.cognitive_risk && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Cognitive Risk Assessment
                  </h3>
                </div>

                <div className="text-center mb-4">
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      aiResults.cognitive_risk.category === "low"
                        ? "text-green-600"
                        : aiResults.cognitive_risk.category === "mild"
                        ? "text-yellow-600"
                        : aiResults.cognitive_risk.category === "moderate"
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {(aiResults.cognitive_risk.probability * 100).toFixed(1)}%
                  </div>
                  <div className="text-lg font-semibold text-gray-700 capitalize">
                    {aiResults.cognitive_risk.category} Risk
                  </div>
                </div>

                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {aiResults.cognitive_risk.disclaimer}
                </p>
              </div>
            )}

            {/* Test Scores */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Test Scores
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Memory Test:</span>
                  <span className="font-semibold text-blue-600">
                    {aiResults.memory_score}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Stroop Test:</span>
                  <span className="font-semibold text-green-600">
                    {aiResults.stroop_score}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Image Recall:</span>
                  <span className="font-semibold text-purple-600">
                    {aiResults.image_recall_score}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Audio Files:</span>
                  <span className="font-semibold text-gray-600">
                    {aiResults.audio_files?.length || 0} files
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Report */}
          {aiResults.summary_report && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Assessment Summary
              </h3>
              <div className="prose prose-blue max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap">
                  {aiResults.summary_report}
                </div>
              </div>
            </div>
          )}

          {/* Doctor Report */}
          {aiResults.doctor_report && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Detailed Clinical Report
              </h3>
              <div className="prose prose-blue max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {aiResults.doctor_report}
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {aiResults.ai_error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-800">Note</h3>
              </div>
              <p className="text-yellow-700">
                Some advanced analysis features were temporarily unavailable.
                Basic assessment completed successfully.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-3 rounded-xl font-semibold text-lg text-white transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
                }}
              >
                <Home className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Link>

              {aiResults.pdf_filename && (
                <Link
                  href={`/api/reports/${aiResults.pdf_filename}`}
                  className="inline-flex items-center px-8 py-3 rounded-xl font-semibold text-lg bg-white border-2 hover:bg-gray-50 transition-all"
                  style={{
                    color: "#1e3a8a",
                    borderColor: "#1e3a8a",
                  }}
                >
                  <FileBarChart className="mr-2 h-5 w-5" />
                  Download Report
                </Link>
              )}
            </div>

            {/* Reset Option */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                Want to take the assessment again?
              </p>
              <button
                onClick={onReset}
                className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start New Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default complete state (fallback)
  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#dcfce7" }}
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="absolute -inset-2 rounded-full border-4 border-green-200 animate-pulse"></div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Assessment Complete!
        </h1>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Thank you for completing the Early Spark cognitive assessment. Your
          responses have been submitted successfully.
        </p>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#1e3a8a" }}
              >
                ✓
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                Tests Completed
              </div>
              <div className="text-sm text-gray-600">
                All 4 assessments submitted
              </div>
            </div>

            <div className="text-center">
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#0891b2" }}
              >
                ⏳
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                Processing
              </div>
              <div className="text-sm text-gray-600">
                Results will be available soon
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            What happens next?
          </h3>
          <div className="text-left space-y-2 text-gray-700">
            <p>• Your responses are being analyzed by our AI system</p>
            <p>
              • Results will be available in the Results section within 24 hours
            </p>
            <p>
              • You'll receive a comprehensive report with insights and
              recommendations
            </p>
            <p>• Consider sharing results with your healthcare provider</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
            }}
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Link>

          <Link
            href="/results"
            className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg bg-white border-2 hover:bg-gray-50 transition-all"
            style={{
              color: "#1e3a8a",
              borderColor: "#1e3a8a",
            }}
          >
            <FileBarChart className="mr-2 h-5 w-5" />
            View Results
          </Link>
        </div>

        {/* Reset Option */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Want to take the assessment again?
          </p>
          <button
            onClick={onReset}
            className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
