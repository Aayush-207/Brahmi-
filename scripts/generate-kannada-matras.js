const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'backend', 'data', 'english', 'matras.json');
const targetPath = path.join(root, 'backend', 'data', 'kannada', 'matras.json');

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const lessonTranslations = {
  1: {
    title: 'ಮಾತ್ರಾ (ಸ್ವರ ಚಿಹ್ನೆಗಳು) ಪರಿಚಯ',
    subtitle: 'ಮಾತ್ರಾ ಚಿಹ್ನೆಗಳ ಪರಿಚಯ',
    description: 'ಸ್ವರಗಳು ಸ್ವತಂತ್ರವಾಗಿ ಬರೆದಾಗ ತಮ್ಮದೇ ಆದ ವಿಶಿಷ್ಟ ಗುರುತನ್ನು ಹೊಂದಿರುತ್ತವೆ. ಆದರೆ ಅವು ವ್ಯಂಜನದೊಂದಿಗೆ ಸೇರಿದಾಗ, ಅವು ಮಾತ್ರಾ ಚಿಹ್ನೆಗಳು ಆಗುತ್ತವೆ.'
  },
  2: {
    title: 'ಅ - ಸ್ವಾಭಾವಿಕ ಸ್ವರ',
    subtitle: 'ಅ-ಧ್ವನಿ',
    description: 'ವ್ಯಂಜನವು ಒಂಟಿಯಾಗಿ ನಿಂತಾಗ, ಅದು ಸ್ವಾಭಾವಿಕ “ಅ” ಧ್ವನಿಯನ್ನು ಹೊಂದಿರುತ್ತದೆ.'
  },
  3: { title: 'ಆ - ಮಾತ್ರಾ ಚಿಹ್ನೆ', subtitle: 'ಆ-ಮಾತ್ರೆ', description: 'ಆ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.' },
  4: { title: 'ಇ - ಮಾತ್ರಾ ಚಿಹ್ನೆ', subtitle: 'ಇ-ಮಾತ್ರೆ', description: 'ಇ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ಮೊದಲು ಅಥವಾ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಬರೆಯಲಾಗುತ್ತದೆ.' },
  5: { title: 'ಈ - ಮಾತ್ರಾ ಚಿಹ್ನೆ', subtitle: 'ಈ-ಮಾತ್ರೆ', description: 'ಈ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.' },
  6: { title: 'ಉ - ಮಾತ್ರಾ ಚಿಹ್ನೆ', subtitle: 'ಉ-ಮಾತ್ರೆ', description: 'ಉ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ಕೆಳಗೆ ಬರೆಯಲಾಗುತ್ತದೆ.' },
  7: { title: 'ಊ - ಮಾತ್ರಾ ಚಿಹ್ನೆ', subtitle: 'ಊ-ಮಾತ್ರೆ', description: 'ಊ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ಕೆಳಗೆ ಬರೆಯಲಾಗುತ್ತದೆ.' },
  8: { title: 'ಎ - ಮಾತ್ರಾ ಚಿಹ್ನೆ', subtitle: 'ಎ-ಮಾತ್ರೆ', description: 'ಎ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.' },
  9: { title: 'ಐ - ಮಾತ್ರಾ ಚಿಹ್ನೆ', subtitle: 'ಐ-ಮಾತ್ರೆ', description: 'ಐ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.' },
  10: { title: 'ಒ - ಮಾತ್ರಾ ಚಿಹ್ನೆ', subtitle: 'ಒ-ಮಾತ್ರೆ', description: 'ಒ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.' },
  11: { title: 'ಔ - ಮಾತ್ರಾ ಚಿಹ್ನೆ', subtitle: 'ಔ-ಮಾತ್ರೆ', description: 'ಔ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.' },
  12: { title: 'ಅಂ - ಅನುಸ್ವಾರ', subtitle: 'ಅನುಸ್ವಾರ', description: 'ಅನುಸ್ವಾರ - ನಾಸಿಕ ಧ್ವನಿ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಬರೆಯಲಾಗುತ್ತದೆ.' },
  13: { title: 'ಅಃ - ವಿಶರ್ಗ', subtitle: 'ವಿಶರ್ಗ', description: 'ವಿಶರ್ಗ - ದ್ವಿತೀಯ ಉಚ್ಚಾರಣಾ ಧ್ವನಿ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.' }
};

const matraNames = {
  1: 'ಯಾವುದೂ ಇಲ್ಲ (ಅಂತರ್ನಿಹಿತ)',
  2: 'ಆ',
  3: 'ಇ',
  4: 'ಈ',
  5: 'ಉ',
  6: 'ಊ',
  7: 'ಎ',
  8: 'ಐ',
  9: 'ಒ',
  10: 'ಔ',
  11: 'ಅಂ',
  12: 'ಅಃ'
};

