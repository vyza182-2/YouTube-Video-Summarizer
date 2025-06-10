// app/api/auth/signup/route.ts
import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    console.log("Starting signup process...")
    const { username, password } = await request.json()
    console.log("Received username:", username)

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    // Check if user already exists
    console.log("Checking for existing user...")
    const [existingUsers]: any = await pool.query("SELECT id FROM users WHERE username = ?", [username])
    console.log("Existing users check result:", existingUsers)
    
    if (existingUsers.length > 0) {
      return NextResponse.json({ message: "Username already taken" }, { status: 409 })
    }

    console.log("Hashing password...")
    const hashedPassword = await hashPassword(password)
    console.log("Inserting new user...")
    
    const [result]: any = await pool.query("INSERT INTO users (username, password_hash) VALUES (?, ?)", [
      username,
      hashedPassword,
    ])
    console.log("Insert result:", result)

    if (result.insertId) {
      return NextResponse.json({ message: "User created successfully", userId: result.insertId }, { status: 201 })
    } else {
      throw new Error("Failed to create user")
    }
  } catch (error) {
    console.error("Signup error details:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
