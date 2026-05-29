'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { localizeDigits } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { getNextModuleRoute } from '@/lib/lessonFlow'
import {
  getLessonContent, 
  getLessonInfo,
  getNextIntroLessonId,
  saveProgress,
  saveAnswer,
  type IntroLessonContent,
  type IntroLesson 
} from '@/lib/introModule'
import { getCurrentIdentity, type Identity } from '@/lib/guestIdentity'
import JainBabaCharacter from '@/components/lesson/JainBabaCharacter'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'
import { useLanguage } from '@/lib/LanguageContext'

// Unified Slide Component - Renders all content types dynamically
function UnifiedSlide({ 
  slideContent, 
  slideIndex, 
  onMCQSelect, 
  onQuestionnaireSelect 
}: { 
  slideContent: IntroLessonContent;
  slideIndex: number;
  onMCQSelect?: (value: string, isCorrect: boolean) => void;
  onQuestionnaireSelect?: (value: string, optionIndex: number) => void;
}) {
  const { content_type, title, content, metadata } = slideContent
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // MCQ Handler
  const handleMCQSelect = (option: string) => {
    setSelected(option)
    // Check if this question accepts any answer (preference/questionnaire type)
    const acceptAnyAnswer = metadata?.accept_any_answer === true
    const correctAnswer = metadata?.correct_answer
    const correct = acceptAnyAnswer ? true : (option === correctAnswer)
    setIsCorrect(correct)
    onMCQSelect?.(option, correct)
  }

  // Questionnaire Handler
  const handleQuestionnaireSelect = (option: string, optionIndex: number) => {
    setSelected(option)
    onQuestionnaireSelect?.(option, optionIndex)
  }

  // Render based on content type
  switch (content_type) {
    case 'title_slide':
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 md:px-8">
          <JainBabaCharacter 
            message={content || title || ''}
            variant="excited"
            position="center"
          />
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl md:text-6xl font-bold text-[#D4AF37] mt-8 mb-6"
          >
            {title}
          </motion.h1>
          {content && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-2xl text-[#E6D8B8]/80 max-w-3xl"
            >
              {content}
            </motion.p>
          )}
        </div>
      )

    case 'text':
    case 'text_with_image':
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={content || title || ''}
            variant="default"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-4 md:mb-6">{title}</h2>
          )}
          {content && (
            <p className="text-base md:text-lg text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line">
              {content}
            </p>
          )}
        </div>
      )

    case 'quote':
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={content || ''}
            variant="default"
          />
          {title && (
            <h3 className="text-xl md:text-2xl font-bold text-[#E69A47] mb-4 md:mb-6">{title}</h3>
          )}
          <div className="relative">
            <div className="absolute -left-4 md:-left-6 -top-4 md:-top-6 text-6xl md:text-8xl text-[#D4AF37]/20">"</div>
            <blockquote className="relative z-10 pl-6 md:pl-8 border-l-4 border-[#D4AF37] italic text-lg md:text-xl text-[#E6D8B8]/90 leading-relaxed">
              {content}
            </blockquote>
          </div>
        </div>
      )

    case 'key_points': {
      const points = content?.split('\n').filter(line => line.trim()) || []
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={content || title || ''}
            variant="encouraging"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-6 md:mb-8">{title}</h2>
          )}
          <ul className="space-y-4">
            {points.map((point, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 text-lg text-[#E6D8B8]/90"
              >
                <span className="shrink-0 w-2 h-2 rounded-full bg-[#E69A47] mt-3" />
                <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: point.replace(/^\• /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#D4AF37]">$1</strong>') }} />
              </motion.li>
            ))}
          </ul>
        </div>
      )
    }

    case 'timeline': {
      const events = metadata?.events || []
      return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={title || ''}
            variant="default"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-6 md:mb-8 text-center">{title}</h2>
          )}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#D4AF37]/30 transform -translate-x-1/2" />
            <div className="space-y-12">
              {events.map((event: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className={`flex items-center gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="text-2xl font-bold text-[#E69A47]">{event.date}</div>
                  </div>
                  <div className="relative z-10 w-4 h-4 rounded-full bg-[#D4AF37] border-4 border-[#1a1613] shadow-lg" />
                  <div className={`flex-1 ${idx % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <p className="text-lg text-[#E6D8B8]/90">{event.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    case 'comparison': {
      const left = metadata?.left || {}
      const right = metadata?.right || {}
      return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={title || content || ''}
            variant="default"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-6 md:mb-8 text-center">{title}</h2>
          )}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 md:p-8 bg-[#2a2420] rounded-2xl border-2 border-[#D4AF37]/30"
            >
              <h3 className="text-xl md:text-2xl font-bold text-[#E69A47] mb-3 md:mb-4">{left.title}</h3>
              <p className="text-base md:text-lg text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line">{left.content}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 md:p-8 bg-[#2a2420] rounded-2xl border-2 border-[#E69A47]/30"
            >
              <h3 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-3 md:mb-4">{right.title}</h3>
              <p className="text-base md:text-lg text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line">{right.content}</p>
            </motion.div>
          </div>
        </div>
      )
    }

    case 'summary':
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={content || title || ''}
            variant="celebrating"
          />
          <div className="bg-linear-to-br from-[#2a3a2a] to-[#1a2a1a] rounded-3xl p-6 md:p-12 border-2 border-green-600/50">
            <div className="text-center mb-4 md:mb-6">
              <div className="inline-block p-3 md:p-4 bg-green-600/20 rounded-full mb-3 md:mb-4">
                <svg className="w-8 h-8 md:w-12 md:h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              {title && (
                <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-3 md:mb-4">{title}</h2>
              )}
            </div>
            {content && (
              <p className="text-lg md:text-xl text-[#E6D8B8]/90 leading-relaxed text-center">
                {content}
              </p>
            )}
          </div>
        </div>
      )

    case 'questionnaire': {
      const options = metadata?.options || []
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={content || title || ''}
            variant="default"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-4 md:mb-6 text-center">{title}</h2>
          )}
          {content && (
            <p className="text-lg md:text-xl text-[#E6D8B8]/80 mb-6 md:mb-8 text-center">{content}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option: string, idx: number) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuestionnaireSelect(option, idx)}
                className={`
                  p-4 rounded-xl border-2 text-lg font-medium transition-all
                  ${selected === option
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1a1613]'
                    : 'bg-[#2a2420] border-[#D4AF37]/30 text-[#E6D8B8] hover:border-[#D4AF37]'
                  }
                `}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      )
    }

    case 'mcq': {
      const options = metadata?.options || []
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={content || title || ''}
            variant={isCorrect === true ? 'celebrating' : isCorrect === false ? 'default' : 'excited'}
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-4 md:mb-6 text-center">{title}</h2>
          )}
          {content && (
            <p className="text-lg md:text-xl text-[#E6D8B8]/80 mb-6 md:mb-8 text-center">{content}</p>
          )}
          <div className="grid grid-cols-1 gap-4">
            {options.map((opt: any, idx: number) => {
              const optionText = typeof opt === 'object' ? opt.text : opt;
              const optionSubtext = typeof opt === 'object' ? opt.translation : null;
              
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMCQSelect(optionText)}
                  className={`
                    p-6 rounded-2xl border-2 text-xl font-medium transition-all text-left flex justify-between items-center
                    ${selected === optionText
                      ? isCorrect 
                        ? 'bg-green-600/20 border-green-500 text-green-400' 
                        : 'bg-red-600/20 border-red-500 text-red-400'
                      : 'bg-[#2a2420] border-[#D4AF37]/30 text-[#E6D8B8] hover:border-[#D4AF37]'
                    }
                  `}
                >
                  <div>
                    <div>{optionText}</div>
                    {optionSubtext && <div className="text-sm opacity-70 mt-1">{optionSubtext}</div>}
                  </div>
                  {selected === optionText && (
                    <span>{isCorrect ? '✅' : '❌'}</span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      )
    }

    case 'staircase_swar': {
      const swarPairs = [
        { short: 'अ', long: 'आ', label: 'Kantha (Guttural)' },
        { short: 'इ', long: 'ई', label: 'Talu (Palatal)' },
        { short: 'उ', long: 'ऊ', label: 'Oshtha (Labial)' },
        { short: 'ए', long: 'ऐ', label: 'Kantha-Talu' },
        { short: 'ओ', long: 'औ', label: 'Kantha-Oshtha' },
        { short: 'अं', long: 'अः', label: 'Nasi/Visarga' }
      ]
      return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={content || title || ''}
            variant="excited"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-6 md:mb-8 text-center">{title}</h2>
          )}
          {content && (
            <p className="text-lg md:text-xl text-[#E6D8B8]/80 mb-8 md:mb-12 text-center">{content}</p>
          )}
          <div className="relative flex flex-col items-center">
            {swarPairs.map((pair, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="flex items-center mb-4 last:mb-0"
              >
                <div className="flex gap-4 items-center bg-[#2a2420] p-4 rounded-xl border border-[#D4AF37]/30 shadow-lg min-w-75">
                  <div className="text-3xl font-bold text-[#D4AF37] w-12 h-12 flex items-center justify-center bg-[#D4AF37]/10 rounded-lg">
                    {pair.short}
                  </div>
                  <div className="text-3xl font-bold text-[#E69A47] w-12 h-12 flex items-center justify-center bg-[#E69A47]/10 rounded-lg">
                    {pair.long}
                  </div>
                  <div className="ml-4">
                    <div className="text-[#E6D8B8]/80">{pair.label}</div>
                  </div>
                </div>
                {idx < swarPairs.length - 1 && (
                  <div className="absolute h-8 w-1 bg-[#D4AF37]/20 left-37.5" style={{ top: `${(idx + 1) * 64}px` }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )
    }

    case 'interactive_map': {
      const regions = metadata?.regions || []
      return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={title || content || ''}
            variant="excited"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-6 md:mb-8 text-center">{title}</h2>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {regions.map((region: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 md:p-6 bg-[#2a2420] rounded-xl border border-[#D4AF37]/30 hover:border-[#E69A47] transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold text-[#D4AF37] mb-2">{region.name}</h3>
                <p className="text-[#E69A47] font-medium mb-1 text-sm md:text-base">{region.script}</p>
                <p className="text-xs md:text-sm text-[#E6D8B8]/60">{region.period}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }

    default:
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <p className="text-[#E6D8B8]/70">Unknown content type: {content_type}</p>
        </div>
      )
  }
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const lessonId = params?.lesson_id as string
  
  const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
  const [lesson, setLesson] = useState<IntroLesson | null>(null)
  const [contents, setContents] = useState<IntroLessonContent[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)
  const [mcqSelected, setMcqSelected] = useState(false)

  const finishLesson = async () => {
    if (identity.type === 'user' || identity.type === 'guest') {
      await saveProgress(lessonId, 'completed', 100, identity)
    }

    const nextLessonId = await getNextIntroLessonId(lessonId, language)
    if (nextLessonId) {
      router.push(`/learn/intro/${nextLessonId}`)
      return
    }

    const nextModuleRoute = getNextModuleRoute('module-intro')
    if (nextModuleRoute) {
      router.push(nextModuleRoute)
    } else {
      router.push('/learn')
    }
  }

  useEffect(() => {
    async function loadData() {
      const currentIdentity = await getCurrentIdentity()
      setIdentity(currentIdentity)
      
      console.log(`[LessonPage] Loading lesson: ${lessonId}, language: ${language}`)
      
      const lessonInfo = await getLessonInfo(lessonId, language)
      console.log(`[LessonPage] getLessonInfo returned:`, lessonInfo)
      setLesson(lessonInfo)
      
      const lessonContents = await getLessonContent(lessonId, language)
      console.log(`[LessonPage] getLessonContent returned ${lessonContents.length} slides`)
      setContents(lessonContents)
      
      setLoading(false)
      
      // Mark as in progress (for both guests and authenticated users)
      if ((currentIdentity.type === 'user' || currentIdentity.type === 'guest') && lessonContents.length > 0) {
        await saveProgress(lessonId, 'in_progress', 0, currentIdentity)
      }
    }
    
    loadData()
  }, [lessonId, language])

  // Reset MCQ selection state when slide changes
  useEffect(() => {
    setMcqSelected(false)
  }, [currentSlide])

  const handleNext = async () => {
    if (currentSlide < contents.length - 1) {
      setDirection(1)
      setCurrentSlide(currentSlide + 1)
      
      // Update progress percentage (for both guests and authenticated users)
      const progress = Math.round(((currentSlide + 2) / contents.length) * 100)
      if (identity.type === 'user' || identity.type === 'guest') {
        await saveProgress(lessonId, 'in_progress', progress, identity)
      }
    } else {
      await finishLesson()
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(currentSlide - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl">Loading lesson...</div>
      </div>
    )
  }

  if (!lesson || contents.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#E69A47] text-xl mb-4">Lesson not found</div>
          <Link href="/learn/intro" className="text-[#D4AF37] hover:underline">
            Back to lessons
          </Link>
        </div>
      </div>
    )
  }

  const currentContent = contents[currentSlide]
  const isLastSlide = currentSlide === contents.length - 1
  const progressNumber = (value: number | string) => localizeDigits(String(value), language)

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-[#E6D8B8] flex flex-col relative overflow-hidden">
      {/* Floating Back Button */}
      <Link 
        href="/learn/intro"
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 flex items-center gap-1.5 px-1.5 py-1 sm:px-4 sm:py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
      >
        <span className="text-sm sm:text-lg">←</span>
        <span className="hidden sm:inline">Exit</span>
      </Link>

      {/* Floating Sign In Button */}
      <FloatingSignIn />

      {/* Floating Progress Bar - Desktop Only */}
      <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-40 w-48 sm:w-64 md:w-80">
        <div className="h-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full overflow-hidden shadow-lg border border-[#D4AF37]/20">
          <motion.div
            className="h-full bg-linear-to-r from-[#D4AF37] to-[#F2D06B]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / contents.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-center text-xs text-[#D4AF37]/60 mt-1">
          {progressNumber(currentSlide + 1)} / {progressNumber(contents.length)}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center md:p-6 relative pt-16 md:pt-16 pb-24 md:pb-0 overflow-x-hidden">
        {/* Navigation Buttons (Left/Right) - Desktop Only */}
        <button
          onClick={handlePrevious}
          disabled={currentSlide === 0}
          className={`hidden md:block absolute left-2 md:left-10 z-10 p-3 md:p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] hover:bg-[#3A3A3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg md:text-xl shadow-xl`}
        >
          ←
        </button>

        <div className="w-full max-w-5xl h-full flex items-center justify-center overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              className="w-full py-8"
            >
              <UnifiedSlide
                slideContent={currentContent}
                slideIndex={currentSlide}
                onMCQSelect={(val, isCorrect) => {
                  saveAnswer(lessonId, currentContent.id, val, isCorrect, identity)
                  setMcqSelected(true)
                }}
                onQuestionnaireSelect={async (val, optionIndex) => {
                  saveAnswer(lessonId, currentContent.id, val, false, identity)
                  if (currentContent.metadata?.direct_complete_option_index === optionIndex) {
                    await finishLesson()
                    return
                  }
                  setMcqSelected(true)
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Next / Arrow: For MCQ slides hide until selection; show arrow-only after select */}
        {currentContent.content_type === 'mcq' ? (
          mcqSelected && (
            <button
              onClick={handleNext}
              className="hidden md:block absolute right-2 md:right-10 z-10 p-3 md:p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 text-lg md:text-xl"
            >
              →
            </button>
          )
        ) : (
          <button
            onClick={handleNext}
            className="hidden md:block absolute right-2 md:right-10 z-10 p-3 md:p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 text-lg md:text-xl"
          >
            {isLastSlide ? '✓' : '→'}
          </button>
        )}
      </div>

      {/* Mobile Navigation Buttons (Bottom) - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-linear-to-t from-[#1C1C1C] via-[#1C1C1C]/95 to-transparent pointer-events-none">
        <div className="flex justify-between items-center gap-3 pointer-events-auto">
          {/* Previous Button - Bottom Left */}
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2C2C2C] text-[#D4AF37] border border-[#D4AF37]/30 font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg text-sm`}
          >
            <span className="text-lg">←</span>
            <span>Prev</span>
          </button>

          {/* Progress Indicator - Center */}
          <div className="flex flex-col items-center gap-1 px-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#D4AF37] font-bold text-sm">{progressNumber(currentSlide + 1)}</span>
              <span className="text-[#D4AF37]/40 text-xs">/</span>
              <span className="text-[#D4AF37]/60 text-xs">{progressNumber(contents.length)}</span>
            </div>
            <div className="w-16 h-1 bg-[#2C2C2C] rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-[#D4AF37] to-[#F2D06B] transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / contents.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Next/Complete Button - Bottom Right */}
          {/* Mobile Next: For MCQ slides hide until selection, show arrow-only after select */}
          {currentContent.content_type === 'mcq' ? (
            mcqSelected ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/30 text-sm"
              >
                <span className="text-lg">→</span>
              </button>
            ) : (
              <div className="w-24" />
            )
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/30 text-sm"
            >
              <span>{isLastSlide ? 'Complete' : 'Next'}</span>
              <span className="text-lg">{isLastSlide ? '✓' : '→'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Keyboard navigation script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
              const prevBtn = document.querySelector('button[disabled="false"]:first-child');
              prevBtn?.click();
            }
            if (e.key === 'ArrowRight') {
              const nextBtn = document.querySelector('button:last-child');
              nextBtn?.click();
            }
          });
        `
      }} />
    </div>
  )
}
