"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Brain,
  Trophy,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Home,
  Gamepad2,
  Filter,
  Search,
  Eye,
  MoreVertical,
} from "lucide-react";
import { getUserResults, getUserRiskScore } from "@/lib/api";

export default function ResultsClient({ session }) {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [riskScore, setRiskScore] = useState(null);

  // Mock results data - replace with API calls
  const mockResults = [
    {
      id: 1,
      gameType: "Stroop Color Test",
      date: "2025-09-24",
      time: "14:30",
      score: 85,
      accuracy: 92,
      reactionTime: 650,
      status: "completed",
      riskLevel: "low",
      duration: 8.5,
      improvements: ["Faster reaction time", "Higher accuracy"],
    },
    {
      id: 2,
      gameType: "Memory Game",
      date: "2025-09-24",
      time: "10:15",
      score: 78,
      accuracy: 87,
      attempts: 12,
      status: "completed",
      riskLevel: "low",
      duration: 6.2,
      improvements: ["Better pattern recognition"],
    },
    {
      id: 3,
      gameType: "Object-Purpose Matching",
      date: "2025-09-23",
      time: "16:45",
      score: 92,
      accuracy: 96,
      matches: 18,
      status: "completed",
      riskLevel: "very-low",
      duration: 5.8,
      improvements: ["Excellent semantic memory"],
    },
    {
      id: 4,
      gameType: "Speech Fluency Test",
      date: "2025-09-23",
      time: "11:20",
      score: 88,
      fluency: 94,
      vocabulary: 91,
      status: "completed",
      riskLevel: "low",
      duration: 12.3,
      improvements: ["Good verbal fluency", "Rich vocabulary usage"],
    },
    {
      id: 5,
      gameType: "Stroop Color Test",
      date: "2025-09-22",
      time: "09:30",
      score: 82,
      accuracy: 89,
      reactionTime: 720,
      status: "completed",
      riskLevel: "low",
      duration: 9.1,
      improvements: ["Consistent performance"],
    },
  ];

  // Load results
  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      try {
        if (session) {
          // Load user results from backend
          const resultsResponse = await getUserResults(session, {
            period: timeFilter,
            gameType: gameFilter !== "all" ? gameFilter : undefined,
          });

          if (resultsResponse.success) {
            setResults(resultsResponse.data || mockResults);
            setFilteredResults(resultsResponse.data || mockResults);
          } else {
            // Fallback to mock data if API fails
            setResults(mockResults);
            setFilteredResults(mockResults);
          }

          // Load risk score
          const riskResponse = await getUserRiskScore(session);
          if (riskResponse.success) {
            setRiskScore(riskResponse.data);
          } else {
            // Fallback to calculated risk score
            const avgScore =
              mockResults.reduce((sum, result) => sum + result.score, 0) /
              mockResults.length;
            setRiskScore({
              overall: Math.round(avgScore),
              trend: "stable",
              confidence: 85,
              lastUpdate: new Date().toISOString().split("T")[0],
            });
          }
        } else {
          // No session - use mock data
          setResults(mockResults);
          setFilteredResults(mockResults);
          const avgScore =
            mockResults.reduce((sum, result) => sum + result.score, 0) /
            mockResults.length;
          setRiskScore({
            overall: Math.round(avgScore),
            trend: "stable",
            confidence: 85,
            lastUpdate: new Date().toISOString().split("T")[0],
          });
        }
      } catch (error) {
        console.error("Error loading results:", error);
        // Fallback to mock data
        setResults(mockResults);
        setFilteredResults(mockResults);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [session]);

  // Filter and search results
  useEffect(() => {
    let filtered = results;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (result) =>
          result.gameType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.date.includes(searchTerm)
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((result) =>
        result.gameType.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date) - new Date(a.date);
        case "score":
          return b.score - a.score;
        case "type":
          return a.gameType.localeCompare(b.gameType);
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
  }, [results, searchTerm, filterType, sortBy]);

  // Download PDF report
  const downloadReport = async (resultId = null) => {
    try {
      // Replace with actual API call
      // const endpoint = resultId ? `/api/results/report/${resultId}` : '/api/results/report'
      // const response = await fetch(endpoint, {
      //   headers: { Authorization: `Bearer ${session.accessToken}` }
      // })
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = `cognitive-assessment-report-${resultId || 'all'}.pdf`
      // a.click()

      // Mock download
      alert("PDF report download would start here (mock implementation)");
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "very-low":
        return "text-green-600 bg-green-100";
      case "low":
        return "text-blue-600 bg-blue-100";
      case "moderate":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "very-high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getGameIcon = (gameType) => {
    switch (gameType) {
      case "Stroop Color Test":
        return "🎨";
      case "Memory Game":
        return "🧩";
      case "Object-Purpose Matching":
        return "🔗";
      case "Speech Fluency Test":
        return "🎤";
      default:
        return "🧠";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BarChart3 className="h-12 w-12 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Test Results & Analytics
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Track your cognitive assessment progress and performance
          </p>
        </div>

        {/* Risk Score Overview */}
        {riskScore && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {riskScore.overall}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2 capitalize">
                  {riskScore.trend}
                </div>
                <div className="text-sm text-gray-600">Trend</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {riskScore.confidence}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => downloadReport()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all inline-flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Full Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Tests</option>
                <option value="stroop">Stroop Test</option>
                <option value="memory">Memory Game</option>
                <option value="matching">Object Matching</option>
                <option value="speech">Speech Test</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {filteredResults.length} of {results.length} results
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4 mb-8">
          {filteredResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-3xl">{getGameIcon(result.gameType)}</div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {result.gameType}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                          result.riskLevel
                        )}`}
                      >
                        {result.riskLevel.replace("-", " ")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {result.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {result.time}
                      </span>
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {result.duration} min
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-indigo-600">
                          {result.score}
                        </div>
                        <div className="text-xs text-gray-600">Score</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {result.accuracy}%
                        </div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                      {result.reactionTime && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">
                            {result.reactionTime}ms
                          </div>
                          <div className="text-xs text-gray-600">
                            Reaction Time
                          </div>
                        </div>
                      )}
                      {result.fluency && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-purple-600">
                            {result.fluency}%
                          </div>
                          <div className="text-xs text-gray-600">Fluency</div>
                        </div>
                      )}
                      {result.attempts && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-orange-600">
                            {result.attempts}
                          </div>
                          <div className="text-xs text-gray-600">Attempts</div>
                        </div>
                      )}
                      {result.matches && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-cyan-600">
                            {result.matches}
                          </div>
                          <div className="text-xs text-gray-600">Matches</div>
                        </div>
                      )}
                    </div>

                    {result.improvements && result.improvements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Key Insights:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.improvements.map((improvement, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                            >
                              {improvement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadReport(result.id)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Download Report"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="More Options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Take your first cognitive assessment to see results here."}
            </p>
            <button
              onClick={() => router.push("/games")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all inline-flex items-center"
            >
              <Gamepad2 className="mr-2 h-4 w-4" />
              Start Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all inline-flex items-center justify-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </button>
          <button
            onClick={() => downloadReport()}
            className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all inline-flex items-center justify-center"
          >
            <FileText className="mr-2 h-4 w-4" />
            Download Full Report
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center items-center space-x-8 opacity-10">
          <Image src="/next.svg" alt="Next.js" width={40} height={40} />
          <Image src="/vercel.svg" alt="Vercel" width={40} height={40} />
          <Image src="/globe.svg" alt="Globe" width={40} height={40} />
        </div>
      </div>
    </div>
  );
}
