// components/video-input-form.tsx
"use client"
import { useState, type FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface VideoInputFormProps {
  onSubmit: (videoUrl: string) => Promise<void>
  isLoading: boolean
}

export default function VideoInputForm({ onSubmit, isLoading }: VideoInputFormProps) {
  const [videoUrl, setVideoUrl] = useState("")

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!videoUrl.trim()) return
    onSubmit(videoUrl)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <Input
        type="url"
        placeholder="Enter YouTube video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="flex-grow"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Summarize
      </Button>
    </form>
  )
}
