import { Identity } from './guestIdentity'
import { getDataForLanguage } from '@/backend/data/index'

const GUEST_INTRO_PROGRESS_KEY = 'brahmi_guest_intro_progress'

type GuestIntroProgress = {
  completedIds: string[]
  progressMap: Record<string, number>
  lastUpdated: string
}

// Types for introduction lessons
export type IntroLesson = {
  id: string
  module_id: string
  lesson_id: string
  title: string
  subtitle: string
  description: string
  thumbnail_icon: string
  order_no: number
  estimated_time_minutes: number
  is_completed?: boolean
}

export type IntroLessonContent = {
  id: string
  lesson_id: string
  content_type: 'title_slide' | 'text' | 'text_with_image' | 'mcq' | 'questionnaire' | 'quote' | 'key_points' | 'timeline' | 'comparison' | 'summary' | 'staircase_swar' | 'interactive_map'
  title: string
  content: string
  metadata?: any
  order_no: number
}

export type LetterStep = {
  id: string
  title: string
  content: string
  brahmi_symbol?: string
  devanagari_symbol?: string
  image_url?: string
  order_no: number
}

/**
 * Get guest intro progress from sessionStorage
 */
function getGuestIntroProgressFromStorage(): { completedIds: string[], progressMap: Record<string, number> } {
  if (typeof window === 'undefined') {
    return { completedIds: [], progressMap: {} }
  }
  try {
    const stored = sessionStorage.getItem(GUEST_INTRO_PROGRESS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as GuestIntroProgress
      return {
        completedIds: parsed.completedIds || [],
        progressMap: parsed.progressMap || {}
      }
    }
  } catch (error) {
    console.error('Error parsing guest intro progress:', error)
  }
  return { completedIds: [], progressMap: {} }
}

/**
 * Save guest intro progress to sessionStorage
 */
function saveGuestIntroProgressToStorage(completedIds: string[], progressMap: Record<string, number>) {
  if (typeof window === 'undefined') return
  try {
    const progress: GuestIntroProgress = {
      completedIds,
      progressMap,
      lastUpdated: new Date().toISOString()
    }
    sessionStorage.setItem(GUEST_INTRO_PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving guest intro progress:', error)
  }
}

/**
 * Update progress for a lesson
 */
/**
 * Update progress for a lesson
 */
export async function saveProgress(
  lessonId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progress: number,
  identity: Identity
): Promise<void> {
  if (identity.type === 'guest') {
    const { completedIds, progressMap } = getGuestIntroProgressFromStorage()
    progressMap[lessonId] = progress
    if (status === 'completed' && !completedIds.includes(lessonId)) {
      completedIds.push(lessonId)
    }
    saveGuestIntroProgressToStorage(completedIds, progressMap)
  }
}

/**
 * Save answer for interactive content
 */
export async function saveAnswer(
  lessonId: string,
  contentId: string,
  answer: string,
  isCorrect: boolean,
  identity: Identity
): Promise<void> {
  console.log(`[saveAnswer] Saving answer: lesson=${lessonId}, content=${contentId}, correct=${isCorrect}`)
  // Guest progress logic for answers could be added here if needed
}

/**
 * Get progress for all intro lessons
 */
export async function getIntroProgress(identity: Identity): Promise<{ completedIds: string[], progressMap: Record<string, number> }> {
  if (identity.type === 'guest') {
    return getGuestIntroProgressFromStorage()
  } else {
    // Persistent user progress would go here
    return { completedIds: [], progressMap: {} }
  }
}

/**
 * Get only completed lesson IDs for intro
 */
export async function getCompletedLessonIds(identity: Identity): Promise<string[]> {
  const { completedIds } = await getIntroProgress(identity)
  return completedIds
}

// Fetch introduction lessons for a specific language
export async function getIntroLessons(language: string = 'hi'): Promise<IntroLesson[]> {
  const data = getDataForLanguage(language)
  console.log(`getIntroLessons: Returning ${language} introduction lessons`)
  // Sort by order_no to ensure correct sequence
  return data.introduction.lessons.sort((a: IntroLesson, b: IntroLesson) => a.order_no - b.order_no)
}

// Fetch lesson content for a specific language
export async function getLessonContent(lessonId: string, language: string = 'hi'): Promise<IntroLessonContent[]> {
  const data = getDataForLanguage(language)
  console.log(`[getLessonContent] Returning ${language} content: lessonId=${lessonId}`)
  const lessonContent = data.introduction.content.filter((c: any) => c.lesson_id === lessonId) as IntroLessonContent[]
  return lessonContent
}

/**
 * Get the next lesson ID in the Introduction module
 * Returns null if this is the last lesson
 */
export async function getNextIntroLessonId(currentLessonId: string, language: string = 'hi'): Promise<string | null> {
  const lessons = await getIntroLessons(language)
  const currentIndex = lessons.findIndex(l => l.lesson_id === currentLessonId)
  
  if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
    return lessons[currentIndex + 1].lesson_id
  }
  
  return null // This is the last lesson
}

