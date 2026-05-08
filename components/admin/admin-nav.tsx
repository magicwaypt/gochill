"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { BarChart3, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getClientAdminHref } from "@/lib/admin-auth"

const navigationItems = [
  {
    href: "/gestaotpower/admin",
    label: "Participações",
    icon: Users,
  },
  {
    href: "/gestaotpower/admin?view=stats",
    label: "Estatísticas",
    icon: BarChart3,
  },
]

export function AdminNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentView = searchParams.get('view')

  const navigateTo = (href: string) => {
    window.location.assign(getClientAdminHref(href))
  }

  return (
    <nav className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/80 p-1">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isStatsItem = item.href.includes('view=stats')
        const isActive = isStatsItem
          ? pathname === '/gestaotpower/admin' && currentView === 'stats'
          : pathname === '/gestaotpower/admin' && currentView !== 'stats'

        return (
          <Button
            key={item.href}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            type="button"
            onClick={() => navigateTo(item.href)}
            className={isActive ? "shadow-sm" : "text-slate-600 hover:text-slate-900"}
          >
            <span className="flex items-center gap-2 rounded-lg px-4">
              <Icon className="w-4 h-4" />
              {item.label}
            </span>
          </Button>
        )
      })}
    </nav>
  )
}