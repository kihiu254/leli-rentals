"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star,
  Car,
  Home,
  Wrench,
  Music,
  Shirt,
  Laptop,
  Dumbbell,
  Camera,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Users,
  Clock,
  Shield,
  Award,
  MessageCircle,
  Phone,
  Mail,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Download,
  Print
} from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Listing } from "@/lib/listings-service"
import { mockListings } from "@/lib/mock-listings-data"
import { useAuthContext } from "@/components/auth-provider"
import { useInteractions } from "@/lib/hooks/use-interactions"
import { useToast } from "@/hooks/use-toast"
import { bookingsService } from "@/lib/bookings-service"

export default function ListingDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuthContext()
  const { toast } = useToast()
  const { interactions, toggleLike, toggleSave, trackView, trackShare } = useInteractions()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [relatedListings, setRelatedListings] = useState<Listing[]>([])

  useEffect(() => {
    setMounted(true)
    // Find the listing by ID
    const foundListing = mockListings.find(l => l.id === id)
    if (foundListing) {
      setListing(foundListing)
      // Track view
      trackView(foundListing.id, { source: 'listing_details' })
      
      // Find related listings (same category, different items)
      const related = mockListings
        .filter(l => l.category === foundListing.category && l.id !== foundListing.id)
        .slice(0, 4)
      setRelatedListings(related)
    }
    setLoading(false)
  }, [id, trackView])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vehicles": return Car
      case "homes": return Home
      case "equipment": return Wrench
      case "events": return Music
      case "fashion": return Shirt
      case "tech": return Laptop
      case "sports": return Dumbbell
      default: return Camera
    }
  }

  const handleLike = async () => {
    if (!listing?.id) return
    
    try {
      await toggleLike(listing.id)
      const isLiked = interactions[listing.id]?.liked
      toast({
        title: isLiked ? "Liked!" : "Unliked",
        description: isLiked ? "Added to your liked listings" : "Removed from liked listings"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      })
    }
  }

  const handleSave = async () => {
    if (!listing?.id) return
    
    try {
      await toggleSave(listing.id)
      const isSaved = interactions[listing.id]?.saved
      toast({
        title: isSaved ? "Saved!" : "Unsaved",
        description: isSaved ? "Added to your saved listings" : "Removed from saved listings"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive"
      })
    }
  }

  const handleShare = async () => {
    if (!listing?.id || !listing?.title) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: `Check out this rental: ${listing.title}`,
          url: window.location.href
        })
        await trackShare(listing.id, 'native_share')
      } else {
        await navigator.clipboard.writeText(`${listing.title} - ${window.location.href}`)
        await trackShare(listing.id, 'clipboard')
        toast({
          title: "Link copied!",
          description: "Listing link copied to clipboard"
        })
      }
    } catch (error) {
      console.error('Share error:', error)
      toast({
        title: "Error",
        description: "Failed to share listing",
        variant: "destructive"
      })
    }
  }

  const handleBookNow = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make bookings.",
        variant: "destructive",
      })
      return
    }

    if (!listing) return

    try {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const duration = Math.ceil((tomorrow.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      const bookingData = {
        userId: user.id,
        ownerId: listing.owner?.id || 'unknown',
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.image,
        ownerName: listing.owner?.name || 'Unknown Owner',
        ownerAvatar: listing.owner?.avatar || '/placeholder.svg',
        ownerRating: listing.owner?.rating || 0,
        dates: {
          start: today,
          end: tomorrow,
          duration: duration
        },
        totalPrice: listing.price * duration,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        category: listing.category,
        location: listing.location,
        specialRequests: '',
        cancellationPolicy: 'Free cancellation up to 24 hours before rental start time.'
      }

      await bookingsService.createBooking(bookingData)
      toast({
        title: "Booking created!",
        description: "Your booking has been created and is pending confirmation. You can find it in your bookings page.",
      })
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: "Error creating booking",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
    }
  }

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8 sm:py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8 sm:py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Listing Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/listings')} className="btn-animate">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const IconComponent = getCategoryIcon(listing.category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <button 
            onClick={() => router.push('/listings')}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Listings
          </button>
          <span>/</span>
          <button 
            onClick={() => router.push(`/listings/${listing.category}`)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize"
          >
            {listing.category}
          </button>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">{listing.title}</span>
        </nav>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 btn-animate"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden card-animate">
              <div className="aspect-video relative group">
                <img
                  src={listing.images?.[currentImageIndex] || listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                      {listing.category}
                    </span>
                  </div>
                </div>

                {/* Image Navigation */}
                {listing.images && listing.images.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleLike}
                    disabled={interactions[listing.id]?.loading}
                    className={`h-10 w-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 ${
                      interactions[listing.id]?.liked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${interactions[listing.id]?.liked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleShare}
                    className="h-10 w-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowImageModal(true)}
                    className="h-10 w-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      KSh {listing.price.toLocaleString()}/day
                    </span>
                  </div>
                </div>

                {/* Image Counter */}
                {listing.images && listing.images.length > 1 && (
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {currentImageIndex + 1} / {listing.images.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {listing.images && listing.images.length > 1 && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex gap-2 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-blue-500' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${listing.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Product Details */}
            <Card className="card-animate">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{listing.rating} ({listing.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{Math.floor(Math.random() * 1000) + 100} views</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {listing.fullDescription || listing.description}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">What's Included</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {listing.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600 dark:text-gray-400">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Meet Your Host</h2>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={listing.owner.avatar} alt={listing.owner.name} />
                        <AvatarFallback className="text-lg">{listing.owner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{listing.owner.name}</h3>
                          {listing.owner.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{listing.owner.rating} Host Rating</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Reviews</h2>
                    <div className="space-y-4">
                      {/* Mock Reviews */}
                      {[
                        { name: "Sarah M.", rating: 5, comment: "Excellent service! The item was exactly as described and the owner was very helpful.", date: "2 days ago" },
                        { name: "John K.", rating: 4, comment: "Great experience overall. Would definitely rent again.", date: "1 week ago" },
                        { name: "Mary W.", rating: 5, comment: "Perfect condition and fast response from the owner. Highly recommended!", date: "2 weeks ago" }
                      ].map((review, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">{review.name}</div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Listings */}
            {relatedListings.length > 0 && (
              <Card className="card-animate">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">More from this category</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedListings.map((relatedListing) => (
                      <div
                        key={relatedListing.id}
                        className="group cursor-pointer"
                        onClick={() => router.push(`/listings/details/${relatedListing.id}`)}
                      >
                        <div className="aspect-video relative overflow-hidden rounded-lg mb-2">
                          <img
                            src={relatedListing.image}
                            alt={relatedListing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded px-2 py-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              KSh {relatedListing.price.toLocaleString()}/day
                            </span>
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {relatedListing.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>{relatedListing.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 card-animate">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      KSh {listing.price.toLocaleString()}/day
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{listing.rating} ({listing.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white btn-animate shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={handleBookNow}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Now
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={handleSave}
                      disabled={interactions[listing.id]?.loading}
                      className={`w-full btn-animate transition-all duration-200 ${
                        interactions[listing.id]?.saved 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30' 
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Heart className={`h-5 w-5 mr-2 transition-transform duration-200 ${interactions[listing.id]?.saved ? 'fill-current text-green-600 dark:text-green-400' : ''}`} />
                      {interactions[listing.id]?.saved ? 'Saved' : 'Save for Later'}
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Free cancellation up to 24 hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>Verified owner</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span>Instant confirmation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-orange-500" />
                        <span>Secure payment</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Download Details
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Print className="h-4 w-4 mr-2" />
                        Print Listing
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Listing
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={listing.images?.[currentImageIndex] || listing.image}
              alt={listing.title}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 h-10 w-10 bg-white/90 hover:bg-white text-gray-900"
            >
              ×
            </Button>
            {listing.images && listing.images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white text-gray-900"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white text-gray-900"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
