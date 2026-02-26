-- =====================================================
-- BRAHMI INTRODUCTION MODULE - DATABASE SCHEMA & DATA
-- Pages 1-30 from PDF: History, Origin, Evolution of Brahmi Script
-- =====================================================

-- =====================================================
-- 1. MODULES TABLE
-- Stores different learning modules (Introduction, Vowels, Consonants, Matra)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id TEXT UNIQUE NOT NULL, -- 'module-intro', 'module-swar', etc.
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    icon TEXT, -- Emoji or character icon
    icon_type TEXT CHECK (icon_type IN ('emoji', 'text')),
    order_no INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT TRUE,
    route TEXT, -- URL route to module
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules(order_no);
CREATE INDEX IF NOT EXISTS idx_modules_module_id ON public.modules(module_id);

-- =====================================================
-- 2. INTRO LESSONS TABLE
-- Individual lessons within the Introduction module
-- =====================================================
CREATE TABLE IF NOT EXISTS public.intro_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    lesson_id TEXT UNIQUE NOT NULL, -- 'intro-lesson-1', 'intro-lesson-2', etc.
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    thumbnail_icon TEXT, -- Emoji or icon for the lesson card
    order_no INTEGER NOT NULL,
    estimated_time_minutes INTEGER DEFAULT 5, -- Estimated completion time
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_intro_lessons_module ON public.intro_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_intro_lessons_order ON public.intro_lessons(order_no);

-- =====================================================
-- 3. INTRO LESSON CONTENT TABLE
-- Individual content slides/steps within each intro lesson
-- =====================================================
CREATE TABLE IF NOT EXISTS public.intro_lesson_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.intro_lessons(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN (
        'title_slide',      -- Opening slide with title
        'text',             -- Pure text content
        'text_with_image',  -- Text + image
        'quote',            -- Highlighted quote/saying
        'timeline',         -- Timeline visualization
        'comparison',       -- Side-by-side comparison
        'key_points',       -- Bullet points list
        'interactive_map',  -- Map showing spread
        'video',            -- Video content
        'summary',          -- Summary/recap slide
        'questionnaire'     -- User questionnaire/onboarding
    )),
    title TEXT,
    content TEXT, -- Main text content (can be markdown)
    image_url TEXT, -- URL to image if applicable
    metadata JSONB, -- Additional data (e.g., timeline items, bullet points, etc.)
    order_no INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_intro_content_lesson ON public.intro_lesson_content(lesson_id);
CREATE INDEX IF NOT EXISTS idx_intro_content_order ON public.intro_lesson_content(order_no);

-- Ensure the content_type check constraint is updated if the table already exists
DO $$ 
BEGIN 
    ALTER TABLE public.intro_lesson_content DROP CONSTRAINT IF EXISTS intro_lesson_content_content_type_check;
    ALTER TABLE public.intro_lesson_content ADD CONSTRAINT intro_lesson_content_content_type_check 
    CHECK (content_type IN (
        'title_slide', 'text', 'text_with_image', 'quote', 'timeline', 
        'comparison', 'key_points', 'interactive_map', 'video', 'summary', 'questionnaire', 'staircase_swar', 'mcq'
    ));
END $$;

