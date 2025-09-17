"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
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
  Bookmark,
  Calendar
} from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Listing } from "@/lib/listings-service"
import { useAuthContext } from "@/components/auth-provider"
import { useInteractions } from "@/lib/hooks/use-interactions"
import { useToast } from "@/hooks/use-toast"
import { bookingsService } from "@/lib/bookings-service"

// 7 specified categories with comprehensive listings
const mockListings: Listing[] = [
  // 1. VEHICLES - cars, motorbikes, trucks, boda bodas
  {
    id: "1",
    title: "Luxury BMW X5 SUV",
    description: "Premium SUV perfect for family trips and business travel",
    price: 15000,
    location: "Nairobi, Kenya",
    rating: 4.8,
    reviews: 127,
    image: "/images/Luxury Sports Car.jpg",
    amenities: ["GPS Navigation", "Bluetooth", "Air Conditioning", "Leather Seats"],
    available: true,
    category: "vehicles",
    owner: { id: "owner1", name: "John Mwangi", avatar: "/placeholder-user.jpg", rating: 4.9, verified: true },
    images: ["/images/Luxury Sports Car.jpg"],
    fullDescription: "Experience luxury and comfort with our premium BMW X5. Perfect for business meetings, family trips, or special occasions.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    title: "Honda CB650R Motorbike",
    description: "Sporty motorcycle perfect for city commuting and weekend rides",
    price: 8000,
    location: "Nairobi, Kenya",
    rating: 4.6,
    reviews: 78,
    image: "/luxury-cars-in-modern-showroom.jpg",
    amenities: ["Helmet", "Insurance", "Maintenance Kit", "GPS Tracker"],
    available: true,
    category: "vehicles",
    owner: { id: "owner2", name: "Kevin Otieno", avatar: "/placeholder-user.jpg", rating: 4.7, verified: true },
    images: ["/luxury-cars-in-modern-showroom.jpg"],
    fullDescription: "Modern sporty motorcycle perfect for city commuting and weekend adventures. Includes helmet and insurance coverage.",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08")
  },

  // 2. HOMES & APARTMENTS - holiday homes, apartments, rooms, office spaces
  {
    id: "3",
    title: "Modern 2-Bedroom Apartment",
    description: "Stylish apartment in Westlands with city views",
    price: 25000,
    location: "Westlands, Nairobi",
    rating: 4.7,
    reviews: 89,
    image: "/modern-apartment-city-view.png",
    amenities: ["WiFi", "Parking", "Balcony", "Security"],
    available: true,
    category: "homes",
    owner: { id: "owner3", name: "Sarah Kimani", avatar: "/placeholder-user.jpg", rating: 4.8, verified: true },
    images: ["/modern-apartment-city-view.png"],
    fullDescription: "Beautiful modern apartment in the heart of Westlands. Fully furnished with modern amenities and stunning city views.",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    id: "4",
    title: "Luxury Holiday Villa in Karen",
    description: "Spacious 4-bedroom villa with garden and pool",
    price: 45000,
    location: "Karen, Nairobi",
    rating: 4.9,
    reviews: 67,
    image: "/modern-apartment-city-view.png",
    amenities: ["Swimming Pool", "Garden", "Maid Service", "Security"],
    available: true,
    category: "homes",
    owner: { id: "owner4", name: "David Ochieng", avatar: "/placeholder-user.jpg", rating: 4.9, verified: true },
    images: ["/modern-apartment-city-view.png"],
    fullDescription: "Exclusive holiday villa in Karen with private pool, landscaped garden, and full staff.",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  },

  // 3. EQUIPMENT & TOOLS - construction tools, cameras, sound systems
  {
    id: "5",
    title: "Professional Camera Kit",
    description: "Complete photography setup for events and portraits",
    price: 8000,
    location: "Nairobi, Kenya",
    rating: 4.9,
    reviews: 156,
    image: "/images/Vintage Camera Collection.jpg",
    amenities: ["Multiple Lenses", "Tripod", "Memory Cards", "Case"],
    available: true,
    category: "equipment",
    owner: { id: "owner5", name: "Peter Kamau", avatar: "/placeholder-user.jpg", rating: 4.9, verified: true },
    images: ["/images/Vintage Camera Collection.jpg"],
    fullDescription: "Professional camera kit perfect for weddings, events, and commercial photography.",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08")
  },
  {
    id: "6",
    title: "Construction Tools Package",
    description: "Complete set of construction tools and equipment",
    price: 15000,
    location: "Nairobi, Kenya",
    rating: 4.6,
    reviews: 43,
    image: "/professional-construction-and-industrial-equipment.jpg",
    amenities: ["Power Tools", "Hand Tools", "Safety Gear", "Toolbox"],
    available: true,
    category: "equipment",
    owner: { id: "owner6", name: "James Mutua", avatar: "/placeholder-user.jpg", rating: 4.7, verified: true },
    images: ["/professional-construction-and-industrial-equipment.jpg"],
    fullDescription: "Complete construction tools package including power tools, hand tools, and safety equipment.",
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06")
  },

  // 4. EVENT SPACES & VENUES - halls, conference centers, outdoor spaces
  {
    id: "7",
    title: "Elegant Wedding Hall",
    description: "Beautiful event space with professional audio setup",
    price: 35000,
    location: "Karen, Nairobi",
    rating: 4.9,
    reviews: 201,
    image: "/elegant-event-venue-with-chandeliers-and-tables.jpg",
    amenities: ["Sound System", "Lighting", "Tables", "Chairs"],
    available: true,
    category: "events",
    owner: { id: "owner7", name: "Peter Kamau", avatar: "/placeholder-user.jpg", rating: 4.9, verified: true },
    images: ["/elegant-event-venue-with-chandeliers-and-tables.jpg"],
    fullDescription: "Elegant wedding hall perfect for weddings, corporate events, and parties.",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "8",
    title: "Conference Center",
    description: "Professional conference facility with AV equipment",
    price: 20000,
    location: "Nairobi, Kenya",
    rating: 4.7,
    reviews: 89,
    image: "/elegant-event-venue-with-chandeliers-and-tables.jpg",
    amenities: ["AV Equipment", "WiFi", "Catering", "Parking"],
    available: true,
    category: "events",
    owner: { id: "owner8", name: "David Ochieng", avatar: "/placeholder-user.jpg", rating: 4.8, verified: true },
    images: ["/elegant-event-venue-with-chandeliers-and-tables.jpg"],
    fullDescription: "Professional conference center perfect for corporate meetings, seminars, and training sessions.",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13")
  },

  // 5. FASHION & LIFESTYLE - designer clothes, jewelry, bags, costumes
  {
    id: "9",
    title: "Designer Evening Gown",
    description: "Elegant designer gown for special occasions",
    price: 5000,
    location: "Nairobi, Kenya",
    rating: 4.8,
    reviews: 94,
    image: "/designer-clothing-and-fashion-accessories.jpg",
    amenities: ["Dry Cleaned", "Size M", "Designer Brand", "Accessories"],
    available: true,
    category: "fashion",
    owner: { id: "owner9", name: "Mary Njeri", avatar: "/placeholder-user.jpg", rating: 4.8, verified: true },
    images: ["/designer-clothing-and-fashion-accessories.jpg"],
    fullDescription: "Stunning designer evening gown perfect for galas, weddings, and special events.",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03")
  },
  {
    id: "10",
    title: "Designer Handbag Collection",
    description: "Luxury handbags for special occasions",
    price: 3000,
    location: "Nairobi, Kenya",
    rating: 4.9,
    reviews: 156,
    image: "/designer-clothing-and-fashion-accessories.jpg",
    amenities: ["Authentic", "Multiple Colors", "Dust Bag", "Certificate"],
    available: true,
    category: "fashion",
    owner: { id: "owner10", name: "Grace Wanjiku", avatar: "/placeholder-user.jpg", rating: 4.9, verified: true },
    images: ["/designer-clothing-and-fashion-accessories.jpg"],
    fullDescription: "Collection of authentic designer handbags perfect for special occasions.",
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09")
  },

  // 6. TECH & GADGETS - laptops, phones, gaming consoles, VR sets
  {
    id: "11",
    title: "MacBook Pro M2",
    description: "Latest MacBook Pro for professional work",
    price: 12000,
    location: "Nairobi, Kenya",
    rating: 4.6,
    reviews: 73,
    image: "/modern-electronics-and-tech-gadgets-display.jpg",
    amenities: ["16GB RAM", "512GB SSD", "Charger", "Case"],
    available: true,
    category: "tech",
    owner: { id: "owner11", name: "Grace Wanjiku", avatar: "/placeholder-user.jpg", rating: 4.7, verified: true },
    images: ["/modern-electronics-and-tech-gadgets-display.jpg"],
    fullDescription: "Latest MacBook Pro M2 chip with 16GB RAM and 512GB SSD.",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  },
  {
    id: "12",
    title: "Gaming Console Setup",
    description: "Complete gaming console with accessories",
    price: 6000,
    location: "Nairobi, Kenya",
    rating: 4.9,
    reviews: 89,
    image: "/images/Gaming Setup.jpg",
    amenities: ["Console", "Controllers", "Games", "HDMI Cable"],
    available: true,
    category: "tech",
    owner: { id: "owner12", name: "Kevin Otieno", avatar: "/placeholder-user.jpg", rating: 4.9, verified: true },
    images: ["/images/Gaming Setup.jpg"],
    fullDescription: "Complete gaming console setup perfect for gaming tournaments and entertainment.",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  },

  // 7. SPORTS & RECREATION - bikes, gym equipment, musical instruments
  {
    id: "13",
    title: "Mountain Bike Package",
    description: "High-quality mountain bike for outdoor adventures",
    price: 4000,
    location: "Nairobi, Kenya",
    rating: 4.8,
    reviews: 78,
    image: "/images/Mountain Bike.jpg",
    amenities: ["Helmet", "Lock", "Repair Kit", "Water Bottle"],
    available: true,
    category: "sports",
    owner: { id: "owner13", name: "Kevin Otieno", avatar: "/placeholder-user.jpg", rating: 4.8, verified: true },
    images: ["/images/Mountain Bike.jpg"],
    fullDescription: "Professional mountain bike perfect for trail riding and outdoor adventures.",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17")
  },
  {
    id: "14",
    title: "Professional Piano",
    description: "Grand piano for concerts and events",
    price: 12000,
    location: "Nairobi, Kenya",
    rating: 4.9,
    reviews: 89,
    image: "/images/Vintage Camera Collection.jpg",
    amenities: ["Tuning", "Delivery", "Setup", "Maintenance"],
    available: true,
    category: "sports",
    owner: { id: "owner14", name: "Grace Wanjiku", avatar: "/placeholder-user.jpg", rating: 4.9, verified: true },
    images: ["/images/Vintage Camera Collection.jpg"],
    fullDescription: "Professional grand piano perfect for concerts, weddings, and special events.",
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19")
  }
]

