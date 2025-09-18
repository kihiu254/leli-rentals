import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get account type from cookies (we'll use cookies instead of localStorage for middleware)
  const accountType = request.cookies.get('userAccountType')?.value
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`Middleware: ${pathname} - Account Type: ${accountType || 'none'}`)
  }
  
  // Public routes that don't require account type selection
  const publicRoutes = [
    '/',
    '/listings',
    '/listings/[category]',
    '/listings/details/[id]',
    '/contact',
    '/about',
    '/privacy',
    '/terms',
    '/chat-privacy',
    '/signin',
    '/signup',
    '/get-started'
  ]
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => {
    if (route.includes('[') && route.includes(']')) {
      // Dynamic route - check if pathname matches pattern
      const pattern = route.replace(/\[.*?\]/g, '[^/]+')
      return new RegExp(`^${pattern}$`).test(pathname)
    }
    return pathname === route || pathname.startsWith(route + '/')
  })
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Protected routes that require account type
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/bookings',
    '/messages'
  ]
  
  // Special handling for messages route - allow access but redirect based on account type
  if (pathname.startsWith('/messages')) {
    if (!accountType) {
      const getStartedUrl = new URL('/get-started', request.url)
      return NextResponse.redirect(getStartedUrl)
    }
    // Allow access to messages regardless of account type
    return NextResponse.next()
  }
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // If it's a protected route and no account type is set, redirect to get-started
  if (isProtectedRoute && !accountType) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Middleware: Redirecting ${pathname} to /get-started (no account type)`)
    }
    const getStartedUrl = new URL('/get-started', request.url)
    return NextResponse.redirect(getStartedUrl)
  }
  
  // Owner-specific routes
  const ownerRoutes = [
    '/dashboard/owner',
    '/listings/create',
    '/listings/edit'
  ]
  
  const isOwnerRoute = ownerRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // If it's an owner route but user is a renter, redirect to listings
  if (isOwnerRoute && accountType === 'renter') {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Middleware: Redirecting ${pathname} to /listings (renter accessing owner route)`)
    }
    const listingsUrl = new URL('/listings', request.url)
    return NextResponse.redirect(listingsUrl)
  }
  
  // Renter-specific routes (if any)
  const renterRoutes = [
    '/dashboard/renter'
  ]
  
  const isRenterRoute = renterRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // If it's a renter route but user is an owner, redirect to owner dashboard
  if (isRenterRoute && accountType === 'owner') {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Middleware: Redirecting ${pathname} to /dashboard/owner (owner accessing renter route)`)
    }
    const ownerDashboardUrl = new URL('/dashboard/owner', request.url)
    return NextResponse.redirect(ownerDashboardUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
