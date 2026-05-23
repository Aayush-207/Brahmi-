import { Identity } from './guestIdentity'
import { getDataForLanguage } from '@/backend/data/index'
import { localizeDigits } from './utils'

const GUEST_VYANJAN_PROGRESS_KEY = 'brahmi_guest_vyanjan_progress'

type GuestVyanjanProgress = {
  completedIds: string[]
  progressMap: Record<string, number>
  lastUpdated: string
}

export type VyanjanLesson = {
  id: string
  module_id: string
  lesson_id: string
  title: string
  title_tamil?: string
  subtitle: string
  subtitle_tamil?: string
  description: string
  description_tamil?: string
  thumbnail_icon: string
  thumbnail_label?: string
  order_no: number
  estimated_time_minutes: number
  consonant_group: string
}

export type VyanjanLessonContent = {
  id: string
  lesson_id: string
  content_type: 'title_slide' | 'text' | 'mcq' | 'writing_practice' | 'pronunciation'
  title: string
  content: string
  metadata?: any
  order_no: number
}

export type Consonant = {
  id: string
  order: number
  category: string
  categoryHindi: string
  categoryEnglish: string
  categoryDescription: string
  categoryTamil?: string
  categoryDescriptionTamil?: string
  devanagari: string
  brahmi: string
  romanized: string
  pronunciationNote: string
  pronunciationNoteEnglish?: string
  pronunciationNoteTamil?: string
  pronunciationNoteKannada?: string
  title_kannada?: string
  categoryKannada?: string
  categoryDescriptionKannada?: string
  exampleWords: Array<{ devanagari: string, romanized: string, english: string }>
}

const VYANJAN_ENGLISH_SUBTITLES: Record<string, string> = {
  all: '',
  kanthya: 'Guttural',
  talavya: 'Palatal',
  murdhanya: 'Retroflex',
  dantya: 'Dental',
  osthya: 'Labial',
  antahstha: 'Semi-vowels',
  ushma: 'Sibilants'
}

const VYANJAN_ENGLISH_DESCRIPTIONS: Record<string, string> = {
  all: 'Learn about the 33 Brahmi consonants arranged into 7 groups.',
  kanthya: 'Learn the 5 guttural consonants (ka, kha, ga, gha, nga).',
  talavya: 'Learn the 5 palatal consonants (cha, chha, ja, jha, nya).',
  murdhanya: 'Learn the 5 retroflex consonants (ta, tha, da, dha, na).',
  dantya: 'Learn the 5 dental consonants (ta, tha, da, dha, na).',
  osthya: 'Learn the 5 labial consonants (pa, pha, ba, bha, ma).',
  antahstha: 'Learn the 4 semi-vowels (ya, ra, la, va).',
  ushma: 'Learn the 4 fricative consonants (sha, sha, sa, ha).'
}

function getEnglishVyanjanSubtitle(category: string, fallback: string): string {
  return VYANJAN_ENGLISH_SUBTITLES[category] ?? fallback
}

function getEnglishVyanjanDescription(category: string, fallback: string): string {
  return VYANJAN_ENGLISH_DESCRIPTIONS[category] ?? fallback
}

const VYANJAN_KANNADA_SUBTITLES: Record<string, string> = {
  all: '',
  kanthya: 'ಕಂಠ್ಯ',
  talavya: 'ತಾಲವ್ಯ',
  murdhanya: 'ಮೂರ್ಧನ್ಯ',
  dantya: 'ದಂತ್ಯ',
  osthya: 'ಓಷ್ಟ್ಯ',
  antahstha: 'ಅಂತಃಸ್ಥ',
  ushma: 'ಉಷ್ಮ'
}

