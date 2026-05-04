import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Shield, Users, BarChart3 } from "lucide-react"

export const metadata: Metadata = {
  title: "Backoffice - Gestão Go Chill | TPower",
  description: "Painel de administração para gestão das participações do passatempo Go Chill",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/gestaotpower/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900">Go Chill Admin</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/gestaotpower/admin"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Participações
                </Link>
                <Link
                  href="/gestaotpower/admin/stats"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Estatísticas
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-600 hover:text-slate-900 text-sm">
                Ver Site
              </Link>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href="/gestaotpower" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sair
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>© 2026 Go Chill - Backoffice TPower</p>
            <p>Passatempo válido até 3 de junho de 2026</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
