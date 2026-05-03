import { Identity } from './guestIdentity'
import introData from '@/backend/data/introduction.json'

const GUEST_INTRO_PROGRESS_KEY = 'brahmi_guest_intro_progress'

type GuestIntroProgress = {
  completedIds: string[]
  progressMap: Record<string, number>
  lastUpdated: string
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
    if (!stored) {
      return { completedIds: [], progressMap: {} }
    }
    const progress: GuestIntroProgress = JSON.parse(stored)
    return {
      completedIds: progress.completedIds || [],
      progressMap: progress.progressMap || {}
    }
  } catch (error) {
    console.error('Error reading guest intro progress:', error)
    return { completedIds: [], progressMap: {} }
  }
}

/**
 * Save guest intro progress to sessionStorage
 */
function saveGuestIntroProgressToStorage(completedIds: string[], progressMap: Record<string, number>): void {
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

// Types matching database schema
export type Module = {
  id: string
  module_id: string
  title: string
  subtitle: string
  description: string
  icon: string
  icon_type: 'emoji' | 'text'
  order_no: number
  is_locked: boolean
  route: string
}

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
}

export type ContentType = 
  | 'title_slide'
  | 'text'
  | 'text_with_image'
  | 'quote'
  | 'timeline'
  | 'comparison'
  | 'key_points'
  | 'interactive_map'
  | 'video'
  | 'summary'
  | 'questionnaire'
  | 'staircase_swar'
  | 'mcq'

export type IntroLessonContent = {
  id: string
  lesson_id: string
  content_type: ContentType
  title?: string
  content?: string
  image_url?: string
  metadata?: any
  order_no: number
}

export type ModuleProgress = {
  id: string
  user_id: string
  module_id: string
  lesson_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  completed_at?: string
}

export type IntroLessonAnswer = {
  id: string
  user_id?: string
  guest_id?: string
  lesson_id: string
  content_id: string
  answer: string
  is_correct: boolean | null
  attempt_number: number
  answered_at: string
}

export type Letter = {
  id: string
  letter_name: string
  brahmi_symbol: string
  order_no: number
  letter_type: 'vowel' | 'consonant'
}

export type LetterStep = {
  id: string
  letter_id: string
  step_type: 'show' | 'sound' | 'explanation' | 'example' | 'practice' | 'complete'
  content: string
  order_no: number
  language: string
  letters: Letter
}

// Fetch all modules (language-independent structure)
export async function getModules(language: string = 'hi'): Promise<Module[]> {
  // Backend data will be provided by backend service
  console.log('getModules: Waiting for backend implementation')
  return []
}

// Fetch introduction lessons for a specific language
export async function getIntroLessons(language: string = 'hi'): Promise<IntroLesson[]> {
  // Return all intro lessons from hardcoded data
  console.log('getIntroLessons: Returning hardcoded introduction lessons')
  return introData.lessons
}

// Fetch lesson content for a specific language
export async function getLessonContent(lessonId: string, language: string = 'hi'): Promise<IntroLessonContent[]> {
  // Return content for this lesson from hardcoded data
  console.log(`[getLessonContent] Returning hardcoded content: lessonId=${lessonId}, language=${language}`)
  const lessonContent = introData.content.filter(c => c.lesson_id === lessonId) as IntroLessonContent[]
  return lessonContent
}

// Get lesson info by lesson_id for a specific language
export async function getLessonInfo(lessonId: string, language: string = 'hi'): Promise<IntroLesson | null> {
  // Return lesson info from hardcoded data
  console.log(`[getLessonInfo] Returning hardcoded lesson info: lessonId=${lessonId}, language=${language}`)
  const lesson = introData.lessons.find(l => l.lesson_id === lessonId)
  return lesson || null
}

// Save progress
export async function saveProgress(
  lessonId: string, 
  status: 'in_progress' | 'completed',
  progressPercentage: number,
  identity?: Identity
): Promise<boolean> {
  // Handle guest progress
  if (!identity || identity.type === 'guest') {
    // Save to sessionStorage for quick access
    const { completedIds, progressMap } = getGuestIntroProgressFromStorage()
    const newProgressMap = { ...progressMap, [lessonId]: progressPercentage }
    
    if (status === 'completed' && !completedIds.includes(lessonId)) {
      saveGuestIntroProgressToStorage([...completedIds, lessonId], newProgressMap)
    } else {
      saveGuestIntroProgressToStorage(completedIds, newProgressMap)
    }
    
    // Backend will be implemented later
    console.log('saveProgress: Progress saved locally, backend sync pending')
    return true
  }

  // Handle authenticated user progress - backend implementation pending
  console.log('saveProgress: User progress will be synced with backend when available')
  return true
}

// Get user progress for intro module
export async function getUserIntroProgress(userId: string): Promise<ModuleProgress[]> {
  // Backend data will be provided by backend service
  console.log('getUserIntroProgress: Waiting for backend implementation')
  return []
}

