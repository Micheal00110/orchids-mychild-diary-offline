'use client'

import { useState } from 'react'
import { saveProfile, type ChildProfile } from '@/lib/db'

interface Props {
  onComplete: (profile: ChildProfile) => void
}

export default function ProfileSetup({ onComplete }: Props) {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [school, setSchool] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const grades = [
    'PP1', 'PP2',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
    'Grade 7', 'Grade 8', 'Grade 9',
    'Form 1', 'Form 2', 'Form 3', 'Form 4',
  ]

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Please enter your child\'s name'
    if (!grade) errs.grade = 'Please select a grade'
    if (!school.trim()) errs.school = 'Please enter the school name'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const profile = saveProfile({ name, grade, school })
    onComplete(profile)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #EDE0C4 100%)' }}
    >
      {/* Header */}
      <div
        className="px-6 pt-12 pb-6"
        style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}
      >
        <div className="text-white/70 text-sm mb-1">Welcome to</div>
        <h1
          className="text-3xl font-bold text-white mb-1"
          style={{ fontFamily: 'var(--font-caveat, cursive)' }}
        >
          MyChild Diary
        </h1>
        <p className="text-white/80 text-sm">Set up your child's profile to get started</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 pt-8 pb-6 fade-in">
        <div
          className="rounded-2xl p-6 shadow-page"
          style={{
            background: '#FDF6E3',
            backgroundImage: 'linear-gradient(rgba(212,197,169,0.25) 1px, transparent 1px)',
            backgroundSize: '100% 32px',
            backgroundPosition: '0 22px',
          }}
        >
          <h2 className="text-lg font-semibold text-pencil-gray mb-6 flex items-center gap-2">
            <span className="text-2xl">👶</span>
            Child&apos;s Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-pencil-gray mb-1.5">
                Child&apos;s Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amara Wanjiku"
                className="w-full px-4 py-3 rounded-xl border-2 text-pencil-gray placeholder-pencil-gray/40 text-base transition-colors"
                style={{
                  background: 'rgba(253,246,227,0.8)',
                  borderColor: errors.name ? '#e53e3e' : '#D4C5A9',
                  fontFamily: 'var(--font-noto)',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                onBlur={(e) => { e.target.style.borderColor = errors.name ? '#e53e3e' : '#D4C5A9' }}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-pencil-gray mb-1.5">
                Class / Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 text-pencil-gray text-base appearance-none transition-colors cursor-pointer"
                style={{
                  background: `rgba(253,246,227,0.8) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%234A4A4A' d='M6 8L0 0h12z'/%3E%3C/svg%3E") no-repeat right 14px center`,
                  borderColor: errors.grade ? '#e53e3e' : '#D4C5A9',
                  fontFamily: 'var(--font-noto)',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                onBlur={(e) => { e.target.style.borderColor = errors.grade ? '#e53e3e' : '#D4C5A9' }}
              >
                <option value="">Select grade...</option>
                {grades.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
            </div>

            {/* School */}
            <div>
              <label className="block text-sm font-medium text-pencil-gray mb-1.5">
                School Name
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. St. Mary's Primary School"
                className="w-full px-4 py-3 rounded-xl border-2 text-pencil-gray placeholder-pencil-gray/40 text-base transition-colors"
                style={{
                  background: 'rgba(253,246,227,0.8)',
                  borderColor: errors.school ? '#e53e3e' : '#D4C5A9',
                  fontFamily: 'var(--font-noto)',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                onBlur={(e) => { e.target.style.borderColor = errors.school ? '#e53e3e' : '#D4C5A9' }}
              />
              {errors.school && <p className="text-red-500 text-xs mt-1">{errors.school}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-white font-semibold text-base mt-2 active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)',
                boxShadow: '0 4px 14px rgba(44,95,138,0.4)',
                minHeight: 52,
              }}
            >
              Start My Diary →
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-pencil-gray/50 mt-5">
          All data stays on your device. No internet needed.
        </p>
      </div>
    </div>
  )
}
