'use client'

import { useEffect, useState } from 'react'
import { getSession, type UserSession } from '@/lib/store'
import SplashScreen from '@/components/SplashScreen'
import RoleSelection from '@/components/RoleSelection'
import TeacherApp from '@/components/teacher/TeacherApp'
import ParentApp from '@/components/parent/ParentApp'

export default function Home() {
  const [splash, setSplash] = useState(true)
  const [session, setSession] = useState<UserSession | null | undefined>(undefined)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false)
      setSession(getSession())
    }, 1600)
    return () => clearTimeout(timer)
  }, [])

  if (splash) return <SplashScreen />
  if (session === undefined) return <SplashScreen />

  if (!session) {
    return <RoleSelection onComplete={(s) => setSession(s)} />
  }

  if (session.role === 'teacher') {
    return <TeacherApp session={session} onLogout={() => setSession(null)} />
  }

  return <ParentApp session={session} onLogout={() => setSession(null)} />
}
