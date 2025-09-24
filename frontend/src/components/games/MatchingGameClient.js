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
  Trophy,
  Zap,
  Star,
  Link as LinkIcon,
} from "lucide-react";
import { submitGameResults } from "@/lib/api";

export default function MatchingGameClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [gameState, setGameState] = useState("instructions"); // instructions, playing, paused, completed
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [currentPairs, setCurrentPairs] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [gameResults, setGameResults] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Object-Purpose pairs organized by difficulty
  const allPairs = {
    level1: [
      {
        object: "🔑",
        objectName: "Key",
        purpose: "🚪",
        purposeName: "Door",
        description: "Opens doors and locks",
      },
      {
        object: "✏️",
        objectName: "Pencil",
        purpose: "📝",
        purposeName: "Writing",
        description: "Used for writing and drawing",
      },
      {
        object: "🍴",
        objectName: "Fork",
        purpose: "🍽️",
        purposeName: "Eating",
        description: "Eating utensil for food",
      },
      {
        object: "📱",
        objectName: "Phone",
        purpose: "📞",
        purposeName: "Calling",
        description: "Communication device",
      },
    ],
    level2: [
      {
        object: "🔍",
        objectName: "Magnifying Glass",
        purpose: "👁️",
        purposeName: "Seeing",
        description: "Magnifies small objects",
      },
      {
        object: "🧹",
        objectName: "Broom",
        purpose: "🏠",
        purposeName: "Cleaning",
        description: "Sweeps floors clean",
      },
      {
        object: "⚒️",
        objectName: "Hammer",
        purpose: "🔨",
        purposeName: "Building",
        description: "Drives nails and breaks things",
      },
      {
        object: "🎨",
        objectName: "Paintbrush",
        purpose: "🖼️",
        purposeName: "Painting",
        description: "Applies paint to surfaces",
      },
      {
        object: "🔦",
        objectName: "Flashlight",
        purpose: "💡",
        purposeName: "Lighting",
        description: "Provides light in darkness",
      },
    ],
    level3: [
      {
        object: "🧭",
        objectName: "Compass",
        purpose: "🗺️",
        purposeName: "Navigation",
        description: "Shows direction for navigation",
      },
      {
        object: "🔬",
        objectName: "Microscope",
        purpose: "🦠",
        purposeName: "Research",
        description: "Examines microscopic specimens",
      },
      {
        object: "⚖️",
        objectName: "Scale",
        purpose: "📏",
        purposeName: "Measuring",
        description: "Measures weight accurately",
      },
      {
        object: "🩺",
        objectName: "Stethoscope",
        purpose: "❤️",
        purposeName: "Health",
        description: "Listens to heartbeat and breathing",
      },
      {
        object: "🎻",
        objectName: "Violin",
        purpose: "🎵",
        purposeName: "Music",
        description: "Creates beautiful music",
      },
      {
        object: "🔧",
        objectName: "Wrench",
        purpose: "⚙️",
        purposeName: "Repair",
        description: "Tightens and loosens bolts",
      },
    ],
  };

  // Initialize level
  const initializeLevel = useCallback(() => {
    const levelKey = `level${currentLevel}`;
    const pairs = allPairs[levelKey] || [];
    setCurrentPairs(pairs);
    setSelectedObject(null);
    setSelectedPurpose(null);
    setMatchedPairs([]);
    setFeedback(null);
  }, [currentLevel]);

  // Start game
  const startGame = () => {
    setGameState("playing");
    setCurrentLevel(1);
    setScore(0);
    setTimeElapsed(0);
    setIncorrectAttempts(0);
    setGameStartTime(Date.now());
    initializeLevel();
  };

  // Handle object selection
  const handleObjectSelect = (objectIndex) => {
    if (gameState !== "playing") return;
    setSelectedObject(objectIndex);
    setSelectedPurpose(null);
    setFeedback(null);
  };

  // Handle purpose selection
  const handlePurposeSelect = (purposeIndex) => {
    if (gameState !== "playing" || selectedObject === null) return;

    setSelectedPurpose(purposeIndex);

    // Check if it's a correct match
    if (selectedObject === purposeIndex) {
      // Correct match
      const points = Math.max(50, 100 - incorrectAttempts * 10); // Base 100 points, minus 10 for each incorrect attempt
      setScore((prev) => prev + points);
      setMatchedPairs((prev) => [...prev, selectedObject]);
      setFeedback({
        type: "success",
        message: `Correct! +${points} points`,
        description: currentPairs[selectedObject]?.description,
      });

      // Reset selections after delay
      setTimeout(() => {
        setSelectedObject(null);
        setSelectedPurpose(null);
        setFeedback(null);

        // Check if level is complete
        if (matchedPairs.length + 1 >= currentPairs.length) {
          // Level complete
          setTimeout(() => {
            if (currentLevel < 3) {
              setCurrentLevel((prev) => prev + 1);
            } else {
              // Game complete
              completeGame();
            }
          }, 1000);
        }
      }, 2000);
    } else {
      // Incorrect match
      setIncorrectAttempts((prev) => prev + 1);
      setFeedback({
        type: "error",
        message: "Not quite right. Try again!",
        description: `The ${currentPairs[selectedObject]?.objectName} doesn't match with that purpose.`,
      });

      // Reset selections after delay
      setTimeout(() => {
        setSelectedObject(null);
        setSelectedPurpose(null);
        setFeedback(null);
      }, 2000);
    }
  };

  // Complete game
  const completeGame = () => {
    const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
    const accuracy = Math.round((score / (300 + incorrectAttempts * 10)) * 100); // 300 is max possible score (100 per level)

    const finalResults = {
      score,
      time: totalTime,
      accuracy,
      incorrectAttempts,
      levelsCompleted: currentLevel,
      gameType: "Object-Purpose Matching",
    };

    setGameResults(finalResults);

    // Submit results to backend
    if (session) {
      const apiData = {
        gameType: "matching",
        duration: totalTime,
        score,
        accuracy,
        incorrectAttempts,
        levelsCompleted: currentLevel,
        metadata: {
          gameMode: "Object-Purpose Matching",
          totalItems: gameItems.length,
          difficulty: "progressive",
        },
      };

      submitGameResults(apiData, session).then((result) => {
        if (result.success) {
          console.log("Matching game results submitted successfully");
        } else {
          console.error(
            "Failed to submit Matching game results:",
            result.error
          );
        }
      });
    }

    setGameState("completed");
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === "playing" && gameStartTime) {
      timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, gameStartTime]);

  // Initialize level when it changes
  useEffect(() => {
    if (gameState === "playing") {
      initializeLevel();
    }
  }, [currentLevel, gameState, initializeLevel]);

  // Pause/Resume game
  const togglePause = () => {
    if (gameState === "playing") {
      setGameState("paused");
    } else if (gameState === "paused") {
      setGameState("playing");
      setGameStartTime(Date.now() - timeElapsed * 1000); // Adjust start time
    }
  };

  // Save results and navigate
  const saveAndContinue = async () => {
    try {
      console.log("Game results:", gameResults);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  if (gameState === "instructions") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <LinkIcon className="h-12 w-12 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Object-Purpose Matching
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Test your semantic memory and logical reasoning
            </p>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              How to Play
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Select an Object
                  </h3>
                  <p className="text-gray-600">
                    Look at the objects on the left and click on one to select
                    it.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Match with Purpose
                  </h3>
                  <p className="text-gray-600">
                    Then click on the purpose or function that best matches your
                    selected object.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Progress Through Levels
                  </h3>
                  <p className="text-gray-600">
                    Complete 3 levels with increasing difficulty. Higher
                    accuracy earns more points!
                  </p>
                </div>
              </div>
            </div>

            {/* Example */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Example:</h3>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">🔑</div>
                  <p className="text-sm text-gray-600">Key</p>
                </div>
                <div className="text-center">
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🚪</div>
                  <p className="text-sm text-gray-600">Door (Opens doors)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={startGame}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Trophy className="h-12 w-12 text-yellow-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Excellent Work!
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              You completed the Object-Purpose Matching test
            </p>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Your Results
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
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
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {gameResults?.time}s
                </div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {gameResults?.levelsCompleted}/3
                </div>
                <div className="text-sm text-gray-600">Levels</div>
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
                    Outstanding semantic memory! You understand object functions
                    very well.
                  </p>
                )}
                {gameResults?.incorrectAttempts <= 2 && (
                  <p className="flex items-center text-blue-600">
                    <Target className="h-4 w-4 mr-2" />
                    Excellent logical reasoning with minimal errors.
                  </p>
                )}
                {gameResults?.time < 120 && (
                  <p className="flex items-center text-purple-600">
                    <Zap className="h-4 w-4 mr-2" />
                    Quick thinking! Your cognitive processing speed is
                    impressive.
                  </p>
                )}
                {gameResults?.levelsCompleted === 3 && (
                  <p className="flex items-center text-orange-600">
                    <Star className="h-4 w-4 mr-2" />
                    Perfect completion! Your visual-semantic association skills
                    are strong.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold border-2 border-green-600 hover:bg-green-50 transition-all inline-flex items-center justify-center"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={saveAndContinue}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all inline-flex items-center justify-center"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Game Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LinkIcon className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Object-Purpose Matching
                </h1>
                <p className="text-sm text-gray-600">
                  Level {currentLevel} of 3
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {matchedPairs.length}/{currentPairs.length}
                </div>
                <div className="text-xs text-gray-600">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{score}</div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {timeElapsed}s
                </div>
                <div className="text-xs text-gray-600">Time</div>
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
              Take your time and resume when ready.
            </p>
            <button
              onClick={togglePause}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all inline-flex items-center"
            >
              <Play className="mr-2 h-4 w-4" />
              Resume Game
            </button>
          </div>
        ) : (
          <>
            {/* Instructions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 text-center">
              <p className="text-gray-600">
                <strong>Step 1:</strong> Select an object from the left side
                {selectedObject !== null && (
                  <span className="text-green-600"> ✓</span>
                )}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Step 2:</strong> Then select its matching purpose from
                the right side
              </p>
            </div>

            {/* Game Area */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Objects Column */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Objects
                </h3>
                <div className="space-y-4">
                  {currentPairs.map((pair, index) => (
                    <button
                      key={index}
                      onClick={() => handleObjectSelect(index)}
                      disabled={matchedPairs.includes(index)}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        matchedPairs.includes(index)
                          ? "border-green-300 bg-green-50 opacity-50 cursor-not-allowed"
                          : selectedObject === index
                          ? "border-green-500 bg-green-100 shadow-lg"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{pair.object}</div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">
                            {pair.objectName}
                          </div>
                        </div>
                        {matchedPairs.includes(index) && (
                          <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrow Column */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <ArrowRight className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Match with</p>
                </div>
              </div>

              {/* Purposes Column */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Purposes
                </h3>
                <div className="space-y-4">
                  {currentPairs.map((pair, index) => (
                    <button
                      key={index}
                      onClick={() => handlePurposeSelect(index)}
                      disabled={
                        selectedObject === null || matchedPairs.includes(index)
                      }
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        matchedPairs.includes(index)
                          ? "border-green-300 bg-green-50 opacity-50 cursor-not-allowed"
                          : selectedPurpose === index
                          ? "border-blue-500 bg-blue-100 shadow-lg"
                          : selectedObject !== null
                          ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          : "border-gray-200 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{pair.purpose}</div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">
                            {pair.purposeName}
                          </div>
                        </div>
                        {matchedPairs.includes(index) && (
                          <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                        )}
                      </div>
                    </button>
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
                    feedback.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Target className="h-5 w-5" />
                  )}
                  <span className="font-semibold">{feedback.message}</span>
                </div>
                <p className="text-gray-600 text-sm">{feedback.description}</p>
              </div>
            )}
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
