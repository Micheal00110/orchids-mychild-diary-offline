'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getTodayISO, formatDisplayDate, type UserSession, type ClassInfo, type Membership } from '@/lib/store'

interface DiaryEntry {
  id?: string
  membership_id: string
  class_id: string
  date: string
  subject: string
  homework: string
  teacher_comment: string
  signed: boolean
}

interface Props {
  session: UserSession
  classInfo: ClassInfo
  memberships: Membership[]
}

export default function TeacherDiary({ session, classInfo, memberships }: Props) {
  const [selectedDate, setSelectedDate] = useState(getTodayISO())
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null)
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [dirty, setDirty] = useState<Record<string, boolean>>({})

  // Load entries for all students on selected date
  useEffect(() => {
    if (memberships.length === 0) return
    loadEntries()
  }, [selectedDate, memberships.length])

  async function loadEntries() {
    const membershipIds = memberships.map((m) => m.id)
    const { data } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('class_id', classInfo.id)
      .eq('date', selectedDate)
      .in('membership_id', membershipIds)

    const map: Record<string, DiaryEntry> = {}
    for (const m of memberships) {
      const existing = data?.find((e: DiaryEntry) => e.membership_id === m.id)
      map[m.id] = existing ?? {
        membership_id: m.id,
        class_id: classInfo.id,
        date: selectedDate,
        subject: '',
        homework: '',
        teacher_comment: '',
        signed: false,
      }
    }
    setEntries(map)
    setDirty({})
    setSaved({})
  }

  function updateEntry(membershipId: string, field: keyof DiaryEntry, value: string | boolean) {
    setEntries((prev) => ({
      ...prev,
      [membershipId]: { ...prev[membershipId]!, [field]: value },
    }))
    setDirty((prev) => ({ ...prev, [membershipId]: true }))
    setSaved((prev) => ({ ...prev, [membershipId]: false }))
  }

  async function saveEntry(membershipId: string) {
    const entry = entries[membershipId]
    if (!entry) return
    setSaving((prev) => ({ ...prev, [membershipId]: true }))
    const payload = {
      membership_id: entry.membership_id,
      class_id: entry.class_id,
      date: entry.date,
      subject: entry.subject,
      homework: entry.homework,
      teacher_comment: entry.teacher_comment,
      signed: entry.signed,
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('diary_entries')
      .upsert(payload, { onConflict: 'membership_id,date' })
      .select()
      .single()

    setSaving((prev) => ({ ...prev, [membershipId]: false }))
    setDirty((prev) => ({ ...prev, [membershipId]: false }))
    if (!error && data) {
      setEntries((prev) => ({ ...prev, [membershipId]: data as DiaryEntry }))
      setSaved((prev) => ({ ...prev, [membershipId]: true }))
      setTimeout(() => setSaved((prev) => ({ ...prev, [membershipId]: false })), 2000)
    }
  }

  // Auto-save after 1s of inactivity per student
  useEffect(() => {
    const timers: Record<string, ReturnType<typeof setTimeout>> = {}
    for (const [mid, isDirty] of Object.entries(dirty)) {
      if (isDirty) {
        timers[mid] = setTimeout(() => saveEntry(mid), 1000)
      }
    }
    return () => { for (const t of Object.values(timers)) clearTimeout(t) }
  }, [dirty, entries])

  const displayDate = formatDisplayDate(selectedDate)
  const isToday = selectedDate === getTodayISO()

  // Date picker: last 7 days + today
  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    dates.push(iso)
  }

  const currentEntry = selectedMembership ? entries[selectedMembership.id] : null

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}>
        <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Teacher Dashboard</div>
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-caveat, cursive)' }}>
          {isToday ? "Today's Diary" : "Past Entry"}
        </h2>
        <p className="text-white/70 text-sm">{classInfo.name} • {displayDate.split(',').slice(0, 2).join(',')}</p>

        {/* Date scroller */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
          {dates.map((d) => {
            const day = parseInt(d.slice(8, 10))
            const monthShort = new Date(d + 'T12:00:00').toLocaleDateString('en-KE', { month: 'short' })
            const isSelected = d === selectedDate
            return (
              <button
                key={d}
                onClick={() => { setSelectedDate(d); setSelectedMembership(null) }}
                className="flex-shrink-0 w-12 flex flex-col items-center py-2 rounded-xl transition-all active:scale-95"
                style={{
                  background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  border: isSelected ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
                  minHeight: 'auto',
                }}
              >
                <span className="text-white/60 text-xs">{monthShort}</span>
                <span className="text-white font-bold text-lg leading-none">{day}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 py-4">
        {memberships.length === 0 ? (
          <div className="rounded-2xl p-8 text-center shadow-page" style={{ background: '#FDF6E3' }}>
            <div className="text-5xl mb-4">📬</div>
            <p className="text-pencil-gray font-medium mb-1">No students yet</p>
            <p className="text-pencil-gray/60 text-sm">Share your class code with parents to get started.</p>
          </div>
        ) : !selectedMembership ? (
          /* Student picker */
          <div className="space-y-3">
            <p className="text-pencil-gray/60 text-xs font-medium uppercase tracking-wider px-1">Select a student to fill diary</p>
            {memberships.map((m) => {
              const e = entries[m.id]
              const hasContent = e && (e.subject || e.homework || e.teacher_comment)
              return (
                <button key={m.id} onClick={() => setSelectedMembership(m)}
                  className="w-full text-left active:scale-95 transition-transform" style={{ minHeight: 'auto' }}>
                  <div className="rounded-xl overflow-hidden shadow-page" style={{ background: '#FDF6E3' }}>
                    <div className="h-1" style={{
                      background: hasContent
                        ? 'linear-gradient(90deg, #2C5F8A, #7EB3D4)'
                        : 'linear-gradient(90deg, #D4C5A9, #EDE0C4)'
                    }} />
                    <div className="px-4 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #2C5F8A, #7EB3D4)' }}>
                        {m.child_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-pencil-gray">{m.child_name}</div>
                        <div className="text-pencil-gray/50 text-xs">
                          {hasContent ? `📚 ${e?.subject || 'Entry filled'}` : 'No entry yet'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {saving[m.id] && <span className="text-xs text-pencil-gray/40">saving...</span>}
                        {saved[m.id] && <span className="text-xs text-green-600">✓</span>}
                        <div className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: hasContent ? '#2C5F8A20' : '#E0E0E0' }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M5 3l4 4-4 4" stroke={hasContent ? '#2C5F8A' : '#9E9E9E'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          /* Entry form for selected student */
          <div>
            <button
              onClick={() => setSelectedMembership(null)}
              className="flex items-center gap-2 text-ink-blue text-sm font-medium mb-4 active:scale-95 transition-transform"
              style={{ minHeight: 'auto' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Students
            </button>

            <div className="rounded-2xl overflow-hidden shadow-notebook" style={{ background: '#FDF6E3' }}>
              {/* Student name bar */}
              <div className="px-5 py-3 flex items-center gap-3 border-b border-rule-line">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2C5F8A, #7EB3D4)' }}>
                  {selectedMembership.child_name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-pencil-gray">{selectedMembership.child_name}</span>
                <div className="ml-auto flex items-center gap-2">
                  {saving[selectedMembership.id] && <span className="text-xs text-pencil-gray/40">saving...</span>}
                  {saved[selectedMembership.id] && <span className="text-xs text-green-600 fade-in">Saved ✓</span>}
                  {dirty[selectedMembership.id] && !saving[selectedMembership.id] && (
                    <button
                      onClick={() => saveEntry(selectedMembership.id)}
                      className="text-xs px-3 py-1.5 rounded-lg text-white font-medium active:scale-95 transition-transform"
                      style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)', minHeight: 'auto' }}>
                      Save
                    </button>
                  )}
                </div>
              </div>

              {/* Notebook top binding */}
              <div className="h-3 flex gap-6 items-center px-8" style={{ background: '#EDE0C4' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-4 h-full"
                    style={{ background: 'linear-gradient(180deg, #C4A882 0%, #A0845C 100%)', clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
                ))}
              </div>

              {currentEntry && (
                <div className="px-5 py-5" style={{
                  backgroundImage: 'linear-gradient(rgba(212,197,169,0.3) 1px, transparent 1px)',
                  backgroundSize: '100% 32px',
                  backgroundPosition: '0 10px',
                }}>
                  <DiaryField label="Subject" icon="📚" value={currentEntry.subject}
                    placeholder="e.g. Mathematics, English..."
                    onChange={(v) => updateEntry(selectedMembership.id, 'subject', v)} />
                  <div className="my-4 h-px" style={{ background: '#D4C5A9' }} />
                  <DiaryField label="Homework / Assignment" icon="📝" value={currentEntry.homework}
                    placeholder="Write homework details here..."
                    onChange={(v) => updateEntry(selectedMembership.id, 'homework', v)} multiline rows={4} />
                  <div className="my-4 h-px" style={{ background: '#D4C5A9' }} />
                  <DiaryField label="Teacher's Comment" icon="💬" value={currentEntry.teacher_comment}
                    placeholder="Any note for the parent..."
                    onChange={(v) => updateEntry(selectedMembership.id, 'teacher_comment', v)} multiline rows={3} />
                  <div className="my-4 h-px" style={{ background: '#D4C5A9' }} />
                  {/* Parent signed status (read-only for teacher) */}
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: currentEntry.signed ? '#4CAF50' : '#E0E0E0' }}>
                      {currentEntry.signed ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : <div className="w-2 h-2 rounded-full bg-gray-400" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: currentEntry.signed ? '#4CAF50' : '#9E9E9E' }}>
                        {currentEntry.signed ? 'Parent Signed ✓' : 'Awaiting Parent Signature'}
                      </div>
                      <div className="text-xs text-pencil-gray/50">Parent marks this when work is ensured</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="h-2" style={{ background: 'linear-gradient(180deg, #EDE0C4 0%, #D4C5A9 100%)' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DiaryField({ label, icon, value, placeholder, onChange, multiline, rows = 2 }: {
  label: string; icon: string; value: string; placeholder: string
  onChange: (v: string) => void; multiline?: boolean; rows?: number
}) {
  return (
    <div style={{ borderLeft: '3px solid rgba(126,179,212,0.5)', paddingLeft: 16 }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-semibold text-ink-blue uppercase tracking-wider">{label}</span>
      </div>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
          className="w-full text-pencil-gray placeholder-pencil-gray/40"
          style={{ fontFamily: value ? 'var(--font-caveat, cursive)' : 'var(--font-noto)', fontSize: value ? 18 : 14, background: 'transparent', border: 'none', padding: 0, lineHeight: '32px', resize: 'none', outline: 'none' }} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full text-pencil-gray placeholder-pencil-gray/40"
          style={{ fontFamily: value ? 'var(--font-caveat, cursive)' : 'var(--font-noto)', fontSize: value ? 18 : 14, background: 'transparent', border: 'none', padding: 0, lineHeight: '32px', height: 32, outline: 'none' }} />
      )}
    </div>
  )
}
