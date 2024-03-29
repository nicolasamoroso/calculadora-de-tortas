import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"

import { cn } from "@/lib/utils"
import Provider from "@/components/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Calculadora de Tortas",
  description: "Calculadora de Tortas",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "px-4", "bg-background")}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
