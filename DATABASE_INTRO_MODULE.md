# Brahmi Introduction Module - Database Documentation

## Overview

This database schema enables the **Introduction Module** for the Brahmi script learning application, covering pages 1-30 of the course PDF which focuses on the history, origins, and evolution of Brahmi script.

## Database Structure

### 1. `modules` Table
Stores all learning modules in the course.

**Columns:**
- `id` (UUID) - Primary key
- `module_id` (TEXT) - Unique identifier (e.g., 'module-intro')
- `title` (TEXT) - Display title
- `subtitle` (TEXT) - Short description
- `description` (TEXT) - Detailed description
- `icon` (TEXT) - Emoji or character icon
- `icon_type` (TEXT) - 'emoji' or 'text'
- `order_no` (INTEGER) - Display order
- `is_locked` (BOOLEAN) - Whether module is available
- `route` (TEXT) - URL route
- `created_at`, `updated_at` (TIMESTAMP)

**Inserted Modules:**
1. Introduction (unlocked) - `/learn/intro`
2. Swar/Vowels (unlocked) - `/letters`
3. Vyanjan/Consonants (locked) - `/consonants`
4. Matra (locked) - `#`

---

### 2. `intro_lessons` Table
Individual lessons within the Introduction module.

**Columns:**
- `id` (UUID) - Primary key
- `module_id` (UUID) - Foreign key to modules
- `lesson_id` (TEXT) - Unique identifier (e.g., 'intro-lesson-1')
- `title` (TEXT) - Lesson title
- `subtitle` (TEXT) - Short tagline
- `description` (TEXT) - What users will learn
- `thumbnail_icon` (TEXT) - Icon for lesson card
- `order_no` (INTEGER) - Lesson sequence
- `estimated_time_minutes` (INTEGER) - Completion time estimate
- `created_at`, `updated_at` (TIMESTAMP)

**8 Introduction Lessons:**
1. **Welcome & Greeting** (1 min) - स्वागतम् - Multi-language welcome
2. **Language Selection** (1 min) - भाषा चुनें - User preference
3. **Introduction to Brahmi** (1 min) - परिचय - A brief introduction
4. **Goal Selection** (1 min) - आपका लक्ष्य - User goal mapping
5. **History and Origin** (3 min) - इतिहास और उत्पत्ति - Birth of Brahmi by Rishabhadev
6. **Script vs. Language** (3 min) - लिपि और भाषा - Understanding writing systems
7. **Spiritual Significance** (5 min) - आध्यात्मिक महत्त्व - Connection to Jinwani
8. **Time Commitment** (2 min) - समय का संकल्प - Daily practice goals

---

### 3. `intro_lesson_content` Table
Individual content slides/steps within each lesson.

**Columns:**
- `id` (UUID) - Primary key
- `lesson_id` (UUID) - Foreign key to intro_lessons
- `content_type` (TEXT) - Type of content slide:
  - `title_slide` - Opening slide
  - `text` - Plain text content
  - `text_with_image` - Text + image
  - `quote` - Highlighted quote
  - `timeline` - Timeline visualization
  - `comparison` - Side-by-side comparison
  - `key_points` - Bullet points
  - `interactive_map` - Geographic visualization
  - `video` - Video content
  - `summary` - Recap slide
  - `questionnaire` - User survey/onboarding questions
- `title` (TEXT) - Slide title
- `content` (TEXT) - Main content (markdown supported)
- `image_url` (TEXT) - Optional image URL
- `metadata` (JSONB) - Additional structured data
- `order_no` (INTEGER) - Slide sequence
- `created_at` (TIMESTAMP)

**Content Coverage:**
- 1-10 content slides per lesson
- 28 total content slides across 8 lessons
- New `questionnaire` type for onboarding
- JSONB metadata for question options

---

### 4. `module_progress` Table
Tracks user progress through modules and lessons.

**Columns:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - User reference (from auth.users)
- `module_id` (UUID) - Foreign key to modules
- `lesson_id` (UUID) - Foreign key to intro_lessons
- `status` (TEXT) - 'not_started', 'in_progress', 'completed'
- `progress_percentage` (INTEGER) - 0-100
- `completed_at` (TIMESTAMP) - Completion time
- `created_at`, `updated_at` (TIMESTAMP)
- **Unique constraint** on (user_id, lesson_id)

**Row Level Security (RLS):**
- Users can only view/modify their own progress
- Policies: SELECT, INSERT, UPDATE, DELETE for own data

---

## Installation

### Run the SQL Script

```bash
# Option 1: In Supabase SQL Editor
# 1. Go to your Supabase project
# 2. Open SQL Editor
# 3. Copy contents of db_introduction_module.sql
# 4. Execute

# Option 2: Using psql
psql -h <your-supabase-host> -U postgres -d postgres -f db_introduction_module.sql
```

### Verify Installation

