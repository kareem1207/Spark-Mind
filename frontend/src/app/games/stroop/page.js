'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const COLORS = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Brown"]
const TRIALS = 15
const WORD_DISPLAY_TIME = 5 // seconds

export default function StroopTest() {
  const [currentTrial, setCurrentTrial] = useState(0)
  const [resultsLog, setResultsLog] = useState([])
  const [gameState, setGameState] = useState('ready') // ready, playing, complete
  const [timeLeft, setTimeLeft] = useState(WORD_DISPLAY_TIME)
  const [currentWord, setCurrentWord] = useState(null)
  const [currentColor, setCurrentColor] = useState(null)
  const [startTime, setStartTime] = useState(null)

  useEffect(() => {
    let interval
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            checkAnswer(null, currentColor)
            return WORD_DISPLAY_TIME
          }
          return time - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, timeLeft, currentColor])

  const startTest = () => {
    setCurrentTrial(0)
    setResultsLog([])
    setGameState('playing')
    nextTrial()
  }

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5)

  const nextTrial = () => {
    if (currentTrial >= TRIALS) {
      setGameState('complete')
      return
    }

    const word = COLORS[Math.floor(Math.random() * COLORS.length)]
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    setCurrentWord(word)
    setCurrentColor(color)
    setTimeLeft(WORD_DISPLAY_TIME)
    setStartTime(Date.now())
  }

  const checkAnswer = (selected, correctColor) => {
    const endTime = Date.now()
    const timeTaken = (endTime - startTime) / 1000
    const correct = selected === correctColor

    setResultsLog((prev) => [
      ...prev,
      {
        trial: currentTrial + 1,
        word: currentWord,
        displayedColor: correctColor,
        selected: selected || 'No Answer',
        correct,
        time: timeTaken.toFixed(2),
      },
    ])

    setCurrentTrial((prev) => prev + 1)
    nextTrial()
  }

  const downloadCSV = () => {
    let csv = "Trial,Word,Displayed Color,Selected,Correct,Time (s)\n"
    resultsLog.forEach((r) => {
      csv += `${r.trial},${r.word},${r.displayedColor},${r.selected},${r.correct},${r.time}\n`
    })
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stroop_results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900">Stroop Color Test</h1>
              
              {gameState === 'ready' && (
                <div className="mt-8">
                  <div className="rounded-lg bg-blue-50 p-6">
                    <h3 className="text-lg font-semibold text-blue-900">Game Rules:</h3>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-blue-900">
                      <li>You will see a word displayed in a color.</li>
                      <li>The word may spell a color name different from its ink color.</li>
                      <li>Your task is to click the button corresponding to the <strong>color of the text</strong>, not the word.</li>
                      <li>Try to answer as quickly and accurately as possible.</li>
                    </ul>
                  </div>
                  <button
                    onClick={startTest}
                    className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Start Test
                  </button>
                </div>
              )}

              {gameState === 'playing' && (
                <div className="mt-8">
                  <div className="text-center">
                    <div className="mb-4 text-xl font-semibold text-primary-600">
                      Time left: {timeLeft}s
                    </div>
                    <div
                      className="mb-8 text-6xl font-bold"
                      style={{ color: currentColor?.toLowerCase() }}
                    >
                      {currentWord}
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => checkAnswer(color, currentColor)}
                          className="rounded-md bg-white px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {gameState === 'complete' && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
                  <div className="mt-4">
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="text-green-900">
                        <p className="text-lg font-semibold">
                          Score: {resultsLog.filter((r) => r.correct).length} / {TRIALS}
                        </p>
                        <p className="mt-1">
                          Average response time:{' '}
                          {(
                            resultsLog.reduce((acc, r) => acc + parseFloat(r.time), 0) /
                            TRIALS
                          ).toFixed(2)}s
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={downloadCSV}
                      className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Download Results (CSV)
                    </button>
                    <button
                      onClick={() => setGameState('ready')}
                      className="ml-4 rounded-md bg-white px-4 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Try Again
                    </button>
                  </div>
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