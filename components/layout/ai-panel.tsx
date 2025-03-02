"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendIcon, Sparkles, Code, Bug, BookOpen, Copy, Check } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useChat, useCompletion } from "ai/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
}

interface DocResult {
  title: string
  content: string
}

export default function AIPanel() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("chat")
  const [copied, setCopied] = useState(false)

  // Chat functionality
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        content: "Hello! I'm your NeuroSurf AI assistant. How can I help with your coding today?",
        role: "assistant",
      },
    ],
  })

  // Code completion functionality
  const {
    completion,
    input: codeInput,
    handleInputChange: handleCodeInputChange,
    handleSubmit: handleCodeSubmit,
    isLoading: isCodeLoading,
  } = useCompletion({
    api: "/api/code-complete",
  })

  // Documentation search state
  const [docQuery, setDocQuery] = useState("")
  const [docResults, setDocResults] = useState<DocResult[]>([])
  const [isDocLoading, setIsDocLoading] = useState(false)

  // Debug analysis state
  const [debugCode, setDebugCode] = useState("")
  const [debugResult, setDebugResult] = useState<string | null>(null)
  const [isDebugLoading, setIsDebugLoading] = useState(false)

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDocSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDocLoading(true)
    try {
      const response = await fetch("/api/docs-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: docQuery }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error: ${response.status}`)
      }
      const data = await response.json()
      setDocResults(data.results || [])
    } catch (error) {
      console.error("Doc search error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search documentation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDocLoading(false)
    }
  }

  const handleDebugAnalysis = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDebugLoading(true)
    try {
      const response = await fetch("/api/debug-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: debugCode }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error: ${response.status}`)
      }
      const data = await response.json()
      setDebugResult(data.analysis)
    } catch (error) {
      console.error("Debug analysis error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDebugLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="w-full justify-start h-10 bg-muted/50 rounded-none border-b border-border">
          <TabsTrigger value="chat" className="rounded-none data-[state=active]:bg-background gap-1">
            <Sparkles className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="code" className="rounded-none data-[state=active]:bg-background gap-1">
            <Code className="h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="debug" className="rounded-none data-[state=active]:bg-background gap-1">
            <Bug className="h-4 w-4" />
            Debug
          </TabsTrigger>
          <TabsTrigger value="docs" className="rounded-none data-[state=active]:bg-background gap-1">
            <BookOpen className="h-4 w-4" />
            Docs
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 mt-0 flex flex-col">
          <div className="flex-1 p-4 overflow-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div className="flex gap-2 max-w-[80%]">
                    {message.role !== "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/ai-avatar.png" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "rounded-lg p-3",
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.role === "assistant" && message.content.includes("```") && (
                        <div className="mt-2 bg-background/20 p-2 rounded text-xs font-mono overflow-x-auto relative group">
                          {message.content
                            .split("```")
                            .filter((_, i) => i % 2 === 1)
                            .map((code, i) => (
                              <pre key={i} className="whitespace-pre-wrap">
                                {code.replace(/^(js|jsx|ts|tsx|javascript|typescript)?\n/, "")}
                              </pre>
                            ))}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleCopy(message.content)}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      )}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session?.user?.image || "/user-avatar.png"}
                          alt={session?.user?.name || "User"}
                        />
                        <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </motion.div>
              ))}
              {isChatLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/ai-avatar.png" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted max-w-[80%] rounded-lg p-3">
                      <div className="flex space-x-2">
                        <div
                          className="h-2 w-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input value={input} onChange={handleInputChange} placeholder="Ask NeuroSurf AI..." className="flex-1" />
              <Button type="submit" size="icon" disabled={isChatLoading || !input.trim()}>
                <SendIcon className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Code Completion Tab */}
        <TabsContent value="code" className="flex-1 mt-0 flex flex-col">
          <div className="flex-1 p-4 overflow-auto">
            {completion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 bg-muted p-4 rounded-lg relative group"
              >
                <pre className="text-sm font-mono whitespace-pre-wrap">{completion}</pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(completion)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </motion.div>
            )}
          </div>
          <div className="p-4 border-t border-border">
            <form onSubmit={handleCodeSubmit} className="flex space-x-2">
              <Input
                value={codeInput}
                onChange={handleCodeInputChange}
                placeholder="Describe the code you need..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isCodeLoading || !codeInput.trim()}>
                <Code className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Debug Tab */}
        <TabsContent value="debug" className="flex-1 mt-0 flex flex-col">
          <div className="flex-1 p-4 overflow-auto">
            <textarea
              value={debugCode}
              onChange={(e) => setDebugCode(e.target.value)}
              placeholder="Paste your code here for analysis..."
              className="w-full h-[200px] p-4 bg-muted rounded-lg font-mono text-sm resize-none mb-4"
            />
            <Button
              onClick={handleDebugAnalysis}
              disabled={isDebugLoading || !debugCode.trim()}
              className="w-full mb-4"
            >
              Analyze Code
            </Button>
            {debugResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{debugResult}</pre>
              </motion.div>
            )}
          </div>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="flex-1 mt-0 flex flex-col">
          <div className="flex-1 p-4 overflow-auto">
            <form onSubmit={handleDocSearch} className="flex space-x-2 mb-4">
              <Input
                value={docQuery}
                onChange={(e) => setDocQuery(e.target.value)}
                placeholder="Search documentation..."
                className="flex-1"
              />
              <Button type="submit" disabled={isDocLoading || !docQuery.trim()}>
                Search
              </Button>
            </form>
            {docResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4 bg-muted p-4 rounded-lg"
              >
                <h3 className="font-semibold mb-2">{result.title}</h3>
                <p className="text-sm text-muted-foreground">{result.content}</p>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

