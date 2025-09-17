"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LikeButton } from "@/components/like-button"
import { ShareButton } from "@/components/share-button"
import { Search, Filter, Grid, List, MapPin, Star } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { listingsService, Listing } from "@/lib/listings-service"
import { useAuthContext } from "@/components/auth-provider"

// Categories will be loaded from database

export default function ListingsPage() {
  const { user } = useAuthContext()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [listings, setListings] = useState<Listing[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([])
  const [lastDoc, setLastDoc] = useState<any>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await listingsService.getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const search = searchParams ? searchParams.get("search") : null
    const category = searchParams ? searchParams.get("category") : null

    if (search) {
      setSearchQuery(search)
    }
    if (category && categories.find((c) => c.id === category)) {
      setSelectedCategory(category)
    }
  }, [searchParams, categories])

  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true)
      try {
        const filters = {
          category: selectedCategory === "all" ? undefined : selectedCategory,
          search: searchQuery || undefined
        }
        
        const { listings: newListings, hasMore: moreAvailable, lastDoc: newLastDoc } = 
          await listingsService.getListings(filters, 24)
        
        setListings(newListings)
        setLastDoc(newLastDoc)
        setHasMore(moreAvailable)
      } catch (error) {
        console.error("Error loading listings:", error)
        setListings([])
        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    }
    loadListings()
  }, [selectedCategory, searchQuery])

  const loadMore = async () => {
    if (!hasMore || isLoading) return
    
    setIsLoading(true)
    try {
      const filters = {
        category: selectedCategory === "all" ? undefined : selectedCategory,
        search: searchQuery || undefined
      }
      
      const { listings: moreListings, hasMore: moreAvailable, lastDoc: newLastDoc } = 
        await listingsService.getListings(filters, 24, lastDoc)
      
      setListings((prev) => [...prev, ...moreListings])
      setLastDoc(newLastDoc)
      setHasMore(moreAvailable)
    } catch (error) {
      console.error("Error loading more listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Listings are already filtered by the service
  const filteredListings = listings

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl py-6 sm:py-8">
        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search rentals..."
                className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button variant="outline" className="h-10 sm:h-12 px-3 sm:px-4 bg-transparent text-sm">
                <Filter className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none h-10 sm:h-12 px-2 sm:px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none h-10 sm:h-12 px-2 sm:px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <span className="truncate max-w-[80px] sm:max-w-none">{category.name}</span>
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-[10px] sm:text-xs px-1 sm:px-2">
                  {category.count.toLocaleString()}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredListings.length} results
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "all" && ` in ${categories.find((c) => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Listings Grid */}
        <div
          className={`grid gap-3 sm:gap-4 md:gap-6 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={
                    listing.image || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(listing.title)}`
                  }
                  alt={listing.title || "Listing image"}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={300}
                  className={`w-full object-cover object-center ${
                    viewMode === "grid" ? "h-40 sm:h-48" : "h-24 sm:h-32"
                  } group-hover:scale-105 transition-transform duration-300`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.onerror = null
                    const fallback = `/images/${listing.category || 'placeholder'}/${listing.category || 'placeholder'}-1.svg`
                    target.src = fallback
                    target.alt = listing.title ? `${listing.title} - image not available` : 'Image not available'
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <LikeButton itemId={listing.id || ""} itemTitle={listing.title} />
                  <ShareButton itemId={listing.id || ""} itemTitle={listing.title} itemDescription={listing.description} />
                </div>
              </div>

              <CardContent className="p-3 sm:p-4">
                <div className={`${viewMode === "list" ? "flex justify-between items-start" : ""}`}>
                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{listing.title}</h3>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm font-medium">{listing.rating}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">({listing.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <span className="text-xs sm:text-sm text-muted-foreground truncate">{listing.location}</span>
                    </div>
                  </div>

                  <div className={`${viewMode === "list" ? "text-right ml-4" : ""}`}>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">KSh {listing.price}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">/day</span>
                    </div>

                    <Button asChild className="w-full text-xs sm:text-sm h-8 sm:h-10">
                      <Link href={`/listings/${listing.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={loadMore}
              disabled={isLoading}
              className="min-w-[200px] bg-transparent"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Loading...
                </>
              ) : (
                "Load More Results"
              )}
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
