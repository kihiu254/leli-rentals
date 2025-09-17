"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, X, Minimize2, Maximize2, Phone, Video, Paperclip, Smile } from "lucide-react"

interface Message {
  id: string
  sender: "user" | "agent"
  content: string
  timestamp: Date
  type: "text" | "system"
}

interface SupportChatProps {
  isOpen: boolean
  onToggle: () => void
}

export default function SupportChat({ isOpen, onToggle }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "agent",
      content: "Hi! I'm Sarah from Leli Rentals support. How can I help you today?",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [agentStatus, setAgentStatus] = useState<"online" | "away" | "busy">("online")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate agent typing and responses
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === "user") {
      setIsTyping(true)
      const timer = setTimeout(
        () => {
          setIsTyping(false)
          const responses = [
            "I understand your concern. Let me help you with that right away.",
            "That's a great question! Here's what I can tell you...",
            "I'll look into that for you. One moment please.",
            "Thanks for reaching out! I'm here to help resolve this issue.",
            "Let me check our system for more information about that.",
          ]
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "agent",
              content: randomResponse,
              timestamp: new Date(),
              type: "text",
            },
          ])
        },
        2000 + Math.random() * 2000,
      )

      return () => clearTimeout(timer)
    }
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          content: newMessage,
          timestamp: new Date(),
          type: "text",
        },
      ])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={onToggle} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50" size="icon">
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/agent-sarah.jpg" alt="Sarah" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">Sarah - Support Agent</CardTitle>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    agentStatus === "online" ? "bg-green-500" : agentStatus === "away" ? "bg-yellow-500" : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-muted-foreground capitalize">{agentStatus}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open("tel:+2540112081866", "_self")}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              asChild
            >
              <a
                href="https://wa.me/254112081866?text=Hello%20I%20need%20assistance%20with%20a%20rental%20listing%20on%20Leli%20Rentals"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" className="h-4 w-4">
                  <path fill="currentColor" d="M20.5 3.5A11.9 11.9 0 0012 .5C6.8.5 2.4 3.9 1 8.8L.1 12l3.2-1.1A11.9 11.9 0 0012 23.5c5.2 0 9.6-3.4 11-8.3 1.4-4.9-.1-10.1-2.5-11.7zM12 21c-1.9 0-3.7-.5-5.3-1.4L5 19l1.4-1.1C6.1 16.7 6 15.3 6 14c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7zm3.4-9.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.9.8-1.1 1-.2.1-.4.1-.6 0-.7-.3-2.2-.8-3.8-2.3-1.4-1.4-1.8-2.9-2.1-3.6-.2-.6 0-.9.1-1 .1-.1.3-.2.5-.3.2-.1.4-.1.6 0 .2.1 1.1.5 1.8 1 .6.4.9.6 1.5.9.6.3 1 .2 1.4 0 .3-.2.8-.6 1.1-.8.3-.2.6-.1.9 0 .3.1 1 .4 1.2.5.2.1.4.3.5.6.1.2.1.4 0 .6-.1.2-.6.8-.8 1-.2.2-.4.4-.2.7.1.3.4.6.8 1 .4.3.8.7.9 1 .1.2.1.4 0 .6-.1.4-.5 1.1-.6 1.3-.2.3-.6.4-1 .2z"/>
                </svg>
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(!isMinimized)}>
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="h-4 w-4" />
              </Button>
              <Button onClick={sendMessage} size="icon" className="h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">Typically replies in a few minutes</p>
          </div>
        </>
      )}
    </Card>
  )
}