const matraPositionLabels = {
  none: 'ಯಾವುದೇ ಚಿಹ್ನೆಯಿಲ್ಲ — ಅಂತರ್ನಿಹಿತ ಸ್ವರ',
  after: 'ವ್ಯಂಜನದ ನಂತರ',
  before: 'ವ್ಯಂಜನದ ಮೊದಲು',
  below: 'ಕೆಳಗೆ',
  above: 'ಮೇಲೆ'
};

const vowelKannada = ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಎ', 'ಐ', 'ಒ', 'ಔ', 'ಅಂ', 'ಅಃ'];
const matraSignsKannada = ['', 'ಾ', 'ಿ', 'ೀ', 'ು', 'ೂ', 'ೆ', 'ೈ', 'ೊ', 'ೌ', 'ಂ', 'ಃ'];
const consonantsKannada = ['ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ', 'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ'];

function transliterateDevanagariToKannada(text) {
  if (typeof text !== 'string' || !text) return text;
  const map = {
    'अ': 'ಅ', 'आ': 'ಆ', 'इ': 'ಇ', 'ई': 'ಈ', 'उ': 'ಉ', 'ऊ': 'ಊ', 'ए': 'ಎ', 'ऐ': 'ಐ', 'ओ': 'ಒ', 'औ': 'ಔ',
    'अं': 'ಅಂ', 'अः': 'ಅಃ',
    'क': 'ಕ', 'ख': 'ಖ', 'ग': 'ಗ', 'घ': 'ಘ', 'ङ': 'ಙ', 'च': 'ಚ', 'छ': 'ಛ', 'ज': 'ಜ', 'झ': 'ಝ', 'ञ': 'ಞ',
    'ट': 'ಟ', 'ठ': 'ಠ', 'ड': 'ಡ', 'ढ': 'ಢ', 'ण': 'ಣ', 'त': 'ತ', 'थ': 'ಥ', 'द': 'ದ', 'ध': 'ಧ', 'न': 'ನ',
    'प': 'ಪ', 'फ': 'ಫ', 'ब': 'ಬ', 'भ': 'ಭ', 'म': 'ಮ', 'य': 'ಯ', 'र': 'ರ', 'ल': 'ಲ', 'व': 'ವ', 'श': 'ಶ', 'ष': 'ಷ', 'स': 'ಸ', 'ह': 'ಹ',
    'ा': 'ಾ', 'ि': 'ಿ', 'ी': 'ೀ', 'ु': 'ು', 'ू': 'ೂ', 'े': 'ೆ', 'ै': 'ೈ', 'ो': 'ೊ', 'ौ': 'ೌ', 'ं': 'ಂ', 'ः': 'ಃ',
    '्': '್'
  };

  return text
    .replace(/अं|अः/g, (m) => map[m])
    .replace(/[अआइईउऊएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहािीुूेैोौंः्]/g, (ch) => map[ch] || ch);
}

const lessons = source.lessons.map((lesson) => {
  const t = lessonTranslations[lesson.order_no] || {};
  return {
    ...lesson,
    language: 'kn',
    title: t.title || transliterateDevanagariToKannada(lesson.title),
    title_english: t.title || transliterateDevanagariToKannada(lesson.title_english),
    subtitle: t.subtitle || transliterateDevanagariToKannada(lesson.subtitle),
    description: t.description || transliterateDevanagariToKannada(lesson.description),
    description_english: t.description || transliterateDevanagariToKannada(lesson.description_english)
  };
});

