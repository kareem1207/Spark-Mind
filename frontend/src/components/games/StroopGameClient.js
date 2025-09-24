"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Brain,
  Clock,
  Target,
  ArrowRight,
  Home,
  RotateCcw,
  Pause,
  Play,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { submitGameResults } from "@/lib/api";

export default function StroopGameClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [gameState, setGameState] = useState("instructions"); // instructions, playing, paused, completed
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds game
  const [responseTime, setResponseTime] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);
  const [isCongruent, setIsCongruent] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameResults, setGameResults] = useState(null);

  const colors = [
    { name: "RED", color: "#EF4444", textColor: "text-red-500" },
    { name: "BLUE", color: "#3B82F6", textColor: "text-blue-500" },
    { name: "GREEN", color: "#10B981", textColor: "text-green-500" },
    { name: "YELLOW", color: "#F59E0B", textColor: "text-yellow-500" },
    { name: "PURPLE", color: "#8B5CF6", textColor: "text-purple-500" },
    { name: "ORANGE", color: "#F97316", textColor: "text-orange-500" },
  ];

  // Generate new question
  const generateQuestion = useCallback(() => {
    const wordIndex = Math.floor(Math.random() * colors.length);
    const colorIndex = Math.floor(Math.random() * colors.length);
    const congruent = Math.random() > 0.5; // 50% chance of congruence

    const finalColorIndex = congruent ? wordIndex : colorIndex;

    setCurrentWord(colors[wordIndex]);
    setCurrentColor(colors[finalColorIndex]);
    setIsCongruent(wordIndex === finalColorIndex);
    setStartTime(Date.now());
  }, [colors]);

  // Start game
  const startGame = () => {
    setGameState("playing");
    setCurrentRound(0);
    setScore(0);
    setTimeLeft(60);
    setResponseTime([]);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    generateQuestion();
  };

  // Handle answer
  const handleAnswer = (selectedColorName) => {
    if (gameState !== "playing" || !startTime) return;

    const endTime = Date.now();
    const reactionTime = endTime - startTime;
    const isCorrect = selectedColorName === currentColor.name;

    setResponseTime((prev) => [...prev, reactionTime]);
    setTotalQuestions((prev) => prev + 1);

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setScore((prev) => prev + (isCongruent ? 10 : 15)); // Bonus for incongruent correct answers
    }

    // Generate next question
    setTimeout(() => {
      if (timeLeft > 0) {
        setCurrentRound((prev) => prev + 1);
        generateQuestion();
      }
    }, 500);
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      // Game completed
      const avgResponseTime =
        responseTime.length > 0
          ? responseTime.reduce((a, b) => a + b, 0) / responseTime.length
          : 0;

      const accuracy =
        totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      const finalResults = {
        score,
        accuracy: Math.round(accuracy),
        avgResponseTime: Math.round(avgResponseTime),
        totalQuestions,
        correctAnswers,
        gameType: "Stroop Color Test",
      };

      setGameResults(finalResults);

      // Submit results to backend
      if (session) {
        const apiData = {
          gameType: "stroop",
          duration: 60 - timeLeft,
          score,
          accuracy: Math.round(accuracy),
          avgResponseTime: Math.round(avgResponseTime),
          totalQuestions,
          correctAnswers,
          metadata: {
            gameMode: "Stroop Color Test",
            difficulty: "standard",
            timeLimit: 60,
          },
        };

        submitGameResults(apiData, session).then((result) => {
          if (result.success) {
            console.log("Stroop game results submitted successfully");
          } else {
            console.error("Failed to submit Stroop results:", result.error);
          }
        });
      }

      setGameState("completed");
    }

    return () => clearInterval(timer);
  }, [
    gameState,
    timeLeft,
    responseTime,
    score,
    correctAnswers,
    totalQuestions,
  ]);

  // Pause/Resume game
  const togglePause = () => {
    setGameState(gameState === "playing" ? "paused" : "playing");
  };

  // Save results and navigate
  const saveAndContinue = async () => {
    try {
      // Here you would normally save to backend API
      // await fetch('/api/games/results', { method: 'POST', body: JSON.stringify(gameResults) })
      console.log("Game results:", gameResults);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  if (gameState === "instructions") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-12 w-12 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Stroop Color Test
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Test your cognitive flexibility and processing speed
            </p>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              How to Play
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Read the Color, Not the Word
                  </h3>
                  <p className="text-gray-600">
                    You'll see color words displayed in different colors. Click
                    on the button that matches the COLOR of the text, not what
                    the word says.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Speed Matters
                  </h3>
                  <p className="text-gray-600">
                    You have 60 seconds to answer as many questions as possible.
                    Quick and accurate responses earn higher scores.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Stay Focused
                  </h3>
                  <p className="text-gray-600">
                    Some words will match their color (congruent), others won't
                    (incongruent). The incongruent ones are trickier but worth
                    more points!
                  </p>
                </div>
              </div>
            </div>

            {/* Example */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Example:</h3>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-500 mb-2">
                    BLUE
                  </div>
                  <p className="text-sm text-gray-600">
                    Click "RED" (the color, not the word)
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-500 mb-2">
                    BLUE
                  </div>
                  <p className="text-sm text-gray-600">
                    Click "BLUE" (word matches color)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={startGame}
              className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Test
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
              <CheckCircle className="h-12 w-12 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Test Completed!
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Great job completing the Stroop Color Test
            </p>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Your Results
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {gameResults?.score}
                </div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {gameResults?.accuracy}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {gameResults?.avgResponseTime}ms
                </div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {gameResults?.correctAnswers}/{gameResults?.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">
                Performance Analysis
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {gameResults?.accuracy >= 90 && (
                  <p className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Excellent accuracy! Your cognitive flexibility is strong.
                  </p>
                )}
                {gameResults?.avgResponseTime < 1000 && (
                  <p className="flex items-center text-blue-600">
                    <Target className="h-4 w-4 mr-2" />
                    Fast response times indicate good processing speed.
                  </p>
                )}
                {gameResults?.score > 200 && (
                  <p className="flex items-center text-purple-600">
                    <Brain className="h-4 w-4 mr-2" />
                    High score suggests excellent cognitive control.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-all inline-flex items-center justify-center"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={saveAndContinue}
              className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all inline-flex items-center justify-center"
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

  // Playing state
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Game Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Stroop Color Test
                </h1>
                <p className="text-sm text-gray-600">
                  Round {currentRound + 1}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {timeLeft}
                </div>
                <div className="text-xs text-gray-600">Time Left</div>
              </div>
              <button
                onClick={togglePause}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {gameState === "playing" ? (
                  <Pause className="h-5 w-5 text-gray-600" />
                ) : (
                  <Play className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {gameState === "paused" ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <Pause className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Game Paused
            </h2>
            <p className="text-gray-600 mb-8">
              Take a moment to rest, then continue when ready.
            </p>
            <button
              onClick={togglePause}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all inline-flex items-center"
            >
              <Play className="mr-2 h-4 w-4" />
              Resume Game
            </button>
          </div>
        ) : (
          <>
            {/* Game Area */}
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 mb-8 text-center">
              <div className="mb-8">
                <div
                  className="text-6xl md:text-8xl font-bold mb-4"
                  style={{ color: currentColor?.color }}
                >
                  {currentWord?.name}
                </div>
                <p className="text-gray-600">
                  Click the color of the text, not what it says
                </p>
              </div>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(color.name)}
                  className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300 rounded-xl p-6 font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{
                    borderColor: color.color,
                    color: color.color,
                  }}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </>
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
