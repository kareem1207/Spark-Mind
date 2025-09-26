"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  Clock,
  Target,
  ArrowRight,
  Trophy,
  Gamepad2,
  Play,
  Star,
  Award,
  Zap,
} from "lucide-react";

export default function GamesClient({ session }) {
  const games = [
    {
      id: "stroop",
      title: "Stroop Color Test",
      description:
        "Test cognitive flexibility and processing speed by identifying colors while ignoring text.",
      icon: "🎨",
      difficulty: "Medium",
      duration: "5 minutes",
      color: "from-early-spark-navy to-early-spark-teal",
      bgColor: "from-early-spark-beige to-early-spark-white",
      features: ["Reaction Time", "Cognitive Flexibility", "Attention Control"],
      href: "/games/stroop",
    },
    {
      id: "memory",
      title: "Memory Game",
      description:
        "Evaluate working memory and pattern recognition through card matching challenges.",
      icon: "🧩",
      difficulty: "Easy",
      duration: "3-8 minutes",
      color: "from-early-spark-teal to-early-spark-sky-blue",
      bgColor: "from-early-spark-sky-blue to-early-spark-white",
      features: ["Working Memory", "Pattern Recognition", "Visual Processing"],
      href: "/games/memory",
    },
    {
      id: "matching",
      title: "Object-Purpose Matching",
      description:
        "Assess semantic memory by matching objects with their intended purposes.",
      icon: "🔗",
      difficulty: "Medium",
      duration: "4 minutes",
      color: "from-early-spark-navy to-early-spark-teal",
      bgColor: "from-early-spark-beige to-early-spark-sky-blue",
      features: ["Semantic Memory", "Visual Recognition", "Logical Reasoning"],
      href: "/games/matching",
    },
    {
      id: "speech",
      title: "Speech Analysis Test",
      description:
        "Analyze speech patterns, fluency, and language processing capabilities.",
      icon: "🎤",
      difficulty: "Easy",
      duration: "2 minutes",
      color: "from-early-spark-teal to-early-spark-sky-blue",
      bgColor: "from-early-spark-sky-blue to-early-spark-beige",
      features: ["Speech Fluency", "Language Processing", "Verbal Memory"],
      href: "/games/speech",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-early-spark-sky-blue text-early-spark-navy";
      case "Medium":
        return "bg-early-spark-teal text-early-spark-white";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-early-spark-beige text-early-spark-teal";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-early-spark-neutral py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Gamepad2 className="h-12 w-12 text-early-spark-navy" />
            <h1 className="text-4xl font-bold text-early-spark-navy">
              Cognitive Assessment Games
            </h1>
          </div>
          <p className="text-xl text-early-spark-teal max-w-3xl mx-auto">
            Choose from our scientifically-validated games to assess different
            aspects of your cognitive function. Each game targets specific
            cognitive domains and provides detailed performance analytics.
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="relative">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={50}
                    height={50}
                    className="rounded-full ring-3 ring-indigo-100"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Ready for your assessment, {session.user?.name?.split(" ")[0]}
                  ?
                </h2>
                <p className="text-gray-600">
                  Complete all games for the most comprehensive analysis
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4" />
                <span>Track Progress</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" />
                <span>~15 min total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {games.map((game) => (
            <div
              key={game.id}
              className={`group relative bg-gradient-to-br ${game.bgColor} rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              {/* Game Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">{game.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {game.title}
                    </h3>
                    <p className="text-gray-600">{game.description}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                      game.difficulty
                    )}`}
                  >
                    {game.difficulty}
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {game.duration}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  What it measures:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {game.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/60 text-gray-700 rounded-lg text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={game.href}
                className="group/btn inline-flex items-center justify-center w-full px-6 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all transform group-hover:scale-105 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #2e4156 0%, #587c90 100%)",
                }}
              >
                <Play className="mr-2 h-5 w-5" />
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-10">
                <Target className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Assessment Tips */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <Star className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Assessment Tips
            </h2>
            <p className="text-gray-600">
              Get the most accurate results with these recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              className="text-center p-6 rounded-xl"
              style={{ backgroundColor: "#c7d9e5" }}
            >
              <Brain
                className="h-8 w-8 mx-auto mb-3"
                style={{ color: "#2e4156" }}
              />
              <h3 className="font-semibold mb-2" style={{ color: "#2e4156" }}>
                Stay Focused
              </h3>
              <p className="text-sm" style={{ color: "#587c90" }}>
                Find a quiet environment and minimize distractions for the most
                accurate assessment.
              </p>
            </div>

            <div
              className="text-center p-6 rounded-xl"
              style={{ backgroundColor: "#f3efec" }}
            >
              <Zap
                className="h-8 w-8 mx-auto mb-3"
                style={{ color: "#587c90" }}
              />
              <h3 className="font-semibold mb-2" style={{ color: "#2e4156" }}>
                Be Natural
              </h3>
              <p className="text-sm" style={{ color: "#587c90" }}>
                Respond naturally and don't overthink. Your first instinct is
                often the most telling.
              </p>
            </div>

            <div
              className="text-center p-6 rounded-xl"
              style={{ backgroundColor: "#c7d9e5" }}
            >
              <Award
                className="h-8 w-8 mx-auto mb-3"
                style={{ color: "#2e4156" }}
              />
              <h3 className="font-semibold mb-2" style={{ color: "#2e4156" }}>
                Complete Series
              </h3>
              <p className="text-sm" style={{ color: "#587c90" }}>
                Take all assessments in one session for the most comprehensive
                cognitive profile.
              </p>
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