```sql
-- Check modules
SELECT * FROM public.modules ORDER BY order_no;

-- Check introduction lessons
SELECT * FROM public.intro_lessons ORDER BY order_no;

-- Check content count
SELECT 
    il.lesson_id, 
    il.title,
    COUNT(ilc.id) as content_slides
FROM public.intro_lessons il
LEFT JOIN public.intro_lesson_content ilc ON il.id = ilc.lesson_id
GROUP BY il.lesson_id, il.title
ORDER BY il.order_no;
```

---

## Query Examples

### Get All Modules with Lesson Count

```sql
SELECT 
    m.module_id,
    m.title,
    m.is_locked,
    COUNT(il.id) as lesson_count
FROM public.modules m
LEFT JOIN public.intro_lessons il ON m.id = il.module_id
GROUP BY m.module_id, m.title, m.is_locked
ORDER BY m.order_no;
```

### Get Lesson with All Content

```sql
SELECT 
    il.title as lesson_title,
    ilc.order_no,
    ilc.content_type,
    ilc.title as slide_title,
    ilc.content,
    ilc.metadata
FROM public.intro_lessons il
JOIN public.intro_lesson_content ilc ON il.id = ilc.lesson_id
WHERE il.lesson_id = 'intro-lesson-1'
ORDER BY ilc.order_no;
```

### Track User Progress

```sql
-- Insert progress record
INSERT INTO public.module_progress (user_id, module_id, lesson_id, status, progress_percentage)
SELECT 
    auth.uid(),
    m.id,
    il.id,
    'in_progress',
    50
FROM public.modules m
JOIN public.intro_lessons il ON m.id = il.module_id
WHERE m.module_id = 'module-intro' 
  AND il.lesson_id = 'intro-lesson-1';

-- Mark lesson complete
UPDATE public.module_progress
SET status = 'completed',
    progress_percentage = 100,
    completed_at = NOW()
WHERE user_id = auth.uid()
  AND lesson_id = (SELECT id FROM public.intro_lessons WHERE lesson_id = 'intro-lesson-1');

-- Get user's overall progress
SELECT 
    m.title as module_title,
    COUNT(DISTINCT il.id) as total_lessons,
    COUNT(DISTINCT CASE WHEN mp.status = 'completed' THEN mp.lesson_id END) as completed_lessons,
    ROUND(
        COUNT(DISTINCT CASE WHEN mp.status = 'completed' THEN mp.lesson_id END)::decimal / 
        NULLIF(COUNT(DISTINCT il.id), 0) * 100, 
        1
    ) as completion_percent
FROM public.modules m
LEFT JOIN public.intro_lessons il ON m.id = il.module_id
LEFT JOIN public.module_progress mp ON il.id = mp.lesson_id AND mp.user_id = auth.uid()
WHERE m.module_id = 'module-intro'
GROUP BY m.title;
```

---

## Integration with Frontend

### TypeScript Types

```typescript
// types/module.ts
export type Module = {
  id: string
  module_id: string
  title: string
  subtitle: string
  description: string
  icon: string
  icon_type: 'emoji' | 'text'
  order_no: number
  is_locked: boolean
  route: string
}

export type IntroLesson = {
  id: string
  module_id: string
  lesson_id: string
  title: string
  subtitle: string
  description: string
  thumbnail_icon: string
  order_no: number
  estimated_time_minutes: number
}

export type ContentType = 
  | 'title_slide'
  | 'text'
  | 'text_with_image'
  | 'quote'
  | 'timeline'
  | 'comparison'
  | 'key_points'
  | 'interactive_map'
  | 'video'
  | 'summary'

export type IntroLessonContent = {
  id: string
  lesson_id: string
  content_type: ContentType
  title?: string
  content?: string
  image_url?: string
  metadata?: Record<string, any>
  order_no: number
}

export type ModuleProgress = {
  id: string
  user_id: string
  module_id: string
  lesson_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  completed_at?: string
}
```

### Supabase Queries

