import { createClient } from '@/lib/supabase/client'
import { Identity } from './guestIdentity'

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

// Fetch all modules
export async function getModules(): Promise<Module[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('order_no', { ascending: true })
  
  if (error) {
    console.error('Error fetching modules:', error)
    return []
  }
  return data || []
}

// Fetch introduction lessons
export async function getIntroLessons(): Promise<IntroLesson[]> {
  const supabase = createClient()
  
  // First get the intro module id
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select('id')
    .eq('module_id', 'module-intro')
    .single()
  
  if (moduleError || !moduleData) {
    console.error('Error fetching intro module:', moduleError)
    return []
  }
  
  // Then get lessons for that module
  const { data, error } = await supabase
    .from('intro_lessons')
    .select('*')
    .eq('module_id', moduleData.id)
    .order('order_no', { ascending: true })
  
  if (error) {
    console.error('Error fetching intro lessons:', error)
    return []
  }
  return data || []
}

// Fetch lesson content
export async function getLessonContent(lessonId: string): Promise<IntroLessonContent[]> {
  const supabase = createClient()
  
  // First get the lesson UUID from lesson_id
  const { data: lessonData, error: lessonError } = await supabase
    .from('intro_lessons')
    .select('id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonError || !lessonData) {
    console.error('Error fetching lesson:', lessonError)
    return []
  }
  
  // Then get content for that lesson
  const { data, error } = await supabase
    .from('intro_lesson_content')
    .select('*')
    .eq('lesson_id', lessonData.id)
    .order('order_no', { ascending: true })
  
  if (error) {
    console.error('Error fetching lesson content:', error)
    return []
  }
  return data || []
}

// Get lesson info by lesson_id
export async function getLessonInfo(lessonId: string): Promise<IntroLesson | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('intro_lessons')
    .select('*')
    .eq('lesson_id', lessonId)
    .single()
  
  if (error) {
    console.error('Error fetching lesson info:', error)
    return null
  }
  return data
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
    
    // Also save to database if we have a guest ID
    if (identity?.id) {
      await saveGuestProgressToDB(lessonId, status, progressPercentage, identity.id)
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
    .from('intro_lessons')
    .select('id, module_id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonError || !lessonData) {
    console.error('Error fetching lesson data:', lessonError)
    return false
  }
  
  // Upsert progress
  const { error } = await supabase
    .from('module_progress')
    .upsert({
      user_id: user.id,
      module_id: lessonData.module_id,
      lesson_id: lessonData.id,
      status,
      progress_percentage: progressPercentage,
      completed_at: status === 'completed' ? new Date().toISOString() : null
    }, {
      onConflict: 'user_id,lesson_id'
    })
  
  if (error) {
    console.error('Error saving progress:', error)
    return false
  }
  return true
}

// Get user progress for intro module
export async function getUserIntroProgress(userId: string): Promise<ModuleProgress[]> {
  const supabase = createClient()
  
  // Get intro module id
  const { data: moduleData } = await supabase
    .from('modules')
    .select('id')
    .eq('module_id', 'module-intro')
    .single()
  
  if (!moduleData) return []
  
  const { data, error } = await supabase
    .from('module_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', moduleData.id)
  
  if (error) {
    console.error('Error fetching user progress:', error)
    return []
  }
  return data || []
}

