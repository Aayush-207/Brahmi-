'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  getLessonContent, 
  getLessonInfo, 
  saveProgress,
  saveAnswer,
  type IntroLessonContent,
  type IntroLesson 
} from '@/lib/introModule'
import { getCurrentIdentity, type Identity } from '@/lib/guestIdentity'
import JainBabaCharacter from '@/components/lesson/JainBabaCharacter'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'

// Helper function to get varied Guruji messages based on content type and slide index
function getGurujiMessage(contentType: string, slideIndex: number, title?: string): string {
  const textMessages = [
    "Let me share something fascinating with you.",
    "Here's an important piece of our heritage.",
    "Pay attention to this, it's quite interesting!",
    "This is a key part of understanding Brahmi.",
    "Allow me to explain this further.",
    "This knowledge has been passed down for ages.",
    "Consider this wisdom carefully.",
    "Here's something worth remembering.",
  ]
  
  const quoteMessages = [
    "Listen to these wise words.",
    "Ancient wisdom speaks to us.",
    "Let this thought resonate with you.",
    "Ponder upon this ancient saying.",
    "These words carry deep meaning.",
    "Wisdom from the ages!",
  ]
  
  const keyPointsMessages = [
    "Remember these key points.",
    "These concepts are essential.",
    "Keep these ideas in mind!",
    "Let's highlight the important parts.",
    "These are the core takeaways.",
    "Focus on these crucial points.",
  ]
  
  const timelineMessages = [
    "Let's journey through time together.",
    "Watch how history unfolds.",
    "See how things evolved over centuries.",
    "History has much to teach us.",
    "Observe the passage of time.",
  ]
  
  const comparisonMessages = [
    "Let's compare and contrast.",
    "Notice the differences and similarities.",
    "Both perspectives are valuable.",
    "See how these relate to each other.",
  ]
  
  const mapMessages = [
    "See how Brahmi spread across lands.",
    "The script traveled far and wide!",
    "Geography played a key role.",
    "Observe the regional variations.",
  ]
  
  const questionnaireMessages = [
    "Tell me a bit about your journey!",
    "I'm curious to know more about you.",
    "Share your thoughts with me.",
    "What brings you here today?",
    "Let me understand your background.",
  ]
  
  const staircaseMessages = [
    "Vowels are organized by their sound origin. Observe carefully!",
    "See how the sounds are arranged systematically.",
    "This structure reveals the genius of ancient linguists.",
    "Notice the beautiful pattern in these sounds.",
  ]
  
  switch (contentType) {
    case 'text':
    case 'text_with_image':
      return textMessages[slideIndex % textMessages.length]
    case 'quote':
      return quoteMessages[slideIndex % quoteMessages.length]
    case 'key_points':
      return title || keyPointsMessages[slideIndex % keyPointsMessages.length]
    case 'timeline':
      return timelineMessages[slideIndex % timelineMessages.length]
    case 'comparison':
      return comparisonMessages[slideIndex % comparisonMessages.length]
    case 'interactive_map':
      return mapMessages[slideIndex % mapMessages.length]
    case 'questionnaire':
      return questionnaireMessages[slideIndex % questionnaireMessages.length]
    case 'staircase_swar':
      return staircaseMessages[slideIndex % staircaseMessages.length]
    default:
      return textMessages[slideIndex % textMessages.length]
  }
}

