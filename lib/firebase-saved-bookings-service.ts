// Firebase-based saved bookings service for persistent storage
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { SavedBooking } from './types/saved-booking'

class FirebaseSavedBookingsService {
  private readonly COLLECTION_NAME = 'savedBookings'

  // Get all saved bookings for a user
  async getUserSavedBookings(userId: string): Promise<SavedBooking[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId)
      )
      
      const querySnapshot = await getDocs(q)
      const savedBookings: SavedBooking[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        savedBookings.push({
          id: doc.id,
          userId: data.userId,
          listingId: data.listingId,
          listingTitle: data.listingTitle,
          listingImage: data.listingImage,
          listingPrice: data.listingPrice,
          listingLocation: data.listingLocation,
          listingCategory: data.listingCategory,
          savedAt: data.savedAt?.toDate() || new Date(),
          notes: data.notes,
          tags: data.tags || []
        })
      })
      
      // Sort by savedAt in descending order (most recent first)
      return savedBookings.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime())
    } catch (error) {
      console.error('Error loading saved bookings from Firebase:', error)
      throw new Error('Failed to load saved bookings')
    }
  }

  // Save a booking from a listing
  async saveBooking(userId: string, listing: any, notes?: string, tags?: string[]): Promise<SavedBooking> {
    try {
      // Check if already saved
      const existingBookings = await this.getUserSavedBookings(userId)
      const alreadySaved = existingBookings.find(
        booking => booking.listingId === listing.id
      )
      
      if (alreadySaved) {
        throw new Error('This listing is already saved')
      }

      const savedBookingData = {
        userId,
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.image || listing.images?.[0] || '/placeholder.svg',
        listingPrice: listing.price,
        listingLocation: listing.location,
        listingCategory: listing.category,
        savedAt: serverTimestamp(),
        notes: notes || '',
        tags: tags || []
      }

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), savedBookingData)
      
      return {
        id: docRef.id,
        userId,
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.image || listing.images?.[0] || '/placeholder.svg',
        listingPrice: listing.price,
        listingLocation: listing.location,
        listingCategory: listing.category,
        savedAt: new Date(),
        notes: notes || '',
        tags: tags || []
      }
    } catch (error) {
      console.error('Error saving booking to Firebase:', error)
      throw error
    }
  }

  // Remove a saved booking
  async removeSavedBooking(userId: string, listingId: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('listingId', '==', listingId)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('Saved booking not found')
      }
      
      // Delete the first (and should be only) document
      const docSnapshot = querySnapshot.docs[0]
      await deleteDoc(doc(db, this.COLLECTION_NAME, docSnapshot.id))
    } catch (error) {
      console.error('Error removing saved booking from Firebase:', error)
      throw error
    }
  }

  // Check if a listing is saved
  async isListingSaved(userId: string, listingId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('listingId', '==', listingId)
      )
      
      const querySnapshot = await getDocs(q)
      return !querySnapshot.empty
    } catch (error) {
      console.error('Error checking if listing is saved:', error)
      return false
    }
  }

  // Update saved booking notes/tags
  async updateSavedBooking(userId: string, listingId: string, updates: { notes?: string; tags?: string[] }): Promise<void> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('listingId', '==', listingId)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('Saved booking not found')
      }
      
      const docSnapshot = querySnapshot.docs[0]
      await updateDoc(doc(db, this.COLLECTION_NAME, docSnapshot.id), {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating saved booking:', error)
      throw error
    }
  }

  // Get saved bookings by category
  async getSavedBookingsByCategory(userId: string, category: string): Promise<SavedBooking[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('listingCategory', '==', category)
      )
      
      const querySnapshot = await getDocs(q)
      const savedBookings: SavedBooking[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        savedBookings.push({
          id: doc.id,
          userId: data.userId,
          listingId: data.listingId,
          listingTitle: data.listingTitle,
          listingImage: data.listingImage,
          listingPrice: data.listingPrice,
          listingLocation: data.listingLocation,
          listingCategory: data.listingCategory,
          savedAt: data.savedAt?.toDate() || new Date(),
          notes: data.notes,
          tags: data.tags || []
        })
      })
      
      // Sort by savedAt in descending order (most recent first)
      return savedBookings.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime())
    } catch (error) {
      console.error('Error getting saved bookings by category:', error)
      return []
    }
  }

  // Search saved bookings
  async searchSavedBookings(userId: string, query: string): Promise<SavedBooking[]> {
    try {
      const savedBookings = await this.getUserSavedBookings(userId)
      const lowercaseQuery = query.toLowerCase()
      
      return savedBookings.filter(booking =>
        booking.listingTitle.toLowerCase().includes(lowercaseQuery) ||
        booking.listingLocation.toLowerCase().includes(lowercaseQuery) ||
        booking.listingCategory.toLowerCase().includes(lowercaseQuery) ||
        booking.notes?.toLowerCase().includes(lowercaseQuery) ||
        booking.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    } catch (error) {
      console.error('Error searching saved bookings:', error)
      return []
    }
  }

  // Get saved bookings statistics
  async getSavedBookingsStats(userId: string): Promise<{
    total: number
    byCategory: Record<string, number>
    byLocation: Record<string, number>
    recentCount: number
  }> {
    try {
      const savedBookings = await this.getUserSavedBookings(userId)
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      const byCategory: Record<string, number> = {}
      const byLocation: Record<string, number> = {}
      
      savedBookings.forEach(booking => {
        // Count by category
        byCategory[booking.listingCategory] = (byCategory[booking.listingCategory] || 0) + 1
        
        // Count by location
        byLocation[booking.listingLocation] = (byLocation[booking.listingLocation] || 0) + 1
      })
      
      const recentCount = savedBookings.filter(booking => 
        new Date(booking.savedAt) >= oneWeekAgo
      ).length
      
      return {
        total: savedBookings.length,
        byCategory,
        byLocation,
        recentCount
      }
    } catch (error) {
      console.error('Error getting saved bookings stats:', error)
      return {
        total: 0,
        byCategory: {},
        byLocation: {},
        recentCount: 0
      }
    }
  }
}

export const firebaseSavedBookingsService = new FirebaseSavedBookingsService()
export default firebaseSavedBookingsService
