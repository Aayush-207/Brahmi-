-- =========================================
-- MATRA MODULE DATABASE SETUP
-- =========================================
-- This script creates the complete schema and sample content
-- for the Swar Matra (Vowel Diacritics) learning module

-- =========================================
-- 0. DROP EXISTING TABLES (CLEAN SLATE)
-- =========================================

-- Drop tables in correct order (dependencies first)
DROP TABLE IF EXISTS matra_lesson_answers CASCADE;
DROP TABLE IF EXISTS matra_progress CASCADE;
DROP TABLE IF EXISTS matra_lesson_content CASCADE;
DROP TABLE IF EXISTS matra_lessons CASCADE;

-- =========================================
-- 1. CREATE TABLES
-- =========================================

-- Matra Lessons Table
CREATE TABLE IF NOT EXISTS matra_lessons (
    id SERIAL PRIMARY KEY,
    module_id TEXT NOT NULL DEFAULT 'module-matra',
    lesson_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    matra_symbol TEXT, -- The matra character (e.g., 'ि', 'ा', 'े')
    order_no INTEGER NOT NULL,
    estimated_time INTEGER DEFAULT 5, -- in minutes
    created_at TIMESTAMP DEFAULT NOW()
);

-- Matra Lesson Content Table
CREATE TABLE IF NOT EXISTS matra_lesson_content (
    id SERIAL PRIMARY KEY,
    lesson_id TEXT NOT NULL REFERENCES matra_lessons(lesson_id) ON DELETE CASCADE,
    content_type TEXT NOT NULL, -- title_slide, text, matra_intro, visual_guide, examples, pronunciation, tracing, practice, mcq, summary
    title TEXT,
    content TEXT,
    audio_url TEXT,
    metadata JSONB, -- For storing additional data like MCQ options, brahmi symbols, etc.
    order_no INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Matra Progress Table (tracks user completion)
CREATE TABLE IF NOT EXISTS matra_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES matra_lessons(lesson_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed
    progress_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Matra Lesson Answers Table (for MCQs and exercises)
CREATE TABLE IF NOT EXISTS matra_lesson_answers (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES matra_lessons(lesson_id) ON DELETE CASCADE,
    content_id INTEGER REFERENCES matra_lesson_content(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- 2. REGISTER MODULE
-- =========================================

INSERT INTO public.modules (module_id, title, subtitle, description, icon, icon_type, order_no, is_locked, route)
VALUES ('module-matra', 'Mātrā (Matras)', 'The Art of Vowel Diacritics', 'Learn vowel diacritics (matras) and how they combine with consonants', 'का', 'text', 4, FALSE, '/learn/matra')
ON CONFLICT (module_id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    is_locked = EXCLUDED.is_locked,
    route = EXCLUDED.route;

-- =========================================
-- 3. CREATE LESSONS
-- =========================================

INSERT INTO matra_lessons (lesson_id, title, subtitle, matra_symbol, order_no, estimated_time) VALUES
('matra-intro', 'मात्रा का परिचय', 'Introduction to Matras', '', 1, 8),
('matra-i', 'इ की मात्रा', 'The i Matra', 'ि', 2, 6),
('matra-ii', 'ई की मात्रा', 'The ī Matra', 'ी', 3, 6),
('matra-u', 'उ की मात्रा', 'The u Matra', 'ु', 4, 6),
('matra-uu', 'ऊ की मात्रा', 'The ū Matra', 'ू', 5, 6),
('matra-e', 'ए की मात्रा', 'The e Matra', 'े', 6, 6),
('matra-ai', 'ऐ की मात्रा', 'The ai Matra', 'ै', 7, 6),
('matra-o', 'ओ की मात्रा', 'The o Matra', 'ो', 8, 6),
('matra-au', 'औ की मात्रा', 'The au Matra', 'ौ', 9, 6),
('matra-am', 'अं की मात्रा', 'The anusvāra Matra', 'ं', 10, 6),
('matra-ah', 'अः की मात्रा', 'The visarga Matra', 'ः', 11, 6)
ON CONFLICT (lesson_id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    matra_symbol = EXCLUDED.matra_symbol,
    order_no = EXCLUDED.order_no,
    estimated_time = EXCLUDED.estimated_time;

-- =========================================
-- 4. LESSON 1: INTRODUCTION TO MATRA
-- =========================================


INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES

-- Title Slide
('matra-intro', 'title_slide', 'मात्रा का परिचय', 'आइए सीखें कि स्वर व्यञ्जन के साथ कैसे मिलते हैं!', NULL, 1),

-- What is Matra?
('matra-intro', 'text', 'मात्रा क्या है?', 'जब स्वर (अ, आ, इ, ई...) किसी व्यञ्जन (क, ख, ग...) के साथ जुड़ते हैं, तो वे अपना स्वतंत्र रूप छोड़कर मात्रा बन जाते हैं।

मात्रा एक विशेष चिह्न है जो व्यञ्जन के साथ लगकर उसकी ध्वनि को बदल देता है।', NULL, 2),

-- Rule 1: Independent Vowels
('matra-intro', 'visual_guide', 'स्वतन्त्र स्वर - नियम 1', 'जब स्वर शब्द वा आरम्भ में अथवा अकेले हों, तो वे अपना स्वतन्त्र रूप लेते हैं।

उदाहरण:
• अ (a)
• आ (ā)
• इ (i)
• ई (ī)
• उ (u)', '{"type": "rule", "rule_number": 1}', 3),

-- Rule 2: Dependent Forms (Matras)
('matra-intro', 'visual_guide', 'मात्रा चिह्न - नियम 2', 'जब स्वर किसी व्यञ्जन के बाद आता है तो वह मात्रा बन जाता है और व्यञ्जन से जुड़कर लिखा जाता है।

उदाहरण:
क + आ → का
क + इ → कि
क + ई → की
क + उ → कु', '{"type": "rule", "rule_number": 2, "examples": [{"consonant": "क", "vowel": "आ", "result": "का"}]}', 4),

-- Rule 3: Position of Matras
('matra-intro', 'visual_guide', 'मात्रा का स्थान - नियम 3', 'मात्राएँ अलग-अलग स्थान पर लग सकती हैं:

↑ ऊपर - ऐ की मात्रा (कै)
↓ नीचे - उ की मात्रा (कु)
→ आगे - ा की मात्रा (का)
← पीछे - ि की मात्रा (कि)

उदाहरण:
कि (+ि) - पीछे
के (+े) - आगे', '{"type": "rule", "rule_number": 3, "positions": {"above": "ऊपर", "below": "नीचे", "after": "आगे", "before": "पीछे"}}', 5),

-- Rule 4: Special Attention in Brahmi
('matra-intro', 'visual_guide', 'विशेष ध्यान - नियम 4', 'ब्राह्मी में मात्राओं का आकार और स्थान, देवनागरी से कुछ पृथक है।

मार्गदर्शन:
• ध्यान से देखें
• ट्रेस करें
• पहचानें

यह अभ्यास से सरल हो जाएगा!', '{"type": "rule", "rule_number": 4}', 6),

-- Key Points
('matra-intro', 'key_points', 'महत्वपूर्ण बिन्दु', '• स्वतंत्र स्वर = अकेले आते हैं
• मात्रा = व्यञ्जन के साथ जुड़ते हैं
• प्रत्येक स्वर की अपनी मात्रा होती है
• मात्रा 4 दिशाओं में लग सकती है
• ब्राह्मी में मात्राएँ अद्वितीय हैं', NULL, 7),

-- MCQ
('matra-intro', 'mcq', 'अब आपकी बारी!', 'जब स्वर व्यञ्जन के साथ जुड़ता है तो वह क्या बनता है?', 
'{"options": ["स्वतन्त्र स्वर", "मात्रा", "व्यञ्जन", "संयुक्त अक्षर"], "correct_answer": "मात्रा"}', 8),

-- Summary
('matra-intro', 'summary', 'बधाई हो! 🎊', 'आपने मात्रा के मूल नियम सीख लिए हैं!

✅ स्वतन्त्र स्वर vs मात्रा
✅ मात्रा के 4 स्थान
✅ ब्राह्मी की विशेषता

अब आप विभिन्न मात्राओं को सीखने के लिए तैयार हैं!', NULL, 9);

-- =========================================
-- 5. LESSON 2: इ MATRA (i)
-- =========================================


INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES

-- Title Slide
('matra-i', 'title_slide', 'इ की मात्रा', 'आइए सीखें "इ" की मात्रा!', '{"brahmi_symbol": "⚬"}', 1),

-- Introduction
('matra-i', 'matra_intro', 'इ मात्रा का परिचय', 'ब्राह्मी में: ⚬ (छोटा बिंदु या वृत्त)

यह व्यञ्जन के पहले लिखी जाती है लेकिन बाद में बोली जाती है!', 
'{"brahmi_form": "⚬", "position": "before"}', 2),

-- Visual comparison
('matra-i', 'visual_guide', 'ब्राह्मी लिपि में इ मात्रा', 'ब्राह्मी: क⚬, ख⚬, ग⚬, म⚬, र⚬

ध्यान दें: यह मात्रा व्यञ्जन के पहले लगती है!', 
'{"examples": ["क⚬", "म⚬", "र⚬"]}', 3),

-- Examples
('matra-i', 'examples', 'शब्द उदाहरण', '• किताब (kitāb) - book
• दिन (din) - day
• मिठाई (miṭhāī) - sweet
• शिक्षा (śikṣā) - education
• विद्या (vidyā) - knowledge', NULL, 4),

-- Pronunciation Guide
('matra-i', 'pronunciation', 'उच्चारण', 'इ मात्रा की ध्वनि "इ" होती है - जैसे "किताब" में।

यह छोटी "इ" की ध्वनि है।

अभ्यास: कि, खि, गि, घि, चि', '{"sound": "i", "examples": ["कि", "मि", "दि"]}', 5),

-- Practice (can be tracing or recognition)
('matra-i', 'practice', 'अभ्यास करें', 'निम्नलिखित अक्षरों को इ मात्रा के साथ लिखें:
क + ि = कि
म + ि = मि
र + ि = रि
व + ि = वि', NULL, 6),

-- Writing Practice (Tracing)
('matra-i', 'writing_practice', 'लिखने का अभ्यास', 'अब इ मात्रा को लिखने का अभ्यास करें!', '{"character": "⚬"}', 7),

-- MCQ
('matra-i', 'mcq', 'प्रश्न', 'इ मात्रा कहाँ लगती है?', 
'{"options": ["व्यञ्जन के बाद", "व्यञ्जन के पहले", "व्यञ्जन के ऊपर", "व्यञ्जन के नीचे"], "correct_answer": "व्यञ्जन के पहले"}', 8),

-- Summary
('matra-i', 'summary', 'शाबाश! 🎉', 'आपने इ मात्रा सीख ली!

✅ इ मात्रा का रूप: ि (देवनागरी), ⚬ (ब्राह्मी)
✅ स्थान: व्यञ्जन के पहले
✅ ध्वनि: "इ" (छोटी इ)

अगली मात्रा के लिए तैयार रहें!', NULL, 9);

-- =========================================
-- 6. LESSON 3: ई MATRA (ī)
-- =========================================


INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES

-- Title Slide
('matra-ii', 'title_slide', 'ई की मात्रा', 'आइए सीखें "ई" की मात्रा!', '{"brahmi_symbol": "⚬⚬"}', 1),

-- Introduction
('matra-ii', 'matra_intro', 'ई मात्रा का परिचय', 'ब्राह्मी में: ⚬⚬ (दो बिंदु या दोहरा वृत्त)

यह "इ" की लंबी ध्वनि है।', 
'{"brahmi_form": "⚬⚬", "position": "after"}', 2),

-- Visual comparison
('matra-ii', 'visual_guide', 'ब्राह्मी लिपि में ई मात्रा', 'ब्राह्मी: क⚬⚬, ख⚬⚬, ग⚬⚬, म⚬⚬, र⚬⚬

ध्यान दें: यह मात्रा व्यञ्जन के बाद लगती है!', 
'{"examples": ["क⚬⚬", "म⚬⚬", "र⚬⚬"]}', 3),

-- Examples
('matra-ii', 'examples', 'शब्द उदाहरण', '• मीठा (mīṭhā) - sweet
• नीला (nīlā) - blue
• जीवन (jīvan) - life
• पीला (pīlā) - yellow
• शीत (śīt) - cold', NULL, 4),

-- Writing Practice (Tracing)
('matra-ii', 'writing_practice', 'लिखने का अभ्यास', 'अब ई मात्रा को लिखने का अभ्यास करें!', '{"character": "⚬⚬"}', 5),

-- MCQ
('matra-ii', 'mcq', 'प्रश्न', 'ई मात्रा की ध्वनि क्या है?', 
'{"options": ["छोटी इ", "लंबी ई", "छोटी उ", "लंबी ऊ"], "correct_answer": "लंबी ई"}', 6),

-- Summary
('matra-ii', 'summary', 'बहुत अच्छे! 👏', 'आपने ई मात्रा सीख ली!

✅ ई मात्रा का रूप: ी (देवनागरी), ⚬⚬ (ब्राह्मी)
✅ स्थान: व्यञ्जन के बाद/दाईं ओर
✅ ध्वनि: "ई" (लंबी ई)', NULL, 7);

-- =========================================
-- 7. LESSON 4-11: REMAINING MATRAS (TEMPLATE)
-- =========================================


-- उ MATRA (u)
INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
('matra-u', 'title_slide', 'उ की मात्रा', 'आइए सीखें "उ" की मात्रा!', '{"brahmi_symbol": "◯_"}', 1),
('matra-u', 'matra_intro', 'उ मात्रा का परिचय', 'ब्राह्मी में: ◯_ (वृत्त + रेखा नीचे)

यह व्यञ्जन के नीचे लगती है।', '{"brahmi_form": "◯_", "position": "below"}', 2),
('matra-u', 'examples', 'शब्द उदाहरण', '• गुरु (guru) - teacher
• सुख (sukh) - happiness
• युग (yug) - era
• शुभ (śubh) - auspicious', NULL, 3),
('matra-u', 'writing_practice', 'लिखने का अभ्यास', 'अब उ मात्रा को लिखने का अभ्यास करें!', '{"character": "◯_"}', 4),
('matra-u', 'summary', 'शाबाश! ✨', 'उ मात्रा पूर्ण!', NULL, 5);

-- ऊ MATRA (ū)
INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
('matra-uu', 'title_slide', 'ऊ की मात्रा', 'आइए सीखें "ऊ" की मात्रा!', '{"brahmi_symbol": "◯⚌"}', 1),
('matra-uu', 'matra_intro', 'ऊ मात्रा का परिचय', 'ब्राह्मी में: ◯⚌ (वृत्त + दोहरी रेखा)

यह "उ" की लंबी ध्वनि है।', '{"brahmi_form": "◯⚌", "position": "below"}', 2),
('matra-uu', 'examples', 'शब्द उदाहरण', '• भूमि (bhūmi) - earth
• सूर्य (sūrya) - sun
• दूध (dūdh) - milk
• फूल (phūl) - flower', NULL, 3),
('matra-uu', 'writing_practice', 'लिखने का अभ्यास', 'अब ऊ मात्रा को लिखने का अभ्यास करें!', '{"character": "◯⚌"}', 4),
('matra-uu', 'summary', 'उत्कृष्ट! 🌟', 'ऊ मात्रा पूर्ण!', NULL, 5);

-- ए MATRA (e)
INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
('matra-e', 'title_slide', 'ए की मात्रा', 'आइए सीखें "ए" की मात्रा!', '{"brahmi_symbol": "△"}', 1),
('matra-e', 'matra_intro', 'ए मात्रा का परिचय', 'ब्राह्मी में: △ (त्रिकोण ऊपर)

यह व्यञ्जन के ऊपर/आगे लगती है।', '{"brahmi_form": "△", "position": "above"}', 2),
('matra-e', 'examples', 'शब्द उदाहरण', '• देश (deś) - country
• मेला (melā) - fair
• सेब (seb) - apple
• खेल (khel) - game', NULL, 3),
('matra-e', 'writing_practice', 'लिखने का अभ्यास', 'अब ए मात्रा को लिखने का अभ्यास करें!', '{"character": "△"}', 4),
('matra-e', 'summary', 'बेहतरीन! 🎯', 'ए मात्रा पूर्ण!', NULL, 5);

-- ऐ MATRA (ai)
INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
('matra-ai', 'title_slide', 'ऐ की मात्रा', 'आइए सीखें "ऐ" की मात्रा!', '{"brahmi_symbol": "△̈"}', 1),
('matra-ai', 'matra_intro', 'ऐ मात्रा का परिचय', 'ब्राह्मी में: △̈ (दोहरा त्रिकोण)

यह "ए" की विस्तृत ध्वनि है।', '{"brahmi_form": "△̈", "position": "above"}', 2),
('matra-ai', 'examples', 'शब्द उदाहरण', '• कैसा (kaisā) - how
• मैदान (maidān) - field
• पैसा (paisā) - money
• तैयार (taiyār) - ready', NULL, 3),
('matra-ai', 'writing_practice', 'लिखने का अभ्यास', 'अब ऐ मात्रा को लिखने का अभ्यास करें!', '{"character": "△̈"}', 4),
('matra-ai', 'summary', 'वाह! 🌺', 'ऐ मात्रा पूर्ण!', NULL, 5);

-- ओ MATRA (o)
INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
('matra-o', 'title_slide', 'ओ की मात्रा', 'आइए सीखें "ओ" की मात्रा!', '{"brahmi_symbol": "⚬̄"}', 1),
('matra-o', 'matra_intro', 'ओ मात्रा का परिचय', 'ब्राह्मी में: ⚬̄ (वृत्त + रेखा)

यह व्यञ्जन के बाद लगती है।', '{"brahmi_form": "⚬̄", "position": "after"}', 2),
('matra-o', 'examples', 'शब्द उदाहरण', '• बोल (bol) - speak
• तोता (totā) - parrot
• सोना (sonā) - gold/sleep
• पोता (potā) - grandson', NULL, 3),
('matra-o', 'writing_practice', 'लिखने का अभ्यास', 'अब ओ मात्रा को लिखने का अभ्यास करें!', '{"character": "⚬̄"}', 4),
('matra-o', 'summary', 'शानदार! 💫', 'ओ मात्रा पूर्ण!', NULL, 5);

-- औ MATRA (au)
INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
('matra-au', 'title_slide', 'औ की मात्रा', 'आइए सीखें "औ" की मात्रा!', '{"brahmi_symbol": "⚬̄̈"}', 1),
('matra-au', 'matra_intro', 'औ मात्रा का परिचय', 'ब्राह्मी में: ⚬̄̈ (वृत्त + दोहरी रेखा)

यह "ओ" की विस्तृत ध्वनि है।', '{"brahmi_form": "⚬̄̈", "position": "after"}', 2),
('matra-au', 'examples', 'शब्द उदाहरण', '• कौन (kaun) - who
• मौसम (mausam) - weather
• गौरव (gaurav) - pride
• औरत (aurat) - woman', NULL, 3),
('matra-au', 'writing_practice', 'लिखने का अभ्यास', 'अब औ मात्रा को लिखने का अभ्यास करें!', '{"character": "⚬̄̈"}', 4),
('matra-au', 'summary', 'अद्भुत! 🏆', 'औ मात्रा पूर्ण!', NULL, 5);

-- अं MATRA (anusvāra)
INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
('matra-am', 'title_slide', 'अं की मात्रा (अनुस्वार)', 'आइए सीखें अनुस्वार की मात्रा!', '{"brahmi_symbol": "⚬·"}', 1),
('matra-am', 'matra_intro', 'अनुस्वार का परिचय', 'ब्राह्मी में: ⚬· (छोटा बिंदु ऊपर)

यह नासिक्य ध्वनि है।', '{"brahmi_form": "⚬·", "position": "above"}', 2),
('matra-am', 'examples', 'शब्द उदाहरण', '• संत (sant) - saint
• अंक (ank) - number
• गंगा (gaṅgā) - Ganges
• मंदिर (mandir) - temple
• हंस (hans) - swan', NULL, 3),
('matra-am', 'writing_practice', 'लिखने का अभ्यास', 'अब अं (अनुस्वार) को लिखने का अभ्यास करें!', '{"character": "⚬·"}', 4),
('matra-am', 'summary', 'सुंदर! ✨', 'अनुस्वार पूर्ण!', NULL, 5);

-- अः MATRA (visarga)
INSERT INTO matra_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
('matra-ah', 'title_slide', 'अः की मात्रा (विसर्ग)', 'आइए सीखें विसर्ग की मात्रा!', '{"brahmi_symbol": "⚬:"}', 1),
('matra-ah', 'matra_intro', 'विसर्ग का परिचय', 'ब्राह्मी में: ⚬: (दो ऊर्ध्व बिंदु)

यह "ह" की हल्की ध्वनि है।', '{"brahmi_form": "⚬:", "position": "after"}', 2),
('matra-ah', 'examples', 'शब्द उदाहरण', '• नमः (namaḥ) - salutation
• अतः (ataḥ) - therefore
• पुनः (punaḥ) - again
• प्रातः (prātaḥ) - morning', NULL, 3),
('matra-ah', 'writing_practice', 'लिखने का अभ्यास', 'अब अः (विसर्ग) को लिखने का अभ्यास करें!', '{"character": "⚬:"}', 4),
('matra-ah', 'summary', 'पूर्ण! 🎊', 'सभी मात्राएँ पूर्ण! आप मास्टर हैं!', NULL, 5);

-- =========================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- =========================================

CREATE INDEX IF NOT EXISTS idx_matra_lessons_order ON matra_lessons(order_no);
CREATE INDEX IF NOT EXISTS idx_matra_content_lesson ON matra_lesson_content(lesson_id, order_no);
CREATE INDEX IF NOT EXISTS idx_matra_progress_user ON matra_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_matra_answers_user ON matra_lesson_answers(user_id, lesson_id);

-- =========================================
-- END OF SCRIPT
-- =========================================
