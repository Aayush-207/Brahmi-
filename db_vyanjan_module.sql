-- =====================================================
-- BRAHMI VYANJAN (CONSONANTS) MODULE - DATABASE SCHEMA & DATA
-- Complete setup for Vyanjan learning module
-- =====================================================

-- =====================================================
-- 1. VYANJAN LESSONS TABLE
-- Individual lessons within the Vyanjan module
-- =====================================================
CREATE TABLE IF NOT EXISTS public.vyanjan_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    lesson_id TEXT UNIQUE NOT NULL, -- 'vyanjan-lesson-1', 'vyanjan-lesson-2', etc.
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    thumbnail_icon TEXT, -- Emoji or icon for the lesson card
    consonant_group TEXT, -- e.g., 'ka-varga', 'cha-varga', 'ta-varga', etc.
    order_no INTEGER NOT NULL,
    estimated_time_minutes INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vyanjan_lessons_module ON public.vyanjan_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_vyanjan_lessons_order ON public.vyanjan_lessons(order_no);
CREATE INDEX IF NOT EXISTS idx_vyanjan_lessons_group ON public.vyanjan_lessons(consonant_group);

-- =====================================================
-- 2. VYANJAN LESSON CONTENT TABLE
-- Individual content slides/steps within each vyanjan lesson
-- =====================================================
CREATE TABLE IF NOT EXISTS public.vyanjan_lesson_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.vyanjan_lessons(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN (
        'title_slide',      -- Opening slide with title
        'text',             -- Pure text content
        'text_with_image',  -- Text + image
        'consonant_intro',  -- Introduction to consonant
        'pronunciation',    -- Pronunciation guide
        'writing_practice', -- Writing/tracing practice
        'examples',         -- Word examples
        'comparison',       -- Side-by-side comparison
        'key_points',       -- Bullet points list
        'video',            -- Video content
        'mcq',              -- Multiple choice question
        'summary'           -- Summary/recap slide
    )),
    title TEXT,
    content TEXT, -- Main text content (can be markdown)
    image_url TEXT, -- URL to image if applicable
    metadata JSONB, -- Additional data (e.g., consonant details, examples, etc.)
    order_no INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vyanjan_content_lesson ON public.vyanjan_lesson_content(lesson_id);
CREATE INDEX IF NOT EXISTS idx_vyanjan_content_order ON public.vyanjan_lesson_content(order_no);

