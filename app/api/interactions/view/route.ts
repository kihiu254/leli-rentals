import { NextRequest, NextResponse } from 'next/server'
import { interactionsService } from '@/lib/interactions-service'
import { auth } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { listingId, metadata } = await request.json()
    
    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 })
    }

    // Get user from token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid

    await interactionsService.trackView(userId, listingId, metadata)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in view API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
