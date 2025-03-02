import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "system",
        content:
          "You are an expert programmer. Provide clear, efficient, and well-documented code based on the user's requirements.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  })

  return result.toDataStreamResponse()
}

