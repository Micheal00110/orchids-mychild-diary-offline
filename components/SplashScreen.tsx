'use client'

export default function SplashScreen() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #FDF6E3 0%, #EDE0C4 100%)' }}
    >
      {/* Notebook icon */}
      <div className="mb-6 relative">
        <div
          className="w-24 h-28 rounded-r-lg shadow-notebook relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)',
          }}
        >
          {/* Spine */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/20" />
          {/* Lines */}
          {[40, 56, 72, 88].map((y) => (
            <div
              key={y}
              className="absolute left-6 right-3 h-px bg-white/30"
              style={{ top: y }}
            />
          ))}
          {/* Star/pencil icon */}
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            ✏️
          </div>
        </div>
      </div>

      <h1
        className="text-4xl font-bold text-ink-blue mb-2"
        style={{ fontFamily: 'var(--font-caveat, cursive)' }}
      >
        MyChild Diary
      </h1>
      <p className="text-pencil-gray text-sm opacity-70">Your digital school diary</p>

      {/* Loading dots */}
      <div className="mt-10 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-soft-blue"
            style={{
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
