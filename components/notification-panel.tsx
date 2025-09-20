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
import { useNotifications } from '@/lib/notification-context'
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
  const { notifications, unreadCount, isLoading, refreshNotifications } = useNotifications()
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null)

  // Load notifications when panel opens
  React.useEffect(() => {
    if (isOpen && user?.uid) {
      refreshNotifications()
    }
  }, [isOpen, user?.uid, refreshNotifications])

  const loadNotifications = async () => {
    if (!user?.uid) return
    refreshNotifications()
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await notificationsService.markAsRead(notification.id)
      refreshNotifications() // Refresh to get updated state
    }
    setSelectedNotification(notification.id)
  }

  const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    // For now, we'll just mark as read since we don't have delete functionality
    await notificationsService.markAsRead(notificationId)
    refreshNotifications() // Refresh to get updated state
    if (selectedNotification === notificationId) {
      setSelectedNotification(null)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user?.uid) return
    await notificationsService.markAllAsRead(user.uid)
    refreshNotifications() // Refresh to get updated state
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="fixed right-2 sm:right-4 top-16 w-[calc(100vw-1rem)] sm:w-96 max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
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
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadNotifications}
                  className="text-xs px-2 sm:px-3"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-3 w-3 sm:mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs px-2 sm:px-3"
                  >
                    <Check className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Mark all read</span>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-9 sm:w-9">
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
                    className="mt-4 text-xs sm:text-sm px-3 sm:px-4"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Check for notifications</span>
                    <span className="sm:hidden">Check</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={cn(
                          "p-2 sm:p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-4 group",
                          getNotificationColor(notification.type),
                          !notification.read && "bg-blue-50/50 dark:bg-blue-900/20",
                          selectedNotification === notification.id && "bg-orange-50 dark:bg-orange-900/20"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className={cn(
                                  "text-sm font-semibold leading-tight",
                                  !notification.read ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                                )}>
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                  </span>
                                  {!notification.read && (
                                    <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
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
