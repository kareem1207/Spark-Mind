"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Brain,
  User,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  Gamepad2,
  FileText,
  Settings,
} from "lucide-react";

export default function Navigation() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Games", href: "/games", icon: Gamepad2 },
    { name: "Results", href: "/results", icon: BarChart3 },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "API Config", href: "/api-config", icon: Settings },
  ];

  if (status === "loading") {
    return (
      <nav
        className="backdrop-blur-lg border-b sticky top-0 z-50"
        style={{
          backgroundColor: "rgba(243, 239, 236, 0.8)",
          borderColor: "#c7d9e5",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div
                className="animate-pulse h-8 w-32 rounded"
                style={{ backgroundColor: "#c7d9e5" }}
              ></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="backdrop-blur-lg border-b sticky top-0 z-50 shadow-sm"
      style={{
        backgroundColor: "rgba(243, 239, 236, 0.8)",
        borderColor: "#c7d9e5",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Brain
                  className="h-8 w-8 transition-colors"
                  style={{ color: "#2e4156" }}
                  onMouseEnter={(e) => (e.target.style.color = "#587c90")}
                  onMouseLeave={(e) => (e.target.style.color = "#2e4156")}
                />
                <div
                  className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-50 transition-opacity"
                  style={{ backgroundColor: "#c7d9e5" }}
                ></div>
              </div>
              <span className="text-xl font-bold" style={{ color: "#2e4156" }}>
                Early Spark
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {session && (
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors group"
                  style={{ color: "#587c90" }}
                  onMouseEnter={(e) => (e.target.style.color = "#2e4156")}
                  onMouseLeave={(e) => (e.target.style.color = "#587c90")}
                >
                  <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full ring-2 ring-indigo-100"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-early-spark-primary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-early-spark-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-early-spark-teal rounded-full border-2 border-early-spark-white"></div>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-early-spark-navy">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-early-spark-teal">
                      {session.user?.email}
                    </p>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center space-x-2 text-early-spark-teal hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors group"
                >
                  <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-gradient-early-spark-primary text-early-spark-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            {session && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-early-spark-teal hover:text-early-spark-navy hover:bg-early-spark-sky-blue transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {session && mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-early-spark-white/95 backdrop-blur-sm rounded-lg mt-2 border border-early-spark-sky-blue shadow-lg">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 text-early-spark-teal hover:text-early-spark-navy hover:bg-early-spark-sky-blue px-3 py-3 rounded-md text-base font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
