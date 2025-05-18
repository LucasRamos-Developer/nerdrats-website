import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { AchievementProvider } from "@/contexts/achievement-context"
import AchievementPopupWrapper from "@/components/achievement-popup-wrapper"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NERDRATS - Ranking de Líderes",
  description: "Confira os melhores jogadores classificados por distância percorrida e teclas pressionadas",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AchievementProvider>
            <Header />
            <main>{children}</main>
            <AchievementPopupWrapper />
            <Toaster />
          </AchievementProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
