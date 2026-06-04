"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Upload, Award, Camera } from "lucide-react"

export default function GoChillLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full">
        {/* Background Image Container */}
        <div className="relative w-full min-h-[600px] md:min-h-[750px] lg:min-h-[800px]">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fundo.png-UBuXA9yYXpWUZOy8mmJO1dueZ2eHLY.jpeg"
            alt="Fundo tropical"
            fill
            className="object-cover object-top"
            priority
          />

          {/* Hero Content Layer */}
          <div className="absolute inset-0 z-30">
            <div className="container mx-auto px-4 h-full">
              <div className="flex flex-col lg:flex-row h-full items-center justify-start md:justify-center gap-0 md:gap-12 lg:gap-16 pt-4 md:pt-8 lg:pt-4 pb-6 md:pb-16 px-2 md:px-4">

                {/* LEFT Column - Go Chill Logo + Leva-te a Ibiza */}
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copo-MnqA977LrlzLb2UIYQEoaXNnU4lN3C.png"
                    alt="Go Chill"
                    width={280}
                    height={200}
                    className="w-32 md:w-44 lg:w-56 mb-2 md:mb-4 animate-fade-in-up animation-delay-100"
                  />
                  <div className="-mt-10 md:-mt-14 lg:-mt-20 z-10 flex flex-col items-center">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aviao-9AUjX3fXM5ml6zYSzxFgQg60ldfiRQ.png"
                      alt="Avião"
                      width={320}
                      height={160}
                      className="w-32 translate-y-2 md:w-48 md:translate-y-0 lg:w-60 drop-shadow-xl mb-2 animate-airplane"
                    />
                    <Image
                      src="/images/frase.png"
                      alt="Leva-te a Ibiza"
                      width={420}
                      height={200}
                      className="w-48 md:w-64 lg:w-96 animate-fade-in-up animation-delay-500"
                    />
                    <Image
                      src="/images/frase2@3x.png"
                      alt="Frase 2"
                      width={420}
                      height={200}
                      className="w-40 md:w-56 lg:w-80 mt-2 animate-fade-in-up animation-delay-600"
                    />
                  </div>
                </div>

                {/* RIGHT Column - Products + Avião + Valor */}
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/valor.png"
                    alt="10.000€"
                    width={300}
                    height={100}
                    className="w-28 translate-y-2 md:w-40 md:translate-y-0 lg:w-52 mb-2 md:mb-4 animate-fade-in-up animation-delay-500"
                  />
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/titulo-mNQdTWfiTV1Ff452lf2di82hjfMu77.png"
                    alt="Na compra de 2 Go Chill"
                    width={240}
                    height={90}
                    className="w-32 translate-y-2 md:w-44 md:translate-y-0 lg:w-52 mb-2 md:mb-4 animate-slide-in-right animation-delay-200"
                  />
                  <div className="flex items-end justify-center mb-0 translate-y-16 md:mb-4 md:translate-y-0 animate-scale-in animation-delay-400">
                    <Image
                      src="/images/copo2.png"
                      alt="Go Chill Cappuccino"
                      width={200}
                      height={300}
                      className="h-52 w-auto md:h-auto md:w-36 lg:w-44 drop-shadow-2xl"
                    />
                    <Image
                      src="/images/copo1.png"
                      alt="Go Chill Choco Latte"
                      width={180}
                      height={280}
                      className="h-52 w-auto md:h-auto md:w-36 lg:w-44 drop-shadow-2xl -ml-6 md:-ml-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave at the very bottom - behind content (z-10) */}
          <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-0 md:translate-y-1">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/onda-yUxoghgNh6sXa09p0nLGN5sspYpoRy.png"
              alt=""
              width={1920}
              height={100}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* How to Participate */}
      <StepsSection />

      <section
        className="relative overflow-hidden py-12 md:py-16"
        style={{
          backgroundImage: "url('/images/image.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <Card className="border-0 bg-white/90 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <p className="text-center text-lg md:text-2xl lg:text-3xl font-bold text-[#c73d3d] mb-3">
                  PRÉMIOS SEMANAIS
                </p>
                <h3 className="text-center text-2xl md:text-3xl font-bold text-[#3d2314] mb-3">
                  As 7 fotos mais criativas da semana ganham prémios
                </h3>
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 items-end">
                  <div className="p-3 md:p-4">
                    <Image
                      src="/images/camara.png"
                      alt="Câmara instantânea FUJIFILM Instax Mini"
                      width={480}
                      height={480}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <Image
                      src="/images/calcoes.png"
                      alt="Calções de banho DCK"
                      width={480}
                      height={480}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <Image
                      src="/images/toalha.png"
                      alt="Toalhas de Praia Go Chill"
                      width={480}
                      height={480}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <ul className="space-y-3 text-[#5a4a40] text-sm md:text-base leading-relaxed">
                  <li><span className="font-bold text-[#3d2314]">1º Classificado:</span> Câmara FUJIFILM Instax Mini</li>
                  <li><span className="font-bold text-[#3d2314]">2.º e 3.º Classificado:</span> Calções de banho DCK</li>
                  <li><span className="font-bold text-[#3d2314]">4.º a 7.º Classificado:</span> Toalhas de Praia Go Chill</li>
                </ul>
              </CardContent>
            </Card>

            <div className="py-2 md:py-4">
              <div className="p-6 md:p-8">
                <p className="mb-3 block w-full text-center text-2xl md:text-4xl lg:text-5xl font-bold text-[#c73d3d]">
                  PRÉMIO FINAL
                </p>
                <h3 className="text-center text-2xl md:text-3xl font-bold text-[#3d2314] mb-3">
                  Voucher de viagem para Ibiza
                </h3>
                <p className="text-center text-[#5a4a40] mb-6 text-sm md:text-base">
                  A foto mais original de todas leva-te numa viagem a Ibiza para 4 amigos.
                </p>
                <div className="flex justify-center">
                  <Image
                    src="/images/voucher.png"
                    alt="Voucher de viagem para Ibiza"
                    width={1600}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Winners */}
      <section id="vencedores" className="py-12 md:py-16 bg-[#fff8f0]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-lg md:text-2xl lg:text-3xl font-bold text-[#c73d3d] mb-3">
              VENCEDORES DAS FOTOS MAIS CRIATIVAS
            </p>
            <h3 className="text-center text-2xl md:text-3xl font-bold text-[#3d2314] mb-8">
              1ª e 2ª semana
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 bg-white shadow-2xl">
                <CardContent className="p-6 md:p-8">
                  <p className="text-center text-xl md:text-2xl font-bold text-[#3d2314] mb-4">1ª Semana</p>
                  <ul className="space-y-2 text-[#5a4a40] text-sm md:text-base">
                    <li className="text-center font-semibold">DUARTE MELO</li>
                    <li className="text-center font-semibold">EDUARDO LOPES</li>
                    <li className="text-center font-semibold">ÁUREA MONTEIRO</li>
                    <li className="text-center font-semibold">MARIA CAETANO</li>
                    <li className="text-center font-semibold">SÉRGIO PINHO</li>
                    <li className="text-center font-semibold">PAULA SILVA</li>
                    <li className="text-center font-semibold">FERNANDO ANDRÉ</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-2xl">
                <CardContent className="p-6 md:p-8">
                  <p className="text-center text-xl md:text-2xl font-bold text-[#3d2314] mb-4">2ª Semana</p>
                  <ul className="space-y-2 text-[#5a4a40] text-sm md:text-base">
                    <li className="text-center font-semibold">ANA ALMEIDA</li>
                    <li className="text-center font-semibold">CRISTIANA CASTANHEIRA</li>
                    <li className="text-center font-semibold">ANA JESUS</li>
                    <li className="text-center font-semibold">DUARTE MELO</li>
                    <li className="text-center font-semibold">EDUARDO PEREIRA</li>
                    <li className="text-center font-semibold">ROSA MARTINS</li>
                    <li className="text-center font-semibold">ANA MONTEIRO</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section
        id="form-section"
        className="relative overflow-hidden py-12 md:py-16"
        style={{
          backgroundImage: "url('/images/foto.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-white/75" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#c73d3d]/10 rounded-full mb-6">
                  <Award className="w-10 h-10 text-[#c73d3d]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#3d2314] mb-4">
                  O passatempo “GO CHILL LEVA-TE A IBIZA” já terminou.
                </h2>
                <p className="text-lg md:text-xl font-medium text-[#5a4a40]">
                  Fica atento às nossas próximas promoções.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3d2314] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <Image
              src="/images/logo.png"
              alt="Go Chill"
              width={60}
              height={60}
              className="w-12"
            />
            <div className="text-center">
              <p className="text-white/80 text-sm font-semibold mb-1">
                Contacto de Apoio:
              </p>
              <p className="text-white/80 text-sm">
                ibiza.gochill@tpower.pt
              </p>
            </div>
            <nav aria-label="Documentos legais" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/80">
              <Link href="/regulamento.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Regulamento
              </Link>
              <Link href="/termos_e_condicoes_de_utilizacao_do_site.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Termos e Condições
              </Link>
              <Link href="/politica_de_privacidade.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/politica_de_cookies.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Política de Cookies
              </Link>
              <Link href="/preferencias-cookies" className="hover:text-white transition-colors">
                Preferências de Cookies
              </Link>
            </nav>
            <p className="text-white/50 text-xs text-center">
              © 2026 Delta Cafés - Go Chill. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function StepsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <section ref={ref} className="py-12 md:py-16 bg-white md:-mt-28 lg:-mt-40 relative z-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#3d2314] mb-10 md:mb-12">
          Como Participar?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          <StepCard
            number={1}
            icon={<ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />}
            title="Compra"
            description="2 Go Chill de qualquer sabor."
            animationClass={isVisible ? "animate-scale-in animation-delay-100" : ""}
          />
          <StepCard
            number={2}
            icon={<Camera className="w-6 h-6 md:w-7 md:h-7" />}
            title="Tira uma foto original"
            description="A foto é tua, Go Chill é obrigatório estar, tu decides se apareces ou não."
            animationClass={isVisible ? "animate-scale-in animation-delay-300" : ""}
          />
          <StepCard
            number={3}
            icon={<Upload className="w-6 h-6 md:w-7 md:h-7" />}
            title="Preenche o formulário"
            description="Faz o upload do talão de compra e da tua fotografia com Go Chill."
            animationClass={isVisible ? "animate-scale-in animation-delay-500" : ""}
          />
          <StepCard
            number={4}
            icon={<Award className="w-6 h-6 md:w-7 md:h-7" />}
            title="Ganha Prémios!"
            description="Sê original e habilita-te a ganhar a viagem a Ibiza e prémios semanais."
            animationClass={isVisible ? "animate-scale-in animation-delay-700" : ""}
          />
        </div>
      </div>
    </section>
  )
}

function StepCard({
  number,
  icon,
  title,
  description,
  animationClass = ""
}: {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  animationClass?: string
}) {
  return (
    <div className={animationClass ? `flex flex-col items-center text-center ${animationClass}` : "flex flex-col items-center text-center step-card-default"}>
      <div className="relative mb-3 md:mb-4">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-[#f47920] rounded-full flex items-center justify-center text-white shadow-lg">
          {icon}
        </div>
        <span className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-[#3d2314] text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold shadow">
          {number}
        </span>
      </div>
      <h3 className="font-bold text-[#3d2314] text-sm md:text-base mb-1">{title}</h3>
      <p className="text-xs md:text-sm text-[#5a4a40]">{description}</p>
    </div>
  )
}
