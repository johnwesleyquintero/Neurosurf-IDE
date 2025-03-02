import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { errorHandler } from "@/middleware/error-handler"
import { getEnvVar } from "@/lib/env"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      })
    }

    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid messages format")
    }

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      temperature: 0.7,
      maxTokens: 1000,
      apiKey: getEnvVar("OPENAI_API_KEY"),
    })

    return result.toDataStreamResponse()
  } catch (error) {
    return errorHandler(req, new NextResponse(), error as Error)
  }
}

