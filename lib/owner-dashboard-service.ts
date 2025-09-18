import { db } from './database'

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

export class OwnerDashboardService {
  // Get owner statistics
  async getOwnerStats(ownerId: string): Promise<OwnerStats> {
    try {
      // Check if database is available
      if (!db) {
        console.warn('Database not available, returning mock data')
        return {
          totalEarnings: 0,
          totalBookings: 0,
          activeListings: 0,
          rating: 0
        }
      }
      
      const client = await db.connect()
      
      try {
        // Get total earnings
        const earningsResult = await client.query(`
          SELECT COALESCE(SUM(total_price), 0) as total_earnings
          FROM bookings 
          WHERE owner_id = $1 AND payment_status = 'paid'
        `, [ownerId])
        
        // Get total bookings
        const bookingsResult = await client.query(`
          SELECT COUNT(*) as total_bookings
          FROM bookings 
          WHERE owner_id = $1
        `, [ownerId])
        
        // Get active listings
        const listingsResult = await client.query(`
          SELECT COUNT(*) as active_listings
          FROM listings 
          WHERE owner_id = $1 AND status = 'active'
        `, [ownerId])
        
        // Get average rating
        const ratingResult = await client.query(`
          SELECT COALESCE(AVG(rating), 0) as avg_rating
          FROM reviews 
          WHERE reviewee_id = $1
        `, [ownerId])
        
        return {
          totalEarnings: parseFloat(earningsResult.rows[0]?.total_earnings || '0'),
          totalBookings: parseInt(bookingsResult.rows[0]?.total_bookings || '0'),
          activeListings: parseInt(listingsResult.rows[0]?.active_listings || '0'),
          rating: parseFloat(ratingResult.rows[0]?.avg_rating || '0')
        }
      } finally {
        client.release()
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
      // Check if database is available
      if (!db) {
        console.warn('Database not available, returning empty array')
        return []
      }
      
      const client = await db.connect()
      
      try {
        const result = await client.query(`
          SELECT 
            l.id,
            l.title,
            l.category,
            l.price,
            l.status,
            l.image_url as image,
            l.created_at,
            l.owner_id,
            COUNT(b.id) as bookings,
            COALESCE(AVG(r.rating), 0) as rating,
            l.views
          FROM listings l
          LEFT JOIN bookings b ON l.id = b.listing_id
          LEFT JOIN reviews r ON l.id = r.listing_id
          WHERE l.owner_id = $1
          GROUP BY l.id, l.title, l.category, l.price, l.status, l.image_url, l.created_at, l.owner_id, l.views
          ORDER BY l.created_at DESC
        `, [ownerId])
        
        return result.rows.map(row => ({
          id: row.id,
          title: row.title,
          category: row.category,
          price: parseFloat(row.price),
          status: row.status,
          bookings: parseInt(row.bookings),
          rating: parseFloat(row.rating),
          views: parseInt(row.views || '0'),
          image: row.image,
          createdAt: new Date(row.created_at),
          ownerId: row.owner_id
        }))
      } finally {
        client.release()
      }
    } catch (error) {
      console.error('Error fetching owner listings:', error)
      return []
    }
  }

  // Get owner bookings
  async getOwnerBookings(ownerId: string): Promise<OwnerBooking[]> {
    try {
      // Check if database is available
      if (!db) {
        console.warn('Database not available, returning empty array')
        return []
      }
      
      const client = await db.connect()
      
      try {
        const result = await client.query(`
          SELECT 
            b.id,
            b.listing_id,
            l.title as listing_title,
            b.user_id as customer_id,
            u.name as customer_name,
            u.avatar as customer_avatar,
            b.start_date,
            b.end_date,
            b.total_price,
            b.status,
            b.payment_status,
            b.created_at
          FROM bookings b
          JOIN listings l ON b.listing_id = l.id
          JOIN users u ON b.user_id = u.id
          WHERE l.owner_id = $1
          ORDER BY b.created_at DESC
        `, [ownerId])
        
        return result.rows.map(row => ({
          id: row.id,
          listingId: row.listing_id,
          listingTitle: row.listing_title,
          customerId: row.customer_id,
          customerName: row.customer_name,
          customerAvatar: row.customer_avatar,
          startDate: new Date(row.start_date),
          endDate: new Date(row.end_date),
          totalPrice: parseFloat(row.total_price),
          status: row.status,
          paymentStatus: row.payment_status,
          createdAt: new Date(row.created_at)
        }))
      } finally {
        client.release()
      }
    } catch (error) {
      console.error('Error fetching owner bookings:', error)
      return []
    }
  }

  // Get owner activity
  async getOwnerActivity(ownerId: string, limit: number = 10): Promise<OwnerActivity[]> {
    try {
      // Check if database is available
      if (!db) {
        console.warn('Database not available, returning empty array')
        return []
      }
      
      const client = await db.connect()
      
      try {
        // Get recent bookings
        const bookingsResult = await client.query(`
          SELECT 
            b.id,
            b.created_at,
            l.title,
            u.name as customer_name,
            b.total_price
          FROM bookings b
          JOIN listings l ON b.listing_id = l.id
          JOIN users u ON b.user_id = u.id
          WHERE l.owner_id = $1
          ORDER BY b.created_at DESC
          LIMIT $2
        `, [ownerId, limit])
        
        const activities: OwnerActivity[] = bookingsResult.rows.map(row => ({
          id: `booking-${row.id}`,
          type: 'booking' as const,
          title: 'New booking received',
          description: `${row.title} - ${row.customer_name}`,
          timestamp: new Date(row.created_at),
          bookingId: row.id
        }))
        
        // Get recent payments
        const paymentsResult = await client.query(`
          SELECT 
            b.id,
            b.created_at,
            l.title,
            u.name as customer_name,
            b.total_price
          FROM bookings b
          JOIN listings l ON b.listing_id = l.id
          JOIN users u ON b.user_id = u.id
          WHERE l.owner_id = $1 AND b.payment_status = 'paid'
          ORDER BY b.created_at DESC
          LIMIT $2
        `, [ownerId, limit])
        
        const paymentActivities: OwnerActivity[] = paymentsResult.rows.map(row => ({
          id: `payment-${row.id}`,
          type: 'payment' as const,
          title: 'Payment received',
          description: `$${row.total_price} from ${row.customer_name}`,
          timestamp: new Date(row.created_at),
          bookingId: row.id
        }))
        
        // Combine and sort by timestamp
        const allActivities = [...activities, ...paymentActivities]
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit)
        
        return allActivities
      } finally {
        client.release()
      }
    } catch (error) {
      console.error('Error fetching owner activity:', error)
      return []
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(ownerId: string): Promise<{
    bookingSuccessRate: number
    averageRating: number
    totalReviews: number
  }> {
    try {
      const client = await db.connect()
      
      try {
        // Get booking success rate
        const successRateResult = await client.query(`
          SELECT 
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
            COUNT(*) as total_bookings
          FROM bookings b
          JOIN listings l ON b.listing_id = l.id
          WHERE l.owner_id = $1
        `, [ownerId])
        
        const completedBookings = parseInt(successRateResult.rows[0]?.completed_bookings || '0')
        const totalBookings = parseInt(successRateResult.rows[0]?.total_bookings || '0')
        const bookingSuccessRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0
        
        // Get average rating and total reviews
        const ratingResult = await client.query(`
          SELECT 
            COALESCE(AVG(rating), 0) as avg_rating,
            COUNT(*) as total_reviews
          FROM reviews 
          WHERE reviewee_id = $1
        `, [ownerId])
        
        return {
          bookingSuccessRate: Math.round(bookingSuccessRate),
          averageRating: parseFloat(ratingResult.rows[0]?.avg_rating || '0'),
          totalReviews: parseInt(ratingResult.rows[0]?.total_reviews || '0')
        }
      } finally {
        client.release()
      }
    } catch (error) {
      console.error('Error fetching performance metrics:', error)
      return {
        bookingSuccessRate: 0,
        averageRating: 0,
        totalReviews: 0
      }
    }
  }
}

export const ownerDashboardService = new OwnerDashboardService()
