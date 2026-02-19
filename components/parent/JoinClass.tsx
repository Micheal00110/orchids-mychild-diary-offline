'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type UserSession, type Membership } from '@/lib/store'

interface Props {
  session: UserSession
  onJoined: (m: Membership) => void
}

export default function JoinClass({ session, onJoined }: Props) {
  const [code, setCode] = useState('')
  const [childName, setChildName] = useState('')
  const [step, setStep] = useState<'code' | 'child'>('code')
  const [foundClass, setFoundClass] = useState<{ id: string; name: string; grade: string; class_code: string; teacher_id: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = code.trim().toUpperCase()
    if (cleaned.length !== 6) { setError('Class codes are 6 characters. Please check and try again.'); return }
    setLoading(true)
    setError('')
    const { data, error: dbError } = await supabase
      .from('classes')
      .select('*')
      .eq('class_code', cleaned)
      .single()
    setLoading(false)
    if (dbError || !data) { setError('Class code not found. Please check with your teacher.'); return }
    setFoundClass(data)
    setStep('child')
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!childName.trim()) { setError("Please enter your child's name"); return }
    if (!foundClass) return
    setLoading(true)
    setError('')
    const { data, error: dbError } = await supabase
      .from('class_memberships')
      .insert({ class_id: foundClass.id, parent_id: session.id, child_name: childName.trim() })
      .select('*, class:classes(*)')
      .single()
    setLoading(false)
    if (dbError) {
      if (dbError.code === '23505') {
        setError('This child is already linked to this class from your account.')
      } else {
        setError(dbError.message)
      }
      return
    }
    onJoined(data as Membership)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #EDE0C4 100%)' }}>
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}>
        {step === 'child' && (
          <button onClick={() => { setStep('code'); setFoundClass(null); setError('') }}
            className="text-white/70 text-sm flex items-center gap-1 mb-3" style={{ minHeight: 'auto' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        )}
        <div className="text-3xl mb-2">{step === 'code' ? '🔑' : '👶'}</div>
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-caveat, cursive)' }}>
          {step === 'code' ? 'Join a Class' : `Join ${foundClass?.name}`}
        </h1>
        <p className="text-white/70 text-sm">
          {step === 'code'
            ? 'Enter the 6-character class code from your child\'s teacher.'
            : `${foundClass?.grade} • Enter your child's name to complete joining.`}
        </p>
      </div>

      <div className="flex-1 px-5 pt-6 pb-6 fade-in">
        <div className="rounded-2xl p-6 shadow-page" style={{
          background: '#FDF6E3',
          backgroundImage: 'linear-gradient(rgba(212,197,169,0.25) 1px, transparent 1px)',
          backgroundSize: '100% 32px',
          backgroundPosition: '0 22px',
        }}>
          {step === 'code' ? (
            <form onSubmit={handleCodeSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-pencil-gray mb-1.5">Class Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="e.g. ABC123"
                  maxLength={6}
                  className="w-full px-4 py-4 rounded-xl border-2 text-center text-pencil-gray placeholder-pencil-gray/40 text-2xl font-bold tracking-widest transition-colors"
                  style={{ background: 'rgba(253,246,227,0.8)', borderColor: '#D4C5A9', fontFamily: 'var(--font-caveat, cursive)', letterSpacing: 8 }}
                  onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                  onBlur={(e) => { e.target.style.borderColor = '#D4C5A9' }}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl text-white font-semibold text-base active:scale-95 transition-transform disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)', boxShadow: '0 4px 14px rgba(44,95,138,0.4)', minHeight: 52 }}>
                {loading ? 'Searching...' : 'Find Class →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-5">
              {/* Found class info */}
              <div className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: 'rgba(44,95,138,0.06)', border: '1px solid rgba(44,95,138,0.15)' }}>
                <span className="text-2xl">🏫</span>
                <div>
                  <div className="font-semibold text-ink-blue">{foundClass?.name}</div>
                  <div className="text-ink-blue/60 text-sm">{foundClass?.grade}</div>
                </div>
                <div className="ml-auto">
                  <span className="text-xs px-2 py-1 rounded-full text-green-700 font-medium" style={{ background: '#4CAF5020' }}>✓ Found</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-pencil-gray mb-1.5">Child&apos;s Full Name</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Amara Wanjiku"
                  className="w-full px-4 py-3 rounded-xl border-2 text-pencil-gray placeholder-pencil-gray/40 text-base transition-colors"
                  style={{ background: 'rgba(253,246,227,0.8)', borderColor: '#D4C5A9', fontFamily: 'var(--font-noto)' }}
                  onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                  onBlur={(e) => { e.target.style.borderColor = '#D4C5A9' }}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl text-white font-semibold text-base active:scale-95 transition-transform disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)', boxShadow: '0 4px 14px rgba(44,95,138,0.4)', minHeight: 52 }}>
                {loading ? 'Joining...' : 'Join Class →'}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-pencil-gray/40 mt-5">
          Ask your child&apos;s teacher for the class code.
        </p>
      </div>
    </div>
  )
}