// Get lesson info by lesson_id for a specific language
export async function getLessonInfo(lessonId: string, language: string = 'hi'): Promise<IntroLesson | null> {
  const data = getDataForLanguage(language)
  console.log(`[getLessonInfo] Returning ${language} lesson info: lessonId=${lessonId}`)
  const lesson = data.introduction.lessons.find((l: any) => l.lesson_id === lessonId)
  return lesson || null
}

/**
 * Fetch letter steps for a specific letter and language.
 */
export async function getLetterSteps(letterId: string, language: string = 'hi'): Promise<LetterStep[]> {
  console.log(`[getLetterSteps] Generating steps: letterId=${letterId}, language=${language}`)
  const data = getDataForLanguage(language)
  const isHindi = language === 'hi'
  const isKannada = language === 'kn'
  const getVowelDisplayLabel = (vowel: any) => {
    if (isHindi) return vowel.devanagari || vowel.title_hindi || ''
    if (isKannada) return vowel.title_kannada || vowel.devanagari || ''
    return (vowel.romanized || vowel.title_english || '').toUpperCase()
  }
  const getPracticeMatraExample = (matra: any) => {
    if (!isKannada) {
      return `With matra: ${matra.example_combination}`
    }

    const kannadaExamples: Record<number, string> = {
      1: 'ಕ',
      2: 'ಕಾ',
      3: 'ಕಿ',
      4: 'ಕೀ',
      5: 'ಕು',
      6: 'ಕೂ',
      7: 'ಕೆ',
      8: 'ಕೈ',
      9: 'ಕೊ',
      10: 'ಕೌ',
      11: 'ಕಂ',
      12: 'ಕಃ'
    }

    const kannadaResult = kannadaExamples[matra?.order] || matra?.exampleDevanagari || ''
    const matraMark = matra?.matraSign || matra?.vowelBrahmi?.slice(-1) || ''
    return `ಮಾತ್ರೆಯೊಂದಿಗೆ: ಕ + ${matraMark} = ${kannadaResult}`
  }

  // Helper to build a Letter object compatible with LessonPage
  const buildLetter = (id: string, name: string, brahmi: string | null, order: number, type: 'vowel' | 'consonant') => ({
    id,
    letter_name: name,
    brahmi_symbol: brahmi || '',
    order_no: order || 0,
    letter_type: type
  })

  // Try swar (vowel) data first
  try {
    const swarData = data.swar
    if (letterId === 'practice-time' && swarData.practice_time) {
      const practiceTime = swarData.practice_time
      return [
        {
          id: 'practice-time-step-1',
          step_type: 'show',
          title: isHindi ? 'अभ्यास समय' : isKannada ? 'ಅಭ್ಯಾಸ ಸಮಯ' : 'Practice Time',
          content: isHindi
            ? 'अब आप सभी प्रश्नों और खेलों का अभ्यास कर सकते हैं।'
            : isKannada
              ? 'ಈಗ ನೀವು ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಆಟಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಬಹುದು。'
              : 'Now you can practice all quizzes and games.',
          order_no: 1,
          letters: buildLetter('practice-time', practiceTime.title_hindi || practiceTime.title_english || 'Practice Time', '▶', 13, 'vowel')
        },
        {
          id: 'practice-time-step-2',
          step_type: 'explanation',
          title: isHindi ? 'गेम टाइम' : isKannada ? 'ಆಟದ ಸಮಯ' : 'Game Time',
          content: isHindi
            ? 'देवनागरी → ब्राह्मी. अब आप सभी 12 स्वर प्रश्नों का अभ्यास कर सकते हैं.'
            : isKannada
              ? 'ಕನ್ನಡ → ಬ್ರಾಹ್ಮೀ. ಈಗ ನೀವು ಎಲ್ಲಾ 12 ಸ್ವರ ಪ್ರಶ್ನೆಗಳ ಅಭ್ಯಾಸ ಮಾಡಬಹುದು.'
              : 'Roman/Latin → Brahmi. Now you can practice all 12 vowel questions.',
          order_no: 2,
          letters: buildLetter('practice-time', practiceTime.title_hindi || practiceTime.title_english || 'Practice Time', '▶', 13, 'vowel')
        },
        {
          id: 'practice-time-step-3',
          step_type: 'quiz',
          title: isHindi ? 'क्विज़' : isKannada ? 'ಪ್ರಶ್ನೋತ್ತರ' : 'Quiz',
          content: isHindi
            ? 'अब सभी स्वर प्रश्नों और उल्टे प्रश्नों का अभ्यास करें।'
            : isKannada
              ? 'ಈಗ ಎಲ್ಲಾ ಸ್ವರ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ವಿರುದ್ಧ ಪ್ರಶ್ನೆಗಳ ಅಭ್ಯಾಸ ಮಾಡಿ。'
              : 'Now practice all vowel questions and reverse questions.',
          order_no: 3,
          letters: buildLetter('practice-time', practiceTime.title_hindi || practiceTime.title_english || 'Practice Time', '▶', 13, 'vowel')
        },
        {
          id: 'practice-time-step-4',
          step_type: 'reward',
          title: isHindi ? 'पुरस्कार' : isKannada ? 'ಬಹುಮಾನ' : 'Reward',
          content: isHindi
            ? 'अभ्यास समय पूरा हुआ।'
            : isKannada
              ? 'ಅಭ್ಯಾಸ ಸಮಯ ಪೂರ್ಣಗೊಂಡಿದೆ。'
              : 'Practice Time completed.',
          order_no: 4,
          letters: buildLetter('practice-time', practiceTime.title_hindi || practiceTime.title_english || 'Practice Time', '▶', 13, 'vowel')
        }
      ] as unknown as LetterStep[]
    }
    const vowel = swarData.vowels.find((v: any) => v.id === letterId || v.devanagari === letterId)
    if (vowel) {
      const vowelLabel = getVowelDisplayLabel(vowel)
      const letters = buildLetter(vowel.id, vowelLabel, vowel.brahmi || '', vowel.order || 0, 'vowel')
      const steps: any[] = [
        {
          id: `${letterId}-step-1`,
          step_type: 'show',
          title: isHindi ? 'पहचान' : isKannada ? 'ಗುರುತು' : 'Identification',
          content: isHindi
            ? `यह स्वर '${vowelLabel}' है।`
            : isKannada
              ? `ಇದು ಸ್ವರ '${vowelLabel}' ಆಗಿದೆ।`
              : `This is the vowel '${vowelLabel}'.`,
          order_no: 1,
          letters
        }
      ]

      // Add Pronunciation step
      if (vowel.devanagari) {
        steps.push({
          id: `${letterId}-step-pronunciation`,
          step_type: 'sound',
          title: isHindi ? 'उच्चारण' : isKannada ? 'ಉಚ್ಚಾರಣೆ' : 'Pronunciation',
          content: isHindi 
            ? `इस स्वर का उच्चारण ‘${vowelLabel}’ होता है।` 
            : isKannada
              ? `ಈ ಸ್ವರವನ್ನು ‘${vowelLabel}’ ಎಂದು ಉಚ್ಚರಿಸಲಾಗುತ್ತದೆ。`
              : `This vowel is pronounced as '${vowelLabel}'.`,
          order_no: 2,
          letters
        })
      }

      // Add More Info step
      const description = isHindi
        ? (vowel.description_hindi || vowel.description_english)
        : isKannada
          ? (vowel.description_kannada || vowel.description_english || vowel.description_hindi)
          : (vowel.description_english || vowel.description_hindi);
      if (description) {
        steps.push({
          id: `${letterId}-step-description`,
          step_type: 'explanation',
          title: isHindi ? 'विवरण' : isKannada ? 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ' : 'More Info',
          content: description,
          order_no: 3,
          letters
        })
      }

      // Add Example step (try to find matching matra)
      const matraData = data.matras
      const matra = (matraData.matras || []).find((m: any) => m.vowelDevanagari === vowel.devanagari)
      if (matra && matra.example_combination) {
        steps.push({
          id: `${letterId}-step-example`,
          step_type: 'example',
          title: isHindi ? 'उदाहरण' : isKannada ? 'ಉದಾಹರಣೆ' : 'Example',
          content: isHindi
            ? `मात्रा के साथ: ${matra.example_combination}`
            : isKannada
              ? getPracticeMatraExample(matra)
              : `With matra: ${matra.example_combination}`,
          order_no: 4,
          letters
        })
      }

      return steps as unknown as LetterStep[]
    }
  } catch (e) {
    console.error('Error reading swar data in getLetterSteps', e)
  }

  // Try vyanjan (consonant) data next
  try {
    const vyanjanData = data.vyanjan
    const consonant = vyanjanData.consonants.find((c: any) => c.id === letterId || c.devanagari === letterId)
    if (consonant) {
      const letters = buildLetter(consonant.id, consonant.devanagari || '', consonant.brahmi || '', consonant.order || 0, 'consonant')
      const steps: any[] = [
        {
          id: `${letterId}-step-1`,
          step_type: 'show',
          title: language === 'hi' ? 'पहचान' : 'Identification',
          content: language === 'hi' ? `यह व्यंजन '${consonant.devanagari}' है।` : `This is the consonant '${consonant.devanagari}'.`,
          order_no: 1,
          letters
        }
      ]

      // Add Pronunciation step
      if (consonant.devanagari) {
        steps.push({
          id: `${letterId}-step-pronunciation`,
          step_type: 'sound',
          title: language === 'hi' ? 'उच्चारण' : 'Pronunciation',
          content: language === 'hi' 
            ? `इस व्यंजन का उच्चारण ‘${consonant.devanagari}’ होता है।` 
            : `This consonant is pronounced as '${consonant.romanized || consonant.devanagari}'.`,
          order_no: 2,
          letters
        })
      }

      // Add Category step
      const category = language === 'hi' ? (consonant.categoryHindi || consonant.categoryEnglish) : (consonant.categoryEnglish || consonant.categoryHindi);
      if (category) {
        steps.push({
          id: `${letterId}-step-category`,
          step_type: 'explanation',
          title: language === 'hi' ? 'वर्ग' : 'Category',
          content: language === 'hi' ? `यह '${category}' वर्ग का व्यंजन है।` : `This consonant belongs to the '${category}' category.`,
          order_no: 3,
          letters
        })
      }

      // Add More Info step
      const note = language === 'hi' ? (consonant.pronunciationNote || consonant.pronunciationNoteEnglish) : (consonant.pronunciationNoteEnglish || consonant.pronunciationNote);
      if (note) {
        steps.push({
          id: `${letterId}-step-description`,
          step_type: 'explanation',
          title: language === 'hi' ? 'विवरण' : 'More Info',
          content: note,
          order_no: 4,
          letters
        })
      }

      // Add Example step
      if (consonant.exampleWords && consonant.exampleWords.length > 0) {
        const examples = consonant.exampleWords.map((ex: any) => `${ex.devanagari} (${ex.romanized})`).join(', ')
        steps.push({
          id: `${letterId}-step-example`,
          step_type: 'example',
          title: language === 'hi' ? 'उदाहरण' : 'Examples',
          content: language === 'hi' ? `उदाहरण शब्द: ${examples}` : `Example words: ${examples}`,
          order_no: 5,
          letters
        })
      }

      return steps as unknown as LetterStep[]
    }
  } catch (e) {
    console.error('Error reading vyanjan data in getLetterSteps', e)
  }

  // Try matras data (example / fallback)
  try {
    const matraData = data.matras

    // First try to resolve matra by lesson mapping: some routes pass a lesson_id like 'matras-lesson-005'
    const matraLesson = (matraData.lessons || []).find((l: any) => l.lesson_id === letterId)
    let matra: any | undefined

    if (matraLesson) {
      const lessonSymbol = matraLesson.matra_symbol
      // Try to find a matra entry matching the lesson's matra symbol or order
      matra = (matraData.matras || []).find((m: any) =>
        m.matraSign === lessonSymbol || m.vowelBrahmi === lessonSymbol || (m.exampleBrahmi && m.exampleBrahmi.includes(lessonSymbol)) || m.order === matraLesson.order_no
      )

      // If not found, construct a minimal matra object from the lesson data as a fallback
      if (!matra) {
        matra = {
          id: matraLesson.lesson_id,
          order: matraLesson.order_no || 0,
          vowelDevanagari: matraLesson.title || '',
          matraName: matraLesson.title || '',
          matraSign: matraLesson.matra_symbol || '',
          exampleBrahmi: matraLesson.matra_symbol || ''
        }
      }
    } else {
      matra = (matraData.matras || []).find((m: any) => m.id === letterId || m.matraId === letterId)
    }

    if (matra) {
      const letters = buildLetter(
        matra.id || letterId,
        matra.exampleDevanagari || matra.matraName || '',
        // Prefer the standalone matra sign if available for tracing, otherwise fallback to example brahmi
        matra.matraSign || matra.exampleBrahmi || matra.vowelBrahmi || '',
        matra.order || 0,
        'vowel'
      )
      const steps: any[] = [
        {
          id: `${letterId}-step-1`,
          step_type: 'show',
          title: language === 'hi' ? 'पहचान' : 'Identification',
          content: language === 'hi' ? `यह मात्रा '${matra.vowelDevanagari || matra.matraName}' है।` : `This is the matra '${matra.vowelDevanagari || matra.matraName}'.`,
          order_no: 1,
          letters
        }
      ]

      // Add More Info step
      const description = language === 'hi' ? (matra.description || matra.descriptionEnglish) : (matra.descriptionEnglish || matra.description);
      if (description) {
        steps.push({
          id: `${letterId}-step-2`,
          step_type: 'explanation',
          title: language === 'hi' ? 'विवरण' : 'More Info',
          content: description,
          order_no: 2,
          letters
        })
      }

      // Add Example step
      if (matra.example_combination) {
        steps.push({
          id: `${letterId}-step-3`,
          step_type: 'example',
          title: isHindi ? 'उदाहरण' : isKannada ? 'ಉದಾಹರಣೆ' : 'Example',
          content: isHindi ? `संयोजन: ${matra.example_combination}` : isKannada ? `ಸಂಯೋಜನೆ: ${matra.example_combination}` : `Combination: ${matra.example_combination}`,
          order_no: 3,
          letters
        })
      }

      return steps as unknown as LetterStep[]
    }
  } catch (e) {
    console.error('Error reading matra data in getLetterSteps', e)
  }

  // If nothing found, return empty
  console.warn(`[getLetterSteps] No letter found for id=${letterId}`)
  return []
}