const VYANJAN_KANNADA_DESCRIPTIONS: Record<string, string> = {
  all: '7 ವರ್ಗಗಳಲ್ಲಿ ವ್ಯವಸ್ಥಿತವಾದ 33 ಬ್ರಾಹ್ಮೀ ವ್ಯಂಜನಗಳ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ.',
  kanthya: '5 ಕಂಠ್ಯ ವ್ಯಂಜನಗಳು (ಕ, ಖ, ಗ, ಘ, ಙ) ಅನ್ನು ಕಲಿಯಿರಿ.',
  talavya: '5 ತಾಲವ್ಯ ವ್ಯಂಜನಗಳು (ಚ, ಛ, ಜ, ಝ, ಞ) ಅನ್ನು ಕಲಿಯಿರಿ.',
  murdhanya: '5 ಮೂರ್ಧನ್ಯ ವ್ಯಂಜನಗಳು (ಟ, ಠ, ಡ, ಢ, ಣ) ಅನ್ನು ಕಲಿಯಿರಿ.',
  dantya: '5 ದಂತ್ಯ ವ್ಯಂಜನಗಳು (ತ, ಥ, ದ, ಧ, ನ) ಅನ್ನು ಕಲಿಯಿರಿ.',
  osthya: '5 ಓಷ್ಟ್ಯ ವ್ಯಂಜನಗಳು (ಪ, ಫ, ಬ, ಭ, ಮ) ಅನ್ನು ಕಲಿಯಿರಿ.',
  antahstha: '4 ಅರ್ಥಸ್ವರ ವ್ಯಂಜನಗಳು (ಯ, ರ, ಲ, ವ) ಅನ್ನು ಕಲಿಯಿರಿ.',
  ushma: '4 ಉಷ್ಮ ವ್ಯಂಜನಗಳು (ಶ, ಷ, ಸ, ಹ) ಅನ್ನು ಕಲಿಯಿರಿ.'
}

const KANNADA_CONSONANT_MAP: Record<string, string> = {
  'क': 'ಕ', 'ख': 'ಖ', 'ग': 'ಗ', 'घ': 'ಘ', 'ङ': 'ಙ',
  'च': 'ಚ', 'छ': 'ಛ', 'ज': 'ಜ', 'झ': 'ಝ', 'ञ': 'ಞ',
  'ट': 'ಟ', 'ठ': 'ಠ', 'ड': 'ಡ', 'ढ': 'ಢ', 'ण': 'ಣ',
  'त': 'ತ', 'थ': 'ಥ', 'द': 'ದ', 'ध': 'ಧ', 'न': 'ನ',
  'प': 'ಪ', 'फ': 'ಫ', 'ब': 'ಬ', 'भ': 'ಭ', 'म': 'ಮ',
  'य': 'ಯ', 'र': 'ರ', 'ल': 'ಲ', 'व': 'ವ',
  'श': 'ಶ', 'ष': 'ಷ', 'स': 'ಸ', 'ह': 'ಹ'
}

const KANNADA_LESSON_TITLE_MAP: Record<string, string> = {
  'vyanjan-lesson-001': 'ವ್ಯಂಜನಗಳ ಪರಿಚಯ',
  'vyanjan-lesson-002': 'ಕ ವರ್ಗ',
  'vyanjan-lesson-003': 'ಚ ವರ್ಗ',
  'vyanjan-lesson-004': 'ಟ ವರ್ಗ (ಮೂರ್ಧನ್ಯ)',
  'vyanjan-lesson-005': 'ತ ವರ್ಗ (ದಂತ್ಯ)',
  'vyanjan-lesson-006': 'ಪ ವರ್ಗ',
  'vyanjan-lesson-007': 'ಅಂತಃಸ್ಥ',
  'vyanjan-lesson-008': 'ಉಷ್ಮ'
}

const KANNADA_SOUND_LABEL = 'ಧ್ವನಿ'
const KANNADA_EXAMPLES_LABEL = 'ಉದಾಹರಣೆಗಳು'
const TAMIL_SOUND_LABEL = 'ஒலி'
const TAMIL_EXAMPLES_LABEL = 'எடுத்துக்காட்டுகள்'

function getKannadaVyanjanSubtitle(category: string, fallback: string): string {
  return VYANJAN_KANNADA_SUBTITLES[category] ?? fallback
}

function getKannadaVyanjanDescription(category: string, fallback: string): string {
  return VYANJAN_KANNADA_DESCRIPTIONS[category] ?? fallback
}

function getKannadaConsonantLabel(devanagari: string): string {
  return KANNADA_CONSONANT_MAP[devanagari] ?? devanagari
}