// Content renderers for different types
function MCQSlide({ title, content, metadata, onSelect }: { title?: string; content?: string; metadata?: any; onSelect: (value: string, isCorrect: boolean) => void }) {
  const options = metadata?.options || []
  const correctAnswer = metadata?.correct_answer
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSelect = (option: string) => {
    setSelected(option)
    const correct = option === correctAnswer
    setIsCorrect(correct)
    onSelect(option, correct)
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <JainBabaCharacter 
        message={isCorrect === true ? "Excellent! You are learning fast." : isCorrect === false ? "Not quite, try again!" : "Based on what we learned, can you answer this?"}
        variant={isCorrect === true ? 'celebrating' : isCorrect === false ? 'default' : 'excited'}
      />
      {title && (
        <h2 className="text-4xl font-bold text-[#D4AF37] mb-6 text-center">{title}</h2>
      )}
      {content && (
        <p className="text-xl text-[#E6D8B8]/80 mb-8 text-center">{content}</p>
      )}
      <div className="grid grid-cols-1 gap-4">
        {options.map((option: string, idx: number) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(option)}
            className={`
              p-6 rounded-2xl border-2 text-xl font-medium transition-all text-left flex justify-between items-center
              ${selected === option
                ? isCorrect 
                  ? 'bg-green-600/20 border-green-500 text-green-400' 
                  : 'bg-red-600/20 border-red-500 text-red-400'
                : 'bg-[#2a2420] border-[#D4AF37]/30 text-[#E6D8B8] hover:border-[#D4AF37]'
              }
            `}
          >
            {option}
            {selected === option && (
              <span>{isCorrect ? '✅' : '❌'}</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function TitleSlide({ title, content }: { title?: string; content?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-8">
      <JainBabaCharacter 
        message={`Greetings! Let's explore the world of ${title || 'Brahmi'}.`}
        variant="excited"
        position="center"
      />
      <motion.h1 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl font-bold text-[#D4AF37] mt-8 mb-6"
      >
        {title}
      </motion.h1>
      {content && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl text-[#E6D8B8]/80 max-w-3xl"
        >
          {content}
        </motion.p>
      )}
    </div>
  )
}

function TextSlide({ title, content, slideIndex }: { title?: string; content?: string; slideIndex: number }) {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <JainBabaCharacter 
        message={getGurujiMessage('text', slideIndex, title)}
        variant="default"
      />
      {title && (
        <h2 className="text-4xl font-bold text-[#D4AF37] mb-6">{title}</h2>
      )}
      {content && (
        <p className="text-lg text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      )}
    </div>
  )
}

function QuoteSlide({ title, content, slideIndex }: { title?: string; content?: string; slideIndex: number }) {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <JainBabaCharacter 
        message={getGurujiMessage('quote', slideIndex)}
        variant="default"
      />
      {title && (
        <h3 className="text-2xl font-bold text-[#E69A47] mb-6">{title}</h3>
      )}
      <div className="relative">
        <div className="absolute -left-6 -top-6 text-8xl text-[#D4AF37]/20">"</div>
        <blockquote className="relative z-10 pl-8 border-l-4 border-[#D4AF37] italic text-xl text-[#E6D8B8]/90 leading-relaxed">
          {content}
        </blockquote>
      </div>
    </div>
  )
}

function KeyPointsSlide({ title, content, slideIndex }: { title?: string; content?: string; slideIndex: number }) {
  const points = content?.split('\n').filter(line => line.trim()) || []
  
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <JainBabaCharacter 
        message={getGurujiMessage('key_points', slideIndex, title)}
        variant="encouraging"
      />
      {title && (
        <h2 className="text-4xl font-bold text-[#D4AF37] mb-8">{title}</h2>
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
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#E69A47] mt-3" />
            <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: point.replace(/^\• /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#D4AF37]">$1</strong>') }} />
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function TimelineSlide({ title, metadata, slideIndex }: { title?: string; metadata?: any; slideIndex: number }) {
  const events = metadata?.events || []
  
  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <JainBabaCharacter 
        message={getGurujiMessage('timeline', slideIndex)}
        variant="default"
      />
      {title && (
        <h2 className="text-4xl font-bold text-[#D4AF37] mb-8 text-center">{title}</h2>
      )}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#D4AF37]/30 transform -translate-x-1/2" />
        
        {/* Events */}
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

function ComparisonSlide({ title, metadata, slideIndex }: { title?: string; metadata?: any; slideIndex: number }) {
  const left = metadata?.left || {}
  const right = metadata?.right || {}
  
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <JainBabaCharacter 
        message={getGurujiMessage('comparison', slideIndex)}
        variant="default"
      />
      {title && (
        <h2 className="text-4xl font-bold text-[#D4AF37] mb-8 text-center">{title}</h2>
      )}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 bg-[#2a2420] rounded-2xl border-2 border-[#D4AF37]/30"
        >
          <h3 className="text-2xl font-bold text-[#E69A47] mb-4">{left.title}</h3>
          <p className="text-lg text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line">{left.content}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 bg-[#2a2420] rounded-2xl border-2 border-[#E69A47]/30"
        >
          <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">{right.title}</h3>
          <p className="text-lg text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line">{right.content}</p>
        </motion.div>
      </div>
    </div>
  )
}

function SummarySlide({ title, content }: { title?: string; content?: string }) {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <JainBabaCharacter 
        message="Magnificent! You've reached the end of this lesson."
        variant="celebrating"
      />
      <div className="bg-gradient-to-br from-[#2a3a2a] to-[#1a2a1a] rounded-3xl p-12 border-2 border-green-600/50">
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-green-600/20 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          {title && (
            <h2 className="text-3xl font-bold text-green-400 mb-4">{title}</h2>
          )}
        </div>
        {content && (
          <p className="text-xl text-[#E6D8B8]/90 leading-relaxed text-center">
            {content}
          </p>
        )}
      </div>
    </div>
  )
}

function QuestionnaireSlide({ title, content, metadata, onSelect, slideIndex }: { title?: string; content?: string; metadata?: any; onSelect: (value: string) => void; slideIndex: number }) {
  const options = metadata?.options || []
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <JainBabaCharacter 
        message={getGurujiMessage('questionnaire', slideIndex)}
        variant="default"
      />
      {title && (
        <h2 className="text-4xl font-bold text-[#D4AF37] mb-6 text-center">{title}</h2>
      )}
      {content && (
        <p className="text-xl text-[#E6D8B8]/80 mb-8 text-center">{content}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option: string, idx: number) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelected(option)
              onSelect(option)
            }}
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

function StaircaseSwarSlide({ title, content, slideIndex }: { title?: string; content?: string; slideIndex: number }) {
  const swarPairs = [
    { short: 'अ', long: 'आ', label: 'Kantha (Guttural)' },
    { short: 'इ', long: 'ई', label: 'Talu (Palatal)' },
    { short: 'उ', long: 'ऊ', label: 'Oshtha (Labial)' },
    { short: 'ए', long: 'ऐ', label: 'Kantha-Talu' },
    { short: 'ओ', long: 'औ', label: 'Kantha-Oshtha' },
    { short: 'अं', long: 'अः', label: 'Nasi/Visarga' }
  ]

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <JainBabaCharacter 
        message={getGurujiMessage('staircase_swar', slideIndex)}
        variant="excited"
      />
      {title && (
        <h2 className="text-4xl font-bold text-[#D4AF37] mb-8 text-center">{title}</h2>
      )}
      {content && (
        <p className="text-xl text-[#E6D8B8]/80 mb-12 text-center">{content}</p>
      )}
      
      <div className="relative flex flex-col items-center">
        {swarPairs.map((pair, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="flex items-center mb-4 last:mb-0"
            style={{ marginLeft: `${idx * 40}px` }}
          >
            <div className="flex gap-4 items-center bg-[#2a2420] p-4 rounded-xl border border-[#D4AF37]/30 shadow-lg min-w-[300px]">
              <div className="text-3xl font-bold text-[#D4AF37] w-12 h-12 flex items-center justify-center bg-[#D4AF37]/10 rounded-lg">
                {pair.short}
              </div>
              <div className="text-3xl font-bold text-[#E69A47] w-12 h-12 flex items-center justify-center bg-[#E69A47]/10 rounded-lg">
                {pair.long}
              </div>
              <div className="ml-4">
                <div className="text-sm text-[#D4AF37]/60 uppercase tracking-widest font-bold">Level {idx + 1}</div>
                <div className="text-[#E6D8B8]/80">{pair.label}</div>
              </div>
            </div>
            {idx < swarPairs.length - 1 && (
              <div className="absolute h-8 w-1 bg-[#D4AF37]/20 left-[150px]" style={{ top: `${(idx + 1) * 64}px` }} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function InteractiveMapSlide({ title, metadata, slideIndex }: { title?: string; metadata?: any; slideIndex: number }) {
  const regions = metadata?.regions || []
  
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <JainBabaCharacter 
        message={getGurujiMessage('interactive_map', slideIndex)}
        variant="excited"
      />
      {title && (
        <h2 className="text-4xl font-bold text-[#D4AF37] mb-8 text-center">{title}</h2>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-[#2a2420] rounded-xl border border-[#D4AF37]/30 hover:border-[#E69A47] transition-colors"
          >
            <h3 className="text-xl font-bold text-[#D4AF37] mb-2">{region.name}</h3>
            <p className="text-[#E69A47] font-medium mb-1">{region.script}</p>
            <p className="text-sm text-[#E6D8B8]/60">{region.period}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params?.lesson_id as string
  
  const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
  const [lesson, setLesson] = useState<IntroLesson | null>(null)
  const [contents, setContents] = useState<IntroLessonContent[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    async function loadData() {
      const currentIdentity = await getCurrentIdentity()
      setIdentity(currentIdentity)
      
      const lessonInfo = await getLessonInfo(lessonId)
      setLesson(lessonInfo)
      
      const lessonContents = await getLessonContent(lessonId)
      setContents(lessonContents)
      
      setLoading(false)
      
      // Mark as in progress (for both guests and authenticated users)
      if ((currentIdentity.type === 'user' || currentIdentity.type === 'guest') && lessonContents.length > 0) {
        await saveProgress(lessonId, 'in_progress', 0, currentIdentity)
      }
    }
    
    loadData()
  }, [lessonId])

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
      // Last slide - mark as complete (for both guests and authenticated users)
      if (identity.type === 'user' || identity.type === 'guest') {
        await saveProgress(lessonId, 'completed', 100, identity)
      }
      router.push('/learn/intro')
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
      <div className="min-h-screen bg-gradient-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl">Loading lesson...</div>
      </div>
    )
  }

  if (!lesson || contents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-[#E6D8B8] flex flex-col relative">
      {/* Floating Back Button */}
      <Link 
        href="/learn/intro"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
      >
        <span className="text-lg">←</span>
        <span className="hidden sm:inline">Exit</span>
      </Link>

      {/* Floating Sign In Button */}
      <FloatingSignIn />

      {/* Floating Progress Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-48 sm:w-64 md:w-80">
        <div className="h-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full overflow-hidden shadow-lg border border-[#D4AF37]/20">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / contents.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-center text-xs text-[#D4AF37]/60 mt-1">
          {currentSlide + 1} / {contents.length}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 relative pt-16">
        {/* Navigation Buttons (Left/Right) */}
        <button
          onClick={handlePrevious}
          disabled={currentSlide === 0}
          className={`absolute left-2 md:left-10 z-10 p-3 md:p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] hover:bg-[#3A3A3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg md:text-xl shadow-xl`}
        >
          ←
        </button>

        <div className="w-full max-w-5xl h-full flex items-center justify-center overflow-y-auto">
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
              {currentContent.content_type === 'title_slide' && (
                <TitleSlide title={currentContent.title} content={currentContent.content} />
              )}
              {currentContent.content_type === 'text' && (
                <TextSlide title={currentContent.title} content={currentContent.content} slideIndex={currentSlide} />
              )}
              {currentContent.content_type === 'text_with_image' && (
                <TextSlide title={currentContent.title} content={currentContent.content} slideIndex={currentSlide} />
              )}
              {currentContent.content_type === 'quote' && (
                <QuoteSlide title={currentContent.title} content={currentContent.content} slideIndex={currentSlide} />
              )}
              {currentContent.content_type === 'key_points' && (
                <KeyPointsSlide title={currentContent.title} content={currentContent.content} slideIndex={currentSlide} />
              )}
              {currentContent.content_type === 'timeline' && (
                <TimelineSlide title={currentContent.title} metadata={currentContent.metadata} slideIndex={currentSlide} />
              )}
              {currentContent.content_type === 'comparison' && (
                <ComparisonSlide title={currentContent.title} metadata={currentContent.metadata} slideIndex={currentSlide} />
              )}
              {currentContent.content_type === 'summary' && (
                <SummarySlide title={currentContent.title} content={currentContent.content} />
              )}
              {currentContent.content_type === 'interactive_map' && (
                <InteractiveMapSlide title={currentContent.title} metadata={currentContent.metadata} slideIndex={currentSlide} />
              )}
              {currentContent.content_type === 'questionnaire' && (
                <QuestionnaireSlide 
                  title={currentContent.title} 
                  content={currentContent.content} 
                  metadata={currentContent.metadata}
                  slideIndex={currentSlide}
                  onSelect={(val) => {
                    // Questionnaires don't have a correct answer, so isCorrect is null
                    saveAnswer(lessonId, currentContent.id, val, null, identity)
                  }}
                />
              )}
              {currentContent.content_type === 'mcq' && (
                <MCQSlide 
                  title={currentContent.title} 
                  content={currentContent.content} 
                  metadata={currentContent.metadata}
                  onSelect={(val, isCorrect) => {
                    saveAnswer(lessonId, currentContent.id, val, isCorrect, identity)
                  }}
                />
              )}
              {currentContent.content_type === 'staircase_swar' && (
                <StaircaseSwarSlide title={currentContent.title} content={currentContent.content} slideIndex={currentSlide} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-2 md:right-10 z-10 p-3 md:p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 text-lg md:text-xl"
        >
          {isLastSlide ? '✓' : '→'}
        </button>
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
