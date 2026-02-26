import { createClient } from '@/lib/supabase/client'
import { Identity } from './guestIdentity'

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
 * Fetch all vyanjan lessons
 */
export async function getVyanjanLessons(): Promise<VyanjanLesson[]> {
  const supabase = createClient()
  
  // First get the vyanjan module id
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select('id')
    .eq('module_id', 'module-vyanjan')
    .single()
  
  if (moduleError || !moduleData) {
    console.error('Error fetching vyanjan module:', moduleError)
    return []
  }
  
  // Then get lessons for that module
  const { data, error } = await supabase
    .from('vyanjan_lessons')
    .select('*')
    .eq('module_id', moduleData.id)
    .order('order_no', { ascending: true })
  
  if (error) {
    console.error('Error fetching vyanjan lessons:', error)
    return []
  }
  return data || []
}

/**
 * Fetch vyanjan lesson content
 */
export async function getVyanjanLessonContent(lessonId: string): Promise<VyanjanLessonContent[]> {
  const supabase = createClient()
  
  // First get the lesson UUID from lesson_id
  const { data: lessonData, error: lessonError } = await supabase
    .from('vyanjan_lessons')
    .select('id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonError || !lessonData) {
    console.error('Error fetching vyanjan lesson:', lessonError)
    return []
  }
  
  // Then get content for that lesson
  const { data, error } = await supabase
    .from('vyanjan_lesson_content')
    .select('*')
    .eq('lesson_id', lessonData.id)
    .order('order_no', { ascending: true })
  
  if (error) {
    console.error('Error fetching vyanjan lesson content:', error)
    return []
  }
  return data || []
}

/**
 * Get vyanjan lesson info by lesson_id
 */
export async function getVyanjanLessonInfo(lessonId: string): Promise<VyanjanLesson | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('vyanjan_lessons')
    .select('*')
    .eq('lesson_id', lessonId)
    .single()
  
  if (error) {
    console.error('Error fetching vyanjan lesson info:', error)
    return null
  }
  return data
}

/**
 * Save vyanjan progress
 */
export async function saveVyanjanProgress(
  lessonId: string, 
  status: 'in_progress' | 'completed',
  progressPercentage: number,
  identity?: Identity,
  score?: number
): Promise<boolean> {
  // Handle guest progress
  if (!identity || identity.type === 'guest') {
    // Save to sessionStorage for quick access
    const { completedIds, progressMap } = getGuestVyanjanProgressFromStorage()
    const newProgressMap = { ...progressMap, [lessonId]: progressPercentage }
    
    if (status === 'completed' && !completedIds.includes(lessonId)) {
      saveGuestVyanjanProgressToStorage([...completedIds, lessonId], newProgressMap)
    } else {
      saveGuestVyanjanProgressToStorage(completedIds, newProgressMap)
    }
    
    // Also save to database if we have a guest ID
    if (identity?.id) {
      await saveGuestVyanjanProgressToDB(lessonId, status, progressPercentage, identity.id, score)
    }
    return true
  }

  // Handle authenticated user progress
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('User not authenticated')
    return false
  }
  
  // Get lesson UUID and module UUID
  const { data: lessonData, error: lessonError } = await supabase
    .from('vyanjan_lessons')
    .select('id, module_id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonError || !lessonData) {
    console.error('Error fetching vyanjan lesson data:', lessonError)
    return false
  }
  
  // Upsert progress
  const { error } = await supabase
    .from('vyanjan_progress')
    .upsert({
      user_id: user.id,
      module_id: lessonData.module_id,
      lesson_id: lessonData.id,
      status,
      progress_percentage: progressPercentage,
      score: score || null,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,lesson_id'
    })
  
  if (error) {
    console.error('Error saving vyanjan progress:', error)
    return false
  }
  return true
}

/**
 * Get user vyanjan progress
 */
export async function getUserVyanjanProgress(userId: string): Promise<VyanjanProgress[]> {
  const supabase = createClient()
  
  // Get vyanjan module id
  const { data: moduleData } = await supabase
    .from('modules')
    .select('id')
    .eq('module_id', 'module-vyanjan')
    .single()
  
  if (!moduleData) return []
  
  const { data, error } = await supabase
    .from('vyanjan_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', moduleData.id)
  
  if (error) {
    console.error('Error fetching vyanjan user progress:', error)
    return []
  }
  return data || []
}

/**
 * Get completed vyanjan lesson IDs for current user or guest
 */
