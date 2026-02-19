'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { generateClassCode, type UserSession, type ClassInfo } from '@/lib/store'

const GRADES = ['PP1','PP2','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Form 1','Form 2','Form 3','Form 4']

interface Props {
  session: UserSession
  onCreate: (c: ClassInfo) => void
}

export default function CreateClass({ session, onCreate }: Props) {
  const [className, setClassName] = useState('')
  const [grade, setGrade] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!className.trim()) { setError('Please enter a class name'); return }
    if (!grade) { setError('Please select a grade'); return }
    setLoading(true)
    setError('')

    // Try to generate unique code
    let code = generateClassCode()
    let attempts = 0
    while (attempts < 5) {
      const { data: existing } = await supabase.from('classes').select('id').eq('class_code', code).single()
      if (!existing) break
      code = generateClassCode()
      attempts++
    }

    const { data, error: dbError } = await supabase
      .from('classes')
      .insert({ teacher_id: session.id, name: className.trim(), grade, class_code: code })
      .select()
      .single()

    setLoading(false)
    if (dbError) { setError(dbError.message); return }
    onCreate(data as ClassInfo)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #EDE0C4 100%)' }}>
      <div className="px-6 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}>
        <div className="text-4xl mb-2">🏫</div>
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-caveat, cursive)' }}>Create Your Class</h1>
        <p className="text-white/70 text-sm">Set up your class once. A unique code will be generated for parents to join.</p>
      </div>

      <div className="flex-1 px-5 pt-6 pb-6 fade-in">
        <div className="rounded-2xl p-6 shadow-page" style={{
          background: '#FDF6E3',
          backgroundImage: 'linear-gradient(rgba(212,197,169,0.25) 1px, transparent 1px)',
          backgroundSize: '100% 32px',
          backgroundPosition: '0 22px',
        }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-pencil-gray mb-1.5">Class Name</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. Grade 5 Blue, Class 3A..."
                className="w-full px-4 py-3 rounded-xl border-2 text-pencil-gray placeholder-pencil-gray/40 text-base transition-colors"
                style={{ background: 'rgba(253,246,227,0.8)', borderColor: '#D4C5A9', fontFamily: 'var(--font-noto)' }}
                onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                onBlur={(e) => { e.target.style.borderColor = '#D4C5A9' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pencil-gray mb-1.5">Grade / Level</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 text-pencil-gray text-base appearance-none cursor-pointer"
                style={{ background: 'rgba(253,246,227,0.8)', borderColor: '#D4C5A9', fontFamily: 'var(--font-noto)' }}
                onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                onBlur={(e) => { e.target.style.borderColor = '#D4C5A9' }}
              >
                <option value="">Select grade...</option>
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(44,95,138,0.06)', border: '1px solid rgba(44,95,138,0.15)' }}>
              <span className="text-lg flex-shrink-0">🔑</span>
              <p className="text-ink-blue/80 text-sm">
                A unique 6-character class code will be auto-generated. Share it with parents so they can link to your class.
              </p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold text-base active:scale-95 transition-transform disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)', boxShadow: '0 4px 14px rgba(44,95,138,0.4)', minHeight: 52 }}
            >
              {loading ? 'Creating...' : 'Create Class →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
