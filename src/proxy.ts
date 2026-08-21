import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /admin routes
  if (pathname.startsWith('/(admin)') || pathname.startsWith('/dashboard') || 
      pathname.startsWith('/orders') || pathname.startsWith('/invitations') ||
      pathname.startsWith('/templates') || pathname.startsWith('/payments') ||
      pathname.startsWith('/reports')) {
    
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/orders/:path*',
    '/invitations/:path*',
    '/templates/:path*',
    '/payments/:path*',
    '/reports/:path*',
  ],
}
