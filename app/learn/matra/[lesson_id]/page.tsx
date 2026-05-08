'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getMatraLessonContent, saveMatraProgress, getNextMatraLessonId, type MatraLessonContent } from '@/lib/matraModule'
import { getCurrentIdentity, type Identity } from '@/lib/guestIdentity'
import JainBabaCharacter from '@/components/lesson/JainBabaCharacter'
import JainBabaSVG from '@/components/lesson/JainBabaSVG'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'
import { useLanguage } from '@/lib/LanguageContext'
import { getNextModuleRoute } from '@/lib/lessonFlow'

export default function MatraLessonPage({ params }: { params: Promise<{ lesson_id: string }> }) {
    const { lesson_id } = use(params)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { language } = useLanguage()
    
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
    const [contents, setContents] = useState<MatraLessonContent[]>([])
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loading, setLoading] = useState(true)
    const [direction, setDirection] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    // Sync currentSlide with search params if provided
    useEffect(() => {
        const slideParam = searchParams.get('slide')
        if (slideParam) {
            const slideIdx = parseInt(slideParam)
            if (!isNaN(slideIdx) && slideIdx >= 0) {
                setCurrentSlide(slideIdx)
            }
        }
    }, [searchParams])

    useEffect(() => {
        async function loadData() {
            const currentIdentity = await getCurrentIdentity()
            setIdentity(currentIdentity)
            
            const lessonContents = await getMatraLessonContent(lesson_id, language)
            setContents(lessonContents)
            setLoading(false)
            
            if (lessonContents.length > 0) {
                await saveMatraProgress(lesson_id, 'in_progress', 0, currentIdentity)
            }
        }
        loadData()
    }, [lesson_id, language])

    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => setIsAnimating(false), 500)
        return () => clearTimeout(timer)
    }, [currentSlide])

    const handleNext = async () => {
        if (currentSlide < contents.length - 1) {
            setDirection(1)
            setCurrentSlide(currentSlide + 1)
            const progress = Math.round(((currentSlide + 2) / contents.length) * 100)
            await saveMatraProgress(lesson_id, 'in_progress', progress, identity)
        } else {
            // Lesson completed - check if there's a next lesson
            await saveMatraProgress(lesson_id, 'completed', 100, identity)
            
            const nextLessonId = await getNextMatraLessonId(lesson_id, identity, language)
            if (nextLessonId) {
                // Navigate to next lesson
                router.push(`/learn/matra/${nextLessonId}`)
            } else {
                // Last lesson of last module completed - redirect to learning path overview
                const nextModuleRoute = getNextModuleRoute('module-matra')
                if (nextModuleRoute) {
                    // There's a next module (shouldn't happen with current setup)
                    router.push(nextModuleRoute)
                } else {
                    // Matra is the last module - go to /learn
                    router.push('/learn')
                }
            }
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
            <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center">
                <div className="text-[#D4AF37] text-xl animate-pulse">Loading Lesson...</div>
            </div>
        )
    }

    if (contents.length === 0) {
        return (
            <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#E69A47] mb-4">Lesson content not found</p>
                    <Link href="/learn/matra" className="text-[#D4AF37] hover:underline">Back to Lessons</Link>
                </div>
            </div>
        )
    }

    const currentStep = contents[currentSlide]
    const isLastStep = currentSlide === contents.length - 1

    const getStepColor = (stepType: string) => {
        const colors = {
            title_slide: { primary: '#D4AF37', secondary: '#F2D06B' }, // Gold
            pronunciation: { primary: '#E27D60', secondary: '#FF9E80' }, // Terracotta
            text: { primary: '#41B3A3', secondary: '#85DCB0' }, // Teal
            writing_practice: { primary: '#E8A87C', secondary: '#FFD4B8' }, // Orange
            summary: { primary: '#85DCB0', secondary: '#A8F2C8' }  // Green
        }
        return colors[stepType as keyof typeof colors] || colors.title_slide
    }

    const colors = getStepColor(currentStep.content_type)

    const commonStyle = {
        transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
        opacity: isAnimating ? 0.7 : 1,
    };

    return (
        <div className="min-h-screen bg-[#1C1C1C] text-white flex flex-col relative overflow-hidden">
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
                    <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] transition-all duration-500"
                        style={{ width: `${((currentSlide + 1) / contents.length) * 100}%` }}
                    />
                </div>
                <div className="text-center text-xs text-[#D4AF37]/60 mt-1">
                    {currentSlide + 1} / {contents.length}
                </div>
            </div>

            {/* Main Content Area - Matching Swar/Vyanjan Card UI */}
            <div className="flex-1 flex items-center justify-center md:p-6 relative md:mx-0 pt-16 md:pt-16 pb-24 md:pb-0 overflow-x-hidden">
                {/* Navigation Buttons (Left/Right) - Desktop Only */}
                <button
                    onClick={handlePrevious}
                    disabled={currentSlide === 0}
                    className={`hidden md:block absolute left-2 md:left-10 p-3 md:p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] hover:bg-[#3A3A3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg md:text-xl z-10`}
                >
                    ←
                </button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex justify-center"
                    >
                        <div className="bg-[#2C2C2C] rounded-3xl p-6 sm:p-10 md:p-16 lg:p-20 shadow-2xl border border-[#3A3A3A] flex flex-col items-center gap-4 md:gap-8 transition-all duration-300 text-white w-full max-w-2xl" style={commonStyle}>
                            <JainBabaCharacter 
                                message={`${currentStep.title ? currentStep.title + '. ' : ''}${currentStep.content || ''}`}
                                variant={currentStep.content_type === 'title_slide' ? 'excited' : 'default'}
                                position="center"
                            />

                            {/* Large Brahmi Symbol for letters/matras */}
                            {(currentStep.metadata?.brahmi_symbol || currentStep.metadata?.brahmi || currentStep.metadata?.character) && (
                                <div 
                                    className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-br bg-clip-text text-transparent py-2"
                                    style={{
                                        backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                                    }}
                                >
                                    {currentStep.metadata.brahmi_symbol || currentStep.metadata.brahmi || currentStep.metadata.character}
                                </div>
                            )}

                            <div className="text-lg md:text-2xl text-gray-400 font-bold tracking-widest uppercase -mt-2">
                                {currentStep.metadata?.devanagari || (currentStep.content_type === 'title_slide' ? '' : currentStep.title)}
                            </div>

                            <div className="text-base sm:text-lg md:text-xl text-[#E6D8B8]/90 text-center font-medium leading-relaxed max-w-2xl px-4 mt-2 whitespace-pre-line">
                                {currentStep.content}
                            </div>

                            {currentStep.content_type === 'writing_practice' && (
                                <button 
                                    onClick={() => {
                                        const nextSlide = currentSlide + 1
                                        const returnUrl = encodeURIComponent(`${window.location.pathname}?slide=${nextSlide}`)
                                        router.push(`/lesson/${currentStep.metadata?.devanagari || lesson_id}?mode=trace&returnTo=${returnUrl}`)
                                    }}
                                    className="mt-4 px-8 py-3 bg-[#D4AF37] text-[#1C1C1C] rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
                                >
                                    <span>{language === 'hi' ? 'अभ्यास करें→' : 'Start Tracing'}</span>
                                    <span>✍️</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <button
                    onClick={handleNext}
                    className="hidden md:block absolute right-2 md:right-10 p-3 md:p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 text-lg md:text-xl z-10"
                >
                    {isLastStep ? '✓' : '→'}
                </button>
            </div>

            {/* Mobile Navigation Buttons (Bottom) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/95 to-transparent pointer-events-none">
                <div className="flex justify-between items-center gap-3 pointer-events-auto">
                    <button
                        onClick={handlePrevious}
                        disabled={currentSlide === 0}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2C2C2C] text-[#D4AF37] border border-[#D4AF37]/30 font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg text-sm`}
                    >
                        <span className="text-lg">←</span>
                        <span>Prev</span>
                    </button>

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

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/30 text-sm"
                    >
                        <span>{isLastStep ? 'Finish' : 'Next'}</span>
                        <span className="text-lg">→</span>
                    </button>
                </div>
            </div>

        </div>
    )
}
