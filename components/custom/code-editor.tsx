"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodeEditorProps {
  initialValue: string
  language: string
  onChange?: (code: string) => void
}

export default function CodeEditor({ initialValue, language, onChange }: CodeEditorProps) {
  const [code, setCode] = useState(initialValue)
  const [activeTab, setActiveTab] = useState("app.tsx")

  // Simple syntax highlighting for demonstration
  const highlightCode = (code: string) => {
    // TODO: Replace with a proper syntax highlighter like Prism.js or highlight.js in production
    // This is a very basic implementation for demonstration purposes only
    return code
      .replace(
        /(import|export|from|const|let|function|return|if|else|for|while|class|extends|interface|type)/g,
        '<span class="text-purple-500">$1</span>',
      )
      .replace(/(["'])(.*?)\1/g, '<span class="text-green-500">$1$2$1</span>')
      .replace(/\b(true|false|null|undefined|this)\b/g, '<span class="text-amber-500">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-orange-500">$1</span>')
      .replace(/\/\/(.*)/g, '<span class="text-slate-500">// $1</span>')
      .replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="text-blue-500">$1</span>')
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)
    if (onChange) {
      onChange(newCode)
    }
  }

  // Update parent component when code changes
  useEffect(() => {
    if (onChange) {
      onChange(code)
    }
  }, [code, onChange])

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="w-full justify-start h-10 bg-muted/50 rounded-none border-b border-border">
          <TabsTrigger value="app.tsx" className="rounded-none data-[state=active]:bg-background">
            app.tsx
          </TabsTrigger>
          <TabsTrigger value="README.md" className="rounded-none data-[state=active]:bg-background">
            README.md
          </TabsTrigger>
          <TabsTrigger value="package.json" className="rounded-none data-[state=active]:bg-background">
            package.json
          </TabsTrigger>
        </TabsList>

        <TabsContent value="app.tsx" className="flex-1 mt-0 relative">
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="absolute inset-0 bg-transparent text-transparent caret-white font-mono text-sm p-4 resize-none outline-none w-full h-full z-10"
          />
          <pre className="font-mono text-sm p-4 overflow-auto h-full w-full">
            <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} className="text-foreground" />
          </pre>
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-2 text-xs text-muted-foreground font-mono bg-muted/20">
            {code.split("\n").map((_, i) => (
              <div key={i} className="h-[1.5rem] leading-[1.5rem]">
                {i + 1}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="README.md" className="flex-1 mt-0 p-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h1>NeuroSurf</h1>
            <p>An AI-powered IDE and chat interface built on the Nebula Architectural Constitution.</p>

            <h2>Features</h2>
            <ul>
              <li>AI-assisted coding with context-aware completions</li>
              <li>Integrated GPU monitoring for machine learning workflows</li>
              <li>Jupyter notebook integration for data science</li>
              <li>Voice command support for hands-free coding</li>
              <li>Real-time debugging with AI insights</li>
              <li>Next.js App Router for seamless navigation</li>
              <li>AI SDK integration for powerful AI capabilities</li>
              <li>Authentication with NextAuth.js</li>
              <li>Data persistence with Vercel Postgres and Blob</li>
            </ul>

            <h2>Getting Started</h2>
            <p>To run the development server:</p>
            <pre>
              <code>npm run dev</code>
            </pre>

            <p>
              Open <a href="http://localhost:3000">http://localhost:3000</a> with your browser to see the result.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="package.json" className="flex-1 mt-0 p-4">
          <pre className="font-mono text-sm">
            {`{
  "name": "neurosurf",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^1.0.0",
    "@prisma/client": "^5.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@tanstack/react-query": "^5.8.4",
    "@vercel/blob": "^0.15.1",
    "ai": "^2.2.0",
    "@ai-sdk/openai": "^1.0.0",
    "framer-motion": "^10.16.5",
    "next": "14.0.3",
    "next-auth": "^4.24.5",
    "next-themes": "^0.2.1",
    "react": "^18",
    "react-dom": "^18"
  }
}`}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  )
}

