import type { Metadata } from "next"
import { ReactNode } from "react"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ClientLayout } from "@/components/client-layout"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Leli Rentals - Modern Tech-Inspired Rental Marketplace",
  description: "Discover the perfect rental for every occasion with our modern, user-friendly platform",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/default.svg", type: "image/svg+xml" },
      { url: "/default.svg", sizes: "any" }
    ],
    apple: "/default.svg",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${dmSans.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
