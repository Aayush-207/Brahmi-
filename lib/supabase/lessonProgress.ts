import { getSupabaseBrowserClient } from './client'

export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed'

export type LessonProgressRecord = {
  lesson_id: string
  status: LessonProgressStatus
  progress_percentage: number
  last_accessed: string
  completed_at: string | null
}

type LessonProgressRow = LessonProgressRecord & {
  module_id: string
  user_id: string
}

function rowsToMap(rows: LessonProgressRow[] | null | undefined): Record<string, LessonProgressRecord> {
  return (rows || []).reduce<Record<string, LessonProgressRecord>>((accumulator, row) => {
    accumulator[row.lesson_id] = {
      lesson_id: row.lesson_id,
      status: row.status,
      progress_percentage: row.progress_percentage,
      last_accessed: row.last_accessed,
      completed_at: row.completed_at
    }
    return accumulator
  }, {})
}

export async function loadAccountLessonProgress(moduleId: string, userId: string): Promise<Record<string, LessonProgressRecord>> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase || !userId) {
    return {}
  }

  const { data, error } = await (supabase.from('lesson_progress') as any)
    .select('module_id,user_id,lesson_id,status,progress_percentage,last_accessed,completed_at')
    .eq('module_id', moduleId)
    .eq('user_id', userId)

  if (error) {
    console.warn('Failed to load lesson progress:', {
      moduleId,
      userId,
      message: error?.message || 'Unknown Supabase error',
      code: error?.code || null
    })
    return {}
  }

  return rowsToMap(data as LessonProgressRow[])
}

export async function saveAccountLessonProgress(
  moduleId: string,
  lessonId: string,
  status: LessonProgressStatus,
  progressPercentage: number,
  userId: string
): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase || !userId) {
    return false
  }

  const now = new Date().toISOString()
  const payload = {
    user_id: userId,
    module_id: moduleId,
    lesson_id: lessonId,
    status,
    progress_percentage: progressPercentage,
    last_accessed: now,
    completed_at: status === 'completed' ? now : null
  }

  const { error } = await (supabase.from('lesson_progress') as any)
    .upsert(payload, { onConflict: 'user_id,module_id,lesson_id' })

  if (error) {
    console.warn('Failed to save lesson progress:', {
      moduleId,
      lessonId,
      userId,
      message: error?.message || 'Unknown Supabase error',
      code: error?.code || null,
      details: error?.details || null,
      hint: error?.hint || null
    })
    return false
  }

  return true
}