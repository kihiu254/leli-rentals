// Simple AI support service using localStorage
// This provides immediate functionality while we can later upgrade to Firebase

export interface SupportMessage {
  id: string
  sender: 'user' | 'agent' | 'ai'
  content: string
  timestamp: Date
  type: 'text' | 'system' | 'file' | 'quick-reply'
  metadata?: {
    isAI?: boolean
    confidence?: number
    suggestedActions?: string[]
    category?: string
  }
}

export interface AIResponse {
  message: string
  confidence: number
  suggestedActions: string[]
  category: string
  quickReplies?: string[]
  shouldEscalate: boolean
}

export interface ChatSession {
  id: string
  userId?: string
  messages: SupportMessage[]
  status: 'active' | 'closed' | 'transferred'
  createdAt: Date
  updatedAt: Date
  metadata?: {
    userAgent?: string
    referrer?: string
    deviceType?: string
  }
}

class SimpleAISupportService {
  private getStorageKey(sessionId: string): string {
    return `leli_chat_session_${sessionId}`
  }

  // Generate AI response based on user message
  async generateAIResponse(userMessage: string, context?: SupportMessage[]): Promise<AIResponse> {
    // Simulate AI processing with realistic response patterns
    const message = userMessage.toLowerCase()
    
    // Category detection
    let category = 'general'
    let confidence = 0.7
    let suggestedActions: string[] = []
    let quickReplies: string[] = []
    let shouldEscalate = false

    // Payment/Billing issues
    if (message.includes('payment') || message.includes('billing') || message.includes('charge') || message.includes('refund')) {
      category = 'billing'
      confidence = 0.9
      suggestedActions = ['Check payment history', 'Process refund', 'Update payment method']
      quickReplies = ['I need help with a refund', 'My payment was declined', 'I was charged twice']
    }
    
    // Account issues
    else if (message.includes('account') || message.includes('login') || message.includes('password') || message.includes('profile')) {
      category = 'account'
      confidence = 0.85
      suggestedActions = ['Reset password', 'Verify account', 'Update profile']
      quickReplies = ['I can\'t log in', 'I forgot my password', 'Update my profile']
    }
    
    // Booking issues
    else if (message.includes('book') || message.includes('rental') || message.includes('reserve') || message.includes('cancel')) {
      category = 'booking'
      confidence = 0.9
      suggestedActions = ['Create a listing', 'Help with booking', 'Cancel reservation']
      quickReplies = ['How do I book an item?', 'I want to cancel my booking', 'I need help with my reservation']
    }
    
    // Technical issues
    else if (message.includes('technical') || message.includes('bug') || message.includes('error') || message.includes('problem')) {
      category = 'technical'
      confidence = 0.8
      suggestedActions = ['Report bug', 'Technical support', 'System diagnostics']
      quickReplies = ['The app is not working', 'I\'m getting an error', 'Something is broken']
    }
    
    // General help
    else if (message.includes('help') || message.includes('support') || message.includes('question')) {
      category = 'general'
      confidence = 0.6
      suggestedActions = ['Browse FAQ', 'Contact support', 'Live chat']
      quickReplies = ['I need general help', 'How does this work?', 'What can you help me with?']
    }

    // Generate response based on category
    let responseMessage = ''
    
    switch (category) {
      case 'billing':
        responseMessage = "I can help you with payment and billing issues. I can check your payment history, process refunds, or help you update your payment method. What specific billing issue are you experiencing?"
        break
      case 'account':
        responseMessage = "I can assist you with account-related issues like login problems, password resets, or profile updates. Let me know what account issue you're facing and I'll help you resolve it."
        break
      case 'booking':
        responseMessage = "I'm here to help with all your booking needs! I can help you create listings, make reservations, or cancel bookings. What would you like to do with your rental?"
        break
      case 'technical':
        responseMessage = "I can help troubleshoot technical issues you're experiencing. I can report bugs, run system diagnostics, or connect you with our technical support team. What technical problem are you facing?"
        break
      default:
        responseMessage = "Hello! I'm Sarah, your AI-powered support assistant. I can help you with bookings, payments, account issues, and more. If I can't solve your problem, I'll connect you with a human agent. How can I assist you today?"
    }

    return {
      message: responseMessage,
      confidence,
      suggestedActions,
      category,
      quickReplies,
      shouldEscalate
    }
  }

  // Get chat session from localStorage
  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const data = localStorage.getItem(this.getStorageKey(sessionId))
      if (!data) return null
      
      const session = JSON.parse(data)
      // Convert timestamp strings back to Date objects
      session.createdAt = new Date(session.createdAt)
      session.updatedAt = new Date(session.updatedAt)
      session.messages = session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
      
      return session
    } catch (error) {
      console.error('Error getting chat session:', error)
      return null
    }
  }

  // Create chat session
  async createChatSession(sessionId: string, userId?: string): Promise<ChatSession> {
    try {
      const newSession: ChatSession = {
        id: sessionId,
        userId,
        messages: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
          referrer: typeof window !== 'undefined' ? document.referrer : undefined,
          deviceType: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'mobile' : 'desktop') : 'desktop'
        }
      }

      localStorage.setItem(this.getStorageKey(sessionId), JSON.stringify(newSession))
      return newSession
    } catch (error) {
      console.error('Error creating chat session:', error)
      throw new Error('Failed to create chat session')
    }
  }

  // Add message to session
  async addMessage(sessionId: string, message: Omit<SupportMessage, 'id' | 'timestamp'>): Promise<void> {
    try {
      const newMessage: SupportMessage = {
        ...message,
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date()
      }

      // Check if session exists, create if it doesn't
      let session = await this.getChatSession(sessionId)
      if (!session) {
        // Create new session
        session = await this.createChatSession(sessionId, message.sender === 'user' ? 'user' : undefined)
      }

      // Add message to session
      session.messages.push(newMessage)
      session.updatedAt = new Date()

      // Save back to localStorage
      localStorage.setItem(this.getStorageKey(sessionId), JSON.stringify(session))
    } catch (error) {
      console.error('Error adding message:', error)
      throw new Error('Failed to add message')
    }
  }

  // Get user's chat sessions
  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      const sessions: ChatSession[] = []
      
      // Get all localStorage keys that start with our prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('leli_chat_session_')) {
          const session = await this.getChatSession(key.replace('leli_chat_session_', ''))
          if (session && session.userId === userId) {
            sessions.push(session)
          }
        }
      }
      
      return sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    } catch (error) {
      console.error('Error getting user chat sessions:', error)
      return []
    }
  }

  // Close chat session
  async closeChatSession(sessionId: string): Promise<void> {
    try {
      const session = await this.getChatSession(sessionId)
      if (session) {
        session.status = 'closed'
        session.updatedAt = new Date()
        localStorage.setItem(this.getStorageKey(sessionId), JSON.stringify(session))
      }
    } catch (error) {
      console.error('Error closing chat session:', error)
    }
  }
}

export const simpleAISupportService = new SimpleAISupportService()
