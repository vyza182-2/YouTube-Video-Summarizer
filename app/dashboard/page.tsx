// app/dashboard/page.tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Youtube, Calendar, Clock, ThumbsUp, Eye, MessageSquare, Tag, Brain, Sparkles, Globe } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type LoadingStepKey = 'fetching' | 'analyzing' | 'summarizing' | 'translating';

interface LoadingStep {
  key: LoadingStepKey;
  icon: React.ElementType;
  text: string;
  color: string;
}

const loadingSteps: LoadingStep[] = [
  { key: 'fetching', icon: Youtube, text: 'Fetching video information...', color: 'from-blue-500 to-blue-600' },
  { key: 'analyzing', icon: Brain, text: 'Analyzing video content...', color: 'from-purple-500 to-purple-600' },
  { key: 'summarizing', icon: Sparkles, text: 'Generating AI summary...', color: 'from-pink-500 to-pink-600' },
  { key: 'translating', icon: Globe, text: 'Translating content...', color: 'from-green-500 to-green-600' }
];

function LoadingSteps({ currentStep }: { currentStep: LoadingStepKey }) {
  const stepIndex = loadingSteps.findIndex(step => step.key === currentStep);

  return (
    <div className="space-y-4">
      {loadingSteps.map((step, index) => (
        <div key={step.key} className="flex items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300",
              index <= stepIndex ? `bg-gradient-to-br ${step.color} text-white` : "bg-muted text-muted-foreground"
            )}
          >
            <step.icon className="h-4 w-4" />
          </div>
          <p
            className={cn(
              "font-medium transition-colors duration-300",
              index <= stepIndex ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {step.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<LoadingStepKey | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoData, setVideoData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    setVideoData(null) // Clear previous video data
    setCurrentStep('fetching')

    try {
      // Simulate fetching video info
      await new Promise(resolve => setTimeout(resolve, 500));

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze video")
      }

      // Simulate AI processing steps
      setCurrentStep('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep('summarizing');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentStep('translating'); // Simulating translation if applicable
      await new Promise(resolve => setTimeout(resolve, 1000));

      setVideoData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze video")
    } finally {
      setIsLoading(false)
      setCurrentStep(null) // Reset loading step
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">YouTube Video Analyzer</h1>
        <p className="text-muted-foreground">Get AI-powered analysis of any YouTube video</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Paste YouTube video URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      {isLoading && currentStep && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Analysis in Progress</CardTitle>
            <CardDescription>Please wait while we process the video.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingSteps currentStep={currentStep} />
          </CardContent>
        </Card>
      )}

      {!isLoading && videoData && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Video Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-1/3 aspect-video">
                  <Image
                    src={videoData.thumbnail}
                    alt={videoData.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <CardTitle className="text-2xl">{videoData.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Youtube className="h-4 w-4" />
                      <span>{videoData.channelTitle}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{videoData.publishedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{videoData.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{videoData.viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{videoData.likeCount} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{videoData.commentCount} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* AI Analysis Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Content Analysis */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Content Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: videoData.analysis?.replace(/\n/g, "<br />") || "" }} />
                </div>
              </CardContent>
            </Card>

            {/* Key Points */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: videoData.keyPoints?.replace(/\n/g, "<br />") || "" }} />
                </div>
              </CardContent>
            </Card>

            {/* Conclusion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Conclusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: videoData.conclusion?.replace(/\n/g, "<br />") || "" }} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{videoData.description}</p>
            </CardContent>
          </Card>

          {/* Video Tags */}
          {videoData.tags && videoData.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {videoData.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Engagement Rate</h3>
                <p className="text-muted-foreground">{videoData.engagementRate}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Audience Sentiment</h3>
                <p className="text-muted-foreground">{videoData.sentiment}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
