import { NextRequest, NextResponse } from 'next/server'

// Simple authentication - in production use proper JWT or session management
const ADMIN_CREDENTIALS = {
  email: 'admin@tpower.pt',
  password: 'gochill2026'
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // In production, you'd create a proper session/token here
      return NextResponse.json({
        success: true,
        message: 'Autenticação bem-sucedida'
      })
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