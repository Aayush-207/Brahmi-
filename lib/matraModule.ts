/**
 * Matra Module - Data Access Layer
 * 
 * This module provides functions to interact with the matra (vowel diacritics) lessons,
 * content, progress tracking, and quiz answers.
 */

import type { Identity } from './guestIdentity'
import { getDataForLanguage } from '@/backend/data/index'

// ============================================
// TYPE DEFINITIONS
// ============================================

export type MatraLesson = {
  id: number
  module_id: string
  lesson_id: string
  title: string
  title_english?: string
  subtitle: string | null
  description?: string
  description_english?: string
  matra_symbol: string | null
  order_no: number
  estimated_time: number
  language: string
  created_at: string
  status?: 'not_started' | 'in_progress' | 'completed'
  progress_percentage?: number
}

export type MatraLessonContent = {
  id: number
  lesson_id: string
  content_type: string
  title: string | null
  content: string | null
  audio_url: string | null
  metadata: Record<string, any> | null
  order_no: number
  language: string
  created_at: string
}

export type MatraProgress = {
  id: number
  user_id: string
  lesson_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  last_accessed: string
  completed_at: string | null
}

// ============================================
// GUEST STORAGE FUNCTIONS
// ============================================

const GUEST_MATRA_STORAGE_KEY = 'brahmi_guest_matra_progress'

type GuestMatraProgress = {
  [lessonId: string]: {
    status: 'not_started' | 'in_progress' | 'completed'
    progress_percentage: number
    last_accessed: string
    completed_at: string | null
  }
}

function getGuestMatraProgressFromStorage(): GuestMatraProgress {
  if (typeof window === 'undefined') return {}
  try {
    const stored = sessionStorage.getItem(GUEST_MATRA_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to parse guest matra progress:', error)
    return {}
  }
}

function saveGuestMatraProgressToStorage(progress: GuestMatraProgress): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(GUEST_MATRA_STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save guest matra progress:', error)
  }
}

// ============================================
// FETCH FUNCTIONS
// ============================================

/**
 * Get all matra lessons with optional progress information
 */
export async function getMatraLessons(identity: Identity, language: string = 'hi'): Promise<MatraLesson[]> {
  const data = getDataForLanguage(language);
  const matraData = data.matras;
  const lessons = [...(matraData.lessons as unknown as MatraLesson[])];
  
  if (identity.type === 'guest' || !identity.id) {
    const progress = getGuestMatraProgressFromStorage();
    return lessons.map(lesson => ({
      ...lesson,
      status: progress[lesson.lesson_id]?.status || 'not_started',
      progress_percentage: progress[lesson.lesson_id]?.progress_percentage || 0
    }));
  }
  return lessons;
}

/**
 * Get a single matra lesson by ID
 */
export async function getMatraLessonInfo(lessonId: string, language: string = 'hi'): Promise<MatraLesson | null> {
  const data = getDataForLanguage(language);
  const matraData = data.matras;
  const lesson = (matraData.lessons as unknown as MatraLesson[]).find(l => l.lesson_id === lessonId)
  return lesson || null
}

/**
 * Get all content for a specific matra lesson
 */
