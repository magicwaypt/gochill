"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GestaotpowerLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/gestaotpower/admin")
        }, 1000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Credenciais inválidas")
      }
    } catch (error) {
      console.error('Login error:', error)
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-900 to-black px-4">
      <div className="w-full max-w-md bg-white/6 backdrop-blur-sm rounded-lg border border-white/10 p-8 shadow-lg">
        <h1 className="text-2xl font-extrabold text-white mb-2">Gestão TPower</h1>
        <p className="text-sm text-white/80 mb-6">Entrar para aceder ao painel de gestão.</p>

        {success ? (
          <div className="p-4 bg-green-800/60 rounded">
            <p className="text-green-200 font-semibold">Sessão iniciada com sucesso.</p>
            <p className="text-sm text-white/80 mt-2">Agora podes aceder ao painel.</p>
            <div className="mt-4">
              <Link href="/" className="text-yellow-300 hover:underline">
                Voltar ao site
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-white/80">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="admin@tpower.pt"
              />
            </label>

            <label className="block">
              <span className="text-sm text-white/80">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="gochill2026"
              />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-yellow-400 text-red-900 font-bold px-6 py-2 hover:bg-yellow-300 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "A processar..." : "Entrar"}
              </button>

              <Link href="/" className="text-white/80 text-sm hover:underline">
                Voltar ao site
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

