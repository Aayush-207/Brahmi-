import { Identity } from './guestIdentity'
import { getDataForLanguage } from '@/backend/data/index'

const GUEST_VYANJAN_PROGRESS_KEY = 'brahmi_guest_vyanjan_progress'

type GuestVyanjanProgress = {
  completedIds: string[]
  progressMap: Record<string, number>
  lastUpdated: string
}

export type VyanjanLesson = {
  id: string
  module_id: string
  lesson_id: string
  title: string
  subtitle: string
  description: string
  thumbnail_icon: string
  order_no: number
  estimated_time_minutes: number
  consonant_group: string
}

export type VyanjanLessonContent = {
  id: string
  lesson_id: string
  content_type: 'title_slide' | 'text' | 'mcq' | 'writing_practice' | 'pronunciation'
  title: string
  content: string
  metadata?: any
  order_no: number
}

export type Consonant = {
  id: string
  order: number
  category: string
  categoryHindi: string
  categoryEnglish: string
  categoryDescription: string
  devanagari: string
  brahmi: string
  romanized: string
  pronunciationNote: string
  exampleWords: Array<{ devanagari: string, romanized: string, english: string }>
}

const VYANJAN_ENGLISH_SUBTITLES: Record<string, string> = {
  all: '',
  kanthya: 'Guttural',
  talavya: 'Palatal',
  murdhanya: 'Retroflex',
  dantya: 'Dental',
  osthya: 'Labial',
  antahstha: 'Semi-vowels',
  ushma: 'Sibilants'
}

const VYANJAN_ENGLISH_DESCRIPTIONS: Record<string, string> = {
  all: 'Learn about the 33 Brahmi consonants arranged into 7 groups.',
  kanthya: 'Learn the 5 guttural consonants (ka, kha, ga, gha, nga).',
  talavya: 'Learn the 5 palatal consonants (cha, chha, ja, jha, nya).',
  murdhanya: 'Learn the 5 retroflex consonants (ta, tha, da, dha, na).',
  dantya: 'Learn the 5 dental consonants (ta, tha, da, dha, na).',
  osthya: 'Learn the 5 labial consonants (pa, pha, ba, bha, ma).',
  antahstha: 'Learn the 4 semi-vowels (ya, ra, la, va).',
  ushma: 'Learn the 4 fricative consonants (sha, sha, sa, ha).'
}

function getEnglishVyanjanSubtitle(category: string, fallback: string): string {
  return VYANJAN_ENGLISH_SUBTITLES[category] ?? fallback
}

function getEnglishVyanjanDescription(category: string, fallback: string): string {
  return VYANJAN_ENGLISH_DESCRIPTIONS[category] ?? fallback
}

// Progress functions
function getGuestVyanjanProgressFromStorage(): { completedIds: string[], progressMap: Record<string, number> } {
  if (typeof window === 'undefined') return { completedIds: [], progressMap: {} }
  try {
    const stored = sessionStorage.getItem(GUEST_VYANJAN_PROGRESS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as GuestVyanjanProgress
      return { completedIds: parsed.completedIds || [], progressMap: parsed.progressMap || {} }
    }
  } catch (error) {}
  return { completedIds: [], progressMap: {} }
}

