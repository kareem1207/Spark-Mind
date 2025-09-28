"use client";

import { useSession } from "next-auth/react";
import {
  AssessmentProvider,
  useAssessment,
  ASSESSMENT_STAGES,
} from "@/contexts/AssessmentContext";
import {
  Brain,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import MemoryTestComponent from "@/components/assessment/MemoryTestComponent";
import StroopTestComponent from "@/components/assessment/StroopTestComponent";
import ImageRecallComponent from "@/components/assessment/ImageRecallComponent";
import SpeechAssessmentComponent from "@/components/assessment/SpeechAssessmentComponent";
import AssessmentComplete from "@/components/assessment/AssessmentComplete";

function AssessmentFlow() {
  const { data: session } = useSession();
  const {
    currentStage,
    scores,
    audioRecordings,
    isSubmitting,
    error,
    submissionSuccess,
    nextStage,
    prevStage,
    submitAssessment,
    resetAssessment,
  } = useAssessment();

  const stages = [
    {
      key: ASSESSMENT_STAGES.MEMORY,
      title: "Memory Game",
      component: MemoryTestComponent,
    },
    {
      key: ASSESSMENT_STAGES.STROOP,
      title: "Stroop Test",
      component: StroopTestComponent,
    },
    {
      key: ASSESSMENT_STAGES.IMAGE_RECALL,
      title: "Image Recall",
      component: ImageRecallComponent,
    },
    {
      key: ASSESSMENT_STAGES.SPEECH,
      title: "Speech Assessment",
      component: SpeechAssessmentComponent,
    },
  ];

  const currentStageIndex = stages.findIndex(
    (stage) => stage.key === currentStage
  );
  const CurrentComponent = stages[currentStageIndex]?.component;

  const handleSubmit = async () => {
    if (session?.user?.email) {
      try {
        await submitAssessment(session.user.email);
      } catch (error) {
        console.error("Submission failed:", error);
      }
    }
  };

  // Show loading screen immediately when submitting or when submission is successful
  if (isSubmitting || submissionSuccess) {
    return <AssessmentComplete onReset={resetAssessment} />;
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="h-12 w-12" style={{ color: "#1e3a8a" }} />
            <h1 className="text-3xl font-bold text-gray-900">
              ForeKnow Assessment
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Complete all tests for comprehensive cognitive evaluation
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {currentStageIndex + 1}/{stages.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
                width: `${((currentStageIndex + 1) / stages.length) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            {stages.map((stage, index) => (
              <div key={stage.key} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStageIndex
                      ? "text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  style={
                    index <= currentStageIndex
                      ? {
                          background:
                            "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
                        }
                      : {}
                  }
                >
                  {index < currentStageIndex ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs mt-1 text-center max-w-16">
                  {stage.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Current Test Component */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          {CurrentComponent && <CurrentComponent />}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStage}
            disabled={currentStageIndex === 0}
            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStageIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </button>

          {currentStageIndex === stages.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-8 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Assessment"
              )}
            </button>
          ) : (
            <button
              onClick={nextStage}
              className="flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
              }}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentClient() {
  return (
    <AssessmentProvider>
      <AssessmentFlow />
    </AssessmentProvider>
  );
}
