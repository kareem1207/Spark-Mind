import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "ForeKnow - Dementia Early Detection System",
  description:
    "Advanced cognitive assessment system for early dementia detection through interactive games and AI analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen`}
        style={{
          background: "linear-gradient(135deg, #f3efec 0%, #ffffff 100%)",
        }}
      >
        <SessionProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
