-- =====================================================
-- BRAHMI INTRODUCTION MODULE - USER ANSWERS TABLE
-- Stores user responses to MCQ, questionnaire and other interactive content
-- =====================================================

-- =====================================================
-- 1. INTRO LESSON ANSWERS TABLE
-- Store user answers for MCQ, questionnaire and other question types
-- =====================================================
CREATE TABLE IF NOT EXISTS public.intro_lesson_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- References auth.users
    lesson_id UUID REFERENCES public.intro_lessons(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.intro_lesson_content(id) ON DELETE CASCADE,
    answer TEXT NOT NULL, -- The user's answer (selected option or free text)
    is_correct BOOLEAN, -- NULL for questionnaires, TRUE/FALSE for MCQs
    attempt_number INTEGER DEFAULT 1, -- Track multiple attempts
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One answer per user per content item per attempt
    UNIQUE(user_id, content_id, attempt_number)
);

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_intro_answers_user ON public.intro_lesson_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_intro_answers_lesson ON public.intro_lesson_answers(lesson_id);
CREATE INDEX IF NOT EXISTS idx_intro_answers_content ON public.intro_lesson_answers(content_id);

-- =====================================================
-- 2. GUEST ANSWERS TABLE (for non-authenticated users)
-- Store guest user answers using guest_id from sessionStorage
-- =====================================================
CREATE TABLE IF NOT EXISTS public.intro_guest_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_id TEXT NOT NULL, -- Guest identifier from sessionStorage
    lesson_id UUID REFERENCES public.intro_lessons(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.intro_lesson_content(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    is_correct BOOLEAN,
    attempt_number INTEGER DEFAULT 1,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(guest_id, content_id, attempt_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guest_answers_guest ON public.intro_guest_answers(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_answers_lesson ON public.intro_guest_answers(lesson_id);

-- =====================================================
-- 3. GUEST PROGRESS TABLE (for non-authenticated users)
-- Store guest progress using guest_id from sessionStorage
-- =====================================================
CREATE TABLE IF NOT EXISTS public.intro_guest_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_id TEXT NOT NULL,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.intro_lessons(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(guest_id, lesson_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guest_progress_guest ON public.intro_guest_progress(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_progress_lesson ON public.intro_guest_progress(lesson_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on answers table
ALTER TABLE public.intro_lesson_answers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own intro answers" ON public.intro_lesson_answers;
DROP POLICY IF EXISTS "Users can insert own intro answers" ON public.intro_lesson_answers;
DROP POLICY IF EXISTS "Users can update own intro answers" ON public.intro_lesson_answers;
DROP POLICY IF EXISTS "Users can delete own intro answers" ON public.intro_lesson_answers;

-- Users can view their own answers
CREATE POLICY "Users can view own intro answers"
ON public.intro_lesson_answers
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own answers
CREATE POLICY "Users can insert own intro answers"
ON public.intro_lesson_answers
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own answers
CREATE POLICY "Users can update own intro answers"
ON public.intro_lesson_answers
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own answers
CREATE POLICY "Users can delete own intro answers"
ON public.intro_lesson_answers
FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- GUEST TABLES - PUBLIC ACCESS (no auth required)
-- =====================================================

-- Enable RLS but allow public access for guest tables
ALTER TABLE public.intro_guest_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intro_guest_progress ENABLE ROW LEVEL SECURITY;

-- Guest answers - allow all operations (no auth required)
DROP POLICY IF EXISTS "Anyone can view guest answers" ON public.intro_guest_answers;
DROP POLICY IF EXISTS "Anyone can insert guest answers" ON public.intro_guest_answers;
DROP POLICY IF EXISTS "Anyone can update guest answers" ON public.intro_guest_answers;
DROP POLICY IF EXISTS "Anyone can delete guest answers" ON public.intro_guest_answers;

CREATE POLICY "Anyone can view guest answers"
ON public.intro_guest_answers FOR SELECT USING (true);

CREATE POLICY "Anyone can insert guest answers"
ON public.intro_guest_answers FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update guest answers"
ON public.intro_guest_answers FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete guest answers"
ON public.intro_guest_answers FOR DELETE USING (true);

-- Guest progress - allow all operations (no auth required)
DROP POLICY IF EXISTS "Anyone can view guest progress" ON public.intro_guest_progress;
DROP POLICY IF EXISTS "Anyone can insert guest progress" ON public.intro_guest_progress;
DROP POLICY IF EXISTS "Anyone can update guest progress" ON public.intro_guest_progress;
DROP POLICY IF EXISTS "Anyone can delete guest progress" ON public.intro_guest_progress;

CREATE POLICY "Anyone can view guest progress"
ON public.intro_guest_progress FOR SELECT USING (true);

CREATE POLICY "Anyone can insert guest progress"
ON public.intro_guest_progress FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update guest progress"
ON public.intro_guest_progress FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete guest progress"
ON public.intro_guest_progress FOR DELETE USING (true);

-- =====================================================
-- AUTO-UPDATE TRIGGERS
-- =====================================================

DROP TRIGGER IF EXISTS update_guest_progress_modtime ON public.intro_guest_progress;
CREATE TRIGGER update_guest_progress_modtime
    BEFORE UPDATE ON public.intro_guest_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