// Get completed lesson IDs for current user or guest
export async function getCompletedLessonIds(identity?: Identity): Promise<string[]> {
  // Handle guest progress from local storage
  if (!identity || identity.type === 'guest') {
    // First try sessionStorage for quick access
    const { completedIds } = getGuestIntroProgressFromStorage()
    return completedIds
  }

  // Handle authenticated user - backend implementation pending
  console.log('getCompletedLessonIds: User progress will be fetched from backend when available')
  return []
}

// =====================================================
// ANSWER TRACKING FUNCTIONS
// =====================================================

/**
 * Save a user's answer to a question (MCQ, questionnaire, etc.)
 */
export async function saveAnswer(
  lessonId: string,
  contentId: string,
  answer: string,
  isCorrect: boolean | null,
  identity: Identity
): Promise<boolean> {
  // Backend implementation pending
  console.log(`saveAnswer: Answer saved locally. Backend sync pending: ${lessonId}, ${contentId}`)
  return true
}

/**
 * Get user's answers for a specific lesson
 */
export async function getAnswersForLesson(
  lessonId: string,
  identity: Identity
): Promise<IntroLessonAnswer[]> {
  // Backend implementation pending
  console.log(`getAnswersForLesson: Waiting for backend implementation for ${lessonId}`)
  return []
}

/**
 * Save guest progress to database
 */
export async function saveGuestProgressToDB(
  lessonId: string,
  status: 'in_progress' | 'completed',
  progressPercentage: number,
  guestId: string
): Promise<boolean> {
  // Backend implementation pending
  console.log(`saveGuestProgressToDB: Waiting for backend implementation for guest ${guestId}`)
  return true
}

// =====================================================
// LETTER STEPS FUNCTIONS (FOR LESSONS WITH LANGUAGE SUPPORT)
// =====================================================

/**
 * Fetch letter steps for a specific letter and language.
 * Generates steps dynamically from swar.json (vowels) data.
 */
export async function getLetterSteps(letterId: string, language: string = 'hi'): Promise<LetterStep[]> {
  console.log(`[getLetterSteps] Generating steps from local data: letterId=${letterId}, language=${language}`)

  // --- Try swar (vowel) data first ---
  try {
    const swarData = (await import('@/backend/data/swar.json')).default
    const vowels = swarData.vowels as Array<{
      id: string
      order: number
      devanagari: string
      brahmi: string
      romanized: string
      title_hindi: string
      title_english: string
      description_hindi: string
      description_english: string
      pronunciation: string
      special_mark?: string
    }>

    const vowel = vowels.find((v) => v.id === letterId)

    if (vowel) {
      const isHindi = language === 'hi'
      const title = isHindi ? vowel.title_hindi : vowel.title_english
      const description = isHindi ? vowel.description_hindi : vowel.description_english

      const letterObj: Letter = {
        id: vowel.id,
        letter_name: vowel.devanagari,
        brahmi_symbol: vowel.brahmi,
        order_no: vowel.order,
        letter_type: 'vowel',
      }

      const steps: LetterStep[] = [
        {
          id: `${letterId}-step-show`,
          letter_id: letterId,
          step_type: 'show',
          content: isHindi
            ? `यह है "${vowel.devanagari}" (${title}) का ब्राह्मी लिपि में रूप।`
            : `This is "${vowel.devanagari}" (${title}) in Brahmi script.`,
          order_no: 1,
          language,
          letters: letterObj,
        },
        {
          id: `${letterId}-step-sound`,
          letter_id: letterId,
          step_type: 'sound',
          content: isHindi
            ? `"${vowel.devanagari}" की ध्वनि: "${vowel.pronunciation}" — इसे "${vowel.romanized}" के रूप में रोमन में लिखा जाता है।`
            : `Sound of "${vowel.devanagari}": "${vowel.pronunciation}" — romanized as "${vowel.romanized}".`,
          order_no: 2,
          language,
          letters: letterObj,
        },
        {
          id: `${letterId}-step-explanation`,
          letter_id: letterId,
          step_type: 'explanation',
          content: description,
          order_no: 3,
          language,
          letters: letterObj,
        },
        {
          id: `${letterId}-step-complete`,
          letter_id: letterId,
          step_type: 'complete',
          content: isHindi
            ? `शाबाश! आपने "${vowel.devanagari}" (${title}) सीख लिया। अब अभ्यास करें।`
            : `Well done! You've learned "${vowel.devanagari}" (${title}). Now let's practice!`,
          order_no: 4,
          language,
          letters: letterObj,
        },
      ]

      console.log(`[getLetterSteps] Generated ${steps.length} steps for vowel ${letterId}`)
      return steps
    }
  } catch (err) {
    console.error('[getLetterSteps] Error reading swar data:', err)
  }

  console.warn(`[getLetterSteps] No data found for letterId=${letterId}`)
  return []
}
