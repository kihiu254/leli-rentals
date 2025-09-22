"use client"

import { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { auth, googleProvider } from './firebase'

// Check if Firebase is properly initialized
const isFirebaseInitialized = () => {
  const isValid = auth && googleProvider
  if (!isValid) {
    console.error('Firebase not properly initialized. Check your environment variables.')
    console.error('Required variables:', {
      NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    })
  }
  return isValid
}
import { userService, firebaseUserToUserProfile } from './user-service'

// Auth utility functions and types
export interface User {
  id: string
  name: string | null
  email: string | null
  avatar?: string | null
  createdAt: Date | null
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

// Convert Firebase User to our User interface
function firebaseUserToUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    avatar: firebaseUser.photoURL,
    createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : null,
  }
}

// Auth API functions
export const authAPI = {
  async signIn(email: string, password: string): Promise<User> {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.')
    }
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = firebaseUserToUser(result.user)
      
      // Save/update user profile in database
      try {
        const userProfile = firebaseUserToUserProfile(result.user)
        await userService.saveUserProfile(userProfile)
      } catch (error) {
        console.error('Error saving user profile:', error)
      }
      
      return user
    } catch (error: any) {
      console.error('Email sign-in error:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        email: email,
        firebaseInitialized: isFirebaseInitialized()
      })
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.')
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.')
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please check your credentials and try again.')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.')
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.')
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.')
      } else if (error.code === 'auth/invalid-api-key') {
        throw new Error('Firebase configuration error. Please contact support.')
      }
      
      throw new Error(error.message || 'Sign-in failed. Please try again.')
    }
  },

  async signUp(data: { name: string; email: string; password: string }): Promise<User> {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.')
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password)
      // Update the display name
      await updateProfile(result.user, { displayName: data.name })
      
      // Send email verification
      try {
        await sendEmailVerification(result.user)
      } catch (verificationError) {
        console.error('Error sending email verification:', verificationError)
        // Don't throw here, as the user was created successfully
      }
      
      const user = firebaseUserToUser(result.user)
      
      // Save user profile in database
      try {
        const userProfile = firebaseUserToUserProfile(result.user)
        await userService.saveUserProfile(userProfile)
      } catch (error) {
        console.error('Error saving user profile:', error)
      }
      
      return user
    } catch (error: any) {
      console.error('Email sign-up error:', error)
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please sign in instead.')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address. Please enter a valid email.')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please choose a stronger password with at least 6 characters.')
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password accounts are not enabled. Please contact support.')
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.')
      }
      
      throw new Error(error.message || 'Sign-up failed. Please try again.')
    }
  },

  async signInWithGoogle(): Promise<{ user: User; isNewUser: boolean }> {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.')
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = firebaseUserToUser(result.user)
      const resultWithInfo = result as any
      const isNewUser = resultWithInfo.additionalUserInfo?.isNewUser || false
      
      // Save/update user profile in database
      try {
        const userProfile = firebaseUserToUserProfile(result.user)
        await userService.saveUserProfile(userProfile)
      } catch (error) {
        console.error('Error saving user profile:', error)
        // Don't throw here, as the auth was successful
      }
      
      return { user, isNewUser }
    } catch (error: any) {
      console.error('Google sign-in error:', error)
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.')
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.')
      } else if (error.code === 'auth/configuration-not-found') {
        throw new Error('Firebase configuration error. Please contact support.')
      }
      
      throw new Error(error.message || 'Google sign-in failed. Please try again.')
    }
  },

  async signOut(): Promise<void> {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.')
    }
    
    await firebaseSignOut(auth)
  },

  async getCurrentUser(): Promise<User | null> {
    if (!isFirebaseInitialized()) {
      return null
    }
    
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        resolve(user ? firebaseUserToUser(user) : null)
      })
    })
  },
}

// Auth hook for client components
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseInitialized()) {
      setUser(null)
      setIsLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUserToUser(firebaseUser))
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut: authAPI.signOut,
  }
}
