import Image from "next/image"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fundo.png-UBuXA9yYXpWUZOy8mmJO1dueZ2eHLY.jpeg"
        alt="Fundo tropical Go Chill"
        fill
        priority
        className="object-cover object-top"
      />

      <div className="absolute inset-0 bg-black/35" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
        <div className="rounded-2xl border border-white/20 bg-black/20 px-8 py-6 backdrop-blur-sm">
          <h1 className="text-4xl font-black uppercase text-white md:text-6xl">
            Em Breve
          </h1>
        </div>
      </section>
    </main>
  )
}
