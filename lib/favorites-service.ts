import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy
} from "firebase/firestore"
import { db } from "./firebase"

export interface Favorite {
  id?: string
  userId: string
  listingId: string
  title: string
  description: string
  price: number
  category: string
  image: string
  location: string
  ownerName: string
  rating: number
  reviews: number
  addedDate: Date
  lastViewed?: Date
  isAvailable: boolean
}

export const favoritesService = {
  // Get user's favorites
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    try {
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", userId),
        orderBy("addedDate", "desc")
      )
      
      const snapshot = await getDocs(q)
      const favorites: Favorite[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        favorites.push({ 
          id: doc.id, 
          ...data,
          addedDate: data.addedDate.toDate(),
          lastViewed: data.lastViewed ? data.lastViewed.toDate() : undefined
        } as Favorite)
      })
      
      return favorites
    } catch (error) {
      console.error("Error fetching favorites:", error)
      throw new Error("Failed to fetch favorites")
    }
  },

  // Check if listing is favorited by user
  async isFavorited(userId: string, listingId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", userId),
        where("listingId", "==", listingId)
      )
      
      const snapshot = await getDocs(q)
      return !snapshot.empty
    } catch (error) {
      console.error("Error checking favorite status:", error)
      return false
    }
  },

  // Add to favorites
  async addToFavorites(userId: string, listingId: string, listingData: Omit<Favorite, 'id' | 'userId' | 'listingId' | 'addedDate' | 'lastViewed'>): Promise<string> {
    try {
      // Check if already favorited
      const isAlreadyFavorited = await this.isFavorited(userId, listingId)
      if (isAlreadyFavorited) {
        throw new Error("Listing is already in favorites")
      }

      const favoriteData = {
        userId,
        listingId,
        ...listingData,
        addedDate: new Date(),
        lastViewed: new Date()
      }
      
      const docRef = await addDoc(collection(db, "favorites"), favoriteData)
      return docRef.id
    } catch (error) {
      console.error("Error adding to favorites:", error)
      throw new Error("Failed to add to favorites")
    }
  },

  // Remove from favorites
  async removeFromFavorites(userId: string, listingId: string): Promise<void> {
    try {
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", userId),
        where("listingId", "==", listingId)
      )
      
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        throw new Error("Favorite not found")
      }
      
      // Delete the first (and should be only) document
      const docRef = snapshot.docs[0].ref
      await deleteDoc(docRef)
    } catch (error) {
      console.error("Error removing from favorites:", error)
      throw new Error("Failed to remove from favorites")
    }
  },

  // Update last viewed timestamp
  async updateLastViewed(userId: string, listingId: string): Promise<void> {
    try {
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", userId),
        where("listingId", "==", listingId)
      )
      
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref
        await docRef.update({
          lastViewed: new Date()
        })
      }
    } catch (error) {
      console.error("Error updating last viewed:", error)
      // Don't throw error for this, it's not critical
    }
  },

  // Toggle favorite (add if not favorited, remove if favorited)
  async toggleFavorite(userId: string, listingId: string, listingData?: Omit<Favorite, 'id' | 'userId' | 'listingId' | 'addedDate' | 'lastViewed'>): Promise<boolean> {
    try {
      const isFavorited = await this.isFavorited(userId, listingId)
      
      if (isFavorited) {
        await this.removeFromFavorites(userId, listingId)
        return false // Removed from favorites
      } else {
        if (!listingData) {
          throw new Error("Listing data is required to add to favorites")
        }
        await this.addToFavorites(userId, listingId, listingData)
        return true // Added to favorites
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      throw new Error("Failed to toggle favorite")
    }
  }
}