```typescript
// lib/introModule.ts
import { createClient } from '@/lib/supabase/client'

// Fetch all modules
export async function getModules() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('order_no', { ascending: true })
  
  if (error) throw error
  return data
}

// Fetch introduction lessons
export async function getIntroLessons() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('intro_lessons')
    .select('*')
    .eq('module_id', (
      await supabase
        .from('modules')
        .select('id')
        .eq('module_id', 'module-intro')
        .single()
    ).data?.id)
    .order('order_no', { ascending: true })
  
  if (error) throw error
  return data
}

// Fetch lesson content
export async function getLessonContent(lessonId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('intro_lesson_content')
    .select('*')
    .eq('lesson_id', (
      await supabase
        .from('intro_lessons')
        .select('id')
        .eq('lesson_id', lessonId)
        .single()
    ).data?.id)
    .order('order_no', { ascending: true })
  
  if (error) throw error
  return data
}

// Save progress
export async function saveProgress(
  lessonId: string, 
  status: 'in_progress' | 'completed',
  progressPercentage: number
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const lessonData = await supabase
    .from('intro_lessons')
    .select('id, module_id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonData.error) throw lessonData.error
  
  const { error } = await supabase
    .from('module_progress')
    .upsert({
      user_id: user.id,
      module_id: lessonData.data.module_id,
      lesson_id: lessonData.data.id,
      status,
      progress_percentage: progressPercentage,
      completed_at: status === 'completed' ? new Date().toISOString() : null
    }, {
      onConflict: 'user_id,lesson_id'
    })
  
  if (error) throw error
}

// Get user progress
export async function getUserProgress(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('module_progress')
    .select(`
      *,
      intro_lessons (
        lesson_id,
        title,
        order_no
      ),
      modules (
        module_id,
        title
      )
    `)
    .eq('user_id', userId)
    .order('order_no', { foreignTable: 'intro_lessons' })
  
  if (error) throw error
  return data
}
```

---

## UI Components Needed

### 1. Module List Page (`/learn`)
- Display all modules (intro, vowels, consonants, matra)
- Show lock status
- Show progress for unlocked modules

### 2. Introduction Lesson List (`/learn/intro`)
- Display 8 introduction lessons
- Show completion status
- Estimated time for each lesson

### 3. Lesson Content Viewer (`/learn/intro/[lesson_id]`)
- Render different content types:
  - Title slides
  - Text content
  - Timelines (visualize metadata)
  - Quotes (styled callouts)
  - Key points (bullet lists)
  - Comparisons (side-by-side)
- Navigation between slides
- Progress tracking
- "Complete" button

---

## Next Steps

1. ✅ **Database Setup Complete**
   - Tables created
   - Data inserted
   - RLS configured

2. **Frontend Development Needed:**
   - [ ] Create `/app/learn/page.tsx` - Module list
   - [ ] Create `/app/learn/intro/page.tsx` - Lesson list
   - [ ] Create `/app/learn/intro/[lesson_id]/page.tsx` - Lesson viewer
   - [ ] Create components for different content types
   - [ ] Implement progress tracking

3. **Update Existing Code:**
   - [ ] Update `lib/courseData.ts` to unlock intro module
   - [ ] Add navigation from home page to `/learn`

---

## Content Summary (Pages 1-30)

### Lesson 1: What is Brahmi Script? (6 slides)
- Definition and significance
- Key facts about Brahmi
- Why learn it today

### Lesson 2: Historical Origins (7 slides)
- Mystery of origin
- Timeline of early Brahmi
- Earliest evidence (Ashoka)
- Theories of origin

### Lesson 3: Emperor Ashoka & Brahmi (8 slides)
- Life of Emperor Ashoka
- Rock and pillar edicts
- Spread through his empire
- Regional variations

### Lesson 4: Spread Across Asia (8 slides)
- Buddhist missions
- Southeast Asian scripts
- Trade and cultural exchange
- Geographic map of spread

### Lesson 5: Brahmi Family Tree (8 slides)
- Evolution timeline
- Major script families (North/South India, SE Asia)
- Shared features across descendants
- Modern usage statistics

### Lesson 6: Decipherment Story (8 slides)
- Lost knowledge
- James Prinsep's breakthrough
- Decipherment process
- Impact on history

### Lesson 7: Structure & Features (8 slides)
- Writing direction
- Vowels, consonants, matras
- Phonetic organization
- What makes Brahmi unique

### Lesson 8: Your Learning Journey (8 slides)
- Course structure overview
- Learning approach
- What you'll achieve
- Practice tips

**Total:** 8 lessons, 56 content slides, ~56 minutes of learning

---

## Database Maintenance

### Backup
```bash
# Backup these tables
pg_dump -h <host> -U postgres -d postgres \
  -t public.modules \
  -t public.intro_lessons \
  -t public.intro_lesson_content \
  -t public.module_progress \
  > intro_module_backup.sql
```

### Add New Lesson
```sql
INSERT INTO public.intro_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, order_no)
SELECT 
  id,
  'intro-lesson-9',
  'New Lesson Title',
  'Subtitle',
  'Description',
  '📚',
  9
FROM public.modules WHERE module_id = 'module-intro';
```

### Add Content Slide
```sql
INSERT INTO public.intro_lesson_content (lesson_id, content_type, title, content, order_no)
SELECT 
  id,
  'text',
  'Slide Title',
  'Slide content...',
  1
FROM public.intro_lessons WHERE lesson_id = 'intro-lesson-9';
```

---

## Support & Contribution

For questions or contributions related to the database schema:
1. Check this documentation
2. Review the SQL file comments
3. Test queries in Supabase SQL Editor

---

**Created:** February 2026  
**Course:** Brahmi Script Learning by Sant Pragyanshsagar Ji  
**Database:** PostgreSQL 14+ (Supabase)
