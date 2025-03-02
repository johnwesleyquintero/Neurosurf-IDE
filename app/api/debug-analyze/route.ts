import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { code } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "system",
        content:
          "You are a code analysis expert. Analyze the provided code for potential bugs, performance issues, and security vulnerabilities. Provide clear explanations and suggestions for improvement.",
      },
      {
        role: "user",
        content: `Please analyze this code:\n\n${code}`,
      },
    ],
    temperature: 0.7,
  })

  return result.toDataStreamResponse()
}

