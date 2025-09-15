"use client"

import type React from "react"

import { useState } from "react"
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
import { User, Mail, MapPin, Edit, Trash2, Plus, Star, Calendar, DollarSign, Eye, Settings, Camera } from "lucide-react"
import Link from "next/link"

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
  const [activeTab, setActiveTab] = useState("listings")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    location: mockUser.location,
    bio: "Passionate about sharing great experiences through rentals. I love photography, travel, and outdoor adventures.",
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Profile updated:", profileData)
    setIsEditingProfile(false)
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                    <AvatarFallback className="text-2xl">{mockUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-2">{mockUser.name}</h1>
                      <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {mockUser.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {mockUser.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mockUser.rating}</span>
                        <span className="text-muted-foreground text-sm">• Member since {mockUser.joinDate}</span>
                      </div>
                    </div>

                    <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <DialogDescription>Update your profile information</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
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
                            <div>
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                value={profileData.bio}
                                onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                                rows={3}
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{mockUser.totalListings}</div>
                  <div className="text-sm text-muted-foreground">Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{mockUser.totalBookings}</div>
                  <div className="text-sm text-muted-foreground">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{mockUser.rating}</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

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
              {mockUserListings.map((listing) => (
                <Card key={listing.id} className="border-2 hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={listing.image || "/placeholder.svg"}
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
                        {listing.bookings} bookings
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {listing.views} views
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{listing.rating}</span>
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
              ))}
            </div>
          </TabsContent>

          {/* My Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">My Bookings</h2>

            <div className="space-y-4">
              {mockUserBookings.map((booking) => (
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
                            const fallback = `/images/${booking.category || 'placeholder'}/${booking.category || 'placeholder'}-1.svg`
                            t.src = fallback
                            t.alt = `${booking.listingTitle} - image not available`
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{booking.listingTitle}</h3>
                            <p className="text-muted-foreground text-sm mb-2">Hosted by {booking.owner}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {booking.dates}
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
              ))}
            </div>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Account Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={profileData.name} readOnly className="bg-muted" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={profileData.email} readOnly className="bg-muted" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={profileData.phone} readOnly className="bg-muted" />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={profileData.location} readOnly className="bg-muted" />
                  </div>
                  <Button onClick={() => setIsEditingProfile(true)} className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Information
                  </Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Privacy Settings
                  </Button>
                  <Separator />
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
