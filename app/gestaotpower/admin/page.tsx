import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminStats } from "@/components/admin/admin-stats"

type AdminPageProps = {
  searchParams: Promise<{
    view?: string | string[]
  }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams = await searchParams
  const view = Array.isArray(resolvedSearchParams.view)
    ? resolvedSearchParams.view[0]
    : resolvedSearchParams.view

  if (view === 'stats') {
    return <AdminStats />
  }

  return <AdminDashboard />
}
