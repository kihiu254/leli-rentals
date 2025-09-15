"use client"

// Auth utility functions and types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock auth functions - replace with your actual auth implementation
export const authAPI = {
  async signIn(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data
    return {
      id: "1",
      name: "John Doe",
      email,
      avatar: "/user-avatar.jpg",
      createdAt: new Date(),
    }
  },

  async signUp(data: { name: string; email: string; password: string }): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data
    return {
      id: "2",
      name: data.name,
      email: data.email,
      avatar: "/user-avatar.jpg",
      createdAt: new Date(),
    }
  },

  async signOut(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
  },

  async getCurrentUser(): Promise<User | null> {
    // Simulate checking for current user
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If the public env var is set, return a mock user for local testing
    try {
      if (typeof process !== 'undefined' && (process.env as any).NEXT_PUBLIC_ENABLE_MOCK_USER === '1') {
        return {
          id: 'mock-1',
          name: 'Maggie Support',
          email: 'maggie@lelirentals.com',
          avatar: '/woman-profile.png',
          createdAt: new Date(),
        }
      }
    } catch (err) {
      // ignore
    }

    // Fallback: check localStorage flag when running in the browser
    try {
      if (typeof window !== 'undefined' && window.localStorage.getItem('ENABLE_MOCK_USER') === '1') {
        return {
          id: 'mock-1',
          name: 'Maggie Support',
          email: 'maggie@lelirentals.com',
          avatar: '/woman-profile.png',
          createdAt: new Date(),
        }
      }
    } catch (err) {}

    // Default: not authenticated
    return null
  },
}

// Auth hook for client components
export function useAuth(): AuthState {
  // This would typically use React Context or a state management library
  // For now, returning mock data
  // If enabled via NEXT_PUBLIC_ENABLE_MOCK_USER or localStorage, return a mock user
  try {
    if (typeof process !== 'undefined' && (process.env as any).NEXT_PUBLIC_ENABLE_MOCK_USER === '1') {
      const user: User = {
        id: 'mock-1',
        name: 'Maggie Support',
        email: 'maggie@lelirentals.com',
        avatar: '/woman-profile.png',
        createdAt: new Date(),
      }
      return { user, isLoading: false, isAuthenticated: true }
    }
  } catch (err) {}

  try {
    if (typeof window !== 'undefined' && window.localStorage.getItem('ENABLE_MOCK_USER') === '1') {
      const user: User = {
        id: 'mock-1',
        name: 'Maggie Support',
        email: 'maggie@lelirentals.com',
        avatar: '/woman-profile.png',
        createdAt: new Date(),
      }
      return { user, isLoading: false, isAuthenticated: true }
    }
  } catch (err) {}

  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  }
}
