// app/api/summaries/route.ts
import { NextResponse, type NextRequest } from "next/server"
import pool from "@/lib/db"
import { getUserIdFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const [summaries]: any = await pool.query(
      "SELECT id, video_url, video_title, thumbnail_url, key_points, summary, conclusions, created_at FROM video_summaries WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
    )
    return NextResponse.json(summaries)
  } catch (error) {
    console.error("Error fetching summaries:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