const matraRules = source.matraRules.map((rule) => {
  const translated = {
    'rule-001': {
      title: 'ಸ್ವತಂತ್ರ ಸ್ವರ',
      titleEnglish: 'ಸ್ವತಂತ್ರ ಸ್ವರ',
      description: 'ಶಬ್ದದ ಆರಂಭದಲ್ಲಿ ಅಥವಾ ಒಂಟಿಯಾಗಿ ಬರೆಯಲ್ಪಟ್ಟಾಗ, ಸ್ವರವು ತನ್ನ ಸ್ವತಂತ್ರ ರೂಪವನ್ನು ಪಡೆಯುತ್ತದೆ.',
      descriptionEnglish: 'ಶಬ್ದದ ಆರಂಭದಲ್ಲಿ ಅಥವಾ ಒಂಟಿಯಾಗಿ ಬರೆಯಲ್ಪಟ್ಟಾಗ, ಸ್ವರವು ತನ್ನ ಸ್ವತಂತ್ರ ರೂಪವನ್ನು ಪಡೆಯುತ್ತದೆ.',
      examples: ['𑀅 (ಅ)', '𑀆 (ಆ)', '𑀇 (ಇ)', '𑀈 (ಈ)'],
      examplesDevanagari: ['ಅ', 'ಆ', 'ಇ', 'ಈ']
    },
    'rule-002': {
      title: 'ವ್ಯಂಜನ + ಮಾತ್ರೆ',
      titleEnglish: 'ವ್ಯಂಜನ + ಮಾತ್ರೆ',
      description: 'ವ್ಯಂಜನಕ್ಕೆ ಮಾತ್ರೆಯನ್ನು ಜೋಡಿಸಿದಾಗ, ಅದು ಹೊಸ ಧ್ವನಿಯನ್ನು ನೀಡುತ್ತದೆ (ಉದಾಹರಣೆಗೆ, ಕ + ಾ = ಕಾ).',
      descriptionEnglish: 'ವ್ಯಂಜನಕ್ಕೆ ಮಾತ್ರೆಯನ್ನು ಜೋಡಿಸಿದಾಗ, ಅದು ಹೊಸ ಧ್ವನಿಯನ್ನು ನೀಡುತ್ತದೆ (ಉದಾಹರಣೆಗೆ, ಕ + ಾ = ಕಾ).',
      examples: ['𑀓 + 𑀸 = ಕಾ', '𑀓 + 𑀹 = ಕಿ'],
      examplesDevanagari: ['ಕ + ಾ = ಕಾ', 'ಕ + ಿ = ಕಿ']
    },
    'rule-003': {
      title: 'ಮಾತ್ರೆಯ ಸ್ಥಾನ',
      titleEnglish: 'ಮಾತ್ರೆಯ ಸ್ಥಾನ',
      description: 'ಮಾತ್ರೆಗಳು ವಿಭಿನ್ನ ಸ್ಥಾನಗಳಲ್ಲಿ ಬರುತ್ತವೆ: ಮೇಲೆ, ಕೆಳಗೆ, ಮುಂಚೆ, ನಂತರ.',
      descriptionEnglish: 'ಮಾತ್ರೆಗಳು ವಿಭಿನ್ನ ಸ್ಥಾನಗಳಲ್ಲಿ ಬರುತ್ತವೆ: ಮೇಲೆ, ಕೆಳಗೆ, ಮುಂಚೆ, ನಂತರ.',
      examples: ['ಮೇಲೆ: ಕಿ (𑀓𑀹)', 'ಕೆಳಗೆ: ಕು (𑀓𑀻)', 'ನಂತರ: ಕಾ (𑀓𑀸)'],
      examplesDevanagari: ['ಮೇಲೆ: ಕಿ', 'ಕೆಳಗೆ: ಕು', 'ನಂತರ: ಕಾ']
    },
    'rule-004': {
      title: 'ವಿಶೇಷ ಗಮನ',
      titleEnglish: 'ವಿಶೇಷ ಗಮನ',
      description: 'ಬ್ರಾಹ್ಮೀ ಲಿಪಿಯಲ್ಲಿ ಮಾತ್ರೆಗಳ ಆಕಾರ ಮತ್ತು ಸ್ಥಾನವು ದೇವನಾಗರಿಯಿಂದ ಸ್ವಲ್ಪ ಭಿನ್ನವಾಗಿರುತ್ತದೆ. ಗಮನವಾಗಿ ನೋಡಿ, ಟ್ರೇಸ್ ಮಾಡಿ ಮತ್ತು ಗುರುತಿಸಿ.',
      descriptionEnglish: 'ಬ್ರಾಹ್ಮೀ ಲಿಪಿಯಲ್ಲಿ ಮಾತ್ರೆಗಳ ಆಕಾರ ಮತ್ತು ಸ್ಥಾನವು ದೇವನಾಗರಿಯಿಂದ ಸ್ವಲ್ಪ ಭಿನ್ನವಾಗಿರುತ್ತದೆ. ಗಮನವಾಗಿ ನೋಡಿ, ಟ್ರೇಸ್ ಮಾಡಿ ಮತ್ತು ಗುರುತಿಸಿ.',
      examples: [],
      examplesDevanagari: []
    }
  }[rule.id] || {};

  return {
    ...rule,
    title: translated.title || transliterateDevanagariToKannada(rule.title),
    titleEnglish: translated.titleEnglish || transliterateDevanagariToKannada(rule.titleEnglish),
    description: translated.description || transliterateDevanagariToKannada(rule.description),
    descriptionEnglish: translated.descriptionEnglish || transliterateDevanagariToKannada(rule.descriptionEnglish),
    examples: translated.examples || rule.examples.map(transliterateDevanagariToKannada),
    examplesDevanagari: translated.examplesDevanagari || rule.examplesDevanagari.map(transliterateDevanagariToKannada)
  };
});

