"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

interface GPUStats {
  utilization: number
  memoryUsed: number
  memoryTotal: number
  temperature: number
  history: number[]
}

export default function GPUMonitor() {
  const [gpuStats, setGpuStats] = useState<GPUStats>({
    utilization: 0,
    memoryUsed: 0,
    memoryTotal: 0,
    temperature: 0,
    history: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isMounted = useRef(true)

  // Simulate real-time updates with cleanup
  useEffect(() => {
    isMounted.current = true

    const updateStats = () => {
      if (!isMounted.current) return

      setGpuStats((prev) => {
        // Generate a new random value for utilization that's not too far from the previous
        const newUtilization = Math.max(5, Math.min(95, prev.utilization + (Math.random() * 10 - 5)))

        // Update memory usage slightly
        const newMemoryUsed = Math.max(
          0.5,
          Math.min(prev.memoryTotal - 0.5, prev.memoryUsed + (Math.random() * 0.4 - 0.2)),
        )

        // Update temperature based on utilization
        const newTemperature = 50 + (newUtilization / 100) * 30

        // Update history array with new utilization
        const newHistory = [...prev.history.slice(1), Math.round(newUtilization)]

        return {
          utilization: Math.round(newUtilization),
          memoryUsed: Number.parseFloat(newMemoryUsed.toFixed(1)),
          memoryTotal: prev.memoryTotal,
          temperature: Math.round(newTemperature),
          history: newHistory,
        }
      })
    }

    const interval = setInterval(updateStats, 2000)

    return () => {
      isMounted.current = false
      clearInterval(interval)
    }
  }, [])

  // Add a function to fetch real data from the API
  const fetchGpuStats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/gpu-stats")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      setGpuStats(data)
    } catch (err) {
      console.error("Failed to fetch GPU stats:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch GPU stats")
    } finally {
      setIsLoading(false)
    }
  }

  // Call this in useEffect
  useEffect(() => {
    fetchGpuStats()
    const interval = setInterval(fetchGpuStats, 5000) // Fetch every 5 seconds
    return () => clearInterval(interval)
  }, [fetchGpuStats])

  // Calculate memory usage percentage
  const memoryUsagePercent = (gpuStats.memoryUsed / gpuStats.memoryTotal) * 100

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="h-full">
      <Tabs defaultValue="monitor" className="h-full">
        <TabsList className="w-full justify-start h-10 bg-muted/50 rounded-none border-b border-border">
          <TabsTrigger value="monitor" className="rounded-none data-[state=active]:bg-background">
            GPU Monitor
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-none data-[state=active]:bg-background">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="mt-0 p-4 h-[calc(100%-40px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">GPU Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Current Usage</span>
                  <span className="text-xs font-medium">{gpuStats.utilization}%</span>
                </div>
                <Progress value={gpuStats.utilization} className="h-2" />

                <div className="mt-6">
                  <svg width="100%" height="60" viewBox="0 0 300 60">
                    {gpuStats.history.map((value, index, array) => {
                      if (index < array.length - 1) {
                        const x1 = (index / (array.length - 1)) * 300
                        const y1 = 60 - (value / 100) * 60
                        const x2 = ((index + 1) / (array.length - 1)) * 300
                        const y2 = 60 - (array[index + 1] / 100) * 60

                        return (
                          <motion.line
                            key={index}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.01 }}
                          />
                        )
                      }
                      return null
                    })}
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Used / Total</span>
                  <span className="text-xs font-medium">
                    {gpuStats.memoryUsed} GB / {gpuStats.memoryTotal} GB
                  </span>
                </div>
                <Progress value={memoryUsagePercent} className="h-2" />

                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Temperature</span>
                    <span className="text-xs font-medium">{gpuStats.temperature}°C</span>
                  </div>
                  <Progress
                    value={(gpuStats.temperature / 100) * 100}
                    className="h-2 mt-1"
                    indicatorClassName={
                      gpuStats.temperature > 80
                        ? "bg-red-500"
                        : gpuStats.temperature > 70
                          ? "bg-amber-500"
                          : "bg-green-500"
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0 p-4">
          <Card>
            <CardHeader>
              <CardTitle>GPU Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[120px] w-full">
                <svg width="100%" height="100%" viewBox="0 0 300 100">
                  {/* Grid lines */}
                  <line x1="0" y1="0" x2="300" y2="0" stroke="hsl(var(--border))" strokeWidth="0.5" />
                  <line x1="0" y1="25" x2="300" y2="25" stroke="hsl(var(--border))" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="hsl(var(--border))" strokeWidth="0.5" />
                  <line x1="0" y1="75" x2="300" y2="75" stroke="hsl(var(--border))" strokeWidth="0.5" />
                  <line x1="0" y1="100" x2="300" y2="100" stroke="hsl(var(--border))" strokeWidth="0.5" />

                  {/* Y-axis labels */}
                  <text x="5" y="10" fontSize="8" fill="hsl(var(--muted-foreground))">
                    100%
                  </text>
                  <text x="5" y="35" fontSize="8" fill="hsl(var(--muted-foreground))">
                    75%
                  </text>
                  <text x="5" y="60" fontSize="8" fill="hsl(var(--muted-foreground))">
                    50%
                  </text>
                  <text x="5" y="85" fontSize="8" fill="hsl(var(--muted-foreground))">
                    25%
                  </text>

                  {/* Graph line */}
                  <polyline
                    points={gpuStats.history
                      .map(
                        (value, index) =>
                          `${(index / (gpuStats.history.length - 1)) * 300},${100 - (value / 100) * 100}`,
                      )
                      .join(" ")}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                <p>
                  Average Utilization:{" "}
                  {Math.round(gpuStats.history.reduce((a, b) => a + b, 0) / gpuStats.history.length)}%
                </p>
                <p>Peak Utilization: {Math.max(...gpuStats.history)}%</p>
                <p>Min Utilization: {Math.min(...gpuStats.history)}%</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