-- =====================================================
-- 4. MODULE PROGRESS TABLE
-- Track user progress through modules and lessons
-- =====================================================
CREATE TABLE IF NOT EXISTS public.module_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- References auth.users
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.intro_lessons(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user per lesson
    UNIQUE(user_id, lesson_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_module_progress_user ON public.module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_module ON public.module_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_status ON public.module_progress(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on progress table
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can insert own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can update own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can delete own module progress" ON public.module_progress;

-- Users can view their own progress
CREATE POLICY "Users can view own module progress"
ON public.module_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own module progress"
ON public.module_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own module progress"
ON public.module_progress
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete own module progress"
ON public.module_progress
FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- AUTO-UPDATE TRIGGERS
-- =====================================================

-- Trigger for modules
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_modules_modtime ON public.modules;
CREATE TRIGGER update_modules_modtime
    BEFORE UPDATE ON public.modules
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_intro_lessons_modtime ON public.intro_lessons;
CREATE TRIGGER update_intro_lessons_modtime
    BEFORE UPDATE ON public.intro_lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_module_progress_modtime ON public.module_progress;
CREATE TRIGGER update_module_progress_modtime
    BEFORE UPDATE ON public.module_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- =====================================================
-- INSERT MODULE DATA
-- =====================================================

-- Insert Introduction Module
INSERT INTO public.modules (module_id, title, subtitle, description, icon, icon_type, order_no, is_locked, route)
VALUES 
    ('module-intro', 'Introduction', 'History of Brahmi', 'Discover the ancient origins and historical significance of Brahmi script, the mother of all Indic scripts', '📜', 'emoji', 1, FALSE, '/learn/intro')
ON CONFLICT (module_id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    is_locked = EXCLUDED.is_locked,
    route = EXCLUDED.route;

-- Insert other modules (keeping them locked for now)
INSERT INTO public.modules (module_id, title, subtitle, description, icon, icon_type, order_no, is_locked, route)
VALUES 
    ('module-swar', 'Swar (Vowels)', 'The Soul of Script', 'Master the vowels that form the foundation of Brahmi script', 'अ', 'text', 2, FALSE, '/letters'),
    ('module-vyanjan', 'Vyanjan (Consonants)', 'The Body of Script', 'Learn the consonants that build words and meaning', 'क', 'text', 3, TRUE, '/consonants'),
    ('module-matra', 'Mātrā / Barakhadi', 'The Art of Combination', 'Discover how vowels and consonants combine to create words', 'का', 'text', 4, TRUE, '#')
ON CONFLICT (module_id) DO NOTHING;

-- =====================================================
-- INSERT INTRODUCTION LESSONS (Based on PDF Pages 1-30)
-- =====================================================

-- Get the module_id for introduction
DO $$
DECLARE
    intro_module_id UUID;
BEGIN
    SELECT id INTO intro_module_id FROM public.modules WHERE module_id = 'module-intro';

    -- Clear existing intro lessons to avoid conflicts and start fresh
    DELETE FROM public.intro_lessons WHERE module_id = intro_module_id;

    -- Lesson 1: Welcome & Language Selection (Combined)
    INSERT INTO public.intro_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, order_no, estimated_time_minutes)
    VALUES 
        (intro_module_id, 'intro-lesson-1', 'Welcome & Language Selection', 'स्वागतम्', 'Welcome to the world of Brahmi script', '🙏', 1, 2);

    -- Lesson 2: Introduction to Brahmi
    INSERT INTO public.intro_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, order_no, estimated_time_minutes)
    VALUES 
        (intro_module_id, 'intro-lesson-3', 'Introduction to Brahmi', 'परिचय', 'A brief introduction to the ancient script', '📜', 2, 1);

    -- Lesson 3: Goal Selection
    INSERT INTO public.intro_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, order_no, estimated_time_minutes)
    VALUES 
        (intro_module_id, 'intro-lesson-4', 'Goal Selection', 'आपका लक्ष्य', 'What do you hope to achieve?', '🎯', 3, 1);

    -- Lesson 4: History and Origin
    INSERT INTO public.intro_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, order_no, estimated_time_minutes)
    VALUES 
        (intro_module_id, 'intro-lesson-5', 'History and Origin', 'इतिहास और उत्पत्ति', 'Learn about where Brahmi came from', '🏛️', 4, 5);

    -- Lesson 5: Script vs. Language Concepts
    INSERT INTO public.intro_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, order_no, estimated_time_minutes)
    VALUES 
        (intro_module_id, 'intro-lesson-6', 'Script vs. Language', 'लिपि और भाषा', 'Understanding the difference between writing and speaking', '✍️', 5, 4);

    -- Lesson 6: Spiritual Significance
    INSERT INTO public.intro_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, order_no, estimated_time_minutes)
    VALUES 
        (intro_module_id, 'intro-lesson-7', 'Spiritual Significance', 'आध्यात्मिक महत्त्व', 'The divine connection of Brahmi script', '✨', 6, 7);

    -- Lesson 7: Time Commitment
    INSERT INTO public.intro_lessons (module_id, lesson_id, title, subtitle, description, thumbnail_icon, order_no, estimated_time_minutes)
    VALUES 
        (intro_module_id, 'intro-lesson-8', 'Time Commitment', 'समय का संकल्प', 'How much time can you dedicate?', '⏱️', 7, 2);

END $$;

-- =====================================================
-- INSERT LESSON CONTENT (Detailed slides for each lesson)
-- =====================================================

DO $$
DECLARE
    lesson1_id UUID;
    lesson3_id UUID;
    lesson4_id UUID;
    lesson5_id UUID;
    lesson6_id UUID;
    lesson7_id UUID;
    lesson8_id UUID;