const matras = source.matras.map((matra, index) => {
  const order = index + 1;
  return {
    ...matra,
    vowelDevanagari: vowelKannada[index],
    vowelBrahmi: matra.vowelBrahmi,
    matraName: matraNames[order],
    matraNameHindi: matraNames[order],
    matraSign: matra.matraSign,
    matraUnicode: matra.matraUnicode,
    matraPosition: matra.matraPosition,
    exampleDevanagari: transliterateDevanagariToKannada(matra.exampleDevanagari),
    exampleBrahmi: matra.exampleBrahmi,
    example_combination: order === 1 ? 'ವ್ಯಂಜನ ಒಂಟಿಯಾಗಿ' : transliterateDevanagariToKannada(matra.example_combination),
    description: (() => {
      const descriptionMap = {
        1: 'ಮಾತ್ರೆಯಿಲ್ಲದೆ, ವ್ಯಂಜನವು ಅಂತರ್ನಿಹಿತ ಅ ಧ್ವನಿಯನ್ನು ಹೊಂದಿರುತ್ತದೆ.',
        2: 'ಆ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.',
        3: 'ಇ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ಮೊದಲು ಅಥವಾ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಬರೆಯಲಾಗುತ್ತದೆ.',
        4: 'ಈ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.',
        5: 'ಉ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ಕೆಳಗೆ ಬರೆಯಲಾಗುತ್ತದೆ.',
        6: 'ಊ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ಕೆಳಗೆ ಬರೆಯಲಾಗುತ್ತದೆ.',
        7: 'ಎ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.',
        8: 'ಐ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.',
        9: 'ಒ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.',
        10: 'ಔ ಧ್ವನಿಯ ಮಾತ್ರಾ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.',
        11: 'ಅನುಸ್ವಾರ - ನಾಸಿಕ ಧ್ವನಿ ಚಿಹ್ನೆ, ವ್ಯಂಜನದ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಬರೆಯಲಾಗುತ್ತದೆ.',
        12: 'ವಿಶರ್ಗ - ದ್ವಿತೀಯ ಉಚ್ಚಾರಣಾ ಧ್ವನಿ, ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ.'
      };
      return descriptionMap[order] || transliterateDevanagariToKannada(matra.description);
    })(),
    descriptionEnglish: (() => {
      const descriptionMap = {
        1: 'ಅಂತರ್ನಿಹಿತ ಅ (ಯಾವುದೇ ಮಾತ್ರೆ ಚಿಹ್ನೆ ಅಗತ್ಯವಿಲ್ಲ)',
        2: 'ಆ ಮಾತ್ರೆ (ದೀರ್ಘ ಆ). ವ್ಯಂಜನದ ನಂತರ',
        3: 'ಇ ಮಾತ್ರೆ (ಸಣ್ಣ ಇ). ವ್ಯಂಜನದ ಮೊದಲು',
        4: 'ಈ ಮಾತ್ರೆ (ದೀರ್ಘ ಇ). ವ್ಯಂಜನದ ನಂತರ',
        5: 'ಉ ಮಾತ್ರೆ (ಸಣ್ಣ ಉ). ಕೆಳಗೆ',
        6: 'ಊ ಮಾತ್ರೆ (ದೀರ್ಘ ಉ). ಕೆಳಗೆ',
        7: 'ಎ ಮಾತ್ರೆ (ಎ). ವ್ಯಂಜನದ ನಂತರ',
        8: 'ಐ ಮಾತ್ರೆ (ಐ). ವ್ಯಂಜನದ ನಂತರ',
        9: 'ಒ ಮಾತ್ರೆ (ಒ). ವ್ಯಂಜನದ ನಂತರ',
        10: 'ಔ ಮಾತ್ರೆ (ಔ). ವ್ಯಂಜನದ ನಂತರ',
        11: 'ಅನುಸ್ವಾರ (ನಾಸಿಕ ಚಿಹ್ನೆ). ಮೇಲೆ',
        12: 'ವಿಶರ್ಗ (ಆಸ್ಪಿರೇಟೆಡ್-ಹ್ ಚಿಹ್ನೆ). ನಂತರ'
      };
      return descriptionMap[order] || transliterateDevanagariToKannada(matra.descriptionEnglish);
    })(),
    englishName: (() => {
      const englishMap = {
        1: 'ಅಂತರ್ನಿಹಿತ ಅ (ಯಾವುದೇ ಮಾತ್ರೆ ಚಿಹ್ನೆ ಅಗತ್ಯವಿಲ್ಲ)',
        2: 'ಆ ಮಾತ್ರೆ (ದೀರ್ಘ ಆ)',
        3: 'ಇ ಮಾತ್ರೆ (ಸಣ್ಣ ಇ)',
        4: 'ಈ ಮಾತ್ರೆ (ದೀರ್ಘ ಇ)',
        5: 'ಉ ಮಾತ್ರೆ (ಸಣ್ಣ ಉ)',
        6: 'ಊ ಮಾತ್ರೆ (ದೀರ್ಘ ಉ)',
        7: 'ಎ ಮಾತ್ರೆ (ಎ)',
        8: 'ಐ ಮಾತ್ರೆ (ಐ)',
        9: 'ಒ ಮಾತ್ರೆ (ಒ)',
        10: 'ಔ ಮಾತ್ರೆ (ಔ)',
        11: 'ಅನುಸ್ವಾರ (ನಾಸಿಕ ಚಿಹ್ನೆ)',
        12: 'ವಿಶರ್ಗ (ಆಸ್ಪಿರೇಟೆಡ್-ಹ್ ಚಿಹ್ನೆ)'
      };
      return englishMap[order] || transliterateDevanagariToKannada(matra.englishName);
    })(),
    matraPositionLabel: matraPositionLabels[matra.matraPosition] || transliterateDevanagariToKannada(matra.matraPositionLabel)
  };
});

