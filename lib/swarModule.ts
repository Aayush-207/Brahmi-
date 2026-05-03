import { Identity } from './guestIdentity'
import swarData from '@/backend/data/swar.json'

const GUEST_SWAR_PROGRESS_KEY = 'brahmi_guest_swar_progress'

type GuestSwarProgress = {
  completedIds: string[]
  progressMap: Record<string, number>
  lastUpdated: string
}

/**
 * Get guest swar progress from sessionStorage
 */
function getGuestSwarProgressFromStorage(): { completedIds: string[], progressMap: Record<string, number> } {
  if (typeof window === 'undefined') {
    return { completedIds: [], progressMap: {} }
  }
  try {
    const stored = sessionStorage.getItem(GUEST_SWAR_PROGRESS_KEY)
    if (!stored) {
      return { completedIds: [], progressMap: {} }
    }
    const progress: GuestSwarProgress = JSON.parse(stored)
    return {
      completedIds: progress.completedIds || [],
      progressMap: progress.progressMap || {}
    }
  } catch (error) {
    console.error('Error reading guest swar progress:', error)
    return { completedIds: [], progressMap: {} }
  }
}

/**
 * Save guest swar progress to sessionStorage
 */
function saveGuestSwarProgressToStorage(completedIds: string[], progressMap: Record<string, number>): void {
  if (typeof window === 'undefined') return
  try {
    const progress: GuestSwarProgress = {
      completedIds,
      progressMap,
      lastUpdated: new Date().toISOString()
    }
    sessionStorage.setItem(GUEST_SWAR_PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving guest swar progress:', error)
  }
}

// Types matching swar data schema
export type Vowel = {
  id: string
  order: number
  devanagari: string
  brahmi: string
  unicode_codepoint: string
  romanized: string
  matra_sign: string | null
  matra_unicode: string | null
  matra_position: 'none' | 'before' | 'after' | 'above' | 'below'
  title_hindi: string
  title_english: string
  description_hindi: string
  description_english: string
  pronunciation: string
  special_mark?: 'anusvara' | 'visarga'
}

export type Quiz1Question = {
  id: string
  order: number
  question: string
  question_type: 'devanagari_to_brahmi'
  correct_answer: string
  correct_vowel_id: string
  wrong_options: Array<{
    id: string
    brahmi: string
    vowel_id: string
  }>
  title_hindi: string
  title_english: string
  note?: string
}

export type Quiz2Question = {
  id: string
  order: number
  question: string
  question_type: 'brahmi_to_devanagari'
  correct_answer: string
  correct_vowel_id: string
  wrong_options: Array<{
    id: string
    devanagari: string
    vowel_id: string
  }>
  title_hindi: string
  title_english: string
  note?: string
}

export type TracingSequence = {
  id: string
  order: number
  devanagari: string
  brahmi: string
  vowel_id: string
  title_hindi: string
  title_english: string
  instruction_hindi: string
  instruction_english: string
  special_mark?: 'anusvara' | 'visarga'
}

export type TrueFalseQuestion = {
  id: string
  order: number
  question_hindi: string
  question_english: string
  correct_answer: boolean
  vowel_id: string
  correct_symbol?: string
  explanation_hindi: string
  explanation_english: string
  note?: string
}

export type Reward = {
  id: string
  order: number
  badge_name_hindi: string
  badge_name_english: string
  badge_description_hindi: string
  badge_description_english: string
  trigger: string
  icon: string
  color: string
  unlock_condition: string
  bonus?: boolean
  xp_reward?: number
}

/**
 * Get all 12 vowels (स्वर)
 */
export async function getVowels(): Promise<Vowel[]> {
  console.log('[getVowels] Returning hardcoded swar data: 12 vowels')
  return swarData.vowels as Vowel[]
}

/**
 * Get a specific vowel by ID
 */
export async function getVowel(vowelId: string): Promise<Vowel | null> {
  console.log(`[getVowel] Fetching vowel: ${vowelId}`)
  const vowel = (swarData.vowels as Vowel[]).find((v) => v.id === vowelId)
  return vowel || null
}

/**
 * Get Quiz 1 questions (Devanagari to Brahmi matching)
 */
export async function getQuiz1Questions(): Promise<Quiz1Question[]> {
  console.log('[getQuiz1Questions] Returning hardcoded Quiz 1 data: 12 Devanagari→Brahmi questions')
  return swarData.quiz1_devanagari_to_brahmi as Quiz1Question[]
}

/**
 * Get a specific Quiz 1 question by order
 */
export async function getQuiz1Question(order: number): Promise<Quiz1Question | null> {
  console.log(`[getQuiz1Question] Fetching Quiz 1 question: order=${order}`)
  const question = (swarData.quiz1_devanagari_to_brahmi as Quiz1Question[]).find((q) => q.order === order)
  return question || null
}

/**
 * Get Quiz 2 questions (Brahmi to Devanagari matching)
 */
export async function getQuiz2Questions(): Promise<Quiz2Question[]> {
  console.log('[getQuiz2Questions] Returning hardcoded Quiz 2 data: 12 Brahmi→Devanagari questions')
  return swarData.quiz2_brahmi_to_devanagari as Quiz2Question[]
}

/**
 * Get a specific Quiz 2 question by order
 */
export async function getQuiz2Question(order: number): Promise<Quiz2Question | null> {
  console.log(`[getQuiz2Question] Fetching Quiz 2 question: order=${order}`)
  const question = (swarData.quiz2_brahmi_to_devanagari as Quiz2Question[]).find((q) => q.order === order)
  return question || null
}

/**
 * Get tracing sequence (writing practice for all vowels)
 */
export async function getTracingSequence(): Promise<TracingSequence[]> {
  console.log('[getTracingSequence] Returning hardcoded tracing data: 12 writing exercises')
  return swarData.tracing_sequence as TracingSequence[]
}

/**
 * Get a specific tracing exercise by order
 */
export async function getTracingExercise(order: number): Promise<TracingSequence | null> {
  console.log(`[getTracingExercise] Fetching tracing exercise: order=${order}`)
  const exercise = (swarData.tracing_sequence as TracingSequence[]).find((t) => t.order === order)
  return exercise || null
}

/**
 * Get true/false questions (सत्य/असत्य)
 */
export async function getTrueFalseQuestions(): Promise<TrueFalseQuestion[]> {
  console.log('[getTrueFalseQuestions] Returning hardcoded true/false data: 12 questions')
  return swarData.true_false_questions as TrueFalseQuestion[]
}

/**
 * Get a specific true/false question by order
 */
export async function getTrueFalseQuestion(order: number): Promise<TrueFalseQuestion | null> {
  console.log(`[getTrueFalseQuestion] Fetching true/false question: order=${order}`)
  const question = (swarData.true_false_questions as TrueFalseQuestion[]).find((q) => q.order === order)
  return question || null
}

/**
 * Get all rewards/badges for swar module
 */
export async function getRewards(): Promise<Reward[]> {
  console.log('[getRewards] Returning hardcoded rewards data: 5 badges')
  return swarData.rewards as Reward[]
}

/**
 * Get a specific reward by ID
 */
export async function getReward(rewardId: string): Promise<Reward | null> {
  console.log(`[getReward] Fetching reward: ${rewardId}`)
  const reward = (swarData.rewards as Reward[]).find((r) => r.id === rewardId)
  return reward || null
}

/**
 * Check and save quiz answer
 */
export async function saveQuizAnswer(
  userId: string | null | undefined,
  quizType: 'quiz1' | 'quiz2' | 'true_false',
  questionId: string,
  answer: string,
  isCorrect: boolean
): Promise<void> {
  // For guest users, save to sessionStorage
  if (!userId) {
    const { completedIds, progressMap } = getGuestSwarProgressFromStorage()
    
    if (isCorrect && !completedIds.includes(questionId)) {
      completedIds.push(questionId)
    }
    
    progressMap[questionId] = isCorrect ? 1 : 0
    saveGuestSwarProgressToStorage(completedIds, progressMap)
  } else {
    // For authenticated users, backend will handle via DB
    console.log(`[saveQuizAnswer] Backend will save: user=${userId}, quiz=${quizType}, question=${questionId}, correct=${isCorrect}`)
  }
}

/**
 * Get guest progress for swar module
 */
export async function getGuestSwarProgress(): Promise<{ completedIds: string[], progressMap: Record<string, number> }> {
  return getGuestSwarProgressFromStorage()
}

/**
 * Save guest completion milestone
 */
export async function saveSwarMilestone(milestone: 'quiz1_completed' | 'quiz2_completed' | 'tracing_completed' | 'true_false_completed'): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    const key = `brahmi_swar_milestone_${milestone}`
    sessionStorage.setItem(key, JSON.stringify({ completed: true, timestamp: new Date().toISOString() }))
  } catch (error) {
    console.error('Error saving swar milestone:', error)
  }
}

/**
 * Check if guest has completed a swar milestone
 */
export async function checkSwarMilestone(milestone: 'quiz1_completed' | 'quiz2_completed' | 'tracing_completed' | 'true_false_completed'): Promise<boolean> {
  if (typeof window === 'undefined') return false
  try {
    const key = `brahmi_swar_milestone_${milestone}`
    const stored = sessionStorage.getItem(key)
    return !!stored
  } catch {
    return false
  }
}