export async function getMatraLessonContent(lessonId: string, language: string = 'hi'): Promise<MatraLessonContent[]> {
  const data = getDataForLanguage(language);
  const matraData = data.matras;
  
  const lesson = (matraData.lessons as unknown as MatraLesson[]).find(l => l.lesson_id === lessonId)
  if (!lesson) return []
  
  const content: MatraLessonContent[] = []
  
  // Find corresponding matra
  const matraIndex = lesson.id - 2 
  let matra: any = null;
  if (matraIndex >= 0 && matraIndex < (matraData.matras as unknown as any[]).length) {
    matra = (matraData.matras as unknown as any[])[matraIndex]
  }

  // Title slide
  content.push({
    id: 1,
    lesson_id: lessonId,
    content_type: 'title_slide',
    title: lesson.title,
    content: lesson.description || '',
    audio_url: null,
    metadata: { 
      matra_symbol: lesson.matra_symbol,
      brahmi_symbol: matra && matra.matraSign ? matra.matraSign : null,
      devanagari: matra ? matra.vowelDevanagari : null,
      latin: matra ? matra.matraName : null
    },
    order_no: 1,
    language: language,
    created_at: new Date().toISOString()
  })
  
  if (matra) {
    content.push({
      id: 2,
      lesson_id: lessonId,
      content_type: 'pronunciation',
      title: language === 'hi' ? 'मात्रा संयोजन' : 'Matra Combination',
      content: matra.description || '',
      audio_url: null,
      metadata: { 
        brahmi_symbol: matra.exampleBrahmi,
        devanagari: matra.exampleDevanagari,
        sound: matra.example_combination
      },
      order_no: 2,
      language: language,
      created_at: new Date().toISOString()
    })

    if (matra.matraSign && matra.matraSign !== "") {
      content.push({
        id: 3,
        lesson_id: lessonId,
        content_type: 'writing_practice',
        title: language === 'hi' ? 'मात्रा अभ्यास' : 'Matra Practice',
        content: language === 'hi' ? `ब्राह्मी मात्रा '${matra.matraSign}' का अभ्यास करें` : `Practice the Brahmi matra '${matra.matraSign}'`,
        audio_url: null,
        metadata: { character: matra.matraSign },
        order_no: 3,
        language: language,
        created_at: new Date().toISOString()
      })
    }
  }
  
  // Add rules slide for introduction lesson
  if (lessonId === 'matras-lesson-001') {
    (matraData.matraRules as unknown as any[]).forEach((rule: any, idx: number) => {
      content.push({
        id: 10 + idx,
        lesson_id: lessonId,
        content_type: 'text',
        title: rule.title,
        content: rule.description || '',
        audio_url: null,
        metadata: { rule_data: rule },
        order_no: 3 + idx,
        language: language,
        created_at: new Date().toISOString()
      })
    })
  }
  
  // Summary slide
  content.push({
    id: 100,
    lesson_id: lessonId,
    content_type: 'summary',
    title: language === 'hi' ? 'सारांश' : 'Summary',
    content: language === 'hi' ? `${lesson.title} को सफलतापूर्वक पूरा किया!` : `Successfully completed ${lesson.title}!`,
    audio_url: null,
    metadata: null,
    order_no: 50,
    language: language,
    created_at: new Date().toISOString()
  })
  
  return content
}

// ============================================
// PROGRESS TRACKING FUNCTIONS
// ============================================

/**
 * Save matra lesson progress
 */
export async function saveMatraProgress(
  lessonId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progressPercentage: number,
  identity: Identity,
  language: string = "hi"
): Promise<boolean> {
  if (identity.type === 'guest' || !identity.id) {
    const guestProgress = getGuestMatraProgressFromStorage()
    guestProgress[lessonId] = {
      status,
      progress_percentage: progressPercentage,
      last_accessed: new Date().toISOString(),
      completed_at: status === 'completed' ? new Date().toISOString() : null
    }
    saveGuestMatraProgressToStorage(guestProgress)
    return true
  }
  return true
}

/**
 * Get overall progress across all matra lessons
 */
export async function getMatraModuleProgress(identity: Identity, language: string = "hi"): Promise<number> {
  const lessons = await getMatraLessons(identity, language)
  if (lessons.length === 0) return 0

  const totalProgress = lessons.reduce((sum, lesson) => {
    return sum + (lesson.progress_percentage || 0)
  }, 0)

  return Math.round(totalProgress / lessons.length)
}

// ============================================
// QUIZ/ANSWER TRACKING FUNCTIONS
// ============================================

export async function saveMatraAnswer(
  lessonId: string,
  contentId: number,
  answer: string,
  isCorrect: boolean,
  identity: Identity,
  language: string = "hi"
): Promise<boolean> {
  console.log(`saveMatraAnswer: Answer saved locally for lesson ${lessonId}`)
  return true
}

export async function getMatraAnswers(
  lessonId: string,
  userId: string,
  language: string = "hi"
): Promise<any[]> {
  return []
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function resetGuestMatraProgress(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(GUEST_MATRA_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to reset guest matra progress:', error)
  }
}

export async function isMatraLessonCompleted(
  lessonId: string,
  identity: Identity,
  language: string = "hi"
): Promise<boolean> {
  if (identity.type === 'guest') {
    const guestProgress = getGuestMatraProgressFromStorage()
    return guestProgress[lessonId]?.status === 'completed'
  }
  return false
}
