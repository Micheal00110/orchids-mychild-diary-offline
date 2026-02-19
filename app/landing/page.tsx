import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0F1923', color: '#F5EDD6', fontFamily: 'var(--font-noto)' }}>

      {/* Nav */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(15,25,35,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(245,237,214,0.1)' }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📓</span>
          <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#F5EDD6' }}>MyChild Diary</span>
        </div>
        <Link href="/"
          className="px-4 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #2C5F8A, #7EB3D4)', color: 'white', minHeight: 'auto' }}>
          Open App
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
          style={{ background: 'rgba(44,95,138,0.2)', border: '1px solid rgba(44,95,138,0.4)', color: '#7EB3D4' }}>
          ✨ V2 — Now with real-time sync & teacher chat
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#FDF6E3' }}>
          The school diary,{' '}
          <span style={{ color: '#7EB3D4' }}>reimagined</span>
        </h1>
        <p className="text-lg mb-10 leading-relaxed" style={{ color: 'rgba(245,237,214,0.7)' }}>
          MyChild Diary connects teachers and parents through a beautiful digital diary. Teachers fill homework entries, parents view and sign them — all in real time, with two-way chat built in.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/"
            className="px-8 py-4 rounded-2xl text-base font-semibold active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #2C5F8A, #7EB3D4)', color: 'white', boxShadow: '0 8px 32px rgba(44,95,138,0.4)', minHeight: 'auto' }}>
            Get Started Free →
          </Link>
          <a href="#how-it-works"
            className="px-8 py-4 rounded-2xl text-base font-semibold transition-all"
            style={{ background: 'rgba(245,237,214,0.08)', border: '1px solid rgba(245,237,214,0.2)', color: '#F5EDD6', minHeight: 'auto' }}>
            See How It Works
          </a>
        </div>
      </section>

      {/* Mockup preview */}
      <section className="px-6 pb-20 flex justify-center">
        <div className="w-full max-w-sm">
          <MockupPhone />
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12" style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(245,237,214,0.08)', borderBottom: '1px solid rgba(245,237,214,0.08)' }}>
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: '< 60s', label: 'Daily diary fill time' },
            { value: '100%', label: 'Real-time sync' },
            { value: '0', label: 'Passwords needed' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#7EB3D4' }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'rgba(245,237,214,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#7EB3D4' }}>How It Works</div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#FDF6E3' }}>Up and running in 3 steps</h2>
        </div>

        <div className="space-y-6">
          {/* Teacher flow */}
          <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'rgba(44,95,138,0.12)', border: '1px solid rgba(44,95,138,0.3)' }}>
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2C5F8A, #7EB3D4)' }} />
            <div className="pl-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(44,95,138,0.3)', color: '#7EB3D4' }}>
                🧑‍🏫 For Teachers
              </div>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Create your class', desc: 'Enter your class name and grade. A unique 6-character code is auto-generated.', icon: '🏫' },
                  { step: '2', title: 'Share the class code', desc: 'Give the code to parents. They enter it to link their child to your class instantly.', icon: '🔑' },
                  { step: '3', title: 'Fill the diary daily', desc: 'Open the app, pick a student, fill subject, homework, and comment. Saves in real time.', icon: '📝' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ background: 'rgba(44,95,138,0.3)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-0.5" style={{ color: '#FDF6E3' }}>
                        <span style={{ color: '#7EB3D4' }}>Step {item.step}:</span> {item.title}
                      </div>
                      <div className="text-sm" style={{ color: 'rgba(245,237,214,0.6)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(245,237,214,0.1)' }} />
            <span className="text-sm" style={{ color: 'rgba(245,237,214,0.3)' }}>Meanwhile...</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(245,237,214,0.1)' }} />
          </div>

          {/* Parent flow */}
          <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)' }}>
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #4CAF50, #81C784)' }} />
            <div className="pl-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(76,175,80,0.2)', color: '#81C784' }}>
                👨‍👩‍👧 For Parents
              </div>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Enter the class code', desc: "Type the 6-character code your child's teacher gave you. Takes 5 seconds.", icon: '🔑' },
                  { step: '2', title: 'Add your child's name', desc: "Enter your child's name to link them. You can join multiple classes for multiple children.", icon: '👶' },
                  { step: '3', title: 'View diary & chat with teacher', desc: "See today's homework in real time. Sign entries when work is done. Chat directly with the teacher.", icon: '💬' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ background: 'rgba(76,175,80,0.2)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-0.5" style={{ color: '#FDF6E3' }}>
                        <span style={{ color: '#81C784' }}>Step {item.step}:</span> {item.title}
                      </div>
                      <div className="text-sm" style={{ color: 'rgba(245,237,214,0.6)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 py-16 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#FDF6E3' }}>Everything you need</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: '⚡', title: 'Real-Time Sync', desc: 'Diary entries appear on parent phones the instant the teacher saves them.' },
            { icon: '💬', title: 'Two-Way Chat', desc: 'Teachers and parents can message each other per student. Private and direct.' },
            { icon: '🔑', title: 'Class Codes', desc: 'Simple 6-character codes replace complex logins. No passwords, no friction.' },
            { icon: '✍️', title: 'Parent Signature', desc: "Parents tap 'Work Ensured' to digitally sign that homework was checked." },
            { icon: '📅', title: 'Date History', desc: 'Scroll back through the last 7 days of diary entries anytime.' },
            { icon: '👥', title: 'Multi-Child', desc: 'Parents can link multiple children in different classes from one account.' },
            { icon: '📓', title: 'Paper Diary Feel', desc: 'Ruled lines, notebook binding, handwriting font — familiar and warm.' },
            { icon: '🇰🇪', title: 'Built for Kenya', desc: 'CBC and 8-4-4 grades, KE date formats, optimized for mid-range Android phones.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,237,214,0.08)' }}>
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#FDF6E3' }}>{f.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: 'rgba(245,237,214,0.5)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-16 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#FDF6E3' }}>Why not WhatsApp or paper?</h2>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(245,237,214,0.1)' }}>
          <div className="grid grid-cols-4 text-xs font-semibold px-4 py-3" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(245,237,214,0.5)', borderBottom: '1px solid rgba(245,237,214,0.08)' }}>
            <div>Feature</div>
            <div className="text-center">Paper</div>
            <div className="text-center">WhatsApp</div>
            <div className="text-center" style={{ color: '#7EB3D4' }}>MyChild Diary</div>
          </div>
          {[
            ['Per-student diary', '✓', '✗', '✓'],
            ['Real-time updates', '✗', '△', '✓'],
            ['Parent signature', '✓', '✗', '✓'],
            ['Private messaging', '✗', '△', '✓'],
            ['Date history', '✓', '✗', '✓'],
            ['Never lost/damaged', '✗', '✓', '✓'],
          ].map(([feat, paper, wa, mcd]) => (
            <div key={feat as string} className="grid grid-cols-4 px-4 py-3 text-sm" style={{ borderBottom: '1px solid rgba(245,237,214,0.06)' }}>
              <div style={{ color: 'rgba(245,237,214,0.7)' }}>{feat}</div>
              <div className="text-center" style={{ color: paper === '✓' ? '#81C784' : paper === '△' ? '#FFB74D' : '#EF5350' }}>{paper}</div>
              <div className="text-center" style={{ color: wa === '✓' ? '#81C784' : wa === '△' ? '#FFB74D' : '#EF5350' }}>{wa}</div>
              <div className="text-center font-bold" style={{ color: mcd === '✓' ? '#81C784' : '#EF5350' }}>{mcd}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-3" style={{ color: 'rgba(245,237,214,0.3)' }}>△ = noisy group chats, not per-student</p>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center max-w-xl mx-auto">
        <div className="rounded-3xl p-10" style={{ background: 'linear-gradient(135deg, rgba(44,95,138,0.3) 0%, rgba(126,179,212,0.15) 100%)', border: '1px solid rgba(44,95,138,0.4)' }}>
          <div className="text-5xl mb-4">📓</div>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#FDF6E3' }}>
            Start in under 60 seconds
          </h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(245,237,214,0.6)' }}>
            No downloads, no passwords. Open the app, choose your role, and you&apos;re done.
          </p>
          <Link href="/"
            className="inline-flex px-10 py-4 rounded-2xl text-base font-semibold active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #2C5F8A, #7EB3D4)', color: 'white', boxShadow: '0 8px 32px rgba(44,95,138,0.5)', minHeight: 'auto' }}>
            Open MyChild Diary →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs" style={{ borderTop: '1px solid rgba(245,237,214,0.08)', color: 'rgba(245,237,214,0.3)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span>📓</span>
          <span className="font-semibold" style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 16, color: 'rgba(245,237,214,0.5)' }}>MyChild Diary</span>
        </div>
        <p>V2 — Built for Kenyan schools. Made with ❤️ by Mike.</p>
        <p className="mt-1">No accounts required. No data sold. Ever.</p>
      </footer>
    </div>
  )
}

