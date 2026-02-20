'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getTodayISO, formatDisplayDate, type UserSession, type Membership, type ClassInfo } from '@/lib/store'
import ParentInsights from './ParentInsights'

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
  membership: Membership
  allMemberships: Membership[]
  onSwitchChild: (m: Membership) => void
  onChat: (m: Membership) => void
}

export default function ParentDiary({ session, membership, allMemberships, onSwitchChild, onChat }: Props) {
  const classInfo = membership.class as ClassInfo
  const [selectedDate, setSelectedDate] = useState(getTodayISO())
  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [signingLoading, setSigningLoading] = useState(false)
  const [savingMsg, setSavingMsg] = useState('')
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  const loadEntry = useCallback(async () => {
    const { data } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('membership_id', membership.id)
      .eq('date', selectedDate)
      .single()
    setEntry(data as DiaryEntry ?? null)
  }, [membership.id, selectedDate])

  useEffect(() => { loadEntry() }, [loadEntry])

  // Real-time updates when teacher fills the diary
  useEffect(() => {
    const channel = supabase
      .channel('diary-' + membership.id + '-' + selectedDate)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'diary_entries',
        filter: `membership_id=eq.${membership.id}`,
      }, (payload) => {
        if ((payload.new as DiaryEntry)?.date === selectedDate) {
          setEntry(payload.new as DiaryEntry)
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [membership.id, selectedDate])

  async function handleSign() {
    setSigningLoading(true)
    if (entry?.id) {
      const { data } = await supabase
        .from('diary_entries')
        .update({ signed: !entry.signed, updated_at: new Date().toISOString() })
        .eq('id', entry.id)
        .select()
        .single()
      if (data) setEntry(data as DiaryEntry)
      setSavingMsg(data?.signed ? 'Signed ✓' : 'Signature removed')
    } else {
      // Create entry with just signed state
      const { data } = await supabase
        .from('diary_entries')
        .insert({
          membership_id: membership.id,
          class_id: classInfo.id,
          date: selectedDate,
          subject: '',
          homework: '',
          teacher_comment: '',
          signed: true,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      if (data) setEntry(data as DiaryEntry)
      setSavingMsg('Signed ✓')
    }
    setSigningLoading(false)
    setTimeout(() => setSavingMsg(''), 2500)
  }

  async function handleSendMessage() {
    if (!messageText.trim()) return
    setSendingMessage(true)
    try {
      const { data, error } = await supabase.from('messages').insert({
        membership_id: membership.id,
        class_id: classInfo.id,
        sender_id: session.id,
        sender_role: 'parent',
        content: messageText.trim(),
      }).select()

      if (error) {
        console.error('Error sending message:', error)
        if (error.stack) console.error(error.stack)
        console.error('Context - membership:', membership.id, 'class:', classInfo.id)
        alert('Failed to send message. Please try again.')
        return
      }

      if (data) {
        setMessageText('')
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  const isToday = selectedDate === getTodayISO()
  const displayDate = formatDisplayDate(selectedDate)
  const [weekday, ...rest] = displayDate.split(', ')

  // Date picker: last 7 days
  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    dates.push(iso)
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}>
        {/* Child switcher */}
        {allMemberships.length > 1 && (
          <div className="flex gap-2 mb-3 overflow-x-auto -mx-1 px-1">
            {allMemberships.map((m) => (
              <button key={m.id} onClick={() => onSwitchChild(m)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
                style={{
                  background: m.id === membership.id ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  color: m.id === membership.id ? 'white' : 'rgba(255,255,255,0.6)',
                  border: m.id === membership.id ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                  minHeight: 'auto',
                }}>
                {m.child_name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-start justify-between">
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
              {isToday ? "Today's Diary" : "Past Entry"}
            </div>
            <div className="text-white text-2xl font-bold leading-tight" style={{ fontFamily: 'var(--font-caveat, cursive)' }}>
              {weekday}
            </div>
            <div className="text-white/80 text-sm">{rest.join(', ')}</div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-xs mb-0.5">{classInfo?.grade}</div>
            <div className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 16 }}>
              {membership.child_name}
            </div>
            <div className="text-white/60 text-xs">{classInfo?.name}</div>
          </div>
        </div>

        {/* Date scroller */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
          {dates.map((d) => {
            const day = parseInt(d.slice(8, 10))
            const monthShort = new Date(d + 'T12:00:00').toLocaleDateString('en-KE', { month: 'short' })
            const isSelected = d === selectedDate
            return (
              <button key={d} onClick={() => setSelectedDate(d)}
                className="flex-shrink-0 w-12 flex flex-col items-center py-2 rounded-xl transition-all active:scale-95"
                style={{
                  background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  border: isSelected ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
                  minHeight: 'auto',
                }}>
                <span className="text-white/60 text-xs">{monthShort}</span>
                <span className="text-white font-bold text-lg leading-none">{day}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Chat button */}
        <button
          onClick={() => onChat(membership)}
          className="w-full mb-4 py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm active:scale-95 transition-transform"
          style={{ background: 'rgba(44,95,138,0.1)', color: '#2C5F8A', minHeight: 44 }}>
          <span>💬</span>
          Chat with {classInfo?.name} Teacher
        </button>

        {/* Diary card - now FIRST ELEMENT */}
        <div className="rounded-2xl overflow-hidden shadow-notebook mb-4" style={{ background: '#FDF6E3' }}>
          {/* Notebook top binding */}
          <div className="h-3 flex gap-6 items-center px-8" style={{ background: '#EDE0C4' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-4 h-full"
                style={{ background: 'linear-gradient(180deg, #C4A882 0%, #A0845C 100%)', clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
            ))}
          </div>

          <div className="px-5 py-5" style={{
            backgroundImage: 'linear-gradient(rgba(212,197,169,0.3) 1px, transparent 1px)',
            backgroundSize: '100% 32px',
            backgroundPosition: '0 10px',
          }}>
            {!entry || (!entry.subject && !entry.homework && !entry.teacher_comment) ? (
              <div className="py-8 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-pencil-gray font-medium mb-1">No entry yet for this day</p>
                <p className="text-pencil-gray/50 text-sm">Your teacher hasn&apos;t filled the diary for this date.</p>
              </div>
            ) : (
              <>
                <ReadField label="Subject" icon="📚" value={entry.subject} />
                <div className="my-4 h-px" style={{ background: '#D4C5A9' }} />
                <ReadField label="Homework / Assignment" icon="📝" value={entry.homework} />
                <div className="my-4 h-px" style={{ background: '#D4C5A9' }} />
                <ReadField label="Teacher's Comment" icon="💬" value={entry.teacher_comment} />
                <div className="my-4 h-px" style={{ background: '#D4C5A9' }} />
              </>
            )}
          </div>
          <div className="h-2" style={{ background: 'linear-gradient(180deg, #EDE0C4 0%, #D4C5A9 100%)' }} />
        </div>

        {/* Quick Message & Sign Section - now SECOND ELEMENT */}
        <div className="rounded-2xl overflow-hidden shadow-notebook" style={{ background: '#FDF6E3' }}>
          {/* Header */}
          <div className="px-5 py-3 border-b border-rule-line">
            <span className="font-semibold text-pencil-gray">{membership.child_name}</span>
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
                placeholder="Ask teacher a question..."
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

          {/* Sign/Ensure Work Section */}
          {entry && (
            <div className="px-5 py-4">
              <button onClick={() => handleSign()}
                disabled={signingLoading}
                className="flex items-center gap-4 py-2 w-full active:scale-95 transition-transform disabled:opacity-60" style={{ minHeight: 44 }}>
                <div className="w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0"
                  style={{ borderColor: entry.signed ? '#4CAF50' : '#D4C5A9', background: entry.signed ? '#4CAF5020' : 'transparent' }}>
                  {entry.signed ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 6l2.5 2.5L10 3" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : <div className="w-2 h-2 rounded-full bg-gray-400" />}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: entry.signed ? '#4CAF50' : '#9E9E9E' }}>
                    {entry.signed ? 'Work Ensured ✓' : 'Mark Work as Ensured'}
                  </div>
                  <div className="text-xs text-pencil-gray/50">{savingMsg || 'Sign to confirm'}</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Insights Section */}
        <div className="mb-4">
          <ParentInsights membership={membership} />
        </div>

        {isToday && (
          <p className="text-center text-xs text-pencil-gray/50 mt-4">
            Diary updates in real-time when your teacher fills it
          </p>
        )}
      </div>
    </div>
  )
}

function ReadField({ label, icon, value }: { label: string; icon: string; value: string }) {
  return (
    <div style={{ borderLeft: '3px solid rgba(126,179,212,0.5)', paddingLeft: 16 }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-semibold text-ink-blue uppercase tracking-wider">{label}</span>
      </div>
      {value ? (
        <p className="text-pencil-gray leading-8"
          style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 18, minHeight: 32 }}>
          {value}
        </p>
      ) : (
        <p className="text-pencil-gray/30 text-sm leading-8" style={{ minHeight: 32 }}>—</p>
      )}
    </div>
  )
}
