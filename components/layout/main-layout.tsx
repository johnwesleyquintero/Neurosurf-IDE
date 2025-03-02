"use client"

import { type ReactNode, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { Code, FileCode, Github, Moon, Settings, Sun, Play, Layout } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import AIPanel from "@/components/layout/ai-panel"
import Footer from "@/components/layout/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import LivePreview from "@/components/custom/live-preview"

interface MainLayoutProps {
  children: ReactNode
  codeValue?: string
}

export default function MainLayout({ children, codeValue }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleAIPanel = () => setIsAIPanelOpen(!isAIPanelOpen)
  const togglePreview = () => setIsPreviewOpen(!isPreviewOpen)
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* Header */}
      <header className="h-12 border-b border-border flex items-center px-4 bg-card">
        <div className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-touch-icon-V8hCbfJyMMQcsIMgtvJpB7TClUo2Mv.png"
            alt="Nebula Logo"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span className="font-bold text-lg">NeuroSurf</span>
        </div>
        <div className="flex items-center ml-auto gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon">
            <Github className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="h-10 border-b border-border flex items-center px-4 bg-muted/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-7 gap-1">
            <FileCode className="h-4 w-4" />
            File
          </Button>
          <Button variant="ghost" size="sm" className="h-7 gap-1">
            <Code className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="h-7 gap-1">
            View
          </Button>
          <Button variant="ghost" size="sm" className="h-7 gap-1">
            Terminal
          </Button>
          <Button variant="ghost" size="sm" className="h-7 gap-1">
            AI Tools
          </Button>
        </div>
        <div className="ml-auto">
          <Button
            variant={isPreviewOpen ? "default" : "outline"}
            size="sm"
            className="h-7 gap-1"
            onClick={togglePreview}
          >
            <Play className="h-3.5 w-3.5" />
            Live Preview
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div
          className="border-r border-border bg-card"
          initial={{ width: isSidebarOpen ? 250 : 0 }}
          animate={{ width: isSidebarOpen ? 250 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isSidebarOpen && <Sidebar />}
        </motion.div>

        {/* Toggle Sidebar Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-[88px] z-10 h-8 w-8 rounded-r-md rounded-l-none border border-l-0 border-border bg-card"
          onClick={toggleSidebar}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform ${isSidebarOpen ? "rotate-0" : "rotate-180"}`}
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>

        {/* Live Preview Panel */}
        <motion.div
          className="border-l border-border bg-card"
          initial={{ width: isPreviewOpen ? 350 : 0 }}
          animate={{ width: isPreviewOpen ? 350 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isPreviewOpen && <LivePreview code={codeValue || ""} />}
        </motion.div>

        {/* Toggle Preview Button */}
        {isPreviewOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-[350px] top-[88px] z-10 h-8 w-8 rounded-l-md rounded-r-none border border-r-0 border-border bg-card"
            onClick={togglePreview}
          >
            <Layout className="h-4 w-4" />
          </Button>
        )}

        {/* AI Panel */}
        <motion.div
          className="border-l border-border bg-card"
          initial={{ width: isAIPanelOpen ? 350 : 0 }}
          animate={{ width: isAIPanelOpen ? 350 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isAIPanelOpen && <AIPanel />}
        </motion.div>

        {/* Toggle AI Panel Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-[88px] z-10 h-8 w-8 rounded-l-md rounded-r-none border border-r-0 border-border bg-card"
          onClick={toggleAIPanel}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform ${isAIPanelOpen ? "rotate-180" : "rotate-0"}`}
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      {/* Footer */}
      <Footer />

      <Toaster />
    </div>
  )
}

