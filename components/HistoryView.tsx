'use client'

import { useEffect, useState } from 'react'
import {
  getAllDiaryEntries,
  formatDisplayDate,
  getTodayISO,
  type ChildProfile,
  type DiaryEntry,
} from '@/lib/db'
import DiaryPage from './DiaryPage'

interface Props {
  profile: ChildProfile
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}

export default function HistoryView({ profile, selectedDate, onSelectDate }: Props) {
  const [entries, setEntries] = useState<DiaryEntry[]>([])

  useEffect(() => {
    setEntries(getAllDiaryEntries())
  }, [selectedDate])

  // Viewing a specific past entry
  if (selectedDate) {
    return (
      <div>
        <div
          className="flex items-center gap-3 px-5 pt-10 pb-4"
          style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}
        >
          <button
            onClick={() => onSelectDate(null)}
            className="text-white/80 hover:text-white active:scale-95 transition-transform p-1"
            style={{ minHeight: 'auto' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-white font-medium">Back to History</span>
        </div>
        <DiaryPage profile={profile} date={selectedDate} />
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-5"
        style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}
      >
        <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Diary History</div>
        <h2
          className="text-2xl font-bold text-white"
          style={{ fontFamily: 'var(--font-caveat, cursive)' }}
        >
          {profile.name}&apos;s Entries
        </h2>
        <p className="text-white/70 text-sm">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'} saved
        </p>
      </div>

      <div className="px-4 py-4">
        {entries.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center shadow-page"
            style={{ background: '#FDF6E3' }}
          >
            <div className="text-5xl mb-4">📖</div>
            <p className="text-pencil-gray font-medium mb-1">No entries yet</p>
            <p className="text-pencil-gray/60 text-sm">
              Start writing in today&apos;s diary and your entries will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const isToday = entry.date === getTodayISO()
              const displayDate = formatDisplayDate(entry.date)
              const [weekday, ...rest] = displayDate.split(', ')

              return (
                <button
                  key={entry.id}
                  onClick={() => onSelectDate(entry.date)}
                  className="w-full text-left active:scale-95 transition-transform"
                  style={{ minHeight: 'auto' }}
                >
                  <div
                    className="rounded-xl overflow-hidden shadow-page"
                    style={{ background: '#FDF6E3' }}
                  >
                    {/* Top color bar */}
                    <div
                      className="h-1"
                      style={{
                        background: isToday
                          ? 'linear-gradient(90deg, #4CAF50, #81C784)'
                          : entry.signed
                          ? 'linear-gradient(90deg, #7EB3D4, #2C5F8A)'
                          : 'linear-gradient(90deg, #D4C5A9, #EDE0C4)',
                      }}
                    />
                    <div className="px-4 py-3 flex items-center gap-3">
                      {/* Date block */}
                      <div
                        className="w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                        style={{
                          background: isToday
                            ? 'rgba(44,95,138,0.1)'
                            : 'rgba(212,197,169,0.3)',
                        }}
                      >
                        <span
                          className="text-xs font-medium text-ink-blue uppercase leading-none"
                          style={{ fontSize: 9 }}
                        >
                          {entry.date.slice(5, 7)}/{entry.date.slice(0, 4)}
                        </span>
                        <span className="text-xl font-bold text-pencil-gray leading-none mt-0.5">
                          {entry.date.slice(8, 10)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="font-semibold text-pencil-gray text-sm"
                            style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 16 }}
                          >
                            {weekday}
                          </span>
                          {isToday && (
                            <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ background: '#2C5F8A', fontSize: 10 }}>
                              Today
                            </span>
                          )}
                        </div>
                        <p className="text-pencil-gray/70 text-xs truncate">
                          {entry.subject
                            ? `📚 ${entry.subject}`
                            : entry.homework
                            ? `📝 ${entry.homework.slice(0, 40)}...`
                            : 'No details added'}
                        </p>
                      </div>

                      {/* Signed badge */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{
                            background: entry.signed ? '#4CAF50' : '#E0E0E0',
                          }}
                        >
                          {entry.signed ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                          )}
                        </div>
                        <span className="text-xs text-pencil-gray/50" style={{ fontSize: 9 }}>
                          {entry.signed ? 'Signed' : 'Pending'}
                        </span>
                      </div>

                      {/* Chevron */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-pencil-gray/30">
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
