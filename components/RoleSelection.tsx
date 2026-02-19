'use client'

import { useState } from 'react'
import { saveSession, saveTeacherClassId, type UserSession } from '@/lib/store'
import { supabase } from '@/lib/supabase'

interface Props {
  onComplete: (session: UserSession) => void
}

type Step = 'role' | 'teacher-profile' | 'parent-profile'

export default function RoleSelection({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<'teacher' | 'parent' | null>(null)
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your name'); return }
    if (!school.trim()) { setError('Please enter your school'); return }
    setLoading(true)
    setError('')
    try {
      const { data, error: dbError } = await supabase
        .from('profiles')
        .insert({ role, display_name: name.trim(), school: school.trim() })
        .select()
        .single()
      if (dbError) throw dbError
      const session: UserSession = {
        id: data.id,
        role: data.role,
        display_name: data.display_name,
        school: data.school,
        created_at: data.created_at,
      }
      saveSession(session)
      onComplete(session)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'role') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #EDE0C4 100%)' }}>
        {/* Header */}
        <div className="px-6 pt-12 pb-8" style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}>
          <div className="text-white/70 text-sm mb-1">Welcome to</div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-caveat, cursive)' }}>
            MyChild Diary
          </h1>
          <p className="text-white/80 text-sm">Your digital school diary. Choose how you&apos;ll use this app.</p>
        </div>

        <div className="flex-1 px-5 pt-8 pb-6 fade-in">
          <p className="text-pencil-gray/70 text-sm text-center mb-6 font-medium">I am a...</p>

          <div className="space-y-4">
            {/* Teacher card */}
            <button
              onClick={() => { setRole('teacher'); setStep('teacher-profile') }}
              className="w-full text-left active:scale-95 transition-transform"
              style={{ minHeight: 'auto' }}
            >
              <div className="rounded-2xl overflow-hidden shadow-notebook" style={{ background: '#FDF6E3' }}>
                <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #2C5F8A, #7EB3D4)' }} />
                <div className="p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2C5F8A22 0%, #7EB3D422 100%)' }}>
                    🧑‍🏫
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-pencil-gray text-lg mb-0.5">Teacher</div>
                    <div className="text-pencil-gray/60 text-sm">Create classes, fill daily diary entries for all students, and chat with parents.</div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 text-ink-blue">
                    <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Parent card */}
            <button
              onClick={() => { setRole('parent'); setStep('parent-profile') }}
              className="w-full text-left active:scale-95 transition-transform"
              style={{ minHeight: 'auto' }}
            >
              <div className="rounded-2xl overflow-hidden shadow-notebook" style={{ background: '#FDF6E3' }}>
                <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #4CAF50, #81C784)' }} />
                <div className="p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4CAF5022 0%, #81C78422 100%)' }}>
                    👨‍👩‍👧
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-pencil-gray text-lg mb-0.5">Parent</div>
                    <div className="text-pencil-gray/60 text-sm">Enter your class code, view your child&apos;s diary, sign entries, and chat with the teacher.</div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 text-pencil-gray/30">
                    <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-pencil-gray/40 mt-8">
            Your data is synced securely. No passwords needed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #EDE0C4 100%)' }}>
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}>
        <button
          onClick={() => setStep('role')}
          className="text-white/70 text-sm flex items-center gap-1 mb-3"
          style={{ minHeight: 'auto' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <div className="text-3xl mb-1">{role === 'teacher' ? '🧑‍🏫' : '👨‍👩‍👧'}</div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-caveat, cursive)' }}>
          {role === 'teacher' ? 'Teacher Profile' : 'Parent Profile'}
        </h1>
        <p className="text-white/70 text-sm">Tell us a bit about yourself</p>
      </div>

      <div className="flex-1 px-5 pt-6 pb-6 fade-in">
        <div className="rounded-2xl p-6 shadow-page" style={{
          background: '#FDF6E3',
          backgroundImage: 'linear-gradient(rgba(212,197,169,0.25) 1px, transparent 1px)',
          backgroundSize: '100% 32px',
          backgroundPosition: '0 22px',
        }}>
          <form onSubmit={handleContinue} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-pencil-gray mb-1.5">
                {role === 'teacher' ? 'Your Full Name' : 'Your Name (Parent)'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'teacher' ? 'e.g. Mr. James Odhiambo' : 'e.g. Mrs. Wanjiku Kamau'}
                className="w-full px-4 py-3 rounded-xl border-2 text-pencil-gray placeholder-pencil-gray/40 text-base transition-colors"
                style={{ background: 'rgba(253,246,227,0.8)', borderColor: '#D4C5A9', fontFamily: 'var(--font-noto)' }}
                onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                onBlur={(e) => { e.target.style.borderColor = '#D4C5A9' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pencil-gray mb-1.5">School Name</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. St. Mary's Primary School"
                className="w-full px-4 py-3 rounded-xl border-2 text-pencil-gray placeholder-pencil-gray/40 text-base transition-colors"
                style={{ background: 'rgba(253,246,227,0.8)', borderColor: '#D4C5A9', fontFamily: 'var(--font-noto)' }}
                onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                onBlur={(e) => { e.target.style.borderColor = '#D4C5A9' }}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold text-base active:scale-95 transition-transform disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)', boxShadow: '0 4px 14px rgba(44,95,138,0.4)', minHeight: 52 }}
            >
              {loading ? 'Setting up...' : 'Continue →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
