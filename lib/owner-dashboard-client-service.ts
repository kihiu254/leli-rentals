export interface OwnerStats {
  totalEarnings: number
  totalBookings: number
  activeListings: number
  rating: number
}

export interface OwnerListing {
  id: string
  title: string
  category: string
  price: number
  status: 'active' | 'inactive' | 'pending'
  bookings: number
  rating: number
  views: number
  image: string
  createdAt: Date
  ownerId: string
}

export interface OwnerBooking {
  id: string
  listingId: string
  listingTitle: string
  customerId: string
  customerName: string
  customerAvatar: string
  startDate: Date
  endDate: Date
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: Date
}

export interface OwnerActivity {
  id: string
  type: 'booking' | 'payment' | 'review' | 'listing_update'
  title: string
  description: string
  timestamp: Date
  listingId?: string
  bookingId?: string
}

export class OwnerDashboardClientService {
  private baseUrl = '/api/owner'

  // Get owner statistics
  async getOwnerStats(ownerId: string): Promise<OwnerStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats?ownerId=${ownerId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch owner stats')
      }
      const data = await response.json()
      
      // Convert date strings back to Date objects
      return {
        totalEarnings: data.totalEarnings || 0,
        totalBookings: data.totalBookings || 0,
        activeListings: data.activeListings || 0,
        rating: data.rating || 0
      }
    } catch (error) {
      console.error('Error fetching owner stats:', error)
      return {
        totalEarnings: 0,
        totalBookings: 0,
        activeListings: 0,
        rating: 0
      }
    }
  }

  // Get owner listings
  async getOwnerListings(ownerId: string): Promise<OwnerListing[]> {
    try {
      const response = await fetch(`${this.baseUrl}/listings?ownerId=${ownerId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch owner listings')
      }
      const data = await response.json()
      
      // Convert date strings back to Date objects
      return data.map((listing: any) => ({
        ...listing,
        createdAt: new Date(listing.createdAt)
      }))
    } catch (error) {
      console.error('Error fetching owner listings:', error)
      return []
    }
  }

  // Get owner bookings
  async getOwnerBookings(ownerId: string): Promise<OwnerBooking[]> {
    try {
      const response = await fetch(`${this.baseUrl}/bookings?ownerId=${ownerId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch owner bookings')
      }
      const data = await response.json()
      
      // Convert date strings back to Date objects
      return data.map((booking: any) => ({
        ...booking,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate),
        createdAt: new Date(booking.createdAt)
      }))
    } catch (error) {
      console.error('Error fetching owner bookings:', error)
      return []
    }
  }

  // Get owner activity
  async getOwnerActivity(ownerId: string, limit: number = 10): Promise<OwnerActivity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/activity?ownerId=${ownerId}&limit=${limit}`)
      if (!response.ok) {
        throw new Error('Failed to fetch owner activity')
      }
      const data = await response.json()
      
      // Convert date strings back to Date objects
      return data.map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }))
    } catch (error) {
      console.error('Error fetching owner activity:', error)
      return []
    }
  }
}

export const ownerDashboardClientService = new OwnerDashboardClientService()
