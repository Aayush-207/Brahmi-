/**
 * Matra Module - Data Access Layer
 * 
 * This module provides functions to interact with the matra (vowel diacritics) lessons,
 * content, progress tracking, and quiz answers.
 */

import { supabase } from './supabase'
import type { Identity } from './guestIdentity'

// ============================================
// TYPE DEFINITIONS
// ============================================

export type MatraLesson = {
  id: number
  module_id: string
  lesson_id: string
  title: string
  subtitle: string | null
  matra_symbol: string | null
  order_no: number
  estimated_time: number
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
export async function getMatraLessons(identity: Identity): Promise<MatraLesson[]> {
  try {
    // Fetch all lessons
    const { data: lessons, error } = await supabase
      .from('matra_lessons')
      .select('*')
      .order('order_no', { ascending: true })

    if (error) throw error
    if (!lessons) return []

    // If user is authenticated, join with progress
    if (identity.type === 'user' && identity.id) {
      const { data: progressData, error: progressError } = await supabase
        .from('matra_progress')
        .select('*')
        .eq('user_id', identity.id)

      if (progressError) {
        console.error('Error fetching matra progress:', progressError)
      }

      const progressMap = new Map(
        (progressData || []).map(p => [p.lesson_id, p])
      )

      return lessons.map(lesson => ({
        ...lesson,
        status: progressMap.get(lesson.lesson_id)?.status || 'not_started',
        progress_percentage: progressMap.get(lesson.lesson_id)?.progress_percentage || 0
      }))
    }

    // For guests, use sessionStorage
    if (identity.type === 'guest') {
      const guestProgress = getGuestMatraProgressFromStorage()

      return lessons.map(lesson => ({
        ...lesson,
        status: guestProgress[lesson.lesson_id]?.status || 'not_started',
        progress_percentage: guestProgress[lesson.lesson_id]?.progress_percentage || 0
      }))
    }

    // No identity - return lessons without progress
    return lessons.map(lesson => ({
      ...lesson,
      status: 'not_started' as const,
      progress_percentage: 0
    }))
  } catch (error) {
    console.error('Error fetching matra lessons:', error)
    return []
  }
}

/**
 * Get a single matra lesson by ID
 */
export async function getMatraLessonInfo(lessonId: string): Promise<MatraLesson | null> {
  try {
    const { data, error } = await supabase
      .from('matra_lessons')
      .select('*')
      .eq('lesson_id', lessonId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching matra lesson info:', error)
    return null
  }
}

/**
 * Get all content for a specific matra lesson
 */
export async function getMatraLessonContent(lessonId: string): Promise<MatraLessonContent[]> {
  try {
    const { data, error } = await supabase
      .from('matra_lesson_content')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_no', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching matra lesson content:', error)
    return []
  }
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
  try {
    // For authenticated users
    if (identity.type === 'user' && identity.id) {
      const updateData: any = {
        user_id: identity.id,
        lesson_id: lessonId,
        status,
        progress_percentage: progressPercentage,
        last_accessed: new Date().toISOString()
      }

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('matra_progress')
        .upsert(updateData, {
          onConflict: 'user_id,lesson_id'
        })

      if (error) throw error
      return true
    }

    // For guests - use sessionStorage
    if (identity.type === 'guest') {
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

    return false
  } catch (error) {
    console.error('Error saving matra progress:', error)
    return false
  }
}

/**
 * Get overall progress across all matra lessons
 */
export async function getMatraModuleProgress(identity: Identity): Promise<number> {
  try {
    const lessons = await getMatraLessons(identity)
    if (lessons.length === 0) return 0

    const totalProgress = lessons.reduce((sum, lesson) => {
      return sum + (lesson.progress_percentage || 0)
    }, 0)

    return Math.round(totalProgress / lessons.length)
  } catch (error) {
    console.error('Error calculating matra module progress:', error)
    return 0
  }
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
  try {
    // Only save for authenticated users (guests don't need answer tracking)
    if (identity.type === 'user' && identity.id) {
      const { error } = await supabase
        .from('matra_lesson_answers')
        .insert({
          user_id: identity.id,
          lesson_id: lessonId,
          content_id: contentId,
          answer,
          is_correct: isCorrect,
          answered_at: new Date().toISOString()
        })

      if (error) throw error
      return true
    }

    // For guests, we just return true without saving
    return true
  } catch (error) {
    console.error('Error saving matra answer:', error)
    return false
  }
}

/**
 * Get user's previous answers for a lesson (for review/analytics)
 */
export async function getMatraAnswers(
  lessonId: string,
  userId: string
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('matra_lesson_answers')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .order('answered_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching matra answers:', error)
    return []
  }
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
  try {
    if (identity.type === 'user' && identity.id) {
      const { data, error } = await supabase
        .from('matra_progress')
        .select('status')
        .eq('user_id', identity.id)
        .eq('lesson_id', lessonId)
        .single()

      if (error) return false
      return data?.status === 'completed'
    }

    if (identity.type === 'guest') {
      const guestProgress = getGuestMatraProgressFromStorage()
      return guestProgress[lessonId]?.status === 'completed'
    }

    return false
  } catch (error) {
    console.error('Error checking matra lesson completion:', error)
    return false
  }
}
