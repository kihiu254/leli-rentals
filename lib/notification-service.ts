// Notification service for browser notifications and enhanced user feedback

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  silent?: boolean
}

class NotificationService {
  private permission: NotificationPermission = 'default'

  constructor() {
    if (typeof window !== 'undefined') {
      this.permission = Notification.permission
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied'
    }

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission()
    }

    return this.permission
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window
  }

  // Check if permission is granted
  hasPermission(): boolean {
    return this.permission === 'granted'
  }

  // Show browser notification
  async showNotification(options: NotificationOptions): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported in this browser')
      return
    }

    if (!this.hasPermission()) {
      await this.requestPermission()
    }

    if (this.permission === 'granted') {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
      })

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      // Handle click
      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    }
  }

  // Show booking success notification
  async showBookingSuccessNotification(listingTitle: string, duration: number): Promise<void> {
    await this.showNotification({
      title: '🎉 Booking Successful!',
      body: `You've successfully booked "${listingTitle}" for ${duration} day${duration > 1 ? 's' : ''}. Check your bookings page for details.`,
      icon: '/favicon.ico',
      tag: 'booking-success',
      requireInteraction: true,
    })
  }

  // Show booking confirmation notification
  async showBookingConfirmationNotification(listingTitle: string, duration: number, paymentMethod: string): Promise<void> {
    await this.showNotification({
      title: '🎉 Booking Confirmed!',
      body: `Successfully booked "${listingTitle}" for ${duration} day${duration > 1 ? 's' : ''} via ${paymentMethod}.`,
      icon: '/favicon.ico',
      tag: 'booking-confirmation',
      requireInteraction: true,
    })
  }

  // Show general success notification
  async showSuccessNotification(title: string, message: string): Promise<void> {
    await this.showNotification({
      title: `✅ ${title}`,
      body: message,
      icon: '/favicon.ico',
      tag: 'success',
    })
  }

  // Show error notification
  async showErrorNotification(title: string, message: string): Promise<void> {
    await this.showNotification({
      title: `❌ ${title}`,
      body: message,
      icon: '/favicon.ico',
      tag: 'error',
      requireInteraction: true,
    })
  }
}

export const notificationService = new NotificationService()