import { NextRequest, NextResponse } from 'next/server'
import { ownerDashboardService } from '@/lib/owner-dashboard-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      )
    }
    
    // Add timeout to prevent hanging during build
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000)
    })
    
    const bookingsPromise = ownerDashboardService.getOwnerBookings(ownerId)
    
    const bookings = await Promise.race([bookingsPromise, timeoutPromise])
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching owner bookings:', error)
    
    // Return empty array instead of error during build
    if (process.env.NODE_ENV === 'production' && error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json([])
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch owner bookings' },
      { status: 500 }
    )
  }
}
