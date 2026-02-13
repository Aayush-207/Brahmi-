'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { markLessonComplete } from '@/lib/progress'
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity'
import { useRouter } from 'next/navigation'
import LessonQuiz, { McqQuestion, McqOption } from '@/components/lesson/LessonQuiz'
import LessonTracer from '@/components/lesson/LessonTracer'
import JainBabaCharacter from '@/components/lesson/JainBabaCharacter'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'

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

export default function LessonPage({ params }: { params: Promise<{ letter_id: string }> }) {
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
    const [isLoaded, setIsLoaded] = useState(false)
    const router = useRouter()
    const [steps, setSteps] = useState<LetterStep[]>([])
    const supabase = createClient()

    useEffect(() => {
        const loadIdentity = async () => {
            const currentIdentity = await getCurrentIdentity()
            setIdentity(currentIdentity)
            setIsLoaded(true)
            
            // Allow guest access to lessons - no redirect needed
        }
        loadIdentity()
    }, [supabase, router])
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
    // Removed strokes state as it's no longer needed

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

            // 1. Fetch Steps
            const { data: stepsData, error: fetchError } = await supabase
                .from('letter_steps')
                .select(`
          id,
          letter_id,
          step_type,
          content,
          order_no,
          letters (
            id,
            letter_name,
            brahmi_symbol,
            order_no,
            letter_type
          )
        `)
                .eq('letter_id', letterId)
                .order('order_no', { ascending: true })

            if (fetchError) {
                console.error('Error fetching lesson steps:', fetchError)
                setError(`Failed to load lesson. Error: ${fetchError.message}`)
                setLoading(false)
                return
            }

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

            // 2. Fetch Quiz Questions
            const { data: quizData, error: quizError } = await supabase
                .from('mcq_questions')
                .select(`
                    id,
                    letter_id,
                    question,
                    order_no,
                    mcq_options (
                        id,
                        question_id,
                        option_text,
                        is_correct,
                        order_no
                    )
                `)
                .eq('letter_id', letterId)
                .order('order_no', { ascending: true })

            if (quizData && quizData.length > 0) {
                const formattedQuiz = quizData.map(q => ({
                    ...q,
                    options: (q.mcq_options as unknown as McqOption[]).sort((a, b) => a.order_no - b.order_no)
                }))
                setQuizQuestions(formattedQuiz)
            }

            setLoading(false)
        }

        fetchLessonData()
    }, [letterId])

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
        const baseUrl = letterType === 'consonant' ? '/consonants' : '/letters'
        return completedId ? `${baseUrl}?completed=${completedId}` : baseUrl
    }

    // Handle lesson/quiz/trace completion flow
    const handleFlowComplete = async () => {
        // FLOW: Lesson Steps -> Quiz (if available) -> Trace -> Complete

        // 1. If currently in Quiz mode, finish Quiz and go to Trace
        if (quizMode) {
            setQuizMode(false)
            setTraceMode(true)
            return
        }

        // 2. If currently in Trace mode, finish everything
        if (traceMode) {
            console.log('Completing lesson...', { identity, letterId })
            if (!isLoaded) return

            if (letterId) {
                try {
                    // Mark current lesson as complete
                    await markLessonComplete(identity, letterId)

                    // Return to journey page - animation will play there
                    router.push(getReturnRoute(letterId))
                } catch (err) {
                    console.error('Error saving progress:', err)
                    // Don't block user on error, just return to journey
                    router.push(getReturnRoute(letterId))
                }
            }
            return
        }

        // 3. If currently in Lesson mode (default implied by !quizMode && !traceMode)

        // a. If quiz exists, go to Quiz
        if (quizQuestions.length > 0) {
            setQuizMode(true)
            return
        }

        // b. If no quiz, go straight to Trace
        setTraceMode(true)
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
        return (
            <div className="min-h-screen bg-[#1C1C1C] flex flex-col lg:flex-row lg:items-center lg:justify-center p-4 lg:p-8 pt-16 pb-8 relative">
                {/* Floating Back Button */}
                <button
                    onClick={() => router.push(getReturnRoute())}
                    className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
                >
                    <span className="text-lg">←</span>
                    <span className="hidden sm:inline">Exit</span>
                </button>

                {/* Floating Sign In Button */}
                <FloatingSignIn />
                {/* Mobile: Stacked Layout, Desktop: Side by Side */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 w-full max-w-7xl mx-auto">
                    {/* Guruji Section */}
                    <div className="w-full lg:w-1/3 flex items-center justify-center order-1 lg:order-1">
                        <JainBabaCharacter 
                            message={`अब लिखने का समय! Now trace '${steps[0]?.letters.brahmi_symbol}' with your finger or mouse. Follow the strokes carefully. Practice makes perfect!`}
                            variant="encouraging"
                            position="center"
                        />
                    </div>
                    
                    {/* Tracer Section */}
                    <div className="flex-1 lg:flex-1 flex flex-col order-2 lg:order-2">
                        <h2 className="text-[#D4AF37] text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-center uppercase tracking-widest">
                            Trace the Letter
                        </h2>
                        <LessonTracer
                            letterSymbol={steps[0]?.letters.brahmi_symbol || '?'}
                            onComplete={handleFlowComplete}
                        />
                        
                        {/* Skip Button */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleFlowComplete}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                            >
                                Skip Tracing →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // IF QUIZ MODE IS ACTIVE
    if (quizMode) {
        return (
            <div className="min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center p-4 pt-16 pb-8 relative">
                {/* Floating Back Button */}
                <button
                    onClick={() => router.push(getReturnRoute())}
                    className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
                >
                    <span className="text-lg">←</span>
                    <span className="hidden sm:inline">Exit</span>
                </button>

                {/* Floating Sign In Button */}
                <FloatingSignIn />

                {/* Container with proper spacing */}
                <div className="max-w-2xl w-full mx-auto">
                    {/* Guruji Character */}
                    <div className="mb-6">
                        <JainBabaCharacter 
                            message="समय परीक्षा का! Time to test your knowledge! Show me what you have learned about this character."
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
                </div>
            </div>
        )
    }

    // NORMAL LESSON FLOW
    const currentStep = steps[currentStepIndex]
    const letter = currentStep.letters
    const isLastStep = currentStepIndex === steps.length - 1

    const getStepColor = (stepType: string) => {
        const colors = {
            show: { primary: '#D4AF37', secondary: '#F2D06B' }, // Gold
            sound: { primary: '#E27D60', secondary: '#FF9E80' }, // Terracotta
            explanation: { primary: '#41B3A3', secondary: '#85DCB' }, // Teal
            example: { primary: '#C38D9E', secondary: '#E8A7B8' }, // Rose
            practice: { primary: '#E8A87C', secondary: '#FFD4B8' }, // Orange
            complete: { primary: '#85DCB0', secondary: '#A8F2C8' }  // Green
        }
        return colors[stepType as keyof typeof colors] || colors.show
    }

    const stepColors = getStepColor(currentStep.step_type)

    const renderStepContent = () => {
        const brahmiSymbol = letter.brahmi_symbol
        const stepType = currentStep.step_type
        const content = currentStep.content

        // Get Guruji message based on step type
        const getGurujiMessage = () => {
            switch (stepType) {
                case 'show':
                    return `नमस्ते! This is the Brahmi character '${brahmiSymbol}'. Look at its beautiful form!`;
                case 'sound':
                    return `Listen carefully! ${content}. Let me help you pronounce it correctly.`;
                case 'explanation':
                    return `Now let me explain: ${content}`;
                case 'example':
                    return `Here's an example: ${content}`;
                case 'practice':
                    return `Time to practice! ${content}`;
                case 'complete':
                    return `साधुवाद! You have done wonderfully! ${content}`;
                default:
                    return content;
            }
        };

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

        switch (stepType) {
            case 'show':
                return (
                    <div className="bg-[#2C2C2C] rounded-3xl p-6 md:p-20 shadow-2xl border border-[#3A3A3A] flex flex-col items-center gap-6 md:gap-10 transition-all duration-300 text-white max-w-full" style={{
                        transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
                        opacity: isAnimating ? 0.7 : 1,
                    }}>
                        <JainBabaCharacter 
                            message={getGurujiMessage()}
                            variant={getGurujiVariant()}
                            position="center"
                        />
                        <div 
                            className="text-6xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-br from-[#D4AF37] to-[#F2D06B] bg-clip-text text-transparent"
                        >
                            {brahmiSymbol}
                        </div>
                        <div className="text-base md:text-2xl text-gray-400 tracking-wider">
                            {letter.letter_name}
                        </div>
                    </div>
                )
            case 'sound':
                return (
                    <div className="bg-[#2C2C2C] rounded-3xl p-6 md:p-16 shadow-2xl border border-[#3A3A3A] flex flex-col items-center gap-6 md:gap-10 transition-all duration-300 text-white w-full max-w-2xl" style={{
                        transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
                        opacity: isAnimating ? 0.7 : 1,
                    }}>
                        <JainBabaCharacter 
                            message={getGurujiMessage()}
                            variant={getGurujiVariant()}
                        />
                        <div className="text-5xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-br from-[#E27D60] to-[#FF9E80] bg-clip-text text-transparent">
                            {brahmiSymbol}
                        </div>
                        <div className="flex items-center gap-4 bg-[#1C1C1C] p-4 rounded-xl border border-[#3A3A3A] w-full">
                            <button
                                onClick={() => pronounce(content)}
                                className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xl hover:scale-110 transition-transform flex-shrink-0"
                            >
                                {isSpeaking ? '🔊' : '🔉'}
                            </button>
                            <span className="text-sm sm:text-lg md:text-xl text-white break-words">{content}</span>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="bg-[#2C2C2C] rounded-3xl p-6 md:p-16 shadow-2xl border border-[#3A3A3A] flex flex-col items-center gap-6 md:gap-10 transition-all duration-300 text-white w-full max-w-3xl" style={{
                        transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
                        opacity: isAnimating ? 0.7 : 1,
                    }}>
                        <JainBabaCharacter 
                            message={getGurujiMessage()}
                            variant={getGurujiVariant()}
                        />
                        <div className="text-4xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-br bg-clip-text text-transparent" style={{
                            backgroundImage: `linear-gradient(135deg, ${stepColors.primary}, ${stepColors.secondary})`
                        }}>
                            {brahmiSymbol}
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-[#1C1C1C] text-white flex flex-col relative">
            {/* Floating Back Button */}
            <button
                onClick={() => router.push(getReturnRoute())}
                className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
            >
                <span className="text-lg">←</span>
                <span className="hidden sm:inline">Exit</span>
            </button>

            {/* Floating Sign In Button */}
            <FloatingSignIn />

            {/* Floating Progress Bar */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-48 sm:w-64 md:w-80">
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
            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 relative mx-2 sm:mx-4 md:mx-0 pt-16">
                {/* Navigation Buttons (Left/Right) */}
                <button
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className={`absolute left-2 md:left-10 p-3 md:p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] hover:bg-[#3A3A3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg md:text-xl`}
                >
                    ←
                </button>

                {renderStepContent()}

                <button
                    onClick={isLastStep ? handleFlowComplete : handleNext}
                    className="absolute right-2 md:right-10 p-3 md:p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 text-lg md:text-xl"
                >
                    {isLastStep ? (quizQuestions.length > 0 ? 'Quiz →' : 'Trace →') : '→'}
                </button>
            </div>
        </div>
    )
}
