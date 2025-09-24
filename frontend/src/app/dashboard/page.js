'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Performance Over Time',
    },
  },
}

// Mock data - replace with real data from your backend
const mockData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Stroop Test',
      data: [85, 88, 87, 90],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Memory Game',
      data: [78, 82, 85, 88],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!session) {
    router.push('/')
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Profile section */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <h2 className="sr-only" id="profile-overview-title">
              Profile Overview
            </h2>
            <div className="bg-white p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex sm:space-x-5">
                  <div className="flex-shrink-0">
                    <img
                      className="mx-auto h-20 w-20 rounded-full"
                      src={session.user.image}
                      alt=""
                    />
                  </div>
                  <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                    <p className="text-sm font-medium text-gray-600">Welcome back,</p>
                    <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {session.user.name}
                    </p>
                    <p className="text-sm font-medium text-gray-600">{session.user.email}</p>
                  </div>
                </div>
                <div className="mt-5 flex justify-center sm:mt-0">
                  <a
                    href="/games"
                    className="flex items-center justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                  >
                    Play Games
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Total Games Played', stat: '42' },
              { name: 'Average Score', stat: '85%' },
              { name: 'Highest Score', stat: '95%' },
              { name: 'Weekly Progress', stat: '+12%' },
            ].map((item) => (
              <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Performance Trends</h3>
              <div className="mt-5">
                <Line options={options} data={mockData} />
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
              <div className="mt-5">
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {[
                      {
                        game: 'Stroop Test',
                        score: '90%',
                        date: '20 minutes ago',
                      },
                      {
                        game: 'Memory Game',
                        score: '85%',
                        date: '2 hours ago',
                      },
                      {
                        game: 'Object Matching',
                        score: '95%',
                        date: '3 hours ago',
                      },
                    ].map((activity, activityIdx) => (
                      <li key={activity.game}>
                        <div className="relative pb-8">
                          {activityIdx !== 2 ? (
                            <span
                              className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500">
                                <svg
                                  className="h-5 w-5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Completed <span className="font-medium text-gray-900">{activity.game}</span>{' '}
                                  with score{' '}
                                  <span className="font-medium text-gray-900">{activity.score}</span>
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <time dateTime={activity.date}>{activity.date}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}