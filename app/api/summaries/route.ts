// app/api/summaries/route.ts
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Mock summaries data
    return NextResponse.json({
      summaries: [
        {
          id: 1,
          videoUrl: "https://youtube.com/watch?v=mock1",
          videoTitle: "Mock Video 1",
          thumbnailUrl: "https://example.com/thumbnail1.jpg",
          keyPoints: "Mock key points 1",
          summary: "Mock summary 1",
          aiAnalysis: "Mock analysis 1",
          videoPurpose: "Mock purpose 1",
          conclusions: "Mock conclusions 1",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          videoUrl: "https://youtube.com/watch?v=mock2",
          videoTitle: "Mock Video 2",
          thumbnailUrl: "https://example.com/thumbnail2.jpg",
          keyPoints: "Mock key points 2",
          summary: "Mock summary 2",
          aiAnalysis: "Mock analysis 2",
          videoPurpose: "Mock purpose 2",
          conclusions: "Mock conclusions 2",
          createdAt: new Date().toISOString()
        }
      ]
    })
  } catch (error) {
    console.error("Error fetching summaries:", error)
    return NextResponse.json(
      { error: "Failed to fetch summaries" },
      { status: 500 }
    )
  }
}
