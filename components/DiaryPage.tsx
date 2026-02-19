'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  getTodayISO,
  getEntryByDate,
  upsertEntry,
  formatDisplayDate,
  type ChildProfile,
  type DiaryEntry,
} from '@/lib/db'

interface Props {
  profile: ChildProfile
  date?: string // if provided, shows that specific date (for history editing)
  readOnly?: boolean
}

export default function DiaryPage({ profile, date, readOnly = false }: Props) {
  const targetDate = date ?? getTodayISO()
  const isToday = targetDate === getTodayISO()

  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [subject, setSubject] = useState('')
  const [homework, setHomework] = useState('')
  const [teacherComment, setTeacherComment] = useState('')
  const [signed, setSigned] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    const existing = getEntryByDate(targetDate)
    if (existing) {
      setEntry(existing)
      setSubject(existing.subject)
      setHomework(existing.homework)
      setTeacherComment(existing.teacherComment)
      setSigned(existing.signed)
    } else {
      setEntry(null)
      setSubject('')
      setHomework('')
      setTeacherComment('')
      setSigned(false)
    }
    setDirty(false)
    setSaved(false)
  }, [targetDate])

  const handleSave = useCallback(() => {
    const updated = upsertEntry(targetDate, {
      subject,
      homework,
      teacherComment,
      signed,
    })
    setEntry(updated)
    setDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [targetDate, subject, homework, teacherComment, signed])

  // Auto-save on sign toggle
  useEffect(() => {
    if (!dirty) return
    const timer = setTimeout(handleSave, 800)
    return () => clearTimeout(timer)
  }, [dirty, handleSave])

  function markDirty() {
    setDirty(true)
    setSaved(false)
  }

  const displayDate = formatDisplayDate(targetDate)
  const [weekday, ...rest] = displayDate.split(', ')

  return (
    <div className="fade-in">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-5"
        style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
              {isToday ? "Today's Diary" : "Past Entry"}
            </div>
            <div
              className="text-white text-2xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-caveat, cursive)' }}
            >
              {weekday}
            </div>
            <div className="text-white/80 text-sm">{rest.join(', ')}</div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-xs mb-1">{profile.grade}</div>
            <div
              className="text-white font-semibold text-sm"
              style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 16 }}
            >
              {profile.name}
            </div>
            <div className="text-white/60 text-xs">{profile.school}</div>
          </div>
        </div>
      </div>

      {/* Diary page */}
      <div className="px-4 py-4">
        <div
          className="rounded-2xl overflow-hidden shadow-notebook"
          style={{
            background: '#FDF6E3',
          }}
        >
          {/* Notebook top binding */}
          <div
            className="h-3 flex gap-6 items-center px-8"
            style={{ background: '#EDE0C4' }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-full"
                style={{
                  background: 'linear-gradient(180deg, #C4A882 0%, #A0845C 100%)',
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                }}
              />
            ))}
          </div>

          <div
            className="px-5 py-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(212,197,169,0.3) 1px, transparent 1px)',
              backgroundSize: '100% 32px',
              backgroundPosition: '0 10px',
            }}
          >
            {/* Subject field */}
            <DiaryField
              label="Subject"
              icon="📚"
              value={subject}
              placeholder="e.g. Mathematics, English..."
              onChange={(v) => { setSubject(v); markDirty() }}
              readOnly={readOnly}
              multiline={false}
            />

            <div className="my-4 h-px bg-rule-line" />

            {/* Homework field */}
            <DiaryField
              label="Homework / Assignment"
              icon="📝"
              value={homework}
              placeholder="Write the homework here..."
              onChange={(v) => { setHomework(v); markDirty() }}
              readOnly={readOnly}
              multiline
              rows={4}
            />

            <div className="my-4 h-px bg-rule-line" />

            {/* Teacher comment */}
            <DiaryField
              label="Teacher's Comment"
              icon="💬"
              value={teacherComment}
              placeholder="Any message from the teacher..."
              onChange={(v) => { setTeacherComment(v); markDirty() }}
              readOnly={readOnly}
              multiline
              rows={3}
            />

            <div className="my-4 h-px bg-rule-line" />

            {/* Parent signature */}
            <div className="flex items-center gap-4 py-2">
              <button
                onClick={() => {
                  if (!readOnly) {
                    setSigned(!signed)
                    markDirty()
                  }
                }}
                className="flex items-center gap-3 flex-1 active:scale-95 transition-transform"
                style={{ minHeight: 44 }}
                disabled={readOnly}
              >
                <div
                  className="w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0"
                  style={{
                    borderColor: signed ? '#4CAF50' : '#D4C5A9',
                    background: signed ? '#4CAF50' : 'transparent',
                  }}
                >
                  {signed && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="text-left">
                  <div
                    className="font-semibold text-sm"
                    style={{ color: signed ? '#4CAF50' : '#4A4A4A' }}
                  >
                    {signed ? 'Work Ensured ✓' : 'Work Ensured'}
                  </div>
                  <div className="text-xs text-pencil-gray/60">
                    Parent&apos;s digital signature
                  </div>
                </div>
              </button>

              {/* Save status */}
              {!readOnly && (
                <div className="flex items-center gap-2">
                  {saved && (
                    <span className="text-xs text-green-600 font-medium fade-in">
                      Saved ✓
                    </span>
                  )}
                  {dirty && !saved && (
                    <button
                      onClick={handleSave}
                      className="text-xs px-3 py-1.5 rounded-lg text-white font-medium active:scale-95 transition-transform"
                      style={{
                        background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)',
                        minHeight: 'auto',
                      }}
                    >
                      Save
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom binding decoration */}
          <div
            className="h-2"
            style={{ background: 'linear-gradient(180deg, #EDE0C4 0%, #D4C5A9 100%)' }}
          />
        </div>

        {/* Reminder tip for today */}
        {isToday && !readOnly && (
          <p className="text-center text-xs text-pencil-gray/50 mt-4">
            Changes save automatically • All data stays on your device
          </p>
        )}
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  icon: string
  value: string
  placeholder: string
  onChange: (v: string) => void
  readOnly?: boolean
  multiline?: boolean
  rows?: number
}

function DiaryField({ label, icon, value, placeholder, onChange, readOnly, multiline, rows = 2 }: FieldProps) {
  return (
    <div className="notebook-margin">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-semibold text-ink-blue uppercase tracking-wider">{label}</span>
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={readOnly ? '—' : placeholder}
          rows={rows}
          readOnly={readOnly}
          className="w-full text-pencil-gray placeholder-pencil-gray/40 text-base leading-8"
          style={{
            fontFamily: value ? 'var(--font-caveat, cursive)' : 'var(--font-noto)',
            fontSize: value ? '18px' : '14px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            lineHeight: '32px',
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={readOnly ? '—' : placeholder}
          readOnly={readOnly}
          className="w-full text-pencil-gray placeholder-pencil-gray/40"
          style={{
            fontFamily: value ? 'var(--font-caveat, cursive)' : 'var(--font-noto)',
            fontSize: value ? '18px' : '14px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            lineHeight: '32px',
            height: '32px',
          }}
        />
      )}
    </div>
  )
}
