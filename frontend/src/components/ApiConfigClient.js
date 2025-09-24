"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Settings,
  Server,
  Database,
  Zap,
  CheckCircle,
  AlertCircle,
  Home,
  ArrowRight,
  Save,
  TestTube,
  Wifi,
  WifiOff,
  Key,
  Globe,
} from "lucide-react";
import { checkBackendHealth, testAllEndpoints } from "@/lib/api";

export default function ApiConfigClient({ session }) {
  const router = useRouter();
  const [config, setConfig] = useState({
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
    openaiApiKey: "",
    firebaseConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    },
  });
  const [connectionStatus, setConnectionStatus] = useState({
    backend: "checking",
    openai: "unchecked",
    firebase: "unchecked",
  });
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/health`);
      if (response.ok) {
        setConnectionStatus((prev) => ({ ...prev, backend: "connected" }));
        return true;
      } else {
        setConnectionStatus((prev) => ({ ...prev, backend: "error" }));
        return false;
      }
    } catch (error) {
      setConnectionStatus((prev) => ({ ...prev, backend: "error" }));
      return false;
    }
  };

  // Test API endpoints
  const testApiEndpoints = async () => {
    setIsTesting(true);

    try {
      // Use the API utilities to test all endpoints
      const results = await testAllEndpoints(session);
      setTestResults(results);

      // Also test backend health
      const healthResult = await checkBackendHealth();
      setConnectionStatus(
        healthResult.status === "connected" ? "connected" : "disconnected"
      );
    } catch (error) {
      console.error("Error testing endpoints:", error);
      setConnectionStatus("disconnected");
      setTestResults({
        "Health Check": false,
        "Game Results": false,
        "Risk Score": false,
        "User Results": false,
      });
    }

    setIsTesting(false);
  };

  // Save configuration
  const saveConfiguration = async () => {
    try {
      console.log("Configuration saved:", config);
      // In a real app, this would save to a backend or local storage
      alert("Configuration saved successfully!");
    } catch (error) {
      console.error("Error saving configuration:", error);
      alert("Error saving configuration");
    }
  };

  // Initial connection test
  useEffect(() => {
    testBackendConnection();
  }, [config.backendUrl]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "checking":
        return (
          <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return <Wifi className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "error":
        return "Connection Failed";
      case "checking":
        return "Checking...";
      default:
        return "Not Tested";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "checking":
        return "text-blue-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Settings className="h-12 w-12 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              API Configuration
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Configure and test your backend services and API connections
          </p>
        </div>

        {/* Connection Status Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Connection Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Server className="h-6 w-6 text-gray-600" />
                <span className="font-medium">Backend API</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${getStatusColor(
                  connectionStatus.backend
                )}`}
              >
                {getStatusIcon(connectionStatus.backend)}
                <span className="text-sm font-medium">
                  {getStatusText(connectionStatus.backend)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Key className="h-6 w-6 text-gray-600" />
                <span className="font-medium">OpenAI API</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${getStatusColor(
                  connectionStatus.openai
                )}`}
              >
                {getStatusIcon(connectionStatus.openai)}
                <span className="text-sm font-medium">
                  {getStatusText(connectionStatus.openai)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-gray-600" />
                <span className="font-medium">Firebase</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${getStatusColor(
                  connectionStatus.firebase
                )}`}
              >
                {getStatusIcon(connectionStatus.firebase)}
                <span className="text-sm font-medium">
                  {getStatusText(connectionStatus.firebase)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Server className="h-5 w-5 mr-2" />
            Backend Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backend URL
              </label>
              <input
                type="url"
                value={config.backendUrl}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, backendUrl: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="http://localhost:8000"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>Make sure your Python backend is running on this URL</span>
            </div>
          </div>
        </div>

        {/* API Keys Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Key className="h-5 w-5 mr-2" />
            API Keys
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={config.openaiApiKey}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    openaiApiKey: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="sk-..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for AI analysis and speech processing
              </p>
            </div>
          </div>
        </div>

        {/* Firebase Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Firebase Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="text"
                value={config.firebaseConfig.apiKey}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    firebaseConfig: {
                      ...prev.firebaseConfig,
                      apiKey: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Firebase API Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project ID
              </label>
              <input
                type="text"
                value={config.firebaseConfig.projectId}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    firebaseConfig: {
                      ...prev.firebaseConfig,
                      projectId: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Firebase Project ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auth Domain
              </label>
              <input
                type="text"
                value={config.firebaseConfig.authDomain}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    firebaseConfig: {
                      ...prev.firebaseConfig,
                      authDomain: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="project-id.firebaseapp.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App ID
              </label>
              <input
                type="text"
                value={config.firebaseConfig.appId}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    firebaseConfig: {
                      ...prev.firebaseConfig,
                      appId: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Firebase App ID"
              />
            </div>
          </div>
        </div>

        {/* API Testing */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TestTube className="h-5 w-5 mr-2" />
            API Testing
          </h2>
          <p className="text-gray-600 mb-4">
            Test your backend API endpoints to ensure they're working correctly.
          </p>

          <button
            onClick={testApiEndpoints}
            disabled={isTesting}
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <TestTube className="mr-2 h-4 w-4" />
            )}
            {isTesting ? "Testing..." : "Test All Endpoints"}
          </button>

          {Object.keys(testResults).length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-gray-900">Test Results:</h3>
              {Object.entries(testResults).map(([endpoint, success]) => (
                <div
                  key={endpoint}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium capitalize">
                    {endpoint.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <div
                    className={`flex items-center space-x-2 ${
                      success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {success ? "Working" : "Failed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={saveConfiguration}
            className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all inline-flex items-center justify-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
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
