"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Brain,
  Clock,
  TrendingUp,
  Trophy,
  Calendar,
  Download,
  Play,
  ArrowRight,
  BarChart3,
  Users,
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardClient({ session }) {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setDashboardData({
            user: {
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
              testsCompleted: 12,
              currentStreak: 7,
              lastAssessment: "2024-09-20",
            },
            riskScore: {
              current: 25,
              trend: -5,
              status: "Low Risk",
            },
            recentTests: [
              { date: "2024-09-20", score: 95, type: "Memory Game" },
              { date: "2024-09-18", score: 88, type: "Stroop Test" },
              { date: "2024-09-15", score: 92, type: "Speech Analysis" },
              { date: "2024-09-12", score: 87, type: "Object Matching" },
            ],
            progressData: [
              { month: "Jan", score: 85 },
              { month: "Feb", score: 87 },
              { month: "Mar", score: 89 },
              { month: "Apr", score: 88 },
              { month: "May", score: 92 },
              { month: "Jun", score: 94 },
            ],
            gameStats: [
              {
                name: "Memory Game",
                completed: 8,
                avgScore: 91,
                color: "#8B5CF6",
              },
              {
                name: "Stroop Test",
                completed: 6,
                avgScore: 85,
                color: "#06B6D4",
              },
              {
                name: "Object Matching",
                completed: 4,
                avgScore: 88,
                color: "#10B981",
              },
              {
                name: "Speech Analysis",
                completed: 3,
                avgScore: 87,
                color: "#F59E0B",
              },
            ],
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Brain className="h-16 w-16 text-indigo-600 animate-pulse mx-auto mb-4" />
            <div className="absolute -inset-2 bg-indigo-100 rounded-full opacity-50 animate-ping"></div>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={60}
                      height={60}
                      className="rounded-full ring-4 ring-indigo-100"
                    />
                  ) : (
                    <div className="w-15 h-15 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {dashboardData?.user?.name?.split(" ")[0]}!
                  </h1>
                  <p className="text-gray-600">
                    Your cognitive health journey continues. Ready for today's
                    assessment?
                  </p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/games"
                  className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/reports"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData?.riskScore?.current}%
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {Math.abs(dashboardData?.riskScore?.trend)}% improvement
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tests Completed
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData?.user?.testsCompleted}
                </p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Trophy className="h-4 w-4 mr-1" />
                  Personal best!
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Current Streak
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData?.user?.currentStreak}
                </p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Days in a row
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Last Assessment
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Date(
                    dashboardData?.user?.lastAssessment
                  ).toLocaleDateString("en-US", { day: "numeric" })}
                </p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(
                    dashboardData?.user?.lastAssessment
                  ).toLocaleDateString("en-US", { month: "short" })}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Progress Overview
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Average Score</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData?.progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#6366f1", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Game Statistics */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Game Performance
            </h3>
            <div className="space-y-4">
              {dashboardData?.gameStats?.map((game, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: game.color }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{game.name}</p>
                      <p className="text-sm text-gray-600">
                        {game.completed} tests completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {game.avgScore}%
                    </p>
                    <p className="text-sm text-gray-600">avg score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tests */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Recent Assessments
              </h3>
              <Link
                href="/results"
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData?.recentTests?.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        test.score >= 90
                          ? "bg-green-100"
                          : test.score >= 80
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      {test.score >= 90 ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : test.score >= 80 ? (
                        <Info className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{test.type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(test.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {test.score}%
                    </p>
                    <p
                      className={`text-sm ${
                        test.score >= 90
                          ? "text-green-600"
                          : test.score >= 80
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {test.score >= 90
                        ? "Excellent"
                        : test.score >= 80
                        ? "Good"
                        : "Needs attention"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <Link
                href="/games/stroop"
                className="block p-4 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-xl transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Brain className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Stroop Test</p>
                    <p className="text-sm text-gray-600">5 minutes</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/games/memory"
                className="block p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Trophy className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Memory Game</p>
                    <p className="text-sm text-gray-600">3 minutes</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/games/speech"
                className="block p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Speech Test</p>
                    <p className="text-sm text-gray-600">2 minutes</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/reports"
                className="block p-4 bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 rounded-xl transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <Download className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Generate Report</p>
                    <p className="text-sm text-gray-600">PDF download</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="mt-12 flex justify-center items-center space-x-8 opacity-10">
          <Image src="/next.svg" alt="Next.js" width={40} height={40} />
          <Image src="/vercel.svg" alt="Vercel" width={40} height={40} />
          <Image src="/file.svg" alt="Security" width={40} height={40} />
          <Image src="/window.svg" alt="Analytics" width={40} height={40} />
          <Image src="/globe.svg" alt="Global" width={40} height={40} />
        </div>
      </div>
    </div>
  );
}
