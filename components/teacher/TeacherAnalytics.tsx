'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type ClassInfo } from '@/lib/store'

interface DiaryEntry {
  id: string
  date: string
  signed: boolean
  student_name: string
  subject: string
}

interface StudentStats {
  name: string
  entriesCount: number
  signaturesCount: number
  lastEntry: string
}

interface Props {
  classInfo: ClassInfo
}

export default function TeacherAnalytics({ classInfo }: Props) {
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalSigned: 0,
    avgSignatureRate: 0,
    studentStats: [] as StudentStats[],
  })
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('month')

  useEffect(() => {
    loadAnalytics()
  }, [classInfo.id, timeframe])

  async function loadAnalytics() {
    const daysBack = timeframe === 'week' ? 7 : 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`

    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('class_id', classInfo.id)
      .gte('date', startDateStr)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error loading analytics data:', error)
      setStats({
        totalEntries: 0,
        totalSigned: 0,
        avgSignatureRate: 0,
        studentStats: [],
      })
      return
    }

    if (data) {
      const entries = data as DiaryEntry[]
      const totalEntries = entries.length
      const totalSigned = entries.filter((e) => e.signed).length
      const avgSignatureRate = totalEntries > 0 ? Math.round((totalSigned / totalEntries) * 100) : 0

      // Student breakdown
      const studentMap: Record<string, StudentStats> = {}
      entries.forEach((e) => {
        if (!studentMap[e.student_name]) {
          studentMap[e.student_name] = {
            name: e.student_name,
            entriesCount: 0,
            signaturesCount: 0,
            lastEntry: '',
          }
        }
        studentMap[e.student_name]!.entriesCount++
        if (e.signed) studentMap[e.student_name]!.signaturesCount++
        if (!studentMap[e.student_name]!.lastEntry || e.date > studentMap[e.student_name]!.lastEntry) {
          studentMap[e.student_name]!.lastEntry = e.date
        }
      })

      setStats({
        totalEntries,
        totalSigned,
        avgSignatureRate,
        studentStats: Object.values(studentMap).sort((a, b) => b.signaturesCount - a.signaturesCount),
      })
    }
  }

  const getMoodEmoji = (rate: number) => {
    if (rate >= 90) return '😍'
    if (rate >= 70) return '😊'
    if (rate >= 50) return '😐'
    return '😕'
  }

  return (
    <div className="space-y-4">
      {/* Timeframe selector */}
      <div className="flex gap-2 px-5">
        {(['week', 'month'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className="flex-1 py-2 rounded-lg font-medium text-sm transition-all active:scale-95"
            style={{
              background: timeframe === t ? '#2C5F8A' : 'rgba(44,95,138,0.08)',
              color: timeframe === t ? 'white' : '#2C5F8A',
              minHeight: 'auto',
            }}>
            {t === 'week' ? '📅 This Week' : '📊 This Month'}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="px-5 py-6 rounded-2xl space-y-4" style={{ background: 'rgba(44,95,138,0.08)', border: '1px solid rgba(44,95,138,0.2)' }}>
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: '#2C5F8A' }}>
            Class Activity
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.6)' }}>
              <div className="text-2xl mb-1">📝</div>
              <div className="text-xs text-gray-600 mb-1">Entries Filled</div>
              <div className="text-xl font-bold" style={{ color: '#2C5F8A' }}>
                {stats.totalEntries}
              </div>
            </div>

            <div className="rounded-xl p-3" style={{ background: 'rgba(76,175,80,0.1)' }}>
              <div className="text-2xl mb-1">✅</div>
              <div className="text-xs text-gray-600 mb-1">Parent Signatures</div>
              <div className="text-xl font-bold" style={{ color: '#4CAF50' }}>
                {stats.totalSigned}
              </div>
            </div>
          </div>

          {/* Signature rate with mood */}
          <div className="mt-4 bg-white/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: '#2C5F8A' }}>
                Parent Engagement
              </span>
              <span className="text-2xl">{getMoodEmoji(stats.avgSignatureRate)}</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.1)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${stats.avgSignatureRate}%`,
                  background:
                    stats.avgSignatureRate >= 90
                      ? '#4CAF50'
                      : stats.avgSignatureRate >= 70
                        ? '#7EB3D4'
                        : stats.avgSignatureRate >= 50
                          ? '#FFB74D'
                          : '#EF5350',
                }}
              />
            </div>
            <div className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.6)' }}>
              {stats.avgSignatureRate}% parents signing on average ({timeframe === 'week' ? 'this week' : 'this month'})
            </div>
          </div>
        </div>
      </div>

      {/* Top performers */}
      {stats.studentStats.length > 0 && (
        <div className="px-5 py-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,193,7,0.1), rgba(76,175,80,0.08))' }}>
          <div className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: '#F59E0B' }}>
            👨‍👩‍👧 Student Engagement
          </div>
          <div className="space-y-2">
            {stats.studentStats.slice(0, 5).map((s, idx) => {
              const rate = s.entriesCount > 0 ? Math.round((s.signaturesCount / s.entriesCount) * 100) : 0
              return (
                <div key={`${s.name}-${s.lastEntry}-${idx}`} className="flex items-center justify-between rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.5)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{s.name}</div>
                    <div className="text-xs text-gray-600">{s.signaturesCount}/{s.entriesCount} signed</div>
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-lg font-bold" style={{ color: rate >= 80 ? '#4CAF50' : '#FFB74D' }}>
                      {rate}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Motivational message */}
      {stats.avgSignatureRate >= 80 && (
        <div className="mx-5 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', color: '#2C5F8A' }}>
          🎉 <span className="font-semibold">Great job!</span> Your parent engagement is excellent. Keep it up!
        </div>
      )}

      {stats.avgSignatureRate < 60 && stats.totalEntries > 0 && (
        <div className="mx-5 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.3)', color: '#2C5F8A' }}>
          💡 <span className="font-semibold">Tip:</span> Share the diary link via WhatsApp to remind parents to sign. Higher signatures = better home-school connection!
        </div>
      )}
    </div>
  )
}
