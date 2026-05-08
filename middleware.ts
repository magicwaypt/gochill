import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import {
  ADMIN_SESSION_COOKIE,
  hasAuthenticatedAdminSessionInCookieHeader,
  isAuthenticatedAdminSession,
} from '@/lib/admin-auth'

const isProtectedAdminApiRoute = (pathname: string) =>
  pathname.startsWith('/api/admin/') && pathname !== '/api/admin/auth' && pathname !== '/api/admin/logout'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/gestaotpower/admin') && !isProtectedAdminApiRoute(pathname)) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const hasAuthenticatedCookieInHeader = hasAuthenticatedAdminSessionInCookieHeader(
    request.headers.get('cookie')
  )

  if (isAuthenticatedAdminSession(sessionCookie) || hasAuthenticatedCookieInHeader) {
    return NextResponse.next()
  }

  if (isProtectedAdminApiRoute(pathname)) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const loginUrl = new URL('/gestaotpower', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/gestaotpower/admin/:path*', '/api/admin/:path*'],
}