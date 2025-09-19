"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  User, Mail, Phone, MapPin, Camera, Shield, Bell, Eye, EyeOff, 
  Lock, Key, Trash2, Save, AlertTriangle, CheckCircle, Globe, 
  Smartphone, Mail as MailIcon, MessageSquare, Edit
} from "lucide-react"
import { useAuthContext } from "@/components/auth-provider"
import { authAPI } from "@/lib/auth"
import { userSettingsService, UserSettings } from "@/lib/user-settings-service"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AccountSettingsPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Load user settings on component mount
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user || !user.id) return
      
      setIsLoading(true)
      try {
        const settings = await userSettingsService.getUserSettings(user.id)
        setUserSettings(settings)
        
        if (settings && settings.profile) {
          setProfileData({
            name: settings.profile.name || "",
            email: settings.profile.email || "",
            phone: settings.profile.phone || "",
            location: settings.profile.location || "",
            bio: settings.profile.bio || "",
            website: settings.profile.website || "",
          })
        } else {
          // If no settings exist, initialize with user data
          setProfileData({
            name: user.name || "",
            email: user.email || "",
            phone: "",
            location: "",
            bio: "",
            website: "",
          })
        }
      } catch (error) {
        console.error("Error loading user settings:", error)
        toast({
          title: "Error",
          description: "Failed to load user settings",
          variant: "destructive"
        })
        
        // Fallback to user data if settings loading fails
        if (user) {
          setProfileData({
            name: user.name || "",
            email: user.email || "",
            phone: "",
            location: "",
            bio: "",
            website: "",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadUserSettings()
  }, [user, toast])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !user.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      })
      return
    }
    
    // Validate required fields
    if (!profileData.name || !profileData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      })
      return
    }
    
    try {
      await userSettingsService.updateProfile(user.id, profileData)
      
      // Update local state
      if (userSettings) {
        setUserSettings({
          ...userSettings,
          profile: { ...userSettings.profile, ...profileData }
        })
      }
      
      toast({
        title: "Profile updated successfully!",
        description: "Your profile information has been saved.",
      })
      
      setIsEditingProfile(false)
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Error updating profile",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields are identical.",
        variant: "destructive",
      })
      return
    }

    // Enhanced password validation
    const passwordErrors = []
    if (passwordData.newPassword.length < 8) {
      passwordErrors.push("At least 8 characters")
    }
    if (!/[A-Z]/.test(passwordData.newPassword)) {
      passwordErrors.push("At least one uppercase letter")
    }
    if (!/[0-9]/.test(passwordData.newPassword)) {
      passwordErrors.push("At least one number")
    }
    if (!/[a-z]/.test(passwordData.newPassword)) {
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
    
    try {
      await userSettingsService.changePassword(passwordData.currentPassword, passwordData.newPassword)
      
      toast({
        title: "Password changed successfully!",
        description: "Your password has been updated.",
      })
      
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      toast({
        title: "Error changing password",
        description: error.message || "Please check your current password and try again.",
        variant: "destructive",
      })
    }
  }

  const handleNotificationToggle = async (setting: string, value: boolean) => {
    if (!user || !user.id) return
    
    try {
      await userSettingsService.updateNotificationSettings(user.id, { [setting]: value })
      
      // Update local state
      if (userSettings) {
        setUserSettings({
          ...userSettings,
          notifications: { ...userSettings.notifications, [setting]: value }
        })
      }
      
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error: any) {
      toast({
        title: "Error updating settings",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePrivacyToggle = async (setting: string, value: any) => {
    if (!user || !user.id) return
    
    try {
      await userSettingsService.updatePrivacySettings(user.id, { [setting]: value })
      
      // Update local state
      if (userSettings) {
        setUserSettings({
          ...userSettings,
          privacy: { ...userSettings.privacy, [setting]: value }
        })
      }
      
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      })
    } catch (error: any) {
      toast({
        title: "Error updating privacy settings",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendEmailVerification = async () => {
    try {
      await userSettingsService.sendEmailVerification()
      
      toast({
        title: "Verification email sent",
        description: "Please check your email and click the verification link.",
      })
    } catch (error: any) {
      toast({
        title: "Error sending verification",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      await userSettingsService.updateTwoFactorAuth(enabled)
      
      // Update local state
      if (userSettings) {
        setUserSettings({
          ...userSettings,
          security: { ...userSettings.security, twoFactorEnabled: enabled }
        })
      }
      
      toast({
        title: enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
        description: `2FA has been ${enabled ? 'enabled' : 'disabled'} for your account.`,
      })
    } catch (error: any) {
      toast({
        title: "Error updating 2FA",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // For security, we'll require the user to enter their password
      const currentPassword = prompt("Please enter your current password to delete your account:")
      if (!currentPassword) {
        toast({
          title: "Cancelled",
          description: "Account deletion cancelled.",
        })
        return
      }

      await userSettingsService.deleteUserAccount(currentPassword)
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      })
      
      router.push('/')
    } catch (error: any) {
      toast({
        title: "Error deleting account",
        description: error.message || "Please contact support for assistance.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Account Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your account information, security, and preferences
              </p>
            </div>
            <Button 
              onClick={() => router.back()}
              variant="outline"
            >
              Back to Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name || "User"} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile Information
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                      <DialogDescription>Update your personal information</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            placeholder="https://yourwebsite.com"
                            value={profileData.website}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                            rows={4}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-5 w-5 text-green-600" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-lg ${
                  userSettings?.security?.emailVerified ? 'bg-green-50' : 'bg-yellow-50'
                }`}>
                  <div className="flex items-center gap-3">
                    {userSettings?.security?.emailVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    )}
                    <div>
                      <div className="font-medium">
                        {userSettings?.security?.emailVerified ? 'Email Verified' : 'Email Not Verified'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {userSettings?.security?.emailVerified 
                          ? 'Your email address is verified' 
                          : 'Please verify your email address'
                        }
                      </div>
                    </div>
                  </div>
                  {!userSettings?.security?.emailVerified && (
                    <Button variant="outline" size="sm" onClick={handleSendEmailVerification}>
                      Send Verification
                    </Button>
                  )}
                </div>

                <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>Enter your current password and choose a new one</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        
                        {/* Password Requirements */}
                        {passwordData.newPassword && (
                          <div className="text-xs space-y-1 mt-2">
                            <div className={`flex items-center gap-1 ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                              <div className={`w-1 h-1 rounded-full ${passwordData.newPassword.length >= 8 ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                              At least 8 characters
                            </div>
                            <div className={`flex items-center gap-1 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                              <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(passwordData.newPassword) ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                              One uppercase letter
                            </div>
                            <div className={`flex items-center gap-1 ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                              <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(passwordData.newPassword) ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                              One lowercase letter
                            </div>
                            <div className={`flex items-center gap-1 ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                              <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(passwordData.newPassword) ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                              One number
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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

                      <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsChangingPassword(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Change Password
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">
                        {userSettings?.security?.twoFactorEnabled ? '2FA is enabled' : 'Add an extra layer of security'}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={userSettings?.security?.twoFactorEnabled || false}
                    onCheckedChange={handleTwoFactorToggle}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notification Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Email Notifications</span>
                  </div>
                  <Switch
                    checked={userSettings?.notifications?.emailNotifications || false}
                    onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">SMS Notifications</span>
                  </div>
                  <Switch
                    checked={userSettings?.notifications?.smsNotifications || false}
                    onCheckedChange={(checked) => handleNotificationToggle('smsNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Push Notifications</span>
                  </div>
                  <Switch
                    checked={userSettings?.notifications?.pushNotifications || false}
                    onCheckedChange={(checked) => handleNotificationToggle('pushNotifications', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Booking Updates</span>
                  </div>
                  <Switch
                    checked={userSettings?.notifications?.bookingUpdates || false}
                    onCheckedChange={(checked) => handleNotificationToggle('bookingUpdates', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Security Alerts</span>
                  </div>
                  <Switch
                    checked={userSettings?.notifications?.securityAlerts || false}
                    onCheckedChange={(checked) => handleNotificationToggle('securityAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-purple-600" />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Profile Visibility</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="public"
                        name="visibility"
                        value="public"
                        checked={userSettings?.privacy?.profileVisibility === "public"}
                        onChange={(e) => handlePrivacyToggle('profileVisibility', e.target.value)}
                        className="text-blue-600"
                        aria-label="Public profile visibility"
                      />
                      <Label htmlFor="public" className="text-sm">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="private"
                        name="visibility"
                        value="private"
                        checked={userSettings?.privacy?.profileVisibility === "private"}
                        onChange={(e) => handlePrivacyToggle('profileVisibility', e.target.value)}
                        className="text-blue-600"
                        aria-label="Private profile visibility"
                      />
                      <Label htmlFor="private" className="text-sm">Private</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Email</span>
                  <Switch
                    checked={userSettings?.privacy?.showEmail || false}
                    onCheckedChange={(checked) => handlePrivacyToggle('showEmail', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Phone</span>
                  <Switch
                    checked={userSettings?.privacy?.showPhone || false}
                    onCheckedChange={(checked) => handlePrivacyToggle('showPhone', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Location</span>
                  <Switch
                    checked={userSettings?.privacy?.showLocation || false}
                    onCheckedChange={(checked) => handlePrivacyToggle('showLocation', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-0 shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data, listings, and bookings.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}