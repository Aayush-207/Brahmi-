'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { markLessonComplete } from '@/lib/progress'
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { getLetterSteps, getLetterQuiz } from '@/lib/introModule'
import LessonQuiz, { McqQuestion, McqOption } from '@/components/lesson/LessonQuiz'
import JainBabaCharacter from '@/components/lesson/JainBabaCharacter'
import JainBabaSVG from '@/components/lesson/JainBabaSVG'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'

// Dynamically import TracerKonva with SSR disabled (Konva requires browser APIs)
const TracerKonva = dynamic(() => import('@/components/lesson/TracerKonva'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full aspect-square max-w-md border-2 border-dashed border-gray-600 rounded-2xl bg-[#2C2C2C]">
      <p className="text-gray-400">Loading tracer...</p>
    </div>
  ),
});

// TypeScript types
type Letter = {
    id: string
    letter_name: string
    brahmi_symbol: string
    order_no: number
    letter_type: 'vowel' | 'consonant'
}

type LetterStep = {
    id: string
    letter_id: string
    step_type: 'show' | 'sound' | 'explanation' | 'example' | 'practice' | 'complete'
    content: string
    order_no: number
    letters: Letter  // Single object, not array
}

function getPracticeText(language: string): string {
    if (language === 'hi') return 'अभ्यास'
    if (language === 'kn') return 'ಅಭ್ಯಾಸ'
    if (language === 'ta') return 'பயிற்சி'
    return 'Practice'
}

function getExitText(language: string): string {
    if (language === 'hi') return 'बाहर निकलें'
    if (language === 'kn') return 'ನಿರ್ಗಮಿಸಿ'
    if (language === 'ta') return 'வெளியேறு'
    return 'Exit'
}

