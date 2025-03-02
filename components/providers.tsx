"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session?: Session | null
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

