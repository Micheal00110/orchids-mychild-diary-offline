'use client'

import Link from 'next/link'
import React from 'react'

interface Slide {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

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

      {/* Quick Slides - What the app does */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#7EB3D4' }}>In 90 Seconds</div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#FDF6E3' }}>What MyChild Diary Does</h2>
          <p className="text-sm" style={{ color: 'rgba(245,237,214,0.6)' }}>Scroll through to see the app in action</p>
        </div>
        
        <SlideCarousel />
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

      {/* How it works - Teacher Flow */}
      <section id="how-it-works" className="px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#7EB3D4' }}>How It Works</div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#FDF6E3' }}>For Teachers 🧑‍🏫</h2>
        </div>

        <div className="space-y-8 mb-16">
          {/* Teacher Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl p-6 relative overflow-hidden order-2 md:order-1" style={{ background: 'rgba(44,95,138,0.12)', border: '1px solid rgba(44,95,138,0.3)' }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2C5F8A, #7EB3D4)' }} />
              <div className="pl-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(44,95,138,0.3)', color: '#7EB3D4' }}>
                  Step 1
                </div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: '#FDF6E3' }}>Create your class</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(245,237,214,0.7)' }}>Enter your class name and grade level. A unique 6-character code is instantly generated for you.</p>
                <div className="text-xs space-y-2" style={{ color: 'rgba(245,237,214,0.6)' }}>
                  <div>✓ Auto-generated codes (e.g., ABC123)</div>
                  <div>✓ CBC and 8-4-4 grade options</div>
                  <div>✓ Takes less than 30 seconds</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <ScreenMockup screen="roleselection" />
            </div>
          </div>

          {/* Teacher Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'rgba(44,95,138,0.12)', border: '1px solid rgba(44,95,138,0.3)' }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2C5F8A, #7EB3D4)' }} />
              <div className="pl-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(44,95,138,0.3)', color: '#7EB3D4' }}>
                  Step 2
                </div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: '#FDF6E3' }}>Share the class code</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(245,237,214,0.7)' }}>Give the code to parents in your class list. They enter it to instantly link their child.</p>
                <div className="text-xs space-y-2" style={{ color: 'rgba(245,237,214,0.6)' }}>
                  <div>✓ Share code via WhatsApp, SMS, or email</div>
                  <div>✓ Parents join in seconds (no approval needed)</div>
                  <div>✓ Manage all students from one place</div>
                </div>
              </div>
            </div>
            <div>
              <ScreenMockup screen="teacherapp" />
            </div>
          </div>

          {/* Teacher Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl p-6 relative overflow-hidden order-2 md:order-1" style={{ background: 'rgba(44,95,138,0.12)', border: '1px solid rgba(44,95,138,0.3)' }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2C5F8A, #7EB3D4)' }} />
              <div className="pl-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(44,95,138,0.3)', color: '#7EB3D4' }}>
                  Step 3
                </div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: '#FDF6E3' }}>Fill the diary daily</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(245,237,214,0.7)' }}>Pick a student and fill subject, homework, and today's note. Updates sync to parent phones instantly.</p>
                <div className="text-xs space-y-2" style={{ color: 'rgba(245,237,214,0.6)' }}>
                  <div>✓ Pick a student, fill fields, tap Save</div>
                  <div>✓ Real-time sync to parents ({`< 1 second`})</div>
                  <div>✓ Access chat history for that student</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <ScreenMockup screen="teacherdiary" />
            </div>
          </div>

          {/* Teacher Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'rgba(44,95,138,0.12)', border: '1px solid rgba(44,95,138,0.3)' }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2C5F8A, #7EB3D4)' }} />
              <div className="pl-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(44,95,138,0.3)', color: '#7EB3D4' }}>
                  Step 4
                </div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: '#FDF6E3' }}>Chat with parents</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(245,237,214,0.7)' }}>Tap the chat icon to message a parent directly about their child. Private, per-student conversations.</p>
                <div className="text-xs space-y-2" style={{ color: 'rgba(245,237,214,0.6)' }}>
                  <div>✓ One-on-one conversations per student</div>
                  <div>✓ See parent's signature status</div>
                  <div>✓ No group chat chaos</div>
                </div>
              </div>
            </div>
            <div>
              <ScreenMockup screen="chat" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-16">
          <div className="flex-1 h-px" style={{ background: 'rgba(245,237,214,0.1)' }} />
          <span className="text-sm" style={{ color: 'rgba(245,237,214,0.3)' }}>And parents see...</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(245,237,214,0.1)' }} />
        </div>

        {/* How it works - Parent Flow */}
        <div className="text-center mb-12 mt-16">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#FDF6E3' }}>For Parents 👨‍👩‍👧</h2>
        </div>

        <div className="space-y-8">
          {/* Parent Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl p-6 relative overflow-hidden order-2 md:order-1" style={{ background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)' }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #4CAF50, #81C784)' }} />
              <div className="pl-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(76,175,80,0.2)', color: '#81C784' }}>
                  Step 1
                </div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: '#FDF6E3' }}>Get the class code</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(245,237,214,0.7)' }}>Your child's teacher gives you a 6-character code. You enter it to join the class instantly.</p>
                <div className="text-xs space-y-2" style={{ color: 'rgba(245,237,214,0.6)' }}>
                  <div>✓ No passwords or approval delays</div>
                  <div>✓ Join in less than 5 seconds</div>
                  <div>✓ Link multiple children if needed</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <ScreenMockup screen="parentjoin" />
            </div>
          </div>

          {/* Parent Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)' }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #4CAF50, #81C784)' }} />
              <div className="pl-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(76,175,80,0.2)', color: '#81C784' }}>
                  Step 2
                </div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: '#FDF6E3' }}>See today's homework</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(245,237,214,0.7)' }}>Open the app and instantly see today's subject, homework, and teacher's note. Updates live as the teacher adds them.</p>
                <div className="text-xs space-y-2" style={{ color: 'rgba(245,237,214,0.6)' }}>
                  <div>✓ Real-time updates ({`< 1 second`})</div>
                  <div>✓ Browse up to 7 days of history</div>
                  <div>✓ Familiar diary-like interface</div>
                </div>
              </div>
            </div>
            <div>
              <ScreenMockup screen="parentdiary" />
            </div>
          </div>

          {/* Parent Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl p-6 relative overflow-hidden order-2 md:order-1" style={{ background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)' }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #4CAF50, #81C784)' }} />
              <div className="pl-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(76,175,80,0.2)', color: '#81C784' }}>
                  Step 3
                </div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: '#FDF6E3' }}>Sign when work is done</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(245,237,214,0.7)' }}>Tap "Work Ensured" to digitally sign that you've checked the homework. Teacher instantly sees your signature.</p>
                <div className="text-xs space-y-2" style={{ color: 'rgba(245,237,214,0.6)' }}>
                  <div>✓ One-tap digital signature</div>
                  <div>✓ Teacher sees signature instantly</div>
                  <div>✓ Replaces paper diary signing</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <ScreenMockup screen="parentsigned" />
            </div>
          </div>

          {/* Parent Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)' }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #4CAF50, #81C784)' }} />
              <div className="pl-4">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(76,175,80,0.2)', color: '#81C784' }}>
                  Step 4
                </div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: '#FDF6E3' }}>Chat with teacher</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(245,237,214,0.7)' }}>Send a message directly to the teacher about your child. Private conversations, not group chats.</p>
                <div className="text-xs space-y-2" style={{ color: 'rgba(245,237,214,0.6)' }}>
                  <div>✓ Private one-on-one messaging</div>
                  <div>✓ No group chat noise</div>
                  <div>✓ Professional and organized</div>
                </div>
              </div>
            </div>
            <div>
              <ScreenMockup screen="chat" />
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

function SlideCarousel() {
  const slides: Slide[] = [
    {
      id: 1,
      icon: '🧑‍🏫',
      title: 'Teacher Creates Class',
      description: 'Enter class name & get a 6-char code instantly (no passwords, no friction)',
      color: '#2C5F8A',
    },
    {
      id: 2,
      icon: '👨‍👩‍👧',
      title: 'Parents Join with Code',
      description: 'Parents enter the code to link their child - takes less than 5 seconds',
      color: '#4CAF50',
    },
    {
      id: 3,
      icon: '📝',
      title: 'Teacher Fills Diary Daily',
      description: 'Add subject, homework, and notes for each student - takes under 60 seconds per entry',
      color: '#2C5F8A',
    },
    {
      id: 4,
      icon: '⚡',
      title: 'Parents See It Instantly',
      description: 'Real-time sync means updates appear on parent phones within 1 second of saving',
      color: '#4CAF50',
    },
    {
      id: 5,
      icon: '✍️',
      title: 'Parents Sign Digitally',
      description: 'Tap "Work Ensured" to confirm homework - replaces paper diary signatures',
      color: '#FFB74D',
    },
    {
      id: 6,
      icon: '💬',
      title: 'Two-Way Chat',
      description: 'Teachers & parents message directly about each student - private, organized, no group chat chaos',
      color: '#2C5F8A',
    },
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Slide Container */}
      <div className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, rgba(44,95,138,0.15) 0%, rgba(76,175,80,0.08) 100%)', border: '1px solid rgba(245,237,214,0.1)' }}>
        <div className="p-12 text-center min-h-80 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-10" style={{
            background: `radial-gradient(circle, ${slide.color}40 0%, transparent 70%)`,
            animation: 'pulse 3s ease-in-out infinite'
          }} />

