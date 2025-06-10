// components/summary-display.tsx
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

export interface SummaryData {
  id: number
  videoUrl: string
  videoTitle: string
  thumbnailUrl: string
  keyPoints: string
  summary: string
  conclusions: string
  created_at?: string // Optional for new summaries not yet having it
}

interface SummaryDisplayProps {
  summaryData: SummaryData
}

export default function SummaryDisplay({ summaryData }: SummaryDisplayProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {summaryData.thumbnailUrl && (
            <Image
              src={summaryData.thumbnailUrl || "/placeholder.svg"}
              alt={`Thumbnail for ${summaryData.videoTitle}`}
              width={240}
              height={135}
              className="rounded-lg object-cover aspect-video"
            />
          )}
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{summaryData.videoTitle}</CardTitle>
            <a
              href={summaryData.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              Watch on YouTube <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">Key Points</h3>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: summaryData.keyPoints?.replace(/\n/g, "<br />") || "No key points available" }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">Summary</h3>
          <p className="text-sm text-muted-foreground">{summaryData.summary || "No summary available"}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">Conclusions</h3>
          <p className="text-sm text-muted-foreground">{summaryData.conclusions || "No conclusions available"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
