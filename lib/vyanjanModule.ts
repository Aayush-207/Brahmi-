import { Identity } from './guestIdentity'
import vyanjanData from '@/backend/data/vyanjan.json'

const GUEST_VYANJAN_PROGRESS_KEY = 'brahmi_guest_vyanjan_progress'

type GuestVyanjanProgress = {
  completedIds: string[]
  progressMap: Record<string, number>
  lastUpdated: string
}

/**
 * Get guest vyanjan progress from sessionStorage
 */
function getGuestVyanjanProgressFromStorage(): { completedIds: string[], progressMap: Record<string, number> } {
  if (typeof window === 'undefined') {
    return { completedIds: [], progressMap: {} }
  }
  try {
    const stored = sessionStorage.getItem(GUEST_VYANJAN_PROGRESS_KEY)
    if (!stored) {
      return { completedIds: [], progressMap: {} }
    }
    const progress: GuestVyanjanProgress = JSON.parse(stored)
    return {
      completedIds: progress.completedIds || [],
      progressMap: progress.progressMap || {}
    }
  } catch (error) {
    console.error('Error reading guest vyanjan progress:', error)
    return { completedIds: [], progressMap: {} }
  }
}

/**
 * Save guest vyanjan progress to sessionStorage
 */
function saveGuestVyanjanProgressToStorage(completedIds: string[], progressMap: Record<string, number>): void {
  if (typeof window === 'undefined') return
  try {
    const progress: GuestVyanjanProgress = {
      completedIds,
      progressMap,
      lastUpdated: new Date().toISOString()
    }
    sessionStorage.setItem(GUEST_VYANJAN_PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving guest vyanjan progress:', error)
  }
}

// Types matching database schema

export type Consonant = {
  id: string
  order: number
  category: 'kanthya' | 'talavya' | 'murdhanya' | 'dantya' | 'osthya' | 'antahstha' | 'ushma'
  categoryHindi: string
  categoryEnglish: string
  categoryDescription: string
  devanagari: string
  brahmi: string
  unicode_codepoint: string
  romanized: string
  pronunciationNote: string
  exampleWords: Array<{
    devanagari: string
    romanized: string
    english: string
  }>
}

export type VyanjanLesson = {
  id: string
  module_id: string
  lesson_id: string
  title: string
  subtitle: string
  description: string
  thumbnail_icon: string
  consonant_group: string
  order_no: number
  estimated_time_minutes: number
}

export type VyanjanContentType = 
  | 'title_slide'
  | 'text'
  | 'text_with_image'
  | 'consonant_intro'
  | 'pronunciation'
  | 'writing_practice'
  | 'examples'
  | 'comparison'
  | 'key_points'
  | 'video'
  | 'mcq'
  | 'summary'

export type VyanjanLessonContent = {
  id: string
  lesson_id: string
  content_type: VyanjanContentType
  title?: string
  content?: string
  image_url?: string
  metadata?: any
  order_no: number
}

export type VyanjanProgress = {
  id: string
  user_id: string
  module_id: string
  lesson_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  score?: number
  completed_at?: string
}

export type VyanjanLessonAnswer = {
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

/**
 * Fetch all vyanjan lessons for a specific language
 */
export async function getVyanjanLessons(language: string = 'hi'): Promise<VyanjanLesson[]> {
  console.log(`[getVyanjanLessons] Returning hardcoded vyanjan data: 8 lessons`)
  return vyanjanData.lessons as unknown as VyanjanLesson[]
}

/**
 * Fetch vyanjan lesson content for a specific language
 */
export async function getVyanjanLessonContent(lessonId: string, language: string = 'hi'): Promise<VyanjanLessonContent[]> {
  console.log(`[getVyanjanLessonContent] Returning vyanjan content for lesson: ${lessonId}`)
  // Find the lesson
  const lesson = (vyanjanData.lessons as unknown as VyanjanLesson[]).find(l => l.lesson_id === lessonId)
  if (!lesson) return []
  
  // Generate content based on lesson category
  const content: VyanjanLessonContent[] = []
  
  // Title slide
  content.push({
    id: `${lessonId}-title`,
    lesson_id: lessonId,
    content_type: 'title_slide',
    title: lesson.title,
    content: lesson.description,
    order_no: 1
  })
  
  // Consonant introduction slides
  const categoriesMap = vyanjanData.categories as any
  const categoryKey = lesson.consonant_group
  const categoryData = categoriesMap[categoryKey]
  
  let orderNo = 2;

  if (categoryData && categoryData.consonantIds) {
    const consonantsList = vyanjanData.consonants as unknown as Consonant[];
    for (const consonantId of categoryData.consonantIds) {
      const c = consonantsList.find(x => x.id === consonantId);
      if (c) {
        // Add pronunciation/intro slide for individual letter
        content.push({
          id: `${lessonId}-letter-${c.id}`,
          lesson_id: lessonId,
          content_type: 'pronunciation',
          title: `${c.devanagari} (${c.romanized})`,
          content: `${c.categoryHindi} - ${c.categoryDescription}\n\nध्वनि: ${c.pronunciationNote}\n\nउदाहरण: ${c.exampleWords && c.exampleWords.length > 0 ? c.exampleWords.map((ex: any) => ex.devanagari).join(", ") : ""}`,
          metadata: {
            brahmi_symbol: c.brahmi,
            devanagari: c.devanagari,
            sound: c.romanized
          },
          order_no: orderNo++
        });

        // Add tracer
        content.push({
          id: `${lessonId}-tracer-${c.id}`,
          lesson_id: lessonId,
          content_type: 'writing_practice',
          title: `अभ्यास (Practice) - ${c.devanagari}`,
          content: `ब्राह्मी लिपि में '${c.devanagari}' का अभ्यास करें`,
          metadata: {
            character: c.brahmi
          },
          order_no: orderNo++
        });
      }
    }
  } else if (categoryKey === 'all') {
    content.push({
      id: `${lessonId}-intro`,
      lesson_id: lessonId,
      content_type: 'text',
      title: lesson.title,
      content: lesson.description || '',
      order_no: orderNo++
    });
  }

  return content
}

/**
 * Get vyanjan lesson info by lesson_id for a specific language
 */
export async function getVyanjanLessonInfo(lessonId: string, language: string = 'hi'): Promise<VyanjanLesson | null> {
  console.log(`[getVyanjanLessonInfo] Fetching vyanjan lesson: ${lessonId}`)
  const lesson = (vyanjanData.lessons as unknown as VyanjanLesson[]).find(l => l.lesson_id === lessonId)
  return lesson || null
}

/**
 * Get all consonants (व्यञ्जन)
 */
export async function getConsonants(): Promise<Consonant[]> {
  console.log('[getConsonants] Returning hardcoded vyanjan data: 33 consonants')
  return vyanjanData.consonants as unknown as Consonant[]
}

/**
 * Get a specific consonant by ID
 */
export async function getConsonant(consonantId: string): Promise<Consonant | null> {
  console.log(`[getConsonant] Fetching consonant: ${consonantId}`)
  const consonant = (vyanjanData.consonants as unknown as Consonant[]).find((c) => c.id === consonantId)
  return consonant || null
}

/**
 * Save vyanjan progress
 */
export async function saveVyanjanProgress(
  lessonId: string, 
  status: 'in_progress' | 'completed',
  progressPercentage: number,
  identity?: Identity,
  score?: number,
  language: string = 'hi'
): Promise<boolean> {
  // Save to sessionStorage for quick access
  const { completedIds, progressMap } = getGuestVyanjanProgressFromStorage()
  const newProgressMap = { ...progressMap, [lessonId]: progressPercentage }
  
  if (status === 'completed' && !completedIds.includes(lessonId)) {
    saveGuestVyanjanProgressToStorage([...completedIds, lessonId], newProgressMap)
  } else {
    saveGuestVyanjanProgressToStorage(completedIds, newProgressMap)
  }
  
  console.log('Vyanjan progress: Waiting for backend implementation')
  return true
}

/**
 * Get user vyanjan progress
 */
export async function getUserVyanjanProgress(userId: string): Promise<VyanjanProgress[]> {
  console.log('User vyanjan progress: Waiting for backend implementation')
  return []
}

/**
 * Get completed vyanjan lesson IDs for current user or guest
 */
export async function getCompletedVyanjanLessonIds(identity?: Identity): Promise<string[]> {
  // Return guest progress from sessionStorage
  const { completedIds } = getGuestVyanjanProgressFromStorage()
  return completedIds
}

/**
 * Save guest vyanjan progress to database
 */
export async function saveGuestVyanjanProgressToDB(
  lessonId: string,
  status: 'in_progress' | 'completed',
  progressPercentage: number,
  guestId: string,
  score?: number,
  language: string = 'hi'
): Promise<boolean> {
  console.log('Guest vyanjan progress: Waiting for backend implementation')
  return true
}

/**
 * Save a user's answer to a vyanjan question
 */
export async function saveVyanjanAnswer(
  lessonId: string,
  contentId: string,
  answer: string,
  isCorrect: boolean | null,
  identity: Identity
): Promise<boolean> {
  console.log('Vyanjan answer: Waiting for backend implementation')
  return true
}

/**
 * Get user's answers for a specific vyanjan lesson
 */
export async function getVyanjanAnswersForLesson(
  lessonId: string,
  identity: Identity
): Promise<VyanjanLessonAnswer[]> {
  console.log('Vyanjan lesson answers: Waiting for backend implementation')
  return []
}
