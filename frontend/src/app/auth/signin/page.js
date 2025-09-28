"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Brain, Shield, Zap, Users, ArrowRight } from "lucide-react";

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding and Features */}
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
                <div className="relative">
                  <Brain className="h-12 w-12" style={{ color: "#2e4156" }} />
                  <div
                    className="absolute -inset-1 rounded-full opacity-50 animate-pulse"
                    style={{ backgroundColor: "#c7d9e5" }}
                  ></div>
                </div>
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#2e4156" }}
                >
                  ForeKnow
                </span>
              </div>
              <h1
                className="text-4xl font-extrabold mb-4"
                style={{ color: "#2e4156" }}
              >
                Early Detection,
                <span className="block" style={{ color: "#587c90" }}>
                  Better Outcomes
                </span>
              </h1>
              <p className="text-lg mb-8" style={{ color: "#587c90" }}>
                Advanced cognitive assessment system powered by AI to detect
                early signs of dementia through interactive games and
                comprehensive analysis.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6" style={{ color: "#587c90" }} />
                </div>
                <span style={{ color: "#2e4156" }}>
                  Secure and confidential assessment
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Zap className="h-6 w-6" style={{ color: "#587c90" }} />
                </div>
                <span style={{ color: "#2e4156" }}>
                  Quick 15-minute comprehensive test
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6" style={{ color: "#587c90" }} />
                </div>
                <span style={{ color: "#2e4156" }}>
                  Trusted by healthcare professionals
                </span>
              </div>
            </div>

            {/* Decorative SVG Elements */}
            <div className="hidden md:block">
              <div className="relative">
                <Image
                  src="/globe.svg"
                  alt="Global network"
                  width={200}
                  height={200}
                  className="opacity-10 absolute -top-20 -right-10"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to continue your cognitive health journey
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center px-6 py-4 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group"
            >
              <Image
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-3"
              />
              <span>Continue with Google</span>
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div
              className="mt-8 p-4 rounded-lg border"
              style={{ backgroundColor: "#f0f9ff", borderColor: "#bae6fd" }}
            >
              <p className="text-sm" style={{ color: "#1e3a8a" }}>
                <strong>Note:</strong> Your privacy is our priority. All
                assessment data is encrypted and processed securely according to
                HIPAA standards.
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <a
                  href="#"
                  style={{ color: "#0891b2" }}
                  className="hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  style={{ color: "#0891b2" }}
                  className="hover:underline"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-center items-center space-x-8 opacity-10">
          <div
            className="w-16 h-16 rounded-full"
            style={{ backgroundColor: "#e0f2fe" }}
          ></div>
          <div
            className="w-12 h-12 rounded-full"
            style={{ backgroundColor: "#bae6fd" }}
          ></div>
          <div
            className="w-20 h-20 rounded-full"
            style={{ backgroundColor: "#f0f9ff" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
