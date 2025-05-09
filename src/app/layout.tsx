'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-[var(--background)]">
          <nav className="border-b border-[var(--card-hover)] bg-[var(--card-bg)]">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="flex h-16 items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                  Task Manager
                </Link>
                <div className="flex gap-4">
                  <Link
                    href="/"
                    className={`rounded px-3 py-2 transition-colors ${
                      isActive('/')
                        ? 'bg-[var(--primary)] text-white'
                        : 'hover:bg-[var(--card-hover)]'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/tasks"
                    className={`rounded px-3 py-2 transition-colors ${
                      isActive('/tasks')
                        ? 'bg-[var(--primary)] text-white'
                        : 'hover:bg-[var(--card-hover)]'
                    }`}
                  >
                    Tasks
                  </Link>
                  <Link
                    href="/add-task"
                    className={`rounded px-3 py-2 transition-colors ${
                      isActive('/add-task')
                        ? 'bg-[var(--primary)] text-white'
                        : 'hover:bg-[var(--card-hover)]'
                    }`}
                  >
                    Add Task
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="container mx-auto max-w-7xl p-4">{children}</main>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </body>
    </html>
  );
}
