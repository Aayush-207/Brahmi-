import { Identity } from './guestIdentity'
import { getDataForLanguage } from '@/backend/data/index'

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
export async function getVowels(language: string = "hi"): Promise<Vowel[]> {
  const swarData = getDataForLanguage(language).swar;
  return swarData.vowels as Vowel[]
}

/**
 * Get a specific vowel by ID
 */
export async function getVowel(vowelId: string, language: string = "hi"): Promise<Vowel | null> {
  const swarData = getDataForLanguage(language).swar;
  const vowel = (swarData.vowels as Vowel[]).find((v) => v.id === vowelId)
  return vowel || null
}

/**
 * Get Quiz 1 questions (Devanagari to Brahmi matching)
 */
export async function getQuiz1Questions(language: string = "hi"): Promise<Quiz1Question[]> {
  const swarData = getDataForLanguage(language).swar;
  return swarData.quiz1_devanagari_to_brahmi as Quiz1Question[]
}

/**
 * Get a specific Quiz 1 question by order
 */
export async function getQuiz1Question(order: number, language: string = "hi"): Promise<Quiz1Question | null> {
  const swarData = getDataForLanguage(language).swar;
  const question = (swarData.quiz1_devanagari_to_brahmi as Quiz1Question[]).find((q) => q.order === order)
  return question || null
}

/**
 * Get Quiz 2 questions (Brahmi to Devanagari matching)
 */
export async function getQuiz2Questions(language: string = "hi"): Promise<Quiz2Question[]> {
  const swarData = getDataForLanguage(language).swar;
  return swarData.quiz2_brahmi_to_devanagari as Quiz2Question[]
}

/**
 * Get a specific Quiz 2 question by order
 */
export async function getQuiz2Question(order: number, language: string = "hi"): Promise<Quiz2Question | null> {
  const swarData = getDataForLanguage(language).swar;
  const question = (swarData.quiz2_brahmi_to_devanagari as Quiz2Question[]).find((q) => q.order === order)
  return question || null
}

/**
 * Get tracing sequence (writing practice for all vowels)
 */
export async function getTracingSequence(language: string = "hi"): Promise<TracingSequence[]> {
  const swarData = getDataForLanguage(language).swar;
  return swarData.tracing_sequence as TracingSequence[]
}

/**
 * Get a specific tracing exercise by order
 */
export async function getTracingExercise(order: number, language: string = "hi"): Promise<TracingSequence | null> {
  const swarData = getDataForLanguage(language).swar;
  const exercise = (swarData.tracing_sequence as TracingSequence[]).find((t) => t.order === order)
  return exercise || null
}

/**
 * Get true/false questions (सत्य/असत्य)
 */
export async function getTrueFalseQuestions(language: string = "hi"): Promise<TrueFalseQuestion[]> {
  const swarData = getDataForLanguage(language).swar;
  return swarData.true_false_questions as TrueFalseQuestion[]
}

/**
 * Get a specific true/false question by order
 */
export async function getTrueFalseQuestion(order: number, language: string = "hi"): Promise<TrueFalseQuestion | null> {
  const swarData = getDataForLanguage(language).swar;
  const question = (swarData.true_false_questions as TrueFalseQuestion[]).find((q) => q.order === order)
  return question || null
}

/**
 * Get all rewards/badges for swar module
 */
export async function getRewards(language: string = "hi"): Promise<Reward[]> {
  const swarData = getDataForLanguage(language).swar;
  return swarData.rewards as Reward[]
}

/**
 * Get a specific reward by ID
 */
export async function getReward(rewardId: string, language: string = "hi"): Promise<Reward | null> {
  const swarData = getDataForLanguage(language).swar;
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
  isCorrect: boolean,
  language: string = "hi"
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
export async function getGuestSwarProgress(language: string = "hi"): Promise<{ completedIds: string[], progressMap: Record<string, number> }> {
    return getGuestSwarProgressFromStorage()
}

/**
 * Save guest completion milestone
 */
export async function saveSwarMilestone(milestone: 'quiz1_completed' | 'quiz2_completed' | 'tracing_completed' | 'true_false_completed', language: string = "hi"): Promise<void> {
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
export async function checkSwarMilestone(milestone: 'quiz1_completed' | 'quiz2_completed' | 'tracing_completed' | 'true_false_completed', language: string = "hi"): Promise<boolean> {
    if (typeof window === 'undefined') return false
  try {
    const key = `brahmi_swar_milestone_${milestone}`
    const stored = sessionStorage.getItem(key)
    return !!stored
  } catch {
    return false
  }
}