function saveGuestVyanjanProgressToStorage(completedIds: string[], progressMap: Record<string, number>) {
  if (typeof window === 'undefined') return
  try {
    const progress: GuestVyanjanProgress = {
      completedIds,
      progressMap,
      lastUpdated: new Date().toISOString()
    }
    sessionStorage.setItem(GUEST_VYANJAN_PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {}
}

export async function saveVyanjanProgress(
  lessonId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progress: number,
  identity: Identity,
  unused?: any,
  language: string = 'hi'
): Promise<void> {
  if (identity.type === 'guest') {
    const { completedIds, progressMap } = getGuestVyanjanProgressFromStorage()
    progressMap[lessonId] = progress
    if (status === 'completed' && !completedIds.includes(lessonId)) {
      completedIds.push(lessonId)
    }
    saveGuestVyanjanProgressToStorage(completedIds, progressMap)
  }
}

export async function getVyanjanProgress(identity: Identity): Promise<{ completedIds: string[], progressMap: Record<string, number> }> {
  if (identity.type === 'guest') {
    return getGuestVyanjanProgressFromStorage()
  }
  return { completedIds: [], progressMap: {} }
}

// Added this to fix common pattern
export async function getCompletedVyanjanLessonIds(identity: Identity): Promise<string[]> {
  const { completedIds } = await getVyanjanProgress(identity)
  return completedIds
}

export async function getVyanjanLessons(language: string = 'hi'): Promise<VyanjanLesson[]> {
  const data = getDataForLanguage(language)
  const lessons = data.vyanjan.lessons as VyanjanLesson[]

  if (language === 'hi') {
    return lessons
  }

  return lessons.map((lesson: any) => ({
    ...lesson,
    title: lesson.title_english || lesson.title,
    subtitle: getEnglishVyanjanSubtitle(lesson.consonant_group, lesson.subtitle),
    description: getEnglishVyanjanDescription(lesson.consonant_group, lesson.description)
  }))
}

export async function getVyanjanLessonContent(lessonId: string, language: string = 'hi'): Promise<VyanjanLessonContent[]> {
  const data = getDataForLanguage(language)
  const vyanjanData = data.vyanjan
  const matraData = data.matras
  
  const lesson = vyanjanData.lessons.find((l: any) => l.lesson_id === lessonId)
  if (!lesson) return []

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
  
  const categoriesMap = vyanjanData.categories as any
  const categoryKey = lesson.consonant_group
  const categoryData = categoriesMap[categoryKey]
  
  // Category Intro slide
  if (categoryData) {
    content.push({
      id: `${lessonId}-category-intro`,
      lesson_id: lessonId,
      content_type: 'text',
      title: language === 'hi' ? (categoryData.nameHindi || categoryData.name) : (categoryData.english || categoryData.name),
      content: language === 'hi' ? (categoryData.descriptionHindi || categoryData.description) : (categoryData.descriptionEnglish || categoryData.description),
      order_no: 1.5
    })
  }
  
  let orderNo = 2;

  if (categoryData && categoryData.consonantIds) {
    const consonantsList = vyanjanData.consonants as unknown as Consonant[];
    for (const consonantId of categoryData.consonantIds) {
      const c = consonantsList.find(x => x.id === consonantId);
      if (c) {
        // Pronunciation slide
        content.push({
          id: `${lessonId}-letter-${c.id}`,
          lesson_id: lessonId,
          content_type: 'pronunciation',
          title: `${c.devanagari} (${c.romanized})`,
          content: `${language === 'hi' ? c.categoryHindi : c.categoryEnglish} - ${language === 'hi' ? c.categoryDescription : getEnglishVyanjanDescription(c.category, c.categoryDescription)}\n\n${language === 'hi' ? 'ध्वनि' : 'Sound'}: ${c.pronunciationNote}\n\n${language === 'hi' ? 'उदाहरण' : 'Examples'}: ${c.exampleWords && c.exampleWords.length > 0 ? c.exampleWords.map((ex: any) => language === 'hi' ? ex.devanagari : (ex.english || ex.devanagari)).join(", ") : ""}`,
          metadata: {
            brahmi_symbol: c.brahmi,
            devanagari: c.devanagari,
            sound: c.romanized
          },
          order_no: orderNo++
        });

        // Writing practice
        content.push({
          id: `${lessonId}-tracer-${c.id}`,
          lesson_id: lessonId,
          content_type: 'writing_practice',
          title: `${language === 'hi' ? 'अभ्यास' : 'Practice'} - ${c.devanagari}`,
          content: `${language === 'hi' ? 'लिखने का अभ्यास करें' : 'Practice writing the consonant'}`,
          metadata: {
            id: c.id,
            brahmi_symbol: c.brahmi,
            devanagari: c.devanagari
          },
          order_no: orderNo++
        });

        // Combination practice
        const combo = matraData.consonantMatraCombinations?.find((x: any) => x.consonantId === c.id);
        if (combo && combo.forms) {
           const sampleForms = combo.forms.slice(1, 4); // AA, I, II
           sampleForms.forEach((f: any) => {
               content.push({
                   id: `${lessonId}-combo-${c.id}-${f.matraOrder}`,
                   lesson_id: lessonId,
                   content_type: 'text',
                   title: `${c.devanagari} + ${f.matraName} = ${f.combinedDevanagari}`,
                   content: `${language === 'hi' ? 'ब्राह्मी रूप' : 'Brahmi form'}: ${f.combinedBrahmi}`,
                   metadata: { brahmi: f.combinedBrahmi, devanagari: f.combinedDevanagari },
                   order_no: orderNo++
               });
           });
        }
      }
    }
  }
  
  return content
}