const DEVANAGARI_TO_TAMIL_LETTER_MAP: Record<string, string> = {
  'क': 'க', 'ख': 'க்ஹ', 'ग': 'க', 'घ': 'க்ஹ', 'ङ': 'ங',
  'च': 'ச', 'छ': 'ச்ஹ', 'ज': 'ஜ', 'झ': 'ஜ்ஹ', 'ञ': 'ஞ',
  'ट': 'ட', 'ठ': 'ட்ஹ', 'ड': 'ட', 'ढ': 'ட்ஹ', 'ण': 'ண',
  'त': 'த', 'थ': 'த்ஹ', 'द': 'த', 'ध': 'த்ஹ', 'न': 'ந',
  'प': 'ப', 'फ': 'ப்ஹ', 'ब': 'ப', 'भ': 'ப்ஹ', 'म': 'ம',
  'य': 'ய', 'र': 'ர', 'ल': 'ல', 'व': 'வ',
  'श': 'ஶ', 'ष': 'ஷ', 'स': 'ஸ', 'ह': 'ஹ'
}

const DEVANAGARI_TO_TAMIL_WORD_MAP: Record<string, string> = {
  'अ': 'அ', 'आ': 'ஆ', 'इ': 'இ', 'ई': 'ஈ', 'उ': 'உ', 'ऊ': 'ஊ', 'ए': 'ஏ', 'ऐ': 'ஐ', 'ओ': 'ஓ', 'औ': 'ஔ',
  'ा': 'ா', 'ि': 'ி', 'ी': 'ீ', 'ु': 'ு', 'ू': 'ூ', 'े': 'ே', 'ै': 'ை', 'ो': 'ோ', 'ौ': 'ௌ',
  'ं': 'ம்', 'ः': 'ஃ', 'ँ': 'ம்', '़': '', '्': '',
  'क': 'க', 'ख': 'க்ஹ', 'ग': 'க', 'घ': 'க்ஹ', 'ङ': 'ங',
  'च': 'ச', 'छ': 'ச்ஹ', 'ज': 'ஜ', 'झ': 'ஜ்ஹ', 'ञ': 'ஞ',
  'ट': 'ட', 'ठ': 'ட்ஹ', 'ड': 'ட', 'ढ': 'ட்ஹ', 'ण': 'ண',
  'त': 'த', 'थ': 'த்ஹ', 'द': 'த', 'ध': 'த்ஹ', 'न': 'ந',
  'प': 'ப', 'फ': 'ப்ஹ', 'ब': 'ப', 'भ': 'ப்ஹ', 'म': 'ம',
  'य': 'ய', 'र': 'ர', 'ल': 'ல', 'व': 'வ',
  'श': 'ஶ', 'ष': 'ஷ', 'स': 'ஸ', 'ह': 'ஹ'
}

function getTamilConsonantLabel(devanagari: string): string {
  return DEVANAGARI_TO_TAMIL_LETTER_MAP[devanagari] ?? devanagari
}

function transliterateDevanagariToTamil(text: string): string {
  if (!text) return text
  return text
    .split('')
    .map((char) => DEVANAGARI_TO_TAMIL_WORD_MAP[char] ?? char)
    .join('')
}

function getTamilExampleText(example: { tamil?: string; devanagari?: string; romanized?: string }): string {
  if (example.tamil && !isPlaceholderText(example.tamil)) return example.tamil
  if (example.devanagari) return transliterateDevanagariToTamil(example.devanagari)
  if (example.romanized) return example.romanized
  return ''
}

const DEVANAGARI_TO_KANNADA_WORD_MAP: Record<string, string> = {
  'अ': 'ಅ', 'आ': 'ಆ', 'इ': 'ಇ', 'ई': 'ಈ', 'उ': 'ಉ', 'ऊ': 'ಊ', 'ए': 'ಏ', 'ऐ': 'ಐ', 'ओ': 'ಓ', 'औ': 'ಔ',
  'ा': 'ಾ', 'ि': 'ಿ', 'ी': 'ೀ', 'ु': 'ು', 'ू': 'ೂ', 'े': 'ೇ', 'ै': 'ೈ', 'ो': 'ೋ', 'ौ': 'ೌ',
  'ं': 'ಂ', 'ः': 'ಃ', 'ँ': 'ಂ', '़': '', '्': '',
  'क': 'ಕ', 'ख': 'ಖ', 'ग': 'ಗ', 'घ': 'ಘ', 'ङ': 'ಙ', 'च': 'ಚ', 'छ': 'ಛ', 'ज': 'ಜ', 'झ': 'ಝ', 'ञ': 'ಞ',
  'ट': 'ಟ', 'ठ': 'ಠ', 'ड': 'ಡ', 'ढ': 'ಢ', 'ण': 'ಣ', 'त': 'ತ', 'थ': 'ಥ', 'द': 'ದ', 'ध': 'ಧ', 'न': 'ನ',
  'प': 'ಪ', 'फ': 'ಫ', 'ब': 'ಬ', 'भ': 'ಭ', 'म': 'ಮ', 'य': 'ಯ', 'र': 'ರ', 'ल': 'ಲ', 'व': 'ವ',
  'श': 'ಶ', 'ष': 'ಷ', 'स': 'ಸ', 'ह': 'ಹ'
}

