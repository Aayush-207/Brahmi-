import hindiIntro from './hindi/introduction.json';
import hindiVyanjan from './hindi/vyanjan.json';
import hindiMatras from './hindi/matras.json';

import englishIntro from './english/introduction.json';
import englishVyanjan from './english/vyanjan.json';
import englishMatras from './english/matras.json';

import kannadaIntro from './kannada/introduction.json';
import kannadaVyanjan from './kannada/vyanjan.json';

type LanguageKey = 'hindi' | 'english' | 'kannada';

const supportedLanguages: LanguageKey[] = ['hindi', 'english', 'kannada'];

function buildSwarData(language: LanguageKey) {
  const isHindi = language === 'hindi';
  const isEnglish = language === 'english';

  const titleMap = {
    hindi: {
      moduleTitle: 'स्वर',
      displayTitle: 'स्वर',
      practiceTimeTitle: 'अभ्यास समय',
      group1: 'अ आ इ ई',
      group2: 'उ ऊ ए ऐ',
      group3: 'ओ औ अं अः',
      practicePrompt: 'क्या अब आप मेरे साथ अभ्यास करना चाहेंगे?',
      yes: 'हां',
      no: 'नहीं',
      gameTitle: 'गेम टाइम',
      direction1: 'देवनागरी → ब्राह्मी',
      direction2: 'ब्राह्मी → देवनागरी',
      reverseIntro: 'चलिए अब हम उल्टा गेम खेलते हैं।',
      writingIntro: 'आइए! अब लिखने का अभ्यास करते हैं।',
      writingCheck: 'क्या आप मुझे लिखने के लिए उत्साहित हैं?',
      feedback: 'आप मुझे फीडबैक दे सकते हैं और हाँ, मुझे निष्पक्ष फीडबैक ही दीजिएगा।',
      trueFalseLabel: 'सही / गलत',
      trueFalseQuestion: '"ब्राह्मी एक भाषा है?"',
      stage4Header: 'स्वर अभ्यास – देवनागरी → ब्राह्मी / सत्य/असत्य चुनिए',
      stage4Share: 'अपनी जीत को साझा करें/डाउनलोड करें',
      chooseQuestion: 'अब आपके ऊपर है, क्या सीखना चाहते हैं?',
      optionA: 'मात्रा चिह्न',
      optionB: 'व्यञ्जन',
      reward5Title: '"श्रेष्ठ ज्ञानी"',
      reward5Label: 'सन्देश :'
    },
    english: {
      moduleTitle: 'Vowels',
      displayTitle: 'Vowels',
      practiceTimeTitle: 'Practice Time',
      group1: 'a aa i ee',
      group2: 'u oo e ai',
      group3: 'o au am ah',
      practicePrompt: 'Would you now like to practice with me?',
      yes: 'Yes',
      no: 'No',
      gameTitle: 'Game Time',
      direction1: 'Roman/Latin → Brahmi',
      direction2: 'Brahmi → roman/latin',
      reverseIntro: 'Now let us play the reverse game.',
      writingIntro: 'Come! Now let us practice writing.',
      writingCheck: 'Are you excited to write me?',
      feedback: 'You can give me feedback, and yes, please give me honest and unbiased feedback.',
      trueFalseLabel: 'True / False',
      trueFalseQuestion: '"Is Brahmi a language?"',
      stage4Header: 'Vowel Practice – roman/latin → Brahmi / Choose True/False',
      stage4Share: 'Share/Download your achievement',
      chooseQuestion: 'Now it is up to you, what do you want to learn?',
      optionA: 'Vowel Signs (Matra)',
      optionB: 'Consonants',
      reward5Title: '"Excellent Scholar"',
      reward5Label: 'Message:'
    },
    kannada: {
      moduleTitle: 'ಸ್ವರಗಳು',
      displayTitle: 'ಸ್ವರಗಳು',
      practiceTimeTitle: 'ಅಭ್ಯಾಸ ಸಮಯ',
      group1: 'ಅ ಆ ಇ ಈ',
      group2: 'ಉ ಊ ಏ ಐ',
      group3: 'ಒ ಔ ಅಂ ಅಃ',
      practicePrompt: 'ಈಗ ನೀವು ನನ್ನೊಂದಿಗೆ ಅಭ್ಯಾಸ ಮಾಡಲು ಇಚ್ಛಿಸುತ್ತೀರಾ?',
      yes: 'ಹೌದು',
      no: 'ಇಲ್ಲ',
      gameTitle: 'ಆಟದ ಸಮಯ',
      direction1: 'ಕನ್ನಡ → ಬ್ರಾಹ್ಮೀ',
      direction2: 'ಬ್ರಾಹ್ಮೀ → ಕನ್ನಡ',
      reverseIntro: 'ಈಗ ನಾವು ವಿರುದ್ಧ ಆಟವನ್ನು ಆಡೋಣ.',
      writingIntro: 'ಬನ್ನಿ! ಈಗ ಬರೆಯುವ ಅಭ್ಯಾಸ ಮಾಡೋಣ.',
      writingCheck: 'ನನ್ನನ್ನು ಬರೆಯಲು ನೀವು ಉತ್ಸುಕರಾಗಿದ್ದೀರಾ?',
      feedback: 'ನೀವು ನನಗೆ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಬಹುದು, ಹೌದು, ದಯವಿಟ್ಟು ನಿಷ್ಪಕ್ಷಪಾತ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನೇ ನೀಡಿ.',
      trueFalseLabel: 'ಸರಿ ತಪ್ಪು',
      trueFalseQuestion: '"ಬ್ರಾಹ್ಮೀ ಒಂದು ಭಾಷೆಯೇ?"',
      stage4Header: 'ಸ್ವರ ಅಭ್ಯಾಸ – ಕನ್ನಡ → ಬ್ರಾಹ್ಮೀ / ಸರಿ/ತಪ್ಪು ಆಯ್ಕೆಮಾಡಿ',
      stage4Share: 'ನಿಮ್ಮ ಸಾಧನೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ/ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
      chooseQuestion: 'ಈಗ ನಿಮ್ಮ ಮೇಲೆ ಇದೆ, ನೀವು ಏನು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ?',
      optionA: 'ಮಾತ್ರಾ ಚಿಹ್ನೆಗಳು',
      optionB: 'ವ್ಯಂಜನಗಳು',
      reward5Title: '"ಶ್ರೇಷ್ಠ ಜ್ಞಾನಿ"',
      reward5Label: 'ಸಂದೇಶ:'
    }
  }[language];

  const vowelRows = [
    ['अ', '𑀅', 'a', 'अ', 'a', 'ಅ', 'अ', 'ಅ'],
    ['आ', '𑀆', 'aa', 'आ', 'aa', 'ಆ', 'आ', 'ಆ'],
    ['इ', '𑀇', 'i', 'इ', 'i', 'ಇ', 'ಇ', 'ಇ'],
    ['ई', '𑀈', 'ee', 'ई', 'ee', 'ಈ', 'ಈ', 'ಈ'],
    ['उ', '𑀉', 'u', 'उ', 'u', 'ಉ', 'ಉ', 'ಉ'],
    ['ऊ', '𑀊', 'oo', 'ऊ', 'oo', 'ಊ', 'ಊ', 'ಊ'],
    ['ए', '𑀏', 'e', 'ए', 'e', 'ಏ', 'ಏ', 'ಏ'],
    ['ऐ', '𑀐', 'ai', 'ऐ', 'ai', 'ಐ', 'ಐ', 'ಐ'],
    ['ओ', '𑀑', 'o', 'ओ', 'o', 'ಒ', 'ಒ', 'ಒ'],
    ['औ', '𑀒', 'au', 'औ', 'au', 'ಔ', 'ಔ', 'ಔ'],
    ['अं', '𑀅𑀁', 'am', 'अं', 'am', 'ಅಂ', 'ಅಂ', 'ಅಂ'],
    ['अः', '𑀅𑀂', 'ah', 'अः', 'ah', 'ಅಃ', 'ಅಃ', 'ಅಃ']
  ] as const;

  const vowels = vowelRows.map((row, index) => ({
    id: `swar-${String(index + 1).padStart(3, '0')}`,
    order: index + 1,
    devanagari: row[0],
    brahmi: row[1],
    unicode_codepoint: index < 10 ? `U+1100${index + 5}` : index === 10 ? 'U+11005 + U+11040' : 'U+11005 + U+11002',
    romanized: row[2],
    matra_sign: null,
    matra_unicode: null,
    matra_position: 'none' as const,
    title_hindi: row[3],
    title_english: row[4],
    title_kannada: row[5],
    description_hindi: '',
    description_english: '',
    description_kannada: '',
    pronunciation: row[2],
    pronunciation_kannada: row[5],
    englishName: language === 'english' ? row[4] : '',
    matra_position_label: ''
  }));

  const practiceVowel: any = {
    id: 'practice-time',
    order: 13,
    devanagari: titleMap.practiceTimeTitle,
    brahmi: '▶',
    unicode_codepoint: '',
    romanized: 'practice',
    matra_sign: null,
    matra_unicode: null,
    matra_position: 'none',
    title_hindi: titleMap.practiceTimeTitle,
    title_english: titleMap.practiceTimeTitle,
    title_kannada: titleMap.practiceTimeTitle,
    description_hindi: titleMap.practiceTimeTitle,
    description_english: titleMap.practiceTimeTitle,
    description_kannada: titleMap.practiceTimeTitle,
    pronunciation: titleMap.practiceTimeTitle,
    pronunciation_kannada: titleMap.practiceTimeTitle,
    englishName: titleMap.practiceTimeTitle,
    matra_position_label: ''
  };

  vowels.push(practiceVowel);

  return {
    module_title: titleMap.moduleTitle,
    vowels,
    quiz1_devanagari_to_brahmi: [
      { id: 'quiz1-001', order: 1, question: 'अ', question_type: 'devanagari_to_brahmi', correct_answer: '𑀅', correct_vowel_id: 'swar-001', wrong_options: [{ id: 'wrong-001-a', brahmi: '𑀆', vowel_id: 'swar-002' }, { id: 'wrong-001-b', brahmi: '𑀇', vowel_id: 'swar-003' }, { id: 'wrong-001-c', brahmi: '𑀉', vowel_id: 'swar-005' }], title_hindi: 'अ का ब्राह्मी चिह्न क्या है?', title_english: 'What is the Brahmi symbol for a?' },
      { id: 'quiz1-002', order: 2, question: 'आ', question_type: 'devanagari_to_brahmi', correct_answer: '𑀆', correct_vowel_id: 'swar-002', wrong_options: [{ id: 'wrong-002-a', brahmi: '𑀐', vowel_id: 'swar-008' }, { id: 'wrong-002-b', brahmi: '𑀏', vowel_id: 'swar-007' }, { id: 'wrong-002-c', brahmi: '𑀊', vowel_id: 'swar-006' }], title_hindi: 'आ का ब्राह्मी चिह्न क्या है?', title_english: 'What is the Brahmi symbol for aa?' },
      { id: 'quiz1-003', order: 3, question: 'इ', question_type: 'devanagari_to_brahmi', correct_answer: '𑀇', correct_vowel_id: 'swar-003', wrong_options: [{ id: 'wrong-003-a', brahmi: '𑀑', vowel_id: 'swar-009' }, { id: 'wrong-003-b', brahmi: '𑀉', vowel_id: 'swar-005' }, { id: 'wrong-003-c', brahmi: '𑀅', vowel_id: 'swar-001' }], title_hindi: 'इ का ब्राह्मी चिह्न क्या है?', title_english: 'What is the Brahmi symbol for i?' },
      { id: 'quiz1-004', order: 4, question: 'ई', question_type: 'devanagari_to_brahmi', correct_answer: '𑀈', correct_vowel_id: 'swar-004', wrong_options: [{ id: 'wrong-004-a', brahmi: '𑀐', vowel_id: 'swar-008' }, { id: 'wrong-004-b', brahmi: '𑀊', vowel_id: 'swar-006' }, { id: 'wrong-004-c', brahmi: '𑀒', vowel_id: 'swar-010' }], title_hindi: 'ई का ब्राह्मी चिह्न क्या है?', title_english: 'What is the Brahmi symbol for ee?' },
      { id: 'quiz1-005', order: 5, question: 'उ', question_type: 'devanagari_to_brahmi', correct_answer: '𑀉', correct_vowel_id: 'swar-005', wrong_options: [{ id: 'wrong-005-a', brahmi: '𑀒', vowel_id: 'swar-010' }, { id: 'wrong-005-b', brahmi: '𑀏', vowel_id: 'swar-007' }, { id: 'wrong-005-c', brahmi: '𑀈', vowel_id: 'swar-004' }], title_hindi: 'उ का ब्राह्मी चिह्न क्या है?', title_english: 'What is the Brahmi symbol for u?' },
      { id: 'quiz1-006', order: 6, question: 'ऊ', question_type: 'devanagari_to_brahmi', correct_answer: '𑀊', correct_vowel_id: 'swar-006', wrong_options: [{ id: 'wrong-006-a', brahmi: '𑀐', vowel_id: 'swar-008' }, { id: 'wrong-006-b', brahmi: '𑀅', vowel_id: 'swar-001' }, { id: 'wrong-006-c', brahmi: '𑀈', vowel_id: 'swar-004' }], title_hindi: 'ऊ का ब्राह्मी चिह्न क्या है?', title_english: 'What is the Brahmi symbol for oo?' },
      { id: 'quiz1-007', order: 7, question: 'ए', question_type: 'devanagari_to_brahmi', correct_answer: '𑀏', correct_vowel_id: 'swar-007', wrong_options: [{ id: 'wrong-007-a', brahmi: '𑀈', vowel_id: 'swar-004' }, { id: 'wrong-007-b', brahmi: '𑀅', vowel_id: 'swar-001' }, { id: 'wrong-007-c', brahmi: '𑀆', vowel_id: 'swar-002' }], title_hindi: 'ए का ब्राह्मी चिह्न क्या है?', title_english: 'What is the Brahmi symbol for e?' },
      { id: 'quiz1-008', order: 8, question: 'ऐ', question_type: 'devanagari_to_brahmi', correct_answer: '𑀐', correct_vowel_id: 'swar-008', wrong_options: [{ id: 'wrong-008-a', brahmi: '𑀒', vowel_id: 'swar-010' }, { id: 'wrong-008-b', brahmi: '𑀉', vowel_id: 'swar-005' }, { id: 'wrong-008-c', brahmi: '𑀑', vowel_id: 'swar-009' }], title_hindi: 'ऐ का ब्राह्मी चिह्न क्या है?', title_english: 'What is the Brahmi symbol for ai?' },
      { id: 'quiz1-009', order: 9, question: 'ओ', question_type: 'devanagari_to_brahmi', correct_answer: '𑀑', correct_vowel_id: 'swar-009', wrong_options: [{ id: 'wrong-009-a', brahmi: '𑀊', vowel_id: 'swar-006' }, { id: 'wrong-009-b', brahmi: '𑀏', vowel_id: 'swar-007' }, { id: 'wrong-009-c', brahmi: '𑀈', vowel_id: 'swar-004' }], title_hindi: 'ओ का ब्राह्मी चिह्न क्या है?', title_english: 'What is the Brahmi symbol for o?' },
      { id: 'quiz1-010', order: 10, question: 'औ', question_type: 'devanagari_to_brahmi', correct_answer: '𑀒', correct_vowel_id: 'swar-010', wrong_options: [{ id: 'wrong-010-a', brahmi: '𑀉', vowel_id: 'swar-005' }, { id: 'wrong-010-b', brahmi: '𑀐', vowel_id: 'swar-008' }, { id: 'wrong-010-c', brahmi: '𑀇', vowel_id: 'swar-003' }], title_hindi: 'औ का ब्राह्मी चिह्न क्या है?', title_english: 'What is the Brahmi symbol for au?' },
      { id: 'quiz1-011', order: 11, question: 'अं', question_type: 'devanagari_to_brahmi', correct_answer: '𑀅𑀁', correct_vowel_id: 'swar-011', wrong_options: [{ id: 'wrong-011-a', brahmi: '𑀆', vowel_id: 'swar-002' }, { id: 'wrong-011-b', brahmi: '𑀒', vowel_id: 'swar-010' }, { id: 'wrong-011-c', brahmi: '𑀈', vowel_id: 'swar-004' }], title_hindi: 'अं का ब्राह्मी चिह्न क्या है? (अनुस्वार)', title_english: 'What is the Brahmi symbol for am? (Anusvara)', note: 'anusvara' },
      { id: 'quiz1-012', order: 12, question: 'अः', question_type: 'devanagari_to_brahmi', correct_answer: '𑀅𑀂', correct_vowel_id: 'swar-012', wrong_options: [{ id: 'wrong-012-a', brahmi: '𑀏', vowel_id: 'swar-007' }, { id: 'wrong-012-b', brahmi: '𑀑', vowel_id: 'swar-009' }, { id: 'wrong-012-c', brahmi: '𑀉', vowel_id: 'swar-005' }], title_hindi: 'अः का ब्राह्मी चिह्न क्या है? (विसर्ग)', title_english: 'What is the Brahmi symbol for ah? (Visarga)', note: 'visarga' }
    ],
    quiz2_brahmi_to_devanagari: [
      { id: 'quiz2-001', order: 1, question: '𑀅', question_type: 'brahmi_to_devanagari', correct_answer: 'अ', correct_vowel_id: 'swar-001', wrong_options: [{ id: 'wrong-quiz2-001-a', devanagari: 'ओ', vowel_id: 'swar-009' }, { id: 'wrong-quiz2-001-b', devanagari: 'इ', vowel_id: 'swar-003' }, { id: 'wrong-quiz2-001-c', devanagari: 'उ', vowel_id: 'swar-005' }], title_hindi: '𑀅 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀅?' },
      { id: 'quiz2-002', order: 2, question: '𑀆', question_type: 'brahmi_to_devanagari', correct_answer: 'आ', correct_vowel_id: 'swar-002', wrong_options: [{ id: 'wrong-quiz2-002-a', devanagari: 'अ', vowel_id: 'swar-001' }, { id: 'wrong-quiz2-002-b', devanagari: 'ई', vowel_id: 'swar-004' }, { id: 'wrong-quiz2-002-c', devanagari: 'ओ', vowel_id: 'swar-009' }], title_hindi: '𑀆 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀆?' },
      { id: 'quiz2-003', order: 3, question: '𑀇', question_type: 'brahmi_to_devanagari', correct_answer: 'इ', correct_vowel_id: 'swar-003', wrong_options: [{ id: 'wrong-quiz2-003-a', devanagari: 'ऊ', vowel_id: 'swar-006' }, { id: 'wrong-quiz2-003-b', devanagari: 'ए', vowel_id: 'swar-007' }, { id: 'wrong-quiz2-003-c', devanagari: 'ऐ', vowel_id: 'swar-008' }], title_hindi: '𑀇 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀇?' },
      { id: 'quiz2-004', order: 4, question: '𑀈', question_type: 'brahmi_to_devanagari', correct_answer: 'ई', correct_vowel_id: 'swar-004', wrong_options: [{ id: 'wrong-quiz2-004-a', devanagari: 'ए', vowel_id: 'swar-007' }, { id: 'wrong-quiz2-004-b', devanagari: 'अ', vowel_id: 'swar-001' }, { id: 'wrong-quiz2-004-c', devanagari: 'ओ', vowel_id: 'swar-009' }], title_hindi: '𑀈 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀈?' },
      { id: 'quiz2-005', order: 5, question: '𑀉', question_type: 'brahmi_to_devanagari', correct_answer: 'उ', correct_vowel_id: 'swar-005', wrong_options: [{ id: 'wrong-quiz2-005-a', devanagari: 'इ', vowel_id: 'swar-003' }, { id: 'wrong-quiz2-005-b', devanagari: 'ओ', vowel_id: 'swar-009' }, { id: 'wrong-quiz2-005-c', devanagari: 'अः', vowel_id: 'swar-012' }], title_hindi: '𑀉 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀉?' },
      { id: 'quiz2-006', order: 6, question: '𑀊', question_type: 'brahmi_to_devanagari', correct_answer: 'ऊ', correct_vowel_id: 'swar-006', wrong_options: [{ id: 'wrong-quiz2-006-a', devanagari: 'ऐ', vowel_id: 'swar-008' }, { id: 'wrong-quiz2-006-b', devanagari: 'अ', vowel_id: 'swar-001' }, { id: 'wrong-quiz2-006-c', devanagari: 'ए', vowel_id: 'swar-007' }], title_hindi: '𑀊 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀊?' },
      { id: 'quiz2-007', order: 7, question: '𑀏', question_type: 'brahmi_to_devanagari', correct_answer: 'ए', correct_vowel_id: 'swar-007', wrong_options: [{ id: 'wrong-quiz2-007-a', devanagari: 'ओ', vowel_id: 'swar-009' }, { id: 'wrong-quiz2-007-b', devanagari: 'अ', vowel_id: 'swar-001' }, { id: 'wrong-quiz2-007-c', devanagari: 'अः', vowel_id: 'swar-012' }], title_hindi: '𑀏 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀏?' },
      { id: 'quiz2-008', order: 8, question: '𑀐', question_type: 'brahmi_to_devanagari', correct_answer: 'ऐ', correct_vowel_id: 'swar-008', wrong_options: [{ id: 'wrong-quiz2-008-a', devanagari: 'ए', vowel_id: 'swar-007' }, { id: 'wrong-quiz2-008-b', devanagari: 'ऊ', vowel_id: 'swar-006' }, { id: 'wrong-quiz2-008-c', devanagari: 'उ', vowel_id: 'swar-005' }], title_hindi: '𑀐 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀐?' },
      { id: 'quiz2-009', order: 9, question: '𑀑', question_type: 'brahmi_to_devanagari', correct_answer: 'ओ', correct_vowel_id: 'swar-009', wrong_options: [{ id: 'wrong-quiz2-009-a', devanagari: 'औ', vowel_id: 'swar-010' }, { id: 'wrong-quiz2-009-b', devanagari: 'अः', vowel_id: 'swar-012' }, { id: 'wrong-quiz2-009-c', devanagari: 'ओ', vowel_id: 'swar-009' }], title_hindi: '𑀑 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀑?' },
      { id: 'quiz2-010', order: 10, question: '𑀒', question_type: 'brahmi_to_devanagari', correct_answer: 'औ', correct_vowel_id: 'swar-010', wrong_options: [{ id: 'wrong-quiz2-010-a', devanagari: 'ओ', vowel_id: 'swar-009' }, { id: 'wrong-quiz2-010-b', devanagari: 'अ', vowel_id: 'swar-001' }, { id: 'wrong-quiz2-010-c', devanagari: 'अं', vowel_id: 'swar-011' }], title_hindi: '𑀒 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀒?' },
      { id: 'quiz2-011', order: 11, question: '𑀅𑀁', question_type: 'brahmi_to_devanagari', correct_answer: 'अं', correct_vowel_id: 'swar-011', wrong_options: [{ id: 'wrong-quiz2-011-a', devanagari: 'अः', vowel_id: 'swar-012' }, { id: 'wrong-quiz2-011-b', devanagari: 'ओ', vowel_id: 'swar-009' }, { id: 'wrong-quiz2-011-c', devanagari: 'उ', vowel_id: 'swar-005' }], title_hindi: '𑀅𑀁 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀅𑀁?' },
      { id: 'quiz2-012', order: 12, question: '𑀅𑀂', question_type: 'brahmi_to_devanagari', correct_answer: 'अः', correct_vowel_id: 'swar-012', wrong_options: [{ id: 'wrong-quiz2-012-a', devanagari: 'अं', vowel_id: 'swar-011' }, { id: 'wrong-quiz2-012-b', devanagari: 'ए', vowel_id: 'swar-007' }, { id: 'wrong-quiz2-012-c', devanagari: 'ई', vowel_id: 'swar-004' }], title_hindi: '𑀅𑀂 का देवनागरी चिह्न क्या है?', title_english: 'What is the Devanagari symbol for 𑀅𑀂?' }
    ],
    tracing_sequence: vowelRows.map((row, index) => ({
      id: `trace-${String(index + 1).padStart(3, '0')}`,
      order: index + 1,
      devanagari: row[0],
      brahmi: row[1],
      vowel_id: `swar-${String(index + 1).padStart(3, '0')}`,
      title_hindi: row[0],
      title_english: row[4],
      title_kannada: row[5],
      instruction_hindi: row[0],
      instruction_english: row[4],
      instruction_kannada: row[5]
    })),
    true_false_questions: [
      { id: 'tf-001', order: 1, question: '"अ" का चिह्न [𑀅] है?', correct_answer: true, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-002', order: 2, question: '"आ" का चिह्न [𑀇] है?', correct_answer: false, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-003', order: 3, question: '"इ" का चिह्न [𑀆] है?', correct_answer: false, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-004', order: 4, question: '"ई" का चिह्न [𑀈] है?', correct_answer: true, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-005', order: 5, question: '"उ" का चिह्न [𑀊] है?', correct_answer: false, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-006', order: 6, question: '"ऊ" का चिह्न [𑀐] है?', correct_answer: false, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-007', order: 7, question: '"ए" का चिह्न [𑀏] है?', correct_answer: true, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-008', order: 8, question: '"ऐ" का चिह्न [𑀐] है?', correct_answer: true, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-009', order: 9, question: '"ओ" का चिह्न [𑀊] है?', correct_answer: false, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-010', order: 10, question: '"औ" का चिह्न [𑀈] है?', correct_answer: false, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-011', order: 11, question: '"अं" का चिह्न [𑀅𑀁] है?', correct_answer: true, title_hindi: 'सही / गलत', title_english: 'True / False' },
      { id: 'tf-012', order: 12, question: '"अः" का चिह्न [𑀅𑀂] है?', correct_answer: true, title_hindi: 'सही / गलत', title_english: 'True / False' }
    ],
    rewards: [
      { id: 'reward-1', order: 1, title_hindi: 'पुरस्कार : 1', title_english: 'Reward: 1', badge_description_hindi: 'आपने पहला चरण सफलता-पूर्वक पूरा किया। "सम्यक् प्रज्ञा सम्मान" अब आपका है।', badge_description_english: 'You have successfully completed the first stage. "Samyak Pragya Award" is now yours.' },
      { id: 'reward-2', order: 2, title_hindi: 'पुरस्कार : 2', title_english: 'Reward: 2', badge_description_hindi: 'आपने दूसरा चरण पूरा किया – शानदार! आपने एक और मील का पत्थर पार किया "लिपि आस्था सम्मान" अब आपका है।', badge_description_english: 'You have completed the second stage – Excellent! You have achieved another milestone. "Lipi Aastha Samman" is now yours.' },
      { id: 'reward-3', order: 3, title_hindi: 'पुरस्कार : 3', title_english: 'Reward: 3', badge_description_hindi: 'आपने तीसरा चरण पूरा किया – बढ़िया! आपका आत्मविश्वास प्रशंसनीय है, आपने "अक्षर साधना" का सम्मान प्राप्त किया।', badge_description_english: 'You have completed the third stage – Excellent! Your confidence is admirable, You have earned the "Akshar Sadhana" award.' },
      { id: 'reward-4', order: 4, title_hindi: 'पुरस्कार : 4', title_english: 'Reward: 4', badge_description_hindi: 'आपने चौथा चरण पूरा किया', badge_description_english: 'You have completed the fourth stage' },
      { id: 'reward-5', order: 5, title_hindi: '"श्रेष्ठ ज्ञानी"', title_english: '"Excellent Scholar"', badge_description_hindi: 'आपका पुरस्कार : 5 पॉइंट्स + "श्रेष्ठ ज्ञानी" सम्मान / यह सम्मान आपके तेज दिमाग़ और सही निर्णय का प्रमाण है।', badge_description_english: 'Your Reward: 5 Points + "Excellent Scholar" Title / This honor is a proof of your sharp mind and correct decision.' }
    ],
    practice_time: {
      title_hindi: 'अभ्यास समय',
      title_english: 'Practice Time',
      title_kannada: 'ಅಭ್ಯಾಸ ಸಮಯ',
      sections: {
        section_4_game_time: {
          game_title_hindi: 'गेम टाइम',
          game_title_english: 'Game Time',
          game_title_kannada: 'ಆಟದ ಸಮಯ',
          direction_hindi: 'देवनागरी → ब्राह्मी',
          direction_english: 'Roman/Latin → Brahmi',
          direction_kannada: 'ಕನ್ನಡ → ಬ್ರಾಹ್ಮೀ'
        },
        section_5_quiz1_native_to_brahmi: {
          title_hindi: 'देवनागरी → ब्राह्मी',
          title_english: 'Native Script → Brahmi',
          title_kannada: 'ಸ್ಥಾನಿಕ ಲಿಪಿ → ಬ್ರಾಹ್ಮೀ',
          questions: [
            { order: 1, question_hindi: 'अ', question_english: 'a', question_kannada: 'ಅ', correct_answer: '𑀅' },
            { order: 2, question_hindi: 'आ', question_english: 'aa', question_kannada: 'ಆ', correct_answer: '𑀆' },
            { order: 3, question_hindi: 'इ', question_english: 'i', question_kannada: 'ಇ', correct_answer: '𑀇' },
            { order: 4, question_hindi: 'ई', question_english: 'ee', question_kannada: 'ಈ', correct_answer: '𑀈' },
            { order: 5, question_hindi: 'उ', question_english: 'u', question_kannada: 'ಉ', correct_answer: '𑀉' },
            { order: 6, question_hindi: 'ऊ', question_english: 'oo', question_kannada: 'ಊ', correct_answer: '𑀊' },
            { order: 7, question_hindi: 'ए', question_english: 'e', question_kannada: 'ಏ', correct_answer: '𑀏' },
            { order: 8, question_hindi: 'ऐ', question_english: 'ai', question_kannada: 'ಐ', correct_answer: '𑀐' },
            { order: 9, question_hindi: 'ओ', question_english: 'o', question_kannada: 'ಒ', correct_answer: '𑀑' },
            { order: 10, question_hindi: 'औ', question_english: 'au', question_kannada: 'ಔ', correct_answer: '𑀒' },
            { order: 11, question_hindi: 'अं', question_english: 'am', question_kannada: 'ಅಂ', correct_answer: '𑀅𑀁' },
            { order: 12, question_hindi: 'अः', question_english: 'ah', question_kannada: 'ಅಃ', correct_answer: '𑀅𑀂' }
          ]
        },
        section_6_post_quiz1_encouragement: {
          title_hindi: 'हुर्रे!',
          title_english: 'Hurray!',
          title_kannada: 'ಹುರ್ರೆ!',
          message_hindi: 'आप वास्तविकता में विशेष जिज्ञासु और सीखने के इच्छुक हैं, तभी तो आप इस अनोखी यात्रा के इस पड़ाव तक पहुंच पाए हैं।',
          message_english: 'You are truly curious and eager to learn, that is why you have reached this stage of this unique journey.',
          message_kannada: 'ನೀವು ನಿಜವಾಗಿಯೂ ಕುತೂಹಲವುಳ್ಳವರು ಮತ್ತು ಕಲಿಯುವ ಆಸೆ ಹೊಂದಿದ್ದೀರಿ, ಆದ್ದರಿಂದಲೇ ನೀವು ಈ ಅನನ್ಯ ಪ್ರಯಾಣದ ಈ ಹಂತಕ್ಕೆ ಬಂದಿದ್ದೀರಿ。'
        },
        section_7_true_false_bonus: {
          label_hindi: 'सही / गलत',
          label_english: 'True / False',
          label_kannada: 'ಸರಿ ತಪ್ಪು',
          question_hindi: '"ब्राह्मी एक भाषा है?"',
          question_english: '"Is Brahmi a language?"',
          question_kannada: '"ಬ್ರಾಹ್ಮೀ ಒಂದು ಭಾಷೆಯೇ?"'
        },
        section_8_reward_1: {
          title_hindi: 'पुरस्कार : 1',
          title_english: 'Reward: 1',
          title_kannada: 'ಬಹುಮಾನ: 1'
        },
        section_9_quiz2_intro: {
          title_hindi: 'चलिए अब हम उल्टा गेम खेलते हैं।',
          title_english: 'Now let us play the reverse game.',
          title_kannada: 'ಈಗ ನಾವು ವಿರುದ್ಧ ಆಟವನ್ನು ಆಡೋಣ。'
        },
        section_10_quiz2_brahmi_to_native: {
          title_hindi: 'ब्राह्मी → देवनागरी',
          title_english: 'Brahmi → roman/latin',
          title_kannada: 'ಬ್ರಾಹ್ಮೀ → ಕನ್ನಡ'
        },
        section_11_reward_2: {
          title_hindi: 'पुरस्कार : 2',
          title_english: 'Reward: 2',
          title_kannada: 'ಬಹುಮಾನ: 2'
        },
        section_12_writing_practice_intro: {
          title_hindi: 'आइए! अब लिखने का अभ्यास करते हैं।',
          title_english: 'Come! Now let us practice writing.',
          title_kannada: 'ಬನ್ನಿ! ಈಗ ಬರೆಯುವ ಅಭ್ಯಾಸ ಮಾಡೋಣ。'
        },
        section_13_tracing_slides: {
          title_hindi: 'अ → 𑀅',
          title_english: 'a → 𑀅',
          title_kannada: 'ಅ → 𑀅'
        },
        section_14_reward_3: {
          title_hindi: 'पुरस्कार : 3',
          title_english: 'Reward: 3',
          title_kannada: 'ಬಹುಮಾನ: 3'
        },
        section_15_true_false_quiz_stage_4: {
          title_hindi: 'स्वर अभ्यास – देवनागरी → ब्राह्मी / सत्य/असत्य चुनिए',
          title_english: 'Vowel Practice – roman/latin → Brahmi / Choose True/False',
          title_kannada: 'ಸ್ವರ ಅಭ್ಯಾಸ – ಕನ್ನಡ → ಬ್ರಾಹ್ಮೀ / ಸರಿ/ತಪ್ಪು ಆಯ್ಕೆಮಾಡಿ'
        },
        section_16_reward_4: {
          title_hindi: 'पुरस्कार : 4',
          title_english: 'Reward: 4',
          title_kannada: 'ಬಹುಮಾನ: 4'
        },
        section_17_next_section_choice: {
          title_hindi: 'अब आपके ऊपर है, क्या सीखना चाहते हैं?',
          title_english: 'Now it is up to you, what do you want to learn?',
          title_kannada: 'ಈಗ ನಿಮ್ಮ ಮೇಲೆ ಇದೆ, ನೀವು ಏನು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ?'
        },
        section_18_reward_5: {
          title_hindi: '"श्रेष्ठ ज्ञानी"',
          title_english: '"Excellent Scholar"',
          title_kannada: '"ಶ್ರೇಷ್ಠ ಜ್ಞಾನಿ"'
        }
      }
    }
  };
}

const data: Record<LanguageKey, any> = {
  hindi: { introduction: hindiIntro, swar: buildSwarData('hindi'), vyanjan: hindiVyanjan, matras: hindiMatras },
  english: { introduction: englishIntro, swar: buildSwarData('english'), vyanjan: englishVyanjan, matras: englishMatras },
  kannada: { introduction: kannadaIntro, swar: buildSwarData('kannada'), vyanjan: kannadaVyanjan, matras: hindiMatras }
};

export const SUPPORTED_LANGUAGES = supportedLanguages;
export const DEFAULT_LANGUAGE: LanguageKey = 'hindi';

export function getDataForLanguage(lang: string) {
  let language = lang.toLowerCase();
  if (language === 'hi') language = 'hindi';
  if (language === 'en') language = 'english';
  if (language === 'kn') language = 'kannada';
  const finalLang = supportedLanguages.includes(language as LanguageKey) ? (language as LanguageKey) : DEFAULT_LANGUAGE;
  return data[finalLang];
}
