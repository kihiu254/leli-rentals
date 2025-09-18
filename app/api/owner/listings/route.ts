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
    
    const listings = await ownerDashboardService.getOwnerListings(ownerId)
    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching owner listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch owner listings' },
      { status: 500 }
    )
  }
}
