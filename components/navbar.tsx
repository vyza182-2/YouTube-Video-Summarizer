// components/navbar.tsx
"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Youtube, LogOut, UserCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function Navbar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const storedUsername = localStorage.getItem("username")
    if (token) {
      setIsLoggedIn(true)
      setUsername(storedUsername)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    localStorage.removeItem("username")
    setIsLoggedIn(false)
    setUsername(null)
    router.push("/login")
  }

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Youtube className="h-6 w-6 text-red-500" />
          <span>YT Summarizer</span>
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {username && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <UserCircle className="h-4 w-4" /> {username}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