const consonants = source.consonants.map((consonant) => ({
  ...consonant,
  devanagari: transliterateDevanagariToKannada(consonant.devanagari),
  brahmi: consonant.brahmi
}));

const consonantMatraCombinations = source.consonantMatraCombinations.map((combo, comboIndex) => ({
  ...combo,
  consonantDevanagari: consonantsKannada[comboIndex],
  consonantBrahmi: combo.consonantBrahmi,
  forms: combo.forms.map((form) => {
    const matraSign = matraSignsKannada[form.matraOrder - 1] || '';
    return {
      ...form,
      matraName: matraNames[form.matraOrder],
      matraDevanagari: matraSign,
      matraSign,
      combinedDevanagari: matraSign ? `${consonantsKannada[comboIndex]}${matraSign}` : consonantsKannada[comboIndex],
      combinedBrahmi: form.combinedBrahmi
    };
  })
}));

const practiceExercises = {
  template: {
    exercise1: {
      title: 'ಖಾಲಿ ಜಾಗ ತುಂಬಿಸಿ',
      titleEnglish: 'ಖಾಲಿ ಜಾಗ ತುಂಬಿಸಿ',
      description: 'ಖಾಲಿ ಜಾಗದಲ್ಲಿ ಸರಿಯಾದ ಮಾತ್ರೆಯ ಹೆಸರನ್ನು ತುಂಬಿ',
      instructions: '[ವ್ಯಂಜನ] + ___ = ಫಲಿತಾಂಶ',
      format: 'ಪ್ರತಿ ಸಂಯೋಜನೆಗೆ ಮಾತ್ರೆಯ ಹೆಸರನ್ನು ತುಂಬಿ',
      questionCount: 3,
      sampleQuestions: [
        { id: 'ex1-q1', question: '[ವ್ಯಂಜನ] + ಇ-ಮಾತ್ರೆ (𑀹) = ___', expectedAnswer: '[ವ್ಯಂಜನ]ಿ', format: 'ವ್ಯಂಜನ + ಮಾತ್ರೆ = ಫಲಿತಾಂಶ' },
        { id: 'ex1-q2', question: '[ವ್ಯಂಜನ] + ಊ-ಮಾತ್ರೆ (𑀼) = ___', expectedAnswer: '[ವ್ಯಂಜನ]ೂ', format: 'ವ್ಯಂಜನ + ಮಾತ್ರೆ = ಫಲಿತಾಂಶ' },
        { id: 'ex1-q3', question: '[ವ್ಯಂಜನ] + ಐ-ಮಾತ್ರೆ (𑁃) = ___', expectedAnswer: '[ವ್ಯಂಜನ]ೈ', format: 'ವ್ಯಂಜನ + ಮಾತ್ರೆ = ಫಲಿತಾಂಶ' }
      ]
    },
    exercise2: {
      title: 'ಸರಿಯಾದ ಜೋಡಿ ಹೊಂದಿಸಿ',
      titleEnglish: 'ಸರಿಯಾದ ಜೋಡಿ ಹೊಂದಿಸಿ',
      description: 'ಬ್ರಾಹ್ಮೀ ರೂಪಗಳನ್ನು ಕನ್ನಡ ರೂಪಗಳೊಂದಿಗೆ ಹೊಂದಿಸಿ',
      instructions: 'ಬ್ರಾಹ್ಮೀ ಮಾತ್ರಾ ಸಂಯೋಜನೆಗಳನ್ನು ಕನ್ನಡದೊಂದಿಗೆ ಹೊಂದಿಸಿ',
      format: 'ಹೊಂದಿಸುವ ಜೋಡಿಗಳು',
      pairCount: 3,
      samplePairs: [
        { columnA: '[ವ್ಯಂಜನ] + ಆ-ಮಾತ್ರೆ', columnB: '[brahmi_consonant𑀸]', answer: '[ವ್ಯಂಜನ]ಾ' },
        { columnA: '[ವ್ಯಂಜನ] + ಉ-ಮಾತ್ರೆ', columnB: '[brahmi_consonant𑀻]', answer: '[ವ್ಯಂಜನ]ು' },
        { columnA: '[ವ್ಯಂಜನ] + ಒ-ಮಾತ್ರೆ', columnB: '[brahmi_consonant𑁄]', answer: '[ವ್ಯಂಜನ]ೊ' }
      ]
    },
    exercise3: {
      title: 'ವಿರುದ್ಧ ಅಭ್ಯಾಸ',
      titleEnglish: 'ವಿರುದ್ಧ ಅಭ್ಯಾಸ',
      description: 'ಬ್ರಾಹ್ಮೀ ರೂಪವನ್ನು ನೋಡಿ ಯಾವ ಮಾತ್ರೆ ಎಂಬುದನ್ನು ಗುರುತಿಸಿ',
      instructions: 'ಪ್ರತಿ ಬ್ರಾಹ್ಮೀ ರೂಪದಲ್ಲಿ ಯಾವ ಮಾತ್ರೆ ಬಳಸಲಾಗಿದೆ ಎಂಬುದನ್ನು ಗುರುತಿಸಿ',
      format: 'ಬ್ರಾಹ್ಮೀದಿಂದ ಕನ್ನಡಕ್ಕೆ ಮಾತ್ರೆ ಗುರುತಿಸುವಿಕೆ',
      questionCount: 3,
      sampleQuestions: [
        { id: 'ex3-q1', brahmiForm: '[brahmi_consonant𑀹]', question: 'ಇದು ಯಾವ ಮಾತ್ರೆ?', expectedAnswer: 'ಇ-ಮಾತ್ರೆ', options: ['ಇ-ಮಾತ್ರೆ', 'ಈ-ಮಾತ್ರೆ', 'ಉ-ಮಾತ್ರೆ'] },
        { id: 'ex3-q2', brahmiForm: '[brahmi_consonant𑁃]', question: 'ಇದು ಯಾವ ಮಾತ್ರೆ?', expectedAnswer: 'ಐ-ಮಾತ್ರೆ', options: ['ಐ-ಮಾತ್ರೆ', 'ಔ-ಮಾತ್ರೆ', 'ಎ-ಮಾತ್ರೆ'] },
        { id: 'ex3-q3', brahmiForm: '[brahmi_consonant𑁀]', question: 'ಇದು ಯಾವ ಚಿಹ್ನೆ?', expectedAnswer: 'ಅನುಸ್ವಾರ', options: ['ಅನುಸ್ವಾರ', 'ವಿಶರ್ಗ', 'ಯಾವುದೂ ಇಲ್ಲ'] }
      ]
    },
    exercise4: {
      title: 'ಟ್ರೇಸಿಂಗ್ ಅಭ್ಯಾಸ',
      titleEnglish: 'ಟ್ರೇಸಿಂಗ್ ಅಭ್ಯಾಸ',
      description: 'ಪ್ರತಿ ರೂಪವನ್ನು 3 ಬಾರಿ ಬರೆಯುವ ಅಭ್ಯಾಸ ಮಾಡಿ',
      instructions: 'ಪ್ರತಿ ರೂಪವನ್ನು 3 ಬಾರಿ ಟ್ರೇಸ್ ಮಾಡಿ',
      format: 'ಹಸ್ತಲಿಪಿ ಟ್ರೇಸಿಂಗ್',
      formsToTrace: 6,
      sampleForms: [
        { form: '[ವ್ಯಂಜನ ಮಾತ್ರ]', brahmi: '[consonant_brahmi]' },
        { form: '[ವ್ಯಂಜನ + ಆ]', brahmi: '[consonant_brahmi𑀸]' },
        { form: '[ವ್ಯಂಜನ + ಇ]', brahmi: '[consonant_brahmi𑀹]' },
        { form: '[ವ್ಯಂಜನ + ಉ]', brahmi: '[consonant_brahmi𑀻]' },
        { form: '[ವ್ಯಂಜನ + ಎ]', brahmi: '[consonant_brahmi𑁂]' },
        { form: '[ವ್ಯಂಜನ + ಅಂ]', brahmi: '[consonant_brahmi𑁀]' }
      ]
    }
  }
};

