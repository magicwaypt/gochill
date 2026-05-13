import type { Metadata } from 'next'
import { Poppins, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GoogleTagManager } from '@/components/analytics/google-tag-manager'
import './globals.css'

const GTM_CONTAINER_ID = 'GTM-P4NDJKQF'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans"
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: 'Go Chill Leva-te a Ibiza',
  description: 'Participa no passatempo Go Chill e habilita-te a ganhar uma viagem a Ibiza no valor de 10.000€ e prémios semanais!',
  generator: 'v0.app',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${montserrat.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        {process.env.NODE_ENV === 'production' && <GoogleTagManager containerId={GTM_CONTAINER_ID} />}
      </body>
    </html>
  )
}
