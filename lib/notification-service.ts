import { db } from './firebase'
import { collection, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, onSnapshot, Timestamp } from 'firebase/firestore'
import { Notification, NotificationType } from './types/notification'

export class NotificationService {
  private static instance: NotificationService
  private unsubscribe?: () => void

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Create a new notification
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string
  ): Promise<string> {
    try {
      const notificationData = {
        userId,
        type,
        title,
        message,
        link: link || null,
        isRead: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      const docRef = await addDoc(collection(db, 'notifications'), notificationData)
      return docRef.id
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  // Get notifications for current user
  async getUserNotifications(userId: string, limitCount: number = 50): Promise<Notification[]> {
    try {
      const notificationsRef = collection(db, 'notifications')
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        limit(limitCount)
      )

      const snapshot = await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(q, resolve, reject)
        // Store unsubscribe function for cleanup
        this.unsubscribe = unsubscribe
      })

      const notifications: Notification[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        notifications.push({
          id: doc.id,
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          link: data.link,
          isRead: data.isRead,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        })
      })

      // Sort in memory by createdAt descending
      return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void,
    limitCount: number = 50
  ): () => void {
    try {
      const notificationsRef = collection(db, 'notifications')
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        limit(limitCount)
      )

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifications: Notification[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          notifications.push({
            id: doc.id,
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            link: data.link,
            isRead: data.isRead,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate()
          })
        })
        
        // Sort in memory by createdAt descending
        const sortedNotifications = notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        callback(sortedNotifications)
      })

      return unsubscribe
    } catch (error) {
      console.error('Error subscribing to notifications:', error)
      return () => {}
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId)
      await updateDoc(notificationRef, {
        isRead: true,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  // Mark all notifications as read for user
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const notificationsRef = collection(db, 'notifications')
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('isRead', '==', false)
      )

      const snapshot = await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(q, resolve, reject)
        setTimeout(() => unsubscribe(), 5000) // 5 second timeout
      })

      const updatePromises = []
      snapshot.forEach((doc) => {
        updatePromises.push(
          updateDoc(doc.ref, {
            isRead: true,
            updatedAt: Timestamp.now()
          })
        )
      })

      await Promise.all(updatePromises)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId)
      await deleteDoc(notificationRef)
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notificationsRef = collection(db, 'notifications')
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('isRead', '==', false)
      )

      const snapshot = await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(q, resolve, reject)
        setTimeout(() => unsubscribe(), 5000) // 5 second timeout
      })

      return snapshot.size
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  }

  // Subscribe to unread count
  subscribeToUnreadCount(
    userId: string,
    callback: (count: number) => void
  ): () => void {
    try {
      const notificationsRef = collection(db, 'notifications')
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('isRead', '==', false)
      )

      const unsubscribe = onSnapshot(q, (snapshot) => {
        callback(snapshot.size)
      })

      return unsubscribe
    } catch (error) {
      console.error('Error subscribing to unread count:', error)
      return () => {}
    }
  }

  // Notification triggers for different actions
  static async triggerBookingRequest(ownerId: string, renterName: string, listingTitle: string): Promise<void> {
    const service = NotificationService.getInstance()
    await service.createNotification(
      ownerId,
      NotificationType.BOOKING_REQUEST,
      'New Booking Request',
      `${renterName} wants to rent "${listingTitle}"`,
      '/profile/bookings'
    )
  }

  static async triggerBookingConfirmed(renterId: string, listingTitle: string): Promise<void> {
    const service = NotificationService.getInstance()
    await service.createNotification(
      renterId,
      NotificationType.BOOKING_CONFIRMED,
      'Booking Confirmed',
      `Your booking for "${listingTitle}" has been confirmed`,
      '/profile/bookings'
    )
  }

  static async triggerBookingCancelled(renterId: string, listingTitle: string): Promise<void> {
    const service = NotificationService.getInstance()
    await service.createNotification(
      renterId,
      NotificationType.BOOKING_CANCELLED,
      'Booking Cancelled',
      `Your booking for "${listingTitle}" has been cancelled`,
      '/profile/bookings'
    )
  }

  static async triggerNewReview(ownerId: string, reviewerName: string, listingTitle: string, rating: number): Promise<void> {
    const service = NotificationService.getInstance()
    await service.createNotification(
      ownerId,
      NotificationType.NEW_REVIEW,
      'New Review Received',
      `${reviewerName} left a ${rating}-star review for "${listingTitle}"`,
      '/profile/reviews'
    )
  }

  static async triggerMessageReceived(receiverId: string, senderName: string, listingTitle?: string): Promise<void> {
    const service = NotificationService.getInstance()
    const message = listingTitle 
      ? `${senderName} sent you a message about "${listingTitle}"`
      : `${senderName} sent you a message`
    
    await service.createNotification(
      receiverId,
      NotificationType.MESSAGE_RECEIVED,
      'New Message',
      message,
      '/messages'
    )
  }

  static async triggerPaymentReceived(ownerId: string, amount: number, listingTitle: string): Promise<void> {
    const service = NotificationService.getInstance()
    await service.createNotification(
      ownerId,
      NotificationType.PAYMENT_RECEIVED,
      'Payment Received',
      `You received $${amount} for "${listingTitle}"`,
      '/profile/billing'
    )
  }

  static async triggerSystemAnnouncement(userId: string, title: string, message: string): Promise<void> {
    const service = NotificationService.getInstance()
    await service.createNotification(
      userId,
      NotificationType.SYSTEM_ANNOUNCEMENT,
      title,
      message
    )
  }

  // Cleanup subscription
  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = undefined
    }
  }
}

export const notificationService = NotificationService.getInstance()
