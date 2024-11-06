// app/page.tsx
import { Metadata } from 'next'
import LandingPage from './components/Landingpage'

export const metadata: Metadata = {
  title: 'Scolara - AI-Powered Education Platform',
  description: 'Transform your learning experience with Scolara. Generate practice questions, analyze study materials, and get instant help with our AI-powered education platform.',
  keywords: ['education', 'AI learning', 'practice questions', 'study tools', 'education technology'],
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <LandingPage />
    </main>
  )
}