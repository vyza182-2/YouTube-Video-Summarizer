// app/page.tsx
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar" // Assuming you have a Navbar component
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Youtube, Zap, FileText } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Optional: Redirect to dashboard if logged in, or keep on landing page
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   router.push('/dashboard');
    // }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-background text-foreground py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <Youtube className="mx-auto h-16 w-16 text-red-500 mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Unlock Video Insights Instantly</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Paste any YouTube video URL and get concise summaries, key takeaways, and conclusions powered by AI. Save
              time and learn faster.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/40">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-lg">
                <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">1. Paste URL</h3>
                <p className="text-muted-foreground">
                  Simply copy and paste the URL of the YouTube video you want to summarize.
                </p>
              </div>
              <div className="p-6 rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI, powered by Google Gemini, processes the video content to extract key information.
                </p>
              </div>
              <div className="p-6 rounded-lg">
                <Zap className="mx-auto h-12 w-12 text-primary mb-4" /> {/* Re-using Zap, consider another icon */}
                <h3 className="text-xl font-semibold mb-2">3. Get Summary</h3>
                <p className="text-muted-foreground">
                  Receive a structured summary including key points, overall digest, and main conclusions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="text-center py-6 border-t text-sm text-muted-foreground">
        © {new Date().getFullYear()} YT Summarizer. All rights reserved.
      </footer>
    </div>
  )
}
