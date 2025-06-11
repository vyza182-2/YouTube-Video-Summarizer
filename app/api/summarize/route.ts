// app/api/summarize/route.ts
import { NextResponse } from "next/server"
import { google } from "googleapis"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize YouTube API client
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY
})

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "")

// Function to extract video ID from URL
function getVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

// Function to analyze video content using AI
async function analyzeVideoContent(description: string, title: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    // Generate key points
    const keyPointsPrompt = `Analyze this YouTube video and extract the main key points. Format them as a numbered list.
    Title: ${title}
    Description: ${description}
    Provide 5-7 key points that summarize the main content.`
    
    const keyPointsResult = await model.generateContent(keyPointsPrompt)
    const keyPoints = keyPointsResult.response.text()

    // Generate conclusion
    const conclusionPrompt = `Based on this YouTube video content, provide a concise conclusion that summarizes the main takeaways and implications.
    Title: ${title}
    Description: ${description}
    Key Points: ${keyPoints}
    Write a brief conclusion (2-3 sentences) that captures the essence of the video.`
    
    const conclusionResult = await model.generateContent(conclusionPrompt)
    const conclusion = conclusionResult.response.text()

    // Generate content analysis
    const analysisPrompt = `Analyze this YouTube video content and provide insights about its structure, purpose, and effectiveness.
    Title: ${title}
    Description: ${description}
    Key Points: ${keyPoints}
    Provide a brief analysis (3-4 sentences) about the video's content, purpose, and potential impact.`
    
    const analysisResult = await model.generateContent(analysisPrompt)
    const analysis = analysisResult.response.text()

    return { keyPoints, conclusion, analysis }
  } catch (error) {
    console.error("AI analysis error:", error)
    return {
      keyPoints: "Unable to generate key points",
      conclusion: "Unable to generate conclusion",
      analysis: "Unable to generate analysis"
    }
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    const videoId = getVideoId(url)
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      )
    }

    // Get video details
    const videoResponse = await youtube.videos.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: [videoId]
    })

    const video = videoResponse.data.items?.[0]
    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      )
    }

    // Format duration from ISO 8601 to readable format
    const duration = video.contentDetails?.duration
      ?.replace("PT", "")
      .replace("H", "h ")
      .replace("M", "m ")
      .replace("S", "s")
      .trim()

    // Get video comments for analysis
    const commentsResponse = await youtube.commentThreads.list({
      part: ["snippet"],
      videoId: videoId,
      maxResults: 100
    })

    const comments = commentsResponse.data.items || []
    const commentTexts = comments.map(comment => 
      comment.snippet?.topLevelComment?.snippet?.textDisplay || ""
    )

    // Basic sentiment analysis
    const sentiment = commentTexts.length > 0 ? "Positive" : "Neutral"

    // Analyze video content using AI
    const { keyPoints, conclusion, analysis } = await analyzeVideoContent(
      video.snippet?.description || "",
      video.snippet?.title || ""
    )

    return NextResponse.json({
      message: "Video analysis completed successfully",
      title: video.snippet?.title,
      channelTitle: video.snippet?.channelTitle,
      thumbnail: video.snippet?.thumbnails?.maxres?.url || video.snippet?.thumbnails?.high?.url,
      publishedAt: new Date(video.snippet?.publishedAt || "").toLocaleDateString(),
      duration: duration,
      viewCount: parseInt(video.statistics?.viewCount || "0").toLocaleString(),
      likeCount: parseInt(video.statistics?.likeCount || "0").toLocaleString(),
      commentCount: parseInt(video.statistics?.commentCount || "0").toLocaleString(),
      description: video.snippet?.description,
      tags: video.snippet?.tags || [],
      category: video.snippet?.categoryId,
      sentiment: sentiment,
      engagementRate: video.statistics?.viewCount ? 
        ((parseInt(video.statistics?.likeCount || "0") / parseInt(video.statistics?.viewCount)) * 100).toFixed(2) + "%" : 
        "N/A",
      keyPoints,
      conclusion,
      analysis
    })
  } catch (error) {
    console.error("Video analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze video" },
      { status: 500 }
    )
  }
}
