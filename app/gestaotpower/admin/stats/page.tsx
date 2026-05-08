import { redirect } from "next/navigation"

export default function AdminStatsRedirectPage() {
  redirect('/gestaotpower/admin?view=stats')
}