          {/* Content */}
          <div className="relative z-10">
            <div className="text-7xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
              {slide.icon}
            </div>
            <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caveat, cursive)', color: '#FDF6E3' }}>
              {slide.title}
            </h3>
            <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: 'rgba(245,237,214,0.7)' }}>
              {slide.description}
            </p>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === currentSlide ? 24 : 8,
                  height: 8,
                  background: i === currentSlide ? slide.color : 'rgba(245,237,214,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: 'rgba(244,237,214,0.1)', border: '1px solid rgba(245,237,214,0.2)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 16l-6-6 6-6" stroke="#7EB3D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex-1 text-center">
          <div className="text-sm" style={{ color: 'rgba(245,237,214,0.5)' }}>
            Slide {currentSlide + 1} of {slides.length}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: 'rgba(244,237,214,0.1)', border: '1px solid rgba(245,237,214,0.2)' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 4l6 6-6 6" stroke="#7EB3D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Auto-advance hint */}
      <div className="text-center mt-6">
        <p className="text-xs" style={{ color: 'rgba(245,237,214,0.3)' }}>
          💡 Tip: Click the dots above or use arrow buttons to explore
        </p>
      </div>

      {/* Add CSS animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}

function ScreenMockup({ screen }: { screen: string }) {
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

        {/* Content varies by screen */}
        {screen === 'roleselection' && (
          <>
            <div className="px-4 pt-6 pb-6 text-center" style={{ background: 'linear-gradient(135deg, #0F1923, #1a3d5c)' }}>
              <div style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 28, fontWeight: 700, color: '#FDF6E3', marginBottom: 16 }}>MyChild Diary</div>
              <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.6)', marginBottom: 24 }}>Choose your role</div>
              <div className="space-y-3">
                <div className="rounded-xl py-3 px-4" style={{ background: '#2C5F8A', color: 'white', fontSize: 13, fontWeight: 600 }}>🧑‍🏫 I&apos;m a Teacher</div>
                <div className="rounded-xl py-3 px-4" style={{ background: '#4CAF50', color: 'white', fontSize: 13, fontWeight: 600 }}>👨‍👩‍👧 I&apos;m a Parent</div>
              </div>
            </div>
          </>
        )}

        {screen === 'teacherapp' && (
          <>
            <div className="px-4 pt-3 pb-2" style={{ background: 'linear-gradient(135deg, #2C5F8A, #1a3d5c)' }}>
              <div style={{ fontSize: 11, color: '#81C784', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>MY STUDENTS</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Grade 5A</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>18 students</div>
            </div>
            <div className="px-3 py-3 space-y-2" style={{ background: '#0F1923' }}>
              {['Alice Kipchoge', 'Brian Mwangi', 'Carol Omondi'].map((name, i) => (
                <div key={name} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(126,179,212,0.1)', border: '1px solid rgba(126,179,212,0.2)' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#FDF6E3' }}>{name}</div>
                    <div style={{ fontSize: 9, color: 'rgba(245,237,214,0.5)' }}>No entry today</div>
                  </div>
                  <div style={{ fontSize: 16 }}>💬</div>
                </div>
              ))}
            </div>
            <div className="flex" style={{ borderTop: '1px solid #D4C5A9', background: 'rgba(253,246,227,0.97)' }}>
              {[{ e: '👥', l: 'Class', a: false }, { e: '📓', l: 'Diary', a: true }, { e: '⚙️', l: 'Settings', a: false }].map((t) => (
                <div key={t.l} className="flex-1 flex flex-col items-center py-2">
                  <span style={{ fontSize: 14 }}>{t.e}</span>
                  <span style={{ fontSize: 8, color: t.a ? '#2C5F8A' : '#9E9E9E', fontWeight: t.a ? 600 : 400 }}>{t.l}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {screen === 'teacherdiary' && (
          <>
            <div className="px-4 pt-3 pb-2" style={{ background: 'linear-gradient(135deg, #2C5F8A, #1a3d5c)' }}>
              <div style={{ fontSize: 11, color: '#81C784', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>TODAY'S ENTRY</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Alice Kipchoge</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Grade 5</div>
            </div>
            <div className="m-2 rounded-lg overflow-hidden" style={{ background: '#FDF6E3' }}>
              <div className="space-y-2 px-3 py-3" style={{
                backgroundImage: 'linear-gradient(rgba(212,197,169,0.3) 1px, transparent 1px)',
                backgroundSize: '100% 20px',
              }}>
                {[
                  { label: 'SUBJECT', value: 'English' },
                  { label: 'HOMEWORK', value: 'Read Chapter 3' },
                  { label: 'COMMENT', value: 'Good progress' },
                ].map((f) => (
                  <div key={f.label}>
                    <div style={{ fontSize: 7, fontWeight: 700, color: '#2C5F8A', letterSpacing: 0.5 }}>{f.label}</div>
                    <div style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 12, color: '#4A4A4A' }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 px-3 py-2">
              <button className="flex-1 py-1 rounded text-xs font-semibold" style={{ background: '#81C784', color: 'white' }}>Save</button>
              <button className="flex-1 py-1 rounded text-xs font-semibold" style={{ background: '#FDF6E3', color: '#2C5F8A' }}>Cancel</button>
            </div>
            <div className="flex" style={{ borderTop: '1px solid #D4C5A9', background: 'rgba(253,246,227,0.97)' }}>
              {[{ e: '👥', l: 'Class', a: false }, { e: '📓', l: 'Diary', a: true }, { e: '⚙️', l: 'Settings', a: false }].map((t) => (
                <div key={t.l} className="flex-1 flex flex-col items-center py-2">
                  <span style={{ fontSize: 14 }}>{t.e}</span>
                  <span style={{ fontSize: 8, color: t.a ? '#2C5F8A' : '#9E9E9E', fontWeight: t.a ? 600 : 400 }}>{t.l}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {screen === 'parentjoin' && (
          <>
            <div className="px-4 pt-6 pb-6 text-center space-y-4" style={{ background: 'linear-gradient(135deg, #0F1923, #1a3d5c)' }}>
              <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.6)' }}>Join a class</div>
              <div className="space-y-3">
                <div>
                  <div style={{ fontSize: 10, color: '#81C784', fontWeight: 600, marginBottom: 4 }}>CLASS CODE</div>
                  <input type="text" placeholder="Enter code" style={{ fontSize: 16, padding: 8, borderRadius: 8, border: 'none', width: '100%', textAlign: 'center', fontWeight: 700 }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#81C784', fontWeight: 600, marginBottom: 4 }}>CHILD NAME</div>
                  <input type="text" placeholder="Enter name" style={{ fontSize: 14, padding: 8, borderRadius: 8, border: 'none', width: '100%', textAlign: 'center' }} />
                </div>
                <button style={{ width: '100%', padding: 10, background: '#4CAF50', color: 'white', borderRadius: 8, fontSize: 13, fontWeight: 600, marginTop: 8 }}>Join</button>
              </div>
            </div>
          </>
        )}

        {screen === 'parentdiary' && (
          <>
            <div className="px-4 pt-3 pb-2" style={{ background: 'linear-gradient(135deg, #2C5F8A, #1a3d5c)' }}>
              <div style={{ fontSize: 11, color: '#81C784', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>TODAY'S DIARY</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Alice</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Grade 5A</div>
            </div>
            <div className="m-2 rounded-lg overflow-hidden" style={{ background: '#FDF6E3' }}>
              <div className="space-y-2 px-3 py-3" style={{
                backgroundImage: 'linear-gradient(rgba(212,197,169,0.3) 1px, transparent 1px)',
                backgroundSize: '100% 20px',
              }}>
                {[
                  { icon: '📚', label: 'SUBJECT', value: 'Math' },
                  { icon: '📝', label: 'HOMEWORK', value: 'Ex 5.1 pages 45-47' },
                  { icon: '💬', label: 'NOTE', value: 'Great work today!' },
                ].map((f) => (
                  <div key={f.label}>
                    <div style={{ fontSize: 7, fontWeight: 700, color: '#2C5F8A', letterSpacing: 0.5 }}>{f.label}</div>
                    <div style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 12, color: '#4A4A4A' }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 px-3 py-2">
              <button className="flex-1 py-1 rounded text-xs font-semibold" style={{ background: '#4CAF50', color: 'white' }}>✓ Work Ensured</button>
              <button className="flex-1 py-1 rounded text-xs" style={{ background: '#FDF6E3', color: '#2C5F8A', fontSize: 12 }}>💬</button>
            </div>
            <div className="flex" style={{ borderTop: '1px solid #D4C5A9', background: 'rgba(253,246,227,0.97)' }}>
              {[{ e: '📓', l: 'Diary', a: true }, { e: '⚙️', l: 'Settings', a: false }].map((t) => (
                <div key={t.l} className="flex-1 flex flex-col items-center py-2">
                  <span style={{ fontSize: 14 }}>{t.e}</span>
                  <span style={{ fontSize: 8, color: t.a ? '#2C5F8A' : '#9E9E9E', fontWeight: t.a ? 600 : 400 }}>{t.l}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {screen === 'parentsigned' && (
          <>
            <div className="px-4 pt-3 pb-2" style={{ background: 'linear-gradient(135deg, #2C5F8A, #1a3d5c)' }}>
              <div style={{ fontSize: 11, color: '#81C784', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>TODAY'S DIARY</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Alice</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Grade 5A</div>
            </div>
            <div className="m-2 rounded-lg overflow-hidden" style={{ background: '#FDF6E3' }}>
              <div className="space-y-2 px-3 py-3" style={{
                backgroundImage: 'linear-gradient(rgba(212,197,169,0.3) 1px, transparent 1px)',
                backgroundSize: '100% 20px',
              }}>
                {[
                  { icon: '📚', label: 'SUBJECT', value: 'Math' },
                  { icon: '📝', label: 'HOMEWORK', value: 'Ex 5.1 pages 45-47' },
                  { icon: '💬', label: 'NOTE', value: 'Great work today!' },
                ].map((f) => (
                  <div key={f.label}>
                    <div style={{ fontSize: 7, fontWeight: 700, color: '#2C5F8A', letterSpacing: 0.5 }}>{f.label}</div>
                    <div style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 12, color: '#4A4A4A' }}>{f.value}</div>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2 mt-2" style={{ borderTop: '1px solid rgba(212,197,169,0.5)' }}>
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: '#4CAF50' }}>
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 9, color: '#4CAF50', fontWeight: 600 }}>Work Ensured ✓</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-3 py-2">
              <button className="flex-1 py-1 rounded text-xs font-semibold" style={{ background: '#E8F5E9', color: '#4CAF50' }}>✓ Signed</button>
              <button className="flex-1 py-1 rounded text-xs" style={{ background: '#FDF6E3', color: '#2C5F8A', fontSize: 12 }}>💬</button>
            </div>
            <div className="flex" style={{ borderTop: '1px solid #D4C5A9', background: 'rgba(253,246,227,0.97)' }}>
              {[{ e: '📓', l: 'Diary', a: true }, { e: '⚙️', l: 'Settings', a: false }].map((t) => (
                <div key={t.l} className="flex-1 flex flex-col items-center py-2">
                  <span style={{ fontSize: 14 }}>{t.e}</span>
                  <span style={{ fontSize: 8, color: t.a ? '#2C5F8A' : '#9E9E9E', fontWeight: t.a ? 600 : 400 }}>{t.l}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {screen === 'chat' && (
          <>
            <div className="flex items-center justify-between px-4 py-2" style={{ background: '#2C5F8A', borderBottom: '1px solid rgba(245,237,214,0.1)' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>← Back</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>Alice's Teacher</div>
              <div style={{ fontSize: 14 }}>👤</div>
            </div>
            <div className="px-3 py-3 space-y-2" style={{ background: '#0F1923', height: 140, overflowY: 'auto' }}>
              <div className="flex justify-start">
                <div className="max-w-xs rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(126,179,212,0.2)', color: '#FDF6E3' }}>
                  Hi! Alice did great in the quiz today!
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-xs rounded-lg px-3 py-2 text-xs" style={{ background: '#2C5F8A', color: 'white' }}>
                  That's wonderful! 😊
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-xs rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(126,179,212,0.2)', color: '#FDF6E3' }}>
                  She said homework was a bit tricky. Check it out?
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-3 py-2" style={{ background: '#0F1923', borderTop: '1px solid #D4C5A9' }}>
              <input type="text" placeholder="Type message..." style={{ flex: 1, padding: 6, borderRadius: 6, border: 'none', fontSize: 11 }} />
              <button style={{ padding: 6, background: '#2C5F8A', color: 'white', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Send</button>
            </div>
          </>
        )}
      </div>
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