// Get completed lesson IDs for current user or guest
export async function getCompletedLessonIds(identity?: Identity): Promise<string[]> {
  // Handle guest progress from DB
  if (!identity || identity.type === 'guest') {
    // First try sessionStorage for quick access
    const { completedIds } = getGuestIntroProgressFromStorage()
    if (completedIds.length > 0) return completedIds
    
    // Then try database
    if (identity?.id) {
      const supabase = createClient()
      const { data } = await supabase
        .from('intro_guest_progress')
        .select('lesson_id')
        .eq('guest_id', identity.id)
        .eq('status', 'completed')
      
      if (data && data.length > 0) {
        // Get lesson_ids from UUIDs
        const { data: lessons } = await supabase
          .from('intro_lessons')
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
  
  const progress = await getUserIntroProgress(user.id)
  
  // Get lesson_ids for completed lessons
  const completedUUIDs = progress
    .filter(p => p.status === 'completed')
    .map(p => p.lesson_id)
  
  if (completedUUIDs.length === 0) return []
  
  // Map UUIDs back to lesson_ids
  const { data: lessons } = await supabase
    .from('intro_lessons')
    .select('lesson_id')
    .in('id', completedUUIDs)
  
  return lessons?.map(l => l.lesson_id) || []
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
  const supabase = createClient()
  
  // Get lesson UUID from lesson_id
  const { data: lessonData, error: lessonError } = await supabase
    .from('intro_lessons')
    .select('id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonError || !lessonData) {
    console.error('Error fetching lesson for answer:', lessonError)
    return false
  }
  
  // Handle guest answers
  if (identity.type === 'guest' && identity.id) {
    // Get current attempt number
    const { data: existingAnswers } = await supabase
      .from('intro_guest_answers')
      .select('attempt_number')
      .eq('guest_id', identity.id)
      .eq('content_id', contentId)
      .order('attempt_number', { ascending: false })
      .limit(1)
    
    const attemptNumber = existingAnswers && existingAnswers.length > 0
      ? existingAnswers[0].attempt_number + 1
      : 1
    
    const { error } = await supabase
      .from('intro_guest_answers')
      .insert({
        guest_id: identity.id,
        lesson_id: lessonData.id,
        content_id: contentId,
        answer,
        is_correct: isCorrect,
        attempt_number: attemptNumber
      })
    
    if (error) {
      console.error('Error saving guest answer:', error)
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
      .from('intro_lesson_answers')
      .select('attempt_number')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .order('attempt_number', { ascending: false })
      .limit(1)
    
    const attemptNumber = existingAnswers && existingAnswers.length > 0
      ? existingAnswers[0].attempt_number + 1
      : 1
    
    const { error } = await supabase
      .from('intro_lesson_answers')
      .insert({
        user_id: user.id,
        lesson_id: lessonData.id,
        content_id: contentId,
        answer,
        is_correct: isCorrect,
        attempt_number: attemptNumber
      })
    
    if (error) {
      console.error('Error saving user answer:', error)
      return false
    }
    return true
  }
  
  return false
}

/**
 * Get user's answers for a specific lesson
 */
export async function getAnswersForLesson(
  lessonId: string,
  identity: Identity
): Promise<IntroLessonAnswer[]> {
  const supabase = createClient()
  
  // Get lesson UUID
  const { data: lessonData, error: lessonError } = await supabase
    .from('intro_lessons')
    .select('id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonError || !lessonData) {
    return []
  }
  
  // Handle guest
  if (identity.type === 'guest' && identity.id) {
    const { data, error } = await supabase
      .from('intro_guest_answers')
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
      .from('intro_lesson_answers')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonData.id)
      .order('answered_at', { ascending: false })
    
    if (error || !data) return []
    return data
  }
  
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
  const supabase = createClient()
  
  // Get lesson UUID and module UUID
  const { data: lessonData, error: lessonError } = await supabase
    .from('intro_lessons')
    .select('id, module_id')
    .eq('lesson_id', lessonId)
    .single()
  
  if (lessonError || !lessonData) {
    console.error('Error fetching lesson data:', lessonError)
    return false
  }
  
  // Upsert progress
  const { error } = await supabase
    .from('intro_guest_progress')
    .upsert({
      guest_id: guestId,
      module_id: lessonData.module_id,
      lesson_id: lessonData.id,
      status,
      progress_percentage: progressPercentage,
      completed_at: status === 'completed' ? new Date().toISOString() : null
    }, {
      onConflict: 'guest_id,lesson_id'
    })
  
  if (error) {
    console.error('Error saving guest progress to DB:', error)
    return false
  }
  return true
}
