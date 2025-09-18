"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuthContext } from "@/components/auth-provider"
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Filter,
  ArrowLeft,
  Clock,
  Check,
  CheckCheck,
  Star,
  Shield,
  Calendar,
  MapPin,
  Eye,
  Heart,
  Share2,
  Download
} from "lucide-react"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  type: 'text' | 'image' | 'file'
  bookingId?: string
  listingId?: string
}

interface ChatSession {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  participantPhone?: string
  participantRating?: number
  participantVerified?: boolean
  lastMessage?: Message
  unreadCount: number
  listingTitle?: string
  listingImage?: string
  bookingId?: string
  createdAt: Date
  updatedAt: Date
}

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuthContext()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "bookings">("all")
  
  // Mock data - in real app, this would come from Firebase
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "chat1",
      participantId: "owner1",
      participantName: "John Mwangi",
      participantAvatar: "/placeholder-user.jpg",
      participantPhone: "+254700123456",
      participantRating: 4.9,
      participantVerified: true,
      unreadCount: 2,
      listingTitle: "Luxury BMW X5 SUV",
      listingImage: "/images/Luxury Sports Car.jpg",
      bookingId: "booking1",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      lastMessage: {
        id: "msg1",
        senderId: "owner1",
        receiverId: user?.id || "user1",
        content: "Hi! I've confirmed your booking for the BMW X5. You can pick it up tomorrow at 9 AM.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
        type: 'text',
        bookingId: "booking1"
      }
    },
    {
      id: "chat2",
      participantId: "owner2",
      participantName: "Sarah Kimani",
      participantAvatar: "/placeholder-user.jpg",
      participantPhone: "+254700234567",
      participantRating: 4.8,
      participantVerified: true,
      unreadCount: 0,
      listingTitle: "Modern 2-Bedroom Apartment",
      listingImage: "/modern-apartment-city-view.png",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      lastMessage: {
        id: "msg2",
        senderId: user?.id || "user1",
        receiverId: "owner2",
        content: "Thank you for the great stay! The apartment was perfect.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        type: 'text'
      }
    },
    {
      id: "chat3",
      participantId: "owner3",
      participantName: "David Ochieng",
      participantAvatar: "/placeholder-user.jpg",
      participantPhone: "+254700345678",
      participantRating: 4.7,
      participantVerified: true,
      unreadCount: 1,
      listingTitle: "Professional Camera Kit",
      listingImage: "/images/Vintage Camera Collection.jpg",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      lastMessage: {
        id: "msg3",
        senderId: "owner3",
        receiverId: user?.id || "user1",
        content: "The camera kit is ready for pickup. When would you like to collect it?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        type: 'text'
      }
    }
  ])

  const [messages, setMessages] = useState<Message[]>([])
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null)

  // Handle URL parameters for pre-filling chat
  useEffect(() => {
    const ownerParam = searchParams?.get('owner')
    const listingParam = searchParams?.get('listing')
    const bookingParam = searchParams?.get('booking')
    
    if (ownerParam) {
      // Find existing chat or create new one
      const existingChat = chatSessions.find(chat => 
        chat.participantName.toLowerCase().includes(ownerParam.toLowerCase())
      )
      
      if (existingChat) {
        setActiveChat(existingChat.id)
        setCurrentChat(existingChat)
      } else {
        // Create new chat session
        const newChat: ChatSession = {
          id: `chat_${Date.now()}`,
          participantId: `owner_${ownerParam.replace(/\s+/g, '_').toLowerCase()}`,
          participantName: ownerParam,
          participantAvatar: "/placeholder-user.jpg",
          participantPhone: "+254700000000",
          participantRating: 4.5,
          participantVerified: false,
          unreadCount: 0,
          listingTitle: listingParam || "Rental Inquiry",
          listingImage: "/placeholder.svg",
          bookingId: bookingParam,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        setChatSessions(prev => [newChat, ...prev])
        setActiveChat(newChat.id)
        setCurrentChat(newChat)
        
        toast({
          title: "New conversation started",
          description: `Started a chat with ${ownerParam}`,
        })
      }
    }
  }, [searchParams, chatSessions, toast])

  // Mock messages for active chat
  useEffect(() => {
    if (activeChat && currentChat) {
      const mockMessages: Message[] = [
        {
          id: "msg1",
          senderId: currentChat.participantId,
          receiverId: user?.id || "user1",
          content: `Hello! I'm ${currentChat.participantName}. How can I help you with your rental inquiry?`,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
          type: 'text'
        },
        {
          id: "msg2",
          senderId: user?.id || "user1",
          receiverId: currentChat.participantId,
          content: "Hi! I'm interested in your listing. Could you tell me more about availability?",
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          read: true,
          type: 'text'
        },
        {
          id: "msg3",
          senderId: currentChat.participantId,
          receiverId: user?.id || "user1",
          content: "Of course! The item is available for the next 2 weeks. What dates are you looking at?",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          read: true,
          type: 'text'
        },
        {
          id: "msg4",
          senderId: user?.id || "user1",
          receiverId: currentChat.participantId,
          content: "I'm thinking about this weekend. What's the pricing like?",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false,
          type: 'text'
        }
      ]
      setMessages(mockMessages)
    }
  }, [activeChat, currentChat, user?.id])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentChat || !user) return

    setSendingMessage(true)
    
    try {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        senderId: user.id,
        receiverId: currentChat.participantId,
        content: messageInput.trim(),
        timestamp: new Date(),
        read: false,
        type: 'text'
      }

      // Add message to current chat
      setMessages(prev => [...prev, newMessage])
      
      // Update chat session
      setChatSessions(prev => prev.map(chat => 
        chat.id === activeChat 
          ? { ...chat, lastMessage: newMessage, updatedAt: new Date(), unreadCount: 0 }
          : chat
      ))

      setMessageInput("")
      
      // Simulate response after 2 seconds
      setTimeout(() => {
        const responseMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          senderId: currentChat.participantId,
          receiverId: user.id,
          content: "Thanks for your message! I'll get back to you shortly.",
          timestamp: new Date(),
          read: false,
          type: 'text'
        }
        setMessages(prev => [...prev, responseMessage])
      }, 2000)

    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSendingMessage(false)
    }
  }

  const handleChatSelect = (chatId: string) => {
    const chat = chatSessions.find(c => c.id === chatId)
    if (chat) {
      setActiveChat(chatId)
      setCurrentChat(chat)
      
      // Mark messages as read
      setChatSessions(prev => prev.map(c => 
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      ))
    }
  }

  const handleCallOwner = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`
    toast({
      title: "Opening phone dialer",
      description: `Calling ${currentChat?.participantName}...`,
    })
  }

  const filteredChats = chatSessions.filter(chat => {
    const matchesSearch = chat.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.listingTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (filterStatus) {
      case "unread":
        return matchesSearch && chat.unreadCount > 0
      case "bookings":
        return matchesSearch && chat.bookingId
      default:
        return matchesSearch
    }
  })

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="btn-animate"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Messages</h1>
              <p className="text-gray-600 dark:text-gray-400">Connect with rental owners and manage your conversations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {chatSessions.reduce((sum, chat) => sum + chat.unreadCount, 0)} unread
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search and Filter */}
            <Card className="card-animate">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={filterStatus === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterStatus === "unread" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("unread")}
                    >
                      Unread
                    </Button>
                    <Button
                      variant={filterStatus === "bookings" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("bookings")}
                    >
                      Bookings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Sessions */}
            <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto">
              {filteredChats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    activeChat === chat.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={chat.participantAvatar} alt={chat.participantName} />
                        <AvatarFallback>{chat.participantName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {chat.participantName}
                          </h3>
                          {chat.participantVerified && (
                            <Shield className="h-3 w-3 text-blue-500" />
                          )}
                          {chat.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs px-1 py-0">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        {chat.listingTitle && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                            {chat.listingTitle}
                          </p>
                        )}
                        
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                            {chat.lastMessage.content}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">
                              {chat.participantRating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTime(chat.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {currentChat ? (
              <Card className="h-full flex flex-col card-animate">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentChat.participantAvatar} alt={currentChat.participantName} />
                        <AvatarFallback>{currentChat.participantName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {currentChat.participantName}
                          </h3>
                          {currentChat.participantVerified && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>{currentChat.participantRating} Owner Rating</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCallOwner(currentChat.participantPhone || '+254700000000')}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {currentChat.listingTitle && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentChat.listingImage}
                          alt={currentChat.listingTitle}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {currentChat.listingTitle}
                          </h4>
                          {currentChat.bookingId && (
                            <Badge variant="outline" className="text-xs mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              Active Booking
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.senderId === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.senderId === user?.id && (
                            <div className="ml-1">
                              {message.read ? (
                                <CheckCheck className="h-3 w-3 text-blue-300" />
                              ) : (
                                <Check className="h-3 w-3 text-blue-300" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={sendingMessage}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sendingMessage}
                      className="btn-animate"
                    >
                      {sendingMessage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center card-animate">
                <CardContent className="text-center p-8">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a chat from the sidebar to start messaging
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
