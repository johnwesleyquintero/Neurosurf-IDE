import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { query } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "system",
        content:
          "You are a technical documentation expert. Provide relevant documentation, examples, and explanations based on the user's query.",
      },
      {
        role: "user",
        content: query,
      },
    ],
    temperature: 0.7,
  })

  return result.toDataStreamResponse()
}

