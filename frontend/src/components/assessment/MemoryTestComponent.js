"use client";

import { useState, useEffect } from "react";
import { useAssessment } from "@/contexts/AssessmentContext";
import { Brain, Play, RotateCcw } from "lucide-react";

export default function MemoryTestComponent() {
  const { setScore, scores } = useAssessment();
  const [gameState, setGameState] = useState("instructions"); // instructions, playing, completed
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [isShowing, setIsShowing] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const colors = [
    { id: 1, color: "#ef4444", name: "Red" },
    { id: 2, color: "#3b82f6", name: "Blue" },
    { id: 3, color: "#10b981", name: "Green" },
    { id: 4, color: "#f59e0b", name: "Yellow" },
  ];

  const generateSequence = (level) => {
    const newSequence = [];
    for (let i = 0; i < level + 2; i++) {
      newSequence.push(Math.floor(Math.random() * 4) + 1);
    }
    return newSequence;
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentLevel(1);
    setCurrentScore(0);
    setGameComplete(false);
    startLevel(1);
  };

  const startLevel = (level) => {
    const newSequence = generateSequence(level);
    setSequence(newSequence);
    setUserSequence([]);
    showSequence(newSequence);
  };

  const showSequence = async (seq) => {
    setIsShowing(true);

    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Flash the color
      const element = document.getElementById(`color-${seq[i]}`);
      if (element) {
        element.style.transform = "scale(1.1)";
        element.style.boxShadow = "0 0 20px rgba(255,255,255,0.8)";

        setTimeout(() => {
          element.style.transform = "scale(1)";
          element.style.boxShadow = "none";
        }, 400);
      }
    }

    setTimeout(() => {
      setIsShowing(false);
    }, 600);
  };

  const handleColorClick = (colorId) => {
    if (isShowing || gameComplete) return;

    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);

    // Check if the sequence matches so far
    for (let i = 0; i < newUserSequence.length; i++) {
      if (newUserSequence[i] !== sequence[i]) {
        // Wrong sequence - game over
        setGameComplete(true);
        setScore(scores.memory_score || currentLevel - 1); // Use previous score or current level - 1
        return;
      }
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      // Correct sequence completed
      const newScore = currentLevel;
      setCurrentScore(newScore);
      setScore("memory_score", newScore);

      if (currentLevel >= 10) {
        // Max level reached
        setGameComplete(true);
      } else {
        // Next level
        setTimeout(() => {
          setCurrentLevel(currentLevel + 1);
          startLevel(currentLevel + 1);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setGameState("instructions");
    setSequence([]);
    setUserSequence([]);
    setCurrentLevel(1);
    setCurrentScore(0);
    setIsShowing(false);
    setGameComplete(false);
  };

  if (gameState === "instructions") {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Brain className="h-8 w-8" style={{ color: "#1e3a8a" }} />
          <h2 className="text-2xl font-bold text-gray-900">Memory Game</h2>
        </div>

        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Watch the sequence of colors and repeat it by clicking the colors in
          the same order. Each level adds more colors to remember. Try to reach
          the highest level possible!
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#1e3a8a" }}>
                {scores.memory_score || 0}
              </div>
              <div className="text-sm text-gray-600">Previous Best</div>
            </div>
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
          Start Memory Test
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <Brain className="h-8 w-8" style={{ color: "#1e3a8a" }} />
        <h2 className="text-2xl font-bold text-gray-900">Memory Game</h2>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: "#1e3a8a" }}>
            Level {currentLevel}
          </div>
          <div className="text-sm text-gray-600">Current Level</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: "#0891b2" }}>
            {currentScore}
          </div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
      </div>

      {isShowing && (
        <div
          className="mb-6 text-lg font-semibold"
          style={{ color: "#1e3a8a" }}
        >
          Watch the sequence...
        </div>
      )}

      {!isShowing && !gameComplete && (
        <div
          className="mb-6 text-lg font-semibold"
          style={{ color: "#0891b2" }}
        >
          Repeat the sequence ({userSequence.length}/{sequence.length})
        </div>
      )}

      {gameComplete && (
        <div className="mb-6">
          <div className="text-xl font-bold text-green-600 mb-2">
            Game Complete!
          </div>
          <div className="text-lg" style={{ color: "#1e3a8a" }}>
            Final Score: {currentScore}
          </div>
        </div>
      )}

      {/* Color Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
        {colors.map((color) => (
          <button
            key={color.id}
            id={`color-${color.id}`}
            onClick={() => handleColorClick(color.id)}
            disabled={isShowing}
            className="w-24 h-24 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              backgroundColor: color.color,
              opacity: isShowing ? 0.7 : 1,
            }}
            title={color.name}
          />
        ))}
      </div>

      {gameComplete && (
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
      )}
    </div>
  );
}
