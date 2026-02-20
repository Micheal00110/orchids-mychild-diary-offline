'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type Membership, type ClassInfo, getTodayISO } from '@/lib/store'

interface DiaryEntry {
  id: string
  date: string
  signed: boolean
  subject: string
  homework: string
  teacher_comment: string
}

interface Props {
  membership: Membership
}

export default function ParentInsights({ membership }: Props) {
  const classInfo = membership.class as ClassInfo
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalSigned: 0,
    thisMonth: 0,
    signedPercent: 0,
    mostCommonDay: '',
    mostCommonSubject: '',
    consistencyLevel: 'Just starting' as 'Just starting' | 'Building' | 'Consistent' | 'Excellent' | 'Outstanding',
  })
  const [celebrating, setCelebrating] = useState(false)
  const [lastCelebratedStreak, setLastCelebratedStreak] = useState(0)

  useEffect(() => {
    loadEntries()
  }, [membership.id])

  async function loadEntries() {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('membership_id', membership.id)
      .order('date', { ascending: false })
      .limit(90) // Last 90 entries

    if (error) {
      console.error('Error loading diary entries:', error)
      setEntries([])
      return
    }

    if (data) {
      const entries = data as DiaryEntry[]
      setEntries(entries)
      calculateStats(entries)
    }
  }

  function calculateStats(entries: DiaryEntry[]) {
    const today = getTodayISO()
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Total signed
    const totalSigned = entries.filter((e) => e.signed).length

    // This month
    const thisMonth = entries.filter((e) => e.date.startsWith(currentMonth) && e.signed).length

    // Current streak (today or yesterday backwards)
    let currentStreak = 0
    let checkDate = new Date(today)
    for (let i = 0; i < 90; i++) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
      const entry = entries.find((e) => e.date === dateStr)
      if (entry?.signed) {
        currentStreak++
      } else {
        break
      }
      checkDate.setDate(checkDate.getDate() - 1)
    }

    // Longest streak (consecutive days)
    let longestStreak = 0
    let tempStreak = 0
    let prevDate: string | null = null
    const sortedByDate = [...entries].sort((a, b) => a.date.localeCompare(b.date))
    for (const entry of sortedByDate) {
      if (entry.signed) {
        if (prevDate === null) {
          // First signed entry
          tempStreak = 1
        } else {
          // Check if consecutive day (exactly 1 day apart)
          // Parse dates as date-only (normalize to UTC midnight) to avoid DST issues
          const [prevYear, prevMonth, prevDay] = prevDate.split('-').map(Number)
          const [currYear, currMonth, currDay] = entry.date.split('-').map(Number)
          
          const prevDateOnly = new Date(Date.UTC(prevYear, prevMonth - 1, prevDay))
          const currDateOnly = new Date(Date.UTC(currYear, currMonth - 1, currDay))
          
          const daysDiff = Math.floor((currDateOnly.getTime() - prevDateOnly.getTime()) / (24 * 60 * 60 * 1000))
          if (daysDiff === 1) {
            tempStreak++
          } else {
            // Gap in days, break streak
            longestStreak = Math.max(longestStreak, tempStreak)
            tempStreak = 1
          }
        }
        prevDate = entry.date
      } else if (tempStreak > 0) {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 0
        prevDate = null
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    // Most common day
    const dayCount: Record<number, number> = {}
    entries.forEach((e) => {
      if (e.signed) {
        const day = new Date(e.date).getDay()
        dayCount[day] = (dayCount[day] || 0) + 1
      }
    })
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const mostCommonDay =
      Object.entries(dayCount).length > 0
        ? dayNames[
            Object.entries(dayCount).reduce((a, b) =>
              a[1] > b[1] ? a : b
            )[0] as any
          ]
        : '—'

    // Most common subject
    const subjectCount: Record<string, number> = {}
    entries.forEach((e) => {
      if (e.signed && e.subject) {
        subjectCount[e.subject] = (subjectCount[e.subject] || 0) + 1
      }
    })
    const mostCommonSubject =
      Object.entries(subjectCount).length > 0
        ? Object.entries(subjectCount).reduce((a, b) =>
            a[1] > b[1] ? a : b
          )[0]
        : '—'

    // Consistency level
    const signedPercent = entries.length > 0 ? Math.round((totalSigned / entries.length) * 100) : 0
    let consistencyLevel: 'Just starting' | 'Building' | 'Consistent' | 'Excellent' | 'Outstanding' = 'Just starting'
    if (signedPercent >= 95) consistencyLevel = 'Outstanding'
    else if (signedPercent >= 80) consistencyLevel = 'Excellent'
    else if (signedPercent >= 60) consistencyLevel = 'Consistent'
    else if (signedPercent >= 30) consistencyLevel = 'Building'

    setStats({
      currentStreak,
      longestStreak,
      totalSigned,
      thisMonth,
      signedPercent,
      mostCommonDay,
      mostCommonSubject,
      consistencyLevel,
    })

    // Trigger celebration only when milestone is newly reached
    if (currentStreak > 0 && currentStreak % 7 === 0 && currentStreak !== lastCelebratedStreak) {
      setCelebrating(true)
      setLastCelebratedStreak(currentStreak)
      setTimeout(() => setCelebrating(false), 3000)
    }
  }

  const badges = []
  if (stats.currentStreak >= 7) badges.push({ icon: '🔥', label: '7-Day Streak', earned: true })
  if (stats.currentStreak >= 14) badges.push({ icon: '💥', label: '14-Day Streak', earned: true })
  if (stats.currentStreak >= 30) badges.push({ icon: '⭐', label: '30-Day Streak', earned: true })
  if (stats.totalSigned >= 30) badges.push({ icon: '📚', label: 'Dedicated Parent', earned: true })
  if (stats.signedPercent >= 90) badges.push({ icon: '🏆', label: '90% Consistency', earned: true })

  return (
    <div className="space-y-4">
      {/* Celebration animation */}
      {celebrating && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animation: `float-up 3s ease-out forwards`,
                animationDelay: `${i * 0.05}s`,
              }}>
              {['🎉', '✨', '🌟', '💫', '🎊'][i % 5]}
            </div>
          ))}
          <style>{`
            @keyframes float-up {
              0% { opacity: 1; transform: translateY(0) rotateZ(0deg); }
              100% { opacity: 0; transform: translateY(-100vh) rotateZ(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Stats Grid */}
      <div className="px-5 py-6 rounded-2xl space-y-4" style={{ background: 'rgba(44,95,138,0.08)', border: '1px solid rgba(44,95,138,0.2)' }}>
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: '#2C5F8A' }}>
            Your Progress
          </div>

          {/* Streaks */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xs text-gray-600 mb-1">Current Streak</div>
              <div className="text-xl font-bold" style={{ color: '#2C5F8A' }}>
                {stats.currentStreak}d
              </div>
            </div>

            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <div className="text-2xl mb-1">📈</div>
              <div className="text-xs text-gray-600 mb-1">Best Streak</div>
              <div className="text-xl font-bold" style={{ color: '#2C5F8A' }}>
                {stats.longestStreak}d
              </div>
            </div>

            <div className="rounded-xl p-3" style={{ background: 'rgba(76,175,80,0.1)' }}>
              <div className="text-2xl mb-1">✅</div>
              <div className="text-xs text-gray-600 mb-1">Total Signed</div>
              <div className="text-xl font-bold" style={{ color: '#4CAF50' }}>
                {stats.totalSigned}
              </div>
            </div>

            <div className="rounded-xl p-3" style={{ background: 'rgba(255,183,77,0.1)' }}>
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs text-gray-600 mb-1">This Month</div>
              <div className="text-xl font-bold" style={{ color: '#FFB74D' }}>
                {stats.thisMonth}
              </div>
            </div>
          </div>

          {/* Consistency meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: '#2C5F8A' }}>Consistency</span>
              <span className="text-sm font-bold" style={{ color: '#2C5F8A' }}>
                {stats.signedPercent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.1)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${stats.signedPercent}%`,
                  background:
                    stats.signedPercent >= 90
                      ? '#4CAF50'
                      : stats.signedPercent >= 70
                        ? '#7EB3D4'
                        : '#FFB74D',
                }}
              />
            </div>
            <div className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.6)' }}>
              {stats.consistencyLevel}
            </div>
          </div>
        </div>

        {/* Insights */}
        {(stats.mostCommonDay !== '—' || stats.mostCommonSubject !== '—') && (
          <div className="border-t border-gray-200 pt-3">
            <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#2C5F8A' }}>
              Insights
            </div>
            <div className="space-y-1 text-sm">
              {stats.mostCommonDay !== '—' && (
                <div>
                  📅 Most signatures on <span className="font-semibold">{stats.mostCommonDay}s</span>
                </div>
              )}
              {stats.mostCommonSubject !== '—' && (
                <div>
                  📚 Most homework in <span className="font-semibold">{stats.mostCommonSubject}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Achievement Badges */}
      {badges.length > 0 && (
        <div className="px-5 py-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,193,7,0.1), rgba(76,175,80,0.08))' }}>
          <div className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: '#F59E0B' }}>
            🏆 Achievements
          </div>
          <div className="grid grid-cols-2 gap-2">
            {badges.map((b) => (
              <div key={b.label} className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivation tip */}
      {stats.currentStreak < 7 && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(126,179,212,0.15)', border: '1px solid rgba(126,179,212,0.3)', color: '#2C5F8A' }}>
          💡 <span className="font-semibold">Tip:</span> Keep signing daily to build your streak! 7 days gets you a 🔥 badge.
        </div>
      )}

      {stats.currentStreak >= 7 && stats.currentStreak < 14 && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(126,179,212,0.15)', border: '1px solid rgba(126,179,212,0.3)', color: '#2C5F8A' }}>
          🔥 <span className="font-semibold">You're on fire!</span> {14 - stats.currentStreak} more days to unlock the 💥 badge!
        </div>
      )}

      {stats.currentStreak >= 14 && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', color: '#2C5F8A' }}>
          ✨ <span className="font-semibold">Incredible dedication!</span> You're setting an amazing example for your child.
        </div>
      )}
    </div>
  )
}