BEGIN
    -- Get lesson IDs
    SELECT id INTO lesson1_id FROM public.intro_lessons WHERE lesson_id = 'intro-lesson-1';
    SELECT id INTO lesson3_id FROM public.intro_lessons WHERE lesson_id = 'intro-lesson-3';
    SELECT id INTO lesson4_id FROM public.intro_lessons WHERE lesson_id = 'intro-lesson-4';
    SELECT id INTO lesson5_id FROM public.intro_lessons WHERE lesson_id = 'intro-lesson-5';
    SELECT id INTO lesson6_id FROM public.intro_lessons WHERE lesson_id = 'intro-lesson-6';
    SELECT id INTO lesson7_id FROM public.intro_lessons WHERE lesson_id = 'intro-lesson-7';
    SELECT id INTO lesson8_id FROM public.intro_lessons WHERE lesson_id = 'intro-lesson-8';

    -- ====================================================
    -- LESSON 1: Welcome & Language Selection (Combined)
    -- ====================================================
    
    INSERT INTO public.intro_lesson_content (lesson_id, content_type, title, content, order_no)
    VALUES 
        (lesson1_id, 'text', 'Welcome', 'स्वागतम्
স্বাগতম
స్వాగతం
வரவேற்பு
સ્વાગતમ્
ಸ್ವಾಗತಮ್
ସ୍ବାଗତମ୍
ਸਵਾਗਤਮ੍
Welcome

चलिए शुरू करें', 1);
    
    INSERT INTO public.intro_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson1_id, 'questionnaire', 'भाषा चुनें', 'कृपया अपनी पसंदीदा भाषा चुनें:', 
         '{"options": ["हिन्दी", "தமிழ்", "తెలుగు", "বাংলা", "ગુજરાતી", "ಕನ್ನಡ", "ଓଡ଼ିଆ", "ਪੰਜਾਬੀ", "English"]}'::jsonb, 2);

    -- ====================================================
    -- LESSON 2: Introduction to Brahmi
    -- ====================================================
    
    INSERT INTO public.intro_lesson_content (lesson_id, content_type, title, content, order_no)
    VALUES 
        (lesson3_id, 'text', 'Introduction', 'मैं हूँ ब्राह्मी लिपि। अति प्राचीन, अत्यन्त महत्त्वपूर्ण और अत्यधिक प्रिय !', 1);

    -- ====================================================
    -- LESSON 4: Goal Selection
    -- ====================================================
    
    INSERT INTO public.intro_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson4_id, 'questionnaire', 'आपका लक्ष्य क्या है?', 'आप ब्राह्मी लिपि क्यों सीखना चाहते हैं?', 
         '{"options": ["धार्मिक ज्ञान के लिए", "ऐतिहासिक शोध", "कौशल विकास", "परीक्षा/करियर"]}'::jsonb, 1);

    -- ====================================================
    -- LESSON 5: History and Origin
    -- ====================================================
    
    INSERT INTO public.intro_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson5_id, 'text', NULL, 'मेरा छोटा-सा परिचय क्या आप जानना चाहेंगे? या सीधे आगे बढ़ना चाहेंगे?', NULL, 1),
        (lesson5_id, 'text', NULL, 'मैं आदि ब्रह्मा, प्रथम तीर्थंकर महाराजा श्री ऋषभदेव जी के द्वारा बनाई गई लिपि हूँ।', NULL, 2),
        (lesson5_id, 'text', NULL, 'मुझे उन्होंने अपनी पुत्री ब्राह्मी को पढ़ाते समय रचा।', NULL, 3),
        (lesson5_id, 'text', NULL, 'ब्राह्मी के साथ ही महाराज श्री ऋषभदेव जी ने अपनी दूसरी पुत्री सुन्दरी को भी ''अंक विद्या'' सिखाई।', NULL, 4),
        (lesson5_id, 'text', NULL, 'उन दोनों ने भगवान श्री ऋषभदेव जी द्वारा प्रदत्त विद्याओं का अत्याधिक प्रचार किया।', NULL, 5),
        (lesson5_id, 'text', NULL, 'मेरा नाम ''ब्राह्मी लिपि'' क्यों पड़ा? इस लिपि का ज्ञान सामान्य प्रजा को ब्राह्मी ने दिया, उसके कारण से ही मेरा नाम ''ब्राह्मी लिपि'' पड़ा।', NULL, 6),
        (lesson5_id, 'mcq', 'साधुवाद! एक प्रश्न...', 'ब्राह्मी लिपि की रचना किसने की थी?', '{"options": ["महाराजा भरत", "तीर्थंकर भगवान ऋषभदेव", "सम्राट अशोक"], "correct_answer": "तीर्थंकर भगवान ऋषभदेव"}'::jsonb, 7);

    -- ====================================================
    -- LESSON 6: Script vs. Language Concepts
    -- ====================================================
    
    INSERT INTO public.intro_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson6_id, 'text', NULL, 'मैं भाषा नहीं हूँ! स्मरण रहे कि मैं कोई भाषा नहीं हूँ, केवल लिखने की पद्धति हूँ।', NULL, 1),
        (lesson6_id, 'text', NULL, '1. जिस तरीके से हम बोलते हैं, उसे ''भाषा'' कहते हैं। जैसे हिन्दी, बंगाली, तेलुगू, तमिल, गुजराती, कन्नड़, ओड़िया, पंजाबी, अंग्रेज़ी आदि।', NULL, 2),
        (lesson6_id, 'text', NULL, '2. जिस माध्यम से किसी भाषा को लिखा जाता है, उसे ''लिपि'' कहते हैं। जैसे हिन्दी-देवनागरी, बंगाली-बंगाली, गुजराती-गुजराती, तेलुगू-तेलुगू, तमिल-तमिल, कन्नड़-कन्नड़, ओड़िया-ओड़िया, पंजाबी-गुरुमुखी, अंग्रेज़ी-लैटिन आदि।', NULL, 3),
        (lesson6_id, 'text', NULL, 'मेरी विशेषता: मैं मूल रूप से ''प्राकृत भाषा'' की लिपि हूँ।', NULL, 4),
        (lesson6_id, 'text', NULL, 'परन्तु मुझे देवनागरी लिपि अथवा लैटिन/रोमन लिपि के समान किसी भी भाषा को लिखने में उपयोग कर सकते हैं।', NULL, 5),
        (lesson6_id, 'text', NULL, 'और हाँ, मैं आपको एक रहस्य बताती हूँ। आप मुझे आपकी गुप्त लिपि बनाकर सारे रहस्य सामान्य लोगों से छिपाकर रख सकते हैं।', NULL, 6),
        (lesson6_id, 'mcq', 'थोड़ी परीक्षा हो जाए!', 'क्या ब्राह्मी एक भाषा है?', '{"options": ["हाँ, यह एक भाषा है", "नहीं, यह लिखने की पद्धति (लिपि) है"], "correct_answer": "नहीं, यह लिखने की पद्धति (लिपि) है"}'::jsonb, 7);

    -- ====================================================
    -- LESSON 7: Spiritual Significance
    -- ====================================================
    
    INSERT INTO public.intro_lesson_content (lesson_id, content_type, title, content, order_no)
    VALUES 
        (lesson7_id, 'text', NULL, 'मेरा महत्त्व: मेरे स्वर और व्यञ्जन, देवनागरी (हिन्दी) जैसे ही हैं। मैं आपको सीधा तीर्थंकर श्री ऋषभदेव जी से जोड़ सकती हूँ।', 1),
        (lesson7_id, 'staircase_swar', 'The Staircase of Vowels', 'मेरे स्वर (Swar) एक वैज्ञानिक क्रम में व्यवस्थित हैं, जैसे ज्ञान की सीढ़ियाँ।', 2),
        (lesson7_id, 'text', NULL, 'तो आप मेरा साथ मत छोड़ना।', 3),
        (lesson7_id, 'text', NULL, 'मैं अपने साथ आपको सीधा तीर्थंकर ऋषभदेव जी महाराज से जोड़ने का पूरा प्रयत्न करूँगी क्योंकि आपके पास अब केवल मैं ही वास्तविक रूप में तीर्थंकर भगवान की स्मृति स्वरूप हूँ।', 4),
        (lesson7_id, 'text', NULL, 'मुझे ज्ञात है, आप क्या विचार कर रहे हैं। हमारे पास जो ग्रन्थ हैं, उन्हें हम जिनवाणी कहते हैं अर्थात् जिनेन्द्र भगवान की दिव्यध्वनि ।', 5),
        (lesson7_id, 'text', NULL, 'तो हुआ न तीर्थंकर भगवान जी का साक्षात् स्वरूप हम सभी के पास।', 6),
        (lesson7_id, 'text', NULL, 'जी बिल्कुल ! आप ठीक बोले। पर एक बार विचार कीजिएगा, जो ग्रन्थ हमारे पास हैं, उन्हें ही हम जिनवाणी स्वरूप मानते-पूजते हैं ।', 7),
        (lesson7_id, 'text', NULL, 'भगवान की दिव्यध्वनि को गणधरों ने गूंथा, आचार्यों को सौंपा फिर परम्परा से हम तक बस थोड़ा-सा ही आ पाया है।', 8),
        (lesson7_id, 'text', NULL, 'पर वह साक्षात् जिनवाणी नहीं है, परम्परा रूप से जिनवाणी है।', 9),
        (lesson7_id, 'text', NULL, 'भगवान श्री ऋषभदेव जी के पावन निर्वाण के पश्चात्, एक कोड़ा-कोड़ी सागर की असीम काल-यात्रा पार कर, मैं आज आपके समक्ष उपस्थित हूँ - अनन्त युग-युगान्तर की पवित्र स्मृतियाँ, अक्षुण्ण ज्ञान-गंगा और भगवान ऋषभदेव की दिव्य धरोहर के साथ।', 10),
        (lesson7_id, 'text', NULL, 'तो आप समझ गए न; मैं कैसे हूँ, साक्षात् तीर्थंकर भगवान जी की स्मृति स्वरूप ।', 11);

    -- ====================================================
    -- LESSON 8: Time Commitment
    -- ====================================================
    
    INSERT INTO public.intro_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson8_id, 'questionnaire', 'आप मुझे सीखने के लिए रोज कितना समय देना चाहेंगे?', 'समय चुनिए:', 
         '{"options": ["3 मिनट", "5 मिनट", "8 मिनट", "10 मिनट", "15 मिनट"]}'::jsonb, 1),
        (lesson8_id, 'text', 'Follow-up', 'अरे वाह ! इसका अर्थ यह है कि आप बहुत कम समय में सम्पूर्ण ब्राह्मी लिपि सीख सकते हैं।', NULL, 2);

