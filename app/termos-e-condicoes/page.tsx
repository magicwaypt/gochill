import Link from "next/link"

export default function TermosECondicoesPage() {
  return (
    <main className="min-h-screen bg-[#f8f5f2]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-[#3d2314] mb-6">
          Termos e Condições
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6 md:p-8 space-y-4 text-[#5a4a40]">
          <p>
            Coloca aqui os termos e condições aplicáveis ao site e/ou ao
            passatempo.
          </p>
        </div>

        <div className="mt-6">
          <Link href="/passatempogochill2026" className="text-[#f47920] hover:underline font-medium">
            Voltar à página inicial
          </Link>
        </div>
      </div>
    </main>
  )
}

