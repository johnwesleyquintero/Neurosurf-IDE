import { NextResponse } from "next/server"
import { uploadFile } from "@/lib/blob"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return new NextResponse(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      })
    }

    const url = await uploadFile(file)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading file:", error)
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    })
  }
}

