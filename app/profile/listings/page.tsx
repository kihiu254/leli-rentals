"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowLeft, Edit, Trash2, Eye, DollarSign, Calendar, Star, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
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
import Link from "next/link"

// Mock user listings data
const mockListings = [
  {
    id: "user-listing-1",
    title: "Vintage Camera Collection",
    description: "Professional vintage cameras for photography enthusiasts and collectors",
    price: 35,
    category: "equipment",
    image: "/images/Vintage Camera Collection.jpg",
    status: "active",
    bookings: 8,
    rating: 4.9,
    views: 156,
    location: "San Francisco, CA",
  },
  {
    id: "user-listing-2",
    title: "Mountain Bike",
    description: "High-quality mountain bike perfect for trails and outdoor adventures",
    price: 25,
    category: "sports",
    image: "/images/mountain Bike.jpg",
    status: "active",
    bookings: 5,
    rating: 4.7,
    views: 89,
    location: "San Francisco, CA",
  },
  {
    id: "user-listing-3",
    title: "Gaming Setup",
    description: "Complete gaming setup with high-end PC and peripherals for streaming",
    price: 45,
    category: "tech",
    image: "/images/Gaming Setup.jpg",
    status: "inactive",
    bookings: 12,
    rating: 4.8,
    views: 234,
    location: "San Francisco, CA",
  },
  {
    id: "user-listing-4",
    title: "Designer Dress Collection",
    description: "Elegant designer dresses for special occasions and events",
    price: 60,
    category: "fashion",
    image: "/images/Designer Dress Collection.jpg",
    status: "active",
    bookings: 15,
    rating: 4.9,
    views: 312,
    location: "San Francisco, CA",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-gray-100 text-gray-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ListingsPage() {
  const handleDeleteListing = (listingId: string) => {
    console.log("Deleting listing:", listingId)
    // Here you would typically call an API to delete the listing
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search your listings..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockListings.map((listing) => (
            <Card key={listing.id} className="border-2 hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                <img
                  src={listing.image || "/item-placeholder.jpg"}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold line-clamp-1">{listing.title}</CardTitle>
                  <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-3 line-clamp-2">{listing.description}</p>

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

        {/* Empty State */}
        {mockListings.length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="p-12 text-center">
              <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-4">Create your first listing to start earning!</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
