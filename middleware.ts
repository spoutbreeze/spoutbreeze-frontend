import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Helper function to check if user is authenticated by checking for access_token cookie
function isAuthenticated(request: NextRequest): boolean {
  const accessToken = request.cookies.get('access_token')
  return !!accessToken?.value
}

// Helper function to check if user has a refresh token (partial auth state)
function hasRefreshToken(request: NextRequest): boolean {
  const refreshToken = request.cookies.get('refresh_token')
  return !!refreshToken?.value
}

// Define protected and public routes
const protectedRoutes = ['/home', '/settings']
const authRoutes = ['/auth/callback']
const publicRoutes = ['/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = isAuthenticated(request)
  const hasRefresh = hasRefreshToken(request)

  // Skip middleware for static files, API routes, and Next.js internal routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }

  // Handle auth callback route (allow regardless of auth state)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Handle join routes (public access for events)
  if (pathname.startsWith('/join/')) {
    return NextResponse.next()
  }

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  )

  // Check if current path is the public home route
  const isPublicRoute = publicRoutes.some(route => pathname === route)

  // Authentication logic
  if (isProtectedRoute) {
    // Protected route accessed without authentication
    if (!isAuth) {
      // If user has refresh token, let the app handle refresh
      if (hasRefresh) {
        return NextResponse.next()
      }
      
      // No tokens at all, redirect to home
      const redirectUrl = new URL('/', request.url)
      const response = NextResponse.redirect(redirectUrl)
      
      // Add a header to indicate why the redirect happened
      response.headers.set('x-middleware-redirect-reason', 'unauthenticated')
      return response
    }
    
    // User is authenticated, allow access to protected route
    return NextResponse.next()
  }

  if (isPublicRoute) {
    // Public route (/) accessed by authenticated user
    if (isAuth) {
      // Redirect authenticated users to /home
      const redirectUrl = new URL('/home', request.url)
      const response = NextResponse.redirect(redirectUrl)
      
      // Add a header to indicate why the redirect happened
      response.headers.set('x-middleware-redirect-reason', 'already-authenticated')
      return response
    }
    
    // Unauthenticated user on public route, allow access
    return NextResponse.next()
  }

  // For any other routes, just continue
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public).*)',
  ],
}