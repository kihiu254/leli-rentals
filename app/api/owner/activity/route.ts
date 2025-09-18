import { NextRequest, NextResponse } from 'next/server'
import { ownerDashboardService } from '@/lib/owner-dashboard-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    const limit = searchParams.get('limit') || '10'
    
    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      )
    }
    
    const activities = await ownerDashboardService.getOwnerActivity(ownerId, parseInt(limit))
    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching owner activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch owner activity' },
      { status: 500 }
    )
  }
}
