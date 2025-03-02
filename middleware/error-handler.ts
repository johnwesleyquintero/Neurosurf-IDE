import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function errorHandler(request: NextRequest, response: NextResponse, error: Error) {
  console.error(`Error processing ${request.method} ${request.url}:`, error)

  // Don't expose internal errors to clients
  const publicError = {
    message: "An error occurred processing your request",
    status: 500,
  }

  // Add more specific error handling as needed
  if (error.message === "Unauthorized") {
    publicError.status = 401
    publicError.message = "You must be logged in to perform this action"
  }

  return NextResponse.json(publicError, { status: publicError.status })
}

