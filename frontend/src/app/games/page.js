'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const games = [
  {
    id: 'stroop',
    title: 'Stroop Color Test',
    description: 'Test your cognitive flexibility and attention control',
    image: '/images/stroop-game.png',
    path: '/games/stroop',
  },
  {
    id: 'memory',
    title: 'Memory Game',
    description: 'Challenge your memory with pattern recognition',
    image: '/images/memory-game.png',
    path: '/games/memory',
  },
  {
    id: 'matching',
    title: 'Object Matching',
    description: 'Match objects with their correct purposes',
    image: '/images/matching-game.png',
    path: '/games/matching',
  },
  {
    id: 'speech',
    title: 'Speech Assessment',
    description: 'Evaluate speech patterns through conversation',
    image: '/images/speech-game.png',
    path: '/games/speech',
  },
]

export default function Games() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Cognitive Assessment Games</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose a game to begin your assessment. Each game tests different aspects of cognitive function.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {games.map((game) => (
              <Link
                key={game.id}
                href={game.path}
                className="group bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <div className="w-full h-48 bg-blue-100 flex items-center justify-center">
                    <Image
                      src={game.image}
                      alt={game.title}
                      width={200}
                      height={150}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2 group-hover:text-blue-600">
                    {game.title}
                  </h3>
                  <p className="text-gray-600">{game.description}</p>
                  <div className="mt-4 flex items-center text-blue-600 font-medium">
                    Start Game
                    <svg
                      className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">Why Take These Tests?</h2>
              <p className="text-gray-700 mb-6">
                Regular cognitive assessment can help identify potential concerns early. These games are designed to be both
                engaging and informative, providing valuable insights into different aspects of cognitive function.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">What We Measure:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Memory retention</li>
                    <li>Processing speed</li>
                    <li>Cognitive flexibility</li>
                    <li>Pattern recognition</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">Benefits:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Early detection</li>
                    <li>Progress tracking</li>
                    <li>Brain exercise</li>
                    <li>Professional insights</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}