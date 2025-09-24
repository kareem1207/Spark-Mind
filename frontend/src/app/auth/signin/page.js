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
                  <Brain className="h-12 w-12 text-indigo-600" />
                  <div className="absolute -inset-1 bg-indigo-100 rounded-full opacity-50 animate-pulse"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  SparkMind
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                Early Detection,
                <span className="text-indigo-600 block">Better Outcomes</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Advanced cognitive assessment system powered by AI to detect
                early signs of dementia through interactive games and
                comprehensive analysis.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <span className="text-gray-700">
                  Secure and confidential assessment
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Zap className="h-6 w-6 text-yellow-500" />
                </div>
                <span className="text-gray-700">
                  Quick 15-minute comprehensive test
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <span className="text-gray-700">
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

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your privacy is our priority. All
                assessment data is encrypted and processed securely according to
                HIPAA standards.
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-center items-center space-x-8 opacity-20">
          <Image src="/next.svg" alt="Next.js" width={60} height={60} />
          <Image src="/vercel.svg" alt="Vercel" width={60} height={60} />
          <Image src="/file.svg" alt="Secure" width={60} height={60} />
        </div>
      </div>
    </div>
  );
}
