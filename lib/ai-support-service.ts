import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore"
import { db } from "./firebase"

export interface SupportTicket {
  id?: string
  userId: string
  sessionId: string
  subject: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  messages: SupportMessage[]
  createdAt: Date
  updatedAt: Date
  assignedTo?: string
  tags?: string[]
  satisfaction?: number
}

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

// AI-powered response generation
export const aiSupportService = {
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
      suggestedActions = ['View booking details', 'Modify booking', 'Cancel booking']
      quickReplies = ['I want to cancel my booking', 'I need to change dates', 'I can\'t find my booking']
    }
    
    // Listing issues
    else if (message.includes('listing') || message.includes('item') || message.includes('photos') || message.includes('price')) {
      category = 'listing'
      confidence = 0.85
      suggestedActions = ['Edit listing', 'Add photos', 'Update pricing']
      quickReplies = ['My listing isn\'t showing', 'I need to edit my listing', 'How do I add photos?']
    }
    
    // Technical issues
    else if (message.includes('error') || message.includes('bug') || message.includes('loading') || message.includes('website')) {
      category = 'technical'
      confidence = 0.8
      suggestedActions = ['Clear cache', 'Try different browser', 'Report bug']
      quickReplies = ['The website is slow', 'I\'m getting an error', 'Something isn\'t working']
    }

    // Generate contextual response
    let aiMessage = this.generateContextualResponse(message, category, context)

    // Check if escalation is needed
    if (message.includes('urgent') || message.includes('emergency') || confidence < 0.5) {
      shouldEscalate = true
      aiMessage += "\n\nI'm connecting you with a human support agent who can provide more specialized assistance."
    }

    return {
      message: aiMessage,
      confidence,
      suggestedActions,
      category,
      quickReplies,
      shouldEscalate
    }
  },

  // Generate contextual responses
  generateContextualResponse(message: string, category: string, context?: SupportMessage[]): string {
    const responses = {
      billing: [
        "I can help you with billing and payment issues. Let me look into your account details.",
        "I understand you're having payment concerns. I'll check your transaction history and help resolve this.",
        "For billing inquiries, I can assist you with refunds, payment methods, and transaction details."
      ],
      account: [
        "I'll help you with your account settings and login issues. Let me guide you through this.",
        "I can assist with account verification, password resets, and profile updates.",
        "For account-related questions, I'm here to help you get back on track."
      ],
      booking: [
        "I can help you manage your bookings and rental reservations. Let me check your current bookings.",
        "For booking assistance, I can help with modifications, cancellations, and new reservations.",
        "I'll help you with your rental bookings and ensure everything is set up correctly."
      ],
      listing: [
        "I can assist you with your listings and help optimize them for better visibility.",
        "For listing support, I can help with photos, descriptions, pricing, and visibility settings.",
        "I'll help you create and manage your rental listings effectively."
      ],
      technical: [
        "I can help troubleshoot technical issues. Let me guide you through some solutions.",
        "For technical problems, I'll help you resolve them quickly and efficiently.",
        "I can assist with website issues, bugs, and technical difficulties."
      ],
      general: [
        "I'm here to help! How can I assist you today?",
        "I'd be happy to help you with any questions or concerns you might have.",
        "What can I do to help you today?"
      ]
    }

    const categoryResponses = responses[category as keyof typeof responses] || responses.general
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
  },

  // Save chat session
  async saveChatSession(session: Omit<ChatSession, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'chatSessions'), {
        ...session,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error saving chat session:', error)
      throw new Error('Failed to save chat session')
    }
  },

  // Get chat session
  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const q = query(
        collection(db, 'chatSessions'),
        where('id', '==', sessionId)
      )
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) return null
      
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as ChatSession
    } catch (error) {
      console.error('Error getting chat session:', error)
      return null
    }
  },

  // Add message to session
  async addMessage(sessionId: string, message: Omit<SupportMessage, 'id' | 'timestamp'>): Promise<void> {
    try {
      const newMessage: SupportMessage = {
        ...message,
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date()
      }

      // Update the session with the new message
      const sessionRef = doc(db, 'chatSessions', sessionId)
      await updateDoc(sessionRef, {
        messages: [...(await this.getChatSession(sessionId))?.messages || [], newMessage],
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error adding message:', error)
      throw new Error('Failed to add message')
    }
  },

  // Create support ticket
  async createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'supportTickets'), {
        ...ticket,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating support ticket:', error)
      throw new Error('Failed to create support ticket')
    }
  },

  // Get user's support tickets
  async getUserTickets(userId: string): Promise<SupportTicket[]> {
    try {
      const q = query(
        collection(db, 'supportTickets'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        messages: doc.data().messages?.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp?.toDate() || new Date()
        })) || []
      })) as SupportTicket[]
    } catch (error) {
      console.error('Error getting user tickets:', error)
      return []
    }
  },

  // Get all support tickets (for admin)
  async getAllTickets(): Promise<SupportTicket[]> {
    try {
      const q = query(
        collection(db, 'supportTickets'),
        orderBy('updatedAt', 'desc'),
        limit(100)
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        messages: doc.data().messages?.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp?.toDate() || new Date()
        })) || []
      })) as SupportTicket[]
    } catch (error) {
      console.error('Error getting all tickets:', error)
      return []
    }
  },

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: SupportTicket['status']): Promise<void> {
    try {
      const ticketRef = doc(db, 'supportTickets', ticketId)
      await updateDoc(ticketRef, {
        status,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating ticket status:', error)
      throw new Error('Failed to update ticket status')
    }
  },

  // Get FAQ suggestions based on message
  async getFAQSuggestions(message: string): Promise<any[]> {
    const faqs = [
      {
        id: 'faq-1',
        question: 'How do I create my first listing?',
        answer: 'To create your first listing, go to your profile and click "Create Listing". Fill in the details about your item, add photos, set your price, and publish.',
        category: 'listing',
        keywords: ['create', 'listing', 'first', 'new', 'add', 'item']
      },
      {
        id: 'faq-2',
        question: 'What are the fees for using Leli Rentals?',
        answer: 'Leli Rentals charges a small service fee on each successful booking. The fee is typically 5-10% of the rental amount.',
        category: 'billing',
        keywords: ['fee', 'cost', 'price', 'charge', 'billing', 'payment']
      },
      {
        id: 'faq-3',
        question: 'How do I verify my account?',
        answer: 'Account verification helps build trust with other users. You can verify your account by providing a valid ID, phone number, and email address.',
        category: 'account',
        keywords: ['verify', 'verification', 'account', 'trust', 'id']
      },
      {
        id: 'faq-4',
        question: 'How do I book an item?',
        answer: 'Browse our listings, find an item you like, and click "Book Now". Select your rental dates, review the terms, and complete the payment.',
        category: 'booking',
        keywords: ['book', 'booking', 'rent', 'rental', 'reserve']
      },
      {
        id: 'faq-5',
        question: 'What payment methods are accepted?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital wallets like PayPal and Apple Pay.',
        category: 'billing',
        keywords: ['payment', 'card', 'paypal', 'apple pay', 'method']
      }
    ]

    const messageWords = message.toLowerCase().split(' ')
    const suggestions = faqs.filter(faq => 
      faq.keywords.some(keyword => 
        messageWords.some(word => word.includes(keyword))
      )
    )

    return suggestions.slice(0, 3) // Return top 3 matches
  }
}
