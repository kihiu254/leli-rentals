import React from 'react'
import { Header } from '@/components/header'
import AISupportAdmin from '@/components/ai-support-admin'

export default function SupportAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <AISupportAdmin />
    </div>
  )
}
