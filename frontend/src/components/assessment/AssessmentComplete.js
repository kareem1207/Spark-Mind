"use client";

import { CheckCircle, RotateCcw, Home, FileBarChart } from "lucide-react";
import Link from "next/link";

export default function AssessmentComplete({ onReset }) {
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
          responses have been submitted successfully and are being processed.
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
