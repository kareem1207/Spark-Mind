"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Mic,
  MicOff,
  Clock,
  Play,
  Pause,
  Square,
  ArrowRight,
  Home,
  RotateCcw,
  CheckCircle,
  Trophy,
  Volume2,
  FileAudio,
  Brain,
  Zap,
  Target,
  MessageSquare,
} from "lucide-react";
import { uploadSpeechRecording, requestSentimentAnalysis } from "@/lib/api";

export default function SpeechTestClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [gameState, setGameState] = useState("instructions"); // instructions, setup, recording, completed
  const [currentTask, setCurrentTask] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [gameResults, setGameResults] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [taskStartTime, setTaskStartTime] = useState(null);

  const recordingRef = useRef(null);

  // Speech tasks organized by type
  const speechTasks = [
    {
      id: 1,
      type: "description",
      title: "Picture Description",
      prompt:
        "Describe what you see in this picture in as much detail as possible.",
      instruction:
        "Look at the image and describe everything you observe - objects, people, actions, colors, and setting.",
      timeLimit: 60,
      image: "🏞️", // Placeholder emoji
      criteria: ["Fluency", "Vocabulary", "Detail", "Organization"],
    },
    {
      id: 2,
      type: "narrative",
      title: "Story Telling",
      prompt: "Tell me about a memorable vacation or trip you have taken.",
      instruction:
        "Share a story about a place you visited - where you went, what you did, and what made it special.",
      timeLimit: 90,
      image: "✈️",
      criteria: [
        "Narrative Structure",
        "Memory Recall",
        "Coherence",
        "Emotional Expression",
      ],
    },
    {
      id: 3,
      type: "instruction",
      title: "Process Explanation",
      prompt: "Explain how to make your favorite meal or dish.",
      instruction:
        "Walk me through the steps of preparing something you like to cook or eat.",
      timeLimit: 75,
      image: "👨‍🍳",
      criteria: [
        "Sequential Thinking",
        "Clarity",
        "Completeness",
        "Logical Order",
      ],
    },
    {
      id: 4,
      type: "opinion",
      title: "Opinion Expression",
      prompt: "What do you think about the role of technology in modern life?",
      instruction:
        "Share your thoughts and opinions about how technology affects our daily lives.",
      timeLimit: 90,
      image: "💻",
      criteria: [
        "Abstract Thinking",
        "Argumentation",
        "Vocabulary Range",
        "Perspective",
      ],
    },
  ];

  // Initialize audio recording
  const initializeRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      setAudioStream(stream);

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      let chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(blob);
        const duration = Date.now() - taskStartTime;

        setRecordings((prev) => [
          ...prev,
          {
            taskId: currentTask,
            taskTitle: speechTasks[currentTask].title,
            blob,
            audioUrl,
            duration: Math.floor(duration / 1000),
            timestamp: new Date().toISOString(),
          },
        ]);

        chunks = [];
      };

      setMediaRecorder(recorder);
      setGameState("recording");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setFeedback({
        type: "error",
        message: "Microphone access required",
        description:
          "Please allow microphone access to continue with the speech test.",
      });
    }
  };

  // Start recording
  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      setIsRecording(true);
      setRecordingTime(0);
      setTaskStartTime(Date.now());
      mediaRecorder.start(1000); // Collect data every second

      // Start timer
      recordingRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          const timeLimit = speechTasks[currentTask].timeLimit;

          // Auto-stop when time limit reached
          if (newTime >= timeLimit) {
            stopRecording(true);
          }

          return newTime;
        });
      }, 1000);
    }
  };

  // Stop recording
  const stopRecording = (autoStop = false) => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      setIsRecording(false);
      mediaRecorder.stop();

      if (recordingRef.current) {
        clearInterval(recordingRef.current);
      }

      setFeedback({
        type: "success",
        message: autoStop
          ? "Time limit reached - Recording saved!"
          : "Recording completed!",
        description: `Task ${
          currentTask + 1
        } recorded successfully. Duration: ${recordingTime}s`,
      });

      // Move to next task or complete test
      setTimeout(() => {
        if (currentTask < speechTasks.length - 1) {
          setCurrentTask((prev) => prev + 1);
          setRecordingTime(0);
          setFeedback(null);
        } else {
          completeTest();
        }
      }, 2000);
    }
  };

  // Complete test
  const completeTest = () => {
    const totalDuration = recordings.reduce(
      (sum, rec) => sum + rec.duration,
      0
    );
    const averageTaskTime = totalDuration / recordings.length;

    // Calculate basic metrics
    const completionRate = (recordings.length / speechTasks.length) * 100;
    const timeEfficiency =
      (recordings.filter(
        (rec) =>
          rec.duration >=
          speechTasks.find((task) => task.id === rec.taskId + 1)?.timeLimit *
            0.3
      ).length /
        recordings.length) *
      100;

    const finalResults = {
      recordings,
      totalTasks: speechTasks.length,
      completedTasks: recordings.length,
      totalDuration,
      averageTaskTime: Math.round(averageTaskTime),
      completionRate: Math.round(completionRate),
      timeEfficiency: Math.round(timeEfficiency),
      gameType: "Speech Fluency Test",
    };

    setGameResults(finalResults);

    // Submit recordings to backend
    if (session && recordings.length > 0) {
      recordings.forEach((recording, index) => {
        const taskData = {
          taskType: "speech-fluency",
          prompt: speechTasks[recording.taskId]?.prompt || "Speech task",
          duration: recording.duration,
        };

        uploadSpeechRecording(recording.blob, taskData, session).then(
          (result) => {
            if (result.success) {
              console.log(`Recording ${index + 1} uploaded successfully`);

              // Request sentiment analysis if text analysis is available
              if (recording.transcription) {
                requestSentimentAnalysis(
                  {
                    text: recording.transcription,
                    context: "speech-fluency-test",
                  },
                  session
                );
              }
            } else {
              console.error(
                `Failed to upload recording ${index + 1}:`,
                result.error
              );
            }
          }
        );
      });
    }

    // Cleanup
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
    }

    setGameState("completed");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        clearInterval(recordingRef.current);
      }
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioStream]);

  // Save results and navigate
  const saveAndContinue = async () => {
    try {
      console.log("Speech test results:", gameResults);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  if (gameState === "instructions") {
    return (
      <div
        className="min-h-screen py-8"
        style={{
          background:
            "linear-gradient(135deg, #f7fafc 0%, #e2e8f0 50%, #cbd5e0 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Mic className="h-12 w-12" style={{ color: "#1e3a8a" }} />
              <h1 className="text-3xl font-bold text-gray-900">
                Speech Fluency Test
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Assess your verbal communication and cognitive fluency
            </p>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              How This Test Works
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Four Speaking Tasks
                  </h3>
                  <p className="text-gray-600">
                    You'll complete 4 different speaking tasks, each designed to
                    assess different aspects of your verbal abilities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Timed Recording
                  </h3>
                  <p className="text-gray-600">
                    Each task has a time limit. Speak clearly and naturally -
                    you can stop early if you finish your response.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Analysis & Feedback
                  </h3>
                  <p className="text-gray-600">
                    Your recordings will be analyzed for fluency, vocabulary,
                    coherence, and other speech characteristics.
                  </p>
                </div>
              </div>
            </div>

            {/* Task Preview */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Task Types:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🏞️</div>
                  <div>
                    <div className="font-medium">Picture Description</div>
                    <div className="text-gray-600">Describe visual scenes</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">✈️</div>
                  <div>
                    <div className="font-medium">Story Telling</div>
                    <div className="text-gray-600">
                      Share personal experiences
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">👨‍🍳</div>
                  <div>
                    <div className="font-medium">Process Explanation</div>
                    <div className="text-gray-600">
                      Explain step-by-step procedures
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💻</div>
                  <div>
                    <div className="font-medium">Opinion Expression</div>
                    <div className="text-gray-600">
                      Share thoughts and perspectives
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Volume2 className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Important:</h4>
                  <p className="text-yellow-700 text-sm">
                    This test requires microphone access. Please ensure you're
                    in a quiet environment and speak clearly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={initializeRecording}
              className="group text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
                boxShadow: "0 4px 20px rgba(30, 58, 138, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, #1e40af 0%, #0e7490 100%)";
                e.target.style.boxShadow = "0 8px 30px rgba(30, 58, 138, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)";
                e.target.style.boxShadow = "0 4px 20px rgba(30, 58, 138, 0.3)";
              }}
            >
              <Mic className="mr-2 h-5 w-5" />
              Start Speech Test
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center items-center space-x-8 opacity-10">
            <Image src="/next.svg" alt="Next.js" width={40} height={40} />
            <Image src="/file.svg" alt="File" width={40} height={40} />
            <Image src="/window.svg" alt="Window" width={40} height={40} />
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Trophy className="h-12 w-12 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Speech Test Complete!
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Your verbal communication has been assessed
            </p>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Your Results
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {gameResults?.completedTasks}
                </div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {gameResults?.totalDuration}s
                </div>
                <div className="text-sm text-gray-600">Total Speaking</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {gameResults?.averageTaskTime}s
                </div>
                <div className="text-sm text-gray-600">Avg per Task</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {gameResults?.completionRate}%
                </div>
                <div className="text-sm text-gray-600">Completion</div>
              </div>
            </div>

            {/* Recordings Summary */}
            <div className="p-6 bg-gray-50 rounded-xl mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Recording Summary
              </h3>
              <div className="space-y-3">
                {gameResults?.recordings.map((recording, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <FileAudio className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {recording.taskTitle}
                        </div>
                        <div className="text-sm text-gray-600">
                          Duration: {recording.duration}s
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Recorded</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">
                Performance Indicators
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {gameResults?.completionRate === 100 && (
                  <p className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Perfect completion! You finished all speaking tasks.
                  </p>
                )}
                {gameResults?.timeEfficiency >= 70 && (
                  <p className="flex items-center text-blue-600">
                    <Target className="h-4 w-4 mr-2" />
                    Good time management - adequate response length for each
                    task.
                  </p>
                )}
                {gameResults?.averageTaskTime >= 30 && (
                  <p className="flex items-center text-purple-600">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Detailed responses - you provided comprehensive answers.
                  </p>
                )}
                <p className="flex items-center text-gray-600">
                  <Brain className="h-4 w-4 mr-2" />
                  Recordings are ready for detailed fluency analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all inline-flex items-center justify-center"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Take Again
            </button>
            <button
              onClick={saveAndContinue}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center justify-center"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Recording state
  const currentTaskData = speechTasks[currentTask];
  const progressPercentage = ((currentTask + 1) / speechTasks.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Mic className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Speech Fluency Test
                </h1>
                <p className="text-sm text-gray-600">
                  Task {currentTask + 1} of {speechTasks.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.floor(progressPercentage)}%
              </div>
              <div className="text-xs text-gray-600">Complete</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Task */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{currentTaskData.image}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentTaskData.title}
            </h2>
            <p className="text-gray-600 mb-4">{currentTaskData.instruction}</p>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="font-semibold text-blue-900 text-lg">
                "{currentTaskData.prompt}"
              </p>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {recordingTime}s
                </div>
                <div className="text-sm text-gray-600">Recording Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currentTaskData.timeLimit}s
                </div>
                <div className="text-sm text-gray-600">Time Limit</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="group bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  <Mic className="mr-2 h-6 w-6" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={() => stopRecording(false)}
                  className="group bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  <Square className="mr-2 h-6 w-6" />
                  Stop Recording
                </button>
              )}
            </div>

            {isRecording && (
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="font-semibold">Recording in progress...</span>
              </div>
            )}

            {/* Time Progress Bar */}
            {isRecording && (
              <div className="w-full max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (recordingTime / currentTaskData.timeLimit) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0s</span>
                  <span>{currentTaskData.timeLimit}s</span>
                </div>
              </div>
            )}
          </div>

          {/* Assessment Criteria */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">
              This task assesses:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {currentTaskData.criteria.map((criterion, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">{criterion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center ${
              feedback.type === "success"
                ? "border-green-200"
                : "border-red-200"
            }`}
          >
            <div
              className={`inline-flex items-center space-x-2 mb-2 ${
                feedback.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
              <span className="font-semibold">{feedback.message}</span>
            </div>
            <p className="text-gray-600 text-sm">{feedback.description}</p>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center items-center space-x-8 opacity-10">
          <Image src="/globe.svg" alt="Globe" width={40} height={40} />
          <Image src="/vercel.svg" alt="Vercel" width={40} height={40} />
        </div>
      </div>
    </div>
  );
}
