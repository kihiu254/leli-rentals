"use client"

import { Suspense, useState, ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import SupportChat from "@/components/support-chat"

interface ClientLayoutProps {
  children: any
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const toggleChat = () => setIsChatOpen(!isChatOpen)

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <Suspense fallback={null}>{children}</Suspense>
      <SupportChat isOpen={isChatOpen} onToggle={toggleChat} />
      <Toaster />
    </ThemeProvider>
  )
}