END $$;

-- =====================================================
-- UTILITY VIEWS
-- =====================================================

-- View to see module completion statistics
CREATE OR REPLACE VIEW module_completion_stats AS
SELECT 
    m.module_id,
    m.title,
    COUNT(DISTINCT il.id) as total_lessons,
    COUNT(DISTINCT CASE WHEN mp.status = 'completed' THEN mp.lesson_id END) as completed_lessons,
    ROUND(
        (COUNT(DISTINCT CASE WHEN mp.status = 'completed' THEN mp.lesson_id END)::decimal / 
        NULLIF(COUNT(DISTINCT il.id), 0) * 100), 2
    ) as completion_percentage
FROM public.modules m
LEFT JOIN public.intro_lessons il ON m.id = il.module_id
LEFT JOIN public.module_progress mp ON il.id = mp.lesson_id
GROUP BY m.module_id, m.title, m.order_no
ORDER BY m.order_no;

-- View for user's module progress
CREATE OR REPLACE VIEW user_module_progress AS
SELECT 
    mp.user_id,
    m.module_id,
    m.title as module_title,
    il.lesson_id,
    il.title as lesson_title,
    mp.status,
    mp.progress_percentage,
    mp.completed_at,
    il.order_no,
    il.estimated_time_minutes
FROM public.module_progress mp
JOIN public.intro_lessons il ON mp.lesson_id = il.id
JOIN public.modules m ON il.module_id = m.id
ORDER BY m.order_no, il.order_no;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.modules IS 'Stores learning modules (Introduction, Vowels, Consonants, Matra)';
COMMENT ON TABLE public.intro_lessons IS 'Individual lessons within the Introduction module';
COMMENT ON TABLE public.intro_lesson_content IS 'Content slides/steps for each introduction lesson';
COMMENT ON TABLE public.module_progress IS 'Tracks user progress through modules and lessons';

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Brahmi Introduction Module database setup complete!';
    RAISE NOTICE '📚 Created 4 tables: modules, intro_lessons, intro_lesson_content, module_progress';
    RAISE NOTICE '📖 Inserted 8 introduction lessons with detailed content';
    RAISE NOTICE '🔒 RLS policies configured for user progress tracking';
    RAISE NOTICE '🚀 Introduction module is now unlocked and ready for users!';
END $$;
