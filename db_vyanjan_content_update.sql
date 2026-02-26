-- =====================================================
-- VYANJAN MODULE - COMPREHENSIVE CONTENT UPDATE
-- Complete content for all 8 vyanjan lessons with traces
-- Based on Brahmi script consonant mappings
-- =====================================================

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
    -- Get lesson IDs
    SELECT id INTO lesson1_id FROM public.vyanjan_lessons WHERE lesson_id = 'vyanjan-lesson-1';
    SELECT id INTO lesson2_id FROM public.vyanjan_lessons WHERE lesson_id = 'vyanjan-lesson-2';
    SELECT id INTO lesson3_id FROM public.vyanjan_lessons WHERE lesson_id = 'vyanjan-lesson-3';
    SELECT id INTO lesson4_id FROM public.vyanjan_lessons WHERE lesson_id = 'vyanjan-lesson-4';
    SELECT id INTO lesson5_id FROM public.vyanjan_lessons WHERE lesson_id = 'vyanjan-lesson-5';
    SELECT id INTO lesson6_id FROM public.vyanjan_lessons WHERE lesson_id = 'vyanjan-lesson-6';
    SELECT id INTO lesson7_id FROM public.vyanjan_lessons WHERE lesson_id = 'vyanjan-lesson-7';
    SELECT id INTO lesson8_id FROM public.vyanjan_lessons WHERE lesson_id = 'vyanjan-lesson-8';

    -- Clear existing content
    DELETE FROM public.vyanjan_lesson_content WHERE lesson_id IN (lesson1_id, lesson2_id, lesson3_id, lesson4_id, lesson5_id, lesson6_id, lesson7_id, lesson8_id);

    -- ====================================================
    -- LESSON 1: Introduction to Vyanjan
    -- ====================================================
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson1_id, 'title_slide', 'व्यञ्जन (Vyanjan)', 'ब्राह्मी व्यञ्जनों की दुनिया में आपका स्वागत है! आइए शब्दों की संरचना जानें।', NULL, 1),
        
        (lesson1_id, 'text', 'व्यञ्जन क्या हैं?', 'व्यञ्जन लिपि का शरीर हैं। जहाँ स्वर जीवन और ध्वनि देते हैं, वहीं व्यञ्जन शब्दों को संरचना और रूप प्रदान करते हैं।

ब्राह्मी लिपि में, व्यञ्जनों को उच्चारण के विज्ञान के आधार पर सुंदरता से व्यवस्थित किया गया है।', NULL, 2),
        
        (lesson1_id, 'text', 'पाँच मुख्य वर्ग', 'ब्राह्मी व्यञ्जनों को वैज्ञानिक रूप से वर्गों में विभाजित किया गया है, मुख के किस भाग से उच्चारित होते हैं उसके आधार पर:

• **कण्ठ्य** - गले से
• **तालव्य** - तालु से
• **मूर्धन्य** - मूर्धा से (जीभ को पीछे मोड़कर)
• **दन्त्य** - दाँतों से
• **ओष्ठ्य** - होठों से', NULL, 3),
        
        (lesson1_id, 'text', 'प्रत्येक वर्ग में पैटर्न', 'प्रत्येक मुख्य वर्ग में 5 व्यञ्जन होते हैं जो एक व्यवस्थित क्रम का पालन करते हैं:

1. **अल्पप्राण अघोष** - बिना श्वास के, बिना कंपन के
2. **महाप्राण अघोष** - श्वास के साथ, बिना कंपन के
3. **अल्पप्राण घोष** - बिना श्वास के, कंपन के साथ
4. **महाप्राण घोष** - श्वास और कंपन दोनों के साथ
5. **अनुनासिक** - नाक से

यह वैज्ञानिक व्यवस्था सीखना आसान बनाती है!', NULL, 4),
        
        (lesson1_id, 'key_points', 'अतिरिक्त वर्ग', '• **अन्तःस्थ** - अर्धस्वर: य र ल व

• **ऊष्म** - श्वास से उत्पन्न: श ष स ह

इन विशेष वर्गों की अपनी अनूठी विशेषताएँ हैं!', NULL, 5),
        
        (lesson1_id, 'mcq', 'त्वरित जाँच', 'व्यञ्जन किस आधार पर व्यवस्थित किए गए हैं?', '{"options": ["उनके आकार के आधार पर", "उच्चारण स्थान के आधार पर", "उनकी आयु के आधार पर", "वर्णमाला क्रम में"], "correct_answer": "उच्चारण स्थान के आधार पर"}'::jsonb, 6),
        
        (lesson1_id, 'summary', 'आइए शुरू करें!', 'अब आप व्यञ्जनों के प्रत्येक वर्ग का अन्वेषण करने के लिए तैयार हैं। प्रत्येक पाठ आपको सिखाएगा:
• उच्चारण
• ब्राह्मी चिह्न
• लेखन अभ्यास
• शब्द उदाहरण

आइए कण्ठ्य (क वर्ग) से शुरू करें!', NULL, 7);

    -- ====================================================
    -- LESSON 2: Ka-Varga (क वर्ग)
    -- ====================================================
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson2_id, 'title_slide', 'क वर्ग', 'कण्ठ्य व्यञ्जन - गले से उच्चारित', '{"subtitle": "क ख ग घ ङ"}'::jsonb, 1),
        
        (lesson2_id, 'consonant_intro', 'कण्ठ्य व्यञ्जन', 'ये व्यञ्जन गले (कण्ठ) से उच्चारित होते हैं। अपने गले पर हाथ रखें और उच्चारण करते समय कंपन महसूस करें।

ये व्यञ्जनों का पहला और मूलभूत वर्ग बनाते हैं।', '{"consonants": [{"devanagari": "क", "brahmi": "𑀓"}, {"devanagari": "ख", "brahmi": "𑀔"}, {"devanagari": "ग", "brahmi": "𑀕"}, {"devanagari": "घ", "brahmi": "𑀖"}, {"devanagari": "ङ", "brahmi": "𑀗"}]}'::jsonb, 2),
        
        (lesson2_id, 'pronunciation', 'क (Ka)', '**अल्पप्राण अघोष**

**उच्चारण:** "कमल" के क जैसा
**ध्वनि:** ka (क)

**देवनागरी:** क
**ब्राह्मी:** 𑀓', '{"brahmi_symbol": "𑀓", "devanagari": "क", "sound": "ka", "type": "अल्पप्राण अघोष"}'::jsonb, 3),
        
        (lesson2_id, 'writing_practice', 'क (𑀓) लिखें', 'अब ब्राह्मी व्यञ्जन क (𑀓) लिखने का अभ्यास करें।', '{"character": "𑀓", "devanagari": "क", "sound": "ka"}'::jsonb, 4),
        
        (lesson2_id, 'pronunciation', 'ख (Kha)', '**महाप्राण अघोष**

**उच्चारण:** "खग" के ख जैसा (श्वास के साथ)
**ध्वनि:** kha (ख)

**देवनागरी:** ख
**ब्राह्मी:** 𑀔', '{"brahmi_symbol": "𑀔", "devanagari": "ख", "sound": "kha", "type": "महाप्राण अघोष"}'::jsonb, 5),
        
        (lesson2_id, 'writing_practice', 'ख (𑀔) लिखें', 'ब्राह्मी लिपि में ख (𑀔) लिखने का अभ्यास करें।', '{"character": "𑀔", "devanagari": "ख", "sound": "kha"}'::jsonb, 6),
        
        (lesson2_id, 'pronunciation', 'ग (Ga)', '**अल्पप्राण घोष**

**उच्चारण:** "गज" के ग जैसा
**ध्वनि:** ga (ग)

**देवनागरी:** ग
**ब्राह्मी:** 𑀕', '{"brahmi_symbol": "𑀕", "devanagari": "ग", "sound": "ga", "type": "अल्पप्राण घोष"}'::jsonb, 7),
        
        (lesson2_id, 'writing_practice', 'ग (𑀕) लिखें', 'ब्राह्मी लिपि में ग (𑀕) लिखने का अभ्यास करें।', '{"character": "𑀕", "devanagari": "ग", "sound": "ga"}'::jsonb, 8),
        
        (lesson2_id, 'pronunciation', 'घ (Gha)', '**महाप्राण घोष**

**उच्चारण:** "घट" के घ जैसा (श्वास के साथ)
**ध्वनि:** gha (घ)

**देवनागरी:** घ
**ब्राह्मी:** 𑀖', '{"brahmi_symbol": "𑀖", "devanagari": "घ", "sound": "gha", "type": "महाप्राण घोष"}'::jsonb, 9),
        
        (lesson2_id, 'writing_practice', 'घ (𑀖) लिखें', 'ब्राह्मी लिपि में घ (𑀖) लिखने का अभ्यास करें।', '{"character": "𑀖", "devanagari": "घ", "sound": "gha"}'::jsonb, 10),
        
        (lesson2_id, 'pronunciation', 'ङ (Nga)', '**अनुनासिक**

**उच्चारण:** "अङ्ग" के ङ जैसा (नाक से)
**ध्वनि:** nga (ङ)

**देवनागरी:** ङ
**ब्राह्मी:** 𑀗', '{"brahmi_symbol": "𑀗", "devanagari": "ङ", "sound": "nga", "type": "अनुनासिक"}'::jsonb, 11),
        
        (lesson2_id, 'writing_practice', 'ङ (𑀗) लिखें', 'ब्राह्मी लिपि में ङ (𑀗) लिखने का अभ्यास करें।', '{"character": "𑀗", "devanagari": "ङ", "sound": "nga"}'::jsonb, 12),
        
        (lesson2_id, 'examples', 'शब्द उदाहरण', 'आइए इन व्यञ्जनों को वास्तविक संस्कृत शब्दों में देखें:

• **क** - कमल (kamala) - कमल
• **ख** - खग (khaga) - पक्षी
• **ग** - गज (gaja) - हाथी
• **घ** - घट (ghaṭa) - घड़ा, पात्र
• **ङ** - अङ्ग (aṅga) - अंग, शरीर का भाग', NULL, 13),
        
        (lesson2_id, 'mcq', 'अभ्यास', 'कौन सा व्यञ्जन महाप्राण घोष है?', '{"options": ["क (ka)", "ख (kha)", "घ (gha)", "ङ (nga)"], "correct_answer": "घ (gha)"}'::jsonb, 14),
        
        (lesson2_id, 'summary', 'क वर्ग पूर्ण! 🎉', 'बहुत बढ़िया! आपने सभी 5 कण्ठ्य व्यञ्जन सीख लिए:
• क (ka) - 𑀓
• ख (kha) - 𑀔
• ग (ga) - 𑀕
• घ (gha) - 𑀖
• ङ (nga) - 𑀗

अगला: तालव्य व्यञ्जन', NULL, 15);

    -- ====================================================
    -- LESSON 3: Cha-Varga (च वर्ग)
    -- ====================================================
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson3_id, 'title_slide', 'च वर्ग (Cha-Varga)', 'Palatal Consonants - तालव्य (from the palate)', '{"subtitle": "च छ ज झ ञ"}'::jsonb, 1),
        
        (lesson3_id, 'consonant_intro', 'तालव्य व्यञ्जन', 'These consonants are pronounced from the hard palate (तालु) - the roof of your mouth. Touch your tongue to the roof of your mouth as you pronounce them.

A beautiful group with flowing sounds!', '{"consonants": [{"devanagari": "च", "brahmi": "𑀘"}, {"devanagari": "छ", "brahmi": "𑀙"}, {"devanagari": "ज", "brahmi": "𑀚"}, {"devanagari": "झ", "brahmi": "𑀛"}, {"devanagari": "ञ", "brahmi": "𑀜"}]}'::jsonb, 2),
        
        (lesson3_id, 'pronunciation', 'च (Cha)', '**Unaspirated, Unvoiced**

**Pronunciation:** Like ''ch'' in "chair" or "church"
**Sound:** cha (च)

**Devanagari:** च
**Brahmi:** 𑀘', '{"brahmi_symbol": "𑀘", "devanagari": "च", "sound": "cha", "type": "Unaspirated Unvoiced"}'::jsonb, 3),
        
        (lesson3_id, 'writing_practice', 'Write च (𑀘)', 'Practice writing च (𑀘) in Brahmi script.', '{"character": "𑀘", "devanagari": "च", "sound": "cha"}'::jsonb, 4),
        
        (lesson3_id, 'pronunciation', 'छ (Chha)', '**Aspirated, Unvoiced**

**Pronunciation:** Like ''chh'' in "catch him" (with strong breath)
**Sound:** chha (छ)

**Devanagari:** छ
**Brahmi:** 𑀙', '{"brahmi_symbol": "𑀙", "devanagari": "छ", "sound": "chha", "type": "Aspirated Unvoiced"}'::jsonb, 5),
        
        (lesson3_id, 'writing_practice', 'Write छ (𑀙)', 'Practice writing छ (𑀙) in Brahmi script.', '{"character": "𑀙", "devanagari": "छ", "sound": "chha"}'::jsonb, 6),
        
        (lesson3_id, 'pronunciation', 'ज (Ja)', '**Unaspirated, Voiced**

**Pronunciation:** Like ''j'' in "jump" or "jar"
**Sound:** ja (ज)

**Devanagari:** ज
**Brahmi:** 𑀚', '{"brahmi_symbol": "𑀚", "devanagari": "ज", "sound": "ja", "type": "Unaspirated Voiced"}'::jsonb, 7),
        
        (lesson3_id, 'writing_practice', 'Write ज (𑀚)', 'Practice writing ज (𑀚) in Brahmi script.', '{"character": "𑀚", "devanagari": "ज", "sound": "ja"}'::jsonb, 8),
        
        (lesson3_id, 'pronunciation', 'झ (Jha)', '**Aspirated, Voiced**

**Pronunciation:** Like ''jh'' in "hedgehog" (with breath)
**Sound:** jha (झ)

**Devanagari:** झ
**Brahmi:** 𑀛', '{"brahmi_symbol": "𑀛", "devanagari": "झ", "sound": "jha", "type": "Aspirated Voiced"}'::jsonb, 9),
        
        (lesson3_id, 'writing_practice', 'Write झ (𑀛)', 'Practice writing झ (𑀛) in Brahmi script.', '{"character": "𑀛", "devanagari": "झ", "sound": "jha"}'::jsonb, 10),
        
        (lesson3_id, 'pronunciation', 'ञ (Nya)', '**Nasal**

**Pronunciation:** Like ''ny'' in "canyon" or Spanish "ñ"
**Sound:** nya (ञ)

**Devanagari:** ञ
**Brahmi:** 𑀜', '{"brahmi_symbol": "𑀜", "devanagari": "ञ", "sound": "nya", "type": "Nasal"}'::jsonb, 11),
        
        (lesson3_id, 'writing_practice', 'Write ञ (𑀜)', 'Practice writing ञ (𑀜) in Brahmi script.', '{"character": "𑀜", "devanagari": "ञ", "sound": "nya"}'::jsonb, 12),
        
        (lesson3_id, 'examples', 'Word Examples', 'These consonants in Sanskrit words:

• **च** - चन्द्र (chandra) - moon
• **छ** - छत्र (chhatra) - umbrella, parasol
• **ज** - जल (jala) - water
• **झ** - झरना (jharanā) - waterfall, cascade
• **ञ** - ज्ञान (jñāna) - knowledge, wisdom', NULL, 13),
        
        (lesson3_id, 'mcq', 'Practice', 'च वर्ग consonants are pronounced from:', '{"options": ["Throat (कण्ठ)", "Palate (तालु)", "Teeth (दन्त)", "Lips (ओष्ठ)"], "correct_answer": "Palate (तालु)"}'::jsonb, 14),
        
        (lesson3_id, 'summary', 'Cha-Varga Complete! 🎉', 'Great progress! You''ve mastered palatal consonants:
• च (cha) - 𑀘
• छ (chha) - 𑀙
• ज (ja) - 𑀚
• झ (jha) - 𑀛
• ञ (nya) - 𑀜

Next: मूर्धन्य (Retroflex consonants)', NULL, 15);

    -- ====================================================
    -- LESSON 4: Ta-Varga Retroflex (ट वर्ग)
    -- ====================================================
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson4_id, 'title_slide', 'ट वर्ग (Ta-Varga Retroflex)', 'Retroflex Consonants - मूर्धन्य (from roof of mouth)', '{"subtitle": "ट ठ ड ढ ण"}'::jsonb, 1),
        
        (lesson4_id, 'consonant_intro', 'मूर्धन्य व्यञ्जन', 'These consonants are pronounced by curling the tongue back to touch the roof of the mouth (मूर्धा). This gives them a distinctive retroflex sound unique to Indian languages!', '{"consonants": [{"devanagari": "ट", "brahmi": "𑀝"}, {"devanagari": "ठ", "brahmi": "𑀞"}, {"devanagari": "ड", "brahmi": "𑀟"}, {"devanagari": "ढ", "brahmi": "𑀠"}, {"devanagari": "ण", "brahmi": "𑀡"}]}'::jsonb, 2),
        
        (lesson4_id, 'pronunciation', 'ट (Ṭa)', '**Unaspirated, Unvoiced**

**Pronunciation:** Retroflex ''t'' - curl tongue back
**Sound:** ṭa (ट)

**Devanagari:** ट
**Brahmi:** 𑀝', '{"brahmi_symbol": "𑀝", "devanagari": "ट", "sound": "ṭa", "type": "Unaspirated Unvoiced"}'::jsonb, 3),
        
        (lesson4_id, 'writing_practice', 'Write ट (𑀝)', 'Practice writing ट (𑀝) in Brahmi script.', '{"character": "𑀝", "devanagari": "ट", "sound": "ṭa"}'::jsonb, 4),
        
        (lesson4_id, 'pronunciation', 'ठ (Ṭha)', '**Aspirated, Unvoiced**

**Pronunciation:** Aspirated retroflex ''t'' (with breath)
**Sound:** ṭha (ठ)

**Devanagari:** ठ
**Brahmi:** 𑀞', '{"brahmi_symbol": "𑀞", "devanagari": "ठ", "sound": "ṭha", "type": "Aspirated Unvoiced"}'::jsonb, 5),
        
        (lesson4_id, 'writing_practice', 'Write ठ (𑀞)', 'Practice writing ठ (𑀞) in Brahmi script.', '{"character": "𑀞", "devanagari": "ठ", "sound": "ṭha"}'::jsonb, 6),
        
        (lesson4_id, 'pronunciation', 'ड (Ḍa)', '**Unaspirated, Voiced**

**Pronunciation:** Voiced retroflex ''d''
**Sound:** ḍa (ड)

**Devanagari:** ड
**Brahmi:** 𑀟', '{"brahmi_symbol": "𑀟", "devanagari": "ड", "sound": "ḍa", "type": "Unaspirated Voiced"}'::jsonb, 7),
        
        (lesson4_id, 'writing_practice', 'Write ड (𑀟)', 'Practice writing ड (𑀟) in Brahmi script.', '{"character": "𑀟", "devanagari": "ड", "sound": "ḍa"}'::jsonb, 8),
        
        (lesson4_id, 'pronunciation', 'ढ (Ḍha)', '**Aspirated, Voiced**

**Pronunciation:** Aspirated voiced retroflex ''d'' (with breath)
**Sound:** ḍha (ढ)

**Devanagari:** ढ
**Brahmi:** 𑀠', '{"brahmi_symbol": "𑀠", "devanagari": "ढ", "sound": "ḍha", "type": "Aspirated Voiced"}'::jsonb, 9),
        
        (lesson4_id, 'writing_practice', 'Write ढ (𑀠)', 'Practice writing ढ (𑀠) in Brahmi script.', '{"character": "𑀠", "devanagari": "ढ", "sound": "ḍha"}'::jsonb, 10),
        
        (lesson4_id, 'pronunciation', 'ण (Ṇa)', '**Nasal**

**Pronunciation:** Retroflex nasal ''n''
**Sound:** ṇa (ण)

**Devanagari:** ण
**Brahmi:** 𑀡', '{"brahmi_symbol": "𑀡", "devanagari": "ण", "sound": "ṇa", "type": "Nasal"}'::jsonb, 11),
        
        (lesson4_id, 'writing_practice', 'Write ण (𑀡)', 'Practice writing ण (𑀡) in Brahmi script.', '{"character": "𑀡", "devanagari": "ण", "sound": "ṇa"}'::jsonb, 12),
        
        (lesson4_id, 'examples', 'Word Examples', 'Retroflex consonants in words:

• **ट** - कटक (kaṭaka) - bracelet
• **ठ** - ठक्कुर (ṭhakkura) - lord
• **ड** - डमरु (ḍamaru) - small drum
• **ढ** - ढक्का (ḍhakkā) - cover, lid
• **ण** - प्राण (prāṇa) - life force, breath', NULL, 13),
        
        (lesson4_id, 'comparison', 'Retroflex vs Dental', 'Important distinction:

**Retroflex ट वर्ग (मूर्धन्य):**
Curl tongue back to roof of mouth
ट ठ ड ढ ण

**Dental त वर्ग (दन्त्य):**
Touch tongue to upper teeth
त थ द ध न

Listen carefully to hear the difference!', NULL, 14),
        
        (lesson4_id, 'mcq', 'Practice', 'How are retroflex consonants pronounced?', '{"options": ["Tongue to teeth", "Curl tongue back to roof of mouth", "From throat", "Using lips"], "correct_answer": "Curl tongue back to roof of mouth"}'::jsonb, 15),
        
        (lesson4_id, 'summary', 'Retroflex Complete! 🎉', 'Wonderful! You''ve learned retroflex consonants:
• ट (ṭa) - 𑀝
• ठ (ṭha) - 𑀞
• ड (ḍa) - 𑀟
• ढ (ḍha) - 𑀠
• ण (ṇa) - 𑀡

Next: दन्त्य (Dental consonants)', NULL, 16);

    -- ====================================================
    -- LESSON 5: Ta-Varga Dental (त वर्ग)
    -- ====================================================
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson5_id, 'title_slide', 'त वर्ग (Ta-Varga Dental)', 'Dental Consonants - दन्त्य (from the teeth)', '{"subtitle": "त थ द ध न"}'::jsonb, 1),
        
        (lesson5_id, 'consonant_intro', 'दन्त्य व्यञ्जन', 'These consonants are pronounced by touching the tongue to the upper teeth (दन्त). They are crisp and clear sounds, commonly used in Sanskrit.', '{"consonants": [{"devanagari": "त", "brahmi": "𑀢"}, {"devanagari": "थ", "brahmi": "𑀣"}, {"devanagari": "द", "brahmi": "𑀤"}, {"devanagari": "ध", "brahmi": "𑀥"}, {"devanagari": "न", "brahmi": "𑀦"}]}'::jsonb, 2),
        
        (lesson5_id, 'pronunciation', 'त (Ta)', '**Unaspirated, Unvoiced**

**Pronunciation:** Like ''t'' in "top" (tongue to teeth)
**Sound:** ta (त)

**Devanagari:** त
**Brahmi:** 𑀢', '{"brahmi_symbol": "𑀢", "devanagari": "त", "sound": "ta", "type": "Unaspirated Unvoiced"}'::jsonb, 3),
        
        (lesson5_id, 'writing_practice', 'Write त (𑀢)', 'Practice writing त (𑀢) in Brahmi script.', '{"character": "𑀢", "devanagari": "त", "sound": "ta"}'::jsonb, 4),
        
        (lesson5_id, 'pronunciation', 'थ (Tha)', '**Aspirated, Unvoiced**

**Pronunciation:** Like ''th'' in "thunder" (with breath)
**Sound:** tha (थ)

**Devanagari:** थ
**Brahmi:** 𑀣', '{"brahmi_symbol": "𑀣", "devanagari": "थ", "sound": "tha", "type": "Aspirated Unvoiced"}'::jsonb, 5),
        
        (lesson5_id, 'writing_practice', 'Write थ (𑀣)', 'Practice writing थ (𑀣) in Brahmi script.', '{"character": "𑀣", "devanagari": "थ", "sound": "tha"}'::jsonb, 6),
        
        (lesson5_id, 'pronunciation', 'द (Da)', '**Unaspirated, Voiced**

**Pronunciation:** Like ''d'' in "door" (tongue to teeth)
**Sound:** da (द)

**Devanagari:** द
**Brahmi:** 𑀤', '{"brahmi_symbol": "𑀤", "devanagari": "द", "sound": "da", "type": "Unaspirated Voiced"}'::jsonb, 7),
        
        (lesson5_id, 'writing_practice', 'Write द (𑀤)', 'Practice writing द (𑀤) in Brahmi script.', '{"character": "𑀤", "devanagari": "द", "sound": "da"}'::jsonb, 8),
        
        (lesson5_id, 'pronunciation', 'ध (Dha)', '**Aspirated, Voiced**

**Pronunciation:** Like ''dh'' in "redhead" (with breath)
**Sound:** dha (ध)

**Devanagari:** ध
**Brahmi:** 𑀥', '{"brahmi_symbol": "𑀥", "devanagari": "ध", "sound": "dha", "type": "Aspirated Voiced"}'::jsonb, 9),
        
        (lesson5_id, 'writing_practice', 'Write ध (𑀥)', 'Practice writing ध (𑀥) in Brahmi script.', '{"character": "𑀥", "devanagari": "ध", "sound": "dha"}'::jsonb, 10),
        
        (lesson5_id, 'pronunciation', 'न (Na)', '**Nasal**

**Pronunciation:** Like ''n'' in "name" or "sun"
**Sound:** na (न)

**Devanagari:** न
**Brahmi:** 𑀦', '{"brahmi_symbol": "𑀦", "devanagari": "न", "sound": "na", "type": "Nasal"}'::jsonb, 11),
        
        (lesson5_id, 'writing_practice', 'Write न (𑀦)', 'Practice writing न (𑀦) in Brahmi script.', '{"character": "𑀦", "devanagari": "न", "sound": "na"}'::jsonb, 12),
        
        (lesson5_id, 'examples', 'Word Examples', 'Dental consonants in Sanskrit:

• **त** - तप (tapa) - heat, penance
• **थ** - पथ (patha) - path, way
• **द** - दिव (diva) - day, heaven
• **ध** - धर्म (dharma) - righteousness, duty
• **न** - नमः (namaḥ) - salutation, bow', NULL, 13),
        
        (lesson5_id, 'key_points', 'Remember', 'Dental त वर्ग is one of the most frequently used groups in Sanskrit!

• Tongue touches upper teeth
• Clear, crisp sounds
• न (na) is very common in Sanskrit words', NULL, 14),
        
        (lesson5_id, 'mcq', 'Practice', 'Which is the nasal consonant in dental group?', '{"options": ["त (ta)", "थ (tha)", "द (da)", "न (na)"], "correct_answer": "न (na)"}'::jsonb, 15),
        
        (lesson5_id, 'summary', 'Dental Complete! 🎉', 'Excellent! You''ve mastered dental consonants:
• त (ta) - 𑀢
• थ (tha) - 𑀣
• द (da) - 𑀤
• ध (dha) - 𑀥
• न (na) - 𑀦

Next: ओष्ठ्य (Labial consonants)', NULL, 16);

    -- ====================================================
    -- LESSON 6: Pa-Varga (प वर्ग)
    -- ====================================================
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson6_id, 'title_slide', 'प वर्ग (Pa-Varga)', 'Labial Consonants - ओष्ठ्य (from the lips)', '{"subtitle": "प फ ब भ म"}'::jsonb, 1),
        
        (lesson6_id, 'consonant_intro', 'ओष्ठ्य व्यञ्जन', 'These consonants are pronounced using the lips (ओष्ठ). Place your fingers on your lips to feel them move as you pronounce these sounds!', '{"consonants": [{"devanagari": "प", "brahmi": "𑀧"}, {"devanagari": "फ", "brahmi": "𑀨"}, {"devanagari": "ब", "brahmi": "𑀩"}, {"devanagari": "भ", "brahmi": "𑀪"}, {"devanagari": "म", "brahmi": "𑀫"}]}'::jsonb, 2),
        
        (lesson6_id, 'pronunciation', 'प (Pa)', '**Unaspirated, Unvoiced**

**Pronunciation:** Like ''p'' in "pen" or "spin"
**Sound:** pa (प)

**Devanagari:** प
**Brahmi:** 𑀧', '{"brahmi_symbol": "𑀧", "devanagari": "प", "sound": "pa", "type": "Unaspirated Unvoiced"}'::jsonb, 3),
        
        (lesson6_id, 'writing_practice', 'Write प (𑀧)', 'Practice writing प (𑀧) in Brahmi script.', '{"character": "𑀧", "devanagari": "प", "sound": "pa"}'::jsonb, 4),
        
        (lesson6_id, 'pronunciation', 'फ (Pha)', '**Aspirated, Unvoiced**

**Pronunciation:** Like ''ph'' in "uphill" (with breath) or ''f'' in "phone"
**Sound:** pha (फ)

**Devanagari:** फ
**Brahmi:** 𑀨', '{"brahmi_symbol": "𑀨", "devanagari": "फ", "sound": "pha", "type": "Aspirated Unvoiced"}'::jsonb, 5),
        
        (lesson6_id, 'writing_practice', 'Write फ (𑀨)', 'Practice writing फ (𑀨) in Brahmi script.', '{"character": "𑀨", "devanagari": "फ", "sound": "pha"}'::jsonb, 6),
        
        (lesson6_id, 'pronunciation', 'ब (Ba)', '**Unaspirated, Voiced**

**Pronunciation:** Like ''b'' in "bat" or "book"
**Sound:** ba (ब)

**Devanagari:** ब
**Brahmi:** 𑀩', '{"brahmi_symbol": "𑀩", "devanagari": "ब", "sound": "ba", "type": "Unaspirated Voiced"}'::jsonb, 7),
        
        (lesson6_id, 'writing_practice', 'Write ब (𑀩)', 'Practice writing ब (𑀩) in Brahmi script.', '{"character": "𑀩", "devanagari": "ब", "sound": "ba"}'::jsonb, 8),
        
        (lesson6_id, 'pronunciation', 'भ (Bha)', '**Aspirated, Voiced**

**Pronunciation:** Like ''bh'' in "clubhouse" (with breath)
**Sound:** bha (भ)

**Devanagari:** भ
**Brahmi:** 𑀪', '{"brahmi_symbol": "𑀪", "devanagari": "भ", "sound": "bha", "type": "Aspirated Voiced"}'::jsonb, 9),
        
        (lesson6_id, 'writing_practice', 'Write भ (𑀪)', 'Practice writing भ (𑀪) in Brahmi script.', '{"character": "𑀪", "devanagari": "भ", "sound": "bha"}'::jsonb, 10),
        
        (lesson6_id, 'pronunciation', 'म (Ma)', '**Nasal**

**Pronunciation:** Like ''m'' in "mother" or "sweet"
**Sound:** ma (म)

**Devanagari:** म
**Brahmi:** 𑀫', '{"brahmi_symbol": "𑀫", "devanagari": "म", "sound": "ma", "type": "Nasal"}'::jsonb, 11),
        
        (lesson6_id, 'writing_practice', 'Write म (𑀫)', 'Practice writing म (𑀫) in Brahmi script.', '{"character": "𑀫", "devanagari": "म", "sound": "ma"}'::jsonb, 12),
        
        (lesson6_id, 'examples', 'Word Examples', 'Labial consonants in words:

• **प** - पद (pada) - foot, step
• **फ** - फल (phala) - fruit, result
• **ब** - बल (bala) - strength, power
• **भ** - भव (bhava) - existence, becoming
• **म** - मति (mati) - intellect, thought', NULL, 13),
        
        (lesson6_id, 'key_points', 'Special Note', 'म (ma) is one of the most sacred sounds:

• **ॐ (Om)** - the cosmic sound
• मा (mā) - mother
• मन (mana) - mind

Labial consonants are melodious and flowing!', NULL, 14),
        
        (lesson6_id, 'mcq', 'Practice', 'प वर्ग consonants are pronounced using:', '{"options": ["Throat", "Teeth", "Lips", "Palate"], "correct_answer": "Lips"}'::jsonb, 15),
        
        (lesson6_id, 'summary', 'Pa-Varga Complete! 🎉', 'Fantastic! You''ve mastered labial consonants:
• प (pa) - 𑀧
• फ (pha) - 𑀨
• ब (ba) - 𑀩
• भ (bha) - 𑀪
• म (ma) - 𑀫

Next: अन्तःस्थ (Semi-vowels)', NULL, 16);

    -- ====================================================
    -- LESSON 7: Antastha (अन्तःस्थ)
    -- ====================================================
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson7_id, 'title_slide', 'अन्तःस्थ (Antaḥstha)', 'Semi-vowels - अर्धस्वर', '{"subtitle": "य र ल व"}'::jsonb, 1),
        
        (lesson7_id, 'text', 'What are Semi-vowels?', 'अन्तःस्थ means "in between" - these consonants have qualities of both vowels and consonants!

They flow smoothly and connect sounds together, making speech melodious and continuous.', NULL, 2),
        
        (lesson7_id, 'consonant_intro', 'The Four Semi-vowels', 'These special consonants bridge vowels and consonants with their flowing nature.', '{"consonants": [{"devanagari": "य", "brahmi": "𑀬"}, {"devanagari": "र", "brahmi": "𑀭"}, {"devanagari": "ल", "brahmi": "𑀮"}, {"devanagari": "व", "brahmi": "𑀯"}]}'::jsonb, 3),
        
        (lesson7_id, 'pronunciation', 'य (Ya)', '**Semi-vowel (Palatal)**

**Pronunciation:** Like ''y'' in "yes" or "yoga"
**Sound:** ya (य)

**Devanagari:** य
**Brahmi:** 𑀬', '{"brahmi_symbol": "𑀬", "devanagari": "य", "sound": "ya", "type": "Palatal Semi-vowel"}'::jsonb, 4),
        
        (lesson7_id, 'writing_practice', 'Write य (𑀬)', 'Practice writing य (𑀬) in Brahmi script.', '{"character": "𑀬", "devanagari": "य", "sound": "ya"}'::jsonb, 5),
        
        (lesson7_id, 'pronunciation', 'र (Ra)', '**Semi-vowel (Retroflex)**

**Pronunciation:** Like ''r'' in "red" (with slight roll)
**Sound:** ra (र)

**Devanagari:** र
**Brahmi:** 𑀭', '{"brahmi_symbol": "𑀭", "devanagari": "र", "sound": "ra", "type": "Retroflex Semi-vowel"}'::jsonb, 6),
        
        (lesson7_id, 'writing_practice', 'Write र (𑀭)', 'Practice writing र (𑀭) in Brahmi script.', '{"character": "𑀭", "devanagari": "र", "sound": "ra"}'::jsonb, 7),
        
        (lesson7_id, 'pronunciation', 'ल (La)', '**Semi-vowel (Dental)**

**Pronunciation:** Like ''l'' in "love" or "lamp"
**Sound:** la (ल)

**Devanagari:** ल
**Brahmi:** 𑀮', '{"brahmi_symbol": "𑀮", "devanagari": "ल", "sound": "la", "type": "Dental Semi-vowel"}'::jsonb, 8),
        
        (lesson7_id, 'writing_practice', 'Write ल (𑀮)', 'Practice writing ल (𑀮) in Brahmi script.', '{"character": "𑀮", "devanagari": "ल", "sound": "la"}'::jsonb, 9),
        
        (lesson7_id, 'pronunciation', 'व (Va)', '**Semi-vowel (Labial)**

**Pronunciation:** Like ''v'' in "van" or ''w'' in "water"
**Sound:** va (व)

**Devanagari:** व
**Brahmi:** 𑀯', '{"brahmi_symbol": "𑀯", "devanagari": "व", "sound": "va", "type": "Labial Semi-vowel"}'::jsonb, 10),
        
        (lesson7_id, 'writing_practice', 'Write व (𑀯)', 'Practice writing व (𑀯) in Brahmi script.', '{"character": "𑀯", "devanagari": "व", "sound": "va"}'::jsonb, 11),
        
        (lesson7_id, 'examples', 'Word Examples', 'Semi-vowels in beautiful Sanskrit words:

• **य** - योग (yoga) - union, practice
• **र** - रस (rasa) - essence, taste
• **ल** - लीला (līlā) - divine play
• **व** - वेद (veda) - knowledge, scripture', NULL, 12),
        
        (lesson7_id, 'key_points', 'Why ''Semi-vowels''?', '• Flow like vowels
• Function as consonants
• Connect sounds smoothly
• Essential for word formation
• Very common in Sanskrit', NULL, 13),
        
        (lesson7_id, 'mcq', 'Practice', 'How many semi-vowels are there?', '{"options": ["3", "4", "5", "6"], "correct_answer": "4"}'::jsonb, 14),
        
        (lesson7_id, 'summary', 'Antastha Complete! 🎉', 'Wonderful work! You''ve learned the semi-vowels:
• य (ya) - 𑀬
• र (ra) - 𑀭
• ल (la) - 𑀮
• व (va) - 𑀯

Next: ऊष्म (Sibilants) - the final group!', NULL, 15);

    -- ====================================================
    -- LESSON 8: Ushma (ऊष्म)
    -- ====================================================
    INSERT INTO public.vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no)
    VALUES 
        (lesson8_id, 'title_slide', 'ऊष्म (Ūṣma)', 'Sibilants - श्वासवर्ण (Breath Sounds)', '{"subtitle": "श ष स ह"}'::jsonb, 1),
        
        (lesson8_id, 'text', 'What are Sibilants?', 'ऊष्म means "heat" or "breath" - these consonants produce hissing, breathy, or fricative sounds!

They add texture and richness to Sanskrit pronunciation.', NULL, 2),
        
        (lesson8_id, 'consonant_intro', 'The Four Sibilants', 'Each has a unique sound quality - from soft whispers to strong hisses!', '{"consonants": [{"devanagari": "श", "brahmi": "𑀰"}, {"devanagari": "ष", "brahmi": "𑀱"}, {"devanagari": "स", "brahmi": "𑀲"}, {"devanagari": "ह", "brahmi": "𑀳"}]}'::jsonb, 3),
        
        (lesson8_id, 'pronunciation', 'श (Śa)', '**Palatal Sibilant**

**Pronunciation:** Like ''sh'' in "ship" or "shine"
**Sound:** śa (श)

**Devanagari:** श
**Brahmi:** 𑀰', '{"brahmi_symbol": "𑀰", "devanagari": "श", "sound": "śa", "type": "Palatal Sibilant"}'::jsonb, 4),
        
        (lesson8_id, 'writing_practice', 'Write श (𑀰)', 'Practice writing श (𑀰) in Brahmi script.', '{"character": "𑀰", "devanagari": "श", "sound": "śa"}'::jsonb, 5),
        
        (lesson8_id, 'pronunciation', 'ष (Ṣa)', '**Retroflex Sibilant**

**Pronunciation:** Retroflex ''sh'' (tongue curled back)
**Sound:** ṣa (ष)

**Devanagari:** ष
**Brahmi:** 𑀱', '{"brahmi_symbol": "𑀱", "devanagari": "ष", "sound": "ṣa", "type": "Retroflex Sibilant"}'::jsonb, 6),
        
        (lesson8_id, 'writing_practice', 'Write ष (𑀱)', 'Practice writing ष (𑀱) in Brahmi script.', '{"character": "𑀱", "devanagari": "ष", "sound": "ṣa"}'::jsonb, 7),
        
        (lesson8_id, 'pronunciation', 'स (Sa)', '**Dental Sibilant**

**Pronunciation:** Like ''s'' in "sun" or "sister"
**Sound:** sa (स)

**Devanagari:** स
**Brahmi:** 𑀲', '{"brahmi_symbol": "𑀲", "devanagari": "स", "sound": "sa", "type": "Dental Sibilant"}'::jsonb, 8),
        
        (lesson8_id, 'writing_practice', 'Write स (𑀲)', 'Practice writing स (𑀲) in Brahmi script.', '{"character": "𑀲", "devanagari": "स", "sound": "sa"}'::jsonb, 9),
        
        (lesson8_id, 'pronunciation', 'ह (Ha)', '**Glottal Fricative**

**Pronunciation:** Like ''h'' in "home" (breathy)
**Sound:** ha (ह)

**Devanagari:** ह
**Brahmi:** 𑀳', '{"brahmi_symbol": "𑀳", "devanagari": "ह", "sound": "ha", "type": "Glottal Fricative"}'::jsonb, 10),
        
        (lesson8_id, 'writing_practice', 'Write ह (𑀳)', 'Practice writing ह (𑀳) in Brahmi script.', '{"character": "𑀳", "devanagari": "ह", "sound": "ha"}'::jsonb, 11),
        
        (lesson8_id, 'examples', 'Word Examples', 'Sibilants in sacred and common words:

• **श** - शान्ति (śānti) - peace
• **ष** - षड् (ṣaḍ) - six
• **स** - सूर्य (sūrya) - sun
• **ह** - हृदय (hṛdaya) - heart', NULL, 12),
        
        (lesson8_id, 'comparison', 'The Three ''SH'' Sounds', 'Sanskrit has three different ''sh'' sounds!

• **श (śa)** - Palatal - like "ship"
• **ष (ṣa)** - Retroflex - deeper, curled tongue
• **स (sa)** - Dental - like "sun"

This precision makes Sanskrit unique!', NULL, 13),
        
        (lesson8_id, 'mcq', 'Practice', 'Which sibilant is the glottal fricative?', '{"options": ["श (śa)", "ष (ṣa)", "स (sa)", "ह (ha)"], "correct_answer": "ह (ha)"}'::jsonb, 14),
        
        (lesson8_id, 'summary', 'All Vyanjan Complete! 🎊🎉', 'Incredible achievement! You''ve mastered ALL consonants:

✅ कण्ठ्य - Ka-varga (5)
✅ तालव्य - Cha-varga (5)
✅ मूर्धन्य - Retroflex Ta-varga (5)
✅ दन्त्य - Dental Ta-varga (5)
✅ ओष्ठ्य - Pa-varga (5)
✅ अन्तःस्थ - Semi-vowels (4)
✅ ऊष्म - Sibilants (4)

**33 consonants in total!**

You can now read and write Brahmi consonants! 🏆', NULL, 15);

    RAISE NOTICE '✅ All 8 vyanjan lessons updated with comprehensive content!';
    RAISE NOTICE '📝 Includes writing practice for all 33 consonants';
    RAISE NOTICE '🎯 Total content slides: ~120';
    RAISE NOTICE '🚀 Vyanjan module ready for learning!';
END $$;
