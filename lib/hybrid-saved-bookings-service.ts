// Hybrid saved bookings service - Firebase with local storage fallback
import { firebaseSavedBookingsService } from './firebase-saved-bookings-service'
import { savedBookingsService } from './saved-bookings-service'
import { SavedBooking } from './types/saved-booking'

class HybridSavedBookingsService {
  private useFirebase = true

  // Get all saved bookings for a user
  async getUserSavedBookings(userId: string): Promise<SavedBooking[]> {
    try {
      if (this.useFirebase) {
        return await firebaseSavedBookingsService.getUserSavedBookings(userId)
      } else {
        return await savedBookingsService.getUserSavedBookings(userId)
      }
    } catch (error) {
      console.error('Firebase failed, falling back to local storage:', error)
      this.useFirebase = false
      return await savedBookingsService.getUserSavedBookings(userId)
    }
  }

  // Save a booking from a listing
  async saveBooking(userId: string, listing: any, notes?: string, tags?: string[]): Promise<SavedBooking> {
    try {
      if (this.useFirebase) {
        return await firebaseSavedBookingsService.saveBooking(userId, listing, notes, tags)
      } else {
        return await savedBookingsService.saveBooking(userId, listing, notes, tags)
      }
    } catch (error) {
      console.error('Firebase failed, falling back to local storage:', error)
      this.useFirebase = false
      return await savedBookingsService.saveBooking(userId, listing, notes, tags)
    }
  }

  // Remove a saved booking
  async removeSavedBooking(userId: string, listingId: string): Promise<void> {
    try {
      if (this.useFirebase) {
        return await firebaseSavedBookingsService.removeSavedBooking(userId, listingId)
      } else {
        return await savedBookingsService.removeSavedBooking(userId, listingId)
      }
    } catch (error) {
      console.error('Firebase failed, falling back to local storage:', error)
      this.useFirebase = false
      return await savedBookingsService.removeSavedBooking(userId, listingId)
    }
  }

  // Check if a listing is saved
  async isListingSaved(userId: string, listingId: string): Promise<boolean> {
    try {
      if (this.useFirebase) {
        return await firebaseSavedBookingsService.isListingSaved(userId, listingId)
      } else {
        return await savedBookingsService.isListingSaved(userId, listingId)
      }
    } catch (error) {
      console.error('Firebase failed, falling back to local storage:', error)
      this.useFirebase = false
      return await savedBookingsService.isListingSaved(userId, listingId)
    }
  }

  // Update saved booking notes/tags
  async updateSavedBooking(userId: string, listingId: string, updates: { notes?: string; tags?: string[] }): Promise<void> {
    try {
      if (this.useFirebase) {
        return await firebaseSavedBookingsService.updateSavedBooking(userId, listingId, updates)
      } else {
        return await savedBookingsService.updateSavedBooking(userId, listingId, updates)
      }
    } catch (error) {
      console.error('Firebase failed, falling back to local storage:', error)
      this.useFirebase = false
      return await savedBookingsService.updateSavedBooking(userId, listingId, updates)
    }
  }

  // Get saved bookings by category
  async getSavedBookingsByCategory(userId: string, category: string): Promise<SavedBooking[]> {
    try {
      if (this.useFirebase) {
        return await firebaseSavedBookingsService.getSavedBookingsByCategory(userId, category)
      } else {
        return await savedBookingsService.getSavedBookingsByCategory(userId, category)
      }
    } catch (error) {
      console.error('Firebase failed, falling back to local storage:', error)
      this.useFirebase = false
      return await savedBookingsService.getSavedBookingsByCategory(userId, category)
    }
  }

  // Search saved bookings
  async searchSavedBookings(userId: string, query: string): Promise<SavedBooking[]> {
    try {
      if (this.useFirebase) {
        return await firebaseSavedBookingsService.searchSavedBookings(userId, query)
      } else {
        return await savedBookingsService.searchSavedBookings(userId, query)
      }
    } catch (error) {
      console.error('Firebase failed, falling back to local storage:', error)
      this.useFirebase = false
      return await savedBookingsService.searchSavedBookings(userId, query)
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
      if (this.useFirebase) {
        return await firebaseSavedBookingsService.getSavedBookingsStats(userId)
      } else {
        return await savedBookingsService.getSavedBookingsStats(userId)
      }
    } catch (error) {
      console.error('Firebase failed, falling back to local storage:', error)
      this.useFirebase = false
      return await savedBookingsService.getSavedBookingsStats(userId)
    }
  }
}

export const hybridSavedBookingsService = new HybridSavedBookingsService()
export default hybridSavedBookingsService
