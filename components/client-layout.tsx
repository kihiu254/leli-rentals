"use client"

import { Suspense, useState, ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AISupportChat from "@/components/ai-support-chat"
import { AuthProvider } from "@/components/auth-provider"
import { NotificationProvider } from "@/lib/notification-context"

interface ClientLayoutProps {
  children: any
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const toggleChat = () => setIsChatOpen(!isChatOpen)

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <NotificationProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <AISupportChat isOpen={isChatOpen} onToggle={toggleChat} />
          <Toaster />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
