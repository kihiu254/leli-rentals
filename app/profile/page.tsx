"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  User, Mail, MapPin, Edit, Trash2, Plus, Star, Calendar, DollarSign, Eye, Settings, Camera, 
  LogOut, Shield, Bell, CreditCard, HelpCircle, ChevronRight, TrendingUp, Users, Award
} from "lucide-react"
import Link from "next/link"
import { useAuthContext } from "@/components/auth-provider"
import { authAPI } from "@/lib/auth"
import { profileService, UserProfile, UserReview, UserListing, UserBooking } from "@/lib/profile-service"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const mockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  avatar: "/user-avatar.jpg",
  joinDate: "January 2024",
  rating: 4.8,
  totalBookings: 12,
  totalListings: 3,
}

// Mock user listings
const mockUserListings = [
  {
    id: "user-listing-1",
    title: "Vintage Camera Collection",
    description: "Professional vintage cameras for photography enthusiasts",
    price: 35,
    category: "equipment",
    image: "/professional-camera-equipment.jpg",
    status: "active",
    bookings: 8,
    rating: 4.9,
    views: 156,
  },
  {
    id: "user-listing-2",
    title: "Mountain Bike",
    description: "High-quality mountain bike perfect for trails",
    price: 25,
    category: "sports",
    image: "/placeholder.svg?key=bike123",
    status: "active",
    bookings: 5,
    rating: 4.7,
    views: 89,
  },
  {
    id: "user-listing-3",
    title: "Gaming Setup",
    description: "Complete gaming setup with high-end PC and peripherals",
    price: 45,
    category: "tech",
    image: "/placeholder.svg?key=gaming456",
    status: "inactive",
    bookings: 12,
    rating: 4.8,
    views: 234,
  },
]

// Mock user bookings
const mockUserBookings = [
  {
    id: "booking-1",
    listingTitle: "Tesla Model 3",
    listingImage: "/tesla-model-3.png",
    owner: "David Kim",
    dates: "Dec 15-18, 2024",
    totalPrice: 340,
    status: "confirmed",
    category: "vehicles",
  },
  {
    id: "booking-2",
    listingTitle: "Modern Downtown Apartment",
    listingImage: "/modern-apartment.png",
    owner: "Sarah Johnson",
    dates: "Nov 20-25, 2024",
    totalPrice: 720,
    status: "completed",
    category: "homes",
  },
  {
    id: "booking-3",
    listingTitle: "Professional Camera Kit",
    listingImage: "/professional-camera-equipment.jpg",
    owner: "Alex Rivera",
    dates: "Jan 10-12, 2025",
    totalPrice: 135,
    status: "pending",
    category: "equipment",
  },
]

