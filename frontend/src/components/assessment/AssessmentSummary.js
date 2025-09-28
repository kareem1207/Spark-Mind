"use client";

import { useState } from "react";
import {
  CheckCircle,
  Download,
  Brain,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

// Color palette
const colors = {
  navy: "#2e4156",
  teal: "#587c90",
  skyBlue: "#c7d9e5",
  beige: "#f3efec",
  white: "#ffffff",
};

export default function AssessmentSummary({ data }) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle PDF download
  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      // Replace with your actual backend endpoint
      const response = await fetch("/api/download-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId: data?.reportId }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `cognitive_assessment_report_${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to get risk category color
  const getRiskCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "low":
        return "#10b981"; // Green
      case "mild":
        return "#f59e0b"; // Yellow
      case "moderate":
        return "#ef4444"; // Red
      case "high":
        return "#dc2626"; // Dark red
      default:
        return colors.teal;
    }
  };

  // Helper function to format score display
  const formatScore = (score) => {
    if (typeof score === "number") {
      return score.toFixed(1);
    }
    return score;
  };

  if (!data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.beige }}
      >
        <div className="text-center">
          <Brain
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: colors.navy }}
          />
          <p style={{ color: colors.navy }}>Loading assessment summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.beige }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: colors.navy, fontFamily: "'Inter', sans-serif" }}
          >
            Assessment Summary
          </h1>
          <div
            className="w-24 h-1 mx-auto rounded-full"
            style={{ backgroundColor: colors.teal }}
          ></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Key Highlights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Highlights Section */}
            <div
              className="rounded-xl shadow-lg p-6"
              style={{ backgroundColor: colors.white }}
            >
              <h2
                className="text-xl font-semibold mb-4 flex items-center"
                style={{ color: colors.teal }}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Key Highlights
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.scores &&
                  Object.entries(data.scores).map(([key, value]) => {
                    // Skip non-numeric scores for this section
                    if (key === "speech_analysis" || typeof value !== "number")
                      return null;

                    return (
                      <div
                        key={key}
                        className="rounded-lg p-4 text-center shadow-sm"
                        style={{ backgroundColor: colors.beige }}
                      >
                        <div
                          className="text-2xl font-bold mb-1"
                          style={{ color: colors.navy }}
                        >
                          {formatScore(value)}
                        </div>
                        <div
                          className="text-sm font-medium capitalize"
                          style={{ color: colors.teal }}
                        >
                          {key.replace(/_/g, " ")}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Speech & Mood Section */}
            <div
              className="rounded-xl shadow-lg p-6"
              style={{ backgroundColor: colors.white }}
            >
              <h2
                className="text-xl font-semibold mb-4 flex items-center"
                style={{ color: colors.teal }}
              >
                <Brain className="h-5 w-5 mr-2" />
                Speech & Mood Analysis
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Speech Analysis */}
                {data.scores?.speech_analysis && (
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: colors.beige }}
                  >
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: colors.navy }}
                    >
                      Speech Analysis
                    </h3>
                    <p className="text-sm" style={{ color: colors.navy }}>
                      {data.scores.speech_analysis}
                    </p>
                  </div>
                )}

                {/* Mood Assessment */}
                {data.scores?.mood_assessment && (
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: colors.beige }}
                  >
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: colors.navy }}
                    >
                      Mood Score
                    </h3>
                    <div className="flex items-center">
                      <div
                        className="text-2xl font-bold mr-2"
                        style={{ color: colors.navy }}
                      >
                        {formatScore(data.scores.mood_assessment)}
                      </div>
                      <div className="text-sm" style={{ color: colors.teal }}>
                        out of 100
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Report */}
            {data.summary_report && (
              <div
                className="rounded-xl shadow-lg p-6"
                style={{ backgroundColor: colors.white }}
              >
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ color: colors.teal }}
                >
                  Assessment Overview
                </h2>
                <p
                  className="text-gray-700 leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {data.summary_report}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Recommendations & Risk */}
          <div className="space-y-6">
            {/* Risk Category */}
            {data.risk_category && (
              <div
                className="rounded-xl shadow-lg p-6 text-center"
                style={{ backgroundColor: colors.white }}
              >
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.teal }}
                >
                  Risk Assessment
                </h2>
                <div
                  className="inline-flex items-center px-6 py-3 rounded-full text-white font-bold text-lg shadow-md"
                  style={{
                    backgroundColor: getRiskCategoryColor(data.risk_category),
                  }}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {data.risk_category}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
              <div
                className="rounded-xl shadow-lg p-6"
                style={{ backgroundColor: colors.white }}
              >
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.teal }}
                >
                  Recommendations
                </h2>
                <ul className="space-y-3">
                  {data.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle
                        className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0"
                        style={{ color: colors.skyBlue }}
                      />
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: colors.navy }}
                      >
                        {recommendation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center">
          <button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="inline-flex items-center px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              backgroundColor: colors.navy,
              color: colors.white,
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!isDownloading) {
                e.target.style.backgroundColor = colors.teal;
              }
            }}
            onMouseLeave={(e) => {
              if (!isDownloading) {
                e.target.style.backgroundColor = colors.navy;
              }
            }}
          >
            <Download className="h-5 w-5 mr-2" />
            {isDownloading ? "Downloading..." : "Download Full Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
