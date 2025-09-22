"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Chrome, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { authAPI } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { fetchSignInMethodsForEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { notificationsService } from "@/lib/notifications-service"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'available' | 'taken' | 'invalid' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const { toast } = useToast()
  const router = useRouter()

  // Email validation function
  const checkEmailAvailability = async (email: string) => {
    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      setEmailStatus('invalid')
      return
    }

    setIsCheckingEmail(true)
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email)
      if (signInMethods.length > 0) {
        setEmailStatus('taken')
      } else {
        setEmailStatus('available')
      }
    } catch (error: any) {
      console.error('Error checking email:', error)
      // Handle specific Firebase errors
      if (error.code === 'auth/invalid-email') {
        setEmailStatus('invalid')
        toast({
          title: "Invalid email format",
          description: "Please enter a valid email address (e.g., user@example.com)",
          variant: "destructive",
        })
      } else {
        setEmailStatus('error')
        toast({
          title: "Email check failed",
          description: "Unable to verify email availability. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsCheckingEmail(false)
    }
  }

  // Debounced email check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email && formData.email.includes('@')) {
        checkEmailAvailability(formData.email)
      } else {
        setEmailStatus('idle')
      }
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [formData.email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      })
      return
    }

    if (!formData.email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    if (emailStatus === 'taken') {
      toast({
        title: "Email already in use",
        description: "This email is already registered. Please sign in instead or use a different email.",
        variant: "destructive",
        action: (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/forgot-password')}
            >
              Reset Password
            </Button>
          </div>
        ),
      })
      return
    }

    if (emailStatus === 'invalid') {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (emailStatus === 'idle' || isCheckingEmail) {
      toast({
        title: "Please wait",
        description: "We're checking if your email is available...",
        variant: "destructive",
      })
      return
    }

    if (!formData.password) {
      toast({
        title: "Password required",
        description: "Please enter a password.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields are identical.",
        variant: "destructive",
      })
      return
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    // Enhanced password validation
    const passwordErrors = []
    if (formData.password.length < 8) {
      passwordErrors.push("At least 8 characters")
    }
    if (!/[A-Z]/.test(formData.password)) {
      passwordErrors.push("At least one uppercase letter")
    }
    if (!/[0-9]/.test(formData.password)) {
      passwordErrors.push("At least one number")
    }
    if (!/[a-z]/.test(formData.password)) {
      passwordErrors.push("At least one lowercase letter")
    }

    if (passwordErrors.length > 0) {
      toast({
        title: "Password requirements not met",
        description: `Password must have: ${passwordErrors.join(", ")}.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const user = await authAPI.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      // Create welcome notification for the new user
      try {
        await notificationsService.createWelcomeNotification(user.id, formData.name)
      } catch (notificationError) {
        console.error('Failed to create welcome notification:', notificationError)
        // Don't fail the signup if notification creation fails
      }

      toast({
        title: "Account created successfully!",
        description: "Welcome to Leli Rentals! Please check your email to verify your account.",
      })

      // Redirect to get-started page for account type selection
      router.push('/get-started')
    } catch (error: any) {
      if (error.message?.includes('already exists') || error.message?.includes('email-already-in-use')) {
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
          action: (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/forgot-password')}
              >
                Reset Password
              </Button>
            </div>
          ),
        })
      } else {
        toast({
          title: "Signup failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async (provider: string) => {
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
            // Don't fail the signup if notification creation fails
          }
        }
        
        toast({
          title: isNewUser ? "Account created successfully!" : "Login successful!",
          description: isNewUser ? "Welcome to Leli Rentals. Your account has been created." : "Welcome back to Leli Rentals.",
        })

        // Redirect to get-started page for account type selection
        router.push('/get-started')
      } catch (error: any) {
        toast({
          title: "Google signup failed",
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
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Join Leli Rentals and start renting today
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-8">
              {/* Social Signup Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  onClick={() => handleSocialSignup("google")}
                  disabled={isGoogleLoading || isLoading}
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  {isGoogleLoading ? "Creating account..." : "Continue with Google"}
                </Button>
                {/* GitHub signup removed */}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with email</span>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 pr-12 h-11 bg-gray-50 transition-all duration-200 ${
                        emailStatus === 'taken' ? 'border-red-500 focus:border-red-500 focus:ring-red-500' :
                        emailStatus === 'available' ? 'border-green-500 focus:border-green-500 focus:ring-green-500' :
                        emailStatus === 'invalid' ? 'border-red-500 focus:border-red-500 focus:ring-red-500' :
                        'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    {/* Email status indicator */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isCheckingEmail ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                      ) : emailStatus === 'taken' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : emailStatus === 'available' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : emailStatus === 'invalid' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  {/* Email status message */}
                  {emailStatus === 'taken' && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>This email is already registered. </span>
                      <Link href="/login" className="underline hover:no-underline">
                        Sign in instead
                      </Link>
                    </div>
                  )}
                  {emailStatus === 'available' && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Email is available</span>
                    </div>
                  )}
                  {emailStatus === 'invalid' && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>Please enter a valid email address (e.g., user@example.com)</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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
                  
                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="text-xs space-y-1 mt-2">
                      <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-1 h-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        At least 8 characters
                      </div>
                      <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        One uppercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        One lowercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        One number
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-12 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
                  disabled={isLoading || isGoogleLoading || emailStatus === 'taken' || isCheckingEmail}
                >
                  {isLoading ? "Creating account..." : 
                   emailStatus === 'taken' ? "Email already in use" :
                   isCheckingEmail ? "Checking email..." :
                   "Create Account"}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
