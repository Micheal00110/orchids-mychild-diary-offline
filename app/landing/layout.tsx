import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MyChild Diary — Digital School Diary for Kenyan Families',
  description: 'Connect teachers and parents through a beautiful digital school diary. Real-time sync, two-way chat, and a paper-diary feel.',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return children
}
