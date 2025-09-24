"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  User,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  BookOpen,
  Share2,
  Mail,
  ArrowRight,
  Home,
  Eye,
  Filter,
  Search,
} from "lucide-react";
import {
  generatePDFReport,
  downloadPDFReport,
  getUserResults,
} from "@/lib/api";

export default function ReportsClient({ session }) {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock reports data - replace with API calls
  const mockReports = [
    {
      id: 1,
      title: "Comprehensive Cognitive Assessment Report",
      type: "comprehensive",
      date: "2025-09-24",
      period: "last-30-days",
      status: "completed",
      summary: {
        overallScore: 87,
        riskLevel: "low",
        testsCompleted: 15,
        improvement: "+12%",
        confidence: 94,
      },
      sections: [
        "Executive Summary",
        "Cognitive Domain Analysis",
        "Performance Trends",
        "Risk Assessment",
        "Recommendations",
      ],
      fileSize: "2.4 MB",
    },
    {
      id: 2,
      title: "Weekly Progress Summary",
      type: "weekly",
      date: "2025-09-23",
      period: "this-week",
      status: "completed",
      summary: {
        overallScore: 85,
        riskLevel: "low",
        testsCompleted: 3,
        improvement: "+5%",
        confidence: 92,
      },
      sections: [
        "Week Overview",
        "Test Results Summary",
        "Performance Highlights",
        "Areas for Focus",
      ],
      fileSize: "1.2 MB",
    },
    {
      id: 3,
      title: "Stroop Test Analysis",
      type: "specific",
      date: "2025-09-22",
      period: "single-test",
      status: "completed",
      summary: {
        overallScore: 89,
        riskLevel: "very-low",
        testsCompleted: 1,
        improvement: "+8%",
        confidence: 96,
      },
      sections: [
        "Test Overview",
        "Response Time Analysis",
        "Accuracy Metrics",
        "Cognitive Flexibility Assessment",
      ],
      fileSize: "0.8 MB",
    },
    {
      id: 4,
      title: "Monthly Trend Analysis",
      type: "trend",
      date: "2025-09-20",
      period: "last-month",
      status: "completed",
      summary: {
        overallScore: 84,
        riskLevel: "low",
        testsCompleted: 28,
        improvement: "+15%",
        confidence: 93,
      },
      sections: [
        "Monthly Overview",
        "Performance Trends",
        "Comparative Analysis",
        "Long-term Projections",
      ],
      fileSize: "3.1 MB",
    },
  ];

  // Load reports
  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch('/api/results/reports', {
        //   headers: { Authorization: `Bearer ${session.accessToken}` }
        // })
        // const data = await response.json()

        // Mock delay for loading effect
        await new Promise((resolve) => setTimeout(resolve, 800));
        setReports(mockReports);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [session]);

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod =
      filterPeriod === "all" || report.period === filterPeriod;
    return matchesSearch && matchesPeriod;
  });

  // Download report
  const downloadReport = async (reportId) => {
    try {
      if (session) {
        const result = await downloadPDFReport(session, reportId);

        if (result.success) {
          const report = reports.find((r) => r.id === reportId);
          alert(`Downloaded "${report?.title}" PDF report successfully!`);
        } else {
          alert(`Error downloading report: ${result.error}`);
        }
      } else {
        alert("Please sign in to download reports.");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  // Generate new report
  const generateReport = async (type = "comprehensive") => {
    try {
      if (session) {
        setIsGenerating(true);
        const response = await generatePDFReport(session, type);

        if (response.success) {
          // Trigger download of the generated report
          const downloadResult = await downloadPDFReport(
            session,
            response.data.reportId
          );

          if (downloadResult.success) {
            alert("Report generated and downloaded successfully!");
            // Refresh reports list
            await loadReports();
          } else {
            alert(
              "Report generated but download failed. Check your downloads."
            );
          }
        } else {
          alert(`Error generating report: ${response.error}`);
        }
      } else {
        alert("Please sign in to generate reports.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportIcon = (type) => {
    switch (type) {
      case "comprehensive":
        return <BookOpen className="h-6 w-6" />;
      case "weekly":
        return <Calendar className="h-6 w-6" />;
      case "specific":
        return <Target className="h-6 w-6" />;
      case "trend":
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-blue-600 bg-blue-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "very-low":
        return "text-green-600";
      case "low":
        return "text-blue-600";
      case "moderate":
        return "text-yellow-600";
      case "high":
        return "text-orange-600";
      case "very-high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FileText className="h-12 w-12 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Assessment Reports
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Generate, view, and download detailed cognitive assessment reports
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Generate New Report
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => generateReport("comprehensive")}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-center"
            >
              <BookOpen className="h-8 w-8 text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-gray-900">Comprehensive</div>
              <div className="text-sm text-gray-600">Full analysis report</div>
            </button>
            <button
              onClick={() => generateReport("weekly")}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group text-center"
            >
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-gray-900">Weekly Summary</div>
              <div className="text-sm text-gray-600">Recent progress</div>
            </button>
            <button
              onClick={() => generateReport("trend")}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group text-center"
            >
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-gray-900">Trend Analysis</div>
              <div className="text-sm text-gray-600">Performance trends</div>
            </button>
            <button
              onClick={() => generateReport("specific")}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all group text-center"
            >
              <Target className="h-8 w-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-gray-900">Specific Test</div>
              <div className="text-sm text-gray-600">Single test analysis</div>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Periods</option>
                <option value="this-week">This Week</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-month">Last Month</option>
                <option value="single-test">Single Test</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {filteredReports.length} reports found
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4 mb-8">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                    {getReportIcon(report.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {report.date}
                      </span>
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {report.fileSize}
                      </span>
                      <span className="capitalize">{report.type} Report</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-indigo-600">
                          {report.summary.overallScore}
                        </div>
                        <div className="text-xs text-gray-600">
                          Overall Score
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div
                          className={`text-lg font-bold ${getRiskColor(
                            report.summary.riskLevel
                          )}`}
                        >
                          {report.summary.riskLevel.replace("-", " ")}
                        </div>
                        <div className="text-xs text-gray-600">Risk Level</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {report.summary.testsCompleted}
                        </div>
                        <div className="text-xs text-gray-600">
                          Tests Completed
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {report.summary.improvement}
                        </div>
                        <div className="text-xs text-gray-600">Improvement</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {report.summary.confidence}%
                        </div>
                        <div className="text-xs text-gray-600">Confidence</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Report Sections:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {report.sections.map((section, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Preview Report"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Share Report"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => downloadReport(report.id)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download Report"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Reports Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterPeriod !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Generate your first report to see it here."}
            </p>
            <button
              onClick={() => generateReport("comprehensive")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all inline-flex items-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
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
            onClick={() => router.push("/results")}
            className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all inline-flex items-center justify-center"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            View Test Results
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
