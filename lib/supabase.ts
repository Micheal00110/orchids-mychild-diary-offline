import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  profiles: {
    id: string
    role: 'teacher' | 'parent'
    display_name: string
    school: string
    created_at: string
  }
  classes: {
    id: string
    teacher_id: string
    name: string
    grade: string
    class_code: string
    created_at: string
  }
  class_memberships: {
    id: string
    class_id: string
    parent_id: string
    child_name: string
    joined_at: string
  }
  diary_entries: {
    id: string
    class_id: string
    student_membership_id: string
    date: string
    subject: string
    homework: string
    teacher_comment: string
    signed: boolean
    created_at: string
    updated_at: string
  }
  messages: {
    id: string
    class_id: string
    membership_id: string
    sender_id: string
    sender_role: 'teacher' | 'parent'
    content: string
    created_at: string
  }
}
