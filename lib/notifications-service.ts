import { db } from './firebase'
import { collection, addDoc, query, where, orderBy, limit, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore'

export interface Notification {
  id: string
  userId: string
  type: 'booking' | 'payment' | 'system' | 'listing' | 'message'
  title: string
  message: string
  link?: string
  data?: {
    bookingId?: string
    listingId?: string
    amount?: number
    status?: string
    [key: string]: any
  }
  read: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NotificationCreateData {
  userId: string
  type: 'booking' | 'payment' | 'system' | 'listing' | 'message'
  title: string
  message: string
  link?: string
  data?: {
    bookingId?: string
    listingId?: string
    amount?: number
    status?: string
    [key: string]: any
  }
}

class NotificationsService {
  private COLLECTION_NAME = 'notifications'

  // Create a new notification
  async createNotification(notificationData: NotificationCreateData): Promise<string> {
    try {
      const now = new Date()
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...notificationData,
        read: false,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  // Get user notifications
  async getUserNotifications(userId: string, limitCount: number = 50): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      
      const snapshot = await getDocs(q)
      const notifications: Notification[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        notifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || doc.id),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt || doc.id)
        } as Notification)
      })
      
      return notifications
    } catch (error) {
      console.error('Error getting user notifications:', error)
      return []
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, this.COLLECTION_NAME, notificationId)
      await updateDoc(notificationRef, {
        read: true,
        updatedAt: Timestamp.fromDate(new Date())
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const notifications = await this.getUserNotifications(userId, 1000)
      const unreadNotifications = notifications.filter(n => !n.read)
      
      const updatePromises = unreadNotifications.map(notification => 
        this.markAsRead(notification.id)
      )
      
      await Promise.all(updatePromises)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.getUserNotifications(userId, 1000)
      return notifications.filter(n => !n.read).length
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  }

  // Create booking notification
  async createBookingNotification(userId: string, bookingData: {
    bookingId: string
    listingTitle: string
    status: 'confirmed' | 'pending' | 'cancelled'
    totalPrice: number
    dates: { start: Date; end: Date }
  }): Promise<string> {
    console.log('Creating booking notification for user:', userId, 'booking:', bookingData)
    
    const statusMessages = {
      confirmed: 'Your booking has been confirmed!',
      pending: 'Your booking is pending approval.',
      cancelled: 'Your booking has been cancelled.'
    }

    const statusEmojis = {
      confirmed: '✅',
      pending: '⏳',
      cancelled: '❌'
    }

    try {
      const notificationId = await this.createNotification({
        userId,
        type: 'booking',
        title: `${statusEmojis[bookingData.status]} Booking ${bookingData.status.charAt(0).toUpperCase() + bookingData.status.slice(1)}`,
        message: `${statusMessages[bookingData.status]} ${bookingData.listingTitle} from ${bookingData.dates.start.toLocaleDateString()} to ${bookingData.dates.end.toLocaleDateString()}. Total: KSh ${bookingData.totalPrice}`,
        data: {
          bookingId: bookingData.bookingId,
          status: bookingData.status,
          amount: bookingData.totalPrice
        }
      })
      console.log('Booking notification created successfully:', notificationId)
      return notificationId
    } catch (error) {
      console.error('Error creating booking notification:', error)
      throw error
    }
  }

  // Create payment notification
  async createPaymentNotification(userId: string, paymentData: {
    bookingId: string
    amount: number
    status: 'success' | 'failed' | 'pending'
    method: string
  }): Promise<string> {
    console.log('Creating payment notification for user:', userId, 'payment:', paymentData)
    
    const statusMessages = {
      success: 'Payment successful!',
      failed: 'Payment failed.',
      pending: 'Payment is being processed.'
    }

    const statusEmojis = {
      success: '💳',
      failed: '❌',
      pending: '⏳'
    }

    try {
      const notificationId = await this.createNotification({
        userId,
        type: 'payment',
        title: `${statusEmojis[paymentData.status]} Payment ${paymentData.status.charAt(0).toUpperCase() + paymentData.status.slice(1)}`,
        message: `${statusMessages[paymentData.status]} KSh ${paymentData.amount} via ${paymentData.method}`,
        data: {
          bookingId: paymentData.bookingId,
          amount: paymentData.amount,
          status: paymentData.status
        }
      })
      console.log('Payment notification created successfully:', notificationId)
      return notificationId
    } catch (error) {
      console.error('Error creating payment notification:', error)
      throw error
    }
  }

  // Create system notification
  async createSystemNotification(userId: string, title: string, message: string, data?: any): Promise<string> {
    return this.createNotification({
      userId,
      type: 'system',
      title: `🔔 ${title}`,
      message,
      data
    })
  }

  // Create listing notification
  async createListingNotification(userId: string, listingData: {
    listingId: string
    listingTitle: string
    action: 'created' | 'updated' | 'approved' | 'rejected'
  }): Promise<string> {
    const actionMessages = {
      created: 'Your listing has been created and is under review.',
      updated: 'Your listing has been updated.',
      approved: 'Your listing has been approved and is now live!',
      rejected: 'Your listing was rejected. Please check the feedback.'
    }

    const actionEmojis = {
      created: '📝',
      updated: '✏️',
      approved: '✅',
      rejected: '❌'
    }

    return this.createNotification({
      userId,
      type: 'listing',
      title: `${actionEmojis[listingData.action]} Listing ${listingData.action.charAt(0).toUpperCase() + listingData.action.slice(1)}`,
      message: `${actionMessages[listingData.action]} ${listingData.listingTitle}`,
      data: {
        listingId: listingData.listingId,
        status: listingData.action
      }
    })
  }
}

export const notificationsService = new NotificationsService()
export default notificationsService
