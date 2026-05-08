import type { Metadata } from "next"

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
  return children
}
