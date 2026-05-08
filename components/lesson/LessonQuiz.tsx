'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { speakAsGuruji } from '@/lib/gurujispeech'

export type McqOption = {
    id: string
    question_id: string
    option_text: string
    is_correct: boolean
    order_no: number
}

export type McqQuestion = {
    id: string
    letter_id: string
    question: string
    order_no: number
    options: McqOption[]
}

type QuizState = 'idle' | 'active' | 'answered_correct' | 'answered_wrong' | 'completed'

interface LessonQuizProps {
    questions: McqQuestion[]
    onComplete: () => void
}

export default function LessonQuiz({ questions, onComplete }: LessonQuizProps) {
    const { language } = useLanguage()
    const [quizState, setQuizState] = useState<QuizState>('idle')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
    const [shakingOptionId, setShakingOptionId] = useState<string | null>(null)

    useEffect(() => {
        if (questions && questions.length > 0) {
            setQuizState('active')
        }
    }, [questions])

    const handleOptionSelect = (optionId: string) => {
        if (quizState !== 'active') return

        setSelectedOptionId(optionId)

        const currentQuestion = questions[currentQuestionIndex]
        const selectedOption = currentQuestion.options.find(o => o.id === optionId)

        if (!selectedOption) return

        const correct = selectedOption.is_correct
        setIsAnswerCorrect(correct)

        if (correct) {
            setQuizState('answered_correct')
            speakAsGuruji('sahi jawab')
        } else {
            setQuizState('answered_wrong')
            speakAsGuruji('galat jawab')
            setShakingOptionId(optionId)
            // Reset shake after animation
            setTimeout(() => setShakingOptionId(null), 500)
        }
    }

    const handleContinue = () => {
        // Both correct and wrong answers move to next question
        if (currentQuestionIndex < questions.length - 1) {
            // Next question
            setCurrentQuestionIndex(prev => prev + 1)
            setQuizState('active')
            setSelectedOptionId(null)
            setIsAnswerCorrect(false)
        } else {
            // Quiz complete
            setQuizState('completed')
            onComplete()
        }
    }

    if (quizState === 'idle' || !questions || questions.length === 0) {
        return null
    }

    if (quizState === 'completed') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-[#1C1C1C] rounded-3xl border border-[#3A3A3A]">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-6"
                >
                    🎉
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">Lesson Complete!</h2>
                <p className="text-gray-400">You've mastered these concepts.</p>
            </div>
        )
    }

    const currentQuestion = questions[currentQuestionIndex]

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full h-4 bg-[#2C2C2C] rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-[#58CC02]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-4 mb-8">
                <AnimatePresence>
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedOptionId === option.id
                        const isShaking = shakingOptionId === option.id
                        const isCorrectAnswer = option.is_correct

                        // Determine styling based on state
                        let buttonStyle = "bg-[#2C2C2C] border-[#3A3A3A] text-white hover:bg-[#3A3A3A]" // Default

                        // Show correct answer in green when wrong answer is selected
                        if (quizState === 'answered_wrong' && isCorrectAnswer) {
                            buttonStyle = "bg-[#d7ffb8] border-[#58CC02] text-[#58a700]" // Correct Green
                        } else if (isSelected) {
                            if (quizState === 'answered_correct') {
                                buttonStyle = "bg-[#d7ffb8] border-[#58CC02] text-[#58a700]" // Correct Green
                            } else if (quizState === 'answered_wrong') {
                                buttonStyle = "bg-[#ffdfe0] border-[#ea2b2b] text-[#ea2b2b]" // Wrong Red
                            } else {
                                buttonStyle = "bg-[#3A3A3A] border-[#D4AF37] text-white" // Selected Active
                            }
                        }

                        // Opacity for unselected when answered (but not for correct answer when wrong is selected)
                        const opacityClass = (quizState === 'answered_correct' || quizState === 'answered_wrong') && !isSelected && !isCorrectAnswer
                            ? "opacity-50 cursor-not-allowed"
                            : "opacity-100"

                        return (
                            <motion.button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                disabled={quizState !== 'active'}
                                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                                transition={isShaking ? { type: "tween", duration: 0.4 } : { type: "spring", stiffness: 300, damping: 10 }}
                                className={`
                                    relative p-5 rounded-2xl border-2 border-b-4 
                                    text-lg font-medium text-left transition-all duration-200
                                    active:border-b-2 active:translate-y-[2px]
                                    ${buttonStyle} ${opacityClass}
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option.option_text}</span>
                                    {isSelected && quizState === 'answered_correct' && (
                                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✅</motion.span>
                                    )}
                                    {isSelected && quizState === 'answered_wrong' && (
                                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>❌</motion.span>
                                    )}
                                    {!isSelected && quizState === 'answered_wrong' && isCorrectAnswer && (
                                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✅</motion.span>
                                    )}
                                </div>
                            </motion.button>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* Bottom Sheet / Feedback Area */}
            <AnimatePresence>
                {(quizState === 'answered_correct' || quizState === 'answered_wrong') && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className={`
                            fixed bottom-0 left-0 right-0 p-6 md:p-8 
                            border-t-2 z-50
                            ${quizState === 'answered_correct'
                                ? 'bg-[#d7ffb8] border-[#58CC02] text-[#58a700]'
                                : 'bg-[#ffdfe0] border-[#ea2b2b] text-[#ea2b2b]'}
                        `}
                    >
                        <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-white
                                `}>
                                    {quizState === 'answered_correct' ? '🎉' : '❌'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {quizState === 'answered_correct' ? 'Correct!' : 'Incorrect'}
                                    </h3>
                                    <p className="text-sm font-medium opacity-90">
                                        {quizState === 'answered_correct' ? 'Nicely done.' : (() => {
                                            const correctOption = currentQuestion.options.find(o => o.is_correct);
                                            return correctOption ? `Correct answer: ${correctOption.option_text}` : 'Review the correct answer above.';
                                        })()}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleContinue}
                                className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-white uppercase tracking-wide bg-[#58CC02] border-[#46a302] border-b-4 active:border-b-0 active:translate-y-1 transition-all"
                            >
                                {language === 'hi' ? '→' : 'Continue'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
