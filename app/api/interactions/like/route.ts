import { NextRequest, NextResponse } from 'next/server'
import { interactionsService } from '@/lib/interactions-service'
import { auth } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { listingId } = await request.json()
    
    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 })
    }

    // Get user from token (you'll need to implement this based on your auth system)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid

    const result = await interactionsService.toggleLike(userId, listingId)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in like API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
