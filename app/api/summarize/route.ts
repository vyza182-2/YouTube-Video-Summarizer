// app/api/summarize/route.ts
import { NextResponse, type NextRequest } from "next/server"
import pool from "@/lib/db"
import { getUserIdFromRequest } from "@/lib/auth"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Ensure YOUTUBE_API_KEY and GEMINI_API_KEY are set in environment variables
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set. Summarization will be mocked.")
}

// Initialize Gemini API with the correct model
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null

async function getYouTubeVideoDetails(videoId: string) {
  if (!YOUTUBE_API_KEY) {
    console.warn("YOUTUBE_API_KEY not set. Returning mock video details.")
    return {
      title: "Mock Video Title",
      description: "This is a mock video description because YOUTUBE_API_KEY is not set.",
      thumbnailUrl: `/placeholder.svg?width=480&height=360&text=Video+Thumbnail`,
    }
  }
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error("YouTube API error:", response.statusText)
      return null
    }
    const data = await response.json()
    if (data.items && data.items.length > 0) {
      const snippet = data.items[0].snippet
      return {
        title: snippet.title,
        description: snippet.description,
        thumbnailUrl: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching YouTube video details:", error)
    return null
  }
}

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

function parseGeminiResponse(text: string) {
  
  const summaryMatch = text.match(/\*\*Overall Summary:\*\*\n\n([\s\S]*?)(?=\n\n\*\*AI Analysis:|\n\n\*\*Video Purpose:|\n\n\*\*Conclusions:|$)/i)
  const aiAnalysisMatch = text.match(/\*\*AI Analysis:\*\*\n\n([\s\S]*?)(?=\n\n\*\*Video Purpose:|\n\n\*\*Conclusions:|$)/i)
  const keyPointsMatch = text.match(/\*\*Key Points:\*\*\n\n([\s\S]*?)(?=\n\n\*\*Overall Summary:|\n\n\*\*AI Analysis:|\n\n\*\*Video Purpose:|\n\n\*\*Conclusions:|$)/i)
  const videoPurposeMatch = text.match(/\*\*Video Purpose:\*\*\n\n([\s\S]*?)(?=\n\n\*\*Conclusions:|$)/i)
  const conclusionsMatch = text.match(/\*\*Conclusions:\*\*\n\n([\s\S]*?)$/i)

  let keyPoints = keyPointsMatch ? keyPointsMatch[1].trim() : ""
  let summary = summaryMatch ? summaryMatch[1].trim() : ""
  let aiAnalysis = aiAnalysisMatch ? aiAnalysisMatch[1].trim() : ""
  let videoPurpose = videoPurposeMatch ? videoPurposeMatch[1].trim() : ""
  let conclusions = conclusionsMatch ? conclusionsMatch[1].trim() : ""

  return {
    keyPoints: keyPoints || "Could not extract key points.",
    summary: summary || "Could not extract summary.",
    aiAnalysis: aiAnalysis || "Could not extract AI analysis.",
    videoPurpose: videoPurpose || "Could not extract video purpose.",
    conclusions: conclusions || "Could not extract conclusions.",
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { videoUrl } = await request.json()
    if (!videoUrl) {
      return NextResponse.json({ message: "Video URL is required" }, { status: 400 })
    }

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      return NextResponse.json({ message: "Invalid YouTube URL" }, { status: 400 })
    }

    const videoDetails = await getYouTubeVideoDetails(videoId)
    if (!videoDetails) {
      return NextResponse.json({ message: "Could not fetch video details" }, { status: 500 })
    }

    let keyPoints = "Mocked key points due to API limitations or setup."
    let summary = "Mocked summary of the video content."
    let aiAnalysis = "Mocked AI analysis of the video."
    let videoPurpose = "Mocked video purpose."
    let conclusions = "Mocked conclusions drawn from the video."

    if (model) {
      const prompt = `Please analyze this YouTube video and provide a comprehensive summary in the following format:

Key Points:
- List 8-11 main points from the video
- Use bullet points
- Focus on the most important information

Overall Summary:
- Write a concise paragraph summarizing the main content
- Include the video's purpose and main message
- Keep it clear and informative

AI Analysis:
- Provide an AI-driven analysis of the video content, style, and potential audience engagement.
- Discuss any patterns, themes, or insights that an AI might identify.

Video Purpose:
- Determine the main purpose of the video (e.g., educational, entertainment, promotional, informative).
- Explain why you believe this is the video's purpose.

Conclusions:
- Provide key takeaways
- Include any final thoughts or recommendations
- Mention the video's impact or significance

Video Information:
Title: ${videoDetails.title}
Description: ${videoDetails.description}

Please format your response exactly as shown above, with clear section headers.`

      try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        })
        
        console.log("Raw Gemini API result:", JSON.stringify(result, null, 2));

        const response = result.response
        const text = response.text()
        const parsed = parseGeminiResponse(text)
        keyPoints = parsed.keyPoints
        summary = parsed.summary
        aiAnalysis = parsed.aiAnalysis
        videoPurpose = parsed.videoPurpose
        conclusions = parsed.conclusions
      } catch (e) {
        console.error("Gemini API error:", e)
        // Fallback to mocked data if Gemini fails
      }
    }

    const [dbResult]: any = await pool.query(
      "INSERT INTO video_summaries (user_id, video_url, video_title, thumbnail_url, key_points, summary, ai_analysis, video_purpose, conclusions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, videoUrl, videoDetails.title, videoDetails.thumbnailUrl, keyPoints, summary, aiAnalysis, videoPurpose, conclusions],
    )

    if (dbResult.insertId) {
      return NextResponse.json({
        id: dbResult.insertId,
        videoUrl,
        ...videoDetails,
        keyPoints,
        summary,
        aiAnalysis,
        videoPurpose,
        conclusions,
      })
    } else {
      throw new Error("Failed to save summary")
    }
  } catch (error) {
    console.error("Summarization error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
