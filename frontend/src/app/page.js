"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Brain,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  BarChart3,
  Clock,
  Award,
} from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assessment",
      description:
        "Advanced machine learning algorithms analyze cognitive patterns with 95% accuracy",
    },
    {
      icon: Zap,
      title: "Quick & Easy",
      description:
        "Complete comprehensive assessment in just 15 minutes from anywhere",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "HIPAA-compliant security with end-to-end encryption of all health data",
    },
    {
      icon: Users,
      title: "Professional Trust",
      description: "Used by over 1,000 healthcare professionals worldwide",
    },
  ];

  const games = [
    {
      name: "Stroop Color Test",
      description: "Test cognitive flexibility and processing speed",
      icon: "🎨",
      difficulty: "Medium",
    },
    {
      name: "Memory Game",
      description: "Evaluate working memory and pattern recognition",
      icon: "🧩",
      difficulty: "Easy",
    },
    {
      name: "Object Matching",
      description: "Assess semantic memory and visual processing",
      icon: "🔗",
      difficulty: "Medium",
    },
    {
      name: "Speech Analysis",
      description: "Analyze speech patterns and language fluency",
      icon: "🎤",
      difficulty: "Easy",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-400 to-cyan-600 rounded-full opacity-10 blur-3xl"></div>
          <Image
            src="/globe.svg"
            alt="Background decoration"
            width={300}
            height={300}
            className="absolute top-20 right-10 opacity-5"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="relative">
                <Brain className="h-16 w-16 text-indigo-600" />
                <div className="absolute -inset-2 bg-indigo-100 rounded-full opacity-50 animate-pulse"></div>
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SparkMind
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Early Detection for
              <span className="block text-indigo-600">Better Outcomes</span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI-powered cognitive assessment system that detects
              early signs of dementia through engaging interactive games and
              comprehensive analysis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {session ? (
                <Link
                  href="/dashboard"
                  className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
                  >
                    Start Assessment
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="group bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-all inline-flex items-center shadow-lg hover:shadow-xl">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  95%
                </div>
                <div className="text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  1K+
                </div>
                <div className="text-gray-600">Healthcare Providers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  15min
                </div>
                <div className="text-gray-600">Assessment Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  50K+
                </div>
                <div className="text-gray-600">Assessments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SparkMind?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets clinical excellence to provide the most
              accurate and accessible cognitive assessment platform available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cognitive Assessment Games
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Engaging, scientifically-validated games that assess different
              aspects of cognitive function in a fun and interactive way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {games.map((game, index) => (
              <div
                key={index}
                className="group relative p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {game.name}
                </h3>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      game.difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {game.difficulty}
                  </span>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/next.svg"
            alt="Background decoration"
            width={200}
            height={200}
            className="absolute top-10 left-10 opacity-10"
          />
          <Image
            src="/vercel.svg"
            alt="Background decoration"
            width={150}
            height={150}
            className="absolute bottom-10 right-10 opacity-10"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Take Control of Your Cognitive Health?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of individuals and healthcare professionals who trust
            SparkMind for early detection and prevention.
          </p>

          {!session && (
            <Link
              href="/auth/signin"
              className="group bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-8 w-8 text-indigo-400" />
                <span className="text-xl font-bold">SparkMind</span>
              </div>
              <p className="text-gray-400 mb-4">
                Advanced cognitive assessment system for early dementia
                detection. Empowering better health outcomes through technology.
              </p>
              <div className="flex space-x-4">
                <Image
                  src="/file.svg"
                  alt="Security"
                  width={24}
                  height={24}
                  className="opacity-60"
                />
                <Image
                  src="/window.svg"
                  alt="Analytics"
                  width={24}
                  height={24}
                  className="opacity-60"
                />
                <Image
                  src="/globe.svg"
                  alt="Global"
                  width={24}
                  height={24}
                  className="opacity-60"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Games
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Reports
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>
              &copy; 2024 SparkMind. All rights reserved. Built with Next.js and
              powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
