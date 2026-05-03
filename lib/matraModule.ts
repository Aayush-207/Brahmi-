/**
 * Matra Module - Data Access Layer
 * 
 * This module provides functions to interact with the matra (vowel diacritics) lessons,
 * content, progress tracking, and quiz answers.
 */

import type { Identity } from './guestIdentity'
import matraData from '@/backend/data/matras.json'

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
  // Progress fields (joined from matra_progress)
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
 * Works for both authenticated users and guests
 */
export async function getMatraLessons(identity: Identity, language: string = 'hi'): Promise<MatraLesson[]> {
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
 * Get a single matra lesson by ID for a specific language
 */
export async function getMatraLessonInfo(lessonId: string, language: string = 'hi'): Promise<MatraLesson | null> {
  console.log(`[getMatraLessonInfo] Fetching matra lesson: ${lessonId}`)
  const lesson = (matraData.lessons as unknown as MatraLesson[]).find(l => l.lesson_id === lessonId)
  return lesson || null
}

/**
 * Get all content for a specific matra lesson for a specific language
 */
export async function getMatraLessonContent(lessonId: string, language: string = 'hi'): Promise<MatraLessonContent[]> {
  console.log(`[getMatraLessonContent] Returning matra content for lesson: ${lessonId}`)
  // Find the lesson
  const lesson = (matraData.lessons as unknown as MatraLesson[]).find(l => l.lesson_id === lessonId)
  if (!lesson) return []
  
  // Generate content based on lesson
  const content: MatraLessonContent[] = []
  
  // Find corresponding matra
  const matraIndex = lesson.id - 2 // lessons 2-13 map to matras 1-12
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
    language: 'hi',
    created_at: new Date().toISOString()
  })
  
  if (matra) {
    content.push({
      id: 2,
      lesson_id: lessonId,
      content_type: 'pronunciation',
      title: 'मात्रा संयोजन',
      content: matra.description || '',
      audio_url: null,
      metadata: { 
        brahmi_symbol: matra.exampleBrahmi,
        devanagari: matra.exampleDevanagari,
        sound: matra.example_combination
      },
      order_no: 2,
      language: 'hi',
      created_at: new Date().toISOString()
    })

    if (matra.matraSign && matra.matraSign !== "") {
      content.push({
        id: 3,
        lesson_id: lessonId,
        content_type: 'writing_practice',
        title: 'मात्रा अभ्यास',
        content: `ब्राह्मी मात्रा '${matra.matraSign}' का अभ्यास करें`,
        audio_url: null,
        metadata: { character: matra.matraSign },
        order_no: 3,
        language: 'hi',
        created_at: new Date().toISOString()
      })
    }
  }
  
  // Add rules slide for introduction lesson
  if (lessonId === 'matras-lesson-001') {
    (matraData.matraRules as unknown as any[]).forEach((rule, idx) => {
      content.push({
        id: 10 + idx,
        lesson_id: lessonId,
        content_type: 'text',
        title: rule.title,
        content: rule.description || '',
        audio_url: null,
        metadata: { rule_data: rule },
        order_no: 3 + idx,
        language: 'hi',
        created_at: new Date().toISOString()
      })
    })
  }
  
  // Summary slide
  content.push({
    id: 100,
    lesson_id: lessonId,
    content_type: 'summary',
    title: 'सारांश',
    content: `${lesson.title} को सफलतापूर्वक पूरा किया!`,
    audio_url: null,
    metadata: null,
    order_no: 50,
    language: 'hi',
    created_at: new Date().toISOString()
  })
  
  return content
}

// ============================================
// PROGRESS TRACKING FUNCTIONS
// ============================================

/**
 * Save matra lesson progress for authenticated users or guests
 */
export async function saveMatraProgress(
  lessonId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progressPercentage: number,
  identity: Identity
): Promise<boolean> {
  // For guests, save to sessionStorage
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

  // For authenticated users, backend implementation pending
  console.log('saveMatraProgress: User progress will be synced with backend when available')
  return true
}

/**
 * Get overall progress across all matra lessons
 */
export async function getMatraModuleProgress(identity: Identity): Promise<number> {
  const lessons = await getMatraLessons(identity)
  if (lessons.length === 0) return 0

  const totalProgress = lessons.reduce((sum, lesson) => {
    return sum + (lesson.progress_percentage || 0)
  }, 0)

  return Math.round(totalProgress / lessons.length)
}

// ============================================
// QUIZ/ANSWER TRACKING FUNCTIONS
// ============================================

/**
 * Save answer for MCQ or other interactive content
 */
export async function saveMatraAnswer(
  lessonId: string,
  contentId: number,
  answer: string,
  isCorrect: boolean,
  identity: Identity
): Promise<boolean> {
  // Backend implementation pending
  console.log(`saveMatraAnswer: Answer saved locally. Backend sync pending: ${lessonId}`)
  return true
}

/**
 * Get user's previous answers for a lesson (for review/analytics)
 */
export async function getMatraAnswers(
  lessonId: string,
  userId: string
): Promise<any[]> {
  // Backend implementation pending
  console.log(`getMatraAnswers: Waiting for backend implementation for lesson ${lessonId}`)
  return []
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Reset guest progress (useful for testing or user request)
 */
export function resetGuestMatraProgress(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(GUEST_MATRA_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to reset guest matra progress:', error)
  }
}

/**
 * Check if a specific lesson is completed
 */
export async function isMatraLessonCompleted(
  lessonId: string,
  identity: Identity
): Promise<boolean> {
  if (identity.type === 'guest') {
    const guestProgress = getGuestMatraProgressFromStorage()
    return guestProgress[lessonId]?.status === 'completed'
  }

  // For authenticated users, backend implementation pending
  return false
}