const tracingSequence = source.tracingSequence.map((item) => {
  const tracingMap = {
    1: {
      slideTitle: 'ಮಾತ್ರೆಯಿಲ್ಲ - ಅಂತರ್ನಿಹಿತ ಅ',
      slideTitleEnglish: 'ಮಾತ್ರೆಯಿಲ್ಲ - ಅಂತರ್ನಿಹಿತ ಅ',
      description: 'ಬ್ರಾಹ್ಮೀ ಮಾತ್ರಾ ರೂಪ: ಏನೂ ಸೇರಿಸಲಾಗಿಲ್ಲ. ಉದಾಹರಣೆ: ಕ (𑀓)',
      descriptionEnglish: 'ಬ್ರಾಹ್ಮೀ ಮಾತ್ರಾ ರೂಪ: ಏನೂ ಸೇರಿಸಲಾಗಿಲ್ಲ. ಉದಾಹರಣೆ: ಕ (𑀓)',
      instructions: 'ಇದು ಹೇಗೆ ಬರೆಯಲಾಗಿದೆ ಎಂಬುದನ್ನು ಗಮನಿಸಿ',
      matraName: 'ಯಾವುದೂ ಇಲ್ಲ',
      example: 'ಕ'
    },
    2: {
      slideTitle: 'ಆ - ಮಾತ್ರೆ',
      slideTitleEnglish: 'ಆ - ಮಾತ್ರೆ',
      description: 'ಆ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕಾ (𑀓𑀸)',
      descriptionEnglish: 'ಆ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕಾ (𑀓𑀸)',
      instructions: 'ಮಾತ್ರೆಯನ್ನು ವ್ಯಂಜನಕ್ಕೆ ಜೋಡಿಸಿ ಬರೆಯಿರಿ',
      matraName: 'ಆ',
      example: 'ಕಾ'
    },
    3: {
      slideTitle: 'ಇ - ಮಾತ್ರೆ',
      slideTitleEnglish: 'ಇ - ಮಾತ್ರೆ',
      description: 'ಇ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ಮೊದಲು ಅಥವಾ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕಿ (𑀓𑀹)',
      descriptionEnglish: 'ಇ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ಮೊದಲು ಅಥವಾ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕಿ (𑀓𑀹)',
      instructions: 'ಮಾತ್ರೆಯನ್ನು ವ್ಯಂಜನದೊಂದಿಗೆ ಸರಿಯಾದ ಸ್ಥಳದಲ್ಲಿ ಬರೆಯಿರಿ',
      matraName: 'ಇ',
      example: 'ಕಿ'
    },
    4: {
      slideTitle: 'ಈ - ಮಾತ್ರೆ',
      slideTitleEnglish: 'ಈ - ಮಾತ್ರೆ',
      description: 'ಈ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೀ (𑀓𑀺)',
      descriptionEnglish: 'ಈ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೀ (𑀓𑀺)',
      instructions: 'ಮಾತ್ರೆಯನ್ನು ವ್ಯಂಜನಕ್ಕೆ ಜೋಡಿಸಿ ಬರೆಯಿರಿ',
      matraName: 'ಈ',
      example: 'ಕೀ'
    },
    5: {
      slideTitle: 'ಉ - ಮಾತ್ರೆ',
      slideTitleEnglish: 'ಉ - ಮಾತ್ರೆ',
      description: 'ಉ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ಕೆಳಗೆ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕು (𑀓𑀻)',
      descriptionEnglish: 'ಉ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ಕೆಳಗೆ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕು (𑀓𑀻)',
      instructions: 'ವ್ಯಂಜನದ ಕೆಳಗೆ ಮಾತ್ರೆ ಹಾಕಿ ಬರೆಯಿರಿ',
      matraName: 'ಉ',
      example: 'ಕು'
    },
    6: {
      slideTitle: 'ಊ - ಮಾತ್ರೆ',
      slideTitleEnglish: 'ಊ - ಮಾತ್ರೆ',
      description: 'ಊ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ಕೆಳಗೆ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೂ (𑀓𑀼)',
      descriptionEnglish: 'ಊ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ಕೆಳಗೆ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೂ (𑀓𑀼)',
      instructions: 'ವ್ಯಂಜನದ ಕೆಳಗೆ ಮಾತ್ರೆ ಹಾಕಿ ಬರೆಯಿರಿ',
      matraName: 'ಊ',
      example: 'ಕೂ'
    },
    7: {
      slideTitle: 'ಎ - ಮಾತ್ರೆ',
      slideTitleEnglish: 'ಎ - ಮಾತ್ರೆ',
      description: 'ಎ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೆ (𑀓𑁂)',
      descriptionEnglish: 'ಎ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೆ (𑀓𑁂)',
      instructions: 'ಮಾತ್ರೆಯನ್ನು ವ್ಯಂಜನಕ್ಕೆ ಜೋಡಿಸಿ ಬರೆಯಿರಿ',
      matraName: 'ಎ',
      example: 'ಕೆ'
    },
    8: {
      slideTitle: 'ಐ - ಮಾತ್ರೆ',
      slideTitleEnglish: 'ಐ - ಮಾತ್ರೆ',
      description: 'ಐ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೈ (𑀓𑁃)',
      descriptionEnglish: 'ಐ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೈ (𑀓𑁃)',
      instructions: 'ಮಾತ್ರೆಯನ್ನು ವ್ಯಂಜನಕ್ಕೆ ಜೋಡಿಸಿ ಬರೆಯಿರಿ',
      matraName: 'ಐ',
      example: 'ಕೈ'
    },
    9: {
      slideTitle: 'ಒ - ಮಾತ್ರೆ',
      slideTitleEnglish: 'ಒ - ಮಾತ್ರೆ',
      description: 'ಒ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೊ (𑀓𑁄)',
      descriptionEnglish: 'ಒ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೊ (𑀓𑁄)',
      instructions: 'ಮಾತ್ರೆಯನ್ನು ವ್ಯಂಜನಕ್ಕೆ ಜೋಡಿಸಿ ಬರೆಯಿರಿ',
      matraName: 'ಒ',
      example: 'ಕೊ'
    },
    10: {
      slideTitle: 'ಔ - ಮಾತ್ರೆ',
      slideTitleEnglish: 'ಔ - ಮಾತ್ರೆ',
      description: 'ಔ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೌ (𑀓𑁅)',
      descriptionEnglish: 'ಔ-ಮಾತ್ರೆ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕೌ (𑀓𑁅)',
      instructions: 'ಮಾತ್ರೆಯನ್ನು ವ್ಯಂಜನಕ್ಕೆ ಜೋಡಿಸಿ ಬರೆಯಿರಿ',
      matraName: 'ಔ',
      example: 'ಕೌ'
    },
    11: {
      slideTitle: 'ಅಂ - ಅನುಸ್ವಾರ',
      slideTitleEnglish: 'ಅಂ - ಅನುಸ್ವಾರ',
      description: 'ಅನುಸ್ವಾರ: ವ್ಯಂಜನದ ಮೇಲೆ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕಂ (𑀓𑁀)',
      descriptionEnglish: 'ಅನುಸ್ವಾರ: ವ್ಯಂಜನದ ಮೇಲೆ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕಂ (𑀓𑁀)',
      instructions: 'ವ್ಯಂಜನದ ಮೇಲೆ ಚಿಹ್ನೆ ಹಾಕಿ ಬರೆಯಿರಿ',
      matraName: 'ಅನುಸ್ವಾರ',
      example: 'ಕಂ'
    },
    12: {
      slideTitle: 'ಅಃ - ವಿಶರ್ಗ',
      slideTitleEnglish: 'ಅಃ - ವಿಶರ್ಗ',
      description: 'ವಿಶರ್ಗ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕಃ (𑀓𑀂)',
      descriptionEnglish: 'ವಿಶರ್ಗ: ವ್ಯಂಜನದ ನಂತರ ಬರೆಯಲಾಗುತ್ತದೆ. ಉದಾಹರಣೆ: ಕಃ (𑀓𑀂)',
      instructions: 'ವ್ಯಂಜನದ ನಂತರ ಚಿಹ್ನೆ ಹಾಕಿ ಬರೆಯಿರಿ',
      matraName: 'ವಿಶರ್ಗ',
      example: 'ಕಃ'
    }
  }[item.order] || {};

  return {
    ...item,
    slideTitle: tracingMap.slideTitle || transliterateDevanagariToKannada(item.slideTitle),
    slideTitleEnglish: tracingMap.slideTitleEnglish || transliterateDevanagariToKannada(item.slideTitleEnglish),
    matraName: tracingMap.matraName || transliterateDevanagariToKannada(item.matraName),
    example: tracingMap.example || transliterateDevanagariToKannada(item.example),
    description: tracingMap.description || transliterateDevanagariToKannada(item.description),
    descriptionEnglish: tracingMap.descriptionEnglish || transliterateDevanagariToKannada(item.descriptionEnglish),
    instructions: tracingMap.instructions || transliterateDevanagariToKannada(item.instructions)
  };
});

const output = {
  ...source,
  lessons,
  matraRules,
  matras,
  consonants,
  consonantMatraCombinations,
  practiceExercises,
  tracingSequence
};

fs.writeFileSync(targetPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