const mockCategories = [
  { id: "all", name: "All Categories", count: mockListings.length },
  { id: "vehicles", name: "Vehicles", count: mockListings.filter(l => l.category === "vehicles").length },
  { id: "homes", name: "Homes & Apartments", count: mockListings.filter(l => l.category === "homes").length },
  { id: "equipment", name: "Equipment & Tools", count: mockListings.filter(l => l.category === "equipment").length },
  { id: "events", name: "Event Spaces & Venues", count: mockListings.filter(l => l.category === "events").length },
  { id: "fashion", name: "Fashion & Lifestyle", count: mockListings.filter(l => l.category === "fashion").length },
  { id: "tech", name: "Tech & Gadgets", count: mockListings.filter(l => l.category === "tech").length },
  { id: "sports", name: "Sports & Recreation", count: mockListings.filter(l => l.category === "sports").length },
]

export default function ListingsPage() {
  const { user } = useAuthContext()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { interactions, toggleLike, toggleSave, trackView, trackShare } = useInteractions()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [listings, setListings] = useState<Listing[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
    setCategories(mockCategories)
    setListings(mockListings)
  }, [])

  useEffect(() => {
    const search = searchParams ? searchParams.get("search") : null
    const category = searchParams ? searchParams.get("category") : null

    if (search) setSearchQuery(search)
    if (category) setSelectedCategory(category)
  }, [searchParams])

  useEffect(() => {
    let filteredListings = [...mockListings]

    // Filter by category
    if (selectedCategory !== "all") {
      filteredListings = filteredListings.filter(listing => listing.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredListings = filteredListings.filter(listing =>
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query)
      )
    }

    // Filter by price range
    filteredListings = filteredListings.filter(listing =>
      listing.price >= priceRange.min && listing.price <= priceRange.max
    )

    // Sort listings
    filteredListings.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
        case "oldest":
          return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

    setListings(filteredListings)
  }, [selectedCategory, searchQuery, sortBy, priceRange])

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

  // Interaction handlers
  const handleLike = async (listingId: string) => {
    if (!listingId) return
    
    // Use a demo user ID if not signed in
    const userId = user?.id || 'demo_user'
    
    try {
      await toggleLike(listingId)
      const isLiked = interactions[listingId]?.liked
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

  const handleSave = async (listingId: string) => {
    if (!listingId) return
    
    // Use a demo user ID if not signed in
    const userId = user?.id || 'demo_user'
    
    try {
      await toggleSave(listingId)
      const isSaved = interactions[listingId]?.saved
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

  const handleShare = async (listingId: string, title: string) => {
    if (!listingId || !title) return
    
    // Use a demo user ID if not signed in
    const userId = user?.id || 'demo_user'

    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this rental: ${title}`,
          url: window.location.href
        })
        await trackShare(listingId, 'native_share')
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${title} - ${window.location.href}`)
        await trackShare(listingId, 'clipboard')
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

  const handleViewDetails = async (listingId: string) => {
    if (!listingId) return
    
    // Track view
    await trackView(listingId, { source: 'listing_card' })
    
    // Navigate to details page (you'll need to implement this)
    toast({
      title: "View Details",
      description: "Redirecting to listing details..."
    })
  }


  const handleBookNow = async (listing: Listing) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make bookings.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create a booking with default dates (today + 1 day)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      // Calculate duration in days
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8 sm:py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <Header />

      {/* Hero Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <div className="text-center mb-8 fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Discover Amazing Rentals
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto opacity-90">
              Find the perfect rental for your needs. From vehicles to equipment, homes to electronics.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-6 sm:py-8">
        {/* Search and Filters */}
        <div className="mb-8 sm:mb-12 fade-in-up stagger-1">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-blue-500 transition-colors duration-200" />
              <Input
                placeholder="Search rentals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 sm:h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 focus-enhanced"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10 sm:h-12 btn-animate bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="h-10 sm:h-12 btn-animate bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 fade-in-up stagger-2">
            {categories.map((category, index) => {
              const IconComponent = getCategoryIcon(category.id)
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`h-8 sm:h-10 text-xs sm:text-sm btn-animate transition-all duration-200 ${
                    selectedCategory === category.id 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 transition-transform duration-200 group-hover:scale-110" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-1 sm:ml-2 text-xs px-1 py-0 transition-colors duration-200 ${
                      selectedCategory === category.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {category.count}
                  </Badge>
                </Button>
              )
            })}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="h-8 sm:h-10"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="h-8 sm:h-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input placeholder="Enter location" className="h-8 sm:h-10" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Availability</label>
                  <select className="w-full h-8 sm:h-10 px-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600" aria-label="Filter by availability">
                    <option>Available Now</option>
                    <option>Available This Week</option>
                    <option>Available This Month</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 sm:h-12 px-3 sm:px-4 pr-8 border border-gray-300 rounded-lg bg-white text-sm dark:bg-gray-700 dark:border-gray-600"
                aria-label="Sort listings by"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {listings.length} results
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className={`grid gap-3 sm:gap-4 md:gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {listings.map((listing, index) => {
            const IconComponent = getCategoryIcon(listing.category)
            return (
              <Card 
                key={listing.id} 
                className={`group cursor-pointer border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden card-animate bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 ${
                  index < 8 ? 'fade-in-up' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-2 py-1">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200 capitalize">
                        {listing.category}
                      </span>
                    </div>
                  </div>

                  {/* Like Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => listing.id && handleLike(listing.id)}
                    disabled={listing.id ? interactions[listing.id]?.loading : false}
                    className={`absolute top-3 right-3 h-8 w-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 ${
                      listing.id && interactions[listing.id]?.liked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${listing.id && interactions[listing.id]?.liked ? 'fill-current' : ''}`} />
                  </Button>

                  {/* Price */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        KSh {listing.price.toLocaleString()}/day
                      </span>
                    </div>
                  </div>

                  {/* Share Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => listing.id && listing.title && handleShare(listing.id, listing.title)}
                    className="absolute bottom-3 right-3 h-8 w-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {listing.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(listing.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {listing.rating} ({listing.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={listing.owner.avatar} alt={listing.owner.name} />
                        <AvatarFallback>{listing.owner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {listing.owner.name}
                      </span>
                      {listing.owner.verified && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {listing.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                          {amenity}
                        </Badge>
                      ))}
                      {listing.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          +{listing.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white btn-animate shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => listing.id && handleViewDetails(listing.id)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => listing.id && handleSave(listing.id)}
                        disabled={listing.id ? interactions[listing.id]?.loading : false}
                        className={`btn-animate transition-all duration-200 ${
                          listing.id && interactions[listing.id]?.saved 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30' 
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Heart className={`h-4 w-4 mr-1 transition-transform duration-200 ${listing.id && interactions[listing.id]?.saved ? 'fill-current text-green-600 dark:text-green-400' : ''}`} />
                        {listing.id && interactions[listing.id]?.saved ? 'Saved' : 'Save'}
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleBookNow(listing)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white btn-animate shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No listings found</h3>
              <p className="text-sm">Try adjusting your search criteria or browse all categories.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
