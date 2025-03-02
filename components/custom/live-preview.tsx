"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface LivePreviewProps {
  code: string
}

export default function LivePreview({ code }: LivePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [html, setHtml] = useState("")

  // Generate a simple preview HTML based on the code
  const generatePreviewHtml = (code: string) => {
    try {
      // Extract JSX from the code (very simplified)
      const jsxMatch = code.match(/return\s*$$\s*<([^]*?)>\s*$$/s)

      if (jsxMatch && jsxMatch[1]) {
        // Create a simplified HTML version
        let jsx = jsxMatch[0]
          .replace("return (", "")
          .replace(/\)\s*;?\s*$/, "")
          .trim()

        // Replace React-specific attributes with HTML ones
        jsx = jsx
          .replace(/className=/g, "class=")
          .replace(/onClick=/g, "onclick=")
          .replace(/onChange=/g, "onchange=")

        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: system-ui, sans-serif; padding: 20px; }
              </style>
            </head>
            <body>
              ${jsx}
            </body>
          </html>
        `
      }

      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="p-4">
            <div class="bg-blue-500 text-white p-4 rounded-lg">
              <h2 class="text-xl font-bold">Preview Component</h2>
              <p class="mt-2">No renderable component found. Make sure your code includes a component with a return statement.</p>
            </div>
          </body>
        </html>
      `
    } catch (error) {
      console.error("Error generating preview HTML:", error)
      throw new Error("Failed to generate preview")
    }
  }

  const compileCode = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const simpleHtml = generatePreviewHtml(code)
      setHtml(simpleHtml)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during compilation")
    } finally {
      setIsLoading(false)
    }
  }

  // Update preview when code changes
  useEffect(() => {
    compileCode()
  }, [code])

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="preview" className="flex-1">
        <TabsList className="w-full justify-start h-10 bg-muted/50 rounded-none border-b border-border">
          <TabsTrigger value="preview" className="rounded-none data-[state=active]:bg-background">
            Preview
          </TabsTrigger>
          <TabsTrigger value="console" className="rounded-none data-[state=active]:bg-background">
            Console
          </TabsTrigger>
          <TabsTrigger value="network" className="rounded-none data-[state=active]:bg-background">
            Network
          </TabsTrigger>
          <div className="ml-auto mr-2">
            <Button variant="ghost" size="sm" onClick={() => compileCode()} className="h-7 px-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-1">Refresh</span>
            </Button>
          </div>
        </TabsList>

        <TabsContent value="preview" className="flex-1 mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Compiling preview...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">
              <h3 className="font-bold">Error</h3>
              <pre className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded overflow-auto text-sm">{error}</pre>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full w-full bg-white dark:bg-black"
            >
              <iframe
                srcDoc={html}
                title="Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                onError={(e) => setError("Failed to render preview")}
              />
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="console" className="mt-0 p-4">
          <div className="font-mono text-sm">
            <div className="text-muted-foreground">No console output</div>
          </div>
        </TabsContent>

        <TabsContent value="network" className="mt-0 p-4">
          <div className="font-mono text-sm">
            <div className="text-muted-foreground">No network activity</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

