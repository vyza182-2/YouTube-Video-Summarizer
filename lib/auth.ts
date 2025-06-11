// lib/auth.ts
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key" // Fallback for local dev if not set, but ensure it's set in prod
const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return "hashed_password" // Mock implementation
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return true // Mock implementation - always returns true
}

export function generateToken(userId: string, username: string): string {
  return jwt.sign(
    { userId, username },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" }
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
  } catch (error) {
    return null
  }
}

export async function getUserIdFromRequest(req: NextRequest): Promise<number | null> {
  const authHeader = req.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    return decoded?.userId || null
  }
  return null
}
