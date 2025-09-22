"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, Chrome } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { authAPI } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { notificationsService } from "@/lib/notifications-service"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields")
      }
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      await authAPI.signIn(formData.email, formData.password)

      toast({
        title: "Login successful!",
        description: "Welcome back to Leli Rentals.",
      })

      // AuthProvider will handle the redirect automatically
    } catch (error: any) {
      if (error.message?.includes('Invalid email or password') || error.message?.includes('invalid-credential')) {
        toast({
          title: "Invalid credentials",
          description: "The email or password you entered is incorrect. Please check your credentials and try again.",
          variant: "destructive",
          action: (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/forgot-password')}
              >
                Reset Password
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/signup')}
              >
                Create Account
              </Button>
            </div>
          ),
        })
      } else if (error.message?.includes('No account found')) {
        toast({
          title: "Account not found",
          description: "No account found with this email address. Please check your email or create a new account.",
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/signup')}
            >
              Create Account
            </Button>
          ),
        })
      } else if (error.message?.includes('Too many failed attempts')) {
        toast({
          title: "Too many attempts",
          description: "Too many failed login attempts. Please wait a few minutes before trying again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    if (provider === 'google') {
      setIsGoogleLoading(true)
      try {
        const { user, isNewUser } = await authAPI.signInWithGoogle()
        
        // Create welcome notification for new users only
        if (isNewUser) {
          try {
            await notificationsService.createWelcomeNotification(user.id, user.name ?? undefined)
          } catch (notificationError) {
            console.error('Failed to create welcome notification:', notificationError)
            // Don't fail the login if notification creation fails
          }
        }
        
        toast({
          title: isNewUser ? "Account created successfully!" : "Login successful!",
          description: isNewUser ? "Welcome to Leli Rentals. Your account has been created." : "Welcome back to Leli Rentals.",
        })

        // AuthProvider will handle the redirect automatically
      } catch (error: any) {
        toast({
          title: "Google login failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsGoogleLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">Sign in to your Leli Rentals account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-8">
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full h-11 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-all duration-200" 
                  onClick={() => handleSocialLogin("google")}
                  disabled={isGoogleLoading || isLoading}
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-12 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Sign up
                </Link>
              </div>
              <div className="text-center text-xs text-gray-500 mt-4">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Privacy Policy
                </Link>
                .
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
