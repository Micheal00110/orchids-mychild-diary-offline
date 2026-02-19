'use client'

type View = 'today' | 'history' | 'settings'

interface Props {
  current: View
  onChange: (v: View) => void
}

const tabs: { id: View; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: 'today',
    label: 'Today',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="4" width="16" height="15" rx="2" stroke={active ? '#2C5F8A' : '#9E9E9E'} strokeWidth="1.8" />
        <path d="M7 4V2M15 4V2" stroke={active ? '#2C5F8A' : '#9E9E9E'} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 8h16" stroke={active ? '#2C5F8A' : '#9E9E9E'} strokeWidth="1.8" />
        <rect x="7" y="11" width="3" height="3" rx="0.5" fill={active ? '#2C5F8A' : '#9E9E9E'} />
        <rect x="12" y="11" width="3" height="3" rx="0.5" fill={active ? '#2C5F8A' : '#9E9E9E'} opacity={active ? 1 : 0.5} />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M11 4C7.13 4 4 7.13 4 11s3.13 7 7 7 7-3.13 7-7"
          stroke={active ? '#2C5F8A' : '#9E9E9E'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M15 4l3 0M18 4v3" stroke={active ? '#2C5F8A' : '#9E9E9E'} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M11 7.5V11l2.5 2" stroke={active ? '#2C5F8A' : '#9E9E9E'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke={active ? '#2C5F8A' : '#9E9E9E'} strokeWidth="1.8" />
        <path
          d="M11 3v2M11 17v2M3 11h2M17 11h2M5.22 5.22l1.41 1.41M15.36 15.36l1.41 1.41M5.22 16.78l1.41-1.41M15.36 6.64l1.41-1.41"
          stroke={active ? '#2C5F8A' : '#9E9E9E'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export default function BottomNav({ current, onChange }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto"
      style={{
        background: 'rgba(253,246,227,0.97)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid #D4C5A9',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex">
        {tabs.map((tab) => {
          const active = current === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center py-3 active:scale-95 transition-transform"
              style={{ minHeight: 64 }}
            >
              <div className="mb-1">{tab.icon(active)}</div>
              <span
                className="text-xs font-medium"
                style={{ color: active ? '#2C5F8A' : '#9E9E9E' }}
              >
                {tab.label}
              </span>
              {active && (
                <div
                  className="absolute bottom-0 w-8 h-0.5 rounded-t-full"
                  style={{ background: '#2C5F8A' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