function MockupPhone() {
  return (
    <div className="relative mx-auto" style={{ width: 280 }}>
      {/* Phone frame */}
      <div className="rounded-3xl overflow-hidden" style={{
        background: '#1a2530',
        border: '2px solid rgba(245,237,214,0.15)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,237,214,0.05)',
      }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2" style={{ background: '#2C5F8A' }}>
          <span className="text-white text-xs">9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-2 rounded-sm bg-white/60" />
            <div className="w-1 h-2 rounded-sm bg-white/40" />
          </div>
        </div>
        {/* App header */}
        <div className="px-4 pt-4 pb-3" style={{ background: 'linear-gradient(135deg, #2C5F8A, #1a3d5c)' }}>
          <div className="text-white/60 text-xs uppercase tracking-wider mb-0.5">Today&apos;s Diary</div>
          <div className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-caveat, cursive)' }}>Thursday</div>
          <div className="text-white/70 text-xs">19 February 2026</div>
          <div className="flex gap-1.5 mt-3">
            {['Feb 13','Feb 14','Feb 15','Feb 16','Feb 17','Feb 18','Feb 19'].map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center py-1 rounded-lg"
                style={{ background: i === 6 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)', border: i === 6 ? '1px solid rgba(255,255,255,0.4)' : 'none' }}>
                <span className="text-white/50" style={{ fontSize: 7 }}>{d.slice(0, 3)}</span>
                <span className="text-white font-bold" style={{ fontSize: 11 }}>{d.slice(4)}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Diary page mockup */}
        <div className="m-3 rounded-xl overflow-hidden" style={{ background: '#FDF6E3' }}>
          <div className="h-2 flex gap-4 items-center px-5" style={{ background: '#EDE0C4' }}>
            {[0,1,2,3].map(i => <div key={i} className="w-3 h-full" style={{ background: '#A0845C', clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />)}
          </div>
          <div className="px-3 py-3 space-y-3" style={{
            backgroundImage: 'linear-gradient(rgba(212,197,169,0.3) 1px, transparent 1px)',
            backgroundSize: '100% 24px',
            backgroundPosition: '0 8px',
          }}>
            {[
              { icon: '📚', label: 'SUBJECT', value: 'Mathematics' },
              { icon: '📝', label: 'HOMEWORK', value: 'Page 45–47, Ex 3A' },
              { icon: '💬', label: "TEACHER'S NOTE", value: 'Great work today!' },
            ].map((f) => (
              <div key={f.label} style={{ borderLeft: '2px solid rgba(126,179,212,0.5)', paddingLeft: 8 }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <span style={{ fontSize: 10 }}>{f.icon}</span>
                  <span style={{ fontSize: 7, fontWeight: 700, color: '#2C5F8A', letterSpacing: 1 }}>{f.label}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 14, color: '#4A4A4A' }}>{f.value}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: '#4CAF50', border: '1.5px solid #4CAF50' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontSize: 10, color: '#4CAF50', fontWeight: 600 }}>Work Ensured ✓</span>
            </div>
          </div>
          <div className="h-1.5" style={{ background: 'linear-gradient(180deg, #EDE0C4, #D4C5A9)' }} />
        </div>
        {/* Chat bubble */}
        <div className="px-3 pb-3">
          <div className="rounded-xl px-3 py-2 flex items-center gap-2"
            style={{ background: 'rgba(44,95,138,0.1)', border: '1px solid rgba(44,95,138,0.2)' }}>
            <span style={{ fontSize: 12 }}>💬</span>
            <span style={{ fontSize: 10, color: '#2C5F8A', fontWeight: 500 }}>Chat with Grade 5 Teacher</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto">
              <path d="M4 3l4 3-4 3" stroke="#2C5F8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {/* Bottom nav */}
        <div className="flex" style={{ borderTop: '1px solid #D4C5A9', background: 'rgba(253,246,227,0.97)' }}>
          {[{ e: '📓', l: 'Diary', a: true }, { e: '⚙️', l: 'Settings', a: false }].map((t) => (
            <div key={t.l} className="flex-1 flex flex-col items-center py-2">
              <span style={{ fontSize: 14 }}>{t.e}</span>
              <span style={{ fontSize: 9, color: t.a ? '#2C5F8A' : '#9E9E9E', fontWeight: t.a ? 600 : 400 }}>{t.l}</span>
              {t.a && <div className="w-5 h-0.5 rounded-t-full mt-0.5" style={{ background: '#2C5F8A' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Floating label */}
      <div className="absolute -right-4 top-1/3 transform translate-x-full -translate-y-1/2 hidden sm:block">
        <div className="flex items-center gap-2">
          <div className="w-12 h-px" style={{ background: 'rgba(126,179,212,0.5)' }} />
          <div className="text-xs" style={{ color: '#7EB3D4' }}>Real-time<br />from teacher</div>
        </div>
      </div>
    </div>
  )
}
