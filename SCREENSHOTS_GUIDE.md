# MyChild Diary - App Screenshots & Progress

## Overview
This document provides screenshots and descriptions of the MyChild Diary application, showing the complete user flow for both Teachers and Parents.

---

## 📱 Application Features

### Key Pages:
1. **Splash Screen** - Initial loading screen with app branding
2. **Role Selection** - Choose between Teacher or Parent
3. **Profile Setup** - Enter personal and institutional details
4. **Teacher Dashboard** - Manage classes, students, and diary entries
5. **Parent Dashboard** - View child's diary, sign entries, communicate with teacher
6. **Chat Interface** - Real-time messaging between teachers and parents
7. **Settings** - Profile management and app preferences

---

## 🎬 User Flows

### Teacher Flow:
```
Splash Screen 
    ↓
Role Selection (Select "Teacher")
    ↓
Teacher Profile Setup
    ↓
Create Class (if new teacher)
    ↓
Teacher Dashboard
    ├── Diary Entries
    ├── Students List
    ├── Chat with Parents
    └── Settings
```

### Parent Flow:
```
Splash Screen
    ↓
Role Selection (Select "Parent")
    ↓
Parent Profile Setup
    ↓
Join Class (Enter class code)
    ↓
Parent Dashboard
    ├── View Child's Diary
    ├── Chat with Teacher
    └── Settings
```

---

## 🖼️ Screen Descriptions

### 1. Splash Screen
**Location:** First load of the app
**Duration:** ~1.6 seconds

Features:
- Full-screen branded loading animation
- App logo and name: "MyChild Diary"
- Warm, welcoming gradient background
- Automatically transitions to Role Selection

Visual Style:
- Cream/parchment background gradient
- Soft, school-themed design
- Animation fade-in effect

---

### 2. Role Selection Screen
**Location:** App entry point (after splash)
**URL Path:** `/`

**Features:**
- Two main option cards: Teacher and Parent
- Each card includes:
  - Emoji icon (🧑‍🏫 for Teacher, 👨‍👩‍👧 for Parent)
  - Title and description
  - Action arrow
  - Color-coded top border (blue for Teacher, green for Parent)

**Layout:**
- Centered container (max-width: 448px)
- Responsive card-based design
- Clear typography hierarchy
- Navigation buttons at bottom

