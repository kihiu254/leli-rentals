'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuthContext } from './auth-context'
import { Notification, NotificationContextType } from './types/notification'
import { notificationsService, Notification as ServiceNotification } from './notifications-service'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Subscribe to notifications when user is authenticated
  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    setIsLoading(true)

    // Load notifications
    const loadNotifications = async () => {
      try {
        const userNotifications = await notificationsService.getUserNotifications(user.uid)
        // Convert ServiceNotification to Notification type
        const convertedNotifications: Notification[] = userNotifications.map(serviceNotif => ({
          id: serviceNotif.id,
          userId: serviceNotif.userId,
          type: serviceNotif.type as any, // Convert string to NotificationType
          title: serviceNotif.title,
          message: serviceNotif.message,
          link: serviceNotif.link,
          isRead: serviceNotif.read,
          createdAt: serviceNotif.createdAt,
          updatedAt: serviceNotif.updatedAt
        }))
        setNotifications(convertedNotifications)
        
        const unread = await notificationsService.getUnreadCount(user.uid)
        setUnreadCount(unread)
      } catch (error) {
        console.error('Error loading notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [user])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId)
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    if (!user) return
    
    try {
      await notificationsService.markAllAsRead(user.uid)
      // Update local state immediately
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [user])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      // For now, just mark as read since delete functionality isn't implemented
      await notificationsService.markAsRead(notificationId)
      // Update local state immediately
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId)
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }, [notifications])

  const refreshNotifications = useCallback(async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      console.log('Loading notifications for user:', user.uid)
      const userNotifications = await notificationsService.getUserNotifications(user.uid)
      console.log('Raw notifications from service:', userNotifications)
      
      // Convert ServiceNotification to Notification type
      const convertedNotifications: Notification[] = userNotifications.map(serviceNotif => ({
        id: serviceNotif.id,
        userId: serviceNotif.userId,
        type: serviceNotif.type as any, // Convert string to NotificationType
        title: serviceNotif.title,
        message: serviceNotif.message,
        link: serviceNotif.link,
        isRead: serviceNotif.read,
        createdAt: serviceNotif.createdAt,
        updatedAt: serviceNotif.updatedAt
      }))
      console.log('Converted notifications:', convertedNotifications)
      setNotifications(convertedNotifications)
      
      const count = await notificationsService.getUnreadCount(user.uid)
      console.log('Unread count:', count)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error refreshing notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const addNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return
    
    try {
      await notificationsService.createNotification({
        userId: notificationData.userId,
        type: notificationData.type as 'booking' | 'payment' | 'system' | 'listing' | 'message',
        title: notificationData.title,
        message: notificationData.message,
        link: notificationData.link
      })
      // Refresh notifications to get the new one
      await refreshNotifications()
    } catch (error) {
      console.error('Error adding notification:', error)
    }
  }, [user, refreshNotifications])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    addNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
