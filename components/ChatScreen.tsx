'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { type UserSession, type Membership, type ClassInfo } from '@/lib/store'

interface Message {
  id: string
  membership_id: string
  class_id: string
  sender_id: string
  sender_role: 'teacher' | 'parent'
  content: string
  created_at: string
}

interface Props {
  session: UserSession
  membership: Membership
  classInfo: ClassInfo
  onBack: () => void
}

export default function ChatScreen({ session, membership, classInfo, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('membership_id', membership.id)
      .order('created_at', { ascending: true })
    if (data) setMessages(data as Message[])
    setLoading(false)
    setTimeout(() => scrollToBottom(), 100)
  }

  // Subscribe to real-time messages
  useEffect(() => {
    const channel = supabase
      .channel('chat-' + membership.id)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `membership_id=eq.${membership.id}`,
      }, (payload) => {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === (payload.new as Message).id)) return prev
          return [...prev, payload.new as Message]
        })
        setTimeout(() => scrollToBottom(), 50)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [membership.id])

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setSending(true)
    await supabase.from('messages').insert({
      membership_id: membership.id,
      class_id: classInfo.id,
      sender_id: session.id,
      sender_role: session.role,
      content: text,
    })
    setSending(false)
  }

  const otherName = session.role === 'teacher' ? membership.child_name + "'s Parent" : classInfo.name + ' Teacher'

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto" style={{ background: '#F5EDD6' }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-4 flex items-center gap-3 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #2C5F8A 0%, #1a3d5c 100%)' }}>
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white active:scale-95 transition-transform p-1"
          style={{ minHeight: 'auto' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold truncate">{otherName}</div>
          <div className="text-white/60 text-xs">
            Re: {membership.child_name} • {classInfo.name}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.15)' }}>
          {session.role === 'teacher' ? '👨‍👩‍👧' : '🧑‍🏫'}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-pencil-gray/40 text-sm">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-pencil-gray font-medium mb-1">No messages yet</p>
            <p className="text-pencil-gray/50 text-sm px-8">
              {session.role === 'teacher'
                ? `Start a conversation with ${membership.child_name}'s parent.`
                : 'Ask the teacher a question about your child.'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === session.id
              const prevMsg = messages[i - 1]
              const showDate = !prevMsg || new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString()

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-2">
                      <span className="text-xs text-pencil-gray/40 px-3 py-1 rounded-full"
                        style={{ background: 'rgba(74,74,74,0.07)' }}>
                        {new Date(msg.created_at).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      {!isMe && (
                        <span className="text-xs text-pencil-gray/50 px-1">
                          {msg.sender_role === 'teacher' ? '🧑‍🏫 Teacher' : '👨‍👩‍👧 Parent'}
                        </span>
                      )}
                      <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                        style={{
                          background: isMe ? 'linear-gradient(135deg, #2C5F8A, #1a3d5c)' : '#FDF6E3',
                          color: isMe ? 'white' : '#4A4A4A',
                          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                          fontFamily: 'var(--font-noto)',
                        }}>
                        {msg.content}
                      </div>
                      <span className="text-xs text-pencil-gray/40 px-1">
                        {new Date(msg.created_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex-shrink-0 px-4 py-3 flex items-end gap-3"
        style={{ background: 'rgba(253,246,227,0.97)', backdropFilter: 'blur(8px)', borderTop: '1px solid #D4C5A9' }}>
        <div className="flex-1 rounded-2xl px-4 py-3 flex items-end gap-2"
          style={{ background: '#FDF6E3', border: '1.5px solid #D4C5A9', minHeight: 48 }}>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e) } }}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 text-pencil-gray placeholder-pencil-gray/40 text-sm leading-relaxed"
            style={{ background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-noto)', minHeight: 24 }}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-all disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #2C5F8A, #1a3d5c)', minHeight: 'auto' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 9h14M9 2l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  )
}
