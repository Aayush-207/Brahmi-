# Vyanjan Module - Usage Guide

## Overview
Complete database and UI setup for the Brahmi Vyanjan (Consonants) learning module.

## Files Created

1. **`db_vyanjan_module.sql`** - Database schema and data
2. **`lib/vyanjanModule.ts`** - TypeScript functions to fetch data in UI

---

## Step 1: Setup Database

Run the SQL script in your Supabase SQL Editor:

```bash
# Copy the contents of db_vyanjan_module.sql and run in Supabase dashboard
# Or use Supabase CLI:
supabase db reset  # if needed
psql -h your-db-host -U postgres -d postgres -f db_vyanjan_module.sql
```

This will create:
- ✅ 6 tables: `vyanjan_lessons`, `vyanjan_lesson_content`, `vyanjan_progress`, etc.
- ✅ 8 lessons with complete content structure
- ✅ RLS policies for secure access
- ✅ Utility views for easy querying

---

## Step 2: Using in UI

### Example 1: Fetch All Vyanjan Lessons

```typescript
import { getVyanjanLessons } from '@/lib/vyanjanModule'

export default async function VyanjanPage() {
  const lessons = await getVyanjanLessons()
  
  return (
    <div>
      <h1>Vyanjan Lessons</h1>
      {lessons.map(lesson => (
        <div key={lesson.id}>
          <h2>{lesson.thumbnail_icon} {lesson.title}</h2>
          <p>{lesson.subtitle}</p>
          <p>{lesson.description}</p>
          <p>Group: {lesson.consonant_group}</p>
          <p>Duration: {lesson.estimated_time_minutes} min</p>
        </div>
      ))}
    </div>
  )
}
```

### Example 2: Fetch Lesson Content

```typescript
import { getVyanjanLessonContent } from '@/lib/vyanjanModule'

export default async function VyanjanLessonPage({ params }: { params: { lessonId: string } }) {
  const content = await getVyanjanLessonContent(params.lessonId)
  
  return (
    <div>
      {content.map((slide, index) => (
        <div key={slide.id}>
          {slide.content_type === 'title_slide' && (
            <div className="title-slide">
              <h1>{slide.title}</h1>
              <p>{slide.content}</p>
            </div>
          )}
          
          {slide.content_type === 'pronunciation' && (
            <div className="pronunciation">
              <h2>{slide.title}</h2>
              <p>{slide.content}</p>
              {slide.metadata && (
                <div>
                  <span>Brahmi: {slide.metadata.brahmi_symbol}</span>
                  <span>Devanagari: {slide.metadata.devanagari}</span>
                  <span>Sound: {slide.metadata.sound}</span>
                </div>
              )}
            </div>
          )}
          
          {slide.content_type === 'mcq' && (
            <div className="quiz">
              <h3>{slide.title}</h3>
              <p>{slide.content}</p>
              {slide.metadata?.options?.map((option: string) => (
                <button key={option}>{option}</button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

### Example 3: Save Progress

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getCurrentIdentity } from '@/lib/guestIdentity'
import { saveVyanjanProgress } from '@/lib/vyanjanModule'

export default function VyanjanLessonPage() {
  const [identity, setIdentity] = useState(null)
  
  useEffect(() => {
    async function loadIdentity() {
      const id = await getCurrentIdentity()
      setIdentity(id)
    }
    loadIdentity()
  }, [])
  
  const handleComplete = async () => {
    const success = await saveVyanjanProgress(
      'vyanjan-lesson-1',  // lesson_id
      'completed',          // status
      100,                  // progress percentage
      identity,             // user/guest identity
      85                    // optional score
    )
    
    if (success) {
      console.log('Progress saved!')
      // Navigate to next lesson or show completion
    }
  }
  
  return (
    <div>
      {/* Lesson content */}
      <button onClick={handleComplete}>Complete Lesson</button>
    </div>
  )
}
```

### Example 4: Track Completed Lessons

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getCurrentIdentity } from '@/lib/guestIdentity'
import { getCompletedVyanjanLessonIds, getVyanjanLessons } from '@/lib/vyanjanModule'

