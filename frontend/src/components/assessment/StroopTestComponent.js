"use client";

import { useState, useEffect, useCallback } from "react";
import { useAssessment } from "@/contexts/AssessmentContext";
import { Brain, Play, RotateCcw } from "lucide-react";

export default function StroopTestComponent() {
  const { setScore, scores } = useAssessment();
  const [gameState, setGameState] = useState("instructions"); // instructions, playing, completed
  const [currentWord, setCurrentWord] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);
  const [score, setCurrentScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);

  const colors = [
    { name: "RED", color: "#EF4444" },
    { name: "BLUE", color: "#3B82F6" },
    { name: "GREEN", color: "#10B981" },
    { name: "YELLOW", color: "#F59E0B" },
    { name: "PURPLE", color: "#8B5CF6" },
    { name: "ORANGE", color: "#F97316" },
  ];

  const generateQuestion = useCallback(() => {
    const wordIndex = Math.floor(Math.random() * colors.length);
    const colorIndex = Math.floor(Math.random() * colors.length);

    setCurrentWord(colors[wordIndex]);
    setCurrentColor(colors[colorIndex]);
  }, []);

  const startGame = () => {
    setGameState("playing");
    setCurrentScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setTimeLeft(60);
    setGameActive(true);
    generateQuestion();
  };

  const handleAnswer = (selectedColorName) => {
    if (!gameActive) return;

    const isCorrect = selectedColorName === currentColor.name;
    const newTotalQuestions = totalQuestions + 1;
    const newCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);

    setTotalQuestions(newTotalQuestions);
    setCorrectAnswers(newCorrectAnswers);

    // Calculate score (correct answers + time bonus)
    const newScore = newCorrectAnswers * 10 + Math.floor(timeLeft / 2);
    setCurrentScore(newScore);
    setScore("stroop_score", newScore);

    generateQuestion();
  };

  const endGame = () => {
    setGameActive(false);
    setGameState("completed");
  };

  const resetGame = () => {
    setGameState("instructions");
    setCurrentWord(null);
    setCurrentColor(null);
    setCurrentScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setTimeLeft(60);
    setGameActive(false);
  };

  // Timer effect
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameActive && timeLeft === 0) {
      endGame();
    }
  }, [gameActive, timeLeft]);

  if (gameState === "instructions") {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Brain className="h-8 w-8" style={{ color: "#1e3a8a" }} />
          <h2 className="text-2xl font-bold text-gray-900">Stroop Test</h2>
        </div>

        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          You'll see color words displayed in different colors. Click on the
          button that matches the COLOR of the text, not what the word says. You
          have 60 seconds to answer as many as possible.
        </p>

        <div className="space-y-4 mb-8">
          <div className="p-6 bg-gray-50 rounded-xl max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Example:</h3>
            <div className="space-y-3">
              <div className="text-center">
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#EF4444" }}
                >
                  BLUE
                </div>
                <p className="text-sm text-gray-600">
                  Click "RED" (the color, not the word)
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#1e3a8a" }}>
              {scores.stroop_score || 0}
            </div>
            <div className="text-sm text-gray-600">Previous Best</div>
          </div>
        </div>

        <button
          onClick={startGame}
          className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
          }}
        >
          <Play className="mr-2 h-5 w-5" />
          Start Stroop Test
        </button>
      </div>
    );
  }

  if (gameState === "completed") {
    const accuracy =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Brain className="h-8 w-8" style={{ color: "#1e3a8a" }} />
          <h2 className="text-2xl font-bold text-gray-900">Test Complete!</h2>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
          <div
            className="text-center p-4 rounded-xl"
            style={{ backgroundColor: "#f0f9ff" }}
          >
            <div className="text-2xl font-bold" style={{ color: "#1e3a8a" }}>
              {score}
            </div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div
            className="text-center p-4 rounded-xl"
            style={{ backgroundColor: "#e0f2fe" }}
          >
            <div className="text-2xl font-bold" style={{ color: "#0891b2" }}>
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <Brain className="h-8 w-8" style={{ color: "#1e3a8a" }} />
        <h2 className="text-2xl font-bold text-gray-900">Stroop Test</h2>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: "#1e3a8a" }}>
            {timeLeft}s
          </div>
          <div className="text-sm text-gray-600">Time Left</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: "#0891b2" }}>
            {score}
          </div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
      </div>

      {/* Question Display */}
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

      {/* Answer Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(color.name)}
            className="bg-white hover:bg-gray-50 border-2 rounded-xl p-4 font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              borderColor: color.color,
              color: color.color,
            }}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}
