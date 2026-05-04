"use client"

import { useState, useRef, useEffect } from "react"
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
  const [uploadedTalon, setUploadedTalon] = useState<File | null>(null)
  const [uploadedFoto, setUploadedFoto] = useState<File | null>(null)
  const [talonError, setTalonError] = useState("")
  const [aceiteMaior18, setAceiteMaior18] = useState(false)
  const [aceiteTermos, setAceiteTermos] = useState(false)
  const [aceitePrivacidade, setAceitePrivacidade] = useState(false)
  const [aceiteMarketing, setAceiteMarketing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRefTalon = useRef<HTMLInputElement>(null)
  const fileInputRefFoto = useRef<HTMLInputElement>(null)

  const isValidReceiptImage = (file: File) =>
    new Promise<boolean>((resolve) => {
      const imageUrl = URL.createObjectURL(file)
      const previewImage = new window.Image()

      previewImage.onload = () => {
        const isReceiptShape = previewImage.height >= previewImage.width * 1.15
        URL.revokeObjectURL(imageUrl)
        resolve(isReceiptShape)
      }

      previewImage.onerror = () => {
        URL.revokeObjectURL(imageUrl)
        resolve(false)
      }

      previewImage.src = imageUrl
    })

  const handleFileChangeTalon = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (selectedFile.type.startsWith("image/")) {
        const isReceiptImage = await isValidReceiptImage(selectedFile)

        if (!isReceiptImage) {
          setUploadedTalon(null)
          setTalonError("Ups! Parece que a imagem enviada não corresponde a um talão de compra.\nEnvia uma foto nítida do talão de compra.")
          e.target.value = ""
          return
        }
      }

      setTalonError("")
      setUploadedTalon(selectedFile)
    }
  }

  const handleFileChangeFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFoto(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aceiteMaior18 || !aceiteTermos || !aceitePrivacidade || !uploadedTalon || !uploadedFoto) return

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('nome', formData.nome)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('telemovel', formData.telemovel)
      formDataToSend.append('talao', uploadedTalon)
      formDataToSend.append('foto', uploadedFoto)
      formDataToSend.append('aceiteMaior18', aceiteMaior18.toString())
      formDataToSend.append('aceiteTermos', aceiteTermos.toString())
      formDataToSend.append('aceitePrivacidade', aceitePrivacidade.toString())
      formDataToSend.append('aceiteMarketing', aceiteMarketing.toString())

      const response = await fetch('/api/participate', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao submeter participação')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Erro ao submeter participação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              {submitted ? (
                <Card className="bg-gradient-to-br from-[#5f8f4c] to-[#2f5d3a] border-0 shadow-2xl">
                  <CardContent className="p-8 text-center text-white">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/15 rounded-full mb-6">
                      <Award className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Participação Registada!</h3>
                    <p className="text-white/80">
                      A tua participação foi registada com sucesso. Boa sorte!
                    </p>
                    <p className="mt-3 font-bold text-white">
                      Se fores um dos vencedores serás contactado por e-mail. Fica atento à tua caixa de entrada e ao spam.
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
                              : talonError
                                ? 'border-red-400 bg-red-50 hover:border-red-500'
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
                              <p className="text-xs text-[#8b7355]">Formatos aceites: JPG, PNG, PDF. As imagens devem estar em formato vertical de talão.</p>
                            </div>
                          )}
                        </div>
                        {talonError ? <p className="whitespace-pre-line text-sm text-red-600">{talonError}</p> : null}
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
                            className="mt-1 shrink-0 border-[#d4c4b0] data-[state=checked]:bg-[#3d2314] data-[state=checked]:border-[#3d2314]"
                          />
                          <label htmlFor="maior18" className="text-sm text-[#5a4a40] leading-relaxed cursor-pointer">
                            Declaro que sou maior de 18 anos e aceito o{" "}
                            <Link href="/regulamento.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#3d2314] hover:text-black font-bold" onClick={(e) => e.stopPropagation()}>Regulamento do Passatempo</Link>
                            . <span className="text-[#3d2314]">*</span>
                          </label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="termos"
                            checked={aceiteTermos}
                            onCheckedChange={(checked) => setAceiteTermos(checked === true)}
                            className="mt-1 shrink-0 border-[#d4c4b0] data-[state=checked]:bg-[#3d2314] data-[state=checked]:border-[#3d2314]"
                          />
                          <label htmlFor="termos" className="text-sm text-[#5a4a40] leading-relaxed cursor-pointer">
                            Declaro que li e aceito os{" "}
                            <Link href="/termos_e_condicoes_de_utilizacao_do_site.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#3d2314] hover:text-black font-bold" onClick={(e) => e.stopPropagation()}>Termos de Utilização do Website</Link>
                            . <span className="text-[#3d2314]">*</span>
                          </label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="privacidade"
                            checked={aceitePrivacidade}
                            onCheckedChange={(checked) => setAceitePrivacidade(checked === true)}
                            className="mt-1 shrink-0 border-[#d4c4b0] data-[state=checked]:bg-[#3d2314] data-[state=checked]:border-[#3d2314]"
                          />
                          <label htmlFor="privacidade" className="text-sm text-[#5a4a40] leading-relaxed cursor-pointer">
                            Declaro ter lido a{" "}
                            <Link href="/politica_de_privacidade.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#3d2314] hover:text-black font-bold" onClick={(e) => e.stopPropagation()}>Política de Privacidade</Link>
                            {" "}e ter tomado conhecimento da forma como os meus dados são tratados. <span className="text-[#3d2314]">*</span>
                          </label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="marketing"
                            checked={aceiteMarketing}
                            onCheckedChange={(checked) => setAceiteMarketing(checked === true)}
                            className="mt-1 shrink-0 border-[#d4c4b0] data-[state=checked]:bg-[#3d2314] data-[state=checked]:border-[#3d2314]"
                          />
                          <label htmlFor="marketing" className="text-sm text-[#5a4a40] leading-relaxed cursor-pointer">
                            Consinto, de forma livre, consciente e informada, que Manuel Rui Azinhais Nabeiro, Unipessoal, Lda. recolha e trate os dados pessoais por mim fornecidos para ações de marketing e publicidade, nos termos melhor descritos na{" "}
                            <Link href="/politica_de_privacidade.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#3d2314] hover:text-black font-bold" onClick={(e) => e.stopPropagation()}>Política de Privacidade</Link>
                            .
                          </label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={!aceiteMaior18 || !aceiteTermos || !aceitePrivacidade || !uploadedTalon || !uploadedFoto || isSubmitting}
                        className="w-full bg-[#c73d3d] hover:bg-[#a82f2f] text-white font-bold text-lg py-6 rounded-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all"
                      >
                        {isSubmitting ? "A enviar..." : "PARTICIPAR"}
                      </Button>

                      <p className="text-xs text-center text-[#8b7355]">
                        * Campos obrigatórios
                      </p>

                      <p className="text-sm md:text-base font-bold text-center text-[#8b7355]">
                        Passatempo válido de 4 de maio a 3 de junho de 2026
                      </p>
                    </form>
                  </CardContent>
                </Card>
              )}
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
                ibiza.gochill@tpower.pt
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