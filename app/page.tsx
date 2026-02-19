'use client'

import { useEffect, useState } from 'react'
import { getProfile, type ChildProfile } from '@/lib/db'
import ProfileSetup from '@/components/ProfileSetup'
import DiaryPage from '@/components/DiaryPage'
import HistoryView from '@/components/HistoryView'
import SettingsView from '@/components/SettingsView'
import BottomNav from '@/components/BottomNav'
import SplashScreen from '@/components/SplashScreen'

type View = 'today' | 'history' | 'settings'

export default function Home() {
  const [splash, setSplash] = useState(true)
  const [profile, setProfile] = useState<ChildProfile | null>(null)
  const [view, setView] = useState<View>('today')
  const [historyDate, setHistoryDate] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false)
      setProfile(getProfile())
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  if (splash) return <SplashScreen />

  if (!profile) {
    return <ProfileSetup onComplete={(p) => setProfile(p)} />
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative">
      <main className="flex-1 pb-20">
        {view === 'today' && (
          <DiaryPage profile={profile} />
        )}
        {view === 'history' && (
          <HistoryView
            profile={profile}
            selectedDate={historyDate}
            onSelectDate={setHistoryDate}
          />
        )}
        {view === 'settings' && (
          <SettingsView
            profile={profile}
            onProfileUpdated={(p) => setProfile(p)}
            onResetApp={() => {
              setProfile(null)
              setView('today')
            }}
          />
        )}
      </main>
      <BottomNav current={view} onChange={(v) => { setView(v); setHistoryDate(null) }} />
    </div>
  )
}
