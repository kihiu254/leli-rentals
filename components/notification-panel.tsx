'use client'

import React, { useState } from 'react'
import { Bell, X, Check, Trash2, Clock, AlertCircle, MessageCircle, CreditCard, Star, Home, Settings, Calendar, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { notificationsService, Notification } from '@/lib/notifications-service'
import { useAuthContext } from '@/lib/auth-context'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'booking':
      return <Calendar className="h-4 w-4 text-blue-500" />
    case 'payment':
      return <CreditCard className="h-4 w-4 text-purple-500" />
    case 'listing':
      return <Home className="h-4 w-4 text-orange-500" />
    case 'message':
      return <MessageCircle className="h-4 w-4 text-green-500" />
    case 'system':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'booking':
      return 'border-l-blue-500'
    case 'payment':
      return 'border-l-purple-500'
    case 'listing':
      return 'border-l-orange-500'
    case 'message':
      return 'border-l-green-500'
    case 'system':
      return 'border-l-red-500'
    default:
      return 'border-l-gray-500'
  }
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { user } = useAuthContext()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null)

  // Load notifications when panel opens
  React.useEffect(() => {
    if (isOpen && user?.uid) {
      loadNotifications()
    }
  }, [isOpen, user?.uid])

  const loadNotifications = async () => {
    if (!user?.uid) return
    
    setIsLoading(true)
    try {
      console.log('Notification panel: Loading notifications for user:', user.uid)
      const userNotifications = await notificationsService.getUserNotifications(user.uid)
      console.log('Notification panel: Raw notifications:', userNotifications)
      setNotifications(userNotifications)
      
      const unread = await notificationsService.getUnreadCount(user.uid)
      console.log('Notification panel: Unread count:', unread)
      setUnreadCount(unread)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await notificationsService.markAsRead(notification.id)
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    setSelectedNotification(notification.id)
  }

  const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    // For now, we'll just mark as read since we don't have delete functionality
    await notificationsService.markAsRead(notificationId)
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    setUnreadCount(prev => Math.max(0, prev - 1))
    if (selectedNotification === notificationId) {
      setSelectedNotification(null)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user?.uid) return
    await notificationsService.markAllAsRead(user.uid)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="fixed right-4 top-16 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadNotifications}
                  className="text-xs"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                  <p className="text-sm">We'll notify you when something important happens</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadNotifications}
                    className="mt-4"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    Check for notifications
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={cn(
                          "p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-4",
                          getNotificationColor(notification.type),
                          !notification.read && "bg-blue-50/50 dark:bg-blue-900/20",
                          selectedNotification === notification.id && "bg-orange-50 dark:bg-orange-900/20"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className={cn(
                                  "text-sm font-medium",
                                  !notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                                )}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                  </span>
                                  {!notification.read && (
                                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => handleDeleteNotification(notification.id, e)}
                                >
                                  <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {notification.link && (
                          <div className="mt-2">
                            <Link 
                              href={notification.link}
                              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                              onClick={onClose}
                            >
                              View details →
                            </Link>
                          </div>
                        )}
                      </div>
                      
                      {index < notifications.length - 1 && (
                        <Separator className="mx-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