-- =====================================================
-- 3. VYANJAN PROGRESS TABLE
-- Track user progress through vyanjan lessons
-- =====================================================
CREATE TABLE IF NOT EXISTS public.vyanjan_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.vyanjan_lessons(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    score INTEGER, -- Quiz/practice score if applicable
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vyanjan_progress_user ON public.vyanjan_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_vyanjan_progress_lesson ON public.vyanjan_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_vyanjan_progress_status ON public.vyanjan_progress(status);

-- =====================================================
-- 4. VYANJAN LESSON ANSWERS TABLE
-- Store user answers for quizzes and exercises
-- =====================================================
CREATE TABLE IF NOT EXISTS public.vyanjan_lesson_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    lesson_id UUID REFERENCES public.vyanjan_lessons(id) ON DELETE CASCADE,
    content_id TEXT NOT NULL, -- ID of the content slide
    answer TEXT NOT NULL,
    is_correct BOOLEAN,
    attempt_number INTEGER DEFAULT 1,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vyanjan_answers_user ON public.vyanjan_lesson_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_vyanjan_answers_lesson ON public.vyanjan_lesson_answers(lesson_id);

-- =====================================================
-- 5. GUEST TABLES FOR VYANJAN MODULE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.vyanjan_guest_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_id TEXT NOT NULL,
    lesson_id UUID REFERENCES public.vyanjan_lessons(id) ON DELETE CASCADE,
    content_id TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_correct BOOLEAN,
    attempt_number INTEGER DEFAULT 1,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vyanjan_guest_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_id TEXT NOT NULL,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.vyanjan_lessons(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guest_id, lesson_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vyanjan_guest_answers_guest ON public.vyanjan_guest_answers(guest_id);
CREATE INDEX IF NOT EXISTS idx_vyanjan_guest_progress_guest ON public.vyanjan_guest_progress(guest_id);

-- =====================================================
-- INSERT VYANJAN LESSONS AND CONTENT
-- =====================================================

DO $$
DECLARE
    vyanjan_module_id UUID;
    lesson1_id UUID;
    lesson2_id UUID;
    lesson3_id UUID;
    lesson4_id UUID;
    lesson5_id UUID;
    lesson6_id UUID;
    lesson7_id UUID;
    lesson8_id UUID;
BEGIN
    -- Get the module_id for vyanjan
    SELECT id INTO vyanjan_module_id FROM public.modules WHERE module_id = 'module-vyanjan';

    -- Clear existing vyanjan lessons if any
    DELETE FROM public.vyanjan_lessons WHERE module_id = vyanjan_module_id;

    -- ====================================================
    -- INSERT VYANJAN LESSONS
    -- ====================================================

    -- Lesson 1: Introduction to Vyanjan
    INSERT INTO public.vyanjan_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, consonant_group, order_no, estimated_time_minutes)
    VALUES 
        (vyanjan_module_id, 'vyanjan-lesson-1', 'Introduction to Vyanjan', 'व्यञ्जनों का परिचय', 'Understanding consonants in Brahmi script', '🔤', 'intro', 1, 3)
    RETURNING id INTO lesson1_id;

    -- Lesson 2: Ka-Varga (क वर्ग) - Guttural Consonants
    INSERT INTO public.vyanjan_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, consonant_group, order_no, estimated_time_minutes)
    VALUES 
        (vyanjan_module_id, 'vyanjan-lesson-2', 'Ka-Varga', 'क वर्ग - कण्ठ्य', 'Guttural consonants: क ख ग घ ङ', 'क', 'ka-varga', 2, 8)
    RETURNING id INTO lesson2_id;

    -- Lesson 3: Cha-Varga (च वर्ग) - Palatal Consonants
    INSERT INTO public.vyanjan_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, consonant_group, order_no, estimated_time_minutes)
    VALUES 
        (vyanjan_module_id, 'vyanjan-lesson-3', 'Cha-Varga', 'च वर्ग - तालव्य', 'Palatal consonants: च छ ज झ ञ', 'च', 'cha-varga', 3, 8)
    RETURNING id INTO lesson3_id;

    -- Lesson 4: Ta-Varga (ट वर्ग) - Cerebral Consonants
    INSERT INTO public.vyanjan_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, consonant_group, order_no, estimated_time_minutes)
    VALUES 
        (vyanjan_module_id, 'vyanjan-lesson-4', 'Ta-Varga (Retroflex)', 'ट वर्ग - मूर्धन्य', 'Cerebral consonants: ट ठ ड ढ ण', 'ट', 'ta-varga', 4, 8)
    RETURNING id INTO lesson4_id;

    -- Lesson 5: Ta-Varga (त वर्ग) - Dental Consonants
    INSERT INTO public.vyanjan_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, consonant_group, order_no, estimated_time_minutes)
    VALUES 
        (vyanjan_module_id, 'vyanjan-lesson-5', 'Ta-Varga (Dental)', 'त वर्ग - दन्त्य', 'Dental consonants: त थ द ध न', 'त', 'ta-varga-dental', 5, 8)
    RETURNING id INTO lesson5_id;

    -- Lesson 6: Pa-Varga (प वर्ग) - Labial Consonants
    INSERT INTO public.vyanjan_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, consonant_group, order_no, estimated_time_minutes)
    VALUES 
        (vyanjan_module_id, 'vyanjan-lesson-6', 'Pa-Varga', 'प वर्ग - ओष्ठ्य', 'Labial consonants: प फ ब भ म', 'प', 'pa-varga', 6, 8)
    RETURNING id INTO lesson6_id;

    -- Lesson 7: Antastha (अन्तस्थ) - Semi-vowels
    INSERT INTO public.vyanjan_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, consonant_group, order_no, estimated_time_minutes)
    VALUES 
        (vyanjan_module_id, 'vyanjan-lesson-7', 'Antastha', 'अन्तस्थ - Semi-vowels', 'Semi-vowels: य र ल व', 'य', 'antastha', 7, 6)
    RETURNING id INTO lesson7_id;

    -- Lesson 8: Ushma (ऊष्म) - Sibilants
    INSERT INTO public.vyanjan_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, consonant_group, order_no, estimated_time_minutes)
    VALUES 
        (vyanjan_module_id, 'vyanjan-lesson-8', 'Ushma', 'ऊष्म - Sibilants', 'Sibilants: श ष स ह', 'श', 'ushma', 8, 6)
    RETURNING id INTO lesson8_id;

    -- ====================================================
    -- INSERT LESSON CONTENT
    -- ====================================================

    -- LESSON 1: Introduction to Vyanjan
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson1_id, 'title_slide', 'व्यञ्जन (Vyanjan)', 'Welcome to the world of Brahmi consonants', NULL, 1),
        (lesson1_id, 'text', 'What are Vyanjan?', 'व्यञ्जन (Vyanjan) are consonants - the body of the script. While vowels (स्वर) give life and sound, consonants give structure and form to words.', NULL, 2),
        (lesson1_id, 'text', 'Organization', 'Brahmi consonants are scientifically organized into groups (वर्ग) based on where they are pronounced in the mouth:

• कण्ठ्य (Guttural) - From the throat
• तालव्य (Palatal) - From the palate
• मूर्धन्य (Cerebral) - From the roof of mouth
• दन्त्य (Dental) - From the teeth
• ओष्ठ्य (Labial) - From the lips', NULL, 3),
        (lesson1_id, 'text', 'The Five Groups', 'Each major group (वर्ग) contains 5 consonants following a pattern:

1. Unaspirated Unvoiced (अल्पप्राण अघोष)
2. Aspirated Unvoiced (महाप्राण अघोष)
3. Unaspirated Voiced (अल्पप्राण घोष)
4. Aspirated Voiced (महाप्राण घोष)
5. Nasal (अनुनासिक)', NULL, 4),
        (lesson1_id, 'mcq', 'Quick Check', 'व्यञ्जन are organized based on:', '{"options": ["Their shape", "Where they are pronounced", "Their age"], "correct_answer": "Where they are pronounced"}'::jsonb, 5);

    -- LESSON 2: Ka-Varga (क वर्ग)
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson2_id, 'title_slide', 'क वर्ग', 'Ka-Varga: Guttural Consonants', NULL, 1),
        (lesson2_id, 'consonant_intro', 'कण्ठ्य व्यञ्जन', 'These consonants are pronounced from the throat (कण्ठ). Place your hand on your throat and feel the vibration as you pronounce them.', '{"consonants": ["क", "ख", "ग", "घ", "ङ"]}'::jsonb, 2),
        (lesson2_id, 'pronunciation', 'क (Ka)', 'Unaspirated, Unvoiced

Pronunciation: Like ''k'' in "kite"
Brahmi Symbol: 𑀓
Devanagari: क', '{"brahmi_symbol": "𑀓", "devanagari": "क", "sound": "ka"}'::jsonb, 3),
        (lesson2_id, 'pronunciation', 'ख (Kha)', 'Aspirated, Unvoiced

Pronunciation: Like ''kh'' in "blockhead" (with breath)
Brahmi Symbol: 𑀔
Devanagari: ख', '{"brahmi_symbol": "𑀔", "devanagari": "ख", "sound": "kha"}'::jsonb, 4),
        (lesson2_id, 'pronunciation', 'ग (Ga)', 'Unaspirated, Voiced

Pronunciation: Like ''g'' in "go"
Brahmi Symbol: 𑀕
Devanagari: ग', '{"brahmi_symbol": "𑀕", "devanagari": "ग", "sound": "ga"}'::jsonb, 5),
        (lesson2_id, 'pronunciation', 'घ (Gha)', 'Aspirated, Voiced

Pronunciation: Like ''gh'' in "ghost" (with breath)
Brahmi Symbol: 𑀖
Devanagari: घ', '{"brahmi_symbol": "𑀖", "devanagari": "घ", "sound": "gha"}'::jsonb, 6),
        (lesson2_id, 'pronunciation', 'ङ (Nga)', 'Nasal

Pronunciation: Like ''ng'' in "sing"
Brahmi Symbol: 𑀗
Devanagari: ङ', '{"brahmi_symbol": "𑀗", "devanagari": "ङ", "sound": "nga"}'::jsonb, 7),
        (lesson2_id, 'examples', 'Word Examples', 'क - कमल (kamal) - lotus
ख - खग (khaga) - bird
ग - गज (gaja) - elephant
घ - घट (ghata) - pot
ङ - अङ्ग (anga) - limb', NULL, 8),
        (lesson2_id, 'mcq', 'Practice', 'Which consonant is aspirated and voiced?', '{"options": ["क", "ख", "घ", "ङ"], "correct_answer": "घ"}'::jsonb, 9);

    -- LESSON 3: Cha-Varga (च वर्ग)
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson3_id, 'title_slide', 'च वर्ग', 'Cha-Varga: Palatal Consonants', NULL, 1),
        (lesson3_id, 'consonant_intro', 'तालव्य व्यञ्जन', 'These consonants are pronounced from the palate (तालु) - the roof of your mouth. Touch your tongue to the roof of your mouth as you pronounce them.', '{"consonants": ["च", "छ", "ज", "झ", "ञ"]}'::jsonb, 2),
        (lesson3_id, 'pronunciation', 'च (Cha)', 'Unaspirated, Unvoiced

Pronunciation: Like ''ch'' in "chair"
Brahmi Symbol: 𑀘
Devanagari: च', '{"brahmi_symbol": "𑀘", "devanagari": "च", "sound": "cha"}'::jsonb, 3),
        (lesson3_id, 'pronunciation', 'छ (Chha)', 'Aspirated, Unvoiced

Pronunciation: Like ''chh'' in "catch him" (with breath)
Brahmi Symbol: 𑀙
Devanagari: छ', '{"brahmi_symbol": "𑀙", "devanagari": "छ", "sound": "chha"}'::jsonb, 4),
        (lesson3_id, 'pronunciation', 'ज (Ja)', 'Unaspirated, Voiced

Pronunciation: Like ''j'' in "jump"
Brahmi Symbol: 𑀚
Devanagari: ज', '{"brahmi_symbol": "𑀚", "devanagari": "ज", "sound": "ja"}'::jsonb, 5),
        (lesson3_id, 'pronunciation', 'झ (Jha)', 'Aspirated, Voiced

Pronunciation: Like ''jh'' in "hedgehog" (with breath)
Brahmi Symbol: 𑀛
Devanagari: झ', '{"brahmi_symbol": "𑀛", "devanagari": "झ", "sound": "jha"}'::jsonb, 6),
        (lesson3_id, 'pronunciation', 'ञ (Nya)', 'Nasal

Pronunciation: Like ''ny'' in "canyon"
Brahmi Symbol: 𑀜
Devanagari: ञ', '{"brahmi_symbol": "𑀜", "devanagari": "ञ", "sound": "nya"}'::jsonb, 7),
        (lesson3_id, 'examples', 'Word Examples', 'च - चन्द्र (chandra) - moon
छ - छत्र (chhatra) - umbrella
ज - जल (jala) - water
झ - झरना (jharna) - waterfall
ञ - ज्ञान (jnana) - knowledge', NULL, 8),
        (lesson3_id, 'mcq', 'Practice', 'च वर्ग consonants are pronounced from:', '{"options": ["Throat", "Palate", "Teeth"], "correct_answer": "Palate"}'::jsonb, 9);

    -- LESSON 4-8: Similar structure for remaining vargas
    -- (For brevity, showing structure - you can expand with full content)

    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson4_id, 'title_slide', 'ट वर्ग (Retroflex)', 'Ta-Varga: Cerebral Consonants', NULL, 1),
        (lesson4_id, 'text', 'मूर्धन्य व्यञ्जन', 'These consonants (ट ठ ड ढ ण) are pronounced by curling the tongue back to touch the roof of the mouth.', NULL, 2);

    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson5_id, 'title_slide', 'त वर्ग (Dental)', 'Ta-Varga: Dental Consonants', NULL, 1),
        (lesson5_id, 'text', 'दन्त्य व्यञ्जन', 'These consonants (त थ द ध न) are pronounced by touching the tongue to the upper teeth.', NULL, 2);

    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson6_id, 'title_slide', 'प वर्ग', 'Pa-Varga: Labial Consonants', NULL, 1),
        (lesson6_id, 'text', 'ओष्ठ्य व्यञ्जन', 'These consonants (प फ ब भ म) are pronounced using the lips.', NULL, 2);

    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson7_id, 'title_slide', 'अन्तस्थ', 'Semi-vowels', NULL, 1),
        (lesson7_id, 'text', 'Semi-vowels', 'य र ल व - These consonants have vowel-like qualities and connect smoothly with other sounds.', NULL, 2);

    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson8_id, 'title_slide', 'ऊष्म', 'Sibilants', NULL, 1),
        (lesson8_id, 'text', 'Sibilants', 'श ष स ह - These consonants produce hissing or breathy sounds.', NULL, 2);

END $$;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.vyanjan_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vyanjan_lesson_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vyanjan_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vyanjan_lesson_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vyanjan_guest_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vyanjan_guest_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.vyanjan_lessons;
DROP POLICY IF EXISTS "Lesson content is viewable by everyone" ON public.vyanjan_lesson_content;
DROP POLICY IF EXISTS "Users can view own progress" ON public.vyanjan_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.vyanjan_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.vyanjan_progress;
DROP POLICY IF EXISTS "Users can view own answers" ON public.vyanjan_lesson_answers;
DROP POLICY IF EXISTS "Users can insert own answers" ON public.vyanjan_lesson_answers;
DROP POLICY IF EXISTS "Guest answers are insertable" ON public.vyanjan_guest_answers;
DROP POLICY IF EXISTS "Guest answers are viewable by guest" ON public.vyanjan_guest_answers;
DROP POLICY IF EXISTS "Guest progress is insertable" ON public.vyanjan_guest_progress;
DROP POLICY IF EXISTS "Guest progress is viewable" ON public.vyanjan_guest_progress;
DROP POLICY IF EXISTS "Guest progress is updatable" ON public.vyanjan_guest_progress;

-- Public read access for lessons and content
CREATE POLICY "Lessons are viewable by everyone" ON public.vyanjan_lessons FOR SELECT USING (true);
CREATE POLICY "Lesson content is viewable by everyone" ON public.vyanjan_lesson_content FOR SELECT USING (true);

-- User progress policies
CREATE POLICY "Users can view own progress" ON public.vyanjan_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.vyanjan_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.vyanjan_progress FOR UPDATE USING (auth.uid() = user_id);

-- User answers policies
CREATE POLICY "Users can view own answers" ON public.vyanjan_lesson_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own answers" ON public.vyanjan_lesson_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Guest policies (allow all for guest tables since guest_id is not authenticated)
CREATE POLICY "Guest answers are insertable" ON public.vyanjan_guest_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Guest answers are viewable by guest" ON public.vyanjan_guest_answers FOR SELECT USING (true);
CREATE POLICY "Guest progress is insertable" ON public.vyanjan_guest_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Guest progress is viewable" ON public.vyanjan_guest_progress FOR SELECT USING (true);
CREATE POLICY "Guest progress is updatable" ON public.vyanjan_guest_progress FOR UPDATE USING (true);

-- =====================================================
-- UTILITY VIEWS
-- =====================================================

CREATE OR REPLACE VIEW vyanjan_lesson_overview AS
SELECT 
    vl.lesson_id,
    vl.title,
    vl.consonant_group,
    vl.order_no,
    COUNT(vlc.id) as content_count,
    vl.estimated_time_minutes
FROM public.vyanjan_lessons vl
LEFT JOIN public.vyanjan_lesson_content vlc ON vl.id = vlc.lesson_id
GROUP BY vl.id, vl.lesson_id, vl.title, vl.consonant_group, vl.order_no, vl.estimated_time_minutes
ORDER BY vl.order_no;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.vyanjan_lessons IS 'Lessons for learning Brahmi consonants (vyanjan)';
COMMENT ON TABLE public.vyanjan_lesson_content IS 'Content slides/steps for vyanjan lessons';
COMMENT ON TABLE public.vyanjan_progress IS 'User progress tracking for vyanjan module';
COMMENT ON TABLE public.vyanjan_lesson_answers IS 'User answers for vyanjan quizzes and exercises';

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Brahmi Vyanjan Module database setup complete!';
    RAISE NOTICE '📚 Created 6 tables for vyanjan module';
    RAISE NOTICE '📖 Inserted 8 vyanjan lessons with content';
    RAISE NOTICE '🔒 RLS policies configured';
    RAISE NOTICE '🚀 Vyanjan module is ready!';
END $$;