function transliterateDevanagariToKannada(text: string): string {
  if (!text) return text
  return text
    .split('')
    .map((char) => DEVANAGARI_TO_KANNADA_WORD_MAP[char] ?? char)
    .join('')
}

function getKannadaExampleText(example: { kannada?: string; devanagari?: string; romanized?: string }): string {
  if (example.kannada && !isPlaceholderText(example.kannada)) return example.kannada
  if (example.devanagari) return transliterateDevanagariToKannada(example.devanagari)
  if (example.romanized) return transliterateDevanagariToKannada(example.romanized)
  return ''
}

function isPlaceholderText(value?: string): boolean {
  if (!value) return true
  const trimmed = value.trim()
  return trimmed.length === 0 || /^\?+$/.test(trimmed)
}

function englishExampleText(example: { english?: string; romanized?: string; devanagari?: string }): string {
  const english = example.english || ''
  if (english && !/[\u0900-\u097F]/.test(english)) {
    return english
  }
  return example.romanized || example.devanagari || english
}

function romanizeConsonantWithMatra(baseRomanized: string, matraName: string): string {
  const root = baseRomanized.endsWith('a') ? baseRomanized.slice(0, -1) : baseRomanized
  const suffixMap: Record<string, string> = {
    None: 'a',
    'आ': 'aa',
    'इ': 'i',
    'ई': 'ee',
    'उ': 'u',
    'ऊ': 'oo',
    'ए': 'e',
    'ऐ': 'ai',
    'ओ': 'o',
    'औ': 'au',
    'अं': 'am',
    'अः': 'ah'
  }
  const suffix = suffixMap[matraName] || 'a'
  return `${root}${suffix}`
}

// Progress functions
function getGuestVyanjanProgressFromStorage(): { completedIds: string[], progressMap: Record<string, number> } {
  if (typeof window === 'undefined') return { completedIds: [], progressMap: {} }
  try {
    const stored = sessionStorage.getItem(GUEST_VYANJAN_PROGRESS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as GuestVyanjanProgress
      return { completedIds: parsed.completedIds || [], progressMap: parsed.progressMap || {} }
    }
  } catch (error) {}
  return { completedIds: [], progressMap: {} }
}

