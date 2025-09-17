'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './auth'
import { Notification, NotificationContextType } from './types/notification'
import { notificationService } from './notification-service'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
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

    // Subscribe to notifications
    const unsubscribeNotifications = notificationService.subscribeToNotifications(
      user.uid,
      (newNotifications) => {
        setNotifications(newNotifications)
        setIsLoading(false)
      }
    )

    // Subscribe to unread count
    const unsubscribeUnreadCount = notificationService.subscribeToUnreadCount(
      user.uid,
      (count) => {
        setUnreadCount(count)
      }
    )

    return () => {
      unsubscribeNotifications()
      unsubscribeUnreadCount()
    }
  }, [user])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId)
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
      await notificationService.markAllAsRead(user.uid)
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
      await notificationService.deleteNotification(notificationId)
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
      const newNotifications = await notificationService.getUserNotifications(user.uid)
      setNotifications(newNotifications)
      const count = await notificationService.getUnreadCount(user.uid)
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
      await notificationService.createNotification(
        notificationData.userId,
        notificationData.type,
        notificationData.title,
        notificationData.message,
        notificationData.link
      )
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
