"use client";

import {
  CheckCircle,
  Brain,
  TrendingUp,
  AlertTriangle,
  Award,
  Target,
  Activity,
  BarChart3,
  Zap,
  Eye,
  Mic,
  Clock,
  Shield,
  Star,
  Sparkles,
} from "lucide-react";

// Enhanced color palette with gradients
const colors = {
  navy: "#2e4156",
  teal: "#587c90",
  skyBlue: "#c7d9e5",
  beige: "#f3efec",
  white: "#ffffff",
  gradients: {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    success: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    warning: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    danger: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    info: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    premium: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
  },
};

export default function AssessmentSummary({ data, isLoading = false }) {
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

  // Show loading screen when data is being processed
  if (isLoading || !data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.beige }}
      >
        <div className="text-center max-w-md mx-auto px-4">
          {/* Loading Animation */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse"
                style={{ backgroundColor: colors.white }}
              >
                <Brain
                  className="h-12 w-12 animate-spin"
                  style={{ color: colors.navy }}
                />
              </div>
              <div
                className="absolute -inset-2 rounded-full border-4 animate-ping"
                style={{ borderColor: colors.skyBlue }}
              ></div>
            </div>
          </div>

          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: colors.navy, fontFamily: "'Inter', sans-serif" }}
          >
            Analyzing Your Results
          </h1>

          <p className="text-lg mb-8" style={{ color: colors.teal }}>
            Our AI is processing your cognitive assessment and generating
            personalized insights...
          </p>

          {/* Progress indicators */}
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.teal }}
              ></div>
              <span style={{ color: colors.navy }}>Processing test scores</span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.teal }}
              ></div>
              <span style={{ color: colors.navy }}>
                Analyzing speech patterns
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.teal }}
              ></div>
              <span style={{ color: colors.navy }}>
                Generating recommendations
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.teal }}
              ></div>
              <span style={{ color: colors.navy }}>
                Preparing summary report
              </span>
            </div>
          </div>
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
        {/* Clean Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Assessment Summary
          </h1>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-teal-500"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Scores */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Test Scores
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {data.scores &&
                  Object.entries(data.scores).map(([key, value], index) => {
                    // Skip non-numeric scores for this section
                    if (key === "speech_analysis" || typeof value !== "number")
                      return null;

                    const icons = [Target, Activity, BarChart3];
                    const Icon = icons[index % icons.length];
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-purple-500",
                    ];
                    const bgColors = [
                      "bg-blue-50",
                      "bg-green-50",
                      "bg-purple-50",
                    ];
                    const color = colors[index % colors.length];
                    const bgColor = bgColors[index % bgColors.length];

                    return (
                      <div
                        key={key}
                        className={`${bgColor} rounded-xl p-4 text-center`}
                      >
                        <div
                          className={`inline-flex p-2 rounded-lg ${color} mb-3`}
                        >
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-1">
                          {formatScore(value)}
                        </div>
                        <div className="text-sm font-medium text-gray-600 capitalize">
                          {key.replace(/_/g, " ")}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Speech & Mood Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <Mic className="h-5 w-5 mr-2 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Speech & Mood Analysis
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Speech Analysis */}
                {data.scores?.speech_analysis && (
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Mic className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 ml-3">
                        Speech Analysis
                      </h3>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <p className="text-gray-700 leading-relaxed">
                        {data.scores.speech_analysis}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mood Assessment */}
                {data.scores?.mood_assessment && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 ml-3">
                        Mood Assessment
                      </h3>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {formatScore(data.scores.mood_assessment)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Mood Stability Index
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Executive Summary Report */}
            {data.summary_report && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <Eye className="h-5 w-5 mr-2 text-teal-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Assessment Overview
                  </h2>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      {data.summary_report
                        .split(". ")
                        .map((sentence, index) => (
                          <p key={index} className="mb-3">
                            {sentence.trim()}
                            {sentence.trim() && !sentence.endsWith(".")
                              ? "."
                              : ""}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">Clinical Disclaimer</p>
                      <p className="text-xs leading-relaxed">
                        This assessment is for informational purposes only and
                        should not replace professional medical evaluation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Risk & Recommendations */}
          <div className="space-y-6">
            {/* Risk Category */}
            {data.risk_category && (
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
                <div className="mb-4">
                  <div className="inline-flex p-3 bg-red-100 rounded-full">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                </div>

                <div className="mb-4">
                  <div
                    className="inline-flex items-center px-6 py-3 rounded-xl text-white font-bold text-lg shadow-lg"
                    style={{
                      backgroundColor: getRiskCategoryColor(data.risk_category),
                    }}
                  >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {data.risk_category} Risk
                  </div>
                </div>

                <div
                  className={`text-sm font-medium px-4 py-2 rounded-full inline-block ${
                    data.risk_category?.toLowerCase() === "low"
                      ? "bg-green-100 text-green-800"
                      : data.risk_category?.toLowerCase() === "mild"
                      ? "bg-yellow-100 text-yellow-800"
                      : data.risk_category?.toLowerCase() === "moderate"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {data.risk_category?.toLowerCase() === "low"
                    ? "✓ Within Normal Range"
                    : data.risk_category?.toLowerCase() === "mild"
                    ? "⚠ Requires Monitoring"
                    : data.risk_category?.toLowerCase() === "moderate"
                    ? "⚡ Needs Attention"
                    : "🚨 Immediate Consultation Recommended"}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Recommendations
                  </h2>
                </div>

                <div className="space-y-4">
                  {data.recommendations.map((recommendation, index) => {
                    const colors = [
                      "bg-green-500",
                      "bg-blue-500",
                      "bg-purple-500",
                    ];
                    const bgColors = [
                      "bg-green-50",
                      "bg-blue-50",
                      "bg-purple-50",
                    ];
                    const borderColors = [
                      "border-green-200",
                      "border-blue-200",
                      "border-purple-200",
                    ];

                    const color = colors[index % colors.length];
                    const bgColor = bgColors[index % bgColors.length];
                    const borderColor =
                      borderColors[index % borderColors.length];

                    return (
                      <div
                        key={index}
                        className={`${bgColor} rounded-xl p-4 border ${borderColor}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 ${color} rounded-lg flex-shrink-0`}
                          >
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 leading-relaxed font-medium">
                              {recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
