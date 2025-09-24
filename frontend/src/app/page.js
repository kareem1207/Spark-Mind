'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white bg-opacity-95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/brain-spark-logo.svg"
                  alt="Brain Spark"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="ml-2 text-xl font-semibold text-blue-900">Early Spark</span>
              </Link>
            </div>
            <div className="hidden sm:flex sm:space-x-8">
              <Link href="/" className="text-blue-900 hover:text-blue-700 px-3 py-2 font-medium">
                Home
              </Link>
              <Link href="/learn" className="text-blue-900 hover:text-blue-700 px-3 py-2 font-medium">
                Learn
              </Link>
              <Link href="/contact" className="text-blue-900 hover:text-blue-700 px-3 py-2 font-medium">
                Contact
              </Link>
              <Link href="/quick-check" className="text-blue-900 hover:text-blue-700 px-3 py-2 font-medium">
                Quick Check
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section with Questions */}
        <section className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <div className="text-center space-y-8 text-white py-20">
              <h1 className="text-5xl sm:text-6xl font-semibold italic">
                <span className="font-normal">Forgot</span> where you left something??
              </h1>
              <h1 className="text-5xl sm:text-6xl font-semibold">
                Recognized someone but Name <span className="italic">Escapes</span>??
              </h1>
              <h1 className="text-5xl sm:text-6xl font-semibold">
                Tasks fell <span className="italic">trickier</span> than usual??
              </h1>
              <p className="mt-16 text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                We agree—life comes with little bumps, That's okay, we've got you. Take a moment for yourself. 
                Explore, stay curious, and keep your mind active.
              </p>
            </div>
          </div>
        </section>

        {/* Understanding Brain Health Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-16">
              Understanding <span className="italic">Brain</span> Health
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dementia Information */}
              <div className="bg-blue-50 rounded-3xl p-8">
                <div className="flex items-start space-x-4">
                  <Image 
                    src="/brain-icon.svg" 
                    alt="Brain Icon" 
                    width={24} 
                    height={24}
                    className="text-pink-500 mt-1"
                  />
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-900 mb-4">Dementia</h3>
                    <p className="text-lg text-blue-800 mb-4">
                      Dementia is a condition that <span className="italic">affects memory, thinking, and behavior</span>.
                    </p>
                    <p className="text-lg text-blue-800">
                      It is not a <span className="font-medium">normal</span> part of aging, but it becomes more{' '}
                      <span className="italic">common</span> as people grow <span className="italic">older</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Types and Signs */}
              <div className="space-y-8">
                <div className="bg-blue-50 rounded-3xl p-8">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Common Types:</h3>
                  <ul className="space-y-2 text-lg text-blue-800">
                    <li>• Alzheimer's Disease</li>
                    <li>• Vascular Dementia</li>
                    <li>• Lewy Body Dementia</li>
                    <li>• Frontotemporal Dementia</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-3xl p-8">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Early Signs:</h3>
                  <ul className="space-y-2 text-lg text-blue-800">
                    <li>• Memory Loss</li>
                    <li>• Difficulty Planning</li>
                    <li>• Language Problems</li>
                    <li>• Poor Judgment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Game Section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-blue-900">
                Take a Quick Game
              </h2>
              <p className="text-xl text-blue-700 max-w-3xl mx-auto">
                Our interactive games are designed to assess different cognitive functions
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/games/memory" className="group relative">
                <div className="bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl">
                  <div className="aspect-square relative mb-6">
                    <Image
                      src="/memory-game.svg"
                      alt="Memory Game"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-blue-900 mb-2">Memory Game</h3>
                  <p className="text-blue-700">Test your short-term memory and recall abilities</p>
                </div>
              </Link>

              <Link href="/games/stroop" className="group relative">
                <div className="bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl">
                  <div className="aspect-square relative mb-6">
                    <Image
                      src="/stroop-test.svg"
                      alt="Stroop Test"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-blue-900 mb-2">Stroop Test</h3>
                  <p className="text-blue-700">Challenge your cognitive flexibility and attention</p>
                </div>
              </Link>

              <Link href="/games/word-recall" className="group relative">
                <div className="bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl">
                  <div className="aspect-square relative mb-6">
                    <Image
                      src="/word-recall.svg"
                      alt="Word Recall"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-blue-900 mb-2">Word Recall</h3>
                  <p className="text-blue-700">Evaluate your verbal memory and language skills</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Comprehensive Assessment</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Four Interactive Cognitive Games
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our scientifically designed games help assess different aspects of cognitive function, making detection
              more accurate and comprehensive.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Stroop Color Test
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Test your cognitive flexibility and attention control with this classic assessment.</p>
                  <p className="mt-6">
                    <Link href="/games/stroop" className="text-sm font-semibold leading-6 text-primary-600">
                      Try Now <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Memory Game
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Challenge your memory with our engaging visual memory exercise.</p>
                  <p className="mt-6">
                    <Link href="/games/memory" className="text-sm font-semibold leading-6 text-primary-600">
                      Try Now <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Object Matching
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Test your cognitive association skills by matching objects with their purposes.</p>
                  <p className="mt-6">
                    <Link href="/games/matching" className="text-sm font-semibold leading-6 text-primary-600">
                      Try Now <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Speech Assessment
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Evaluate speech patterns and cognitive function through conversation.</p>
                  <p className="mt-6">
                    <Link href="/games/speech" className="text-sm font-semibold leading-6 text-primary-600">
                      Try Now <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
