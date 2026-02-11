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
            <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-8">
                <FloatingSignIn />
                <div className="flex items-center gap-8 w-full max-w-7xl">
                    {/* Left Side - Guruji Centered */}
                    <div className="w-1/3 flex items-center justify-center">
                        <JainBabaCharacter 
                            message={`अब लिखने का समय! Now trace '${steps[0]?.letters.brahmi_symbol}' with your finger or mouse. Follow the strokes carefully. Practice makes perfect!`}
                            variant="encouraging"
                            position="center"
                        />
                    </div>
                    
                    {/* Right Side - Blackboard */}
                    <div className="flex-1 flex flex-col">
                        <h2 className="text-[#D4AF37] text-2xl font-bold mb-6 text-center uppercase tracking-widest">
                            Trace the Letter
                        </h2>
                        <LessonTracer
                            letterSymbol={steps[0]?.letters.brahmi_symbol || '?'}
                            onComplete={handleFlowComplete}
                        />
                    </div>
                </div>
            </div>
        )
    }

    // IF QUIZ MODE IS ACTIVE
    if (quizMode) {
        return (
            <div className="min-h-screen bg-[#1C1C1C] p-4 md:p-8 flex items-center justify-center flex-col">
                <FloatingSignIn />
                <div className="max-w-2xl w-full">
                    <JainBabaCharacter 
                        message="समय परीक्षा का! Time to test your knowledge! Show me what you have learned about this character."
                        variant="encouraging"
                        position="center"
                    />
                    <LessonQuiz
                        questions={quizQuestions}
                        onComplete={handleFlowComplete}
                    />
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

        const baseCardStyle = {
            backgroundColor: '#2C2C2C', // Dark card
            borderRadius: '24px',
            padding: '40px 60px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '1px solid #3A3A3A',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '40px',
            transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
            opacity: isAnimating ? 0.7 : 1,
            transition: 'all 0.3s ease-out',
            position: 'relative' as const,
            overflow: 'hidden' as const,
            maxWidth: '100%',
            color: 'white'
        }

        const symbolStyle = {
            fontWeight: 'bold' as const,
            backgroundImage: `linear-gradient(135deg, ${stepColors.primary}, ${stepColors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative' as const,
        }

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
                    <div style={{ ...baseCardStyle, padding: '80px' }}>
                        <JainBabaCharacter 
                            message={getGurujiMessage()}
                            variant={getGurujiVariant()}
                            position="center"
                        />
                        <div style={{ ...symbolStyle, fontSize: '180px' }}>{brahmiSymbol}</div>
                        <div style={{ fontSize: '24px', color: '#888', letterSpacing: '2px' }}>{letter.letter_name}</div>
                    </div>
                )
            case 'sound':
                return (
                    <div style={{ ...baseCardStyle, maxWidth: '700px' }}>
                        <JainBabaCharacter 
                            message={getGurujiMessage()}
                            variant={getGurujiVariant()}
                        />
                        <div style={{ ...symbolStyle, fontSize: '140px' }}>{brahmiSymbol}</div>
                        <div className="flex items-center gap-4 bg-[#1C1C1C] p-4 rounded-xl border border-[#3A3A3A]">
                            <button
                                onClick={() => pronounce(content)}
                                className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xl hover:scale-110 transition-transform"
                            >
                                {isSpeaking ? '🔊' : '🔉'}
                            </button>
                            <span className="text-xl text-white">{content}</span>
                        </div>
                    </div>
                )
            default:
                return (
                    <div style={{ ...baseCardStyle, maxWidth: '800px' }}>
                        <JainBabaCharacter 
                            message={getGurujiMessage()}
                            variant={getGurujiVariant()}
                        />
                        <div style={{ ...symbolStyle, fontSize: '120px' }}>{brahmiSymbol}</div>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-[#1C1C1C] text-white flex flex-col">
            {/* Floating Sign In */}
            <FloatingSignIn />
            
            {/* Header / Progress */}
            {/* Header: Progress Bar + Letter Name */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#2C2C2C] border-b border-[#3A3A3A]">
                {/* Return to Journey Button */}
                <button
                    onClick={() => router.push(getReturnRoute())}
                    className="flex items-center gap-2 text-[#D4AF37] hover:text-[#FFD6A5] transition-colors font-medium text-sm md:text-base"
                >
                    <span className="text-lg">←</span>
                    <span className="hidden sm:inline">Return to Journey</span>
                    <span className="sm:hidden">Journey</span>
                </button>

                <div className="flex-1 mx-4 md:mx-8">
                    <div className="h-2 bg-[#1C1C1C] rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] transition-all duration-500"
                            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                    
                    {/* Step Navigation */}
                    <div className="flex flex-wrap gap-1 justify-center">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleStepJump(index)}
                                className={`
                                    w-8 h-8 rounded-full text-xs font-bold transition-all duration-300
                                    ${currentStepIndex === index 
                                        ? 'bg-[#D4AF37] text-[#1C1C1C] shadow-[0_0_15px_rgba(212,175,55,0.5)]' 
                                        : 'bg-[#1C1C1C] text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20'
                                    }
                                `}
                                title={`Step ${index + 1}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-8" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6 relative">
                {/* Navigation Buttons (Left/Right) */}
                <button
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className={`absolute left-4 md:left-10 p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] hover:bg-[#3A3A3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all`}
                >
                    ←
                </button>

                {renderStepContent()}

                <button
                    onClick={isLastStep ? handleFlowComplete : handleNext}
                    className="absolute right-4 md:right-10 p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20"
                >
                    {isLastStep ? (quizQuestions.length > 0 ? 'Quiz →' : 'Trace →') : '→'}
                </button>
            </div>
        </div>
    )
}
