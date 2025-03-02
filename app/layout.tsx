import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NeuroSurf - AI-Powered IDE",
  description: "An AI-powered IDE and chat interface built on the Nebula Architectural Constitution",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-32x32-dnpag5WCM4ahV0opaqdjAAxvfL9A2w.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-16x16-B2APYAk6z6tXY2UFfxtLKjRA9YR0Ng.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-touch-icon-V8hCbfJyMMQcsIMgtvJpB7TClUo2Mv.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-192x192-XVwwWMMoB5orIIuPivwnfjvEqnNWui.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome-512x512",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-512x512-CYi0pI30o8T2B9Oq72OM043OeMMARS.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}



import './globals.css'