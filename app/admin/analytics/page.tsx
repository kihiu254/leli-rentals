"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { analyticsClientService, SiteAnalytics, CategoryAnalytics, UserAnalytics, RevenueAnalytics, ListingAnalytics } from "@/lib/analytics-client-service"
import {
  Users,
  Package,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Star,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react"

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [siteAnalytics, setSiteAnalytics] = useState<SiteAnalytics | null>(null)
  const [categoryAnalytics, setCategoryAnalytics] = useState<CategoryAnalytics[]>([])
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([])
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics[]>([])
  const [topListings, setTopListings] = useState<ListingAnalytics[]>([])
  const [growthMetrics, setGrowthMetrics] = useState({
    userGrowth: 0,
    listingGrowth: 0,
    bookingGrowth: 0,
    revenueGrowth: 0
  })

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const [
        siteData,
        categoryData,
        userData,
        revenueData,
        listingsData,
        growthData
      ] = await Promise.all([
        analyticsClientService.getSiteAnalytics(),
        analyticsClientService.getCategoryAnalytics(),
        analyticsClientService.getUserAnalytics(50),
        analyticsClientService.getRevenueAnalytics('monthly'),
        analyticsClientService.getTopListings(20),
        analyticsClientService.getGrowthMetrics()
      ])

      setSiteAnalytics(siteData)
      setCategoryAnalytics(categoryData)
      setUserAnalytics(userData)
      setRevenueAnalytics(revenueData)
      setTopListings(listingsData)
      setGrowthMetrics(growthData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

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

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading analytics...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive insights into your rental platform performance
            </p>
          </div>
          <Button
            onClick={loadAnalytics}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Key Metrics */}
        {siteAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-animate">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {siteAnalytics.totalUsers.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {getGrowthIcon(growthMetrics.userGrowth)}
                      <span className={`text-sm ${getGrowthColor(growthMetrics.userGrowth)}`}>
                        {Math.abs(growthMetrics.userGrowth).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-animate">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Listings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {siteAnalytics.totalListings.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {getGrowthIcon(growthMetrics.listingGrowth)}
                      <span className={`text-sm ${getGrowthColor(growthMetrics.listingGrowth)}`}>
                        {Math.abs(growthMetrics.listingGrowth).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-animate">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {siteAnalytics.totalBookings.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {getGrowthIcon(growthMetrics.bookingGrowth)}
                      <span className={`text-sm ${getGrowthColor(growthMetrics.bookingGrowth)}`}>
                        {Math.abs(growthMetrics.bookingGrowth).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-animate">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(siteAnalytics.totalRevenue)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {getGrowthIcon(growthMetrics.revenueGrowth)}
                      <span className={`text-sm ${getGrowthColor(growthMetrics.revenueGrowth)}`}>
                        {Math.abs(growthMetrics.revenueGrowth).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional Metrics */}
        {siteAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-animate">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {siteAnalytics.activeUsers.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Last 30 days</p>
                  </div>
                  <Activity className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-animate">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {siteAnalytics.conversionRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">Views to bookings</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-pink-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-animate">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Booking Value</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(siteAnalytics.totalRevenue / Math.max(siteAnalytics.totalBookings, 1))}
                    </p>
                    <p className="text-sm text-gray-500">Per booking</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-teal-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="users">Top Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="listings">Top Listings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Category Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryAnalytics.slice(0, 5).map((category) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {category.category}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category.listings} listings • {category.bookings} bookings
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(category.revenue)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(category.averagePrice)} avg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueAnalytics.slice(0, 6).map((revenue) => (
                      <div key={revenue.period} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {revenue.period}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {revenue.bookings} bookings
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(revenue.revenue)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(revenue.averageBookingValue)} avg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryAnalytics.map((category) => (
                <Card key={category.category} className="card-animate">
                  <CardHeader>
                    <CardTitle className="capitalize">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Listings</span>
                        <span className="font-semibold">{category.listings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Bookings</span>
                        <span className="font-semibold">{category.bookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                        <span className="font-semibold">{formatCurrency(category.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Avg Price</span>
                        <span className="font-semibold">{formatCurrency(category.averagePrice)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="space-y-4">
              {userAnalytics.map((user, index) => (
                <Card key={user.userId} className="card-animate">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {user.userName}
                          </h3>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {user.userEmail}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined {formatDate(user.joinDate)} • Last active {formatDate(user.lastActive)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(user.totalSpent)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.totalBookings} bookings
                        </p>
                        {user.averageRating > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">
                              {user.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="space-y-4">
              {revenueAnalytics.map((revenue) => (
                <Card key={revenue.period} className="card-animate">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {revenue.period}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {revenue.bookings} bookings
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatCurrency(revenue.revenue)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(revenue.averageBookingValue)} avg per booking
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="space-y-4">
              {topListings.map((listing, index) => (
                <Card key={listing.listingId} className="card-animate">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {listing.title}
                          </h3>
                          <Badge variant="outline" className="capitalize">
                            {listing.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{listing.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{listing.bookings} bookings</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{listing.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(listing.revenue)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {listing.conversionRate.toFixed(1)}% conversion
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