export async function getCompletedVyanjanLessonIds(identity?: Identity): Promise<string[]> {
  // Handle guest progress from DB
  if (!identity || identity.type === 'guest') {
    // First try sessionStorage for quick access
    const { completedIds } = getGuestVyanjanProgressFromStorage()
    if (completedIds.length > 0) return completedIds
    
    // Then try database
    if (identity?.id) {
      const supabase = createClient()
      const { data } = await supabase
        .from('vyanjan_guest_progress')
        .select('lesson_id')
        .eq('guest_id', identity.id)
        .eq('status', 'completed')
      
      if (data && data.length > 0) {
        // Get lesson_ids from UUIDs
        const { data: lessons } = await supabase
          .from('vyanjan_lessons')
          .select('lesson_id')
          .in('id', data.map(d => d.lesson_id))
        
        return lessons?.map(l => l.lesson_id) || []
      }
    }
    return completedIds
  }

  // Handle authenticated user progress
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  const progress = await getUserVyanjanProgress(user.id)
  
  // Get lesson_ids for completed lessons
  const completedUUIDs = progress
    .filter(p => p.status === 'completed')
    .map(p => p.lesson_id)
  
  if (completedUUIDs.length === 0) return []
  
  // Map UUIDs back to lesson_ids
  const { data: lessons } = await supabase
    .from('vyanjan_lessons')
    .select('lesson_id')
    .in('id', completedUUIDs)
  
  return lessons?.map(l => l.lesson_id) || []
}

/**
 * Save guest vyanjan progress to database
 */
export async function saveGuestVyanjanProgressToDB(
  lessonId: string,
  status: 'in_progress' | 'completed',
  progressPercentage: number,
  guestId: string,
  score?: number
): Promise<boolean> {
  const supabase = createClient()
  
  // Get lesson UUID and module UUID
  const { data: lessonData, error: lessonError } = await supabase
    .from('vyanjan_lessons')
    .select('id, module_id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonError || !lessonData) {
    console.error('Error fetching vyanjan lesson data:', lessonError)
    return false
  }
  
  // Upsert progress
  const { error } = await supabase
    .from('vyanjan_guest_progress')
    .upsert({
      guest_id: guestId,
      module_id: lessonData.module_id,
      lesson_id: lessonData.id,
      status,
      progress_percentage: progressPercentage,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'guest_id,lesson_id'
    })
  
  if (error) {
    console.error('Error saving guest vyanjan progress to DB:', error)
    return false
  }
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
  const supabase = createClient()
  
  // Get lesson UUID from lesson_id
  const { data: lessonData, error: lessonError } = await supabase
    .from('vyanjan_lessons')
    .select('id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonError || !lessonData) {
    console.error('Error fetching vyanjan lesson for answer:', lessonError)
    return false
  }
  
  // Handle guest answers
  if (identity.type === 'guest' && identity.id) {
    // Get current attempt number
    const { data: existingAnswers } = await supabase
      .from('vyanjan_guest_answers')
      .select('attempt_number')
      .eq('guest_id', identity.id)
      .eq('content_id', contentId)
      .order('attempt_number', { ascending: false })
      .limit(1)
    
    const attemptNumber = existingAnswers && existingAnswers.length > 0
      ? existingAnswers[0].attempt_number + 1
      : 1
    
    const { error } = await supabase
      .from('vyanjan_guest_answers')
      .insert({
        guest_id: identity.id,
        lesson_id: lessonData.id,
        content_id: contentId,
        answer,
        is_correct: isCorrect,
        attempt_number: attemptNumber
      })
    
    if (error) {
      console.error('Error saving guest vyanjan answer:', error)
      return false
    }
    return true
  }
  
  // Handle authenticated user answers
  if (identity.type === 'user') {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('User not authenticated')
      return false
    }
    
    // Get current attempt number
    const { data: existingAnswers } = await supabase
      .from('vyanjan_lesson_answers')
      .select('attempt_number')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .order('attempt_number', { ascending: false })
      .limit(1)
    
    const attemptNumber = existingAnswers && existingAnswers.length > 0
      ? existingAnswers[0].attempt_number + 1
      : 1
    
    const { error } = await supabase
      .from('vyanjan_lesson_answers')
      .insert({
        user_id: user.id,
        lesson_id: lessonData.id,
        content_id: contentId,
        answer,
        is_correct: isCorrect,
        attempt_number: attemptNumber
      })
    
    if (error) {
      console.error('Error saving user vyanjan answer:', error)
      return false
    }
    return true
  }
  
  return false
}

/**
 * Get user's answers for a specific vyanjan lesson
 */
export async function getVyanjanAnswersForLesson(
  lessonId: string,
  identity: Identity
): Promise<VyanjanLessonAnswer[]> {
  const supabase = createClient()
  
  // Get lesson UUID
  const { data: lessonData, error: lessonError } = await supabase
    .from('vyanjan_lessons')
    .select('id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonError || !lessonData) {
    return []
  }
  
  // Handle guest
  if (identity.type === 'guest' && identity.id) {
    const { data, error } = await supabase
      .from('vyanjan_guest_answers')
      .select('*')
      .eq('guest_id', identity.id)
      .eq('lesson_id', lessonData.id)
      .order('answered_at', { ascending: false })
    
    if (error || !data) return []
    return data.map(d => ({ ...d, guest_id: d.guest_id }))
  }
  
  // Handle authenticated user
  if (identity.type === 'user') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    
    const { data, error } = await supabase
      .from('vyanjan_lesson_answers')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonData.id)
      .order('answered_at', { ascending: false })
    
    if (error || !data) return []
    return data
  }
  
  return []
}
