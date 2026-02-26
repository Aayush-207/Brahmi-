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
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, content_order, title, content, character, options, correct_answer, metadata) VALUES
    (lesson2_id, 'title_slide', 1, 'क वर्ग', 'कण्ठ्य व्यञ्जन - गले से उच्चारित', NULL, NULL, NULL, NULL),
    
    (lesson2_id, 'consonant_intro', 2, 'क वर्ग - कण्ठ्य व्यञ्जन', 'ये व्यञ्जन गले (कण्ठ) से उच्चारित होते हैं। इसमें पाँच व्यञ्जन हैं:

क (𑀓) ख (𑀔) ग (𑀕) घ (𑀖) ङ (𑀗)

ये सभी गले के पिछले भाग को इस्तेमाल करते हैं।', NULL, NULL, NULL, NULL),
    
    -- क (Ka)
    (lesson2_id, 'pronunciation', 3, 'क (𑀓) - ka', '**अल्पप्राण अघोष**

अंग्रेजी "skill" में "k" जैसा (बिना हवा के फूटकर)

**देवनागरी:** क
**ब्राह्मी:** 𑀓
**ध्वनि:** ka', 'क', NULL, NULL, NULL),
    
    (lesson2_id, 'writing_practice', 4, 'अभ्यास', 'क (𑀓) लिखें', 'क', NULL, NULL, '{"brahmi": "𑀓"}'),
    
    -- ख (Kha)
    (lesson2_id, 'pronunciation', 5, 'ख (𑀔) - kha', '**महाप्राण अघोष**

अंग्रेजी "blockhead" में "kh" जैसा (हवा के साथ)

**देवनागरी:** ख
**ब्राह्मी:** 𑀔
**ध्वनि:** kha', 'ख', NULL, NULL, NULL),
    
    (lesson2_id, 'writing_practice', 6, 'अभ्यास', 'ख (𑀔) लिखें', 'ख', NULL, NULL, '{"brahmi": "𑀔"}'),
    
    -- ग (Ga)
    (lesson2_id, 'pronunciation', 7, 'ग (𑀕) - ga', '**अल्पप्राण घोष**

अंग्रेजी "go" में "g" जैसा

**देवनागरी:** ग
**ब्राह्मी:** 𑀕
**ध्वनि:** ga', 'ग', NULL, NULL, NULL),
    
    (lesson2_id, 'writing_practice', 8, 'अभ्यास', 'ग (𑀕) लिखें', 'ग', NULL, NULL, '{"brahmi": "𑀕"}'),
    
    -- घ (Gha)
    (lesson2_id, 'pronunciation', 9, 'घ (𑀖) - gha', '**महाप्राण घोष**

अंग्रेजी "doghouse" में "gh" जैसा (हवा के साथ)

**देवनागरी:** घ
**ब्राह्मी:** 𑀖
**ध्वनि:** gha', 'घ', NULL, NULL, NULL),
    
    (lesson2_id, 'writing_practice', 10, 'अभ्यास', 'घ (𑀖) लिखें', 'घ', NULL, NULL, '{"brahmi": "𑀖"}'),
    
    -- ङ (Nga)
    (lesson2_id, 'pronunciation', 11, 'ङ (𑀗) - ṅa', '**अनुनासिक घोष**

अंग्रेजी "sing" में "ng" जैसा

**देवनागरी:** ङ
**ब्राह्मी:** 𑀗
**ध्वनि:** ṅa (अनुनासिक)', 'ङ', NULL, NULL, NULL),
    
    (lesson2_id, 'writing_practice', 12, 'अभ्यास', 'ङ (𑀗) लिखें', 'ङ', NULL, NULL, '{"brahmi": "𑀗"}'),
    
    (lesson2_id, 'examples', 13, 'शब्द उदाहरण', '**क** - कमल (kamal) - कमल
**ख** - खग (khaga) - पक्षी
**ग** - गज (gaja) - हाथी
**घ** - घट (ghaṭa) - घड़ा
**ङ** - अङ्ग (aṅga) - अंग', NULL, NULL, NULL, NULL),
    
    (lesson2_id, 'mcq', 14, 'कौन सा व्यञ्जन महाप्राण घोष है?', NULL, NULL, '["क", "ख", "ग", "घ"]', 'घ', NULL),
    
    (lesson2_id, 'summary', 15, 'क वर्ग पूर्ण! 🎉', 'आपने सीखा:
• पाँचों कण्ठ्य व्यञ्जन
• उच्चारण की विधि
• लेखन का अभ्यास
• शब्दों में उपयोग

अगला: च वर्ग!', NULL, NULL, NULL, NULL);

    -- ==========================================
    -- LESSON 3: Cha-Varga (च वर्ग)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, content_order, title, content, character, options, correct_answer, metadata) VALUES
    (lesson3_id, 'title_slide', 1, 'च वर्ग', 'तालव्य व्यञ्जन - तालु से उच्चारित', NULL, NULL, NULL, NULL),
    
    (lesson3_id, 'consonant_intro', 2, 'च वर्ग - तालव्य व्यञ्जन', 'ये व्यञ्जन तालु (मुँह की छत) से उच्चारित होते हैं। इसमें पाँच व्यञ्जन हैं:

च (𑀘) छ (𑀙) ज (𑀚) झ (𑀛) ञ (𑀜)

जीभ तालु को छूकर ये ध्वनियाँ बनती हैं।', NULL, NULL, NULL, NULL),
    
    -- च (Cha)
    (lesson3_id, 'pronunciation', 3, 'च (𑀘) - ca', '**अल्पप्राण अघोष**

अंग्रेजी "chart" में "ch" जैसा

**देवनागरी:** च
**ब्राह्मी:** 𑀘
**ध्वनि:** ca', 'च', NULL, NULL, NULL),
    
    (lesson3_id, 'writing_practice', 4, 'अभ्यास', 'च (𑀘) लिखें', 'च', NULL, NULL, '{"brahmi": "𑀘"}'),
    
    -- छ (Chha)
    (lesson3_id, 'pronunciation', 5, 'छ (𑀙) - cha', '**महाप्राण अघोष**

अंग्रेजी "pinchhit" में "chh" जैसा (अधिक हवा के साथ)

**देवनागरी:** छ
**ब्राह्मी:** 𑀙
**ध्वनि:** cha', 'छ', NULL, NULL, NULL),
    
    (lesson3_id, 'writing_practice', 6, 'अभ्यास', 'छ (𑀙) लिखें', 'छ', NULL, NULL, '{"brahmi": "𑀙"}'),
    
    -- ज (Ja)
    (lesson3_id, 'pronunciation', 7, 'ज (𑀚) - ja', '**अल्पप्राण घोष**

अंग्रेजी "judge" में "j" जैसा

**देवनागरी:** ज
**ब्राह्मी:** 𑀚
**ध्वनि:** ja', 'ज', NULL, NULL, NULL),
    
    (lesson3_id, 'writing_practice', 8, 'अभ्यास', 'ज (𑀚) लिखें', 'ज', NULL, NULL, '{"brahmi": "𑀚"}'),
    
    -- झ (Jha)
    (lesson3_id, 'pronunciation', 9, 'झ (𑀛) - jha', '**महाप्राण घोष**

अंग्रेजी "hedgehog" में "dgehog" जैसा (अधिक हवा के साथ)

**देवनागरी:** झ
**ब्राह्मी:** 𑀛
**ध्वनि:** jha', 'झ', NULL, NULL, NULL),
    
    (lesson3_id, 'writing_practice', 10, 'अभ्यास', 'झ (𑀛) लिखें', 'झ', NULL, NULL, '{"brahmi": "𑀛"}'),
    
    -- ञ (Nya)
    (lesson3_id, 'pronunciation', 11, 'ञ (𑀜) - ña', '**अनुनासिक घोष**

स्पेनिश "señor" में "ñ" जैसा, या "onion" में "ni" जैसा

**देवनागरी:** ञ
**ब्राह्मी:** 𑀜
**ध्वनि:** ña (अनुनासिक)', 'ञ', NULL, NULL, NULL),
    
    (lesson3_id, 'writing_practice', 12, 'अभ्यास', 'ञ (𑀜) लिखें', 'ञ', NULL, NULL, '{"brahmi": "𑀜"}'),
    
    (lesson3_id, 'examples', 13, 'शब्द उदाहरण', '**च** - चन्द्र (candra) - चाँद
**छ** - छत्र (chatra) - छतरी
**ज** - जल (jala) - पानी
**झ** - झरना (jharanā) - झरना
**ञ** - ज्ञान (jñāna) - ज्ञान', NULL, NULL, NULL, NULL),
    
    (lesson3_id, 'mcq', 14, 'कौन सा व्यञ्जन अनुनासिक है?', NULL, NULL, '["च", "छ", "ज", "ञ"]', 'ञ', NULL),
    
    (lesson3_id, 'summary', 15, 'च वर्ग पूर्ण! 🎉', 'आपने सीखा:
• पाँचों तालव्य व्यञ्जन
• तालु से उच्चारण
• लेखन का अभ्यास
• शब्दों में उपयोग

अगला: ट वर्ग (मूर्धन्य)!', NULL, NULL, NULL, NULL);

    -- ==========================================
    -- LESSON 4: Ta-Varga Retroflex (ट वर्ग मूर्धन्य)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, content_order, title, content, character, options, correct_answer, metadata) VALUES
    (lesson4_id, 'title_slide', 1, 'ट वर्ग (मूर्धन्य)', 'मूर्धन्य व्यञ्जन - मूर्धा से उच्चारित', NULL, NULL, NULL, NULL),
    
    (lesson4_id, 'consonant_intro', 2, 'ट वर्ग - मूर्धन्य व्यञ्जन', 'ये व्यञ्जन जीभ को मुड़ाकर मूर्धा (मुँह की छत के ऊपरी भाग) से उच्चारित होते हैं:

ट (𑀝) ठ (𑀞) ड (𑀟) ढ (𑀠) ण (𑀡)

जीभ को पीछे मोड़कर मूर्धा को छूना पड़ता है।', NULL, NULL, NULL, NULL),
    
    -- ट (Ta)
    (lesson4_id, 'pronunciation', 3, 'ट (𑀝) - ṭa', '**अल्पप्राण अघोष**

जीभ को मोड़कर, जैसे "water" (अमेरिकी उच्चारण) में "t"

**देवनागरी:** ट
**ब्राह्मी:** 𑀝
**ध्वनि:** ṭa (मूर्धन्य)', 'ट', NULL, NULL, NULL),
    
    (lesson4_id, 'writing_practice', 4, 'अभ्यास', 'ट (𑀝) लिखें', 'ट', NULL, NULL, '{"brahmi": "𑀝"}'),
    
    -- ठ (Tha)
    (lesson4_id, 'pronunciation', 5, 'ठ (𑀞) - ṭha', '**महाप्राण अघोष**

ट की तरह लेकिन अधिक हवा के साथ

**देवनागरी:** ठ
**ब्राह्मी:** 𑀞
**ध्वनि:** ṭha (महाप्राण)', 'ठ', NULL, NULL, NULL),
    
    (lesson4_id, 'writing_practice', 6, 'अभ्यास', 'ठ (𑀞) लिखें', 'ठ', NULL, NULL, '{"brahmi": "𑀞"}'),
    
    -- ड (Da)
    (lesson4_id, 'pronunciation', 7, 'ड (𑀟) - ḍa', '**अल्पप्राण घोष**

जीभ मोड़कर, अंग्रेजी "hard" में "d" जैसा

**देवनागरी:** ड
**ब्राह्मी:** 𑀟
**ध्वनि:** ḍa (घोष)', 'ड', NULL, NULL, NULL),
    
    (lesson4_id, 'writing_practice', 8, 'अभ्यास', 'ड (𑀟) लिखें', 'ड', NULL, NULL, '{"brahmi": "𑀟"}'),
    
    -- ढ (Dha)
    (lesson4_id, 'pronunciation', 9, 'ढ (𑀠) - ḍha', '**महाप्राण घोष**

ड की तरह लेकिन अधिक हवा के साथ

**देवनागरी:** ढ
**ब्राह्मी:** 𑀠
**ध्वनि:** ḍha (महाप्राण घोष)', 'ढ', NULL, NULL, NULL),
    
    (lesson4_id, 'writing_practice', 10, 'अभ्यास', 'ढ (𑀠) लिखें', 'ढ', NULL, NULL, '{"brahmi": "𑀠"}'),
    
    -- ण (Na)
    (lesson4_id, 'pronunciation', 11, 'ण (𑀡) - ṇa', '**अनुनासिक घोष**

जीभ मोड़कर, मूर्धा से अनुनासिक ध्वनि

**देवनागरी:** ण
**ब्राह्मी:** 𑀡
**ध्वनि:** ṇa (अनुनासिक)', 'ण', NULL, NULL, NULL),
    
    (lesson4_id, 'writing_practice', 12, 'अभ्यास', 'ण (𑀡) लिखें', 'ण', NULL, NULL, '{"brahmi": "𑀡"}'),
    
    (lesson4_id, 'examples', 13, 'शब्द उदाहरण', '**ट** - काटना (kāṭnā) - काटना
**ठ** - ठीक (ṭhīk) - ठीक
**ड** - डमरू (ḍamarū) - डमरू
**ढ** - ढोल (ḍhola) - ढोल
**ण** - गुण (guṇa) - गुण', NULL, NULL, NULL, NULL),
    
    (lesson4_id, 'mcq', 14, 'मूर्धन्य व्यञ्जन कहाँ से उच्चारित होते हैं?', NULL, NULL, '["मुँह की छत के ऊपरी भाग से", "दाँतों से", "तालु से", "गले से"]', 'मुँह की छत के ऊपरी भाग से', NULL),
    
    (lesson4_id, 'summary', 15, 'ट वर्ग पूर्ण! 🎉', 'आपने सीखा:
• पाँचों मूर्धन्य व्यञ्जन
• जीभ मोड़कर उच्चारण
• लेखन का अभ्यास
• शब्दों में उपयोग

अगला: त वर्ग (दन्त्य)!', NULL, NULL, NULL, NULL);

    -- ==========================================
    -- LESSON 5: Ta-Varga Dental (त वर्ग दन्त्य)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, content_order, title, content, character, options, correct_answer, metadata) VALUES
    (lesson5_id, 'title_slide', 1, 'त वर्ग (दन्त्य)', 'दन्त्य व्यञ्जन - दाँतों से उच्चारित', NULL, NULL, NULL, NULL),
    
    (lesson5_id, 'consonant_intro', 2, 'त वर्ग - दन्त्य व्यञ्जन', 'ये व्यञ्जन जीभ को दाँतों के पीछे लगाकर उच्चारित होते हैं:

त (𑀢) थ (𑀣) द (𑀤) ध (𑀥) न (𑀦)

जीभ की नोक दाँतों को छूती है।', NULL, NULL, NULL, NULL),
    
    -- त (Ta)
    (lesson5_id, 'pronunciation', 3, 'त (𑀢) - ta', '**अल्पप्राण अघोष**

फ्रेंच/स्पेनिश "t" जैसा, दाँतों के पीछे

**देवनागरी:** त
**ब्राह्मी:** 𑀢
**ध्वनि:** ta (दन्त्य)', 'त', NULL, NULL, NULL),
    
    (lesson5_id, 'writing_practice', 4, 'अभ्यास', 'त (𑀢) लिखें', 'त', NULL, NULL, '{"brahmi": "𑀢"}'),
    
    -- थ (Tha)
    (lesson5_id, 'pronunciation', 5, 'थ (𑀣) - tha', '**महाप्राण अघोष**

अंग्रेजी "anthem" में "th" जैसा (हवा के साथ)

**देवनागरी:** थ
**ब्राह्मी:** 𑀣
**ध्वनि:** tha (महाप्राण)', 'थ', NULL, NULL, NULL),
    
    (lesson5_id, 'writing_practice', 6, 'अभ्यास', 'थ (𑀣) लिखें', 'थ', NULL, NULL, '{"brahmi": "𑀣"}'),
    
    -- द (Da)
    (lesson5_id, 'pronunciation', 7, 'द (𑀤) - da', '**अल्पप्राण घोष**

स्पेनिश "donde" में "d" जैसा

**देवनागरी:** द
**ब्राह्मी:** 𑀤
**ध्वनि:** da (घोष)', 'द', NULL, NULL, NULL),
    
    (lesson5_id, 'writing_practice', 8, 'अभ्यास', 'द (𑀤) लिखें', 'द', NULL, NULL, '{"brahmi": "𑀤"}'),
    
    -- ध (Dha)
    (lesson5_id, 'pronunciation', 9, 'ध (𑀥) - dha', '**महाप्राण घोष**

अंग्रेजी "adhere" में "dh" जैसा (हवा के साथ)

**देवनागरी:** ध
**ब्राह्मी:** 𑀥
**ध्वनि:** dha (महाप्राण घोष)', 'ध', NULL, NULL, NULL),
    
    (lesson5_id, 'writing_practice', 10, 'अभ्यास', 'ध (𑀥) लिखें', 'ध', NULL, NULL, '{"brahmi": "𑀥"}'),
    
    -- न (Na)
    (lesson5_id, 'pronunciation', 11, 'न (𑀦) - na', '**अनुनासिक घोष**

अंग्रेजी "nose" में "n" जैसा

**देवनागरी:** न
**ब्राह्मी:** 𑀦
**ध्वनि:** na (अनुनासिक)', 'न', NULL, NULL, NULL),
    
    (lesson5_id, 'writing_practice', 12, 'अभ्यास', 'न (𑀦) लिखें', 'न', NULL, NULL, '{"brahmi": "𑀦"}'),
    
    (lesson5_id, 'examples', 13, 'शब्द उदाहरण', '**त** - तारा (tārā) - तारा
**थ** - थल (thala) - जमीन
**द** - दीप (dīpa) - दीया
**ध** - धन (dhana) - धन
**न** - नमन (namana) - नमस्कार', NULL, NULL, NULL, NULL),
    
    (lesson5_id, 'comparison', 14, 'मूर्धन्य बनाम दन्त्य', '**मूर्धन्य (ट वर्ग):**
जीभ मुड़ी हुई, मूर्धा से
ट, ठ, ड, ढ, ण

**दन्त्य (त वर्ग):**
जीभ सीधी, दाँतों से
त, थ, द, ध, न

सुनिए और महसूस करें कि फर्क कहाँ है!', NULL, NULL, NULL, NULL),
    
    (lesson5_id, 'mcq', 15, 'दन्त्य व्यञ्जन उच्चारण में जीभ कहाँ होती है?', NULL, NULL, '["मुड़ी हुई मूर्धा पर", "दाँतों के पीछे", "तालु पर", "होंठों से"]', 'दाँतों के पीछे', NULL),
    
    (lesson5_id, 'summary', 16, 'त वर्ग पूर्ण! 🎉', 'आपने सीखा:
• पाँचों दन्त्य व्यञ्जन
• दाँतों से उच्चारण
• मूर्धन्य से अंतर
• लेखन का अभ्यास

अगला: प वर्ग!', NULL, NULL, NULL, NULL);

    -- ==========================================
    -- LESSON 6: Pa-Varga (प वर्ग)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, content_order, title, content, character, options, correct_answer, metadata) VALUES
    (lesson6_id, 'title_slide', 1, 'प वर्ग', 'ओष्ठ्य व्यञ्जन - होंठों से उच्चारित', NULL, NULL, NULL, NULL),
    
    (lesson6_id, 'consonant_intro', 2, 'प वर्ग - ओष्ठ्य व्यञ्जन', 'ये व्यञ्जन दोनों होंठों को मिलाकर उच्चारित होते हैं:

प (𑀧) फ (𑀨) ब (𑀩) भ (𑀪) म (𑀫)

होंठ बंद करके फिर खोलते हैं।', NULL, NULL, NULL, NULL),
    
    -- प (Pa)
    (lesson6_id, 'pronunciation', 3, 'प (𑀧) - pa', '**अल्पप्राण अघोष**

अंग्रेजी "spin" में "p" जैसा

**देवनागरी:** प
**ब्राह्मी:** 𑀧
**ध्वनि:** pa', 'प', NULL, NULL, NULL),
    
    (lesson6_id, 'writing_practice', 4, 'अभ्यास', 'प (𑀧) लिखें', 'प', NULL, NULL, '{"brahmi": "𑀧"}'),
    
    -- फ (Pha)
    (lesson6_id, 'pronunciation', 5, 'फ (𑀨) - pha', '**महाप्राण अघोष**

अंग्रेजी "photo" में "ph" जैसा (हवा के साथ)

**देवनागरी:** फ
**ब्राह्मी:** 𑀨
**ध्वनि:** pha', 'फ', NULL, NULL, NULL),
    
    (lesson6_id, 'writing_practice', 6, 'अभ्यास', 'फ (𑀨) लिखें', 'फ', NULL, NULL, '{"brahmi": "𑀨"}'),
    
    -- ब (Ba)
    (lesson6_id, 'pronunciation', 7, 'ब (𑀩) - ba', '**अल्पप्राण घोष**

अंग्रेजी "book" में "b" जैसा

**देवनागरी:** ब
**ब्राह्मी:** 𑀩
**ध्वनि:** ba', 'ब', NULL, NULL, NULL),
    
    (lesson6_id, 'writing_practice', 8, 'अभ्यास', 'ब (𑀩) लिखें', 'ब', NULL, NULL, '{"brahmi": "𑀩"}'),
    
    -- भ (Bha)
    (lesson6_id, 'pronunciation', 9, 'भ (𑀪) - bha', '**महाप्राण घोष**

अंग्रेजी "clubhouse" में "bh" जैसा (हवा के साथ)

**देवनागरी:** भ
**ब्राह्मी:** 𑀪
**ध्वनि:** bha', 'भ', NULL, NULL, NULL),
    
    (lesson6_id, 'writing_practice', 10, 'अभ्यास', 'भ (𑀪) लिखें', 'भ', NULL, NULL, '{"brahmi": "𑀪"}'),
    
    -- म (Ma)
    (lesson6_id, 'pronunciation', 11, 'म (𑀫) - ma', '**अनुनासिक घोष**

अंग्रेजी "mother" में "m" जैसा

**देवनागरी:** म
**ब्राह्मी:** 𑀫
**ध्वनि:** ma (अनुनासिक)', 'म', NULL, NULL, NULL),
    
    (lesson6_id, 'writing_practice', 12, 'अभ्यास', 'म (𑀫) लिखें', 'म', NULL, NULL, '{"brahmi": "𑀫"}'),
    
    (lesson6_id, 'examples', 13, 'शब्द उदाहरण', '**प** - पत्र (patra) - पत्ता
**फ** - फल (phala) - फल
**ब** - बल (bala) - शक्ति
**भ** - भूमि (bhūmi) - भूमि
**म** - मति (mati) - बुद्धि', NULL, NULL, NULL, NULL),
    
    (lesson6_id, 'mcq', 14, 'कौन सा व्यञ्जन अनुनासिक ओष्ठ्य है?', NULL, NULL, '["प", "फ", "ब", "म"]', 'म', NULL),
    
    (lesson6_id, 'summary', 15, 'प वर्ग पूर्ण! 🎉', 'आपने सीखा:
• पाँचों ओष्ठ्य व्यञ्जन
• होंठों से उच्चारण
• लेखन का अभ्यास
• शब्दों में उपयोग

अगला: अन्तःस्थ व्यञ्जन!', NULL, NULL, NULL, NULL);

    -- ==========================================
    -- LESSON 7: Antastha (अन्तःस्थ)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, content_order, title, content, character, options, correct_answer, metadata) VALUES
    (lesson7_id, 'title_slide', 1, 'अन्तःस्थ', 'अर्ध-स्वर - स्वर और व्यञ्जन के बीच', NULL, NULL, NULL, NULL),
    
    (lesson7_id, 'consonant_intro', 2, 'अन्तःस्थ व्यञ्जन', 'ये व्यञ्जन स्वर और व्यञ्जन के बीच में हैं। इन्हें अर्ध-स्वर भी कहते हैं:

य (𑀬) र (𑀭) ल (𑀮) व (𑀯)

ये निरंतर ध्वनियाँ हैं, तुरंत नहीं रुकतीं।', NULL, NULL, NULL, NULL),
    
    -- य (Ya)
    (lesson7_id, 'pronunciation', 3, 'य (𑀬) - ya', '**तालव्य अर्ध-स्वर**

अंग्रेजी "yes" में "y" जैसा

**देवनागरी:** य
**ब्राह्मी:** 𑀬
**ध्वनि:** ya', 'य', NULL, NULL, NULL),
    
    (lesson7_id, 'writing_practice', 4, 'अभ्यास', 'य (𑀬) लिखें', 'य', NULL, NULL, '{"brahmi": "𑀬"}'),
    
    -- र (Ra)
    (lesson7_id, 'pronunciation', 5, 'र (𑀭) - ra', '**मूर्धन्य अर्ध-स्वर**

स्पेनिश "pero" में "r" जैसा (जीभ थोड़ी मुड़ी)

**देवनागरी:** र
**ब्राह्मी:** 𑀭
**ध्वनि:** ra', 'र', NULL, NULL, NULL),
    
    (lesson7_id, 'writing_practice', 6, 'अभ्यास', 'र (𑀭) लिखें', 'र', NULL, NULL, '{"brahmi": "𑀭"}'),
    
    -- ल (La)
    (lesson7_id, 'pronunciation', 7, 'ल (𑀮) - la', '**दन्त्य अर्ध-स्वर**

अंग्रेजी "love" में "l" जैसा

**देवनागरी:** ल
**ब्राह्मी:** 𑀮
**ध्वनि:** la', 'ल', NULL, NULL, NULL),
    
    (lesson7_id, 'writing_practice', 8, 'अभ्यास', 'ल (𑀮) लिखें', 'ल', NULL, NULL, '{"brahmi": "𑀮"}'),
    
    -- व (Va)
    (lesson7_id, 'pronunciation', 9, 'व (𑀯) - va', '**ओष्ठ्य-दन्त्य अर्ध-स्वर**

अंग्रेजी "vine" में "v" जैसा

**देवनागरी:** व
**ब्राह्मी:** 𑀯
**ध्वनि:** va', 'व', NULL, NULL, NULL),
    
    (lesson7_id, 'writing_practice', 10, 'अभ्यास', 'व (𑀯) लिखें', 'व', NULL, NULL, '{"brahmi": "𑀯"}'),
    
    (lesson7_id, 'examples', 11, 'शब्द उदाहरण', '**य** - योग (yoga) - योग
**र** - रस (rasa) - रस
**ल** - लता (latā) - बेल
**व** - वन (vana) - जंगल', NULL, NULL, NULL, NULL),
    
    (lesson7_id, 'key_points', 12, 'अन्तःस्थ की विशेषताएँ', '• स्वर और व्यञ्जन के बीच
• निरंतर ध्वनियाँ
• सभी घोष (स्वर तंत्रियों के साथ)
• संयुक्ताक्षर में बहुत उपयोगी
• बहुत सामान्य व्यञ्जन', NULL, NULL, NULL, NULL),
    
    (lesson7_id, 'mcq', 13, 'कौन सा अन्तःस्थ व्यञ्जन तालव्य है?', NULL, NULL, '["य", "र", "ल", "व"]', 'य', NULL),
    
    (lesson7_id, 'summary', 14, 'अन्तःस्थ पूर्ण! 🎉', 'आपने सीखा:
• चारों अन्तःस्थ व्यञ्जन
• अर्ध-स्वर की अवधारणा
• निरंतर ध्वनियाँ
• लेखन का अभ्यास

अंतिम पाठ: ऊष्म व्यञ्जन!', NULL, NULL, NULL, NULL);

    -- ==========================================
    -- LESSON 8: Ushma (ऊष्म)
    -- ==========================================
    
    INSERT INTO vyanjan_lesson_content (lesson_id, content_type, content_order, title, content, character, options, correct_answer, metadata) VALUES
    (lesson8_id, 'title_slide', 1, 'ऊष्म व्यञ्जन', 'सिसकारी की ध्वनियाँ', NULL, NULL, NULL, NULL),
    
    (lesson8_id, 'consonant_intro', 2, 'ऊष्म व्यञ्जन', 'ये व्यञ्जन घर्षण से बनती सिसकारी की ध्वनियाँ हैं:

श (𑀰) ष (𑀱) स (𑀲) ह (𑀳)

हवा संकरी जगह से निकलती है, घर्षण पैदा करती है।', NULL, NULL, NULL, NULL),
    
    -- श (Sha)
    (lesson8_id, 'pronunciation', 3, 'श (𑀰) - śa', '**तालव्य ऊष्म**

अंग्रेजी "shine" में "sh" जैसा

**देवनागरी:** श
**ब्राह्मी:** 𑀰
**ध्वनि:** śa (तालव्य)', 'श', NULL, NULL, NULL),
    
    (lesson8_id, 'writing_practice', 4, 'अभ्यास', 'श (𑀰) लिखें', 'श', NULL, NULL, '{"brahmi": "𑀰"}'),
    
    -- ष (Sha)
    (lesson8_id, 'pronunciation', 5, 'ष (𑀱) - ṣa', '**मूर्धन्य ऊष्म**

श जैसा लेकिन जीभ थोड़ी मुड़ी हुई

**देवनागरी:** ष
**ब्राह्मी:** 𑀱
**ध्वनि:** ṣa (मूर्धन्य)', 'ष', NULL, NULL, NULL),
    
    (lesson8_id, 'writing_practice', 6, 'अभ्यास', 'ष (𑀱) लिखें', 'ष', NULL, NULL, '{"brahmi": "𑀱"}'),
    
    -- स (Sa)
    (lesson8_id, 'pronunciation', 7, 'स (𑀲) - sa', '**दन्त्य ऊष्म**

अंग्रेजी "sun" में "s" जैसा

**देवनागरी:** स
**ब्राह्मी:** 𑀲
**ध्वनि:** sa (दन्त्य)', 'स', NULL, NULL, NULL),
    
    (lesson8_id, 'writing_practice', 8, 'अभ्यास', 'स (𑀲) लिखें', 'स', NULL, NULL, '{"brahmi": "𑀲"}'),
    
    -- ह (Ha)
    (lesson8_id, 'pronunciation', 9, 'ह (𑀳) - ha', '**कण्ठ्य ऊष्म (घोष)**

अंग्रेजी "house" में "h" जैसा

**देवनागरी:** ह
**ब्राह्मी:** 𑀳
**ध्वनि:** ha (घोष)', 'ह', NULL, NULL, NULL),
    
    (lesson8_id, 'writing_practice', 10, 'अभ्यास', 'ह (𑀳) लिखें', 'ह', NULL, NULL, '{"brahmi": "𑀳"}'),
    
    (lesson8_id, 'examples', 11, 'शब्द उदाहरण', '**श** - शान्ति (śānti) - शांति
**ष** - षट् (ṣaṭ) - छह
**स** - सूर्य (sūrya) - सूर्य
**ह** - हस्त (hasta) - हाथ', NULL, NULL, NULL, NULL),
    
    (lesson8_id, 'comparison', 12, 'तीनों "श" ध्वनियाँ', '**श (तालव्य):** तालु से
जैसे "shine" - श

**ष (मूर्धन्य):** जीभ मुड़ी
षड् में जैसा - ष

**स (दन्त्य):** दाँतों से
जैसे "sun" - स

तीनों अलग हैं, लेकिन सब सिसकारी हैं!', NULL, NULL, NULL, NULL),
    
    (lesson8_id, 'mcq', 13, 'कौन सा ऊष्म व्यञ्जन घोष है?', NULL, NULL, '["श", "ष", "स", "ह"]', 'ह', NULL),
    
    (lesson8_id, 'summary', 14, 'सभी 33 व्यञ्जन पूर्ण! 🎊', 'बधाई हो! आपने सीखा:

**5 वर्ग (25 व्यञ्जन):**
• क वर्ग (कण्ठ्य) - 5
• च वर्ग (तालव्य) - 5
• ट वर्ग (मूर्धन्य) - 5
• त वर्ग (दन्त्य) - 5
• प वर्ग (ओष्ठ्य) - 5

**अन्तःस्थ (4):** य, र, ल, व

**ऊष्म (4):** श, ष, स, ह

अब आप सभी ब्राह्मी व्यञ्जन जानते हैं! 🎉', NULL, NULL, NULL, NULL);

END $$;
