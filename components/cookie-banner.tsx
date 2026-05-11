"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getCookieConsent, persistCookieConsent } from '@/lib/cookie-consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getCookieConsent()
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    persistCookieConsent("accepted")
    setVisible(false)
  }

  const reject = () => {
    persistCookieConsent("rejected")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#3d2314] text-white shadow-2xl">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-white/90 flex-1">
          Utilizamos cookies para melhorar a sua experiência no site. Ao continuar a navegar, aceita a nossa{" "}
          <Link
            href="/politica_de_cookies.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#f47920] hover:text-[#ffa040] font-semibold"
          >
            Política de Cookies
          </Link>
          . Caso pretenda alterar as suas preferências, pode fazê-lo a todo o tempo{" "}
          <Link
            href="/preferencias-cookies"
            className="underline text-[#f47920] hover:text-[#ffa040] font-semibold"
          >
            aqui
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm border border-white/40 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
          >
            Rejeitar
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-sm bg-[#f47920] hover:bg-[#e06810] text-white font-semibold rounded-lg transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  )
}
