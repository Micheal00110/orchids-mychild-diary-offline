'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getParentMemberships, saveParentMemberships, clearSession, type UserSession, type Membership, type ClassInfo } from '@/lib/store'
import JoinClass from './JoinClass'
import ParentDiary from './ParentDiary'
import ChatScreen from '../ChatScreen'

type View = 'diary' | 'chat' | 'settings'

interface Props {
  session: UserSession
  onLogout: () => void
}

export default function ParentApp({ session, onLogout }: Props) {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('diary')
  const [chatMembership, setChatMembership] = useState<Membership | null>(null)
  const [activeMembership, setActiveMembership] = useState<Membership | null>(null)

  useEffect(() => {
    loadMemberships()
  }, [])

  async function loadMemberships() {
    setLoading(true)
    // Fetch from DB (source of truth)
    const { data } = await supabase
      .from('class_memberships')
      .select('*, class:classes(*)')
      .eq('parent_id', session.id)
      .order('joined_at', { ascending: false })

    if (data && data.length > 0) {
      const ms = data as Membership[]
      setMemberships(ms)
      saveParentMemberships(ms)
      if (!activeMembership) setActiveMembership(ms[0]!)
    } else {
      // Fall back to local cache while loading
      const cached = getParentMemberships()
      if (cached.length > 0) {
        setMemberships(cached)
        if (!activeMembership) setActiveMembership(cached[0]!)
      }
    }
    setLoading(false)
  }

  function handleJoined(m: Membership) {
    const updated = [m, ...memberships]
    setMemberships(updated)
    saveParentMemberships(updated)
    setActiveMembership(m)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #EDE0C4 100%)' }}>
        <div className="text-pencil-gray/50 text-sm">Loading...</div>
      </div>
    )
  }

  if (memberships.length === 0) {
    return <JoinClass session={session} onJoined={handleJoined} />
  }

  if (chatMembership) {
    return (
      <ChatScreen
        session={session}
        membership={chatMembership}
        classInfo={chatMembership.class as ClassInfo}
        onBack={() => setChatMembership(null)}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative">
      <main className="flex-1 pb-20">
        {view === 'diary' && activeMembership && (
          <ParentDiary
            session={session}
            membership={activeMembership}
            allMemberships={memberships}
            onSwitchChild={(m) => setActiveMembership(m)}
            onChat={(m) => setChatMembership(m)}
          />
        )}
        {view === 'settings' && (
          <ParentSettings
            session={session}
            memberships={memberships}
            onJoinAnother={() => setView('diary')}
            onLogout={() => { clearSession(); onLogout() }}
          />
        )}
      </main>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto"
        style={{ background: 'rgba(253,246,227,0.97)', backdropFilter: 'blur(8px)', borderTop: '1px solid #D4C5A9', boxShadow: '0 -2px 12px rgba(0,0,0,0.08)' }}>
        <div className="flex">
          {([
            { id: 'diary', label: 'Diary', emoji: '📓' },
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

function ParentSettings({ session, memberships, onJoinAnother, onLogout }: {
  session: UserSession; memberships: Membership[]; onJoinAnother: () => void; onLogout: () => void
}) {
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [showJoin, setShowJoin] = useState(false)

  if (showJoin) {
    return <JoinClass session={session} onJoined={() => { setShowJoin(false); onJoinAnother() }} />
  }

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
            <Row label="Role" value="Parent 👨‍👩‍👧" />
            <Row label="School" value={session.school} />
            <Row label="Children linked" value={`${memberships.length}`} />
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-page" style={{ background: '#FDF6E3' }}>
          <div className="px-5 py-4 border-b border-rule-line">
            <div className="font-semibold text-pencil-gray text-sm mb-1">Linked Classes</div>
          </div>
          {memberships.map((m) => (
            <div key={m.id} className="px-5 py-3 border-b border-rule-line last:border-0 flex items-center justify-between">
              <div>
                <div className="font-medium text-pencil-gray text-sm">{m.child_name}</div>
                <div className="text-pencil-gray/50 text-xs">{(m.class as ClassInfo)?.name} • Code: {(m.class as ClassInfo)?.class_code}</div>
              </div>
            </div>
          ))}
          <div className="px-5 py-3">
            <button onClick={() => setShowJoin(true)}
              className="w-full py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-transform"
              style={{ background: 'rgba(44,95,138,0.1)', color: '#2C5F8A', minHeight: 44 }}>
              + Join Another Class
            </button>
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
        <p className="text-center text-xs text-pencil-gray/40 pb-2">MyChild Diary V2 • Parent Edition</p>
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
