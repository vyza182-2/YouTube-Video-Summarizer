// app/page.tsx
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar" // Assuming you have a Navbar component
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Youtube, Zap, FileText } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/40">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          YouTube Video Summarizer
        </h1>
        <p className="text-lg text-muted-foreground">
          Get instant AI-powered summaries of any YouTube video. Save time and get the key points quickly.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
