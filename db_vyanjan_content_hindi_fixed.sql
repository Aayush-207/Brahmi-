-- Complete Vyanjan Module Content Update (All Hindi)
-- This script updates all 8 vyanjan lessons with comprehensive Hindi content
-- Includes all 33 consonants with pronunciation guides, writing practice, examples, and quizzes

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
    SELECT id INTO lesson1_id FROM vyanjan_lessons WHERE title = 'व्यञ्जन का परिचय';
    SELECT id INTO lesson2_id FROM vyanjan_lessons WHERE title = 'क वर्ग';
    SELECT id INTO lesson3_id FROM vyanjan_lessons WHERE title = 'च वर्ग';
    SELECT id INTO lesson4_id FROM vyanjan_lessons WHERE title = 'ट वर्ग (मूर्धन्य)';
    SELECT id INTO lesson5_id FROM vyanjan_lessons WHERE title = 'त वर्ग (दन्त्य)';
    SELECT id INTO lesson6_id FROM vyanjan_lessons WHERE title = 'प वर्ग';
    SELECT id INTO lesson7_id FROM vyanjan_lessons WHERE title = 'अन्तःस्थ';
    SELECT id INTO lesson8_id FROM vyanjan_lessons WHERE title = 'ऊष्म';

    -- Delete existing content
    DELETE FROM vyanjan_lesson_content WHERE lesson_id IN (lesson1_id, lesson2_id, lesson3_id, lesson4_id, lesson5_id, lesson6_id, lesson7_id, lesson8_id);

    -- ==========================================
    -- LESSON 1: Introduction to Vyanjan
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
    (lesson1_id, 'title_slide', 'व्यञ्जन', 'ब्राह्मी व्यञ्जनों की दुनिया में आपका स्वागत है!', NULL, 1),
    (lesson1_id, 'text', 'व्यञ्जन क्या हैं?', 'व्यञ्जन वे ध्वनियाँ हैं जो स्वरों के साथ मिलकर शब्द बनाती हैं। ब्राह्मी में 33 व्यञ्जन हैं, जो पाँच मुख्य वर्गों में व्यवस्थित हैं।

ये वर्ग मुँह के विभिन्न भागों से उच्चारित होते हैं - गला, तालु, दाँत, और होंठ।', NULL, 2),
    (lesson1_id, 'text', 'पाँच मुख्य वर्ग', '**क वर्ग (कण्ठ्य)** - गले से
- क, ख, ग, घ, ङ

**च वर्ग (तालव्य)** - तालु से
- च, छ, ज, झ, ञ

**ट वर्ग (मूर्धन्य)** - मूर्धा से
- ट, ठ, ड, ढ, ण

**त वर्ग (दन्त्य)** - दाँतों से
- त, थ, द, ध, न

**प वर्ग (ओष्ठ्य)** - होंठों से
- प, फ, ब, भ, म', NULL, 3),
    (lesson1_id, 'text', 'प्रत्येक वर्ग में पैटर्न', 'प्रत्येक वर्ग में पाँच व्यञ्जन एक विशेष क्रम में होते हैं:

1. **अल्पप्राण अघोष** (कम हवा, बिना कंपन)
2. **महाप्राण अघोष** (अधिक हवा, बिना कंपन)
3. **अल्पप्राण घोष** (कम हवा, स्वर तंत्रियों के साथ)
4. **महाप्राण घोष** (अधिक हवा, स्वर तंत्रियों के साथ)
5. **अनुनासिक घोष** (नाक से)', NULL, 4),
    (lesson1_id, 'key_points', 'याद रखें', '• 33 कुल व्यञ्जन
• 5 मुख्य वर्ग
• प्रत्येक वर्ग में 5 व्यञ्जन
• उच्चारण स्थान के अनुसार व्यवस्थित
• प्रत्येक वर्ग में नियमित पैटर्न', NULL, 5),
    (lesson1_id, 'mcq', 'व्यञ्जन किस आधार पर व्यवस्थित किए गए हैं?', NULL, '{"options": ["मुँह में उच्चारण स्थान के अनुसार", "वर्णमाला के क्रम में", "उपयोग की आवृत्ति के अनुसार", "आकार के अनुसार"], "correct_answer": "मुँह में उच्चारण स्थान के अनुसार"}'::jsonb, 6),
    (lesson1_id, 'summary', 'आइए शुरू करें!', 'आपने सीखा:
• व्यञ्जन क्या होते हैं
• पाँच मुख्य वर्ग
• प्रत्येक वर्ग का पैटर्न
• उच्चारण कैसे किया जाता है

अब हम प्रत्येक व्यञ्जन को विस्तार से सीखेंगे!', NULL, 7);

    -- ==========================================
    -- LESSON 2: Ka-Varga (क वर्ग)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
    (lesson2_id, 'title_slide', 'क वर्ग', 'कण्ठ्य व्यञ्जन - गले से उच्चारित', NULL, 1),
    (lesson2_id, 'consonant_intro', 'क वर्ग - कण्ठ्य व्यञ्जन', 'ये व्यञ्जन गले (कण्ठ) से उच्चारित होते हैं। इसमें पाँच व्यञ्जन हैं:

क (𑀓) ख (𑀔) ग (𑀕) घ (𑀖) ङ (𑀗)

ये सभी गले के पिछले भाग को इस्तेमाल करते हैं।', '{"consonants": ["क", "ख", "ग", "घ", "ङ"]}'::jsonb, 2),
    -- क (Ka)
    (lesson2_id, 'pronunciation', 'क (𑀓) - ka', '**अल्पप्राण अघोष**

अंग्रेजी "skill" में "k" जैसा (बिना हवा के फूटकर)

**देवनागरी:** क
**ब्राह्मी:** 𑀓
**ध्वनि:** ka', '{"brahmi_symbol": "𑀓", "devanagari": "क", "sound": "ka"}'::jsonb, 3),
    (lesson2_id, 'writing_practice', 'अभ्यास', 'क (𑀓) लिखें', '{"character": "क", "brahmi": "𑀓"}'::jsonb, 4),
    -- ख (Kha)
    (lesson2_id, 'pronunciation', 'ख (𑀔) - kha', '**महाप्राण अघोष**

अंग्रेजी "blockhead" में "kh" जैसा (हवा के साथ)

**देवनागरी:** ख
**ब्राह्मी:** 𑀔
**ध्वनि:** kha', '{"brahmi_symbol": "𑀔", "devanagari": "ख", "sound": "kha"}'::jsonb, 5),
    (lesson2_id, 'writing_practice', 'अभ्यास', 'ख (𑀔) लिखें', '{"character": "ख", "brahmi": "𑀔"}'::jsonb, 6),
    -- ग (Ga)
    (lesson2_id, 'pronunciation', 'ग (𑀕) - ga', '**अल्पप्राण घोष**

अंग्रेजी "go" में "g" जैसा

**देवनागरी:** ग
**ब्राह्मी:** 𑀕
**ध्वनि:** ga', '{"brahmi_symbol": "𑀕", "devanagari": "ग", "sound": "ga"}'::jsonb, 7),
    (lesson2_id, 'writing_practice', 'अभ्यास', 'ग (𑀕) लिखें', '{"character": "ग", "brahmi": "𑀕"}'::jsonb, 8),
    -- घ (Gha)
    (lesson2_id, 'pronunciation', 'घ (𑀖) - gha', '**महाप्राण घोष**

अंग्रेजी "doghouse" में "gh" जैसा (हवा के साथ)

**देवनागरी:** घ
**ब्राह्मी:** 𑀖
**ध्वनि:** gha', '{"brahmi_symbol": "𑀖", "devanagari": "घ", "sound": "gha"}'::jsonb, 9),
    (lesson2_id, 'writing_practice', 'अभ्यास', 'घ (𑀖) लिखें', '{"character": "घ", "brahmi": "𑀖"}'::jsonb, 10),
    -- ङ (Nga)
    (lesson2_id, 'pronunciation', 'ङ (𑀗) - ṅa', '**अनुनासिक घोष**

अंग्रेजी "sing" में "ng" जैसा

**देवनागरी:** ङ
**ब्राह्मी:** 𑀗
**ध्वनि:** ṅa (अनुनासिक)', '{"brahmi_symbol": "𑀗", "devanagari": "ङ", "sound": "nga"}'::jsonb, 11),
    (lesson2_id, 'writing_practice', 'अभ्यास', 'ङ (𑀗) लिखें', '{"character": "ङ", "brahmi": "𑀗"}'::jsonb, 12),
    (lesson2_id, 'examples', 'शब्द उदाहरण', '**क** - कमल (kamal) - कमल
**ख** - खग (khaga) - पक्षी
**ग** - गज (gaja) - हाथी
**घ** - घट (ghaṭa) - घड़ा
**ङ** - अङ्ग (aṅga) - अंग', NULL, 13),
    (lesson2_id, 'mcq', 'कौन सा व्यञ्जन महाप्राण घोष है?', NULL, '{"options": ["क", "ख", "ग", "घ"], "correct_answer": "घ"}'::jsonb, 14),
    (lesson2_id, 'summary', 'क वर्ग पूर्ण! 🎉', 'आपने सीखा:
• पाँचों कण्ठ्य व्यञ्जन
• उच्चारण की विधि
• लेखन का अभ्यास
• शब्दों में उपयोग

अगला: च वर्ग!', NULL, 15);

    -- ==========================================
    -- LESSON 3: Cha-Varga (च वर्ग)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
    (lesson3_id, 'title_slide', 'च वर्ग', 'तालव्य व्यञ्जन - तालु से उच्चारित', NULL, 1),
    (lesson3_id, 'consonant_intro', 'च वर्ग - तालव्य व्यञ्जन', 'ये व्यञ्जन तालु (मुँह की छत) से उच्चारित होते हैं। इसमें पाँच व्यञ्जन हैं:

च (𑀘) छ (𑀙) ज (𑀚) झ (𑀛) ञ (𑀜)

जीभ तालु को छूकर ये ध्वनियाँ बनती हैं।', '{"consonants": ["च", "छ", "ज", "झ", "ञ"]}'::jsonb, 2),
    -- च (Cha)
    (lesson3_id, 'pronunciation', 'च (𑀘) - ca', '**अल्पप्राण अघोष**

अंग्रेजी "chart" में "ch" जैसा

**देवनागरी:** च
**ब्राह्मी:** 𑀘
**ध्वनि:** ca', '{"brahmi_symbol": "𑀘", "devanagari": "च", "sound": "ca"}'::jsonb, 3),
    (lesson3_id, 'writing_practice', 'अभ्यास', 'च (𑀘) लिखें', '{"character": "च", "brahmi": "𑀘"}'::jsonb, 4),
    -- छ (Chha)
    (lesson3_id, 'pronunciation', 'छ (𑀙) - cha', '**महाप्राण अघोष**

अंग्रेजी "pinchhit" में "chh" जैसा (अधिक हवा के साथ)

**देवनागरी:** छ
**ब्राह्मी:** 𑀙
**ध्वनि:** cha', '{"brahmi_symbol": "𑀙", "devanagari": "छ", "sound": "cha"}'::jsonb, 5),
    (lesson3_id, 'writing_practice', 'अभ्यास', 'छ (𑀙) लिखें', '{"character": "छ", "brahmi": "𑀙"}'::jsonb, 6),
    -- ज (Ja)
    (lesson3_id, 'pronunciation', 'ज (𑀚) - ja', '**अल्पप्राण घोष**

अंग्रेजी "judge" में "j" जैसा

**देवनागरी:** ज
**ब्राह्मी:** 𑀚
**ध्वनि:** ja', '{"brahmi_symbol": "𑀚", "devanagari": "ज", "sound": "ja"}'::jsonb, 7),
    (lesson3_id, 'writing_practice', 'अभ्यास', 'ज (𑀚) लिखें', '{"character": "ज", "brahmi": "𑀚"}'::jsonb, 8),
    -- झ (Jha)
    (lesson3_id, 'pronunciation', 'झ (𑀛) - jha', '**महाप्राण घोष**

अंग्रेजी "hedgehog" में "dgehog" जैसा (अधिक हवा के साथ)

**देवनागरी:** झ
**ब्राह्मी:** 𑀛
**ध्वनि:** jha', '{"brahmi_symbol": "𑀛", "devanagari": "झ", "sound": "jha"}'::jsonb, 9),
    (lesson3_id, 'writing_practice', 'अभ्यास', 'झ (𑀛) लिखें', '{"character": "झ", "brahmi": "𑀛"}'::jsonb, 10),
    -- ञ (Nya)
    (lesson3_id, 'pronunciation', 'ञ (𑀜) - ña', '**अनुनासिक घोष**

स्पेनिश "señor" में "ñ" जैसा, या "onion" में "ni" जैसा

**देवनागरी:** ञ
**ब्राह्मी:** 𑀜
**ध्वनि:** ña (अनुनासिक)', '{"brahmi_symbol": "𑀜", "devanagari": "ञ", "sound": "nya"}'::jsonb, 11),
    (lesson3_id, 'writing_practice', 'अभ्यास', 'ञ (𑀜) लिखें', '{"character": "ञ", "brahmi": "𑀜"}'::jsonb, 12),
    (lesson3_id, 'examples', 'शब्द उदाहरण', '**च** - चन्द्र (candra) - चाँद
**छ** - छत्र (chatra) - छतरी
**ज** - जल (jala) - पानी
**झ** - झरना (jharanā) - झरना
**ञ** - ज्ञान (jñāna) - ज्ञान', NULL, 13),
    (lesson3_id, 'mcq', 'कौन सा व्यञ्जन अनुनासिक है?', NULL, '{"options": ["च", "छ", "ज", "ञ"], "correct_answer": "ञ"}'::jsonb, 14),
    (lesson3_id, 'summary', 'च वर्ग पूर्ण! 🎉', 'आपने सीखा:
• पाँचों तालव्य व्यञ्जन
• तालु से उच्चारण
• लेखन का अभ्यास
• शब्दों में उपयोग

अगला: ट वर्ग (मूर्धन्य)!', NULL, 15);

    -- ==========================================
    -- LESSON 4: Ta-Varga Retroflex (ट वर्ग मूर्धन्य)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
    (lesson4_id, 'title_slide', 'ट वर्ग (मूर्धन्य)', 'मूर्धन्य व्यञ्जन - मूर्धा से उच्चारित', NULL, 1),
    (lesson4_id, 'consonant_intro', 'ट वर्ग - मूर्धन्य व्यञ्जन', 'ये व्यञ्जन जीभ को मुड़ाकर मूर्धा (मुँह की छत के ऊपरी भाग) से उच्चारित होते हैं:

ट (𑀝) ठ (𑀞) ड (𑀟) ढ (𑀠) ण (𑀡)

जीभ को पीछे मोड़कर मूर्धा को छूना पड़ता है।', '{"consonants": ["ट", "ठ", "ड", "ढ", "ण"]}'::jsonb, 2),
    -- ट (Ta)
    (lesson4_id, 'pronunciation', 'ट (𑀝) - ṭa', '**अल्पप्राण अघोष**

जीभ को मोड़कर, जैसे "water" (अमेरिकी उच्चारण) में "t"

**देवनागरी:** ट
**ब्राह्मी:** 𑀝
**ध्वनि:** ṭa (मूर्धन्य)', '{"brahmi_symbol": "𑀝", "devanagari": "ट", "sound": "ṭa"}'::jsonb, 3),
    (lesson4_id, 'writing_practice', 'अभ्यास', 'ट (𑀝) लिखें', '{"character": "ट", "brahmi": "𑀝"}'::jsonb, 4),
    -- ठ (Tha)
    (lesson4_id, 'pronunciation', 'ठ (𑀞) - ṭha', '**महाप्राण अघोष**

ट की तरह लेकिन अधिक हवा के साथ

**देवनागरी:** ठ
**ब्राह्मी:** 𑀞
**ध्वनि:** ṭha (महाप्राण)', '{"brahmi_symbol": "𑀞", "devanagari": "ठ", "sound": "ṭha"}'::jsonb, 5),
    (lesson4_id, 'writing_practice', 'अभ्यास', 'ठ (𑀞) लिखें', '{"character": "ठ", "brahmi": "𑀞"}'::jsonb, 6),
    -- ड (Da)
    (lesson4_id, 'pronunciation', 'ड (𑀟) - ḍa', '**अल्पप्राण घोष**

जीभ मोड़कर, अंग्रेजी "hard" में "d" जैसा

**देवनागरी:** ड
**ब्राह्मी:** 𑀟
**ध्वनि:** ḍa (घोष)', '{"brahmi_symbol": "𑀟", "devanagari": "ड", "sound": "ḍa"}'::jsonb, 7),
    (lesson4_id, 'writing_practice', 'अभ्यास', 'ड (𑀟) लिखें', '{"character": "ड", "brahmi": "𑀟"}'::jsonb, 8),
    -- ढ (Dha)
    (lesson4_id, 'pronunciation', 'ढ (𑀠) - ḍha', '**महाप्राण घोष**

ड की तरह लेकिन अधिक हवा के साथ

**देवनागरी:** ढ
**ब्राह्मी:** 𑀠
**ध्वनि:** ḍha (महाप्राण घोष)', '{"brahmi_symbol": "𑀠", "devanagari": "ढ", "sound": "ḍha"}'::jsonb, 9),
    (lesson4_id, 'writing_practice', 'अभ्यास', 'ढ (𑀠) लिखें', '{"character": "ढ", "brahmi": "𑀠"}'::jsonb, 10),
    -- ण (Na)
    (lesson4_id, 'pronunciation', 'ण (𑀡) - ṇa', '**अनुनासिक घोष**

जीभ मोड़कर, मूर्धा से अनुनासिक ध्वनि

**देवनागरी:** ण
**ब्राह्मी:** 𑀡
**ध्वनि:** ṇa (अनुनासिक)', '{"brahmi_symbol": "𑀡", "devanagari": "ण", "sound": "ṇa"}'::jsonb, 11),
    (lesson4_id, 'writing_practice', 'अभ्यास', 'ण (𑀡) लिखें', '{"character": "ण", "brahmi": "𑀡"}'::jsonb, 12),
    (lesson4_id, 'examples', 'शब्द उदाहरण', '**ट** - काटना (kāṭnā) - काटना
**ठ** - ठीक (ṭhīk) - ठीक
**ड** - डमरू (ḍamarū) - डमरू
**ढ** - ढोल (ḍhola) - ढोल
**ण** - गुण (guṇa) - गुण', NULL, 13),
    (lesson4_id, 'mcq', 'मूर्धन्य व्यञ्जन कहाँ से उच्चारित होते हैं?', NULL, '{"options": ["मुँह की छत के ऊपरी भाग से", "दाँतों से", "तालु से", "गले से"], "correct_answer": "मुँह की छत के ऊपरी भाग से"}'::jsonb, 14),
    (lesson4_id, 'summary', 'ट वर्ग पूर्ण! 🎉', 'आपने सीखा:
• पाँचों मूर्धन्य व्यञ्जन
• जीभ मोड़कर उच्चारण
• लेखन का अभ्यास
• शब्दों में उपयोग

अगला: त वर्ग (दन्त्य)!', NULL, 15);

    -- ==========================================
    -- LESSON 5: Ta-Varga Dental (त वर्ग दन्त्य)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
    (lesson5_id, 'title_slide', 'त वर्ग (दन्त्य)', 'दन्त्य व्यञ्जन - दाँतों से उच्चारित', NULL, 1),
    (lesson5_id, 'consonant_intro', 'त वर्ग - दन्त्य व्यञ्जन', 'ये व्यञ्जन जीभ को दाँतों के पीछे लगाकर उच्चारित होते हैं:

त (𑀢) थ (𑀣) द (𑀤) ध (𑀥) न (𑀦)

जीभ की नोक दाँतों को छूती है।', '{"consonants": ["त", "थ", "द", "ध", "न"]}'::jsonb, 2),
    -- त (Ta)
    (lesson5_id, 'pronunciation', 'त (𑀢) - ta', '**अल्पप्राण अघोष**

फ्रेंच/स्पेनिश "t" जैसा, दाँतों के पीछे

**देवनागरी:** त
**ब्राह्मी:** 𑀢
**ध्वनि:** ta (दन्त्य)', '{"brahmi_symbol": "𑀢", "devanagari": "त", "sound": "ta"}'::jsonb, 3),
    (lesson5_id, 'writing_practice', 'अभ्यास', 'त (𑀢) लिखें', '{"character": "त", "brahmi": "𑀢"}'::jsonb, 4),
    -- थ (Tha)
    (lesson5_id, 'pronunciation', 'थ (𑀣) - tha', '**महाप्राण अघोष**

अंग्रेजी "anthem" में "th" जैसा (हवा के साथ)

**देवनागरी:** थ
**ब्राह्मी:** 𑀣
**ध्वनि:** tha (महाप्राण)', '{"brahmi_symbol": "𑀣", "devanagari": "थ", "sound": "tha"}'::jsonb, 5),
    (lesson5_id, 'writing_practice', 'अभ्यास', 'थ (𑀣) लिखें', '{"character": "थ", "brahmi": "𑀣"}'::jsonb, 6),
    -- द (Da)
    (lesson5_id, 'pronunciation', 'द (𑀤) - da', '**अल्पप्राण घोष**

स्पेनिश "donde" में "d" जैसा

**देवनागरी:** द
**ब्राह्मी:** 𑀤
**ध्वनि:** da (घोष)', '{"brahmi_symbol": "𑀤", "devanagari": "द", "sound": "da"}'::jsonb, 7),
    (lesson5_id, 'writing_practice', 'अभ्यास', 'द (𑀤) लिखें', '{"character": "द", "brahmi": "𑀤"}'::jsonb, 8),
    -- ध (Dha)
    (lesson5_id, 'pronunciation', 'ध (𑀥) - dha', '**महाप्राण घोष**

अंग्रेजी "adhere" में "dh" जैसा (हवा के साथ)

**देवनागरी:** ध
**ब्राह्मी:** 𑀥
**ध्वनि:** dha (महाप्राण घोष)', '{"brahmi_symbol": "𑀥", "devanagari": "ध", "sound": "dha"}'::jsonb, 9),
    (lesson5_id, 'writing_practice', 'अभ्यास', 'ध (𑀥) लिखें', '{"character": "ध", "brahmi": "𑀥"}'::jsonb, 10),
    -- न (Na)
    (lesson5_id, 'pronunciation', 'न (𑀦) - na', '**अनुनासिक घोष**

अंग्रेजी "nose" में "n" जैसा

**देवनागरी:** न
**ब्राह्मी:** 𑀦
**ध्वनि:** na (अनुनासिक)', '{"brahmi_symbol": "𑀦", "devanagari": "न", "sound": "na"}'::jsonb, 11),
    (lesson5_id, 'writing_practice', 'अभ्यास', 'न (𑀦) लिखें', '{"character": "न", "brahmi": "𑀦"}'::jsonb, 12),
    (lesson5_id, 'examples', 'शब्द उदाहरण', '**त** - तारा (tārā) - तारा
**थ** - थल (thala) - जमीन
**द** - दीप (dīpa) - दीया
**ध** - धन (dhana) - धन
**न** - नमन (namana) - नमस्कार', NULL, 13),
    (lesson5_id, 'comparison', 'मूर्धन्य बनाम दन्त्य', '**मूर्धन्य (ट वर्ग):**
जीभ मुड़ी हुई, मूर्धा से
ट, ठ, ड, ढ, ण

**दन्त्य (त वर्ग):**
जीभ सीधी, दाँतों से
त, थ, द, ध, न

सुनिए और महसूस करें कि फर्क कहाँ है!', NULL, 14),
    (lesson5_id, 'mcq', 'दन्त्य व्यञ्जन उच्चारण में जीभ कहाँ होती है?', NULL, '{"options": ["मुड़ी हुई मूर्धा पर", "दाँतों के पीछे", "तालु पर", "होंठों से"], "correct_answer": "दाँतों के पीछे"}'::jsonb, 15),
    (lesson5_id, 'summary', 'त वर्ग पूर्ण! 🎉', 'आपने सीखा:
• पाँचों दन्त्य व्यञ्जन
• दाँतों से उच्चारण
• मूर्धन्य से अंतर
• लेखन का अभ्यास

अगला: प वर्ग!', NULL, 16);

    -- ==========================================
    -- LESSON 6: Pa-Varga (प वर्ग)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
    (lesson6_id, 'title_slide', 'प वर्ग', 'ओष्ठ्य व्यञ्जन - होंठों से उच्चारित', NULL, 1),
    (lesson6_id, 'consonant_intro', 'प वर्ग - ओष्ठ्य व्यञ्जन', 'ये व्यञ्जन दोनों होंठों को मिलाकर उच्चारित होते हैं:

प (𑀧) फ (𑀨) ब (𑀩) भ (𑀪) म (𑀫)

होंठ बंद करके फिर खोलते हैं।', '{"consonants": ["प", "फ", "ब", "भ", "म"]}'::jsonb, 2),
    -- प (Pa)
    (lesson6_id, 'pronunciation', 'प (𑀧) - pa', '**अल्पप्राण अघोष**

अंग्रेजी "spin" में "p" जैसा

**देवनागरी:** प
**ब्राह्मी:** 𑀧
**ध्वनि:** pa', '{"brahmi_symbol": "𑀧", "devanagari": "प", "sound": "pa"}'::jsonb, 3),
    (lesson6_id, 'writing_practice', 'अभ्यास', 'प (𑀧) लिखें', '{"character": "प", "brahmi": "𑀧"}'::jsonb, 4),
    -- फ (Pha)
    (lesson6_id, 'pronunciation', 'फ (𑀨) - pha', '**महाप्राण अघोष**

अंग्रेजी "photo" में "ph" जैसा (हवा के साथ)

**देवनागरी:** फ
**ब्राह्मी:** 𑀨
**ध्वनि:** pha', '{"brahmi_symbol": "𑀨", "devanagari": "फ", "sound": "pha"}'::jsonb, 5),
    (lesson6_id, 'writing_practice', 'अभ्यास', 'फ (𑀨) लिखें', '{"character": "फ", "brahmi": "𑀨"}'::jsonb, 6),
    -- ब (Ba)
    (lesson6_id, 'pronunciation', 'ब (𑀩) - ba', '**अल्पप्राण घोष**

अंग्रेजी "book" में "b" जैसा

**देवनागरी:** ब
**ब्राह्मी:** 𑀩
**ध्वनि:** ba', '{"brahmi_symbol": "𑀩", "devanagari": "ब", "sound": "ba"}'::jsonb, 7),
    (lesson6_id, 'writing_practice', 'अभ्यास', 'ब (𑀩) लिखें', '{"character": "ब", "brahmi": "𑀩"}'::jsonb, 8),
    -- भ (Bha)
    (lesson6_id, 'pronunciation', 'भ (𑀪) - bha', '**महाप्राण घोष**

अंग्रेजी "clubhouse" में "bh" जैसा (हवा के साथ)

**देवनागरी:** भ
**ब्राह्मी:** 𑀪
**ध्वनि:** bha', '{"brahmi_symbol": "𑀪", "devanagari": "भ", "sound": "bha"}'::jsonb, 9),
    (lesson6_id, 'writing_practice', 'अभ्यास', 'भ (𑀪) लिखें', '{"character": "भ", "brahmi": "𑀪"}'::jsonb, 10),
    -- म (Ma)
    (lesson6_id, 'pronunciation', 'म (𑀫) - ma', '**अनुनासिक घोष**

अंग्रेजी "mother" में "m" जैसा

**देवनागरी:** म
**ब्राह्मी:** 𑀫
**ध्वनि:** ma (अनुनासिक)', '{"brahmi_symbol": "𑀫", "devanagari": "म", "sound": "ma"}'::jsonb, 11),
    (lesson6_id, 'writing_practice', 'अभ्यास', 'म (𑀫) लिखें', '{"character": "म", "brahmi": "𑀫"}'::jsonb, 12),
    (lesson6_id, 'examples', 'शब्द उदाहरण', '**प** - पत्र (patra) - पत्ता
**फ** - फल (phala) - फल
**ब** - बल (bala) - शक्ति
**भ** - भूमि (bhūmi) - भूमि
**म** - मति (mati) - बुद्धि', NULL, 13),
    (lesson6_id, 'mcq', 'कौन सा व्यञ्जन अनुनासिक ओष्ठ्य है?', NULL, '{"options": ["प", "फ", "ब", "म"], "correct_answer": "म"}'::jsonb, 14),
    (lesson6_id, 'summary', 'प वर्ग पूर्ण! 🎉', 'आपने सीखा:
• पाँचों ओष्ठ्य व्यञ्जन
• होंठों से उच्चारण
• लेखन का अभ्यास
• शब्दों में उपयोग

अगला: अन्तःस्थ व्यञ्जन!', NULL, 15);

    -- ==========================================
    -- LESSON 7: Antastha (अन्तःस्थ)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
    (lesson7_id, 'title_slide', 'अन्तःस्थ', 'अर्ध-स्वर - स्वर और व्यञ्जन के बीच', NULL, 1),
    (lesson7_id, 'consonant_intro', 'अन्तःस्थ व्यञ्जन', 'ये व्यञ्जन स्वर और व्यञ्जन के बीच में हैं। इन्हें अर्ध-स्वर भी कहते हैं:

य (𑀬) र (𑀭) ल (𑀮) व (𑀯)

ये निरंतर ध्वनियाँ हैं, तुरंत नहीं रुकतीं।', '{"consonants": ["य", "र", "ल", "व"]}'::jsonb, 2),
    -- य (Ya)
    (lesson7_id, 'pronunciation', 'य (𑀬) - ya', '**तालव्य अर्ध-स्वर**

अंग्रेजी "yes" में "y" जैसा

**देवनागरी:** य
**ब्राह्मी:** 𑀬
**ध्वनि:** ya', '{"brahmi_symbol": "𑀬", "devanagari": "य", "sound": "ya"}'::jsonb, 3),
    (lesson7_id, 'writing_practice', 'अभ्यास', 'य (𑀬) लिखें', '{"character": "य", "brahmi": "𑀬"}'::jsonb, 4),
    -- र (Ra)
    (lesson7_id, 'pronunciation', 'र (𑀭) - ra', '**मूर्धन्य अर्ध-स्वर**

स्पेनिश "pero" में "r" जैसा (जीभ थोड़ी मुड़ी)

**देवनागरी:** र
**ब्राह्मी:** 𑀭
**ध्वनि:** ra', '{"brahmi_symbol": "𑀭", "devanagari": "र", "sound": "ra"}'::jsonb, 5),
    (lesson7_id, 'writing_practice', 'अभ्यास', 'र (𑀭) लिखें', '{"character": "र", "brahmi": "𑀭"}'::jsonb, 6),
    -- ल (La)
    (lesson7_id, 'pronunciation', 'ल (𑀮) - la', '**दन्त्य अर्ध-स्वर**

अंग्रेजी "love" में "l" जैसा

**देवनागरी:** ल
**ब्राह्मी:** 𑀮
**ध्वनि:** la', '{"brahmi_symbol": "𑀮", "devanagari": "ल", "sound": "la"}'::jsonb, 7),
    (lesson7_id, 'writing_practice', 'अभ्यास', 'ल (𑀮) लिखें', '{"character": "ल", "brahmi": "𑀮"}'::jsonb, 8),
    -- व (Va)
    (lesson7_id, 'pronunciation', 'व (𑀯) - va', '**ओष्ठ्य-दन्त्य अर्ध-स्वर**

अंग्रेजी "vine" में "v" जैसा

**देवनागरी:** व
**ब्राह्मी:** 𑀯
**ध्वनि:** va', '{"brahmi_symbol": "𑀯", "devanagari": "व", "sound": "va"}'::jsonb, 9),
    (lesson7_id, 'writing_practice', 'अभ्यास', 'व (𑀯) लिखें', '{"character": "व", "brahmi": "𑀯"}'::jsonb, 10),
    (lesson7_id, 'examples', 'शब्द उदाहरण', '**य** - योग (yoga) - योग
**र** - रस (rasa) - रस
**ल** - लता (latā) - बेल
**व** - वन (vana) - जंगल', NULL, 11),
    (lesson7_id, 'key_points', 'अन्तःस्थ की विशेषताएँ', '• स्वर और व्यञ्जन के बीच
• निरंतर ध्वनियाँ
• सभी घोष (स्वर तंत्रियों के साथ)
• संयुक्ताक्षर में बहुत उपयोगी
• बहुत सामान्य व्यञ्जन', NULL, 12),
    (lesson7_id, 'mcq', 'कौन सा अन्तःस्थ व्यञ्जन तालव्य है?', NULL, '{"options": ["य", "र", "ल", "व"], "correct_answer": "य"}'::jsonb, 13),
    (lesson7_id, 'summary', 'अन्तःस्थ पूर्ण! 🎉', 'आपने सीखा:
• चारों अन्तःस्थ व्यञ्जन
• अर्ध-स्वर की अवधारणा
• निरंतर ध्वनियाँ
• लेखन का अभ्यास

अंतिम पाठ: ऊष्म व्यञ्जन!', NULL, 14);

    -- ==========================================
    -- LESSON 8: Ushma (ऊष्म)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, title, content, metadata, order_no) VALUES
    (lesson8_id, 'title_slide', 'ऊष्म व्यञ्जन', 'सिसकारी की ध्वनियाँ', NULL, 1),
    (lesson8_id, 'consonant_intro', 'ऊष्म व्यञ्जन', 'ये व्यञ्जन घर्षण से बनती सिसकारी की ध्वनियाँ हैं:

श (𑀰) ष (𑀱) स (𑀲) ह (𑀳)

हवा संकरी जगह से निकलती है, घर्षण पैदा करती है।', '{"consonants": ["श", "ष", "स", "ह"]}'::jsonb, 2),
    -- श (Sha)
    (lesson8_id, 'pronunciation', 'श (𑀰) - śa', '**तालव्य ऊष्म**

अंग्रेजी "shine" में "sh" जैसा

**देवनागरी:** श
**ब्राह्मी:** 𑀰
**ध्वनि:** śa (तालव्य)', '{"brahmi_symbol": "𑀰", "devanagari": "श", "sound": "śa"}'::jsonb, 3),
    (lesson8_id, 'writing_practice', 'अभ्यास', 'श (𑀰) लिखें', '{"character": "श", "brahmi": "𑀰"}'::jsonb, 4),
    -- ष (Sha)
    (lesson8_id, 'pronunciation', 'ष (𑀱) - ṣa', '**मूर्धन्य ऊष्म**

श जैसा लेकिन जीभ थोड़ी मुड़ी हुई

**देवनागरी:** ष
**ब्राह्मी:** 𑀱
**ध्वनि:** ṣa (मूर्धन्य)', '{"brahmi_symbol": "𑀱", "devanagari": "ष", "sound": "ṣa"}'::jsonb, 5),
    (lesson8_id, 'writing_practice', 'अभ्यास', 'ष (𑀱) लिखें', '{"character": "ष", "brahmi": "𑀱"}'::jsonb, 6),
    -- स (Sa)
    (lesson8_id, 'pronunciation', 'स (𑀲) - sa', '**दन्त्य ऊष्म**

अंग्रेजी "sun" में "s" जैसा

**देवनागरी:** स
**ब्राह्मी:** 𑀲
**ध्वनि:** sa (दन्त्य)', '{"brahmi_symbol": "𑀲", "devanagari": "स", "sound": "sa"}'::jsonb, 7),
    (lesson8_id, 'writing_practice', 'अभ्यास', 'स (𑀲) लिखें', '{"character": "स", "brahmi": "𑀲"}'::jsonb, 8),
    -- ह (Ha)
    (lesson8_id, 'pronunciation', 'ह (𑀳) - ha', '**कण्ठ्य ऊष्म (घोष)**

अंग्रेजी "house" में "h" जैसा

**देवनागरी:** ह
**ब्राह्मी:** 𑀳
**ध्वनि:** ha (घोष)', '{"brahmi_symbol": "𑀳", "devanagari": "ह", "sound": "ha"}'::jsonb, 9),
    (lesson8_id, 'writing_practice', 'अभ्यास', 'ह (𑀳) लिखें', '{"character": "ह", "brahmi": "𑀳"}'::jsonb, 10),
    (lesson8_id, 'examples', 'शब्द उदाहरण', '**श** - शान्ति (śānti) - शांति
**ष** - षट् (ṣaṭ) - छह
**स** - सूर्य (sūrya) - सूर्य
**ह** - हस्त (hasta) - हाथ', NULL, 11),
    (lesson8_id, 'comparison', 'तीनों "श" ध्वनियाँ', '**श (तालव्य):** तालु से
जैसे "shine" - श

**ष (मूर्धन्य):** जीभ मुड़ी
षड् में जैसा - ष

**स (दन्त्य):** दाँतों से
जैसे "sun" - स

तीनों अलग हैं, लेकिन सब सिसकारी हैं!', NULL, 12),
    (lesson8_id, 'mcq', 'कौन सा ऊष्म व्यञ्जन घोष है?', NULL, '{"options": ["श", "ष", "स", "ह"], "correct_answer": "ह"}'::jsonb, 13),
    (lesson8_id, 'summary', 'सभी 33 व्यञ्जन पूर्ण! 🎊', 'बधाई हो! आपने सीखा:

**5 वर्ग (25 व्यञ्जन):**
• क वर्ग (कण्ठ्य) - 5
• च वर्ग (तालव्य) - 5
• ट वर्ग (मूर्धन्य) - 5
• त वर्ग (दन्त्य) - 5
• प वर्ग (ओष्ठ्य) - 5

**अन्तःस्थ (4):** य, र, ल, व

**ऊष्म (4):** श, ष, स, ह

अब आप सभी ब्राह्मी व्यञ्जन जानते हैं! 🎉', NULL, 14);

END $$;
