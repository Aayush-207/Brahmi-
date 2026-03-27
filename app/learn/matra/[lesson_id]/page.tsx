'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  getMatraLessonContent, 
  getMatraLessonInfo, 
  saveMatraProgress,
  saveMatraAnswer,
  type MatraLessonContent,
  type MatraLesson 
} from '@/lib/matraModule'
import { getCurrentIdentity, type Identity } from '@/lib/guestIdentity'
import JainBabaCharacter from '@/components/lesson/JainBabaCharacter'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'

// Dynamically import TracerKonva with SSR disabled (Konva requires browser APIs)
const TracerKonva = dynamic(() => import('@/components/lesson/TracerKonva'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12">
      <p className="text-gray-400">Loading tracer...</p>
    </div>
  ),
})

// Unified Slide Component - Renders all content types dynamically
function UnifiedSlide({ 
  slideContent, 
  onMCQSelect,
  onContinue,
}: { 
  slideContent: MatraLessonContent;
  onMCQSelect?: (value: string, isCorrect: boolean) => void;
  onContinue?: () => void;
}) {
  const { content_type, title, content, metadata, audio_url } = slideContent
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // MCQ Handler
  const handleMCQSelect = (option: string) => {
    const correctAnswer = metadata?.correct_answer
    setSelected(option)
    const correct = option === correctAnswer
    setIsCorrect(correct)
    onMCQSelect?.(option, correct)
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
          
          {/* Display matra symbols if in metadata */}
          {metadata && (metadata.brahmi_symbol || metadata.devanagari || metadata.latin) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center gap-8 text-5xl"
            >
              {metadata.devanagari && (
                <div className="text-center">
                  <div className="text-6xl text-[#D4AF37] mb-2">{metadata.devanagari}</div>
                  <div className="text-sm text-[#D4AF37]/60">Devanagari</div>
                </div>
              )}
              {metadata.brahmi_symbol && (
                <div className="text-center">
                  <div className="text-6xl text-[#E69A47] mb-2">{metadata.brahmi_symbol}</div>
                  <div className="text-sm text-[#E69A47]/60">Brahmi</div>
                </div>
              )}
              {metadata.latin && (
                <div className="text-center">
                  <div className="text-6xl text-[#E6D8B8] mb-2">{metadata.latin}</div>
                  <div className="text-sm text-[#E6D8B8]/60">Latin</div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )

    case 'text':
    case 'matra_intro':
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

    case 'visual_guide': {
      const isRule = metadata?.type === 'rule'
      const ruleNumber = metadata?.rule_number
      
      return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={title || ''}
            variant="encouraging"
          />
          <div className="bg-gradient-to-br from-[#2a2420] to-[#1a1613] rounded-3xl p-8 md:p-12 border-2 border-[#D4AF37]/50 shadow-2xl">
            {title && (
              <h2 className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-6 md:mb-8 text-center">
                {title}
                {isRule && ruleNumber && (
                  <span className="block text-xl md:text-2xl text-[#D4AF37]/60 mt-2">
                    Rule {ruleNumber}
                  </span>
                )}
              </h2>
            )}
            
            {content && (
              <div className="text-base md:text-xl text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line text-center">
                {content}
              </div>
            )}

            {/* Display position indicators if available */}
            {metadata?.positions && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(metadata.positions).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-[#1a1613] rounded-xl p-4 text-center border border-[#D4AF37]/30">
                    <div className="text-2xl mb-2">
                      {key === 'above' && '↑'}
                      {key === 'below' && '↓'}
                      {key === 'after' && '→'}
                      {key === 'before' && '←'}
                    </div>
                    <div className="text-sm text-[#E6D8B8]/80">{value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Display examples if available */}
            {metadata?.examples && Array.isArray(metadata.examples) && (
              <div className="mt-8 space-y-3">
                {metadata.examples.map((example: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#1a1613] rounded-xl p-4 flex items-center justify-center gap-4 text-2xl border border-[#D4AF37]/30"
                  >
                    {example.consonant && <span className="text-[#E69A47]">{example.consonant}</span>}
                    {example.vowel && (
                      <>
                        <span className="text-[#D4AF37]/40">+</span>
                        <span className="text-[#D4AF37]">{example.vowel}</span>
                      </>
                    )}
                    {example.result && (
                      <>
                        <span className="text-[#D4AF37]/40">→</span>
                        <span className="text-[#E6D8B8] font-bold">{example.result}</span>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }

    case 'examples':
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={title || ''}
            variant="encouraging"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-6 md:mb-8 text-center">{title}</h2>
          )}
          {content && (
            <div className="bg-[#2a2420] rounded-2xl p-6 md:p-8 border border-[#D4AF37]/30">
              <div className="text-base md:text-lg text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line space-y-3">
                {content.split('\n').map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-[#E69A47] text-lg">•</span>
                    <span>{line}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )

    case 'pronunciation':
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={content || title || ''}
            variant="default"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-6 md:mb-8 text-center">{title}</h2>
          )}
          {content && (
            <div className="bg-[#2a2420] rounded-2xl p-6 md:p-8 border border-[#D4AF37]/30 mb-6">
              <div className="text-base md:text-lg text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line text-center">
                {content}
              </div>
            </div>
          )}
          {audio_url && (
            <div className="flex justify-center">
              <audio controls className="w-full max-w-md">
                <source src={audio_url} type="audio/mpeg" />
                Your browser does not support audio playback.
              </audio>
            </div>
          )}
        </div>
      )

    case 'practice':
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={title || ''}
            variant="encouraging"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-6 md:mb-8 text-center">{title}</h2>
          )}
          {content && (
            <div className="bg-gradient-to-br from-[#2a2420] to-[#1a1613] rounded-2xl p-8 border-2 border-[#E69A47]/50">
              <div className="text-lg md:text-xl text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line font-mono">
                {content}
              </div>
            </div>
          )}
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
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#E69A47] mt-3" />
                <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: point.replace(/^\• /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#D4AF37]">$1</strong>') }} />
              </motion.li>
            ))}
          </ul>
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
          <div className="bg-gradient-to-br from-[#2a3a2a] to-[#1a2a1a] rounded-3xl p-6 md:p-12 border-2 border-green-600/50">
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
              <div className="text-lg md:text-xl text-[#E6D8B8]/90 leading-relaxed text-center">
                <div className="space-y-3 whitespace-pre-line" dangerouslySetInnerHTML={{ 
                  __html: content
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-300">$1</strong>')
                    .replace(/✅/g, '<span class="text-green-400">✅</span>')
                    .replace(/🎊|🎉|🏆|👏|✨|🌟|🎯|🌺|💫|🏵️/g, match => `<span class="text-2xl">${match}</span>`)
                }} />
              </div>
            )}
          </div>
        </div>
      )

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
            {options.map((option: string, idx: number) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMCQSelect(option)}
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

    case 'writing_practice': {
      const character = metadata?.character
      
      return (
        <div className="min-h-[70vh] flex flex-col lg:flex-row lg:items-center lg:justify-center px-4 md:px-8 py-4 md:py-8">
          {/* Desktop Layout: Side by side */}
          <div className="hidden md:flex md:flex-row md:items-center md:gap-8 w-full max-w-6xl mx-auto">
            {/* Guruji Section - Left */}
            <div className="md:w-1/3 flex items-center justify-center">
              <JainBabaCharacter 
                message={`Now trace '${character}' - follow the guide carefully`}
                variant="encouraging"
                position="center"
              />
            </div>
            
            {/* Tracer Section - Right */}
            <div className="flex-1 flex flex-col items-center">
              <h3 className="text-[#D4AF37] text-xl lg:text-2xl font-bold mb-4 lg:mb-6 uppercase tracking-widest">
                Trace the Matra
              </h3>
              {character && (
                <TracerKonva
                  character={character}
                  width={400}
                  height={400}
                  onScoreComplete={(score) => {
                    console.log('[MatraLesson] Trace score:', score)
                  }}
                  onContinue={onContinue}
                />
              )}
            </div>
          </div>

          {/* Mobile Layout: Stacked */}
          <div className="md:hidden flex flex-col gap-6 w-full">
            {/* Guruji Character */}
            <div className="flex justify-center">
              <JainBabaCharacter 
                message={`Now trace '${character}' - follow the guide carefully`}
                variant="encouraging"
                position="center"
              />
            </div>
            
            {/* Tracer */}
            <div className="flex flex-col items-center">
              <h3 className="text-[#D4AF37] text-lg font-bold mb-4 uppercase tracking-widest">
                Trace the Matra
              </h3>
              {character && (
                <TracerKonva
                  character={character}
                  width={340}
                  height={340}
                  onScoreComplete={(score) => {
                    console.log('[MatraLesson] Trace score:', score)
                  }}
                  onContinue={onContinue}
                />
              )}
            </div>
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

export default function MatraLessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params?.lesson_id as string
  
  const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
  const [lesson, setLesson] = useState<MatraLesson | null>(null)
  const [contents, setContents] = useState<MatraLessonContent[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    async function loadData() {
      const currentIdentity = await getCurrentIdentity()
      setIdentity(currentIdentity)
      
      const lessonInfo = await getMatraLessonInfo(lessonId)
      setLesson(lessonInfo)
      
      const lessonContents = await getMatraLessonContent(lessonId)
      setContents(lessonContents)
      
      setLoading(false)
      
      // Mark as in progress (for both guests and authenticated users)
      if ((currentIdentity.type === 'user' || currentIdentity.type === 'guest') && lessonContents.length > 0) {
        await saveMatraProgress(lessonId, 'in_progress', 0, currentIdentity)
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
        await saveMatraProgress(lessonId, 'in_progress', progress, identity)
      }
    } else {
      // Last slide - mark as complete (for both guests and authenticated users)
      if (identity.type === 'user' || identity.type === 'guest') {
        await saveMatraProgress(lessonId, 'completed', 100, identity)
      }
      router.push('/learn/matra')
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
          <Link href="/learn/matra" className="text-[#D4AF37] hover:underline">
            Back to lessons
          </Link>
        </div>
      </div>
    )
  }

  const currentContent = contents[currentSlide]
  const isLastSlide = currentSlide === contents.length - 1

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-[#E6D8B8] flex flex-col relative overflow-hidden">
      {/* Floating Back Button */}
      <Link 
        href="/learn/matra"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
      >
        <span className="text-lg">←</span>
        <span className="hidden sm:inline">Exit</span>
      </Link>

      {/* Floating Sign In Button */}
      <FloatingSignIn />

      {/* Floating Progress Bar - Desktop Only */}
      <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-40 w-48 sm:w-64 md:w-80">
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
                onMCQSelect={(val, isCorrect) => {
                  saveMatraAnswer(lessonId, currentContent.id, val, isCorrect, identity)
                }}
                onContinue={handleNext}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          className="hidden md:block absolute right-2 md:right-10 z-10 p-3 md:p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 text-lg md:text-xl"
        >
          {isLastSlide ? '✓' : '→'}
        </button>
      </div>

      {/* Mobile Navigation Buttons (Bottom) - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/95 to-transparent pointer-events-none">
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
              <span className="text-[#D4AF37] font-bold text-sm">{currentSlide + 1}</span>
              <span className="text-[#D4AF37]/40 text-xs">/</span>
              <span className="text-[#D4AF37]/60 text-xs">{contents.length}</span>
            </div>
            <div className="w-16 h-1 bg-[#2C2C2C] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / contents.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Next/Complete Button - Bottom Right */}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/30 text-sm"
          >
            <span>{isLastSlide ? 'Complete' : 'Next'}</span>
            <span className="text-lg">{isLastSlide ? '✓' : '→'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
