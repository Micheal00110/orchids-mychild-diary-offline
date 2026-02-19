// Local storage database layer for MyChild Diary
// All data stored locally on device - no cloud sync

export interface ChildProfile {
  id: string
  name: string
  grade: string
  school: string
  createdAt: string
}

export interface DiaryEntry {
  id: string
  date: string // ISO date string YYYY-MM-DD
  subject: string
  homework: string
  teacherComment: string
  signed: boolean
  createdAt: string
  updatedAt: string
}

const PROFILE_KEY = 'mychild_profile'
const ENTRIES_KEY = 'mychild_entries'

// ── Profile ────────────────────────────────────────────────

export function getProfile(): ChildProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveProfile(profile: Omit<ChildProfile, 'id' | 'createdAt'>): ChildProfile {
  const existing = getProfile()
  const saved: ChildProfile = {
    id: existing?.id ?? crypto.randomUUID(),
    name: profile.name.trim(),
    grade: profile.grade.trim(),
    school: profile.school.trim(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(saved))
  return saved
}

export function deleteProfile(): void {
  localStorage.removeItem(PROFILE_KEY)
}

// ── Diary Entries ──────────────────────────────────────────

function getAllEntries(): DiaryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ENTRIES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAllEntries(entries: DiaryEntry[]): void {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
}

export function getEntryByDate(date: string): DiaryEntry | null {
  const entries = getAllEntries()
  return entries.find(e => e.date === date) ?? null
}

export function getAllDiaryEntries(): DiaryEntry[] {
  return getAllEntries().sort((a, b) => b.date.localeCompare(a.date))
}

export function upsertEntry(
  date: string,
  data: Pick<DiaryEntry, 'subject' | 'homework' | 'teacherComment' | 'signed'>
): DiaryEntry {
  const entries = getAllEntries()
  const existingIndex = entries.findIndex(e => e.date === date)
  const now = new Date().toISOString()

  if (existingIndex >= 0) {
    const updated: DiaryEntry = {
      ...entries[existingIndex]!,
      ...data,
      updatedAt: now,
    }
    entries[existingIndex] = updated
    saveAllEntries(entries)
    return updated
  }

  const newEntry: DiaryEntry = {
    id: crypto.randomUUID(),
    date,
    ...data,
    createdAt: now,
    updatedAt: now,
  }
  entries.push(newEntry)
  saveAllEntries(entries)
  return newEntry
}

export function deleteEntry(date: string): void {
  const entries = getAllEntries().filter(e => e.date !== date)
  saveAllEntries(entries)
}

export function clearAllData(): void {
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(ENTRIES_KEY)
}

// ── Utilities ──────────────────────────────────────────────

export function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year!, month! - 1, day!)
  return date.toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getTodayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function exportDiaryAsText(profile: ChildProfile, entries: DiaryEntry[]): string {
  const lines: string[] = [
    '=====================================',
    `  MyChild Diary — ${profile.name}`,
    `  Grade: ${profile.grade}  |  School: ${profile.school}`,
    `  Exported: ${new Date().toLocaleString('en-KE')}`,
    '=====================================',
    '',
  ]

  if (entries.length === 0) {
    lines.push('No diary entries yet.')
    return lines.join('\n')
  }

  for (const entry of entries) {
    lines.push(`📅 ${formatDisplayDate(entry.date)}`)
    lines.push(`Subject:          ${entry.subject || '—'}`)
    lines.push(`Homework:         ${entry.homework || '—'}`)
    lines.push(`Teacher Comment:  ${entry.teacherComment || '—'}`)
    lines.push(`Signed:           ${entry.signed ? '✓ Yes' : '✗ No'}`)
    lines.push('─────────────────────────────────────')
    lines.push('')
  }

  return lines.join('\n')
}
