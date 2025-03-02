type EnvVar = {
  name: string
  required: boolean
}

const requiredEnvVars: EnvVar[] = [
  { name: "NEXTAUTH_URL", required: true },
  { name: "NEXTAUTH_SECRET", required: true },
  { name: "DATABASE_URL", required: true },
  { name: "GITHUB_ID", required: true },
  { name: "GITHUB_SECRET", required: true },
  { name: "GOOGLE_CLIENT_ID", required: true },
  { name: "GOOGLE_CLIENT_SECRET", required: true },
  { name: "OPENAI_API_KEY", required: true },
  { name: "BLOB_READ_WRITE_TOKEN", required: true },
]

// Add this to the top of the file
// This will run during build and startup
if (typeof window === "undefined") {
  validateEnv()
}

export function validateEnv() {
  const missingVars = requiredEnvVars.filter((v) => v.required && !process.env[v.name]).map((v) => v.name)

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map((v) => `  - ${v}`).join("\n")}\n\nMake sure these are set in your .env file or deployment environment.`,
    )
  }
}

export function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

