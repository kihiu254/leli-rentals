"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, User } from '@/lib/auth'
import { needsAccountTypeSelection, getRedirectUrl, getUserAccountType } from '@/lib/account-type-utils'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  // Handle redirect after authentication
  useEffect(() => {
    if (auth.isAuthenticated && auth.user && !hasRedirected) {
      console.log('Auth Provider: User authenticated, checking redirect needs')
      
      // Small delay to ensure localStorage is accessible
      setTimeout(() => {
        setHasRedirected(true)
        
        // Check if user needs to select account type
        if (needsAccountTypeSelection()) {
          console.log('Auth Provider: User needs account type selection, redirecting to /get-started')
          router.push('/get-started')
        } else {
          // Redirect based on account type using the utility function
          const accountType = getUserAccountType()
          const redirectUrl = getRedirectUrl(accountType)
          console.log('Auth Provider: Redirecting to:', redirectUrl, 'for account type:', accountType)
          router.push(redirectUrl)
        }
      }, 200)
    } else if (!auth.isAuthenticated) {
      setHasRedirected(false)
    }
  }, [auth.isAuthenticated, auth.user, router, hasRedirected])

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