export default function VyanjanProgressPage() {
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [lessons, setLessons] = useState([])
  
  useEffect(() => {
    async function load() {
      const identity = await getCurrentIdentity()
      const completed = await getCompletedVyanjanLessonIds(identity)
      const allLessons = await getVyanjanLessons()
      
      setCompletedIds(completed)
      setLessons(allLessons)
    }
    load()
  }, [])
  
  return (
    <div>
      <h1>Your Progress</h1>
      <p>Completed: {completedIds.length} / {lessons.length}</p>
      
      {lessons.map(lesson => (
        <div key={lesson.id}>
          <span>{lesson.title}</span>
          {completedIds.includes(lesson.lesson_id) ? ' ✅' : ' ⏳'}
        </div>
      ))}
    </div>
  )
}
```

### Example 5: Save Quiz Answers

```typescript
import { saveVyanjanAnswer } from '@/lib/vyanjanModule'

async function handleQuizAnswer(answer: string, lessonId: string, contentId: string) {
  const identity = await getCurrentIdentity()
  
  // Check if answer is correct (example)
  const correctAnswer = 'घ'
  const isCorrect = answer === correctAnswer
  
  const saved = await saveVyanjanAnswer(
    lessonId,    // e.g., 'vyanjan-lesson-2'
    contentId,   // e.g., 'content-uuid-or-id'
    answer,      // user's answer
    isCorrect,   // true/false
    identity     // user/guest identity
  )
  
  if (saved) {
    console.log('Answer recorded!')
  }
}
```

---

## Available Functions

### Data Fetching
- `getVyanjanLessons()` - Get all vyanjan lessons
- `getVyanjanLessonContent(lessonId)` - Get content for a lesson
- `getVyanjanLessonInfo(lessonId)` - Get single lesson info

### Progress Tracking
- `saveVyanjanProgress(lessonId, status, percentage, identity, score?)` - Save progress
- `getUserVyanjanProgress(userId)` - Get user's progress
- `getCompletedVyanjanLessonIds(identity)` - Get completed lesson IDs

### Quiz/Answers
- `saveVyanjanAnswer(lessonId, contentId, answer, isCorrect, identity)` - Save answer
- `getVyanjanAnswersForLesson(lessonId, identity)` - Get user's answers

---

## Content Types Available

The system supports various content types:

- `title_slide` - Opening slide
- `text` - Text content
- `text_with_image` - Text with image
- `consonant_intro` - Consonant introduction
- `pronunciation` - Pronunciation guide (with metadata)
- `writing_practice` - Tracing/writing practice
- `examples` - Word examples
- `comparison` - Comparisons
- `key_points` - Bullet points
- `video` - Video content
- `mcq` - Multiple choice questions
- `summary` - Summary slide

---

## Metadata Structure Examples

### Pronunciation Content
```json
{
  "brahmi_symbol": "𑀓",
  "devanagari": "क",
  "sound": "ka"
}
```

### MCQ Content
```json
{
  "options": ["क", "ख", "घ", "ङ"],
  "correct_answer": "घ"
}
```

### Consonant Intro
```json
{
  "consonants": ["क", "ख", "ग", "घ", "ङ"]
}
```

---

## Database Tables Structure

### vyanjan_lessons
- Stores lesson metadata
- Links to module via `module_id`
- Has `consonant_group` field (ka-varga, cha-varga, etc.)

### vyanjan_lesson_content
- Individual slides/steps
- Supports 12+ content types
- JSON metadata for flexible data

### vyanjan_progress
- Tracks user/guest progress
- Status: not_started, in_progress, completed
- Stores score and completion timestamp

### vyanjan_lesson_answers
- Records quiz answers
- Tracks attempt numbers
- Separate tables for users and guests

---

## Next Steps

1. ✅ Run `db_vyanjan_module.sql` in Supabase
2. ✅ Import functions from `lib/vyanjanModule.ts`
3. ✅ Create UI pages using the examples above
4. ✅ Test with guest and authenticated users

## Example Page Routes

You might create:
- `/learn/vyanjan` - List of all vyanjan lessons
- `/learn/vyanjan/[lessonId]` - Individual lesson page
- `/learn/vyanjan/progress` - Progress tracking page

---

## Integration with Existing Code

This follows the same pattern as:
- `db_introduction_module.sql` → `lib/introModule.ts`
- Can be used alongside intro and swar modules
- Works with existing `Identity` system from `lib/guestIdentity.ts`
- Compatible with existing progress tracking in `lib/progress.ts`

---

## Customization

You can easily:
- Add more lessons by inserting into `vyanjan_lessons`
- Add more content types in the CHECK constraint
- Extend metadata structure as needed
- Add more consonant groups

---

**Ready to use!** 🚀
