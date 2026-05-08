import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { LogOut, Shield } from "lucide-react"

import { AdminNav } from "@/components/admin/admin-nav"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Backoffice - Gestão Go Chill | TPower",
  description: "Painel de administração para gestão das participações do passatempo Go Chill",
  robots: "noindex, nofollow",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
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

              <Suspense fallback={null}>
                <AdminNav />
              </Suspense>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-600 hover:text-slate-900 text-sm">
                Ver Site
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link href="/api/admin/logout" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sair
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

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