/**
 * Fetch quiz questions for a specific letter and language.
 */
export async function getLetterQuiz(letterId: string, language: string = 'hi'): Promise<any[]> {
  console.log(`[getLetterQuiz] Fetching quiz: letterId=${letterId}, language=${language}`)
  const data = getDataForLanguage(language)
  const quizQuestions: any[] = []
  const isHindi = language === 'hi'
  const isKannada = language === 'kn'
  const getQuestionText = (hindiText: string, englishText: string, kannadaText: string) =>
    isHindi ? hindiText : isKannada ? kannadaText : englishText

  const getVowelLabel = (vowelId: string): string => {
    const vowel = data.swar?.vowels?.find((entry: any) => entry.id === vowelId)
    if (isHindi) return vowel?.title_hindi || vowel?.devanagari || ''
    if (isKannada) return vowel?.title_kannada || vowel?.devanagari || ''
    return vowel?.title_english || vowel?.romanized || ''
  }

  const getKannadaConsonantLabel = (consonantIdOrDevanagari: string): string => {
    const consonant = data.vyanjan?.consonants?.find((entry: any) => entry.id === consonantIdOrDevanagari || entry.devanagari === consonantIdOrDevanagari)
    return consonant?.title_kannada || consonant?.devanagari || ''
  }

  const getTrueFalseQuestionText = (order: number): string => {
    if (isHindi) {
      return [
        '"अ" का चिह्न [𑀅] है?',
        '"आ" का चिह्न [𑀇] है?',
        '"इ" का चिह्न [𑀆] है?',
        '"ई" का चिह्न [𑀈] है?',
        '"उ" का चिह्न [𑀊] है?',
        '"ऊ" का चिह्न [𑀐] है?',
        '"ए" का चिह्न [𑀏] है?',
        '"ऐ" का चिह्न [𑀐] है?',
        '"ओ" का चिह्न [𑀊] है?',
        '"औ" का चिह्न [𑀈] है?',
        '"अं" का चिह्न [𑀅𑀁] है?',
        '"अः" का चिह्न [𑀅𑀂] है?'
      ][order - 1] || ''
    }
    if (isKannada) {
      return [
        '"ಅ" ಯ ಚಿಹ್ನೆ [𑀅] ಆಗಿದೆಯೇ?',
        '"ಆ" ಯ ಚಿಹ್ನೆ [𑀇] ಆಗಿದೆಯೇ?',
        '"ಇ" ಯ ಚಿಹ್ನೆ [𑀆] ಆಗಿದೆಯೇ?',
        '"ಈ" ಯ ಚಿಹ್ನೆ [𑀈] ಆಗಿದೆಯೇ?',
        '"ಉ" ಯ ಚಿಹ್ನೆ [𑀊] ಆಗಿದೆಯೇ?',
        '"ಊ" ಯ ಚಿಹ್ನೆ [𑀐] ಆಗಿದೆಯೇ?',
        '"ಏ" ಯ ಚಿಹ್ನೆ [𑀏] ಆಗಿದೆಯೇ?',
        '"ಐ" ಯ ಚಿಹ್ನೆ [𑀐] ಆಗಿದೆಯೇ?',
        '"ಒ" ಯ ಚಿಹ್ನೆ [𑀊] ಆಗಿದೆಯೇ?',
        '"ಔ" ಯ ಚಿಹ್ನೆ [𑀈] ಆಗಿದೆಯೇ?',
        '"ಅಂ" ಯ ಚಿಹ್ನೆ [𑀅𑀁] ಆಗಿದೆಯೇ?',
        '"ಅಃ" ಯ ಚಿಹ್ನೆ [𑀅𑀂] ಆಗಿದೆಯೇ?'
      ][order - 1] || ''
    }
    return [
      '"Is Brahmi a language?"'
    ][0] || ''
  }

  // 1. Try Swar Quizzes
  if (data.swar) {
    const swar = data.swar

    const isPracticeMode = letterId === 'practice-time'
    const q1Source = isPracticeMode ? (swar.quiz1_devanagari_to_brahmi || []) : (swar.quiz1_devanagari_to_brahmi || []).filter((q: any) => q.correct_vowel_id === letterId)
    const q2Source = isPracticeMode ? (swar.quiz2_brahmi_to_devanagari || []) : (swar.quiz2_brahmi_to_devanagari || []).filter((q: any) => q.correct_vowel_id === letterId)
    const tfSource = isPracticeMode ? (swar.true_false_questions || []) : (swar.true_false_questions || []).filter((q: any) => q.vowel_id === letterId)
    
    // Quiz 1: Devanagari to Brahmi
    q1Source.forEach((q: any) => {
      quizQuestions.push({
        id: q.id,
        letter_id: letterId,
        question: isKannada
          ? `${getVowelLabel(q.correct_vowel_id) || q.question} ಗೆ ಸರಿಯಾದ ಬ್ರಾಹ್ಮೀ ಚಿಹ್ನೆ ಯಾವುದು?`
          : getQuestionText(q.title_hindi, q.title_english, getVowelLabel(q.correct_vowel_id) || q.title_english),
        order_no: q.order,
        options: [
          { id: `${q.id}-opt-correct`, question_id: q.id, option_text: q.correct_answer, is_correct: true, order_no: 1 },
          ...q.wrong_options.map((w: any, idx: number) => ({
            id: `${q.id}-opt-wrong-${idx}`,
            question_id: q.id,
            option_text: w.brahmi,
            is_correct: false,
            order_no: idx + 2
          }))
        ].sort(() => Math.random() - 0.5)
      })
    })

    // Quiz 2: Brahmi to Devanagari
    q2Source.forEach((q: any) => {
      quizQuestions.push({
        id: q.id,
        letter_id: letterId,
        question: isKannada
          ? `${q.question} ಗೆ ಸರಿಯಾದ ಕನ್ನಡ ಅಕ್ಷರ ಯಾವುದು?`
          : getQuestionText(
              q.title_hindi,
              q.title_english,
              `${q.question} ${getVowelLabel(q.correct_vowel_id)}`
            ),
        order_no: q.order,
        options: [
          { id: `${q.id}-opt-correct`, question_id: q.id, option_text: isKannada ? getVowelLabel(q.correct_vowel_id) : (isHindi ? q.correct_answer : (q.correct_romanized || q.correct_answer || getVowelLabel(q.correct_vowel_id))), is_correct: true, order_no: 1 },
          ...q.wrong_options.map((w: any, idx: number) => ({
            id: `${q.id}-opt-wrong-${idx}`,
            question_id: q.id,
            option_text: isKannada ? getVowelLabel(w.vowel_id) : (isHindi ? w.devanagari : (w.romanized || w.devanagari || getVowelLabel(w.vowel_id))),
            is_correct: false,
            order_no: idx + 2
          }))
        ].sort(() => Math.random() - 0.5)
      })
    })

    // True/False questions
    tfSource.forEach((q: any) => {
      quizQuestions.push({
        id: q.id,
        letter_id: letterId,
        question: isPracticeMode
          ? getQuestionText('सही / गलत', 'True / False', 'ಸರಿ / ತಪ್ಪು')
          : getTrueFalseQuestionText(q.order),
        order_no: q.order,
        options: [
          { id: `${q.id}-opt-true`, question_id: q.id, option_text: getQuestionText('सत्य (True)', 'True', 'ಸರಿ'), is_correct: q.correct_answer === true, order_no: 1 },
          { id: `${q.id}-opt-false`, question_id: q.id, option_text: getQuestionText('असत्य (False)', 'False', 'ತಪ್ಪು'), is_correct: q.correct_answer === false, order_no: 2 }
        ]
      })
    })
  }

  // 2. Try Vyanjan Quizzes (Auto-generated matching)
  if (data.vyanjan) {
    const vyanjan = data.vyanjan
    const consonant = (vyanjan.consonants || []).find((c: any) => c.id === letterId)
    if (consonant) {
      const kannadaCorrectLabel = getKannadaConsonantLabel(consonant.id)
      // Add a Devanagari to Brahmi matching question
      quizQuestions.push({
        id: `quiz-vyanjan-${letterId}-1`,
        letter_id: letterId,
        question: getQuestionText(
          `देवनागरी '${consonant.devanagari}' के लिए सही ब्राह्मी अक्षर चुनें:`,
          `Choose the correct Brahmi for '${consonant.romanized || consonant.devanagari}':`,
          `ದೇವನಾಗರೀ '${consonant.devanagari}' ಗೆ ಸರಿಯಾದ ಬ್ರಾಹ್ಮೀ ಅಕ್ಷರವನ್ನು ಆಯ್ಕೆಮಾಡಿ:`
        ),
        order_no: 1,
        options: [
          { id: `opt-v1-correct`, question_id: `quiz-vyanjan-${letterId}-1`, option_text: consonant.brahmi, is_correct: true, order_no: 1 },
          // Pick 3 random wrong options from other consonants
          ...vyanjan.consonants
            .filter((c: any) => c.id !== letterId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((w: any, idx: number) => ({
              id: `opt-v1-wrong-${idx}`,
              question_id: `quiz-vyanjan-${letterId}-1`,
              option_text: w.brahmi,
              is_correct: false,
              order_no: idx + 2
            }))
        ].sort(() => Math.random() - 0.5)
      })

      // Add a Brahmi to Devanagari matching question
      quizQuestions.push({
        id: `quiz-vyanjan-${letterId}-2`,
        letter_id: letterId,
        question: getQuestionText(
          `ब्राह्मी '${consonant.brahmi}' के लिए सही देवनागरी अक्षर चुनें:`,
          `Choose the correct Kannada letter for Brahmi '${consonant.brahmi}':`,
          `ಬ್ರಾಹ್ಮೀ '${consonant.brahmi}' ಗೆ ಸರಿಯಾದ ದೇವನಾಗರೀ ಅಕ್ಷರವನ್ನು ಆಯ್ಕೆಮಾಡಿ:`
        ),
        order_no: 2,
        options: [
          { id: `opt-v2-correct`, question_id: `quiz-vyanjan-${letterId}-2`, option_text: isKannada ? kannadaCorrectLabel : (isHindi ? consonant.devanagari : (consonant.romanized || consonant.devanagari)), is_correct: true, order_no: 1 },
          // Pick 3 random wrong options from other consonants
          ...vyanjan.consonants
            .filter((c: any) => c.id !== letterId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((w: any, idx: number) => ({
              id: `opt-v2-wrong-${idx}`,
              question_id: `quiz-vyanjan-${letterId}-2`,
              option_text: isKannada ? getKannadaConsonantLabel(w.id) : (isHindi ? w.devanagari : (w.romanized || w.devanagari)),
              is_correct: false,
              order_no: idx + 2
            }))
        ].sort(() => Math.random() - 0.5)
      })
    }
  }

  return quizQuestions
}
