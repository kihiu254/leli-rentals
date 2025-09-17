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
  Timestamp
} from "firebase/firestore"
import { db } from "./firebase"

export interface Booking {
  id?: string
  listingId: string
  userId: string
  ownerId: string
  listingTitle: string
  listingImage: string
  ownerName: string
  ownerAvatar: string
  ownerRating: number
  dates: {
    start: Date
    end: Date
    duration: number
  }
  totalPrice: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  category: string
  location: string
  createdAt?: Date
  updatedAt?: Date
  paymentStatus: "pending" | "paid" | "refunded"
  specialRequests?: string
  cancellationPolicy?: string
}

export interface BookingFilters {
  userId?: string
  ownerId?: string
  status?: string
  listingId?: string
}

export const bookingsService = {
  // Get bookings with optional filters
  async getBookings(filters: BookingFilters = {}): Promise<Booking[]> {
    try {
      let q = query(collection(db, "bookings"))

      // Apply filters
      if (filters.userId) {
        q = query(q, where("userId", "==", filters.userId))
      }
      if (filters.ownerId) {
        q = query(q, where("ownerId", "==", filters.ownerId))
      }
      if (filters.status) {
        q = query(q, where("status", "==", filters.status))
      }
      if (filters.listingId) {
        q = query(q, where("listingId", "==", filters.listingId))
      }

      // Order by creation date (newest first)
      q = query(q, orderBy("createdAt", "desc"))
      
      const snapshot = await getDocs(q)
      const bookings: Booking[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        bookings.push({ 
          id: doc.id, 
          ...data,
          dates: {
            start: data.dates.start.toDate(),
            end: data.dates.end.toDate(),
            duration: data.dates.duration
          }
        } as Booking)
      })
      
      return bookings
    } catch (error) {
      console.error("Error fetching bookings:", error)
      throw new Error("Failed to fetch bookings")
    }
  },

  // Get booking by ID
  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const docRef = doc(db, "bookings", id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return { 
          id: docSnap.id, 
          ...data,
          dates: {
            start: data.dates.start.toDate(),
            end: data.dates.end.toDate(),
            duration: data.dates.duration
          }
        } as Booking
      }
      return null
    } catch (error) {
      console.error("Error fetching booking:", error)
      throw new Error("Failed to fetch booking")
    }
  },

  // Get user bookings (bookings made by user)
  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.getBookings({ userId })
  },

  // Get owner bookings (bookings for user's listings)
  async getOwnerBookings(ownerId: string): Promise<Booking[]> {
    return this.getBookings({ ownerId })
  },

  // Create new booking
  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date()
      const bookingData = {
        ...booking,
        dates: {
          start: Timestamp.fromDate(booking.dates.start),
          end: Timestamp.fromDate(booking.dates.end),
          duration: booking.dates.duration
        },
        createdAt: now,
        updatedAt: now
      }
      
      const docRef = await addDoc(collection(db, "bookings"), bookingData)
      return docRef.id
    } catch (error) {
      console.error("Error creating booking:", error)
      throw new Error("Failed to create booking")
    }
  },

  // Update booking
  async updateBooking(id: string, updates: Partial<Booking>): Promise<void> {
    try {
      const docRef = doc(db, "bookings", id)
      const updateData: any = {
        ...updates,
        updatedAt: new Date()
      }
      
      // Handle dates conversion if provided
      if (updates.dates) {
        updateData.dates = {
          start: Timestamp.fromDate(updates.dates.start),
          end: Timestamp.fromDate(updates.dates.end),
          duration: updates.dates.duration
        }
      }
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error("Error updating booking:", error)
      throw new Error("Failed to update booking")
    }
  },

  // Delete booking
  async deleteBooking(id: string): Promise<void> {
    try {
      const docRef = doc(db, "bookings", id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error("Error deleting booking:", error)
      throw new Error("Failed to delete booking")
    }
  },

  // Calculate booking statistics for a user
  async getUserBookingStats(userId: string): Promise<{
    totalBookings: number
    totalEarnings: number
    averageRating: number
  }> {
    try {
      const bookings = await this.getBookings({ userId })
      const totalBookings = bookings.length
      
      // Calculate total earnings from completed bookings where user is the owner
      const ownerBookings = await this.getBookings({ ownerId: userId })
      const totalEarnings = ownerBookings
        .filter(booking => booking.status === 'completed' && booking.paymentStatus === 'paid')
        .reduce((sum, booking) => sum + booking.totalPrice, 0)
      
      // For now, return default average rating (this would come from reviews in a real app)
      const averageRating = 0
      
      return {
        totalBookings,
        totalEarnings,
        averageRating
      }
    } catch (error) {
      console.error("Error calculating booking stats:", error)
      return {
        totalBookings: 0,
        totalEarnings: 0,
        averageRating: 0
      }
    }
  }
}
