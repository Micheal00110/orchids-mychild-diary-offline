'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getTeacherClassId, saveTeacherClassId, generateClassCode, clearSession, type UserSession, type ClassInfo, type Membership } from '@/lib/store'
import CreateClass from './CreateClass'
import TeacherDiary from './TeacherDiary'
import ChatScreen from '../ChatScreen'

type View = 'diary' | 'students' | 'chat' | 'settings'

interface Props {
  session: UserSession
  onLogout: () => void
}

export default function TeacherApp({ session, onLogout }: Props) {
  const [classInfo, setClassInfo] = useState<ClassInfo | null | undefined>(undefined)
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [view, setView] = useState<View>('diary')
  const [chatMembership, setChatMembership] = useState<Membership | null>(null)
  const [loadingClass, setLoadingClass] = useState(true)

  useEffect(() => {
    loadClass()
  }, [])

  async function loadClass() {
    setLoadingClass(true)
    const classId = getTeacherClassId()
    if (!classId) {
      // Check if teacher already has a class in DB
      const { data } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', session.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (data) {
        saveTeacherClassId(data.id)
        setClassInfo(data as ClassInfo)
        await loadMemberships(data.id)
      } else {
        setClassInfo(null)
      }
    } else {
      const { data } = await supabase.from('classes').select('*').eq('id', classId).single()
      if (data) {
        setClassInfo(data as ClassInfo)
        await loadMemberships(data.id)
      } else {
        setClassInfo(null)
      }
    }
    setLoadingClass(false)
  }

  async function loadMemberships(classId: string) {
    const { data, error } = await supabase
      .from('class_memberships')
      .select('*, class:classes(*)')
      .eq('class_id', classId)
      .order('joined_at', { ascending: true })
    if (error) {
      console.error('Error loading memberships:', error)
      return
    }
    if (data) {
      console.log('Memberships loaded:', data)
      setMemberships(data as Membership[])
    }
  }

  // Periodic refresh of memberships (safety net for real-time)
  useEffect(() => {
    if (!classInfo) return
    // Reload memberships every 5 seconds to ensure sync
    const interval = setInterval(() => {
      loadMemberships(classInfo.id)
    }, 5000)
    return () => clearInterval(interval)
  }, [classInfo?.id])

  // Subscribe to new memberships (parents joining)
  useEffect(() => {
    if (!classInfo) return
    const channel = supabase
      .channel('memberships-' + classInfo.id)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'class_memberships', 
        filter: `class_id=eq.${classInfo.id}` 
      }, (payload) => {
        // When a parent joins, reload the memberships list
        console.log('New membership detected:', payload)
        loadMemberships(classInfo.id)
      })
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })
    return () => { supabase.removeChannel(channel) }
  }, [classInfo?.id])

  if (loadingClass) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #EDE0C4 100%)' }}>
        <div className="text-pencil-gray/50 text-sm">Loading...</div>
      </div>
    )
  }

  if (classInfo === null) {
    return <CreateClass session={session} onCreate={(c) => { setClassInfo(c); saveTeacherClassId(c.id) }} />
  }

  if (chatMembership) {
    return (
      <ChatScreen
        session={session}
        membership={chatMembership}
        classInfo={classInfo!}
        onBack={() => setChatMembership(null)}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative">
      <main className="flex-1 pb-20">
        {view === 'diary' && (
          <TeacherDiary session={session} classInfo={classInfo!} memberships={memberships} onChat={(m) => { setChatMembership(m) }} />
        )}
        {view === 'students' && (
          <StudentsView
            session={session}
            classInfo={classInfo!}
            memberships={memberships}
            onChat={(m) => { setChatMembership(m) }}
          />
        )}
        {view === 'settings' && (
          <TeacherSettings session={session} classInfo={classInfo!} onLogout={() => { clearSession(); onLogout() }} />
        )}
      </main>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto"
        style={{ background: 'rgba(253,246,227,0.97)', backdropFilter: 'blur(8px)', borderTop: '1px solid #D4C5A9', boxShadow: '0 -2px 12px rgba(0,0,0,0.08)' }}>
        <div className="flex">
          {([
            { id: 'diary', label: 'Diary', emoji: '📓' },
            { id: 'students', label: 'Students', emoji: '👥' },
            { id: 'settings', label: 'Settings', emoji: '⚙️' },
          ] as { id: View; label: string; emoji: string }[]).map((tab) => {
            const active = view === tab.id
            return (
              <button key={tab.id} onClick={() => setView(tab.id as View)}
                className="flex-1 flex flex-col items-center justify-center py-3 active:scale-95 transition-transform"
                style={{ minHeight: 64 }}>
                <span className="text-xl mb-0.5">{tab.emoji}</span>
                <span className="text-xs font-medium" style={{ color: active ? '#2C5F8A' : '#9E9E9E' }}>{tab.label}</span>
                {active && <div className="absolute bottom-0 w-8 h-0.5 rounded-t-full" style={{ background: '#2C5F8A' }} />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StudentsView({ session, classInfo, memberships, onChat }: {
  session: UserSession
  classInfo: ClassInfo
  memberships: Membership[]
  onChat: (m: Membership) => void
}) {
  const [copied, setCopied] = useState(false)

  function copyCode() {
    navigator.clipboard.writeText(classInfo.class_code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fade-in">
      <div className="px-5 pt-10 pb-5" style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}>
        <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Your Class</div>
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-caveat, cursive)' }}>{classInfo.name}</h2>
        <p className="text-white/70 text-sm">{classInfo.grade} • {memberships.length} student{memberships.length !== 1 ? 's' : ''} joined</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Class code card */}
        <div className="rounded-2xl overflow-hidden shadow-page" style={{ background: '#FDF6E3' }}>
          <div className="px-5 py-4 border-b border-rule-line flex items-center gap-2">
            <span className="text-lg">🔑</span>
            <span className="font-semibold text-pencil-gray">Class Code</span>
            <span className="text-xs text-pencil-gray/50 ml-auto">Share with parents</span>
          </div>
          <div className="px-5 py-5 flex items-center gap-4">
            <div className="flex-1">
              <div className="text-4xl font-bold text-ink-blue tracking-widest" style={{ fontFamily: 'var(--font-caveat, cursive)', letterSpacing: 8 }}>
                {classInfo.class_code}
              </div>
              <p className="text-pencil-gray/50 text-xs mt-1">Parents enter this code to link to your class</p>
            </div>
            <button
              onClick={copyCode}
              className="px-4 py-2 rounded-xl text-sm font-medium active:scale-95 transition-all"
              style={{ background: copied ? '#4CAF5020' : 'rgba(44,95,138,0.1)', color: copied ? '#4CAF50' : '#2C5F8A', minHeight: 'auto' }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Students list */}
        <div className="rounded-2xl overflow-hidden shadow-page" style={{ background: '#FDF6E3' }}>
          <div className="px-5 py-4 border-b border-rule-line flex items-center gap-2">
            <span className="text-lg">👥</span>
            <span className="font-semibold text-pencil-gray">Students ({memberships.length})</span>
          </div>
          {memberships.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <div className="text-4xl mb-3">📬</div>
              <p className="text-pencil-gray/60 text-sm">No students yet. Share the class code with parents.</p>
            </div>
          ) : (
            <div className="divide-y divide-rule-line">
              {memberships.map((m) => (
                <div key={m.id} className="px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base"
                    style={{ background: 'linear-gradient(135deg, #2C5F8A22, #7EB3D422)' }}>
                    {m.child_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-pencil-gray text-sm">{m.child_name}</div>
                    <div className="text-pencil-gray/50 text-xs">Joined {new Date(m.joined_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}</div>
                  </div>
                  <button
                    onClick={() => onChat(m)}
                    className="px-3 py-2 rounded-xl text-xs font-medium active:scale-95 transition-transform flex items-center gap-1.5"
                    style={{ background: 'rgba(44,95,138,0.1)', color: '#2C5F8A', minHeight: 'auto' }}
                  >
                    <span>💬</span> Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TeacherSettings({ session, classInfo, onLogout }: { session: UserSession; classInfo: ClassInfo; onLogout: () => void }) {
  const [confirmLogout, setConfirmLogout] = useState(false)
  return (
    <div className="fade-in">
      <div className="px-5 pt-10 pb-5" style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}>
        <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Settings</div>
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-caveat, cursive)' }}>My Account</h2>
      </div>
      <div className="px-4 py-4 space-y-4">
        <div className="rounded-2xl overflow-hidden shadow-page" style={{ background: '#FDF6E3' }}>
          <div className="px-5 py-4 space-y-3">
            <Row label="Name" value={session.display_name} />
            <Row label="Role" value="Teacher 🧑‍🏫" />
            <Row label="School" value={session.school} />
            <Row label="Class" value={classInfo.name} />
            <Row label="Grade" value={classInfo.grade} />
            <Row label="Class Code" value={classInfo.class_code} />
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-page" style={{ background: '#FDF6E3' }}>
          <div className="px-5 py-4">
            {!confirmLogout ? (
              <button onClick={() => setConfirmLogout(true)}
                className="w-full py-3 rounded-xl font-medium text-sm active:scale-95 transition-transform"
                style={{ background: 'rgba(229,62,62,0.08)', color: '#e53e3e', minHeight: 44 }}>
                Sign Out
              </button>
            ) : (
              <div>
                <p className="text-pencil-gray/70 text-sm text-center mb-3">Sign out of this device?</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmLogout(false)}
                    className="flex-1 py-2.5 rounded-xl border-2 text-pencil-gray font-medium text-sm"
                    style={{ borderColor: '#D4C5A9', background: 'transparent', minHeight: 44 }}>
                    Cancel
                  </button>
                  <button onClick={onLogout}
                    className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm active:scale-95 transition-transform"
                    style={{ background: '#e53e3e', minHeight: 44 }}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-pencil-gray/40 pb-2">MyChild Diary V2 • Teacher Edition</p>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-rule-line last:border-0">
      <span className="text-pencil-gray/60 text-sm">{label}</span>
      <span className="text-pencil-gray font-medium text-sm">{value}</span>
    </div>
  )
}
