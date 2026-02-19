'use client'

import { useState } from 'react'
import {
  getAllDiaryEntries,
  exportDiaryAsText,
  saveProfile,
  clearAllData,
  type ChildProfile,
} from '@/lib/db'

interface Props {
  profile: ChildProfile
  onProfileUpdated: (p: ChildProfile) => void
  onResetApp: () => void
}

export default function SettingsView({ profile, onProfileUpdated, onResetApp }: Props) {
  const [name, setName] = useState(profile.name)
  const [grade, setGrade] = useState(profile.grade)
  const [school, setSchool] = useState(profile.school)
  const [editMode, setEditMode] = useState(false)
  const [exportMsg, setExportMsg] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  const grades = [
    'PP1', 'PP2',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
    'Grade 7', 'Grade 8', 'Grade 9',
    'Form 1', 'Form 2', 'Form 3', 'Form 4',
  ]

  function handleSaveProfile() {
    const updated = saveProfile({ name, grade, school })
    onProfileUpdated(updated)
    setEditMode(false)
  }

  function handleExport() {
    const entries = getAllDiaryEntries()
    const text = exportDiaryAsText(profile, entries)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.name.replace(/\s+/g, '_')}_diary_${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
    setExportMsg('Export complete!')
    setTimeout(() => setExportMsg(''), 3000)
  }

  function handleReset() {
    clearAllData()
    onResetApp()
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-5"
        style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}
      >
        <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Settings</div>
        <h2
          className="text-2xl font-bold text-white"
          style={{ fontFamily: 'var(--font-caveat, cursive)' }}
        >
          My Diary Settings
        </h2>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profile card */}
        <div className="rounded-2xl overflow-hidden shadow-page" style={{ background: '#FDF6E3' }}>
          <div className="px-5 py-4 border-b border-rule-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">👶</span>
              <span className="font-semibold text-pencil-gray">Child Profile</span>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-ink-blue text-sm font-medium px-3 py-1 rounded-lg active:scale-95 transition-transform"
                style={{ background: 'rgba(44,95,138,0.1)', minHeight: 'auto' }}
              >
                Edit
              </button>
            )}
          </div>

          <div className="px-5 py-4 space-y-4">
            {editMode ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-pencil-gray/70 mb-1">Child&apos;s Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 text-pencil-gray text-base"
                    style={{
                      background: 'rgba(253,246,227,0.8)',
                      borderColor: '#D4C5A9',
                      fontFamily: 'var(--font-noto)',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                    onBlur={(e) => { e.target.style.borderColor = '#D4C5A9' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-pencil-gray/70 mb-1">Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 text-pencil-gray text-base appearance-none"
                    style={{
                      background: 'rgba(253,246,227,0.8)',
                      borderColor: '#D4C5A9',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                    onBlur={(e) => { e.target.style.borderColor = '#D4C5A9' }}
                  >
                    {grades.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-pencil-gray/70 mb-1">School</label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 text-pencil-gray text-base"
                    style={{
                      background: 'rgba(253,246,227,0.8)',
                      borderColor: '#D4C5A9',
                      fontFamily: 'var(--font-noto)',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#2C5F8A' }}
                    onBlur={(e) => { e.target.style.borderColor = '#D4C5A9' }}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditMode(false); setName(profile.name); setGrade(profile.grade); setSchool(profile.school) }}
                    className="flex-1 py-2.5 rounded-xl border-2 text-pencil-gray font-medium text-sm active:scale-95 transition-transform"
                    style={{ borderColor: '#D4C5A9', background: 'transparent', minHeight: 44 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm active:scale-95 transition-transform"
                    style={{
                      background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)',
                      minHeight: 44,
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              <>
                <ProfileRow label="Name" value={profile.name} />
                <ProfileRow label="Grade" value={profile.grade} />
                <ProfileRow label="School" value={profile.school} />
              </>
            )}
          </div>
        </div>

        {/* Export card */}
        <div className="rounded-2xl overflow-hidden shadow-page" style={{ background: '#FDF6E3' }}>
          <div className="px-5 py-4 border-b border-rule-line flex items-center gap-2">
            <span className="text-lg">📤</span>
            <span className="font-semibold text-pencil-gray">Export Diary</span>
          </div>
          <div className="px-5 py-4">
            <p className="text-pencil-gray/70 text-sm mb-4">
              Download all diary entries as a text file. Save it to your phone or share with others.
            </p>
            <button
              onClick={handleExport}
              className="w-full py-3 rounded-xl font-medium text-sm active:scale-95 transition-transform"
              style={{
                background: 'rgba(44,95,138,0.1)',
                color: '#2C5F8A',
                minHeight: 44,
              }}
            >
              Download as Text File
            </button>
            {exportMsg && (
              <p className="text-center text-green-600 text-sm mt-2 font-medium fade-in">{exportMsg}</p>
            )}
          </div>
        </div>

        {/* Privacy note */}
        <div
          className="rounded-2xl px-5 py-4 shadow-page"
          style={{ background: '#FDF6E3' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔒</span>
            <span className="font-semibold text-pencil-gray">Privacy & Data</span>
          </div>
          <div className="space-y-2">
            <PrivacyItem text="No internet connection required" />
            <PrivacyItem text="All data stored only on this device" />
            <PrivacyItem text="No accounts, no tracking, no ads" />
            <PrivacyItem text="Your data is private and secure" />
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl overflow-hidden shadow-page" style={{ background: '#FDF6E3' }}>
          <div className="px-5 py-4">
            {!confirmReset ? (
              <>
                <p className="text-pencil-gray/60 text-xs mb-3">
                  Deleting all data cannot be undone. Make sure to export first.
                </p>
                <button
                  onClick={() => setConfirmReset(true)}
                  className="w-full py-3 rounded-xl font-medium text-sm active:scale-95 transition-transform"
                  style={{
                    background: 'rgba(229,62,62,0.08)',
                    color: '#e53e3e',
                    minHeight: 44,
                  }}
                >
                  Delete All Data
                </button>
              </>
            ) : (
              <div>
                <p className="text-red-600 font-medium text-sm mb-3 text-center">
                  Are you sure? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-2.5 rounded-xl border-2 text-pencil-gray font-medium text-sm"
                    style={{ borderColor: '#D4C5A9', background: 'transparent', minHeight: 44 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm active:scale-95 transition-transform"
                    style={{ background: '#e53e3e', minHeight: 44 }}
                  >
                    Delete All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-pencil-gray/40 pb-2">
          MyChild Diary v1.0 • Made for Kenyan Parents
        </p>
      </div>
    </div>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-pencil-gray/60 text-sm">{label}</span>
      <span
        className="text-pencil-gray font-medium text-base"
        style={{ fontFamily: 'var(--font-caveat, cursive)', fontSize: 18 }}
      >
        {value}
      </span>
    </div>
  )
}

function PrivacyItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(76,175,80,0.15)' }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2 2 4-4" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-pencil-gray/70 text-sm">{text}</span>
    </div>
  )
}