**Teacher Card:**
- Title: "Teacher"
- Description: "Create classes, fill daily diary entries for all students, and chat with parents."
- Color: Blue gradient top border (#2C5F8A to #7EB3D4)

**Parent Card:**
- Title: "Parent"
- Description: "Enter your class code, view your child's diary, sign entries, and chat with the teacher."
- Color: Green gradient top border (#4CAF50 to #81C784)

---

### 3. Teacher Profile Setup
**Location:** After selecting "Teacher" role
**Form Fields:**
- Full Name (required) - e.g., "Mr. James Odhiambo"
- School Name (required) - e.g., "St. Mary's Primary School"

**Features:**
- Notebook-style lined background
- Clear form labels
- Input validation
- Submit button: "Continue →"
- Back button to return to role selection

**Styling:**
- Parchment-colored form container
- Rounded corners with shadow
- Focus states with color change
- Blue submit button with gradient

---

### 4. Parent Profile Setup
**Location:** After selecting "Parent" role
**Form Fields:**
- Full Name (required) - e.g., "Mrs. Wanjiku Kamau"
- School Name (required)

**Features:**
- Same notebook-style design as Teacher
- Input validation
- Error messages for incomplete fields
- "Continue →" button

---

### 5. Create Class (Teacher Only)
**Location:** First-time teacher login
**Purpose:** Set up a new class

**Form Fields:**
- Class Name (required) - e.g., "Grade 5 Blue"
- Grade/Level (required) - Dropdown with 15 grade options:
  - PP1, PP2
  - Grade 1-9
  - Form 1-4

**Features:**
- Unique 6-character class code auto-generated
- Code displayed after creation
- Shareable code format
- Continue to Teacher Dashboard

---

### 6. Join Class (Parent Only)
**Location:** First-time parent login
**Purpose:** Link parent account to child's class

**Step 1: Enter Class Code**
- Input field: 6-character code (uppercase)
- Centered, large font for easy entry
- Real-time validation

**Step 2: Enter Child's Name**
- Input field for child name
- Confirms class and grade
- Completes parent setup

---

### 7. Teacher Dashboard
**Location:** Main teacher interface
**Tabs:**
1. **Diary 📓** - Fill daily entries for all students
2. **Students 👥** - Manage class roster and communicate
3. **Settings ⚙️** - Account and class settings

**Diary Tab Features:**
- Date navigation (forward/backward)
- Subject entry
- Homework assignment
- Teacher comments
- Student list selector
- Auto-save functionality
- "Saved ✓" confirmation

**Students Tab Features:**
- Class code display (shareable)
- Student roster with names
- Real-time participant count
- Chat button for each parent
- Join status indicators

**Settings Tab Features:**
- Class information display
- Class code copying
- Student count
- Account details
- Logout button

---

### 8. Parent Dashboard
**Location:** Main parent interface
**Tabs:**
1. **Diary 📓** - View child's daily entries
2. **Settings ⚙️** - Account settings

**Diary Tab Features:**
- Child's name display
- Daily entries view
- Date navigation
- Subject, homework, teacher comment viewing
- Entry signing functionality
- Sign/unsign tracking
- Multiple child support

**Settings Tab Features:**
- Child profile management
- School information
- Class management
- Join another class option
- Account logout

---

### 9. Chat Interface
**Location:** Accessible from both Teacher and Parent dashboards
**Access Points:**
- Teacher: Students tab → Chat button for each parent
- Parent: Diary tab → Chat with Teacher button

**Features:**
- Real-time message synchronization
- Message history
- Sender identification
- Timestamp for messages
- Notification of unread messages
- Clean message bubble interface

**Message Display:**
- Sender role indicator
- Message content
- Date/time stamps
- Auto-scroll to latest message
- Input field for new messages

---

### 10. Settings Screens

#### Teacher Settings
- Class information
- Class code display
- Student count
- Logout with confirmation

#### Parent Settings
- Child profile info
- School name
- Multiple class management
- Join another class
- Account logout
- Data export option

---

## 🎨 Design System

### Colors
- **Primary Blue:** #2C5F8A (header, buttons)
- **Light Blue:** #7EB3D4 (accents)
- **Green:** #4CAF50 (parent accent)
- **Cream/Parchment:** #FDF6E3 (background)
- **Warm Beige:** #F5EDD6 (page background)
- **Text Gray:** #4A4A4A (body text)
- **Light Gray:** #9E9E9E (secondary text)

### Typography
- **Font Family:** Noto Sans (body), Caveat (headings)
- **Header Font:** Cursive/Caveat for app branding
- **Body Font:** Noto Sans for content

### Components
- **Cards:** Rounded corners (16px), shadow effect, notebook-style padding
- **Buttons:** Active scale animation, gradient backgrounds
- **Inputs:** Rounded borders (12px), focus color change
- **Navigation:** Bottom tab bar with emoji labels

---

## 📐 Layout Specifications

### Viewport
- **Mobile-First Design:** 480px width (max-w-md)
- **Centered Layout:** `mx-auto` for all main containers
- **Full Height:** `min-h-screen` for all pages
- **Responsive:** Works on mobile, tablet, and desktop

### Spacing
- **Container Padding:** 5px (px-5), 6px (px-6)
- **Vertical Spacing:** 8px-12px (pt-8, pb-6, etc.)
- **Gap Between Elements:** 4px-16px

### Responsive Breakpoints
- Mobile: < 768px (primary target)
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## ✨ Key Features

### Teacher Features
- ✅ Create unlimited classes
- ✅ Manage student roster
- ✅ Fill daily diary entries for each student
- ✅ Add homework assignments
- ✅ Include teacher comments
- ✅ Real-time chat with parents
- ✅ View class participation
- ✅ Export class data

### Parent Features
- ✅ Join class with unique code
- ✅ View child's daily diary
- ✅ See homework and assignments
- ✅ Sign entries digitally
- ✅ Chat with teacher
- ✅ Manage multiple children
- ✅ Track school communication
- ✅ Export diary data

### Data Features
- ✅ Real-time synchronization via Supabase
- ✅ Offline-capable (local caching)
- ✅ Secure data transmission
- ✅ No password authentication
- ✅ User session management

---

## 🔄 Navigation Flow

```
START
  ↓
[Splash Screen] (1.6s auto-transition)
  ↓
[Role Selection]
  ├─→ Select "Teacher"
  │    ↓
  │   [Teacher Profile Setup]
  │    ↓
  │   [Create Class] or [Existing Class]
  │    ↓
  │   [Teacher Dashboard]
  │    ├─ Diary Tab
  │    ├─ Students Tab → Chat
  │    └─ Settings Tab
  │
  └─→ Select "Parent"
       ↓
      [Parent Profile Setup]
       ↓
      [Join Class]
       ↓
      [Parent Dashboard]
       ├─ Diary Tab → Chat
       └─ Settings Tab
```

---

## 📊 Data Models

### User Session
```
{
  id: string (UUID)
  role: 'teacher' | 'parent'
  display_name: string
  school: string
  created_at: timestamp
}
```

### Class
```
{
  id: string (UUID)
  teacher_id: string
  name: string
  grade: string
  class_code: string (6 chars)
  created_at: timestamp
}
```

### Class Membership
```
{
  id: string (UUID)
  class_id: string
  parent_id: string
  child_name: string
  joined_at: timestamp
}
```

### Message
```
{
  id: string (UUID)
  membership_id: string
  class_id: string
  sender_id: string
  sender_role: 'teacher' | 'parent'
  content: string
  created_at: timestamp
}
```

---

## 🚀 Technical Stack

- **Frontend:** Next.js 15+ (React)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Real-time:** Supabase Realtime subscriptions
- **State Management:** React hooks + localStorage
- **Authentication:** Session-based (no passwords)

---

## 📝 Notes for Screenshots

When taking screenshots, capture:

1. **Splash Screen** - Show loading state and animation
2. **Role Selection** - Show both cards with spacing
3. **Teacher Profile** - Show form with sample data
4. **Teacher Dashboard Diary** - Show date selector and entry form
5. **Teacher Dashboard Students** - Show class code and roster
6. **Parent Dashboard** - Show child's diary entry
7. **Chat Screen** - Show message conversation
8. **Settings** - Show profile/account options

---

## ✅ Quality Checklist

- ✅ All pages centered with max-width constraint
- ✅ Consistent color scheme across app
- ✅ Responsive design for mobile
- ✅ Clear navigation and back buttons
- ✅ Form validation and error messages
- ✅ Loading states
- ✅ Smooth animations and transitions
- ✅ Accessible button sizes (min 44px height)
- ✅ Clear visual hierarchy
- ✅ Proper spacing and alignment

---

*Generated: February 19, 2026*
*Version: 0.1.0*
