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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'available' | 'taken' | 'invalid'>('idle')
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
    if (!email || !email.includes('@')) {
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
      } else {
        setEmailStatus('error')
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
      await authAPI.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      toast({
        title: "Account created successfully!",
        description: "Welcome to Leli Rentals! Please check your email to verify your account.",
      })

      // Redirect to profile page
      router.push('/profile')
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
        await authAPI.signInWithGoogle()
        
        toast({
          title: "Account created successfully!",
          description: "Welcome to Leli Rentals. Your account has been created.",
        })

        // Redirect to profile page
        router.push('/profile')
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
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Join Leli Rentals and start renting today
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Social Signup Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 pr-10 ${
                        emailStatus === 'taken' ? 'border-red-500 focus:border-red-500' :
                        emailStatus === 'available' ? 'border-green-500 focus:border-green-500' :
                        emailStatus === 'invalid' ? 'border-red-500 focus:border-red-500' :
                        'border-gray-300'
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
                  {emailStatus === 'invalid' && formData.email && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>Please enter a valid email address</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
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
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
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
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
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
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
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
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                  disabled={isLoading || isGoogleLoading || emailStatus === 'taken' || isCheckingEmail}
                >
                  {isLoading ? "Creating account..." : 
                   emailStatus === 'taken' ? "Email already in use" :
                   isCheckingEmail ? "Checking email..." :
                   "Create Account"}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
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
