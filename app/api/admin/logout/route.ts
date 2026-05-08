import { NextResponse } from 'next/server'

import {
  ADMIN_SESSION_COOKIE,
  LEGACY_ADMIN_SESSION_COOKIE,
  getAdminCookieClearOptions,
  shouldUseSecureAdminCookie,
} from '@/lib/admin-auth'

export async function GET(request: Request) {
  const redirectUrl = new URL('/gestaotpower', request.url)
  const response = NextResponse.redirect(redirectUrl)

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    ...getAdminCookieClearOptions(redirectUrl.hostname),
  })

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: shouldUseSecureAdminCookie(redirectUrl.hostname),
    path: '/',
    maxAge: 0,
  })

  response.cookies.set({
    name: LEGACY_ADMIN_SESSION_COOKIE,
    value: '',
    ...getAdminCookieClearOptions(redirectUrl.hostname),
  })

  response.cookies.set({
    name: LEGACY_ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: shouldUseSecureAdminCookie(redirectUrl.hostname),
    path: '/',
    maxAge: 0,
  })

  return response
}