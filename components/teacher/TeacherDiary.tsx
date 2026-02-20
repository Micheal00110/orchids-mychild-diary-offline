'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getTodayISO, formatDisplayDate, type UserSession, type ClassInfo, type Membership } from '@/lib/store'
import TeacherAnalytics from './TeacherAnalytics'

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
  onChat?: (m: Membership) => void
}

export default function TeacherDiary({ session, classInfo, memberships, onChat }: Props) {
  const [selectedDate, setSelectedDate] = useState(getTodayISO())
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null)
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [dirty, setDirty] = useState<Record<string, boolean>>({})
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [sendingDiary, setSendingDiary] = useState(false)

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

  async function handleSendMessage() {
    if (!messageText.trim() || !selectedMembership) return
    setSendingMessage(true)
    await supabase.from('messages').insert({
      membership_id: selectedMembership.id,
      class_id: classInfo.id,
      sender_id: session.id,
      sender_role: 'teacher',
      content: messageText.trim(),
    })
    setMessageText('')
    setSendingMessage(false)
  }

  async function handleSendDiaryEntry() {
    if (!selectedMembership || !currentEntry) return
    setSendingDiary(true)

    // Format date for message context
    let formattedDate = ''
    if (currentEntry.date) {
      const d = new Date(currentEntry.date)
      formattedDate = d.toLocaleDateString('en-KE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    } else {
      const d = new Date()
      formattedDate = d.toLocaleDateString('en-KE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    }

    // Combine all diary info into a formatted message
    const diaryContent = [
      `Date: ${formattedDate}`,
      currentEntry.subject && `📚 Subject: ${currentEntry.subject}`,
      currentEntry.homework && `📝 Homework: ${currentEntry.homework}`,
      currentEntry.teacher_comment && `💬 Note: ${currentEntry.teacher_comment}`,
    ].filter(Boolean).join('\n\n')

    if (diaryContent) {
      await supabase.from('messages').insert({
        membership_id: selectedMembership.id,
        class_id: classInfo.id,
        sender_id: session.id,
        sender_role: 'teacher',
        content: diaryContent,
      })
    }
    setSendingDiary(false)
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
        {/* Analytics Section */}
        {isToday && (
          <div className="mb-6">
            <TeacherAnalytics classInfo={classInfo} />
          </div>
        )}

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

            {/* Chat button */}
            {onChat && (
              <button
                onClick={() => onChat(selectedMembership)}
                className="w-full mb-4 py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm active:scale-95 transition-transform"
                style={{ background: 'rgba(44,95,138,0.1)', color: '#2C5F8A', minHeight: 44 }}>
                <span>💬</span>
                Message {selectedMembership.child_name}'s Parent
              </button>
            )}

            {/* Quick Message & Ensure Work - FIRST ELEMENT */}
            <div className="rounded-2xl overflow-hidden shadow-notebook mb-4" style={{ background: '#FDF6E3' }}>
              {/* Student name bar */}
              <div className="px-5 py-3 flex items-center gap-3 border-b border-rule-line">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2C5F8A, #7EB3D4)' }}>
                  {selectedMembership.child_name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-pencil-gray">{selectedMembership.child_name}</span>
              </div>

              {/* Message Input Section */}
              <div className="px-5 py-4 border-b border-rule-line">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">💭</span>
                  <span className="text-xs font-semibold text-ink-blue uppercase tracking-wider">Quick Message</span>
                </div>
                <div className="flex gap-2 items-end">
                  <textarea
                    value={messageText}
                    onChange={(e) => { setMessageText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px' }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
                    placeholder="Send a message to parent..."
                    rows={1}
                    className="flex-1 text-pencil-gray placeholder-pencil-gray/40 text-sm"
                    style={{ background: 'rgba(253,246,227,0.8)', border: '1px solid #D4C5A9', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--font-noto)', resize: 'none', outline: 'none', minHeight: 36 }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendingMessage}
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center active:scale-95 transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #2C5F8A, #1a3d5c)', minHeight: 'auto' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 9h14M9 2l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Work Ensured Section */}
              {currentEntry && (
                <div className="px-5 py-4">
                  <button onClick={() => updateEntry(selectedMembership.id, 'signed', !currentEntry.signed)}
                    className="flex items-center gap-4 py-2 w-full active:scale-95 transition-transform" style={{ minHeight: 44 }}>
                    <div className="w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0"
                      style={{ borderColor: currentEntry.signed ? '#4CAF50' : '#D4C5A9', background: currentEntry.signed ? '#4CAF5020' : 'transparent' }}>
                      {currentEntry.signed ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 6l2.5 2.5L10 3" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : <div className="w-2 h-2 rounded-full bg-gray-400" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: currentEntry.signed ? '#4CAF50' : '#9E9E9E' }}>
                        {currentEntry.signed ? 'Work Ensured ✓' : 'Mark Work as Ensured'}
                      </div>
                      <div className="text-xs text-pencil-gray/50">Check when ready for parent</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

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
                  {/* Parent signed status & Send button */}
                  {currentEntry && (
                    <div className="space-y-3">
                      <button
                        onClick={handleSendDiaryEntry}
                        disabled={sendingDiary || (!currentEntry.subject && !currentEntry.homework && !currentEntry.teacher_comment)}
                        className="w-full flex items-center justify-between gap-3 py-3 px-4 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        style={{
                          background: 'linear-gradient(135deg, #2C5F8A, #1a3d5c)',
                          minHeight: 44,
                        }}>
                        <div className="flex items-center gap-3">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M2 9h14M9 2l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-sm font-medium text-white">
                            {sendingDiary ? 'Sending...' : 'Send Diary to Parent'}
                          </span>
                        </div>
                        {sendingDiary && (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        )}
                      </button>
                      
                      <div className="flex items-center gap-3 py-2 px-2 rounded-xl transition-all"
                        style={{ background: currentEntry.signed ? '#4CAF5015' : '#FFB74D15' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: currentEntry.signed ? '#4CAF50' : '#FFB74D' }}>
                          {currentEntry.signed ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="6" r="2" fill="white" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium" style={{ color: currentEntry.signed ? '#4CAF50' : '#FFB74D' }}>
                            {currentEntry.signed ? 'Parent Signed ✓' : 'Awaiting Parent Signature'}
                          </div>
                          <div className="text-xs text-pencil-gray/50">
                            {currentEntry.signed ? 'Parent confirmed receipt' : 'Parent will sign after reviewing'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
