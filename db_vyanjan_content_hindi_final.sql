-- Complete Vyanjan Module Content Update (All Hindi)
-- This script updates all 8 vyanjan lessons with comprehensive Hindi content
-- Uses CORRECT English lesson titles from the database

DO $$
DECLARE
    lesson1_id UUID;
    lesson2_id UUID;
    lesson3_id UUID;
    lesson4_id UUID;
    lesson5_id UUID;
    lesson6_id UUID;
    lesson7_id UUID;
    lesson8_id UUID;
BEGIN
    -- Get lesson IDs using CORRECT ENGLISH titles from database
    SELECT id INTO lesson1_id FROM vyanjan_lessons WHERE title = 'Introduction to Vyanjan';
    SELECT id INTO lesson2_id FROM vyanjan_lessons WHERE title = 'Ka-Varga';
    SELECT id INTO lesson3_id FROM vyanjan_lessons WHERE title = 'Cha-Varga';
    SELECT id INTO lesson4_id FROM vyanjan_lessons WHERE title = 'Ta-Varga (Retroflex)';
    SELECT id INTO lesson5_id FROM vyanjan_lessons WHERE title = 'Ta-Varga (Dental)';
    SELECT id INTO lesson6_id FROM vyanjan_lessons WHERE title = 'Pa-Varga';
    SELECT id INTO lesson7_id FROM vyanjan_lessons WHERE title = 'Antastha';
    SELECT id INTO lesson8_id FROM vyanjan_lessons WHERE title = 'Ushma';

    -- Delete existing English content
    DELETE FROM vyanjan_lesson_content WHERE lesson_id IN (lesson1_id, lesson2_id, lesson3_id, lesson4_id, lesson5_id, lesson6_id, lesson7_id, lesson8_id);

    -- ==========================================
    -- LESSON 1: व्यञ्जन का परिचय (Introduction to Vyanjan)
    -- ==========================================
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson1_id, 'title_slide', 'व्यञ्जन (Vyanjan)', 'ब्राह्मी व्यञ्जनों की दुनिया में आपका स्वागत है', NULL, 1),
        (lesson1_id, 'text', 'व्यञ्जन क्या हैं?', 'व्यञ्जन (Vyanjan) वे ध्वनियाँ हैं जो लिपि का मूल आधार बनाती हैं। जहाँ स्वर (Svar) जीवन और ध्वनि देते हैं, वहीं व्यञ्जन शब्दों को संरचना और रूप प्रदान करते हैं।', NULL, 2),
        (lesson1_id, 'text', 'वर्गीकरण', 'ब्राह्मी व्यञ्जन वैज्ञानिक रूप से वर्गों में विभाजित हैं, जो मुख के विभिन्न भागों से उच्चारित होते हैं:

• कण्ठ्य - कंठ से उच्चारित
• तालव्य - तालु से उच्चारित  
• मूर्धन्य - मूर्धा (ऊपरी तालु) से उच्चारित
• दन्त्य - दाँतों से उच्चारित
• ओष्ठ्य - होठों से उच्चारित', NULL, 3),
        (lesson1_id, 'text', 'पाँच वर्ग', 'प्रत्येक प्रमुख वर्ग में 5 व्यञ्जन होते हैं जो एक विशेष क्रम का पालन करते हैं:

1. अल्पप्राण अघोष (Unaspirated Unvoiced)
2. महाप्राण अघोष (Aspirated Unvoiced)
3. अल्पप्राण घोष (Unaspirated Voiced)
4. महाप्राण घोष (Aspirated Voiced)
5. अनुनासिक (Nasal)', NULL, 4),
        (lesson1_id, 'mcq', 'त्वरित जाँच', 'व्यञ्जनों को किस आधार पर वर्गीकृत किया जाता है?', '{"options": ["उनके आकार के आधार पर", "उनके उच्चारण स्थान के आधार पर", "उनकी आयु के आधार पर"], "correct_answer": "उनके उच्चारण स्थान के आधार पर"}'::jsonb, 5);

    -- ==========================================
    -- LESSON 2: क वर्ग (Ka-Varga) - Guttural Consonants
    -- ==========================================
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson2_id, 'title_slide', 'क वर्ग', 'कण्ठ्य व्यञ्जन - कंठ से उच्चारित', NULL, 1),
        (lesson2_id, 'consonant_intro', 'कण्ठ्य व्यञ्जन', 'ये व्यञ्जन कण्ठ (गले) से उच्चारित होते हैं। अपना हाथ गले पर रखें और उच्चारण करते समय कंपन महसूस करें।', '{"consonants": ["क", "ख", "ग", "घ", "ङ"]}'::jsonb, 2),
        
        -- क (Ka)
        (lesson2_id, 'pronunciation', 'क (Ka)', 'अल्पप्राण, अघोष

उच्चारण: "क" जैसे "कमल" में
ब्राह्मी चिह्न: 𑀓
देवनागरी: क', '{"brahmi_symbol": "𑀓", "devanagari": "क", "sound": "ka", "character": "क"}'::jsonb, 3),
        (lesson2_id, 'writing_practice', 'क लिखना सीखें', 'अब आप ब्राह्मी में क (𑀓) लिखने का अभ्यास करेंगे। गुरुजी के मार्गदर्शन का पालन करें।', '{"character": "𑀓"}'::jsonb, 4),
        (lesson2_id, 'examples', 'क के उदाहरण', 'क से बनने वाले शब्द:
• कमल (Kamal) - Lotus
• कला (Kala) - Art  
• किरण (Kiran) - Ray

ब्राह्मी में: 𑀓', NULL, 5),
        
        -- ख (Kha)
        (lesson2_id, 'pronunciation', 'ख (Kha)', 'महाप्राण, अघोष

उच्चारण: "ख" जैसे "खत" में (साँस के साथ)
ब्राह्मी चिह्न: 𑀔
देवनागरी: ख', '{"brahmi_symbol": "𑀔", "devanagari": "ख", "sound": "kha", "character": "ख"}'::jsonb, 6),
        (lesson2_id, 'writing_practice', 'ख लिखना सीखें', 'अब आप ब्राह्मी में ख (𑀔) लिखने का अभ्यास करेंगे।', '{"character": "𑀔"}'::jsonb, 7),
        (lesson2_id, 'examples', 'ख के उदाहरण', 'ख से बनने वाले शब्द:
• खत (Khat) - Letter
• खेल (Khel) - Game
• खुश (Khush) - Happy

ब्राह्मी में: 𑀔', NULL, 8),
        
        -- ग (Ga)
        (lesson2_id, 'pronunciation', 'ग (Ga)', 'अल्पप्राण, घोष

उच्चारण: "ग" जैसे "गाना" में
ब्राह्मी चिह्न: 𑀕
देवनागरी: ग', '{"brahmi_symbol": "𑀕", "devanagari": "ग", "sound": "ga", "character": "ग"}'::jsonb, 9),
        (lesson2_id, 'writing_practice', 'ग लिखना सीखें', 'अब आप ब्राह्मी में ग (𑀕) लिखने का अभ्यास करेंगे।', '{"character": "𑀕"}'::jsonb, 10),
        (lesson2_id, 'examples', 'ग के उदाहरण', 'ग से बनने वाले शब्द:
• गाना (Gaana) - Song
• गुरु (Guru) - Teacher
• गति (Gati) - Speed

ब्राह्मी में: 𑀕', NULL, 11),
        
        -- घ (Gha)
        (lesson2_id, 'pronunciation', 'घ (Gha)', 'महाप्राण, घोष

उच्चारण: "घ" जैसे "घर" में (साँस के साथ)
ब्राह्मी चिह्न: 𑀖
देवनागरी: घ', '{"brahmi_symbol": "𑀖", "devanagari": "घ", "sound": "gha", "character": "घ"}'::jsonb, 12),
        (lesson2_id, 'writing_practice', 'घ लिखना सीखें', 'अब आप ब्राह्मी में घ (𑀖) लिखने का अभ्यास करेंगे।', '{"character": "𑀖"}'::jsonb, 13),
        (lesson2_id, 'examples', 'घ के उदाहरण', 'घ से बनने वाले शब्द:
• घर (Ghar) - Home
• घटना (Ghatna) - Event
• घंटा (Ghanta) - Hour

ब्राह्मी में: 𑀖', NULL, 14),
        
        -- ङ (Nga)
        (lesson2_id, 'pronunciation', 'ङ (Nga)', 'अनुनासिक

उच्चारण: अनुस्वार की ध्वनि, नाक से उच्चारित
ब्राह्मी चिह्न: 𑀗
देवनागरी: ङ', '{"brahmi_symbol": "𑀗", "devanagari": "ङ", "sound": "nga", "character": "ङ"}'::jsonb, 15),
        (lesson2_id, 'writing_practice', 'ङ लिखना सीखें', 'अब आप ब्राह्मी में ङ (𑀗) लिखने का अभ्यास करेंगे।', '{"character": "𑀗"}'::jsonb, 16),
        (lesson2_id, 'key_points', 'क वर्ग - मुख्य बिंदु', '• सभी पाँच व्यञ्जन कण्ठ से उच्चारित होते हैं
• क और ग अल्पप्राण हैं (कम साँस)
• ख और घ महाप्राण हैं (अधिक साँस)
• ङ अनुनासिक है (नाक से उच्चारित)
• ब्राह्मी चिह्न: 𑀓 𑀔 𑀕 𑀖 𑀗', NULL, 17),
        (lesson2_id, 'mcq', 'क वर्ग जाँच', 'कौन सा व्यञ्जन महाप्राण घोष है?', '{"options": ["क", "ख", "ग", "घ"], "correct_answer": "घ"}'::jsonb, 18),
        (lesson2_id, 'summary', 'पाठ सारांश', 'बधाई हो! आपने क वर्ग के सभी 5 व्यञ्जन सीख लिए हैं। ये कण्ठ्य व्यञ्जन संस्कृत और प्राकृत के मूल आधार हैं।', NULL, 19);

    -- ==========================================
    -- LESSON 3: च वर्ग (Cha-Varga) - Palatal Consonants
    -- ==========================================
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson3_id, 'title_slide', 'च वर्ग', 'तालव्य व्यञ्जन - तालु से उच्चारित', NULL, 1),
        (lesson3_id, 'consonant_intro', 'तालव्य व्यञ्जन', 'ये व्यञ्जन तालु (मुँह की छत) से उच्चारित होते हैं। जीभ तालु को स्पर्श करती है।', '{"consonants": ["च", "छ", "ज", "झ", "ञ"]}'::jsonb, 2),
        
        -- च (Cha)
        (lesson3_id, 'pronunciation', 'च (Cha)', 'अल्पप्राण, अघोष

उच्चारण: "च" जैसे "चाय" में
ब्राह्मी चिह्न: 𑀘
देवनागरी: च', '{"brahmi_symbol": "𑀘", "devanagari": "च", "sound": "cha", "character": "च"}'::jsonb, 3),
        (lesson3_id, 'writing_practice', 'च लिखना सीखें', 'अब आप ब्राह्मी में च (𑀘) लिखने का अभ्यास करेंगे।', '{"character": "𑀘"}'::jsonb, 4),
        (lesson3_id, 'examples', 'च के उदाहरण', 'च से बनने वाले शब्द:
• चाय (Chaay) - Tea
• चंद्र (Chandra) - Moon  
• चित्र (Chitra) - Picture

ब्राह्मी में: 𑀘', NULL, 5),
        
        -- छ (Chha)
        (lesson3_id, 'pronunciation', 'छ (Chha)', 'महाप्राण, अघोष

उच्चारण: "छ" जैसे "छत" में (साँस के साथ)
ब्राह्मी चिह्न: 𑀙
देवनागरी: छ', '{"brahmi_symbol": "𑀙", "devanagari": "छ", "sound": "chha", "character": "छ"}'::jsonb, 6),
        (lesson3_id, 'writing_practice', 'छ लिखना सीखें', 'अब आप ब्राह्मी में छ (𑀙) लिखने का अभ्यास करेंगे।', '{"character": "𑀙"}'::jsonb, 7),
        (lesson3_id, 'examples', 'छ के उदाहरण', 'छ से बनने वाले शब्द:
• छत (Chhat) - Roof
• छवि (Chhavi) - Image
• छाया (Chhaaya) - Shadow

ब्राह्मी में: 𑀙', NULL, 8),
        
        -- ज (Ja)
        (lesson3_id, 'pronunciation', 'ज (Ja)', 'अल्पप्राण, घोष

उच्चारण: "ज" जैसे "जल" में
ब्राह्मी चिह्न: 𑀚
देवनागरी: ज', '{"brahmi_symbol": "𑀚", "devanagari": "ज", "sound": "ja", "character": "ज"}'::jsonb, 9),
        (lesson3_id, 'writing_practice', 'ज लिखना सीखें', 'अब आप ब्राह्मी में ज (𑀚) लिखने का अभ्यास करेंगे।', '{"character": "𑀚"}'::jsonb, 10),
        (lesson3_id, 'examples', 'ज के उदाहरण', 'ज से बनने वाले शब्द:
• जल (Jal) - Water
• जन (Jan) - People
• जय (Jay) - Victory

ब्राह्मी में: 𑀚', NULL, 11),
        
        -- झ (Jha)
        (lesson3_id, 'pronunciation', 'झ (Jha)', 'महाप्राण, घोष

उच्चारण: "झ" जैसे "झर" में (साँस के साथ)
ब्राह्मी चिह्न: 𑀛
देवनागरी: झ', '{"brahmi_symbol": "𑀛", "devanagari": "झ", "sound": "jha", "character": "झ"}'::jsonb, 12),
        (lesson3_id, 'writing_practice', 'झ लिखना सीखें', 'अब आप ब्राह्मी में झ (𑀛) लिखने का अभ्यास करेंगे।', '{"character": "𑀛"}'::jsonb, 13),
        (lesson3_id, 'examples', 'झ के उदाहरण', 'झ से बनने वाले शब्द:
• झरना (Jharna) - Waterfall
• झंडा (Jhanda) - Flag
• झील (Jheel) - Lake

ब्राह्मी में: 𑀛', NULL, 14),
        
        -- ञ (Nya)
        (lesson3_id, 'pronunciation', 'ञ (Nya)', 'अनुनासिक

उच्चारण: तालव्य अनुनासिक ध्वनि
ब्राह्मी चिह्न: 𑀜
देवनागरी: ञ', '{"brahmi_symbol": "𑀜", "devanagari": "ञ", "sound": "nya", "character": "ञ"}'::jsonb, 15),
        (lesson3_id, 'writing_practice', 'ञ लिखना सीखें', 'अब आप ब्राह्मी में ञ (𑀜) लिखने का अभ्यास करेंगे।', '{"character": "𑀜"}'::jsonb, 16),
        (lesson3_id, 'key_points', 'च वर्ग - मुख्य बिंदु', '• सभी पाँच व्यञ्जन तालु से उच्चारित होते हैं
• च और ज अल्पप्राण हैं
• छ और झ महाप्राण हैं  
• ञ अनुनासिक है
• ब्राह्मी चिह्न: 𑀘 𑀙 𑀚 𑀛 𑀜', NULL, 17),
        (lesson3_id, 'mcq', 'च वर्ग जाँच', 'कौन सा व्यञ्जन अल्पप्राण घोष है?', '{"options": ["च", "छ", "ज", "झ"], "correct_answer": "ज"}'::jsonb, 18),
        (lesson3_id, 'summary', 'पाठ सारांश', 'उत्कृष्ट! आपने च वर्ग के सभी 5 तालव्य व्यञ्जन सीख लिए हैं।', NULL, 19);

    -- ==========================================
    -- LESSON 4: ट वर्ग (Ta-Varga Retroflex) - Cerebral Consonants
    -- ==========================================
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson4_id, 'title_slide', 'ट वर्ग (मूर्धन्य)', 'मूर्धन्य व्यञ्जन - मूर्धा से उच्चारित', NULL, 1),
        (lesson4_id, 'consonant_intro', 'मूर्धन्य व्यञ्जन', 'ये व्यञ्जन मूर्धा (मुँह की छत के पीछे) से उच्चारित होते हैं। जीभ को मोड़कर मूर्धा को स्पर्श करें।', '{"consonants": ["ट", "ठ", "ड", "ढ", "ण"]}'::jsonb, 2),
        
        -- ट (Ta - Retroflex)
        (lesson4_id, 'pronunciation', 'ट (Ta)', 'अल्पप्राण, अघोष

उच्चारण: जीभ मोड़कर "ट" जैसे "टोकरी" में
ब्राह्मी चिह्न: 𑀝
देवनागरी: ट', '{"brahmi_symbol": "𑀝", "devanagari": "ट", "sound": "Ta", "character": "ट"}'::jsonb, 3),
        (lesson4_id, 'writing_practice', 'ट लिखना सीखें', 'अब आप ब्राह्मी में ट (𑀝) लिखने का अभ्यास करेंगे।', '{"character": "𑀝"}'::jsonb, 4),
        (lesson4_id, 'examples', 'ट के उदाहरण', 'ट से बनने वाले शब्द:
• टोकरी (Tokari) - Basket
• टीका (Teeka) - Mark
• टंकण (Tankana) - Typing

ब्राह्मी में: 𑀝', NULL, 5),
        
        -- ठ (Tha - Retroflex)
        (lesson4_id, 'pronunciation', 'ठ (Tha)', 'महाप्राण, अघोष

उच्चारण: "ठ" जैसे "ठंडा" में (साँस के साथ)
ब्राह्मी चिह्न: 𑀞
देवनागरी: ठ', '{"brahmi_symbol": "𑀞", "devanagari": "ठ", "sound": "Tha", "character": "ठ"}'::jsonb, 6),
        (lesson4_id, 'writing_practice', 'ठ लिखना सीखें', 'अब आप ब्राह्मी में ठ (𑀞) लिखने का अभ्यास करेंगे।', '{"character": "𑀞"}'::jsonb, 7),
        (lesson4_id, 'examples', 'ठ के उदाहरण', 'ठ से बनने वाले शब्द:
• ठंडा (Thanda) - Cold
• ठीक (Theek) - Okay
• ठहराव (Thaharaav) - Pause

ब्राह्मी में: 𑀞', NULL, 8),
        
        -- ड (Da - Retroflex)
        (lesson4_id, 'pronunciation', 'ड (Da)', 'अल्पप्राण, घोष

उच्चारण: "ड" जैसे "डमरू" में
ब्राह्मी चिह्न: 𑀟
देवनागरी: ड', '{"brahmi_symbol": "𑀟", "devanagari": "ड", "sound": "Da", "character": "ड"}'::jsonb, 9),
        (lesson4_id, 'writing_practice', 'ड लिखना सीखें', 'अब आप ब्राह्मी में ड (𑀟) लिखने का अभ्यास करेंगे।', '{"character": "𑀟"}'::jsonb, 10),
        (lesson4_id, 'examples', 'ड के उदाहरण', 'ड से बनने वाले शब्द:
• डमरू (Damaru) - Small drum
• डाल (Daal) - Branch
• डोर (Dor) - String

ब्राह्मी में: 𑀟', NULL, 11),
        
        -- ढ (Dha - Retroflex)
        (lesson4_id, 'pronunciation', 'ढ (Dha)', 'महाप्राण, घोष

उच्चारण: "ढ" जैसे "ढोल" में (साँस के साथ)
ब्राह्मी चिह्न: 𑀠
देवनागरी: ढ', '{"brahmi_symbol": "𑀠", "devanagari": "ढ", "sound": "Dha", "character": "ढ"}'::jsonb, 12),
        (lesson4_id, 'writing_practice', 'ढ लिखना सीखें', 'अब आप ब्राह्मी में ढ (𑀠) लिखने का अभ्यास करेंगे।', '{"character": "𑀠"}'::jsonb, 13),
        (lesson4_id, 'examples', 'ढ के उदाहरण', 'ढ से बनने वाले शब्द:
• ढोल (Dhol) - Drum
• ढक्कन (Dhakkan) - Lid
• ढाल (Dhaal) - Shield

ब्राह्मी में: 𑀠', NULL, 14),
        
        -- ण (Na - Retroflex)
        (lesson4_id, 'pronunciation', 'ण (Na)', 'अनुनासिक

उच्चारण: मूर्धन्य अनुनासिक "ण"
ब्राह्मी चिह्न: 𑀡
देवनागरी: ण', '{"brahmi_symbol": "𑀡", "devanagari": "ण", "sound": "Na", "character": "ण"}'::jsonb, 15),
        (lesson4_id, 'writing_practice', 'ण लिखना सीखें', 'अब आप ब्राह्मी में ण (𑀡) लिखने का अभ्यास करेंगे।', '{"character": "𑀡"}'::jsonb, 16),
        (lesson4_id, 'key_points', 'ट वर्ग - मुख्य बिंदु', '• सभी पाँच व्यञ्जन मूर्धा से उच्चारित होते हैं
• जीभ मोड़कर उच्चारण करें
• ट और ड अल्पप्राण हैं
• ठ और ढ महाप्राण हैं
• ण अनुनासिक है
• ब्राह्मी चिह्न: 𑀝 𑀞 𑀟 𑀠 𑀡', NULL, 17),
        (lesson4_id, 'mcq', 'ट वर्ग जाँच', 'मूर्धन्य व्यञ्जन किससे उच्चारित होते हैं?', '{"options": ["कण्ठ से", "तालु से", "मूर्धा से", "दाँतों से"], "correct_answer": "मूर्धा से"}'::jsonb, 18),
        (lesson4_id, 'summary', 'पाठ सारांश', 'शानदार! आपने ट वर्ग के सभी 5 मूर्धन्य व्यञ्जन सीख लिए हैं।', NULL, 19);

    -- ==========================================
    -- LESSON 5: त वर्ग (Ta-Varga Dental) - Dental Consonants
    -- ==========================================
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson5_id, 'title_slide', 'त वर्ग (दन्त्य)', 'दन्त्य व्यञ्जन - दाँतों से उच्चारित', NULL, 1),
        (lesson5_id, 'consonant_intro', 'दन्त्य व्यञ्जन', 'ये व्यञ्जन दाँतों से उच्चारित होते हैं। जीभ दाँतों को स्पर्श करती है।', '{"consonants": ["त", "थ", "द", "ध", "न"]}'::jsonb, 2),
        
        -- त (Ta - Dental)
        (lesson5_id, 'pronunciation', 'त (Ta)', 'अल्पप्राण, अघोष

उच्चारण: "त" जैसे "ताज" में, जीभ दाँतों को छूती है
ब्राह्मी चिह्न: 𑀢
देवनागरी: त', '{"brahmi_symbol": "𑀢", "devanagari": "त", "sound": "ta", "character": "त"}'::jsonb, 3),
        (lesson5_id, 'writing_practice', 'त लिखना सीखें', 'अब आप ब्राह्मी में त (𑀢) लिखने का अभ्यास करेंगे।', '{"character": "𑀢"}'::jsonb, 4),
        (lesson5_id, 'examples', 'त के उदाहरण', 'त से बनने वाले शब्द:
• ताज (Taaj) - Crown
• तारा (Taara) - Star
• तीर (Teer) - Arrow

ब्राह्मी में: 𑀢', NULL, 5),
        
        -- थ (Tha - Dental)
        (lesson5_id, 'pronunciation', 'थ (Tha)', 'महाप्राण, अघोष

उच्चारण: "थ" जैसे "थाली" में (साँस के साथ)
ब्राह्मी चिह्न: 𑀣
देवनागरी: थ', '{"brahmi_symbol": "𑀣", "devanagari": "थ", "sound": "tha", "character": "थ"}'::jsonb, 6),
        (lesson5_id, 'writing_practice', 'थ लिखना सीखें', 'अब आप ब्राह्मी में थ (𑀣) लिखने का अभ्यास करेंगे।', '{"character": "𑀣"}'::jsonb, 7),
        (lesson5_id, 'examples', 'थ के उदाहरण', 'थ से बनने वाले शब्द:
• थाली (Thaali) - Plate
• थल (Thal) - Land
• थकान (Thakaan) - Tiredness

ब्राह्मी में: 𑀣', NULL, 8),
        
        -- द (Da - Dental)
        (lesson5_id, 'pronunciation', 'द (Da)', 'अल्पप्राण, घोष

उच्चारण: "द" जैसे "दीप" में
ब्राह्मी चिह्न: 𑀤
देवनागरी: द', '{"brahmi_symbol": "𑀤", "devanagari": "द", "sound": "da", "character": "द"}'::jsonb, 9),
        (lesson5_id, 'writing_practice', 'द लिखना सीखें', 'अब आप ब्राह्मी में द (𑀤) लिखने का अभ्यास करेंगे।', '{"character": "𑀤"}'::jsonb, 10),
        (lesson5_id, 'examples', 'द के उदाहरण', 'द से बनने वाले शब्द:
• दीप (Deep) - Lamp
• दान (Daan) - Donation
• दया (Dayaa) - Mercy

ब्राह्मी में: 𑀤', NULL, 11),
        
        -- ध (Dha - Dental)
        (lesson5_id, 'pronunciation', 'ध (Dha)', 'महाप्राण, घोष

उच्चारण: "ध" जैसे "धन" में (साँस के साथ)
ब्राह्मी चिह्न: 𑀥
देवनागरी: ध', '{"brahmi_symbol": "𑀥", "devanagari": "ध", "sound": "dha", "character": "ध"}'::jsonb, 12),
        (lesson5_id, 'writing_practice', 'ध लिखना सीखें', 'अब आप ब्राह्मी में ध (𑀥) लिखने का अभ्यास करेंगे।', '{"character": "𑀥"}'::jsonb, 13),
        (lesson5_id, 'examples', 'ध के उदाहरण', 'ध से बनने वाले शब्द:
• धन (Dhan) - Wealth
• धर्म (Dharma) - Duty
• धरती (Dharti) - Earth

ब्राह्मी में: 𑀥', NULL, 14),
        
        -- न (Na - Dental)
        (lesson5_id, 'pronunciation', 'न (Na)', 'अनुनासिक

उच्चारण: "न" जैसे "नमन" में
ब्राह्मी चिह्न: 𑀦
देवनागरी: न', '{"brahmi_symbol": "𑀦", "devanagari": "न", "sound": "na", "character": "न"}'::jsonb, 15),
        (lesson5_id, 'writing_practice', 'न लिखना सीखें', 'अब आप ब्राह्मी में न (𑀦) लिखने का अभ्यास करेंगे।', '{"character": "𑀦"}'::jsonb, 16),
        (lesson5_id, 'comparison', 'ट vs त - अंतर', 'ट (मूर्धन्य) vs त (दन्त्य):

ट: जीभ मोड़कर मूर्धा से
त: जीभ सीधी दाँतों से

उदाहरण:
• ट: टोकरी (𑀝)
• त: ताज (𑀢)', NULL, 17),
        (lesson5_id, 'key_points', 'त वर्ग - मुख्य बिंदु', '• सभी पाँच व्यञ्जन दाँतों से उच्चारित होते हैं
• त और द अल्पप्राण हैं
• थ और ध महाप्राण हैं
• न अनुनासिक है
• ब्राह्मी चिह्न: 𑀢 𑀣 𑀤 𑀥 𑀦', NULL, 18),
        (lesson5_id, 'mcq', 'त वर्ग जाँच', 'कौन सा व्यञ्जन दन्त्य अनुनासिक है?', '{"options": ["ण", "न", "म", "ङ"], "correct_answer": "न"}'::jsonb, 19),
        (lesson5_id, 'summary', 'पाठ सारांश', 'बहुत अच्छे! आपने त वर्ग के सभी 5 दन्त्य व्यञ्जन सीख लिए हैं।', NULL, 20);

    -- ==========================================
    -- LESSON 6: प वर्ग (Pa-Varga) - Labial Consonants
    -- ==========================================
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson6_id, 'title_slide', 'प वर्ग', 'ओष्ठ्य व्यञ्जन - होठों से उच्चारित', NULL, 1),
        (lesson6_id, 'consonant_intro', 'ओष्ठ्य व्यञ्जन', 'ये व्यञ्जन होठों (ओष्ठ) से उच्चारित होते हैं। दोनों होठों को मिलाकर उच्चारण करें।', '{"consonants": ["प", "फ", "ब", "भ", "म"]}'::jsonb, 2),
        
        -- प (Pa)
        (lesson6_id, 'pronunciation', 'प (Pa)', 'अल्पप्राण, अघोष

उच्चारण: "प" जैसे "पत्र" में
ब्राह्मी चिह्न: 𑀧
देवनागरी: प', '{"brahmi_symbol": "𑀧", "devanagari": "प", "sound": "pa", "character": "प"}'::jsonb, 3),
        (lesson6_id, 'writing_practice', 'प लिखना सीखें', 'अब आप ब्राह्मी में प (𑀧) लिखने का अभ्यास करेंगे।', '{"character": "𑀧"}'::jsonb, 4),
        (lesson6_id, 'examples', 'प के उदाहरण', 'प से बनने वाले शब्द:
• पत्र (Patra) - Letter
• पानी (Paani) - Water
• पुस्तक (Pustak) - Book

ब्राह्मी में: 𑀧', NULL, 5),
        
        -- फ (Pha)
        (lesson6_id, 'pronunciation', 'फ (Pha)', 'महाप्राण, अघोष

उच्चारण: "फ" जैसे "फूल" में (साँस के साथ)
ब्राह्मी चिह्न: 𑀨
देवनागरी: फ', '{"brahmi_symbol": "𑀨", "devanagari": "फ", "sound": "pha", "character": "फ"}'::jsonb, 6),
        (lesson6_id, 'writing_practice', 'फ लिखना सीखें', 'अब आप ब्राह्मी में फ (𑀨) लिखने का अभ्यास करेंगे।', '{"character": "𑀨"}'::jsonb, 7),
        (lesson6_id, 'examples', 'फ के उदाहरण', 'फ से बनने वाले शब्द:
• फूल (Phool) - Flower
• फल (Phal) - Fruit
• फसल (Phasal) - Crop

ब्राह्मी में: 𑀨', NULL, 8),
        
        -- ब (Ba)
        (lesson6_id, 'pronunciation', 'ब (Ba)', 'अल्पप्राण, घोष

उच्चारण: "ब" जैसे "बाल" में
ब्राह्मी चिह्न: 𑀩
देवनागरी: ब', '{"brahmi_symbol": "𑀩", "devanagari": "ब", "sound": "ba", "character": "ब"}'::jsonb, 9),
        (lesson6_id, 'writing_practice', 'ब लिखना सीखें', 'अब आप ब्राह्मी में ब (𑀩) लिखने का अभ्यास करेंगे।', '{"character": "𑀩"}'::jsonb, 10),
        (lesson6_id, 'examples', 'ब के उदाहरण', 'ब से बनने वाले शब्द:
• बाल (Baal) - Hair
• बल (Bal) - Strength
• बगीचा (Bageecha) - Garden

ब्राह्मी में: 𑀩', NULL, 11),
        
        -- भ (Bha)
        (lesson6_id, 'pronunciation', 'भ (Bha)', 'महाप्राण, घोष

उच्चारण: "भ" जैसे "भारत" में (साँस के साथ)
ब्राह्मी चिह्न: 𑀪
देवनागरी: भ', '{"brahmi_symbol": "𑀪", "devanagari": "भ", "sound": "bha", "character": "भ"}'::jsonb, 12),
        (lesson6_id, 'writing_practice', 'भ लिखना सीखें', 'अब आप ब्राह्मी में भ (𑀪) लिखने का अभ्यास करेंगे।', '{"character": "𑀪"}'::jsonb, 13),
        (lesson6_id, 'examples', 'भ के उदाहरण', 'भ से बनने वाले शब्द:
• भारत (Bharat) - India
• भाषा (Bhaasha) - Language
• भूमि (Bhoomi) - Earth

ब्राह्मी में: 𑀪', NULL, 14),
        
        -- म (Ma)
        (lesson6_id, 'pronunciation', 'म (Ma)', 'अनुनासिक

उच्चारण: "म" जैसे "मन" में
ब्राह्मी चिह्न: 𑀫
देवनागरी: म', '{"brahmi_symbol": "𑀫", "devanagari": "म", "sound": "ma", "character": "म"}'::jsonb, 15),
        (lesson6_id, 'writing_practice', 'म लिखना सीखें', 'अब आप ब्राह्मी में म (𑀫) लिखने का अभ्यास करेंगे।', '{"character": "𑀫"}'::jsonb, 16),
        (lesson6_id, 'key_points', 'प वर्ग - मुख्य बिंदु', '• सभी पाँच व्यञ्जन होठों से उच्चारित होते हैं
• प और ब अल्पप्राण हैं
• फ और भ महाप्राण हैं
• म अनुनासिक है
• ब्राह्मी चिह्न: 𑀧 𑀨 𑀩 𑀪 𑀫', NULL, 17),
        (lesson6_id, 'mcq', 'प वर्ग जाँच', 'कौन सा व्यञ्जन ओष्ठ्य अनुनासिक है?', '{"options": ["न", "ङ", "म", "ण"], "correct_answer": "म"}'::jsonb, 18),
        (lesson6_id, 'summary', 'पाठ सारांश', 'शाबाश! आपने प वर्ग के सभी 5 ओष्ठ्य व्यञ्जन सीख लिए हैं।', NULL, 19);

    -- ==========================================
    -- LESSON 7: अन्तःस्थ (Antastha) - Semi-vowels
    -- ==========================================
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson7_id, 'title_slide', 'अन्तःस्थ', 'अर्ध-स्वर - स्वर और व्यञ्जन के बीच', NULL, 1),
        (lesson7_id, 'text', 'अन्तःस्थ क्या हैं?', 'अन्तःस्थ (Antastha) का अर्थ है "मध्य में स्थित"। ये व्यञ्जन स्वर और व्यञ्जन के बीच की ध्वनियाँ हैं, इसलिए इन्हें अर्ध-स्वर कहते हैं।', NULL, 2),
        
        -- य (Ya)
        (lesson7_id, 'pronunciation', 'य (Ya)', 'तालव्य अर्ध-स्वर

उच्चारण: "य" जैसे "योग" में
ब्राह्मी चिह्न: 𑀬
देवनागरी: य', '{"brahmi_symbol": "𑀬", "devanagari": "य", "sound": "ya", "character": "य"}'::jsonb, 3),
        (lesson7_id, 'writing_practice', 'य लिखना सीखें', 'अब आप ब्राह्मी में य (𑀬) लिखने का अभ्यास करेंगे।', '{"character": "𑀬"}'::jsonb, 4),
        (lesson7_id, 'examples', 'य के उदाहरण', 'य से बनने वाले शब्द:
• योग (Yoga) - Union
• यज्ञ (Yajna) - Sacrifice
• युग (Yuga) - Era

ब्राह्मी में: 𑀬', NULL, 5),
        
        -- र (Ra)
        (lesson7_id, 'pronunciation', 'र (Ra)', 'मूर्धन्य अर्ध-स्वर

उच्चारण: "र" जैसे "राम" में
ब्राह्मी चिह्न: 𑀭
देवनागरी: र', '{"brahmi_symbol": "𑀭", "devanagari": "र", "sound": "ra", "character": "र"}'::jsonb, 6),
        (lesson7_id, 'writing_practice', 'र लिखना सीखें', 'अब आप ब्राह्मी में र (𑀭) लिखने का अभ्यास करेंगे।', '{"character": "𑀭"}'::jsonb, 7),
        (lesson7_id, 'examples', 'र के उदाहरण', 'र से बनने वाले शब्द:
• राम (Rama) - Lord Rama
• रात (Raat) - Night
• रस (Rasa) - Juice

ब्राह्मी में: 𑀭', NULL, 8),
        
        -- ल (La)
        (lesson7_id, 'pronunciation', 'ल (La)', 'दन्त्य अर्ध-स्वर

उच्चारण: "ल" जैसे "लता" में
ब्राह्मी चिह्न: 𑀮
देवनागरी: ल', '{"brahmi_symbol": "𑀮", "devanagari": "ल", "sound": "la", "character": "ल"}'::jsonb, 9),
        (lesson7_id, 'writing_practice', 'ल लिखना सीखें', 'अब आप ब्राह्मी में ल (𑀮) लिखने का अभ्यास करेंगे।', '{"character": "𑀮"}'::jsonb, 10),
        (lesson7_id, 'examples', 'ल के उदाहरण', 'ल से बनने वाले शब्द:
• लता (Lata) - Vine
• लोक (Loka) - World
• लय (Laya) - Rhythm

ब्राह्मी में: 𑀮', NULL, 11),
        
        -- व (Va)
        (lesson7_id, 'pronunciation', 'व (Va)', 'ओष्ठ्य अर्ध-स्वर

उच्चारण: "व" जैसे "वन" में
ब्राह्मी चिह्न: 𑀯
देवनागरी: व', '{"brahmi_symbol": "𑀯", "devanagari": "व", "sound": "va", "character": "व"}'::jsonb, 12),
        (lesson7_id, 'writing_practice', 'व लिखना सीखें', 'अब आप ब्राह्मी में व (𑀯) लिखने का अभ्यास करेंगे।', '{"character": "𑀯"}'::jsonb, 13),
        (lesson7_id, 'examples', 'व के उदाहरण', 'व से बनने वाले शब्द:
• वन (Vana) - Forest
• वर (Vara) - Boon
• वायु (Vaayu) - Wind

ब्राह्मी में: 𑀯', NULL, 14),
        (lesson7_id, 'key_points', 'अन्तःस्थ - मुख्य बिंदु', '• चार अर्ध-स्वर: य, र, ल, व
• स्वर और व्यञ्जन के बीच की ध्वनियाँ
• प्रत्येक अलग स्थान से उच्चारित:
  - य: तालव्य
  - र: मूर्धन्य
  - ल: दन्त्य
  - व: ओष्ठ्य
• ब्राह्मी चिह्न: 𑀬 𑀭 𑀮 𑀯', NULL, 15),
        (lesson7_id, 'mcq', 'अन्तःस्थ जाँच', 'कितने अन्तःस्थ व्यञ्जन हैं?', '{"options": ["3", "4", "5", "6"], "correct_answer": "4"}'::jsonb, 16),
        (lesson7_id, 'summary', 'पाठ सारांश', 'उत्तम! आपने सभी 4 अन्तःस्थ (अर्ध-स्वर) सीख लिए हैं।', NULL, 17);

    -- ==========================================
    -- LESSON 8: ऊष्म (Ushma) - Sibilants
    -- ==========================================
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson8_id, 'title_slide', 'ऊष्म', 'ऊष्म व्यञ्जन - संघर्षी ध्वनियाँ', NULL, 1),
        (lesson8_id, 'text', 'ऊष्म क्या हैं?', 'ऊष्म (Ushma) का अर्थ है "गर्म" या "ताप"। ये व्यञ्जन सिसकारी/फुफकारी ध्वनियाँ उत्पन्न करते हैं जब हवा मुख के संकरे भागों से निकलती है।', NULL, 2),
        
        -- श (Sha - Palatal)
        (lesson8_id, 'pronunciation', 'श (Sha)', 'तालव्य ऊष्म

उच्चारण: "श" जैसे "शांति" में (तालु से सिसकारी)
ब्राह्मी चिह्न: 𑀰
देवनागरी: श', '{"brahmi_symbol": "𑀰", "devanagari": "श", "sound": "sha", "character": "श"}'::jsonb, 3),
        (lesson8_id, 'writing_practice', 'श लिखना सीखें', 'अब आप ब्राह्मी में श (𑀰) लिखने का अभ्यास करेंगे।', '{"character": "𑀰"}'::jsonb, 4),
        (lesson8_id, 'examples', 'श के उदाहरण', 'श से बनने वाले शब्द:
• शांति (Shaanti) - Peace
• शक्ति (Shakti) - Power
• शुभ (Shubha) - Auspicious

ब्राह्मी में: 𑀰', NULL, 5),
        
        -- ष (Sha - Retroflex)
        (lesson8_id, 'pronunciation', 'ष (Sha)', 'मूर्धन्य ऊष्म

उच्चारण: "ष" जीभ मोड़कर (मूर्धा से सिसकारी)
ब्राह्मी चिह्न: 𑀱
देवनागरी: ष', '{"brahmi_symbol": "𑀱", "devanagari": "ष", "sound": "Sha", "character": "ष"}'::jsonb, 6),
        (lesson8_id, 'writing_practice', 'ष लिखना सीखें', 'अब आप ब्राह्मी में ष (𑀱) लिखने का अभ्यास करेंगे।', '{"character": "𑀱"}'::jsonb, 7),
        (lesson8_id, 'examples', 'ष के उदाहरण', 'ष से बनने वाले शब्द:
• षट् (ShaT) - Six
• पुष्प (Pushpa) - Flower
• विष (Visha) - Poison

ब्राह्मी में: 𑀱', NULL, 8),
        
        -- स (Sa)
        (lesson8_id, 'pronunciation', 'स (Sa)', 'दन्त्य ऊष्म

उच्चारण: "स" जैसे "सत्य" में (दाँतों से सिसकारी)
ब्राह्मी चिह्न: 𑀲
देवनागरी: स', '{"brahmi_symbol": "𑀲", "devanagari": "स", "sound": "sa", "character": "स"}'::jsonb, 9),
        (lesson8_id, 'writing_practice', 'स लिखना सीखें', 'अब आप ब्राह्मी में स (𑀲) लिखने का अभ्यास करेंगे।', '{"character": "𑀲"}'::jsonb, 10),
        (lesson8_id, 'examples', 'स के उदाहरण', 'स से बनने वाले शब्द:
• सत्य (Satya) - Truth
• सूर्य (Soorya) - Sun
• संगीत (Sangeet) - Music

ब्राह्मी में: 𑀲', NULL, 11),
        
        -- ह (Ha)
        (lesson8_id, 'pronunciation', 'ह (Ha)', 'कण्ठ्य ऊष्म

उच्चारण: "ह" जैसे "हरि" में (कण्ठ से श्वास)
ब्राह्मी चिह्न: 𑀳
देवनागरी: ह', '{"brahmi_symbol": "𑀳", "devanagari": "ह", "sound": "ha", "character": "ह"}'::jsonb, 12),
        (lesson8_id, 'writing_practice', 'ह लिखना सीखें', 'अब आप ब्राह्मी में ह (𑀳) लिखने का अभ्यास करेंगे।', '{"character": "𑀳"}'::jsonb, 13),
        (lesson8_id, 'examples', 'ह के उदाहरण', 'ह से बनने वाले शब्द:
• हरि (Hari) - Lord Vishnu
• हिम (Hima) - Snow
• हृदय (Hridaya) - Heart

ब्राह्मी में: 𑀳', NULL, 14),
        (lesson8_id, 'comparison', 'श, ष, स का अंतर', 'तीन "श" ध्वनियों का अंतर:

श (𑀰): तालव्य - "शांति"
ष (𑀱): मूर्धन्य - "पुष्प" 
स (𑀲): दन्त्य - "सत्य"

प्रत्येक अलग स्थान से उच्चारित होता है।', NULL, 15),
        (lesson8_id, 'key_points', 'ऊष्म - मुख्य बिंदु', '• चार ऊष्म व्यञ्जन: श, ष, स, ह
• सिसकारी/फुफकारी ध्वनियाँ
• विभिन्न स्थानों से उच्चारित:
  - श: तालव्य
  - ष: मूर्धन्य
  - स: दन्त्य
  - ह: कण्ठ्य
• ब्राह्मी चिह्न: 𑀰 𑀱 𑀲 𑀳', NULL, 16),
        (lesson8_id, 'mcq', 'ऊष्म जाँच', 'कौन सा व्यञ्जन मूर्धन्य ऊष्म है?', '{"options": ["श", "ष", "स", "ह"], "correct_answer": "ष"}'::jsonb, 17),
        (lesson8_id, 'summary', 'संपूर्ण सारांश', 'अद्भुत! आपने सभी 33 ब्राह्मी व्यञ्जन सीख लिए हैं:

• 5 वर्ग × 5 = 25 वर्गीय व्यञ्जन
• 4 अन्तःस्थ (अर्ध-स्वर)
• 4 ऊष्म (सिसकारी ध्वनियाँ)

आप अब ब्राह्मी लिपि के विशेषज्ञ बन गए हैं!', NULL, 18);

END $$;