export default function LessonPage({ params }: { params: Promise<{ letter_id: string }> }) {
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
    const [isLoaded, setIsLoaded] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { language } = useLanguage()
    const [steps, setSteps] = useState<LetterStep[]>([])

    useEffect(() => {
        const loadIdentity = async () => {
            const currentIdentity = await getCurrentIdentity()
            setIdentity(currentIdentity)
            setIsLoaded(true)
            
            // Allow guest access to lessons - no redirect needed
        }
        loadIdentity()
    }, [router])
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [letterId, setLetterId] = useState<string | null>(null)
    const [currentLessonOrderNo, setCurrentLessonOrderNo] = useState<number>(0)
    const [letterType, setLetterType] = useState<'vowel' | 'consonant'>('vowel') // Default to vowel
    const [isAnimating, setIsAnimating] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)

    // Quiz state
    const [quizMode, setQuizMode] = useState(false)
    const [quizQuestions, setQuizQuestions] = useState<McqQuestion[]>([])

    // Trace state
    const [traceMode, setTraceMode] = useState(false)
    const [canvasSize, setCanvasSize] = useState(340)
    const [isMobile, setIsMobile] = useState(false)
    // Removed strokes state as it's no longer needed

    // Set responsive canvas size
    useEffect(() => {
        const updateCanvasSize = () => {
            const width = window.innerWidth;
            const mobile = width < 768;
            setIsMobile(mobile);
            
            if (width < 400) {
                setCanvasSize(280); // Small phones
            } else if (width < 640) {
                setCanvasSize(320); // Larger phones
            } else if (width < 1024) {
                setCanvasSize(340); // Tablets
            } else {
                setCanvasSize(400); // Desktop
            }
        };
        
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    // Unwrap params
    useEffect(() => {
        params.then((p) => {
            setLetterId(p.letter_id)
        })
    }, [params])

    // Fetch steps for this specific letter
    useEffect(() => {
        if (!letterId) return

        async function fetchLessonData() {
            setLoading(true)
            setError(null)

            // 1. Fetch Steps using getLetterSteps with language support
            console.log(`[LessonPage] Fetching steps for letterId=${letterId}, language=${language}`)
            const stepsData = await getLetterSteps(letterId as string, language)

            if (!stepsData || stepsData.length === 0) {
                setError('No steps found for this letter.')
                setLoading(false)
                return
            }

            setSteps(stepsData as unknown as LetterStep[])

            // Store current lesson details
            const firstStep = stepsData[0] as any
            if (firstStep?.letters) {
                setCurrentLessonOrderNo(firstStep.letters.order_no)
                setLetterType(firstStep.letters.letter_type || 'vowel')
            }

            // 2. Fetch Quiz Questions support
            console.log(`[LessonPage] Fetching quiz for letterId=${letterId}, language=${language}`)
            const quizData = await getLetterQuiz(letterId as string, language)
            setQuizQuestions(quizData)

            setLoading(false)

            // Handle initial mode from search params
            const mode = searchParams.get('mode')
            if (letterId === 'practice-time') {
                setTraceMode(false)
                if (quizData.length > 0) {
                    setQuizMode(true)
                }
            } else if (mode === 'trace') {
                setTraceMode(true)
            } else if (mode === 'quiz') {
                setQuizMode(true)
            }
        }

        fetchLessonData()
    }, [letterId, language])

    // Trigger animation on step change
    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => setIsAnimating(false), 500)
        return () => clearTimeout(timer)
    }, [currentStepIndex])

    // Handle next step
    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1)
        }
    }

    // Handle previous step
    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1)
        }
    }

    // Handle jumping to specific step
    const handleStepJump = (stepIndex: number) => {
        setCurrentStepIndex(stepIndex)
    }

    // Determine return route based on letter type
    const getReturnRoute = (completedId?: string) => {
        const baseUrl = letterType === 'consonant' ? '/learn/vyanjan' : '/letters'
        return completedId ? `${baseUrl}?completed=${completedId}` : baseUrl
    }

    // Handle lesson/quiz/trace completion flow
    const handleFlowComplete = async () => {
        // FLOW: Lesson Steps -> Trace -> Quiz (if available) -> Complete

        // 1. If currently in Lesson mode, go to Trace
        if (!quizMode && !traceMode) {
            // For practice-time, skip tracing and go to quiz or finish
            if (letterId === 'practice-time') {
                if (quizQuestions.length > 0) {
                    setQuizMode(true)
                } else {
                    await finishLesson()
                }
                return
            }

            setTraceMode(true)
            return
        }

        // 2. If currently in Trace mode, go to Quiz (if exists) or Complete
        if (traceMode) {
            setTraceMode(false)
            if (quizQuestions.length > 0) {
                setQuizMode(true)
            } else {
                await finishLesson()
            }
            return
        }

        // 3. If currently in Quiz mode, finish everything
        if (quizMode) {
            await finishLesson()
        }
    }

    const finishLesson = async () => {
        console.log('Completing lesson...', { identity, letterId })
        if (!isLoaded) return

        if (letterId) {
            try {
                // Mark current lesson as complete
                await markLessonComplete(identity, letterId)

                // Check for returnTo parameter
                const returnTo = searchParams.get('returnTo')
                if (returnTo) {
                    router.push(decodeURIComponent(returnTo))
                } else {
                    router.push(getReturnRoute(letterId))
                }
            } catch (err) {
                console.error('Error saving progress:', err)
                const returnTo = searchParams.get('returnTo')
                if (returnTo) {
                    router.push(decodeURIComponent(returnTo))
                } else {
                    router.push(getReturnRoute(letterId))
                }
            }
        }
    }

    // Pronounce text using Web Speech API
    const pronounce = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            let soundToSpeak = text
            const quoteMatch = text.match(/['"]([^'"]+)['"]/)
            if (quoteMatch) {
                soundToSpeak = quoteMatch[1]
            } else {
                const colonMatch = text.match(/:\s*(.+)/)
                const asMatch = text.match(/as\s+(.+)/i)
                if (colonMatch) soundToSpeak = colonMatch[1].trim()
                else if (asMatch) soundToSpeak = asMatch[1].trim()
            }

            const utterance = new SpeechSynthesisUtterance(soundToSpeak)
            utterance.lang = 'en-US'
            utterance.rate = 0.7
            utterance.pitch = 1
            utterance.onstart = () => setIsSpeaking(true)
            utterance.onend = () => setIsSpeaking(false)
            utterance.onerror = () => setIsSpeaking(false)
            window.speechSynthesis.speak(utterance)
        } else {
            alert('Sorry, your browser does not support text-to-speech.')
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1C1C1C]">
                <FloatingSignIn />
                <div className="bg-[#2C2C2C] rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-[#D4AF37] text-xl">Loading lesson...</h2>
                </div>
            </div>
        )
    }

    // Error state
    if (error || steps.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#1C1C1C] p-4 text-center">
                <FloatingSignIn />
                <div className="bg-[#2C2C2C] rounded-2xl p-8 shadow-2xl max-w-md w-full">
                    <h2 className="text-red-500 mb-2 font-bold text-xl">Error</h2>
                    <p className="text-gray-400 mb-6">{error || 'No steps available'}</p>
                    <button
                        onClick={() => router.push(getReturnRoute())}
                        className="px-8 py-3 bg-[#D4AF37] text-[#1C1C1C] font-bold rounded-xl hover:brightness-110 transition-all"
                    >
                        Back to Journey
                    </button>
                </div>
            </div>
        )
    }

    // IF TRACE MODE IS ACTIVE
    if (traceMode) {
        const practiceText = getPracticeText(language)
        const exitText = getExitText(language)
        return (
            <div className="min-h-screen bg-[#1C1C1C] flex flex-col lg:flex-row lg:items-center lg:justify-center lg:p-8 pt-16 pb-20 md:pb-8 relative overflow-hidden">
                {/* Floating Back Button - marks lesson complete */}
                <button
                    onClick={handleFlowComplete}
                    className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
                >
                    <span className="text-lg">←</span>
                    <span className="hidden sm:inline">{exitText}</span>
                </button>

                {/* Floating Sign In Button */}
                <FloatingSignIn />
                {/* Mobile: Stacked Layout, Desktop: Side by Side */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 w-full max-w-7xl mx-auto px-2 lg:px-0">
                    {/* Guruji Section */}
                    <div className="w-full lg:w-1/3 flex items-center justify-center order-1 lg:order-1">
                        <JainBabaCharacter 
                            message={`Now trace '${steps[0]?.letters.brahmi_symbol}' - ${steps[0]?.letters.letter_name}`}
                            variant="encouraging"
                            position="center"
                        />
                    </div>
                    
                    {/* Tracer Section */}
                    <div className="flex-1 lg:flex-1 flex flex-col order-2 lg:order-2 px-2 lg:px-0">
                        <h2 className="text-[#D4AF37] text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-center uppercase tracking-widest">
                            Trace the Letter
                        </h2>
                        <div className="flex justify-center">
                            <TracerKonva
                                character={steps[0]?.letters.brahmi_symbol || '?'}
                                width={canvasSize}
                                height={canvasSize}
                                showControls={!isMobile}
                                onScoreComplete={(score) => {
                                    console.log('[LessonPage] Trace score:', score)
                                }}
                                onContinue={() => {
                                    console.log('[LessonPage] Continue clicked from tracer')
                                    handleFlowComplete()
                                }}
                            />
                        </div>
                        
                        {/* Skip Button - Desktop Only */}
                        <div className="hidden md:flex justify-center mt-6">
                            <button
                                onClick={handleFlowComplete}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                            >
                                {practiceText}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Complete Button (Bottom) - Only visible on mobile */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/95 to-transparent pointer-events-none">
                    <div className="flex justify-between items-center gap-4 pointer-events-auto">
                        <button
                            onClick={handleFlowComplete}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-600 hover:bg-gray-500 text-white font-medium transition-all shadow-lg text-sm"
                        >
                            <span>{practiceText}</span>
                        </button>
                        <button
                            onClick={handleFlowComplete}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/30 text-sm"
                        >
                            <span>Mark as Done</span>
                            <span className="text-lg">✓</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // IF QUIZ MODE IS ACTIVE
    if (quizMode) {
        const exitText = getExitText(language)
        return (
            <div className="min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center lg:p-4 pt-16 pb-20 md:pb-8 relative overflow-hidden">
                {/* Floating Back Button */}
                <button
                    onClick={() => router.push(getReturnRoute())}
                    className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
                >
                    <span className="text-lg">←</span>
                    <span className="hidden sm:inline">{exitText}</span>
                </button>

                {/* Floating Sign In Button */}
                <FloatingSignIn />

                {/* Container with proper spacing */}
                <div className="max-w-2xl w-full mx-auto px-2 lg:px-0">
                    {/* Guruji Character */}
                    <div className="mb-6">
                        <JainBabaCharacter 
                            message={`Quiz time for '${steps[0]?.letters.brahmi_symbol}' - ${steps[0]?.letters.letter_name}`}
                            variant="encouraging"
                            position="center"
                        />
                    </div>
                    
                    {/* Quiz Component */}
                    <div className="bg-[#2C2C2C] rounded-2xl p-4 lg:p-6 border border-[#3A3A3A]">
                        <LessonQuiz
                            questions={quizQuestions}
                            onComplete={handleFlowComplete}
                        />
                    </div>

                    {/* Navigation for MCQs handled by LessonQuiz.onComplete; static practice CTA removed */}
                </div>
            </div>
        )
    }

    // NORMAL LESSON FLOW
    const currentStep = steps[currentStepIndex]
    const letter = currentStep.letters
    const isLastStep = currentStepIndex === steps.length - 1
    const practiceText = getPracticeText(language)
    const exitText = getExitText(language)

    const getStepColor = (stepType: string) => {
        const colors = {
            show: { primary: '#D4AF37', secondary: '#F2D06B' }, // Gold
            sound: { primary: '#E27D60', secondary: '#FF9E80' }, // Terracotta
            explanation: { primary: '#41B3A3', secondary: '#85DCB0' }, // Teal
            example: { primary: '#C38D9E', secondary: '#E8A7B8' }, // Rose
            practice: { primary: '#E8A87C', secondary: '#FFD4B8' }, // Orange
            complete: { primary: '#85DCB0', secondary: '#A8F2C8' }  // Green
        }
        return colors[stepType as keyof typeof colors] || colors.show
    }

    const stepColors = getStepColor(currentStep.step_type)

    // Unified Step Component - Renders all step types dynamically
    const UnifiedStepComponent = ({ 
        step, 
        letter, 
        isAnimating, 
        isSpeaking, 
        onPronounce 
    }: { 
        step: LetterStep;
        letter: Letter;
        isAnimating: boolean;
        isSpeaking: boolean;
        onPronounce: (text: string) => void;
    }) => {
        const brahmiSymbol = letter.brahmi_symbol
        const stepType = step.step_type
        const content = step.content
        const colors = getStepColor(stepType)

        const getGurujiVariant = (): 'default' | 'excited' | 'encouraging' | 'celebrating' => {
            switch (stepType) {
                case 'show':
                    return 'excited';
                case 'sound':
                    return 'default';
                case 'practice':
                    return 'encouraging';
                case 'complete':
                    return 'celebrating';
                default:
                    return 'default';
            }
        };

        const commonStyle = {
            transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
            opacity: isAnimating ? 0.7 : 1,
        };

        switch (stepType) {
            case 'show':
                return (
                    <div className="bg-[#2C2C2C] rounded-3xl p-6 sm:p-10 md:p-16 lg:p-20 shadow-2xl border border-[#3A3A3A] flex flex-col items-center gap-4 md:gap-8 transition-all duration-300 text-white w-full max-w-xl" style={commonStyle}>
                        <JainBabaCharacter 
                            message={content || `${letter.letter_name}`}
                            variant={getGurujiVariant()}
                            position="center"
                        />
                        <div className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-br from-[#D4AF37] to-[#F2D06B] bg-clip-text text-transparent py-2">
                            {brahmiSymbol}
                        </div>
                        <div className="text-lg md:text-2xl text-gray-400 font-medium tracking-widest uppercase">
                            {letter.letter_name}
                        </div>
                    </div>
                )

            case 'sound':
                return (
                    <div className="bg-[#2C2C2C] rounded-3xl p-6 sm:p-10 md:p-16 shadow-2xl border border-[#3A3A3A] flex flex-col items-center gap-6 md:gap-8 transition-all duration-300 text-white w-full max-w-2xl" style={commonStyle}>
                        <JainBabaCharacter 
                            message={content}
                            variant={getGurujiVariant()}
                        />
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-br from-[#E27D60] to-[#FF9E80] bg-clip-text text-transparent py-1">
                            {brahmiSymbol}
                        </div>
                        <div className="flex items-center gap-4 bg-[#1C1C1C]/50 backdrop-blur-sm p-4 rounded-2xl border border-[#3A3A3A] w-full">
                            <button
                                onClick={() => onPronounce(content)}
                                className="w-14 h-14 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all flex-shrink-0 shadow-lg shadow-[#D4AF37]/20"
                            >
                                {isSpeaking ? '🔊' : '🔉'}
                            </button>
                            <span className="text-base sm:text-lg md:text-xl text-white/90 font-medium break-words">{content}</span>
                        </div>
                    </div>
                )

            case 'explanation':
            case 'example':
            case 'practice':
            case 'complete':
            default:
                return (
                    <div className="bg-[#2C2C2C] rounded-3xl p-6 sm:p-10 md:p-16 shadow-2xl border border-[#3A3A3A] flex flex-col items-center gap-4 md:gap-6 transition-all duration-300 text-white w-full max-w-3xl" style={commonStyle}>
                        <JainBabaCharacter 
                            message={content}
                            variant={getGurujiVariant()}
                        />
                        <div 
                            className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-br bg-clip-text text-transparent py-1" 
                            style={{
                                backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                            }}
                        >
                            {brahmiSymbol}
                        </div>
                        <div className="text-xl md:text-2xl text-gray-400 font-bold tracking-widest uppercase -mt-2">
                            {letter.letter_name}
                        </div>
                        <div className="text-base sm:text-lg md:text-xl text-[#E6D8B8]/90 text-center font-medium leading-relaxed max-w-2xl px-4 mt-2">
                            {content}
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-[#1C1C1C] text-white flex flex-col relative overflow-hidden">
            {/* Floating Back Button */}
            <button
                onClick={() => router.push(getReturnRoute())}
                className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
            >
                <span className="text-lg">←</span>
                <span className="hidden sm:inline">{exitText}</span>
            </button>

            {/* Floating Sign In Button */}
            <FloatingSignIn />

            {/* Floating Progress Bar - Desktop Only */}
            <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-40 w-48 sm:w-64 md:w-80">
                <div className="h-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full overflow-hidden shadow-lg border border-[#D4AF37]/20">
                    <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] transition-all duration-500"
                        style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    />
                </div>
                <div className="text-center text-xs text-[#D4AF37]/60 mt-1">
                    {currentStepIndex + 1} / {steps.length}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center md:p-6 relative md:mx-0 pt-16 md:pt-16 pb-24 md:pb-0 overflow-x-hidden">
                {/* Navigation Buttons (Left/Right) - Desktop Only */}
                <button
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className={`hidden md:block absolute left-2 md:left-10 p-3 md:p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] hover:bg-[#3A3A3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg md:text-xl`}
                >
                    ←
                </button>

                <UnifiedStepComponent
                    step={currentStep}
                    letter={letter}
                    isAnimating={isAnimating}
                    isSpeaking={isSpeaking}
                    onPronounce={pronounce}
                />

                <button
                    onClick={isLastStep ? handleFlowComplete : handleNext}
                    className="hidden md:block absolute right-2 md:right-10 p-3 md:p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 text-lg md:text-xl"
                >
                    {isLastStep ? (quizQuestions.length > 0 ? `${practiceText} →` : 'Trace →') : '→'}
                </button>
            </div>

            {/* Mobile Navigation Buttons (Bottom) - Only visible on mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/95 to-transparent pointer-events-none">
                <div className="flex justify-between items-center gap-3 pointer-events-auto">
                    {/* Previous Button - Bottom Left */}
                    <button
                        onClick={handlePrevious}
                        disabled={currentStepIndex === 0}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2C2C2C] text-[#D4AF37] border border-[#D4AF37]/30 font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg text-sm`}
                    >
                        <span className="text-lg">←</span>
                        <span>Prev</span>
                    </button>

                    {/* Progress Indicator - Center */}
                    <div className="flex flex-col items-center gap-1 px-3">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[#D4AF37] font-bold text-sm">{currentStepIndex + 1}</span>
                            <span className="text-[#D4AF37]/40 text-xs">/</span>
                            <span className="text-[#D4AF37]/60 text-xs">{steps.length}</span>
                        </div>
                        <div className="w-16 h-1 bg-[#2C2C2C] rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] transition-all duration-300"
                                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Next/Complete Button - Bottom Right */}
                    <button
                        onClick={isLastStep ? handleFlowComplete : handleNext}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/30 text-sm"
                    >
                        <span>{isLastStep ? (quizQuestions.length > 0 ? practiceText : 'Trace') : (language === 'hi' ? 'अगला' : 'Next')}</span>
                        <span className="text-lg">→</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
