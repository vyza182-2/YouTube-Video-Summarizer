// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { comparePassword, generateToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    const [users]: any = await pool.query("SELECT id, username, password_hash FROM users WHERE username = ?", [
      username,
    ])
    if (users.length === 0) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]
    const passwordMatch = await comparePassword(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(user.id, user.username)
    return NextResponse.json({ message: "Login successful", token, userId: user.id, username: user.username })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
