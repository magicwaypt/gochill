import Link from "next/link"

export default function RegulamentoPage() {
  return (
    <main className="min-h-screen bg-[#f8f5f2]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-[#3d2314] mb-6">
          Regulamento
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6 md:p-8 space-y-4 text-[#5a4a40]">
          <p>
            Coloca aqui o regulamento oficial do passatempo (ou substitui esta
            página por um PDF).
          </p>
          <p className="text-sm text-[#8b7355]">
            Dica: se tiveres um PDF, coloca-o em <code>public</code> e aponta o
            link do footer para esse ficheiro.
          </p>
        </div>

        <div className="mt-6">
          <Link href="/" className="text-[#f47920] hover:underline font-medium">
            Voltar à página inicial
          </Link>
        </div>
      </div>
    </main>
  )
}

