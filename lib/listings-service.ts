import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  DocumentSnapshot,
  QueryDocumentSnapshot
} from "firebase/firestore"
import { db } from "./firebase"

// Check if Firebase is properly initialized
const isFirebaseInitialized = () => {
  return !!db
}

export interface Listing {
  id?: string
  title: string
  description: string
  price: number
  location: string
  rating: number
  reviews: number
  image: string
  amenities: string[]
  available: boolean
  category: string
  owner: {
    id: string
    name: string
    avatar: string
    rating: number
    verified: boolean
    phone?: string
  }
  images: string[]
  fullDescription: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ListingFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  available?: boolean
  search?: string
}

export const listingsService = {
  // Get all listings with optional filters
  async getListings(filters: ListingFilters = {}, pageSize: number = 24, lastDoc?: QueryDocumentSnapshot): Promise<{ listings: Listing[], hasMore: boolean, lastDoc?: QueryDocumentSnapshot }> {
    if (!isFirebaseInitialized()) {
      return { listings: [], hasMore: false }
    }
    
    try {
      let q = query(collection(db, "listings"))

      // Apply filters
      if (filters.category) {
        q = query(q, where("category", "==", filters.category))
      }
      if (filters.available !== undefined) {
        q = query(q, where("available", "==", filters.available))
      }
      if (filters.minPrice) {
        q = query(q, where("price", ">=", filters.minPrice))
      }
      if (filters.maxPrice) {
        q = query(q, where("price", "<=", filters.maxPrice))
      }
      if (filters.location) {
        q = query(q, where("location", "==", filters.location))
      }

      // Remove orderBy to avoid index requirement - sort in memory instead
      
      // Apply pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }
      q = query(q, limit(pageSize + 1)) // Get one extra to check if there are more

      const snapshot = await getDocs(q)
      const listings: Listing[] = []
      let hasMore = false

      snapshot.forEach((doc, index) => {
        if (index < pageSize) {
          listings.push({ id: doc.id, ...doc.data() } as Listing)
        } else {
          hasMore = true
        }
      })

      const lastDocument = snapshot.docs[pageSize - 1]

      // Apply search filter after fetching (Firestore doesn't support full-text search)
      let filteredListings = listings
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredListings = listings.filter(listing => 
          listing.title.toLowerCase().includes(searchTerm) ||
          listing.description.toLowerCase().includes(searchTerm) ||
          listing.category.toLowerCase().includes(searchTerm)
        )
      }

      return { 
        listings: filteredListings, 
        hasMore, 
        lastDoc: hasMore ? lastDocument : undefined 
      }
    } catch (error) {
      console.error("Error fetching listings:", error)
      throw new Error("Failed to fetch listings")
    }
  },

  // Get listing by ID
  async getListingById(id: string): Promise<Listing | null> {
    if (!isFirebaseInitialized()) {
      return null
    }
    
    try {
      const docRef = doc(db, "listings", id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Listing
      }
      return null
    } catch (error) {
      console.error("Error fetching listing:", error)
      throw new Error("Failed to fetch listing")
    }
  },

  // Get listings by user ID
  async getUserListings(userId: string): Promise<Listing[]> {
    if (!isFirebaseInitialized()) {
      return []
    }
    
    try {
      const q = query(
        collection(db, "listings"),
        where("ownerId", "==", userId)
      )
      
      const snapshot = await getDocs(q)
      const listings: Listing[] = []
      
      snapshot.forEach((doc) => {
        listings.push({ id: doc.id, ...doc.data() } as Listing)
      })
      
      // Sort in memory by creation date (newest first)
      return listings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } catch (error) {
      console.error("Error fetching user listings:", error)
      throw new Error("Failed to fetch user listings")
    }
  },

  // Create new listing
  async createListing(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!isFirebaseInitialized()) {
      console.error('Firebase is not properly configured')
      throw new Error('Firebase is not properly configured. Please check your environment variables.')
    }
    
    try {
      console.log('Creating listing with data:', listing)
      
      // Validate required fields
      if (!listing.title || !listing.description || !listing.price || !listing.owner?.id) {
        throw new Error('Missing required fields: title, description, price, or owner information')
      }
      
      const now = new Date()
      const listingData = {
        ...listing,
        ownerId: listing.owner.id, // Add ownerId for easier querying
        createdAt: now,
        updatedAt: now
      }
      
      console.log('Listing data to be saved:', listingData)
      
      const docRef = await addDoc(collection(db, "listings"), listingData)
      console.log('Listing created successfully with ID:', docRef.id)
      
      return docRef.id
    } catch (error) {
      console.error("Error creating listing:", error)
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          throw new Error("Permission denied. Please check your authentication status.")
        } else if (error.message.includes('network')) {
          throw new Error("Network error. Please check your internet connection.")
        } else if (error.message.includes('quota')) {
          throw new Error("Database quota exceeded. Please try again later.")
        }
      }
      
      throw new Error(`Failed to create listing: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Update listing
  async updateListing(id: string, updates: Partial<Listing>): Promise<void> {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.')
    }
    
    try {
      const docRef = doc(db, "listings", id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error("Error updating listing:", error)
      throw new Error("Failed to update listing")
    }
  },

  // Delete listing
  async deleteListing(id: string): Promise<void> {
    if (!isFirebaseInitialized()) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.')
    }
    
    try {
      const docRef = doc(db, "listings", id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error("Error deleting listing:", error)
      throw new Error("Failed to delete listing")
    }
  },

  // Get categories with counts
  async getCategories(): Promise<{ id: string; name: string; count: number }[]> {
    try {
      const categories = [
        { id: "all", name: "All Categories" },
        { id: "vehicles", name: "Vehicles" },
        { id: "equipment", name: "Equipment" },
        { id: "homes", name: "Homes & Apartments" },
        { id: "events", name: "Event Spaces" },
        { id: "tech", name: "Electronics" },
        { id: "fashion", name: "Fashion" },
        { id: "tools", name: "Tools" },
        { id: "sports", name: "Sports & Recreation" },
      ]

      // Get counts for each category
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          if (category.id === "all") {
            const allSnapshot = await getDocs(collection(db, "listings"))
            return { ...category, count: allSnapshot.size }
          } else {
            const q = query(collection(db, "listings"), where("category", "==", category.id))
            const snapshot = await getDocs(q)
            return { ...category, count: snapshot.size }
          }
        })
      )

      return categoriesWithCounts
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Return default categories if there's an error
      return [
        { id: "all", name: "All Categories", count: 0 },
        { id: "vehicles", name: "Vehicles", count: 0 },
        { id: "equipment", name: "Equipment", count: 0 },
        { id: "homes", name: "Homes & Apartments", count: 0 },
        { id: "events", name: "Event Spaces", count: 0 },
        { id: "tech", name: "Electronics", count: 0 },
        { id: "fashion", name: "Fashion", count: 0 },
        { id: "tools", name: "Tools", count: 0 },
        { id: "sports", name: "Sports & Recreation", count: 0 },
      ]
    }
  }
}
