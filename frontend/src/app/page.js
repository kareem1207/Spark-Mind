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
      {/* Mindful Moment Hero Card */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 w-full h-full animate-gradient"
          style={{
            background:
              "linear-gradient(-45deg, #587c90, #2e4156, #1e3a8a, #0891b2)",
            backgroundSize: "400% 400%",
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 text-[#f3efec]">
          <div className="text-3xl sm:text-4xl lg:text-5xl leading-relaxed mb-8 font-medium">
            <div className="block mb-2">
              <span style={{ fontStyle: "italic", color: "#ffffff" }}>
                Forgot
              </span>{" "}
              <span style={{ color: "#d4cbc7" }}>where you left something</span>
              ??
            </div>
            <div className="block mb-2" style={{ color: "#f3efec" }}>
              <span style={{ color: "#d4cbc7" }}>
                Recognized someone but Name
              </span>{" "}
              <span style={{ fontStyle: "italic", color: "#ffffff" }}>
                Escapes
              </span>
              ??
            </div>
            <div className="block">
              <span style={{ color: "#d4cbc7" }}>Tasks felt</span>{" "}
              <span style={{ fontStyle: "italic", color: "#ffffff" }}>
                trickier
              </span>{" "}
              <span style={{ color: "#d4cbc7" }}>than usual</span>
              ??
            </div>
          </div>

          <div
            className="text-lg sm:text-xl max-w-lg mx-auto mb-12 opacity-90 leading-relaxed font-light"
            style={{ color: "#3efec" }}
          >
            We agree—life comes with little bumps. That's okay, we've got you.
            Take a moment for yourself. Explore, stay curious, and keep your
            mind active.
          </div>

          <div className="text-3xl animate-bounce">⬇</div>
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(10px);
            }
          }
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-bounce {
            animation: bounce 1.5s infinite;
          }
          .animate-gradient {
            animation: gradient 8s ease infinite;
          }
        `}</style>
      </section>

      {/* ForeKnow Hero Section */}
      <section className="relative py-20 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-early-spark-primary rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-early-spark-secondary rounded-full opacity-10 blur-3xl"></div>
          <Image
            src="/globe.svg"
            alt="Background decoration"
            width={300}
            height={300}
            className="absolute top-20 right-10 opacity-5"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Brain className="h-16 w-16" style={{ color: "#2e4156" }} />
                  <div
                    className="absolute -inset-2 rounded-full opacity-50 animate-pulse"
                    style={{ backgroundColor: "#c7d9e5" }}
                  ></div>
                </div>
                <span
                  className="text-4xl font-bold"
                  style={{ color: "#2e4156" }}
                >
                  ForeKnow
                </span>
              </div>

              {/* Sign In Button - Mobile Hidden, Desktop Shown */}
              {!session && (
                <div className="hidden md:block">
                  <Link
                    href="/auth/signin"
                    className="group px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #2e4156 0%, #587c90 100%)",
                    }}
                  >
                    Start Assessment
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>

            <div className="text-center">
              <h1
                className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                style={{ color: "#2e4156" }}
              >
                Early Detection for
                <span className="block" style={{ color: "#587c90" }}>
                  Better Outcomes
                </span>
              </h1>

              <p
                className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
                style={{ color: "#587c90" }}
              >
                Revolutionary AI-powered cognitive assessment system that
                detects early signs of dementia through engaging interactive
                games and comprehensive analysis.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="group px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #2e4156 0%, #587c90 100%)",
                    }}
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    {/* Mobile Sign In Button */}
                    <div className="md:hidden">
                      <Link
                        href="/auth/signin"
                        className="group px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #2e4156 0%, #587c90 100%)",
                        }}
                      >
                        Start Assessment
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <button
                      className="group bg-white px-8 py-4 rounded-xl font-semibold text-lg border-2 hover:opacity-90 transition-all inline-flex items-center shadow-lg hover:shadow-xl"
                      style={{
                        color: "#2e4156",
                        borderColor: "#2e4156",
                        backgroundColor: "#ffffff",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#c7d9e5")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#ffffff")
                      }
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </button>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: "#2e4156" }}
                  >
                    95%
                  </div>
                  <div style={{ color: "#587c90" }}>Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: "#2e4156" }}
                  >
                    1K+
                  </div>
                  <div style={{ color: "#587c90" }}>Healthcare Providers</div>
                </div>
                <div className="text-center">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: "#2e4156" }}
                  >
                    15min
                  </div>
                  <div style={{ color: "#587c90" }}>Assessment Time</div>
                </div>
                <div className="text-center">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: "#2e4156" }}
                  >
                    50K+
                  </div>
                  <div style={{ color: "#587c90" }}>Assessments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#2e4156" }}
            >
              Why Choose ForeKnow?
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: "#587c90" }}
            >
              Advanced technology meets clinical excellence to provide the most
              accurate and accessible cognitive assessment platform available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border transform hover:-translate-y-2"
                style={{ borderColor: "#c7d9e5" }}
                onMouseEnter={(e) => (e.target.style.borderColor = "#587c90")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#c7d9e5")}
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: "#c7d9e5" }}
                >
                  <feature.icon
                    className="h-6 w-6"
                    style={{ color: "#2e4156" }}
                  />
                </div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: "#2e4156" }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: "#587c90" }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-early-spark-navy mb-4">
              Cognitive Assessment Games
            </h2>
            <p className="text-xl text-early-spark-teal max-w-3xl mx-auto">
              Engaging, scientifically-validated games that assess different
              aspects of cognitive function in a fun and interactive way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {games.map((game, index) => (
              <div
                key={index}
                className="group relative p-6 bg-gradient-early-spark-neutral rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-early-spark-sky-blue hover:border-early-spark-teal transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-semibold text-early-spark-navy mb-2">
                  {game.name}
                </h3>
                <p className="text-early-spark-teal mb-4">{game.description}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      game.difficulty === "Easy"
                        ? "bg-early-spark-sky-blue text-early-spark-navy"
                        : "bg-early-spark-teal text-early-spark-white"
                    }`}
                  >
                    {game.difficulty}
                  </span>
                  <Clock className="h-4 w-4 text-early-spark-teal" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-early-spark-primary relative overflow-hidden">
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
          <h2 className="text-4xl font-bold text-early-spark-white mb-4">
            Ready to Take Control of Your Cognitive Health?
          </h2>
          <p className="text-xl text-early-spark-sky-blue mb-8">
            Join thousands of individuals and healthcare professionals who trust
            ForeKnow for early detection and prevention.
          </p>

          {!session && (
            <Link
              href="/auth/signin"
              className="group bg-early-spark-white text-early-spark-navy px-8 py-4 rounded-xl font-semibold text-lg hover:bg-early-spark-sky-blue transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-early-spark-navy text-early-spark-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-8 w-8 text-early-spark-sky-blue" />
                <span className="text-xl font-bold">ForeKnow</span>
              </div>
              <p className="text-early-spark-sky-blue mb-4">
                Advanced cognitive assessment system for early dementia
                detection. Empowering better health outcomes through technology.
              </p>
              <div className="flex space-x-4">
                <div
                  className="w-6 h-6 rounded-full opacity-60"
                  style={{ backgroundColor: "#0891b2" }}
                ></div>
                <div
                  className="w-6 h-6 rounded-full opacity-60"
                  style={{ backgroundColor: "#7dd3fc" }}
                ></div>
                <div
                  className="w-6 h-6 rounded-full opacity-60"
                  style={{ backgroundColor: "#bae6fd" }}
                ></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-early-spark-sky-blue">
                <li>
                  <a
                    href="#"
                    className="hover:text-early-spark-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-early-spark-white transition-colors"
                  >
                    Games
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-early-spark-white transition-colors"
                  >
                    Reports
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-early-spark-white transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-early-spark-sky-blue">
                <li>
                  <a
                    href="#"
                    className="hover:text-early-spark-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-early-spark-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-early-spark-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-early-spark-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-early-spark-teal pt-8 mt-8 text-center text-early-spark-sky-blue">
            <p>
              &copy; 2024 ForeKnow. All rights reserved. Built with Next.js and
              powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