export default function ProfilePage() {
  const { user, isLoading } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userReviews, setUserReviews] = useState<UserReview[]>([])
  const [userListings, setUserListings] = useState<UserListing[]>([])
  const [userBookings, setUserBookings] = useState<UserBooking[]>([])
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    bio: "",
    website: "",
  })

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return

      try {
        // Load user profile
        const profile = await profileService.getUserProfile(user.id)
        if (profile) {
          setUserProfile(profile)
          setProfileData({
            name: profile.name,
            email: profile.email,
            phone: profile.phone || "",
            location: profile.location || "",
            bio: profile.bio || "",
            website: profile.website || "",
          })
        } else {
          // Create default profile if doesn't exist
          await profileService.createDefaultProfile(user.id, user.name || "", user.email || "")
          const newProfile = await profileService.getUserProfile(user.id)
          setUserProfile(newProfile)
        }

        // Load user reviews, listings, and bookings
        const [reviews, listings, bookings] = await Promise.all([
          profileService.getUserReviews(user.id),
          profileService.getUserListings(user.id),
          profileService.getUserBookings(user.id)
        ])

        setUserReviews(reviews)
        setUserListings(listings)
        setUserBookings(bookings)

        // Update stats
        await profileService.updateUserStats(user.id)
      } catch (error) {
        console.error("Error loading user data:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        })
      }
    }

    loadUserData()
  }, [user, toast])

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      })
      return
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      })
      return
    }

    setIsUploadingImage(true)
    try {
      const imageUrl = await profileService.uploadProfileImage(user.id, file)
      setUserProfile(prev => prev ? { ...prev, avatar: imageUrl } : null)
      toast({
        title: "Image uploaded successfully!",
        description: "Your profile picture has been updated.",
      })
    } catch (error: any) {
      console.error("Image upload error:", error)
      
      // More specific error messages
      let errorMessage = "Failed to upload image. Please try again."
      if (error.message?.includes('retry-limit-exceeded')) {
        errorMessage = "Upload timeout. Please check your internet connection and try again."
      } else if (error.message?.includes('storage/unauthorized')) {
        errorMessage = "Upload permission denied. Please refresh the page and try again."
      } else if (error.message?.includes('storage/network-request-failed')) {
        errorMessage = "Network error. Please check your internet connection."
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsUploadingImage(false)
      // Reset the input so the same file can be selected again
      event.target.value = ''
    }
  }

  // Get user stats from profile
  const userStats = userProfile ? {
    totalListings: userProfile.stats.totalListings,
    totalBookings: userProfile.stats.totalBookings,
    totalEarnings: userProfile.stats.totalEarnings,
    averageRating: userProfile.rating.average,
    responseRate: userProfile.stats.responseRate
  } : {
    totalListings: 0,
    totalBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    responseRate: 0
  }

  // Get membership info
  const membershipInfo = userProfile ? profileService.getMembershipInfo(userProfile) : {
    joinDate: new Date(),
    membershipDuration: 0,
    membershipType: 'free' as const,
    isVerified: false
  }

  const handleSignOut = async () => {
    try {
      await authAPI.signOut()
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
      router.push('/')
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      })
      return
    }

    try {
      await profileService.updateUserProfile(user.id, profileData)
      
      // Update local state
      setUserProfile(prev => prev ? {
        ...prev,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        website: profileData.website
      } : null)
      
      toast({
        title: "Profile updated successfully!",
        description: "Your profile information has been saved.",
      })
      
      setIsEditingProfile(false)
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteListing = (listingId: string) => {
    console.log("Deleting listing:", listingId)
    // Here you would typically call an API to delete the listing
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Modern Profile Header */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-blue-50/30 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                <div className="relative group">
                  <Avatar className="h-32 w-32 ring-4 ring-white shadow-lg">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name || "User"} />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                      disabled={isUploadingImage}
                    />
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-10 w-10 rounded-full shadow-lg bg-white hover:bg-gray-50"
                      asChild
                    >
                      <label htmlFor="profile-image-upload" className="cursor-pointer">
                        {isUploadingImage ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        ) : (
                          <Camera className="h-5 w-5" />
                        )}
                      </label>
                    </Button>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {user.name || "Welcome to Leli Rentals"}
                        </h1>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{profileData.location}</span>
                        </div>
                      </div>
                      
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-lg">{userStats.averageRating.toFixed(1)}</span>
                              <span className="text-muted-foreground text-sm">({userProfile?.rating.count || 0} reviews)</span>
                            </div>
                            <div className="text-muted-foreground text-sm">
                              Member since {membershipInfo.joinDate.getFullYear()} • {membershipInfo.membershipDuration} days
                            </div>
                            <Badge variant={membershipInfo.membershipType === 'premium' ? 'default' : 'secondary'} className="ml-2">
                              {membershipInfo.membershipType.toUpperCase()}
                            </Badge>
                          </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                        <DialogTrigger asChild>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                            <DialogDescription>Update your profile information and preferences</DialogDescription>
                          </DialogHeader>

                          <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                  id="name"
                                  value={profileData.name}
                                  onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={profileData.email}
                                  onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                  id="phone"
                                  value={profileData.phone}
                                  onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                  id="location"
                                  value={profileData.location}
                                  onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                value={profileData.bio}
                                onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                                rows={4}
                                placeholder="Tell us about yourself..."
                              />
                            </div>

                            <div className="flex justify-end gap-3">
                              <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                                Cancel
                              </Button>
                              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                Save Changes
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        onClick={handleSignOut}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center group">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{userStats.totalListings}</div>
                  <div className="text-sm text-muted-foreground font-medium">Active Listings</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold text-green-600 mb-1">{userStats.totalBookings}</div>
                  <div className="text-sm text-muted-foreground font-medium">Total Bookings</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold text-purple-600 mb-1">${userStats.totalEarnings}</div>
                  <div className="text-sm text-muted-foreground font-medium">Earnings</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {userStats.averageRating > 0 ? userStats.averageRating.toFixed(1) : "0.0"}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-lg border-0 rounded-xl p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="listings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Users className="h-4 w-4 mr-2" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Calendar className="h-4 w-4 mr-2" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Award className="h-5 w-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Manage your Leli Rentals experience</CardDescription>
                </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        onClick={() => router.push('/listings/create')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Listing
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => router.push('/profile/bookings')}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        View My Bookings
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => router.push('/profile/billing')}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Methods
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => router.push('/help')}
                      >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Help & Support
                      </Button>
                    </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New booking received</p>
                      <p className="text-xs text-muted-foreground">Tesla Model 3 - Dec 15-18</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Listing updated</p>
                      <p className="text-xs text-muted-foreground">Vintage Camera Collection</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1d ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-muted-foreground">$340.00 from David Kim</p>
                    </div>
                    <span className="text-xs text-muted-foreground">3d ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Performance Metrics</CardTitle>
                <CardDescription>Your rental business insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">98%</div>
                    <div className="text-sm text-muted-foreground">Booking Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">4.8</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">127</div>
                    <div className="text-sm text-muted-foreground">Total Reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">My Listings</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                    <p className="text-sm">Start by creating your first listing to share with the community.</p>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Listing
                  </Button>
                </div>
              ) : (
                userListings.map((listing) => (
                <Card key={listing.id} className="border-2 hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.title || 'Listing image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement
                        t.onerror = null
                        const fallback = `/images/${listing.category || 'placeholder'}/${listing.category || 'placeholder'}-1.svg`
                        t.src = fallback
                        t.alt = `${listing.title} - image not available`
                      }}
                    />
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold line-clamp-1">{listing.title}</CardTitle>
                      <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="mb-3 line-clamp-2">{listing.description}</CardDescription>

                    <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />${listing.price}/day
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {listing.stats.bookings} bookings
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {listing.stats.views} views
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{listing.stats.rating.toFixed(1)}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/items/${listing.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{listing.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteListing(listing.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* My Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">My Bookings</h2>

            <div className="space-y-4">
              {userBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                    <p className="text-sm">Start exploring listings to make your first booking.</p>
                  </div>
                  <Button onClick={() => router.push('/')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Browse Listings
                  </Button>
                </div>
              ) : (
                userBookings.map((booking) => (
                <Card key={booking.id} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-32 h-24 overflow-hidden rounded-lg">
                        <img
                          src={booking.listingImage || "/placeholder.svg"}
                          alt={booking.listingTitle || 'Booking image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement
                            t.onerror = null
                            const fallback = `/images/placeholder/placeholder-1.svg`
                            t.src = fallback
                            t.alt = `${booking.listingTitle} - image not available`
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{booking.listingTitle}</h3>
                            <p className="text-muted-foreground text-sm mb-2">Hosted by {booking.ownerName}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />${booking.totalPrice} total
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            <Link href={`/items/${booking.id.replace("booking-", "")}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{userStats.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{userProfile?.rating.count || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Reviews</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {userReviews.length > 0 ? (
                userReviews.map((review) => (
                  <Card key={review.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.reviewerAvatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {review.reviewerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.reviewerName}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {review.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground">
                      Reviews from customers will appear here once you start receiving bookings.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Account Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="h-5 w-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input value={profileData.name} readOnly className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={profileData.email} readOnly className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={profileData.phone} readOnly className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={profileData.location} readOnly className="bg-gray-50" />
                    </div>
                  </div>
                  <Button 
                    onClick={() => setIsEditingProfile(true)} 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Information
                  </Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Shield className="h-5 w-5 text-green-600" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50"
                    onClick={() => router.push('/profile/settings')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50"
                    onClick={() => router.push('/profile/settings')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Two-Factor Authentication
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50"
                    onClick={() => router.push('/profile/settings')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50"
                    onClick={() => router.push('/profile/settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                    
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
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
