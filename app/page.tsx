"use client"

import { useState, useEffect } from "react"
import MainLayout from "@/components/layout/main-layout"
import CodeEditor from "@/components/custom/code-editor"
import GPUMonitor from "@/components/custom/gpu-monitor"
import SplashScreen from "@/components/custom/splash-screen"
import { initialCode } from "@/lib/constants"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [code, setCode] = useState(initialCode)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Check if this is the first load
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedNeuroSurf")
    if (hasVisited) {
      setShowSplash(false)
    } else {
      localStorage.setItem("hasVisitedNeuroSurf", "true")
    }
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  if (status === "loading" || showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (status === "unauthenticated") {
    return null // Will redirect to login
  }

  return (
    <MainLayout codeValue={code}>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <CodeEditor initialValue={initialCode} language="javascript" onChange={handleCodeChange} />
        </div>
        <div className="h-[200px] border-t border-border">
          <GPUMonitor />
        </div>
      </div>
    </MainLayout>
  )
}

