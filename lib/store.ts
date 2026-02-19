// lib/store.ts — LocalStorage session store (no auth, device-based identity)

export interface UserSession {
  id: string
  role: 'teacher' | 'parent'
  display_name: string
  school: string
  created_at: string
}

export interface ClassInfo {
  id: string
  teacher_id: string
  name: string
  grade: string
  class_code: string
  created_at: string
  // joined via membership
  teacher_name?: string
}

export interface Membership {
  id: string
  class_id: string
  parent_id: string
  child_name: string
  joined_at: string
  class?: ClassInfo
}

const SESSION_KEY = 'mychild_v2_session'
const CLASS_KEY = 'mychild_v2_class' // teacher's active class id
const MEMBERSHIPS_KEY = 'mychild_v2_memberships' // parent's memberships

export function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveSession(s: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(CLASS_KEY)
  localStorage.removeItem(MEMBERSHIPS_KEY)
}

export function getTeacherClassId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CLASS_KEY)
}

export function saveTeacherClassId(id: string): void {
  localStorage.setItem(CLASS_KEY, id)
}

export function getParentMemberships(): Membership[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(MEMBERSHIPS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveParentMemberships(ms: Membership[]): void {
  localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(ms))
}

export function getTodayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year!, month! - 1, day!)
  return date.toLocaleDateString('en-KE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function generateClassCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}
