"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Search, Calendar, DollarSign, Star, MapPin, Eye, MessageCircle, 
  Clock, CheckCircle, XCircle, AlertCircle, Truck, CreditCard,
  TrendingUp, Users, Award, Filter, Download, Share2, Phone
} from "lucide-react"
import { useAuthContext } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { bookingsService, Booking } from "@/lib/bookings-service"

export default function BookingsPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load user bookings
  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return
      
      setIsLoading(true)
      try {
        const userBookings = await bookingsService.getUserBookings(user.id)
        setBookings(userBookings)
      } catch (error) {
        console.error("Error loading bookings:", error)
        toast({
          title: "Error",
          description: "Failed to load your bookings",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadBookings()
  }, [user, toast])
  const [isCancellingBooking, setIsCancellingBooking] = useState(false)
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null)

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        booking.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesTab = activeTab === "all" || booking.status === activeTab
    return matchesSearch && matchesStatus && matchesTab
  })

  const handleCancelBooking = async (bookingId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled and any refunds will be processed within 5-7 business days.",
      })
      
      setIsCancellingBooking(false)
      setCancellingBookingId(null)
    } catch (error) {
      toast({
        title: "Error cancelling booking",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const handleContactOwner = async (ownerName: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Opening chat",
        description: `Starting a conversation with ${ownerName}...`,
      })
    } catch (error) {
      toast({
        title: "Error opening chat",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewListing = (listingId: string) => {
    router.push(`/items/${listingId}`)
  }

  const handleDownloadReceipt = async (bookingId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Receipt downloaded",
        description: "Your booking receipt has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Error downloading receipt",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!user) {
    router.push('/login')
    return null
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
                My Bookings
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your rental bookings and track their status
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                  <div className="text-sm text-muted-foreground">Total Bookings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {bookings.filter(b => b.status === "confirmed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Confirmed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Star className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {bookings.length > 0 ? (Math.round(bookings.reduce((sum, b) => sum + b.ownerRating, 0) / bookings.length * 10) / 10).toFixed(1) : "0.0"}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Owner Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-lg border-0 rounded-xl p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              All Bookings
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              Confirmed
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              Completed
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 mt-6">
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Listing Image */}
                      <div className="w-full lg:w-48 h-32 overflow-hidden rounded-lg">
                        <img
                          src={booking.listingImage || "/placeholder.svg"}
                          alt={booking.listingTitle}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">{booking.listingTitle}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {booking.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(booking.dates.start).toLocaleDateString()} - {new Date(booking.dates.end).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                ${booking.totalPrice.toFixed(2)} total
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{booking.ownerRating}</span>
                                <span className="text-sm text-muted-foreground">({booking.ownerName})</span>
                              </div>
                              <Badge className={getStatusColor(booking.status)}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1">{booking.status}</span>
                              </Badge>
                              <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                                {booking.paymentStatus}
                              </Badge>
                            </div>

                            {booking.specialRequests && (
                              <div className="text-sm text-muted-foreground">
                                <strong>Special Requests:</strong> {booking.specialRequests}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewListing(booking.listingId)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Listing
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleContactOwner(booking.ownerName)}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Contact Owner
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadReceipt(booking.id)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                            </div>

                            {booking.status === "confirmed" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => setCancellingBookingId(booking.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Cancel Booking
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel your booking for "{booking.listingTitle}"? 
                                      {booking.cancellationPolicy && (
                                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                          <strong>Cancellation Policy:</strong> {booking.cancellationPolicy}
                                        </div>
                                      )}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Cancel Booking
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBookings.length === 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || statusFilter !== "all" || activeTab !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "Start exploring and book your first rental!"
                    }
                  </p>
                  {!searchQuery && statusFilter === "all" && activeTab === "all" && (
                    <Button 
                      onClick={() => router.push('/listings')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Browse Listings
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}