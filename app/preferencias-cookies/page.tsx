"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function PreferenciasCookiesPage() {
  const [consent, setConsent] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent")
    setConsent(stored)
  }, [])

  const handleSave = (value: "accepted" | "rejected") => {
    localStorage.setItem("cookie_consent", value)
    setConsent(value)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <main className="min-h-screen bg-[#f8f5f2]">
      {/* Header */}
      <div className="bg-[#3d2314] py-4">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <Link href="/passatempogochill2026">
            <Image
              src="/images/logo.png"
              alt="Go Chill"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-[#3d2314] mb-2">
          Preferências de Cookies
        </h1>
        <p className="text-[#8b7355] mb-8 text-sm">
          Pode alterar as suas preferências de cookies a qualquer momento. Para mais informações, consulte a nossa{" "}
          <Link
            href="/politica_de_cookies.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#f47920] hover:text-[#e06810]"
          >
            Política de Cookies
          </Link>
          .
        </p>

        <div className="space-y-4">
          {/* Cookies Essenciais */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-5 bg-[#faf7f4]">
              <div>
                <p className="font-bold text-[#3d2314]">Cookies Essenciais</p>
                <p className="text-sm text-[#5a4a40] mt-0.5">
                  Necessários para o funcionamento do site. Não podem ser desativados.
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold bg-[#f47920]/10 text-[#f47920] px-3 py-1 rounded-full">
                Sempre ativos
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#5a4a40]">
                <thead>
                  <tr className="border-t border-[#e8ddd0] bg-[#f8f5f2] text-xs text-[#8b7355] uppercase tracking-wide">
                    <th className="text-left px-5 py-2 font-semibold">Cookie</th>
                    <th className="text-left px-5 py-2 font-semibold">Entidade Responsável</th>
                    <th className="text-left px-5 py-2 font-semibold">Descrição</th>
                    <th className="text-left px-5 py-2 font-semibold">Duração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ddd0]">
                  <tr>
                    <td className="px-5 py-3 font-mono text-xs text-[#3d2314]">cookie_consent</td>
                    <td className="px-5 py-3">Telephone Power – Marketing Directo, Lda.</td>
                    <td className="px-5 py-3">Guarda a preferência de cookies do utilizador neste site.</td>
                    <td className="px-5 py-3 whitespace-nowrap">1 ano</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-mono text-xs text-[#3d2314]">_grecaptcha</td>
                    <td className="px-5 py-3">Telephone Power – Marketing Directo, Lda.</td>
                    <td className="px-5 py-3">Estritamente necessário para proteção contra bots e spam.</td>
                    <td className="px-5 py-3 whitespace-nowrap">Sessão</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-mono text-xs text-[#3d2314]">lastExternalReferrer</td>
                    <td className="px-5 py-3">Telephone Power – Marketing Directo, Lda.</td>
                    <td className="px-5 py-3">Regista a origem externa da visita para funcionamento interno do site.</td>
                    <td className="px-5 py-3 whitespace-nowrap">Sessão</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-mono text-xs text-[#3d2314]">litespeed_docref</td>
                    <td className="px-5 py-3">Telephone Power – Marketing Directo, Lda.</td>
                    <td className="px-5 py-3">Utilizado pelo servidor para otimização de cache de páginas.</td>
                    <td className="px-5 py-3 whitespace-nowrap">Sessão</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cookies de Análise */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-5 bg-[#faf7f4]">
              <div>
                <p className="font-bold text-[#3d2314]">Cookies de Estatística / Análise</p>
                <p className="text-sm text-[#5a4a40] mt-0.5">
                  Permitem-nos compreender como os visitantes utilizam o site, de forma anónima. Pode aceitar ou recusar a sua utilização.
                </p>
              </div>
              <div className="shrink-0">
                {consent === "accepted" ? (
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">Aceites</span>
                ) : consent === "rejected" ? (
                  <span className="text-xs font-semibold bg-red-100 text-red-600 px-3 py-1 rounded-full">Recusados</span>
                ) : (
                  <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Não definido</span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#5a4a40]">
                <thead>
                  <tr className="border-t border-[#e8ddd0] bg-[#f8f5f2] text-xs text-[#8b7355] uppercase tracking-wide">
                    <th className="text-left px-5 py-2 font-semibold">Cookie</th>
                    <th className="text-left px-5 py-2 font-semibold">Entidade Responsável</th>
                    <th className="text-left px-5 py-2 font-semibold">Descrição</th>
                    <th className="text-left px-5 py-2 font-semibold">Duração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ddd0]">
                  <tr>
                    <td className="px-5 py-3 font-mono text-xs text-[#3d2314]">_ga</td>
                    <td className="px-5 py-3">Telephone Power – Marketing Directo, Lda.</td>
                    <td className="px-5 py-3">Utilizado pelo Google Analytics para distinguir utilizadores únicos e recolher dados sobre o uso do site. Não identifica o utilizador pessoalmente.</td>
                    <td className="px-5 py-3 whitespace-nowrap">365 dias</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-mono text-xs text-[#3d2314]">_ga_DBJS8ZX4NL</td>
                    <td className="px-5 py-3">Telephone Power – Marketing Directo, Lda.</td>
                    <td className="px-5 py-3">Utilizado pelo Google Analytics para persistir o estado da sessão e acompanhar a navegação do utilizador.</td>
                    <td className="px-5 py-3 whitespace-nowrap">365 dias</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-mono text-xs text-[#3d2314]">lastExternalReferrerTime</td>
                    <td className="px-5 py-3">Telephone Power – Marketing Directo, Lda.</td>
                    <td className="px-5 py-3">Regista o timestamp da última visita com origem externa, para fins estatísticos.</td>
                    <td className="px-5 py-3 whitespace-nowrap">365 dias</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Botões de escolha */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleSave("accepted")}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-colors ${
              consent === "accepted"
                ? "bg-[#3d2314] text-white"
                : "bg-[#f47920] hover:bg-[#e06810] text-white"
            }`}
          >
            {consent === "accepted" ? "✓ Preferência atual: Aceitar" : "Aceitar todos os cookies"}
          </button>
          <button
            onClick={() => handleSave("rejected")}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm border transition-colors ${
              consent === "rejected"
                ? "bg-[#3d2314] text-white border-[#3d2314]"
                : "border-[#d4c4b0] text-[#5a4a40] hover:bg-[#f8f0e8]"
            }`}
          >
            {consent === "rejected" ? "✓ Preferência atual: Recusar" : "Recusar cookies opcionais"}
          </button>
        </div>

        {saved && (
          <p className="mt-4 text-center text-sm text-green-700 font-semibold">
            As suas preferências foram guardadas.
          </p>
        )}

        <div className="mt-8">
          <Link href="/passatempogochill2026" className="text-[#f47920] hover:underline font-medium text-sm">
            ← Voltar à página do passatempo
          </Link>
        </div>
      </div>
    </main>
  )
}
