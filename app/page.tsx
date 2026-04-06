"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [aceiteRegulamento, setAceiteRegulamento] = useState(false)
  const [aceiteMaior18, setAceiteMaior18] = useState(false)
  const [aceiteMarketing, setAceiteMarketing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aceiteRegulamento || !aceiteMaior18 || !uploadedFile) return

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
        <div className="relative w-full min-h-[100svh] md:min-h-[600px] lg:min-h-[700px]">
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
              <div className="flex flex-col lg:flex-row h-full items-center justify-center gap-6 lg:gap-16 pt-8 pb-16 md:pb-24">
                
                {/* LEFT Column - Go Chill Logo + Leva-te a Ibiza */}
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copo-MnqA977LrlzLb2UIYQEoaXNnU4lN3C.png"
                    alt="Go Chill"
                    width={280}
                    height={200}
                    className="w-32 md:w-44 lg:w-56 mb-2 md:mb-4 gc-animate-in gc-fade-up gc-delay-0"
                  />
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ibiza-xOffcgZ20UL6FroOBwofh7vXTWDhKB.png"
                    alt="Leva-te a Ibiza"
                    width={420}
                    height={200}
                    className="w-40 md:w-56 lg:w-80 gc-animate-in gc-fade-up gc-delay-1"
                  />
                </div>

                {/* RIGHT Column - Products + Avião + Valor */}
                <div className="flex flex-col items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/titulo-mNQdTWfiTV1Ff452lf2di82hjfMu77.png"
                    alt="Na compra de 2 Go Chill"
                    width={240}
                    height={90}
                    className="w-32 md:w-44 lg:w-52 mb-2 md:mb-4 gc-animate-in gc-fade-up gc-delay-2"
                  />
                  <div className="flex items-end justify-center mb-4">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copo2-8YEwatomsqIqiDtDcE4I2EAY1bepm2.png"
                      alt="Go Chill Cappuccino"
                      width={200}
                      height={300}
                      className="w-24 md:w-36 lg:w-44 drop-shadow-2xl gc-animate-in gc-fade-right gc-delay-3"
                    />
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/copo1-oSbXkA337V5BOqhwA3HN7ZsHvLKZhI.png"
                      alt="Go Chill Choco Latte"
                      width={180}
                      height={280}
                      className="w-20 md:w-32 lg:w-40 drop-shadow-2xl -ml-6 md:-ml-10 gc-animate-in gc-fade-left gc-delay-4"
                    />
                  </div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aviao-9AUjX3fXM5ml6zYSzxFgQg60ldfiRQ.png"
                    alt="Avião"
                    width={320}
                    height={160}
                    className="w-32 md:w-48 lg:w-60 drop-shadow-xl mb-2 gc-animate-in gc-fade-up gc-delay-5"
                  />
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/valor-Qwj08KNxs659GCud4EHLkTsn3P50sM.png"
                    alt="10.000€"
                    width={300}
                    height={100}
                    className="w-28 md:w-40 lg:w-52 gc-animate-in gc-fade-up gc-delay-6"
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
      <section className="pt-2 pb-12 md:pt-4 md:pb-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#3d2314] mb-6 md:mb-8">
            Como Participar?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            <StepCard 
              number={1}
              icon={<ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />}
              title="Compra 2 Go Chill"
              description="Adquire 2 bebidas Go Chill participantes."
            />
            <StepCard 
              number={2}
              icon={<Camera className="w-6 h-6 md:w-7 md:h-7" />}
              title="Fotografa o Talão"
              description="Tira uma foto ao talão de compra."
            />
            <StepCard 
              number={3}
              icon={<Upload className="w-6 h-6 md:w-7 md:h-7" />}
              title="Faz Upload"
              description="Carrega a foto do talão no formulário."
            />
            <StepCard 
              number={4}
              icon={<Award className="w-6 h-6 md:w-7 md:h-7" />}
              title="Ganha Prémios!"
              description="Habilita-te a ganhar a viagem a Ibiza!"
            />
          </div>
        </div>
      </section>

      {/* Form Section with Prizes */}
      <section id="form-section" className="py-12 md:py-16 bg-[#f8f5f2]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto items-center">
            
            {/* Left - Prizes */}
            <div className="flex flex-col items-center lg:items-start order-2 lg:order-1">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/premios-NSrh5wEDBq9rLAO6aMQa8C94gvNyJH.png"
                alt="Prémios Semanais"
                width={250}
                height={80}
                className="w-44 md:w-56 mb-4"
              />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/premios-vY837Hvf0LVKu8CfEHqzv4Jr6ux5SW.png"
                alt="Prémios - Instax, DCK Boardshorts, Toalhas"
                width={450}
                height={550}
                className="w-64 md:w-80 lg:w-96 drop-shadow-xl"
              />
              <p className="text-[#3d2314] text-center lg:text-left mt-4 text-sm md:text-base max-w-md">
                Todas as semanas sorteamos <strong>Câmaras Instax</strong>, <strong>Boardshorts DCK</strong> e <strong>Toalhas de Praia</strong>!
              </p>
            </div>

            {/* Right - Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-[#3d2314] text-white text-center py-2 px-4 rounded-t-lg mb-0">
                <p className="text-sm md:text-base font-semibold">
                  Passatempo válido de 04/05/2026 a 03/06/2026
                </p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-center text-[#3d2314] mt-6 mb-2">
                Participa Agora!
              </h2>
              <p className="text-center text-[#5a4a40] mb-6 text-sm md:text-base">
                Preenche os teus dados e faz upload do talão
              </p>

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
                    <form onSubmit={handleSubmit} className="space-y-5">
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

                      {/* File Upload */}
                      <div className="space-y-2">
                        <Label className="text-[#3d2314] font-semibold">
                          Upload do Talão *
                        </Label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                          className="hidden"
                        />
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            uploadedFile 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-[#d4c4b0] hover:border-[#f47920] hover:bg-[#fff8f0]'
                          }`}
                        >
                          {uploadedFile ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p className="text-green-700 font-medium">{uploadedFile.name}</p>
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

                      <div className="space-y-4 pt-4 border-t border-[#e8ddd0]">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="maior18"
                            checked={aceiteMaior18}
                            onCheckedChange={(checked) => setAceiteMaior18(checked === true)}
                            className="mt-0.5 border-[#d4c4b0] data-[state=checked]:bg-[#3d2314] data-[state=checked]:border-[#3d2314]"
                          />
                          <Label htmlFor="maior18" className="flex-1 text-sm text-[#5a4a40] leading-snug cursor-pointer text-pretty">
                            Declaro que sou maior de 18 anos. *
                          </Label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="regulamento"
                            checked={aceiteRegulamento}
                            onCheckedChange={(checked) => setAceiteRegulamento(checked === true)}
                            className="mt-0.5 border-[#d4c4b0] data-[state=checked]:bg-[#3d2314] data-[state=checked]:border-[#3d2314]"
                          />
                          <Label htmlFor="regulamento" className="flex-1 text-sm text-[#5a4a40] leading-snug cursor-pointer text-pretty">
                            <span className="whitespace-nowrap">Li e aceito o</span>{" "}
                            <a href="/regulamento" className="text-[#f47920] hover:underline font-medium">
                              regulamento
                            </a>{" "}
                            <span className="whitespace-nowrap">do passatempo.</span> *
                          </Label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="marketing"
                            checked={aceiteMarketing}
                            onCheckedChange={(checked) => setAceiteMarketing(checked === true)}
                            className="mt-0.5 border-[#d4c4b0] data-[state=checked]:bg-[#3d2314] data-[state=checked]:border-[#3d2314]"
                          />
                          <Label htmlFor="marketing" className="flex-1 text-sm text-[#5a4a40] leading-snug cursor-pointer text-pretty">
                            Aceito receber comunicações de marketing da Delta Cafés.
                          </Label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={!aceiteRegulamento || !aceiteMaior18 || !uploadedFile || isSubmitting}
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
            <div className="text-white font-display font-extrabold tracking-wide text-lg">
              GO CHILL
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/regulamento">Regulamento</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/termos-e-condicoes">Termos e Condições</Link>
              </Button>
            </div>
            <p className="text-white/80 text-sm text-center">
              Passatempo válido de 04/05/2026 a 03/06/2026
            </p>
            <p className="text-white/50 text-xs text-center">
              © 2026 Delta Cafés - Go Chill. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function StepCard({ 
  number, 
  icon, 
  title, 
  description 
}: { 
  number: number
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="flex flex-col items-center text-center">
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
