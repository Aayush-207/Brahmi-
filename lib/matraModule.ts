/**
 * Matra Module - Data Access Layer
 * 
 * This module provides functions to interact with the matra (vowel diacritics) lessons,
 * content, progress tracking, and quiz answers.
 */

import type { Identity } from './guestIdentity'
import { getDataForLanguage } from '@/backend/data/index'
import { loadAccountLessonProgress, saveAccountLessonProgress } from './supabase/lessonProgress'

// ============================================
// TYPE DEFINITIONS
// ============================================

export type MatraLesson = {
  id: number
  module_id: string
  lesson_id: string
  title: string
  title_english?: string
  title_tamil?: string
  subtitle: string | null
  subtitle_tamil?: string
  description?: string
  description_english?: string
  description_tamil?: string
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

const MATRA_ENGLISH_SUBTITLES: Record<string, string> = {
  'matras-lesson-001': 'Matra Introduction',
  'matras-lesson-002': 'Inherent A',
  'matras-lesson-003': 'AA Matra',
  'matras-lesson-004': 'I Matra',
  'matras-lesson-005': 'II Matra',
  'matras-lesson-006': 'U Matra',
  'matras-lesson-007': 'UU Matra',
  'matras-lesson-008': 'E Matra',
  'matras-lesson-009': 'AI Matra',
  'matras-lesson-010': 'O Matra',
  'matras-lesson-011': 'AU Matra',
  'matras-lesson-012': 'Anusvara',
  'matras-lesson-013': 'Visarga'
}

function getEnglishMatraSubtitle(lessonId: string, fallback: string | null): string | null {
  return MATRA_ENGLISH_SUBTITLES[lessonId] ?? fallback
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
  // Sort by order_no to ensure correct sequence
  const sortedLessons = lessons.sort((a: MatraLesson, b: MatraLesson) => a.order_no - b.order_no);
  let progressByLessonId: Record<string, { status: 'not_started' | 'in_progress' | 'completed'; progress_percentage: number }> = {}

  if (identity.type === 'guest' || !identity.id) {
    progressByLessonId = getGuestMatraProgressFromStorage()
  } else {
    const accountProgress = await loadAccountLessonProgress('module-matra', identity.id)
    progressByLessonId = Object.values(accountProgress).reduce<Record<string, { status: 'not_started' | 'in_progress' | 'completed'; progress_percentage: number }>>((accumulator, entry) => {
      accumulator[entry.lesson_id] = {
        status: entry.status,
        progress_percentage: entry.progress_percentage || 0
      }
      return accumulator
    }, {})
  }

  const isTamil = language === 'ta';

  const applyProgress = (lesson: MatraLesson): MatraLesson => ({
    ...lesson,
    status: progressByLessonId[lesson.lesson_id]?.status || 'not_started',
    progress_percentage: progressByLessonId[lesson.lesson_id]?.progress_percentage || 0
  })

  if (language !== 'hi') {
    return sortedLessons.map((lesson) => ({
      ...lesson,
      title: isTamil ? (lesson.title_tamil || lesson.title || lesson.title_english || '') : (lesson.title_english || lesson.title),
      subtitle: isTamil ? (lesson.subtitle || getEnglishMatraSubtitle(lesson.lesson_id, lesson.subtitle) || '') : getEnglishMatraSubtitle(lesson.lesson_id, lesson.subtitle),
      description: isTamil ? (lesson.description_tamil || lesson.description || lesson.description_english || '') : (lesson.description_english || lesson.description || ''),
      status: progressByLessonId[lesson.lesson_id]?.status || 'not_started',
      progress_percentage: progressByLessonId[lesson.lesson_id]?.progress_percentage || 0
    }));
  }

  return sortedLessons.map(applyProgress);
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
  const isTamil = language === 'ta';
  
  const lesson = (matraData.lessons as unknown as MatraLesson[]).find(l => l.lesson_id === lessonId)
  if (!lesson) return []

  const displayTitle = language === 'hi'
    ? lesson.title
    : (isTamil ? (lesson.title_tamil || lesson.title || lesson.title_english || '') : (lesson.title_english || lesson.title))
  const displayDescription = language === 'hi'
    ? (lesson.description || '')
    : (isTamil ? (lesson.description_tamil || lesson.description || lesson.description_english || '') : (lesson.description_english || lesson.description || ''))
  
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
      title: displayTitle,
      content: displayDescription,
    audio_url: null,
    metadata: { 
      matra_symbol: lesson.matra_symbol,
      brahmi_symbol: matra ? matra.exampleBrahmi : null,
      devanagari: matra ? matra.exampleDevanagari : null,
        latin: matra ? matra.matraName : null,
        tamil: matra ? matra.tamilName : null
    },
    order_no: 1,
    language: language,
    created_at: new Date().toISOString()
  })
  
  if (matra) {
    const matraDescription = language === 'hi'
      ? (matra.description || '')
      : (isTamil ? (matra.descriptionTamil || matra.description || matra.descriptionEnglish || '') : (matra.descriptionEnglish || matra.description || ''))
    content.push({
      id: 2,
      lesson_id: lessonId,
      content_type: 'pronunciation',
      title: language === 'hi' ? 'मात्रा संयोजन' : (language === 'kn' ? 'ಮಾತ್ರಾ ಸಂಯೋಜನೆ' : (isTamil ? 'மாத்ரா இணைவு' : 'Matra Combination')),
      content: matraDescription,
      audio_url: null,
      metadata: (function(){
        const meta: any = {
          brahmi_symbol: matra.exampleBrahmi,
          devanagari: matra.exampleDevanagari,
          sound: matra.example_combination,
          tamil: matra.exampleDevanagari || matra.tamilName || ''
        }

        // Only produce romanized metadata for English UI
        if (language === 'en') {
          function romanizeConsonantWithMatra(baseRomanized: string, matraName: string) {
            const root = baseRomanized.endsWith('a') ? baseRomanized.slice(0, -1) : baseRomanized
            const suffixMap: Record<string, string> = {
              None: 'a',
              'आ': 'aa',
              'इ': 'i',
              'ई': 'ee',
              'उ': 'u',
              'ऊ': 'oo',
              'ए': 'e',
              'ऐ': 'ai',
              'ओ': 'o',
              'औ': 'au',
              'अं': 'am',
              'अः': 'ah'
            }
            const suffix = suffixMap[matraName] || 'a'
            return `${root}${suffix}`
          }

          try {
            const matraKey = matra.vowelDevanagari || matra.matraName || ''
            meta.romanized = romanizeConsonantWithMatra('ka', matraKey)
          } catch (e) {
            meta.romanized = null
          }

          try {
            const consonants = (matraData.consonants || []) as any[]
            const combos = (matraData.consonantMatraCombinations || []) as any[]
            const sample: string[] = []
            for (let i=0;i<Math.min(6, combos.length);i++){
              const combo = combos[i]
              const cDev = combo.consonantDevanagari
              const cObj = consonants.find(c=>c.devanagari === cDev || c.brahmi === combo.consonantBrahmi)
              const baseRoman = cObj?.romanized || 'ka'
              const f = combo.forms?.find((fr:any)=>fr.matraDevanagari === matra.vowelDevanagari || fr.matraName === matra.matraName) || combo.forms?.[0]
              const matraName = f?.matraName || f?.matraDevanagari || ''
              sample.push(`${baseRoman} + ${matraName} = ${romanizeConsonantWithMatra(baseRoman, matraName)}`)
            }
            meta.combosRomanized = sample
          } catch (e) {
            meta.combosRomanized = []
          }
        }

        return meta
      })(),
      order_no: 2,
      language: language,
      created_at: new Date().toISOString()
    })

    if (matra.matraSign && matra.matraSign !== "") {
      content.push({
        id: 3,
        lesson_id: lessonId,
        content_type: 'writing_practice',
        title: language === 'hi' ? 'मात्रा अभ्यास' : (language === 'kn' ? 'ಮಾತ್ರಾ ಅಭ್ಯಾಸ' : 'Matra Practice'),
        content: language === 'hi' ? `अभ्यास करें` : (language === 'kn' ? `ಬ್ರಾಹ್ಮಿ ಮಾತ್ರೆಯ '${matra.matraSign}' ಅಭ್ಯಾಸ ಮಾಡಿ` : (isTamil ? `பிராமி மாத்ரை '${matra.matraSign}'-ஐப் பயிற்சி செய்யுங்கள்` : `Practice the Brahmi matra '${matra.matraSign}'`)),
        audio_url: null,
        metadata: { character: matra.exampleBrahmi },
        order_no: 3,
        language: language,
        created_at: new Date().toISOString()
      })
    }
  }
  
  // Add rules slide for introduction lesson
  if (lessonId === 'matras-lesson-001') {
    (matraData.matraRules as unknown as any[]).forEach((rule: any, idx: number) => {
      const title = language === 'hi' ? (rule.title || '') : (isTamil ? (rule.titleTamil || rule.title || rule.titleEnglish || '') : (rule.titleEnglish || rule.title || ''))
      const description = language === 'hi' ? (rule.description || '') : (isTamil ? (rule.descriptionTamil || rule.description || rule.descriptionEnglish || '') : (rule.descriptionEnglish || rule.description || ''))
      content.push({
        id: 10 + idx,
        lesson_id: lessonId,
        content_type: 'text',
        title,
        content: description,
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
    title: language === 'hi' ? 'सारांश' : (isTamil ? 'சுருக்கம்' : 'Summary'),
    content: language === 'hi' ? `${lesson.title} को सफलतापूर्वक पूरा किया!` : (isTamil ? `${displayTitle} வெற்றிகரமாக முடிக்கப்பட்டது!` : `Successfully completed ${displayTitle}!`),
    audio_url: null,
    metadata: null,
    order_no: 50,
    language: language,
    created_at: new Date().toISOString()
  })
  
  return content
}

/**
 * Get the next lesson ID in the Matra module
 * Returns null if this is the last lesson
 */
export async function getNextMatraLessonId(currentLessonId: string, identity: Identity, language: string = 'hi'): Promise<string | null> {
  const lessons = await getMatraLessons(identity, language)
  const currentIndex = lessons.findIndex(l => l.lesson_id === currentLessonId)
  
  if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
    return lessons[currentIndex + 1].lesson_id
  }
  
  return null // This is the last lesson
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

  return saveAccountLessonProgress('module-matra', lessonId, status, progressPercentage, identity.id)
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
