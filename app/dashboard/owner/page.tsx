"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuthContext } from "@/components/auth-provider"
import { ownerDashboardClientService, OwnerStats, OwnerListing, OwnerBooking, OwnerActivity } from "@/lib/owner-dashboard-client-service"
import {
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  MessageCircle,
  Star,
  Eye,
  Heart,
  Share2,
  Settings,
  BarChart3,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  ExternalLink
} from "lucide-react"

export default function OwnerDashboard() {
  const router = useRouter()
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [listings, setListings] = useState<OwnerListing[]>([])
  const [bookings, setBookings] = useState<OwnerBooking[]>([])
  const [activities, setActivities] = useState<OwnerActivity[]>([])
  const [stats, setStats] = useState<OwnerStats>({
    totalEarnings: 0,
    totalBookings: 0,
    activeListings: 0,
    rating: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load owner dashboard data from database
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) return
      
      setIsLoading(true)
      try {
        // Load all dashboard data in parallel
        const [statsData, listingsData, bookingsData, activitiesData] = await Promise.all([
          ownerDashboardClientService.getOwnerStats(user.id),
          ownerDashboardClientService.getOwnerListings(user.id),
          ownerDashboardClientService.getOwnerBookings(user.id),
          ownerDashboardClientService.getOwnerActivity(user.id, 10)
        ])
        
        setStats(statsData)
        setListings(listingsData)
        setBookings(bookingsData)
        setActivities(activitiesData)
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        toast({
          title: "Error loading dashboard",
          description: "Failed to load your dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDashboardData()
  }, [user?.id, toast])

  const handleCreateListing = () => {
    router.push('/listings/create')
  }

  const handleViewListing = (listingId: string) => {
    router.push(`/listings/details/${listingId}`)
  }

  const handleEditListing = (listingId: string) => {
    router.push(`/listings/edit/${listingId}`)
  }

  const handleViewBooking = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`)
  }

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Owner Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your listings, bookings, and earnings
            </p>
          </div>
          <Button
            onClick={handleCreateListing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white btn-animate"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-animate">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(stats.totalEarnings)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-animate">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalBookings}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-animate">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.activeListings}
                  </p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-animate">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.rating}★
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading dashboard...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Recent Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookings.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No bookings yet</p>
                          <p className="text-sm">Create listings to start receiving bookings</p>
                        </div>
                      ) : (
                        bookings.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-center gap-4 p-3 border rounded-lg">
                            <img
                              src={booking.customerAvatar || "/placeholder-user.jpg"}
                              alt={booking.customerName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {booking.customerName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {booking.listingTitle}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {formatCurrency(booking.totalPrice)}
                              </p>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {bookings.length > 0 && (
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => setActiveTab("bookings")}
                      >
                        View All Bookings
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No recent activity</p>
                          <p className="text-sm">Activity will appear here as you use the platform</p>
                        </div>
                      ) : (
                        activities.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {activity.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                My Listings ({listings.length})
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No listings yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first listing to start earning money
                </p>
                <Button onClick={handleCreateListing} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                <Card key={listing.id} className="card-animate">
                  <div className="aspect-video relative">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(listing.status)}`}>
                      {listing.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{listing.bookings} bookings</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{listing.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{listing.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(listing.price)}/day
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewListing(listing.id)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditListing(listing.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Bookings ({bookings.length})
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Bookings will appear here when customers rent your items
                </p>
                <Button onClick={handleCreateListing} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                <Card key={booking.id} className="card-animate">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.customerAvatar}
                        alt={booking.customerName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {booking.customerName}
                          </h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          {booking.listingTitle}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {formatCurrency(booking.totalPrice)}
                        </p>
                        <Badge className={getStatusColor(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewBooking(booking.id)}
                        >
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Analytics & Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Analytics coming soon! Track your earnings, bookings, and performance metrics.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Detailed performance insights will be available soon.
                    </p>
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
