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
} from "lucide-react";
import { submitMemoryGameScore } from "@/lib/api";

export default function MemoryGameClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [gameState, setGameState] = useState("instructions"); // instructions, playing, paused, completed
  const [difficulty, setDifficulty] = useState("easy"); // easy, medium, hard
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  const [showCards, setShowCards] = useState(false); // For initial preview

  // Card symbols/emojis for different difficulties
  const symbols = {
    easy: ["🎨", "🎭", "🎪", "🎯", "🎲", "🎸"], // 6 pairs = 12 cards
    medium: ["🎨", "🎭", "🎪", "🎯", "🎲", "🎸", "🎺", "🎹", "🎻"], // 9 pairs = 18 cards
    hard: [
      "🎨",
      "🎭",
      "🎪",
      "🎯",
      "🎲",
      "🎸",
      "🎺",
      "🎹",
      "🎻",
      "🎬",
      "🎨",
      "🎪",
    ], // 12 pairs = 24 cards
  };

  const difficultySettings = {
    easy: { pairs: 6, cols: 3, previewTime: 3000 },
    medium: { pairs: 9, cols: 3, previewTime: 2000 },
    hard: { pairs: 12, cols: 4, previewTime: 1500 },
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const setting = difficultySettings[difficulty];
    const gameSymbols = symbols[difficulty].slice(0, setting.pairs);

    // Create pairs and shuffle
    const cardPairs = [...gameSymbols, ...gameSymbols];
    const shuffledCards = cardPairs
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimeElapsed(0);
    setShowCards(true);

    // Show all cards for preview, then hide them
    setTimeout(() => {
      setShowCards(false);
      setGameStartTime(Date.now());
    }, setting.previewTime);
  }, [difficulty]);

  // Start game
  const startGame = () => {
    setGameState("playing");
    initializeGame();
  };

  // Handle card click
  const handleCardClick = (cardId) => {
    if (gameState !== "playing" || showCards) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isMatched || flippedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstCardId);
      const secondCard = cards.find((c) => c.id === secondCardId);

      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        setMatchedCards((prev) => [...prev, firstCardId, secondCardId]);
        setFlippedCards([]);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === "playing" && gameStartTime && !showCards) {
      timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, gameStartTime, showCards]);

  // Check for game completion
  useEffect(() => {
    if (
      gameState === "playing" &&
      matchedCards.length === cards.length &&
      cards.length > 0
    ) {
      const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
      const setting = difficultySettings[difficulty];

      // Calculate score based on time, moves, and difficulty
      let baseScore = 1000;
      const timeBonus = Math.max(0, 300 - totalTime); // Bonus for speed
      const movesPenalty = Math.max(0, moves - setting.pairs) * 10; // Penalty for extra moves
      const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[
        difficulty
      ];

      const finalScore = Math.round(
        (baseScore + timeBonus - movesPenalty) * difficultyMultiplier
      );

      const finalResults = {
        score: Math.max(0, finalScore),
        time: totalTime,
        moves,
        difficulty,
        pairs: setting.pairs,
        gameType: "Memory Game",
      };

      setGameResults(finalResults);

      // Submit results to backend
      if (session) {
        const apiData = {
          score: Math.max(0, finalScore),
          level: difficulty,
          attempts: moves,
          duration: totalTime,
          accuracy:
            matchedCards.length === cards.length
              ? 100
              : (matchedCards.length / cards.length) * 100,
          metadata: {
            gameMode: "Memory Game",
            pairs: setting.pairs,
            difficulty,
          },
        };

        submitMemoryGameScore(apiData, session).then((result) => {
          if (result.success) {
            console.log("Memory game results submitted successfully");
          } else {
            console.error(
              "Failed to submit Memory game results:",
              result.error
            );
          }
        });
      }

      setGameState("completed");
    }
  }, [matchedCards, cards, gameStartTime, moves, difficulty]);

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
      // Here you would normally save to backend API
      console.log("Game results:", gameResults);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  if (gameState === "instructions") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-12 w-12 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Memory Game</h1>
            </div>
            <p className="text-lg text-gray-600">
              Test your working memory and pattern recognition
            </p>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              How to Play
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Study the Cards
                  </h3>
                  <p className="text-gray-600">
                    At the start, all cards will be shown briefly for you to
                    memorize their positions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Find Matching Pairs
                  </h3>
                  <p className="text-gray-600">
                    Click on cards to flip them over. Find two cards with the
                    same symbol to make a match.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Complete the Grid
                  </h3>
                  <p className="text-gray-600">
                    Match all pairs to complete the game. Fewer moves and faster
                    time result in higher scores!
                  </p>
                </div>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Choose Difficulty:
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(difficultySettings).map(([level, setting]) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      difficulty === level
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-300 text-gray-700"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold capitalize">{level}</div>
                      <div className="text-sm text-gray-600">
                        {setting.pairs} pairs
                      </div>
                      <div className="text-xs text-gray-500">
                        {setting.pairs * 2} cards
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={startGame}
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Game
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
                Congratulations!
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              You completed the Memory Game
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
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {gameResults?.time}s
                </div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {gameResults?.moves}
                </div>
                <div className="text-sm text-gray-600">Total Moves</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2 capitalize">
                  {gameResults?.difficulty}
                </div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">
                Performance Analysis
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {gameResults?.moves <= gameResults?.pairs + 2 && (
                  <p className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Excellent memory! You found matches with minimal extra
                    moves.
                  </p>
                )}
                {gameResults?.time < 60 && (
                  <p className="flex items-center text-blue-600">
                    <Zap className="h-4 w-4 mr-2" />
                    Lightning fast! Your pattern recognition is impressive.
                  </p>
                )}
                {gameResults?.score > 800 && (
                  <p className="flex items-center text-purple-600">
                    <Star className="h-4 w-4 mr-2" />
                    Outstanding performance! Your working memory is excellent.
                  </p>
                )}
                {gameResults?.difficulty === "hard" &&
                  gameResults?.score > 600 && (
                    <p className="flex items-center text-orange-600">
                      <Trophy className="h-4 w-4 mr-2" />
                      Hard mode mastery! You handled complex patterns with ease.
                    </p>
                  )}
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
              Play Again
            </button>
            <button
              onClick={saveAndContinue}
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all inline-flex items-center justify-center"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Game Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Memory Game</h1>
                <p className="text-sm text-gray-600 capitalize">
                  {difficulty} Mode - {difficultySettings[difficulty].pairs}{" "}
                  pairs
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {matchedCards.length / 2}/
                  {difficultySettings[difficulty].pairs}
                </div>
                <div className="text-xs text-gray-600">Pairs Found</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{moves}</div>
                <div className="text-xs text-gray-600">Moves</div>
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
              Take a break and resume when you're ready.
            </p>
            <button
              onClick={togglePause}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all inline-flex items-center"
            >
              <Play className="mr-2 h-4 w-4" />
              Resume Game
            </button>
          </div>
        ) : (
          <>
            {showCards && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 mb-6 text-center">
                <p className="text-yellow-800 font-medium">
                  📚 Study the cards! They will be hidden soon...
                </p>
              </div>
            )}

            {/* Game Grid */}
            <div
              className={`grid gap-4 mx-auto max-w-4xl`}
              style={{
                gridTemplateColumns: `repeat(${difficultySettings[difficulty].cols}, minmax(0, 1fr))`,
              }}
            >
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`
                    aspect-square bg-white rounded-xl shadow-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105
                    ${
                      matchedCards.includes(card.id)
                        ? "border-green-400 bg-green-50"
                        : flippedCards.includes(card.id) || showCards
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }
                    ${
                      gameState !== "playing" || showCards
                        ? "cursor-default"
                        : ""
                    }
                  `}
                >
                  <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl">
                    {flippedCards.includes(card.id) ||
                    matchedCards.includes(card.id) ||
                    showCards
                      ? card.symbol
                      : "❓"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Progress Bar */}
        {gameState === "playing" && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Progress
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(
                  (matchedCards.length /
                    (difficultySettings[difficulty].pairs * 2)) *
                    100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (matchedCards.length /
                      (difficultySettings[difficulty].pairs * 2)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
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
