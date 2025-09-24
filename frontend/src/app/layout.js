import { Inter } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Spark Mind - Early Dementia Detection',
  description: 'A platform for early detection of dementia through interactive cognitive games and assessments.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
