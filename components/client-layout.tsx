"use client"

import { Suspense, useState, ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AISupportChat from "@/components/ai-support-chat"
import { AuthProvider } from "@/components/auth-provider"
import { NotificationProvider } from "@/lib/notification-context"
import { AccountTypeReminder } from "@/components/account-type-reminder"
import { AccountTypeModal } from "@/components/account-type-modal"
import { useAccountTypeReminder } from "@/hooks/use-account-type-reminder"
import { useAccountTypeModal } from "@/hooks/use-account-type-modal"

interface ClientLayoutProps {
  children: any
}

function ClientLayoutContent({ children }: ClientLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const toggleChat = () => setIsChatOpen(!isChatOpen)
  
  // Enable account type reminders
  useAccountTypeReminder()
  
  // Enable account type modal
  const { isModalOpen, modalTrigger, closeModal } = useAccountTypeModal()

  return (
    <NotificationProvider>
      <AccountTypeReminder variant="banner" />
      <AccountTypeModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        trigger={modalTrigger}
      />
      <Suspense fallback={null}>{children}</Suspense>
      <AISupportChat isOpen={isChatOpen} onToggle={toggleChat} />
      <Toaster />
    </NotificationProvider>
  )
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </AuthProvider>
    </ThemeProvider>
  )
}