function saveGuestVyanjanProgressToStorage(completedIds: string[], progressMap: Record<string, number>) {
  if (typeof window === 'undefined') return
  try {
    const progress: GuestVyanjanProgress = {
      completedIds,
      progressMap,
      lastUpdated: new Date().toISOString()
    }
    sessionStorage.setItem(GUEST_VYANJAN_PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {}
}

export async function saveVyanjanProgress(
  lessonId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progress: number,
  identity: Identity,
  unused?: any,
  language: string = 'hi'
): Promise<void> {
  if (identity.type === 'guest') {
    const { completedIds, progressMap } = getGuestVyanjanProgressFromStorage()
    progressMap[lessonId] = progress
    if (status === 'completed' && !completedIds.includes(lessonId)) {
      completedIds.push(lessonId)
    }
    saveGuestVyanjanProgressToStorage(completedIds, progressMap)
  }
}

export async function getVyanjanProgress(identity: Identity): Promise<{ completedIds: string[], progressMap: Record<string, number> }> {
  if (identity.type === 'guest') {
    return getGuestVyanjanProgressFromStorage()
  }
  return { completedIds: [], progressMap: {} }
}

// Added this to fix common pattern
export async function getCompletedVyanjanLessonIds(identity: Identity): Promise<string[]> {
  const { completedIds } = await getVyanjanProgress(identity)
  return completedIds
}

export async function getVyanjanLessons(language: string = 'hi'): Promise<VyanjanLesson[]> {
  const isTamil = language === 'ta'
  const data = getDataForLanguage(language)
  const lessons = data.vyanjan.lessons as VyanjanLesson[]
  const consonantsList = data.vyanjan.consonants as any[]
  const categoriesMap = data.vyanjan.categories as Record<string, any>
  // Sort by order_no to ensure correct sequence
  const sortedLessons = lessons.sort((a: VyanjanLesson, b: VyanjanLesson) => a.order_no - b.order_no)

  if (language === 'hi') {
    return sortedLessons.map(l => ({
      ...l,
      description: localizeDigits(l.description || '', 'hi'),
      thumbnail_label: l.thumbnail_icon
    }))
  }

  if (language === 'kn') {
    return sortedLessons.map((lesson: any) => {
      // determine a Kannada thumbnail label from first consonant in category
      let thumb = lesson.thumbnail_icon
      const category = categoriesMap[lesson.consonant_group]
      if (category?.consonantIds && category.consonantIds.length > 0) {
        const firstId = category.consonantIds[0]
        const consonant = consonantsList.find(c => c.id === firstId)
        if (consonant) thumb = getKannadaConsonantLabel(consonant.devanagari)
      }
      return {
        ...lesson,
        title: !isPlaceholderText(lesson.title_kannada) ? lesson.title_kannada : (KANNADA_LESSON_TITLE_MAP[lesson.lesson_id] || lesson.title),
        subtitle: !isPlaceholderText(lesson.subtitle_kannada) ? lesson.subtitle_kannada : getKannadaVyanjanSubtitle(lesson.consonant_group, lesson.subtitle),
        description: localizeDigits(!isPlaceholderText(lesson.description_kannada) ? lesson.description_kannada : getKannadaVyanjanDescription(lesson.consonant_group, lesson.description), 'kn'),
        thumbnail_label: thumb
      }
    })
  }

  return sortedLessons.map((lesson: any) => {
    // determine thumbnail label from first consonant in category
    let thumb = isTamil ? transliterateDevanagariToTamil(lesson.thumbnail_icon || '') : lesson.thumbnail_icon
    const category = categoriesMap[lesson.consonant_group]
    if (category?.consonantIds && category.consonantIds.length > 0) {
      const firstId = category.consonantIds[0]
      const consonant = consonantsList.find(c => c.id === firstId)
      if (consonant) {
        if (isTamil) {
          thumb = getTamilConsonantLabel(consonant.devanagari)
        } else if (consonant.romanized) {
          thumb = consonant.romanized
        }
      }
    }
    return {
      ...lesson,
      title: lesson.title_english || lesson.title,
      subtitle: language === 'en'
        ? getEnglishVyanjanSubtitle(lesson.consonant_group, lesson.subtitle)
        : (isTamil
            ? (lesson.subtitle_tamil || (lesson.consonant_group === 'all' ? 'அறிமுகம்' : categoriesMap[lesson.consonant_group]?.english) || lesson.subtitle || '')
            : (lesson.subtitle || '')),
      description: language === 'en'
        ? getEnglishVyanjanDescription(lesson.consonant_group, lesson.description)
        : (isTamil
            ? localizeDigits((lesson.description_english || lesson.description || ''), 'ta')
            : (lesson.description_english || lesson.description || getEnglishVyanjanDescription(lesson.consonant_group, lesson.description))),
      thumbnail_label: thumb
    }
  })
}

export async function getVyanjanLessonContent(lessonId: string, language: string = 'hi'): Promise<VyanjanLessonContent[]> {
  const isTamil = language === 'ta'
  const data = getDataForLanguage(language)
  const vyanjanData = data.vyanjan
  const matraData = data.matras
  
  const lesson = vyanjanData.lessons.find((l: any) => l.lesson_id === lessonId)
  if (!lesson) return []

  const content: VyanjanLessonContent[] = []
  
  // Title slide
  content.push({
    id: `${lessonId}-title`,
    lesson_id: lessonId,
    content_type: 'title_slide',
    title: language === 'kn'
      ? (!isPlaceholderText(lesson.title_kannada) ? lesson.title_kannada : (KANNADA_LESSON_TITLE_MAP[lesson.lesson_id] || lesson.title))
      : (language === 'hi' ? lesson.title : (lesson.title_english || lesson.title)),
    content: language === 'kn'
      ? localizeDigits((!isPlaceholderText(lesson.description_kannada) ? lesson.description_kannada : getKannadaVyanjanDescription(lesson.consonant_group, lesson.description)), 'kn')
      : (language === 'hi'
          ? localizeDigits(lesson.description || '', 'hi')
          : (isTamil
              ? localizeDigits((lesson.description_english || lesson.description || ''), 'ta')
              : getEnglishVyanjanDescription(lesson.consonant_group, lesson.description))),
    order_no: 1
  })
  
  const categoriesMap = vyanjanData.categories as any
  const categoryKey = lesson.consonant_group
  const categoryData = categoriesMap[categoryKey]
  
  // Category Intro slide
  if (categoryData) {
    content.push({
      id: `${lessonId}-category-intro`,
      lesson_id: lessonId,
      content_type: 'text',
          title: language === 'hi'
        ? (categoryData.nameHindi || categoryData.name)
        : language === 'kn'
          ? (categoryData.nameKannada || getKannadaVyanjanSubtitle(categoryKey, categoryData.name))
          : (categoryData.english || categoryData.name),
      content: language === 'hi'
        ? (categoryData.descriptionHindi || categoryData.description)
        : language === 'kn'
          ? (categoryData.descriptionKannada || getKannadaVyanjanDescription(categoryKey, categoryData.description))
          : (categoryData.descriptionEnglish || getEnglishVyanjanDescription(categoryKey, categoryData.description)),
      order_no: 1.5
    })
  }
  
  let orderNo = 2;

  if (categoryData && categoryData.consonantIds) {
    const consonantsList = vyanjanData.consonants as unknown as Consonant[];
    for (const consonantId of categoryData.consonantIds) {
      const c = consonantsList.find(x => x.id === consonantId);
      if (c) {
        // Pronunciation slide
        content.push({
          id: `${lessonId}-letter-${c.id}`,
          lesson_id: lessonId,
          content_type: 'pronunciation',
          title: language === 'kn'
            ? getKannadaConsonantLabel(c.devanagari)
            : language === 'en'
              ? `${c.romanized.toUpperCase()} (${c.brahmi})`
              : isTamil
                ? `${getTamilConsonantLabel(c.devanagari)}`
                : `${c.devanagari} (${c.romanized})`,
          content: `${language === 'hi' ? c.categoryHindi : language === 'kn' ? getKannadaVyanjanSubtitle(c.category, c.categoryEnglish) : (categoriesMap[c.category]?.english || c.categoryEnglish)} - ${language === 'hi' ? c.categoryDescription : language === 'kn' ? getKannadaVyanjanDescription(c.category, c.categoryDescription) : (categoriesMap[c.category]?.descriptionEnglish || getEnglishVyanjanDescription(c.category, c.categoryDescription))}\n\n${language === 'hi' ? 'ध्वनि' : language === 'kn' ? KANNADA_SOUND_LABEL : (isTamil ? TAMIL_SOUND_LABEL : 'Sound')}: ${language === 'hi' ? c.pronunciationNote : language === 'kn' ? transliterateDevanagariToKannada(c.pronunciationNoteKannada || c.pronunciationNoteEnglish || c.pronunciationNote || c.romanized) : (isTamil ? (c.pronunciationNoteTamil || c.pronunciationNoteEnglish || c.pronunciationNote || c.romanized) : (c.pronunciationNoteEnglish || c.pronunciationNote || c.romanized))}\n\n${language === 'hi' ? 'उदाहरण' : language === 'kn' ? KANNADA_EXAMPLES_LABEL : (isTamil ? TAMIL_EXAMPLES_LABEL : 'Examples')}: ${c.exampleWords && c.exampleWords.length > 0 ? c.exampleWords.map((ex: any) => language === 'hi' ? ex.devanagari : language === 'kn' ? getKannadaExampleText(ex) : (isTamil ? getTamilExampleText(ex) : englishExampleText(ex))).join(", ") : ""}`,
          metadata: {
            brahmi_symbol: c.brahmi,
            devanagari: c.devanagari,
            display_label: language === 'kn'
              ? getKannadaConsonantLabel(c.devanagari)
              : (language === 'en' ? c.romanized.toUpperCase() : (isTamil ? getTamilConsonantLabel(c.devanagari) : c.devanagari)),
            sound: c.romanized
          },
          order_no: orderNo++
        });

        // Writing practice
        content.push({
          id: `${lessonId}-tracer-${c.id}`,
          lesson_id: lessonId,
          content_type: 'writing_practice',
          title: `${language === 'hi' ? 'अभ्यास' : language === 'kn' ? 'ಅಭ್ಯಾಸ' : (isTamil ? 'பயிற்சி' : 'Practice')} - ${language === 'kn' ? getKannadaConsonantLabel(c.devanagari) : (language === 'en' ? c.romanized.toUpperCase() : (isTamil ? getTamilConsonantLabel(c.devanagari) : c.devanagari))}`,
          content: `${language === 'hi' ? 'अभ्यास करें' : language === 'kn' ? 'ವ್ಯಂಜನವನ್ನು ಬರೆಯುವ ಅಭ್ಯಾಸ ಮಾಡಿ' : (isTamil ? 'மெய்யெழுத்தை எழுதிப் பயிற்சி செய்யுங்கள்' : 'Practice writing the consonant')}`,
          metadata: {
            id: c.id,
            brahmi_symbol: c.brahmi,
            devanagari: c.devanagari,
            display_label: language === 'kn'
              ? getKannadaConsonantLabel(c.devanagari)
              : (language === 'en' ? c.romanized.toUpperCase() : (isTamil ? getTamilConsonantLabel(c.devanagari) : c.devanagari))
          },
          order_no: orderNo++
        });

        // Combination practice
        const combo = matraData.consonantMatraCombinations?.find((x: any) => x.consonantId === c.id);
        if (combo && combo.forms) {
           const sampleForms = combo.forms.slice(1, 4); // AA, I, II
           sampleForms.forEach((f: any) => {
               const englishRomanized = romanizeConsonantWithMatra(c.romanized, f.matraName)
               const kannadaCombo = transliterateDevanagariToKannada(f.combinedDevanagari || '')
               const tamilCombo = transliterateDevanagariToTamil(f.combinedDevanagari || '')
               content.push({
                   id: `${lessonId}-combo-${c.id}-${f.matraOrder}`,
                   lesson_id: lessonId,
                   content_type: 'text',
                   title: language === 'en'
                     ? `Combination - ${englishRomanized}`
                     : language === 'kn'
                       ? kannadaCombo || getKannadaConsonantLabel(c.devanagari)
                       : isTamil
                         ? (tamilCombo || getTamilConsonantLabel(c.devanagari))
                       : `${c.devanagari} + ${f.matraName} = ${f.combinedDevanagari}`,
                   content: `${language === 'hi' ? 'ब्राह्मी रूप' : language === 'kn' ? 'ಬ್ರಾಹ್ಮೀ ರೂಪ' : (isTamil ? 'பிராமி வடிவம்' : 'Brahmi form')}: ${f.combinedBrahmi}`,
                   metadata: {
                     brahmi: f.combinedBrahmi,
                     devanagari: f.combinedDevanagari,
                     display_label: language === 'en'
                       ? englishRomanized.toUpperCase()
                       : (language === 'kn'
                           ? (kannadaCombo || transliterateDevanagariToKannada(f.combinedDevanagari || ''))
                           : (isTamil ? (tamilCombo || transliterateDevanagariToTamil(f.combinedDevanagari || '')) : f.combinedDevanagari))
                   },
                   order_no: orderNo++
               });
           });
        }
      }
    }
  }
  
  return content
}

/**
 * Get the next lesson ID in the Vyanjan module
 * Returns null if this is the last lesson
 */
export async function getNextVyanjanLessonId(currentLessonId: string, language: string = 'hi'): Promise<string | null> {
  const lessons = await getVyanjanLessons(language)
  const currentIndex = lessons.findIndex(l => l.lesson_id === currentLessonId)
  
  if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
    return lessons[currentIndex + 1].lesson_id
  }
  
  return null // This is the last lesson
}
