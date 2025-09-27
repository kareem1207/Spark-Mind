"use client";

import { useState, useEffect } from "react";
import { useAssessment } from "@/contexts/AssessmentContext";
import { Brain, Play, RotateCcw, Eye } from "lucide-react";

export default function ImageRecallComponent() {
  const { setScore, scores } = useAssessment();
  const [gameState, setGameState] = useState("instructions"); // instructions, study, recall, completed
  const [currentLevel, setCurrentLevel] = useState(1);
  const [studyItems, setStudyItems] = useState([]);
  const [recallItems, setRecallItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [score, setCurrentScore] = useState(0);
  const [studyTime, setStudyTime] = useState(10);
  const [showingStudy, setShowingStudy] = useState(false);

  // Predefined items for the game
  const allItems = [
    { id: 1, name: "🍎", label: "Apple" },
    { id: 2, name: "🚗", label: "Car" },
    { id: 3, name: "🏠", label: "House" },
    { id: 4, name: "🌸", label: "Flower" },
    { id: 5, name: "📱", label: "Phone" },
    { id: 6, name: "⚽", label: "Ball" },
    { id: 7, name: "🎸", label: "Guitar" },
    { id: 8, name: "📚", label: "Book" },
    { id: 9, name: "🍕", label: "Pizza" },
    { id: 10, name: "🌳", label: "Tree" },
    { id: 11, name: "✈️", label: "Plane" },
    { id: 12, name: "⌚", label: "Watch" },
    { id: 13, name: "🎵", label: "Music" },
    { id: 14, name: "💡", label: "Bulb" },
    { id: 15, name: "🎂", label: "Cake" },
    { id: 16, name: "🔑", label: "Key" },
    { id: 17, name: "👓", label: "Glasses" },
    { id: 18, name: "🌟", label: "Star" },
    { id: 19, name: "🦋", label: "Butterfly" },
    { id: 20, name: "🎨", label: "Art" },
  ];

  const generateLevel = (level) => {
    const numItems = Math.min(4 + level, 12); // Start with 5 items, max 12
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    const study = shuffled.slice(0, numItems);

    // Create recall items with some distractors
    const distractors = shuffled.slice(
      numItems,
      numItems + Math.floor(numItems / 2)
    );
    const allRecallItems = [...study, ...distractors].sort(
      () => Math.random() - 0.5
    );

    setStudyItems(study);
    setRecallItems(allRecallItems);
    setSelectedItems(new Set());
  };

  const startGame = () => {
    setCurrentLevel(1);
    setCurrentScore(0);
    generateLevel(1);
    startStudyPhase();
  };

  const startStudyPhase = () => {
    setGameState("study");
    setStudyTime(10);
    setShowingStudy(true);
  };

  const startRecallPhase = () => {
    setGameState("recall");
    setShowingStudy(false);
  };

  const handleItemSelect = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const submitRecall = () => {
    // Calculate score based on correct selections
    const correctSelections = studyItems.filter((item) =>
      selectedItems.has(item.id)
    ).length;
    const incorrectSelections = Array.from(selectedItems).filter(
      (id) => !studyItems.some((item) => item.id === id)
    ).length;

    const levelScore = Math.max(0, correctSelections - incorrectSelections);
    const newTotalScore = score + levelScore;

    setCurrentScore(newTotalScore);
    setScore("image_recall_score", newTotalScore);

    if (currentLevel >= 5) {
      setGameState("completed");
    } else {
      // Next level
      setCurrentLevel(currentLevel + 1);
      generateLevel(currentLevel + 1);
      setTimeout(() => {
        startStudyPhase();
      }, 1500);
    }
  };

  const resetGame = () => {
    setGameState("instructions");
    setCurrentLevel(1);
    setCurrentScore(0);
    setStudyItems([]);
    setRecallItems([]);
    setSelectedItems(new Set());
    setStudyTime(10);
    setShowingStudy(false);
  };

  // Study timer effect
  useEffect(() => {
    if (gameState === "study" && studyTime > 0) {
      const timer = setTimeout(() => {
        setStudyTime(studyTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "study" && studyTime === 0) {
      startRecallPhase();
    }
  }, [gameState, studyTime]);

  if (gameState === "instructions") {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Brain className="h-8 w-8" style={{ color: "#1e3a8a" }} />
          <h2 className="text-2xl font-bold text-gray-900">
            Image Recall Test
          </h2>
        </div>

        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Study a set of images for 10 seconds, then select which ones you
          remember from a larger group. Each level increases the number of
          images to remember. Complete 5 levels to finish the test.
        </p>

        <div className="space-y-4 mb-8">
          <div className="p-6 bg-gray-50 rounded-xl max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">How to Play:</h3>
            <div className="space-y-2 text-left text-sm text-gray-600">
              <p>1. Study the images shown for 10 seconds</p>
              <p>2. Select the images you remember from the choices</p>
              <p>3. Score points for correct selections</p>
              <p>4. Progress through 5 levels of increasing difficulty</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#1e3a8a" }}>
              {scores.image_recall_score || 0}
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
          Start Image Recall Test
        </button>
      </div>
    );
  }

  if (gameState === "study") {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Eye className="h-8 w-8" style={{ color: "#1e3a8a" }} />
          <h2 className="text-2xl font-bold text-gray-900">
            Study These Images
          </h2>
        </div>

        <div className="mb-6">
          <div className="text-3xl font-bold mb-2" style={{ color: "#1e3a8a" }}>
            {studyTime}
          </div>
          <div className="text-lg text-gray-600">
            Level {currentLevel} - Memorize these images
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {studyItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200"
            >
              <div className="text-4xl mb-2">{item.name}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === "recall") {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Brain className="h-8 w-8" style={{ color: "#1e3a8a" }} />
          <h2 className="text-2xl font-bold text-gray-900">
            Select What You Remember
          </h2>
        </div>

        <div className="mb-6">
          <div className="text-lg text-gray-600">
            Level {currentLevel} - Click the images you studied (
            {selectedItems.size} selected)
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          {recallItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemSelect(item.id)}
              className={`p-6 rounded-xl shadow-lg border-2 transition-all transform hover:scale-105 ${
                selectedItems.has(item.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="text-4xl mb-2">{item.name}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </button>
          ))}
        </div>

        <button
          onClick={submitRecall}
          className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
          }}
        >
          Submit Answer
        </button>
      </div>
    );
  }

  if (gameState === "completed") {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Brain className="h-8 w-8" style={{ color: "#1e3a8a" }} />
          <h2 className="text-2xl font-bold text-gray-900">Test Complete!</h2>
        </div>

        <div
          className="text-center p-6 rounded-xl mb-8"
          style={{ backgroundColor: "#f0f9ff" }}
        >
          <div className="text-4xl font-bold mb-2" style={{ color: "#1e3a8a" }}>
            {score}
          </div>
          <div className="text-lg text-gray-600">Final Score</div>
          <div className="text-sm text-gray-500 mt-2">
            Completed {currentLevel - 1} levels
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

  return null;
}
