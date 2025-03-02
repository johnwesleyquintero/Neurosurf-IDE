import { put } from "@vercel/blob"
import { nanoid } from "nanoid"

export async function uploadFile(file: File) {
  try {
    const filename = `${nanoid()}-${file.name}`
    const { url } = await put(filename, file, {
      access: "public",
    })
    return url
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : String(error)}`)
  }
}

