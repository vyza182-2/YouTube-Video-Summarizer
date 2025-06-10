// app/dashboard/page.tsx
"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import VideoInputForm from "@/components/video-input-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import LoadingSteps from "@/components/loading-steps"

interface SummaryData {
  id: number
  videoUrl: string
  videoTitle: string
  thumbnailUrl: string
  keyPoints: string
  summary: string
  conclusions: string
  aiAnalysis: string
  videoPurpose: string
}

type LoadingStep = "fetching" | "analyzing" | "summarizing" | "translating" | null

export default function DashboardPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<LoadingStep>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }
  }, [router])

  const handleSummarize = async (videoUrl: string) => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }
    setIsLoading(true)
    setError(null)
    setSummary(null)

    try {
      // Step 1: Fetching video information
      setCurrentStep("fetching")
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ videoUrl }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to summarize video")
      }

      // Simulate steps for demo purposes
      setCurrentStep("analyzing")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setCurrentStep("summarizing")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setCurrentStep("translating")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSummary(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
      setCurrentStep(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold">YouTube Video Summarizer</h1>

        <VideoInputForm onSubmit={handleSummarize} isLoading={isLoading} />

        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && currentStep && (
          <Card>
            <CardContent className="pt-6">
              <LoadingSteps currentStep={currentStep} />
            </CardContent>
          </Card>
        )}

        {summary && (
          <div className="space-y-6">
            {/* Video Information */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  {summary.thumbnailUrl && (
                    <Image
                      src={summary.thumbnailUrl || "/placeholder.svg"}
                      alt={`Thumbnail for ${summary.videoTitle}`}
                      width={240}
                      height={135}
                      className="rounded-lg object-cover aspect-video"
                    />
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{summary.videoTitle}</CardTitle>
                    <a
                      href={summary.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                    >
                      Watch on YouTube <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: summary.aiAnalysis?.replace(/\n/g, "<br />") || "No AI analysis available" }}
                />
              </CardContent>
            </Card>

            {/* Key Points */}
            <Card>
              <CardHeader>
                <CardTitle>Key Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: summary.keyPoints?.replace(/\n/g, "<br />") || "No key points available" }}
                />
              </CardContent>
            </Card>

            {/* Video Purpose */}
            <Card>
              <CardHeader>
                <CardTitle>Video Purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: summary.videoPurpose?.replace(/\n/g, "<br />") || "No video purpose available" }}
                />
              </CardContent>
            </Card>

            {/* Conclusions */}
            <Card>
              <CardHeader>
                <CardTitle>Conclusions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{summary.conclusions || "No conclusions available"}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <footer className="text-center py-4 border-t text-sm text-muted-foreground">
      ❤

      </footer>
    </div>
  )
}
