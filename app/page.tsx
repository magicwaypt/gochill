"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Upload, Send, Award, Camera } from "lucide-react"

export default function GoChillLandingPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telemovel: "",
  })
  const [uploadedTalon, setUploadedTalon] = useState<File | null>(null)
  const [uploadedFoto, setUploadedFoto] = useState<File | null>(null)
  const [aceiteRegulamento, setAceiteRegulamento] = useState(false)
  const [aceiteMaior18, setAceiteMaior18] = useState(false)
  const [aceiteMarketing, setAceiteMarketing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRefTalon = useRef<HTMLInputElement>(null)
  const fileInputRefFoto = useRef<HTMLInputElement>(null)

  const handleFileChangeTalon = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedTalon(e.target.files[0])
    }
  }

  const handleFileChangeFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFoto(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aceiteRegulamento || !aceiteMaior18 || !aceiteMarketing || !uploadedTalon || !uploadedFoto) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full">
        {/* Background Image Container */}
        <div className="relative w-full min-h-[700px] md:min-h-[750px] lg:min-h-[800px]">
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
              <div className="flex flex-col lg:flex-row h-full items-center justify-center gap-8 md:gap-12 lg:gap-16 pt-4 md:pt-8 lg:pt-4 pb-12 md:pb-16 px-2 md:px-4">
                
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
                      className="w-32 md:w-48 lg:w-60 drop-shadow-xl mb-2 animate-airplane"
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
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/titulo-mNQdTWfiTV1Ff452lf2di82hjfMu77.png"
                    alt="Na compra de 2 Go Chill"
                    width={240}
                    height={90}
                    className="w-32 md:w-44 lg:w-52 mb-2 md:mb-4 animate-slide-in-right animation-delay-200"
                  />
                  <div className="flex items-end justify-center mb-4 animate-scale-in animation-delay-400">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copo2-8YEwatomsqIqiDtDcE4I2EAY1bepm2.png"
                      alt="Go Chill Cappuccino"
                      width={200}
                      height={300}
                      className="w-24 md:w-36 lg:w-44 drop-shadow-2xl"
                    />
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copo1-oSbXkA337V5BOqhwA3HN7ZsHvLKZhI.png"
                      alt="Go Chill Choco Latte"
                      width={180}
                      height={280}
                      className="w-20 md:w-32 lg:w-40 drop-shadow-2xl -ml-6 md:-ml-10"
                    />
                  </div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/valor-Qwj08KNxs659GCud4EHLkTsn3P50sM.png"
                    alt="10.000€"
                    width={300}
                    height={100}
                    className="w-28 md:w-40 lg:w-52 animate-fade-in-up animation-delay-500"
                  />
                  <Image
                    src="/images/premios.png"
                    alt="Premios"
                    width={300}
                    height={100}
                    className="w-28 md:w-40 lg:w-52 mt-2 animate-fade-in-up animation-delay-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Wave at the very bottom - behind content (z-10) */}
          <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-1">
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

      {/* Form Section with Prizes */}
      <section id="form-section" className="py-12 md:py-16 bg-[#f8f5f2]" style={{backgroundImage: "url('/images/foto.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto items-center">
            
            {/* Left - Prizes */}
            <div className="flex flex-col items-center order-2 lg:order-1">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/premios-NSrh5wEDBq9rLAO6aMQa8C94gvNyJH.png"
                alt="Prémios Semanais"
                width={250}
                height={80}
                className="w-44 md:w-56 mb-4"
              />
              <div className="relative inline-block w-64 md:w-80 lg:w-96">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/premios-vY837Hvf0LVKu8CfEHqzv4Jr6ux5SW.png"
                  alt="Prémios - Instax, DCK Boardshorts, Toalhas"
                  width={450}
                  height={550}
                  className="w-64 md:w-80 lg:w-96 drop-shadow-xl relative z-10"
                />
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-32 h-32 animate-camera-flash rounded-full z-20 pointer-events-none" />
              </div>
              <p className="text-[#3d2314] text-center mt-4 text-sm md:text-base max-w-md font-bold">
                Todas as semanas, as fotografias mais divertidas ganham prémios Câmaras Instax, Boardshorts DCK e Toalhas de Praia!
              </p>
            </div>

            {/* Right - Form */}
            <div className="order-1 lg:order-2">
              {submitted ? (
                <Card className="bg-gradient-to-br from-[#3d2314] to-[#5a3a2a] border-0 shadow-2xl">
                  <CardContent className="p-8 text-center text-white">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                      <Award className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Participação Registada!</h3>
                    <p className="text-white/80">
                      A tua participação foi registada com sucesso. Boa sorte!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-2xl border-0 bg-white">
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-[#3d2314] mb-6">
                      Participa agora!
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <p className="text-center text-[#5a4a40] mb-6 text-sm md:text-base">
                        Preenche os teus dados
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="nome" className="text-[#3d2314] font-semibold">
                          Nome Completo *
                        </Label>
                        <Input
                          id="nome"
                          type="text"
                          required
                          placeholder="O teu nome completo"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          className="border-[#d4c4b0] focus:border-[#f47920] focus:ring-[#f47920] bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#3d2314] font-semibold">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="o.teu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="border-[#d4c4b0] focus:border-[#f47920] focus:ring-[#f47920] bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telemovel" className="text-[#3d2314] font-semibold">
                          Telemóvel *
                        </Label>
                        <Input
                          id="telemovel"
                          type="tel"
                          required
                          placeholder="911 111 111"
                          value={formData.telemovel}
                          onChange={(e) => setFormData({ ...formData, telemovel: e.target.value })}
                          className="border-[#d4c4b0] focus:border-[#f47920] focus:ring-[#f47920] bg-white"
                        />
                      </div>

                      {/* File Upload - Talão */}
                      <div className="space-y-2">
                        <Label className="text-[#3d2314] font-semibold">
                          Upload talão *
                        </Label>
                        <input
                          type="file"
                          ref={fileInputRefTalon}
                          onChange={handleFileChangeTalon}
                          accept="image/*,.pdf"
                          className="hidden"
                        />
                        <div 
                          onClick={() => fileInputRefTalon.current?.click()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            uploadedTalon 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-[#d4c4b0] hover:border-[#f47920] hover:bg-[#fff8f0]'
                          }`}
                        >
                          {uploadedTalon ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p className="text-green-700 font-medium">{uploadedTalon.name}</p>
                              <p className="text-xs text-green-600">Clica para alterar</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 bg-[#f47920]/10 rounded-full flex items-center justify-center">
                                <Upload className="w-6 h-6 text-[#f47920]" />
                              </div>
                              <p className="text-[#3d2314] font-medium">Clica para carregar o talão</p>
                              <p className="text-xs text-[#8b7355]">Formatos aceites: JPG, PNG, PDF</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* File Upload - Fotografia */}
                      <div className="space-y-2">
                        <Label className="text-[#3d2314] font-semibold">
                          Upload fotografia com Go Chill *
                        </Label>
                        <input
                          type="file"
                          ref={fileInputRefFoto}
                          onChange={handleFileChangeFoto}
                          accept="image/*"
                          className="hidden"
                        />
                        <div 
                          onClick={() => fileInputRefFoto.current?.click()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            uploadedFoto 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-[#d4c4b0] hover:border-[#f47920] hover:bg-[#fff8f0]'
                          }`}
                        >
                          {uploadedFoto ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p className="text-green-700 font-medium">{uploadedFoto.name}</p>
                              <p className="text-xs text-green-600">Clica para alterar</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 bg-[#f47920]/10 rounded-full flex items-center justify-center">
                                <Upload className="w-6 h-6 text-[#f47920]" />
                              </div>
                              <p className="text-[#3d2314] font-medium">Clica para carregar a fotografia</p>
                              <p className="text-xs text-[#8b7355]">Formatos aceites: JPG, PNG</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-[#e8ddd0]">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="maior18"
                            checked={aceiteMaior18}
                            onCheckedChange={(checked) => setAceiteMaior18(checked === true)}
                            className="mt-0.5 border-[#d4c4b0] data-[state=checked]:bg-[#3d2314] data-[state=checked]:border-[#3d2314]"
                          />
                          <Label htmlFor="maior18" className="text-sm text-[#5a4a40] leading-tight cursor-pointer">
                            Declaro que sou maior de 18 anos e que li e aceito o Regulamento do Passatempo. *
                          </Label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="regulamento"
                            checked={aceiteRegulamento}
                            onCheckedChange={(checked) => setAceiteRegulamento(checked === true)}
                            className="mt-0.5 border-[#d4c4b0] data-[state=checked]:bg-[#3d2314] data-[state=checked]:border-[#3d2314]"
                          />
                          <Label htmlFor="regulamento" className="text-sm text-[#5a4a40] leading-tight cursor-pointer">
                            Declaro ter lido a Política de Privacidade e ter tomado conhecimento da forma como os meus dados pessoais são tratados. *
                          </Label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="marketing"
                            checked={aceiteMarketing}
                            onCheckedChange={(checked) => setAceiteMarketing(checked === true)}
                            className="mt-0.5 border-[#d4c4b0] data-[state=checked]:bg-[#3d2314] data-[state=checked]:border-[#3d2314]"
                          />
                          <Label htmlFor="marketing" className="text-sm text-[#5a4a40] leading-tight cursor-pointer">
                            Declaro que li e aceito os Termos e Condições de Utilização do Website. *
                          </Label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={!aceiteRegulamento || !aceiteMaior18 || !aceiteMarketing || !uploadedTalon || !uploadedFoto || isSubmitting}
                        className="w-full bg-[#c73d3d] hover:bg-[#a82f2f] text-white font-bold text-lg py-6 rounded-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all"
                      >
                        {isSubmitting ? "A enviar..." : "PARTICIPAR"}
                      </Button>

                      <p className="text-xs text-center text-[#8b7355]">
                        * Campos obrigatórios
                      </p>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3d2314] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
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
                ibizagochill@tpower.pt
              </p>
            </div>
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
    <section ref={ref} className="py-12 md:py-16 bg-white -mt-8 md:-mt-20 lg:-mt-28 relative z-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#3d2314] mb-10 md:mb-12">
          Como Participar?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          <StepCard 
            number={1}
            icon={<ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />}
            title="Compra 2 Go Chill"
            description="em qualquer variedade ou sabor."
            animationClass={isVisible ? "animate-scale-in animation-delay-100" : ""}
          />
          <StepCard 
            number={2}
            icon={<Camera className="w-6 h-6 md:w-7 md:h-7" />}
            title="Tira uma foto"
            description="divertida com o teu Go Chill."
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
            description="Habilita-te a ganhar a viagem a Ibiza e prémios semanais."
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
