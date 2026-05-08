import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_VALUE,
  LEGACY_ADMIN_SESSION_COOKIE,
  getAdminCookieClearOptions,
  shouldUseSecureAdminCookie,
} from '@/lib/admin-auth'

// Simple authentication - in production use proper JWT or session management
const ADMIN_CREDENTIALS = {
  email: 'admin@tpower.pt',
  password: 'gochill2026'
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const response = NextResponse.json({
        success: true,
        message: 'Autenticação bem-sucedida'
      })

      response.cookies.set({
        name: ADMIN_SESSION_COOKIE,
        value: '',
        ...getAdminCookieClearOptions(request.nextUrl.hostname),
      })

      response.cookies.set({
        name: ADMIN_SESSION_COOKIE,
        value: ADMIN_SESSION_VALUE,
        httpOnly: true,
        sameSite: 'lax',
        secure: shouldUseSecureAdminCookie(request.nextUrl.hostname),
        path: '/',
        maxAge: 60 * 60 * 12,
      })

      response.cookies.set({
        name: LEGACY_ADMIN_SESSION_COOKIE,
        value: '',
        ...getAdminCookieClearOptions(request.nextUrl.hostname),
      })

      response.cookies.set({
        name: LEGACY_ADMIN_SESSION_COOKIE,
        value: '',
        httpOnly: true,
        sameSite: 'lax',
        secure: shouldUseSecureAdminCookie(request.nextUrl.hostname),
        path: '/',
        maxAge: 0,
      })

      return response
    } else {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}