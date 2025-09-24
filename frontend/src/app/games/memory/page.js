'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const GRID_SIZE = 16
const DISPLAY_TIME = 5000 // 5 seconds

export default function MemoryGame() {
  const [cards, setCards] = useState([])
  const [selectedCards, setSelectedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [score, setScore] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [gameState, setGameState] = useState('ready') // ready, memorize, play, complete
  const [timeLeft, setTimeLeft] = useState(DISPLAY_TIME / 1000)

  const generateCards = () => {
    const symbols = '🌟🌙🌞🌎🌈🌸🍀🦋'.split('')
    const pairs = [...symbols, ...symbols]
    return pairs.sort(() => Math.random() - 0.5).map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: true,
      isMatched: false,
    }))
  }

  const startGame = () => {
    const newCards = generateCards()
    setCards(newCards)
    setSelectedCards([])
    setMatchedCards([])
    setScore(0)
    setStartTime(Date.now())
    setGameState('memorize')
    setTimeLeft(DISPLAY_TIME / 1000)

    // Hide cards after display time
    setTimeout(() => {
      setCards(newCards.map(card => ({ ...card, isFlipped: false })))
      setGameState('play')
    }, DISPLAY_TIME)
  }

  useEffect(() => {
    let interval
    if (gameState === 'memorize') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState])

  const handleCardClick = (clickedCard) => {
    if (
      gameState !== 'play' ||
      selectedCards.length === 2 ||
      clickedCard.isFlipped ||
      clickedCard.isMatched
    ) {
      return
    }

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    )
    setCards(newCards)

    const newSelectedCards = [...selectedCards, clickedCard]
    setSelectedCards(newSelectedCards)

    if (newSelectedCards.length === 2) {
      setTimeout(() => checkMatch(newSelectedCards), 1000)
    }
  }

  const checkMatch = (selected) => {
    const [first, second] = selected
    const matched = first.symbol === second.symbol

    if (matched) {
      setMatchedCards(prev => [...prev, first.id, second.id])
      setScore(prev => prev + 10)
    } else {
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === first.id || card.id === second.id
            ? { ...card, isFlipped: false }
            : card
        )
      )
      setScore(prev => Math.max(0, prev - 2))
    }

    setSelectedCards([])

    // Check if game is complete
    if (matched && matchedCards.length + 2 === GRID_SIZE) {
      const endTime = Date.now()
      const timeTaken = Math.floor((endTime - startTime) / 1000)
      setGameState('complete')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900">Memory Game</h1>

              {gameState === 'ready' && (
                <div className="mt-8">
                  <div className="rounded-lg bg-blue-50 p-6">
                    <h3 className="text-lg font-semibold text-blue-900">Game Rules:</h3>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-blue-900">
                      <li>You will see a grid of symbols for {DISPLAY_TIME / 1000} seconds.</li>
                      <li>Memorize the position of each symbol.</li>
                      <li>After the symbols are hidden, click on cards to find matching pairs.</li>
                      <li>Match all pairs to complete the game.</li>
                    </ul>
                  </div>
                  <button
                    onClick={startGame}
                    className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Start Game
                  </button>
                </div>
              )}

              {gameState === 'memorize' && (
                <div className="mt-8">
                  <div className="mb-4 text-center text-xl font-semibold text-primary-600">
                    Memorize! Time left: {timeLeft}s
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {cards.map(card => (
                      <button
                        key={card.id}
                        className="aspect-square rounded-lg bg-white text-4xl shadow-sm ring-1 ring-gray-200"
                        disabled
                      >
                        {card.isFlipped ? card.symbol : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {gameState === 'play' && (
                <div className="mt-8">
                  <div className="mb-4 text-center text-xl font-semibold text-primary-600">
                    Score: {score}
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {cards.map(card => (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick(card)}
                        className={`aspect-square rounded-lg text-4xl shadow-sm transition-all duration-300 ${
                          card.isFlipped || card.isMatched
                            ? 'bg-white ring-1 ring-primary-200'
                            : 'bg-primary-100 hover:bg-primary-50'
                        }`}
                        disabled={card.isFlipped || card.isMatched}
                      >
                        {card.isFlipped || card.isMatched ? card.symbol : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {gameState === 'complete' && (
                <div className="mt-8">
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="text-center text-green-900">
                      <h2 className="text-lg font-semibold">Congratulations! 🎉</h2>
                      <p className="mt-1">
                        You completed the game with a score of {score} points!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setGameState('ready')}
                    className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}