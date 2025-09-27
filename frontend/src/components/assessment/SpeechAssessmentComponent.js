"use client";

import { useState, useRef, useEffect } from "react";
import { useAssessment } from "@/contexts/AssessmentContext";
import { Mic, MicOff, Play, Square, RotateCcw, Volume2 } from "lucide-react";

export default function SpeechAssessmentComponent() {
  const { setAudioRecording, audioRecordings } = useAssessment();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionError, setPermissionError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const questions = [
    {
      id: 1,
      question:
        "Please describe what you had for breakfast today and why you chose those foods.",
      audioKey: "audio_q1",
    },
    {
      id: 2,
      question:
        "Tell me about your favorite childhood memory and why it's special to you.",
      audioKey: "audio_q2",
    },
    {
      id: 3,
      question: "Describe the weather today and how it makes you feel.",
      audioKey: "audio_q3",
    },
    {
      id: 4,
      question:
        "What are your plans for this weekend? Please provide some details.",
      audioKey: "audio_q4",
    },
  ];

  // Request microphone permission on component mount
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setHasPermission(true);
        stream.getTracks().forEach((track) => track.stop()); // Stop the stream, we just needed permission
      } catch (error) {
        console.error("Error requesting microphone permission:", error);
        setPermissionError(
          "Microphone access is required for this test. Please grant permission and refresh."
        );
      }
    };

    requestPermission();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioRecording(questions[currentQuestion].audioKey, audioBlob);

        // Clean up stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setPermissionError(
        "Could not start recording. Please check your microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    const audioBlob = audioRecordings[questions[currentQuestion].audioKey];
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);

      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioRecording(questions[currentQuestion].audioKey, null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setRecordingTime(0);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (permissionError) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <MicOff className="h-8 w-8 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            Microphone Access Required
          </h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <p className="text-red-800">{permissionError}</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Mic className="h-8 w-8" style={{ color: "#1e3a8a" }} />
          <h2 className="text-2xl font-bold text-gray-900">
            Requesting Microphone Access...
          </h2>
        </div>

        <div className="animate-pulse bg-gray-100 rounded-xl p-8">
          <p className="text-gray-600">
            Please allow microphone access to continue with the speech
            assessment.
          </p>
        </div>
      </div>
    );
  }

  const currentAudio = audioRecordings[questions[currentQuestion].audioKey];
  const totalAnswered = Object.values(audioRecordings).filter(Boolean).length;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <Mic className="h-8 w-8" style={{ color: "#1e3a8a" }} />
        <h2 className="text-2xl font-bold text-gray-900">Speech Assessment</h2>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {totalAnswered} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-50 rounded-xl p-8 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Question {currentQuestion + 1}
        </h3>
        <p className="text-lg text-gray-700 leading-relaxed">
          {questions[currentQuestion].question}
        </p>
      </div>

      {/* Recording Controls */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
        {!currentAudio ? (
          // No recording yet
          <div className="text-center">
            <div className="mb-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {isRecording ? "Recording..." : "Ready to Record"}
              </div>
              {isRecording && (
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#ef4444" }}
                >
                  {formatTime(recordingTime)}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  }}
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
                  }}
                >
                  <Square className="mr-2 h-5 w-5" />
                  Stop Recording
                </button>
              )}
            </div>
          </div>
        ) : (
          // Recording exists
          <div className="text-center">
            <div className="mb-6">
              <div className="text-lg font-semibold text-green-600 mb-2">
                ✓ Recording Complete
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={isPlaying ? stopPlaying : playRecording}
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #059669 0%, #047857 100%)",
                }}
              >
                {isPlaying ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    Stop Playback
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-2 h-4 w-4" />
                    Play Recording
                  </>
                )}
              </button>

              <button
                onClick={deleteRecording}
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 transition-all"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Re-record
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            currentQuestion === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Previous Question
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={nextQuestion}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
            }}
          >
            Next Question
          </button>
        ) : (
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              All questions completed!
            </div>
            <div className="text-lg font-semibold" style={{ color: "#1e3a8a" }}>
              Ready to submit assessment
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
