"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  Bot,
  User,
  Sparkles,
  Zap,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  Mic,
  MicOff,
  Loader2
} from "lucide-react"
import { aiSupportService, SupportMessage, AIResponse, ChatSession } from "@/lib/ai-support-service"
import { simpleAISupportService } from "@/lib/simple-ai-support-service"
import { useAuthContext } from "@/components/auth-provider"

interface AISupportChatProps {
  isOpen: boolean
  onToggle: () => void
}

export default function AISupportChat({ isOpen, onToggle }: AISupportChatProps) {
  const { user } = useAuthContext()
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [agentStatus, setAgentStatus] = useState<"online" | "away" | "busy">("online")
  const [sessionId, setSessionId] = useState<string>("")
  const [isAIResponding, setIsAIResponding] = useState(false)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [suggestedActions, setSuggestedActions] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setNewMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  // Initialize chat session
  useEffect(() => {
    const initializeSession = async () => {
      if (!sessionId) {
        const newSessionId = `sess-${Date.now()}-${Math.floor(Math.random() * 10000)}`
        setSessionId(newSessionId)
        
        // Create initial session
        await aiSupportService.saveChatSession({
          userId: user?.id || 'anonymous',
          messages: [],
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            userAgent: navigator.userAgent,
            deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
          }
        })

        // Add welcome message from Sarah
        const welcomeMessage: SupportMessage = {
          id: `welcome-${Date.now()}`,
          sender: 'agent',
          content: "👋 Hi! I'm Sarah, your AI-powered support assistant. I can help you with bookings, payments, account issues, and more. If I can't solve your problem, I'll connect you with a human agent. How can I assist you today?",
          timestamp: new Date(),
          type: 'text',
          metadata: {
            isAI: true,
            confidence: 1.0,
            suggestedActions: ['Create a listing', 'Help with booking', 'Account support', 'Payment issues'],
            category: 'general'
          }
        }

        setMessages([welcomeMessage])
        setSuggestedActions(['Create a listing', 'Help with booking', 'Account support'])
        setQuickReplies(['I need help with booking', 'Account issues', 'Payment problems', 'Technical support'])
      }
    }

    if (isOpen) {
      initializeSession()
    }
  }, [isOpen, user, sessionId])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleAIResponse = useCallback(async (userMessage: string) => {
    setIsAIResponding(true)
    setIsTyping(true)

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

      let aiResponse: AIResponse
      try {
        aiResponse = await aiSupportService.generateAIResponse(userMessage, messages)
      } catch (error) {
        console.error('Firebase error, using fallback:', error)
        // Fallback to simple service
        aiResponse = await simpleAISupportService.generateAIResponse(userMessage, messages)
      }
      
      const aiMessage: SupportMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: aiResponse.message,
        timestamp: new Date(),
        type: 'text',
        metadata: {
          isAI: true,
          confidence: aiResponse.confidence,
          suggestedActions: aiResponse.suggestedActions,
          category: aiResponse.category
        }
      }

      setMessages(prev => [...prev, aiMessage])
      setSuggestedActions(aiResponse.suggestedActions)
      setQuickReplies(aiResponse.quickReplies || [])

      // Save AI message to session
      if (sessionId) {
        try {
          await aiSupportService.addMessage(sessionId, aiMessage)
        } catch (error) {
          console.error('Firebase error, using fallback:', error)
          // Fallback to simple service
          await simpleAISupportService.addMessage(sessionId, aiMessage)
        }
      }

      // If escalation is needed, add human agent message
      if (aiResponse.shouldEscalate) {
        setTimeout(() => {
          const escalationMessage: SupportMessage = {
            id: `escalation-${Date.now()}`,
            sender: 'agent',
            content: "I've escalated your request to our human support team. A specialist will be with you shortly to provide more detailed assistance. In the meantime, is there anything else I can help you with?",
            timestamp: new Date(),
            type: 'text',
            metadata: {
              isAI: false,
              confidence: 1.0
            }
          }
          setMessages(prev => [...prev, escalationMessage])
          setAgentStatus('online')
        }, 2000)
      }

    } catch (error) {
      console.error('Error generating AI response:', error)
      const errorMessage: SupportMessage = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our human support team.",
        timestamp: new Date(),
        type: 'text',
        metadata: {
          isAI: true,
          confidence: 0.5
        }
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsAIResponding(false)
      setIsTyping(false)
    }
  }, [messages])

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim()) return

    const userMessage: SupportMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage("")

    // Save message to session
    if (sessionId) {
      try {
        await aiSupportService.addMessage(sessionId, userMessage)
      } catch (error) {
        console.error('Firebase error, using fallback:', error)
        // Fallback to simple service
        await simpleAISupportService.addMessage(sessionId, userMessage)
      }
    }

    // Generate AI response
    await handleAIResponse(userMessage.content)
  }, [newMessage, sessionId, handleAIResponse])

  const handleQuickReply = useCallback((reply: string) => {
    setNewMessage(reply)
  }, [])

  const handleSuggestedAction = useCallback((action: string) => {
    const actionMessage = `I need help with: ${action}`
    setNewMessage(actionMessage)
  }, [])

  const startVoiceInput = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }, [isListening])

  const stopVoiceInput = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  const handleFeedback = useCallback((messageId: string, positive: boolean) => {
    // In a real app, this would send feedback to the AI system
    console.log(`Feedback for message ${messageId}: ${positive ? 'positive' : 'negative'}`)
  }, [])

  if (!isOpen) {
    return (
      <Button 
        onClick={onToggle} 
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 animate-pulse transition-all duration-300 hover:scale-110"
        size="icon"
        aria-label="Open AI Support Chat"
      >
        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-full max-w-xs sm:max-w-sm md:w-80 h-[400px] sm:h-[450px] md:h-[500px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300 sm:bottom-6 sm:right-6">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <Avatar className="h-6 w-6 sm:h-7 sm:w-7">
                <AvatarImage src="/placeholder-user.jpg" alt="Sarah - AI Support" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full border border-white animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xs flex items-center gap-1 truncate">
                <span className="truncate">Sarah - AI Support</span>
                <Sparkles className="h-2 w-2 flex-shrink-0" />
              </CardTitle>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <span className="text-xs opacity-90 truncate">Online • AI</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7 text-white hover:bg-white/20"
              onClick={() => window.open("tel:+2540112081866", "_self")}
              aria-label="Call Support"
            >
              <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7 text-white hover:bg-white/20 hidden sm:flex"
              aria-label="Video Call"
            >
              <Video className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? "Maximize Chat" : "Minimize Chat"}
            >
              {isMinimized ? <Maximize2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Minimize2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7 text-white hover:bg-white/20"
              onClick={onToggle}
              aria-label="Close Chat"
            >
              <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          {/* Quick Replies */}
          {quickReplies.length > 0 && (
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 sm:h-7 px-2 sm:px-3 animate-in fade-in-0 slide-in-from-left-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Actions */}
          {suggestedActions.length > 0 && (
            <div className="p-2 sm:p-3 bg-gray-50 border-b">
              <div className="text-xs text-muted-foreground mb-1 sm:mb-2 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Suggested Actions
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {suggestedActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-5 sm:h-6 px-2 sm:px-3 bg-white hover:bg-blue-50 animate-in fade-in-0 slide-in-from-right-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleSuggestedAction(action)}
                  >
                    <ArrowUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <CardContent className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-2`}
              >
                <div className="flex items-start gap-1 sm:gap-2 max-w-[85%] sm:max-w-[80%]">
                  {message.sender !== "user" && (
                    <Avatar className="h-6 w-6 mt-1">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500">
                        <Bot className="h-3 w-3" />
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
                      {(message.sender === "ai" || message.sender === "agent") && (
                        <div className="flex items-center gap-1 mb-1">
                          <Sparkles className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">Sarah</span>
                          {message.metadata?.confidence && (
                            <Badge variant="secondary" className="text-xs h-4 px-1">
                              {Math.round(message.metadata.confidence * 100)}%
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        
                        {message.sender === "ai" && message.metadata?.isAI && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 hover:bg-green-100"
                              onClick={() => handleFeedback(message.id, true)}
                            >
                              <ThumbsUp className="h-3 w-3 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 hover:bg-red-100"
                              onClick={() => handleFeedback(message.id, false)}
                            >
                              <ThumbsDown className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {message.sender === "user" && (
                    <Avatar className="h-6 w-6 mt-1">
                      <AvatarFallback className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {(isTyping || isAIResponding) && (
              <div className="flex justify-start animate-in fade-in-0">
                <div className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500">
                      <Bot className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      {isAIResponding ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                          <span className="text-xs text-blue-600">Sarah is thinking...</span>
                        </>
                      ) : (
                        <>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          </div>
                          <span className="text-xs text-muted-foreground">Sarah is typing...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-2 sm:p-3 border-t bg-white">
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 sm:h-6 sm:w-6"
                onClick={isListening ? stopVoiceInput : startVoiceInput}
              >
                {isListening ? (
                  <MicOff className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-600 animate-pulse" />
                ) : (
                  <Mic className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6 hidden sm:flex">
                <Paperclip className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
              
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-xs sm:text-sm h-6 sm:h-8"
                disabled={isAIResponding}
              />
              
              <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6 hidden sm:flex">
                <Smile className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
              
              <Button 
                onClick={sendMessage} 
                size="icon" 
                className="h-5 w-5 sm:h-6 sm:w-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!newMessage.trim() || isAIResponding}
              >
                <Send className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-1 sm:mt-2">
              <p className="text-xs text-muted-foreground hidden sm:block">
                {isListening ? "Listening..." : "Sarah AI • Instant responses with human escalation"}
              </p>
              <p className="text-xs text-muted-foreground sm:hidden">
                {isListening ? "Listening..." : "Sarah AI"}
              </p>
              <div className="flex items-center gap-1">
                <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium hidden sm:inline">AI Enhanced</span>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
