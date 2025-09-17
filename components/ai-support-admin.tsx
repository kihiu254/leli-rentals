"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
  Filter,
  Search,
  RefreshCw,
  Sparkles,
  Zap,
  BarChart3,
  MessageSquare,
  Activity
} from "lucide-react"
import { aiSupportService, SupportTicket, SupportMessage, ChatSession } from "@/lib/ai-support-service"

interface SupportStats {
  totalTickets: number
  openTickets: number
  resolvedTickets: number
  avgResponseTime: number
  satisfactionScore: number
  aiHandledPercentage: number
}

export default function AISupportAdmin() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [stats, setStats] = useState<SupportStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    avgResponseTime: 0,
    satisfactionScore: 0,
    aiHandledPercentage: 0
  })
  const [reply, setReply] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Load data
  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      // In a real app, you would fetch chat sessions from Firestore
      // For now, we'll use mock data
      const mockSessions: ChatSession[] = [
        {
          id: 'sess-1',
          userId: 'user-1',
          messages: [
            {
              id: 'msg-1',
              sender: 'user',
              content: 'I need help with my booking',
              timestamp: new Date(Date.now() - 300000),
              type: 'text'
            },
            {
              id: 'msg-2',
              sender: 'ai',
              content: 'I can help you with your booking. What specific issue are you experiencing?',
              timestamp: new Date(Date.now() - 240000),
              type: 'text',
              metadata: {
                isAI: true,
                confidence: 0.9,
                category: 'booking'
              }
            }
          ],
          status: 'active',
          createdAt: new Date(Date.now() - 300000),
          updatedAt: new Date(Date.now() - 240000)
        },
        {
          id: 'sess-2',
          userId: 'user-2',
          messages: [
            {
              id: 'msg-3',
              sender: 'user',
              content: 'Payment issue - double charged',
              timestamp: new Date(Date.now() - 600000),
              type: 'text'
            },
            {
              id: 'msg-4',
              sender: 'ai',
              content: 'I understand you were double charged. Let me look into this for you immediately.',
              timestamp: new Date(Date.now() - 540000),
              type: 'text',
              metadata: {
                isAI: true,
                confidence: 0.95,
                category: 'billing'
              }
            }
          ],
          status: 'active',
          createdAt: new Date(Date.now() - 600000),
          updatedAt: new Date(Date.now() - 540000)
        }
      ]

      const mockTickets: SupportTicket[] = [
        {
          id: 'ticket-1',
          userId: 'user-1',
          sessionId: 'sess-1',
          subject: 'Booking modification request',
          category: 'booking',
          priority: 'medium',
          status: 'in-progress',
          messages: [],
          createdAt: new Date(Date.now() - 300000),
          updatedAt: new Date(Date.now() - 240000),
          assignedTo: 'agent-1'
        },
        {
          id: 'ticket-2',
          userId: 'user-2',
          sessionId: 'sess-2',
          subject: 'Double charge on payment',
          category: 'billing',
          priority: 'high',
          status: 'open',
          messages: [],
          createdAt: new Date(Date.now() - 600000),
          updatedAt: new Date(Date.now() - 540000)
        }
      ]

      setSessions(mockSessions)
      setTickets(mockTickets)
      
      // Calculate stats
      setStats({
        totalTickets: mockTickets.length,
        openTickets: mockTickets.filter(t => t.status === 'open').length,
        resolvedTickets: mockTickets.filter(t => t.status === 'resolved').length,
        avgResponseTime: 2.5, // minutes
        satisfactionScore: 4.7,
        aiHandledPercentage: 78
      })

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [loadData])

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedSession) return

    try {
      const newMessage: SupportMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        content: reply.trim(),
        timestamp: new Date(),
        type: 'text'
      }

      // Update local state
      setSelectedSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        updatedAt: new Date()
      } : null)

      setReply('')

      // In a real app, you would save this to Firestore
      console.log('Message sent:', newMessage)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredSessions = sessions.filter(session => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      session.messages.some(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Support Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage customer support with AI-powered assistance
            </p>
          </div>
          <Button onClick={loadData} variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalTickets}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-900">{stats.resolvedTickets}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Open</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.openTickets}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">AI Handled</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.aiHandledPercentage}%</p>
                </div>
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <Card className="lg:col-span-1 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Active Sessions
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedSession?.id === session.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                            {session.userId?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">User {session.userId}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {session.messages[session.messages.length - 1]?.content || 'No messages'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {session.messages.length} messages
                      </Badge>
                      {session.messages.some(msg => msg.metadata?.isAI) && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Assisted
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Chat Session
                  {selectedSession && (
                    <Badge variant="outline" className="ml-2">
                      {selectedSession.id}
                    </Badge>
                  )}
                </div>
                {selectedSession && (
                  <div className="flex items-center gap-2">
                    <Select defaultValue="agent-1">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent-1">Agent 1</SelectItem>
                        <SelectItem value="agent-2">Agent 2</SelectItem>
                        <SelectItem value="agent-3">Agent 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {selectedSession ? (
                <div className="flex flex-col h-96">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedSession.messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-2`}
                      >
                        <div className="flex items-start gap-2 max-w-[80%]">
                          {message.sender !== "user" && (
                            <Avatar className="h-6 w-6 mt-1">
                              <AvatarImage src={message.sender === "ai" ? "/ai-avatar.png" : "/agent-sarah.jpg"} />
                              <AvatarFallback className={message.sender === "ai" ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-green-500"}>
                                {message.sender === "ai" ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className="flex flex-col">
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                message.sender === "user" 
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                                  : message.sender === "ai"
                                  ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                                  : "bg-gray-100"
                              }`}
                            >
                              {message.sender === "ai" && (
                                <div className="flex items-center gap-1 mb-1">
                                  <Sparkles className="h-3 w-3 text-blue-600" />
                                  <span className="text-xs text-blue-600 font-medium">AI Assistant</span>
                                  {message.metadata?.confidence && (
                                    <Badge variant="secondary" className="text-xs h-4 px-1">
                                      {Math.round(message.metadata.confidence * 100)}%
                                    </Badge>
                                  )}
                                </div>
                              )}
                              
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                          
                          {message.sender === "user" && (
                            <Avatar className="h-6 w-6 mt-1">
                              <AvatarFallback className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                                {selectedSession.userId?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Type your reply..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendReply} disabled={!reply.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        Press Enter to send
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a session to start chatting</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tickets Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Recent Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-medium">{ticket.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        User {ticket.userId} • {ticket.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
