// Extend the Session type to include user ID
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

// API response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

// GPU Stats types
export interface GPUStats {
  utilization: number
  memoryUsed: number
  memoryTotal: number
  temperature: number
  history: number[]
  timestamp?: string
}

// Chat types
export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  createdAt?: string
}

export interface Chat {
  id: string
  title?: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}

// Documentation search types
export interface DocResult {
  title: string
  content: string
  url?: string
}

// Debug analysis types
export interface DebugResult {
  analysis: string
  issues: string[]
  suggestions: string[]
}

