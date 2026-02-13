'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getIntroLessons, getCompletedLessonIds, type IntroLesson } from '@/lib/introModule'
import { getCurrentIdentity, type Identity } from '@/lib/guestIdentity'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'

// --- Temple Steps Layout Constants ---
const STEP_WIDTH = 220          // Horizontal distance between steps
const STEP_HEIGHT = 100         // Vertical rise per step  
const STEPS_START_X = 100       // Starting X position
const STEPS_START_Y = typeof window !== 'undefined' ? window.innerHeight / 2 + 150 : 500

/**
 * Calculate temple step position
 * Creates horizontal ascending steps from left to right
 */
function getTempleStepPosition(index: number) {
    const x = STEPS_START_X + (index * STEP_WIDTH)
    const y = STEPS_START_Y - (index * STEP_HEIGHT)
    
    return { x, y }
}

/**
 * Generate temple path SVG as stepped path
 */
function generateTemplePath(count: number): string {
    if (count < 2) return ''
    
    const positions = Array.from({ length: count }, (_, i) => getTempleStepPosition(i))
    
    let path = `M ${positions[0].x} ${positions[0].y}`
    
    for (let i = 1; i < positions.length; i++) {
        const prev = positions[i - 1]
        const curr = positions[i]
        
        // Create step pattern: horizontal then vertical  
        const midX = curr.x - STEP_WIDTH / 2
        path += ` L ${midX} ${prev.y} L ${midX} ${curr.y} L ${curr.x} ${curr.y}`
    }
    
    return path
}

export default function IntroLessonsPage() {
    const router = useRouter()
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
    const [lessons, setLessons] = useState<IntroLesson[]>([])
    const [completedIds, setCompletedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
    const [showCelebration, setShowCelebration] = useState(false)
    
    // Refs for scrolling
    const containerRef = useRef<HTMLDivElement>(null)
    const lessonRefs = useRef<Map<number, HTMLDivElement>>(new Map())

    // Derived state
    const lastCompletedLesson = lessons.filter(l => completedIds.includes(l.lesson_id)).sort((a, b) => b.order_no - a.order_no)[0]
    const lastCompletedIndex = lastCompletedLesson ? lessons.findIndex(l => l.lesson_id === lastCompletedLesson.lesson_id) : -1

    useEffect(() => {
        async function loadData() {
            const currentIdentity = await getCurrentIdentity()
            setIdentity(currentIdentity)
            
            const lessonsData = await getIntroLessons()
            setLessons(lessonsData)
            
            // Get completed lessons for both guests and authenticated users
            const completed = await getCompletedLessonIds(currentIdentity)
            setCompletedIds(completed)
            
            setLoading(false)
        }
        
        loadData()
    }, [])

    // Animation Trigger via Search Params
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const justCompletedId = searchParams ? searchParams.get('completed') : null

    useEffect(() => {
        if (justCompletedId && lessons.length > 0 && completedIds.length > 0) {
            if (completedIds.includes(justCompletedId)) {
                const lesson = lessons.find(l => l.lesson_id === justCompletedId)
                if (lesson) {
                    const idx = lessons.findIndex(l => l.lesson_id === lesson.lesson_id)
                    if (idx < lessons.length - 1) {
                        setAnimatingIndex(idx)
                        setTimeout(() => {
                            setShowCelebration(true)
                            setTimeout(() => {
                                setShowCelebration(false)
                                setAnimatingIndex(null)
                                router.replace('/learn/intro', { scroll: false })
                            }, 2000)
                        }, 1000)
                    }
                }
            }
        }
    }, [justCompletedId, lessons, completedIds, router])

    // Auto-scroll to center current/next lesson
    useEffect(() => {
        if (!containerRef.current || lessons.length === 0 || loading) return
        
        const currentStepIndex = lastCompletedIndex === -1 ? 0 : lastCompletedIndex + 1
        const currentPos = getTempleStepPosition(currentStepIndex)
        const minY = STEPS_START_Y - ((lessons.length - 1) * STEP_HEIGHT) - 200
        
        const containerWidth = containerRef.current.clientWidth
        const containerHeight = containerRef.current.clientHeight
        const scrollLeft = currentPos.x - (containerWidth / 2)
        const scrollTop = (currentPos.y - minY) - (containerHeight / 2)
        
        containerRef.current.scrollTo({
            left: Math.max(0, scrollLeft),
            top: Math.max(0, scrollTop),
            behavior: 'smooth'
        })
    }, [lessons, completedIds, loading, lastCompletedIndex])

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] flex items-center justify-center text-[#D4AF37]">
                Loading...
            </div>
        )
    }

    // Calculate bounds for all temple steps
    const minY = lessons.length > 0 ? STEPS_START_Y - ((lessons.length - 1) * STEP_HEIGHT) - 200 : 0
    const maxY = STEPS_START_Y + 200
    const totalWidth = STEPS_START_X + (lessons.length * STEP_WIDTH) + 200
    const totalHeight = maxY - minY

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 bg-gradient-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] text-[#F5F1E8] overflow-auto"
        >
            {/* Floating Sign In */}
            <FloatingSignIn />
            
            {/* Subtle background pattern */}
            <div className="fixed inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px),
                                      radial-gradient(circle at 75% 75%, #E6D8B8 2px, transparent 2px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Back Button */}
            <button 
                onClick={() => router.push('/learn')} 
                className="fixed top-6 left-6 z-50 flex items-center gap-2 text-[#D4AF37] hover:text-[#E69A47] transition-colors text-lg font-bold bg-[#1a1613]/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#D4AF37]/30 hover:border-[#E69A47]/50 shadow-lg"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
            </button>

            {/* Temple Steps Container */}
            <div 
                className="relative"
                style={{ 
                    width: `${totalWidth}px`,
                    height: `${totalHeight}px`,
                    minHeight: '100vh'
                }}
            >
                {/* SVG Path Layer */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    viewBox={`0 ${minY} ${totalWidth} ${totalHeight}`}
                    preserveAspectRatio="xMidYMin meet"
                >
                    <defs>
                        <linearGradient id="introGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#CC7722" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#E69A47" stopOpacity="0.8" />
                        </linearGradient>
                        
                        <filter id="introGlow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    {/* Background dashed path */}
                    <path
                        d={generateTemplePath(lessons.length)}
                        fill="none"
                        stroke="url(#introGradient)"
                        strokeWidth="6"
                        strokeLinecap="square"
                        strokeDasharray="15 10"
                        opacity="0.3"
                    />
                    
                    {/* Completed solid path */}
                    {lastCompletedIndex >= 0 && (
                        <path
                            d={generateTemplePath(lastCompletedIndex + 2)}
                            fill="none"
                            stroke="#D4AF37"
                            strokeWidth="8"
                            strokeLinecap="square"
                            filter="url(#introGlow)"
                        />
                    )}
                </svg>

                {/* Lesson Nodes as Temple Stones */}
                <div className="relative z-20">
                    {lessons.map((lesson, index) => {
                        const pos = getTempleStepPosition(index)
                        const isCompleted = completedIds.includes(lesson.lesson_id)
                        const isNext = (lastCompletedIndex === -1 && index === 0) || (index === lastCompletedIndex + 1)
                        const isLocked = false // Allow access to all lessons
                        const isCelebrating = showCelebration && (index === animatingIndex)
                        
                        return (
                            <motion.div
                                key={lesson.id}
                                ref={(el) => {
                                    if (el) lessonRefs.current.set(index, el)
                                }}
                                className="absolute flex flex-col items-center"
                                style={{ 
                                    left: pos.x - 60,
                                    top: pos.y - minY - 80,
                                }}
                                initial={{ scale: 0, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                            >
                                {/* Temple Stone Step Base */}
                                <div className="absolute -bottom-4 w-32 h-3 bg-gradient-to-b from-[#4a3f2f]/60 to-transparent rounded-full blur-sm" />
                                
                                {/* Lesson Stone */}
                                <Link href={`/learn/intro/${lesson.lesson_id}`}>
                                    <motion.div
                                        className={`
                                            relative w-24 h-24 flex items-center justify-center border-4 transition-all duration-500
                                            ${isCompleted || isCelebrating 
                                                ? 'bg-gradient-to-br from-[#E69A47] to-[#CC7722] border-[#D4AF37] text-[#1a1613] shadow-[0_0_30px_rgba(212,175,55,0.8),0_8px_0_rgba(204,119,34,0.6)]' 
                                                : isNext 
                                                ? 'bg-gradient-to-br from-[#D4AF37] to-[#CC7722] border-[#E69A47] text-[#1a1613] animate-pulse shadow-[0_0_40px_rgba(230,154,71,0.9),0_8px_0_rgba(204,119,34,0.7)]'
                                                : 'bg-gradient-to-br from-[#3a3230] to-[#2a2420] border-[#4a3f2f] text-[#E6D8B8]/40 hover:border-[#D4AF37] hover:text-[#E6D8B8]'
                                            }
                                            ${isCompleted || isNext ? 'rounded-lg' : 'rounded-md'}
                                        `}
                                        style={{
                                            transform: isCompleted || isNext ? 'translateY(-4px)' : 'translateY(0)',
                                            boxShadow: isCompleted || isNext ? '' : '0 6px 0 rgba(42, 36, 32, 0.8)'
                                        }}
                                        whileHover={{ 
                                            scale: 1.05, 
                                            translateY: -8,
                                            boxShadow: '0 0 30px rgba(212, 175, 55, 0.6), 0 10px 0 rgba(42, 36, 32, 0.8)'
                                        }}
                                        whileTap={{ scale: 0.95, translateY: 0 }}
                                    >
                                        <span className="text-3xl">{lesson.thumbnail_icon}</span>
                                        
                                        {/* Golden torch for completed */}
                                        {isCompleted && (
                                            <motion.div 
                                                className="absolute -top-3 -right-3 w-6 h-6 bg-[#E69A47] rounded-full flex items-center justify-center border-2 border-[#1a1613] shadow-[0_0_15px_rgba(230,154,71,0.8)]"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: "spring" }}
                                            >
                                                <span className="text-[#1a1613] text-xs">🔥</span>
                                            </motion.div>
                                        )}
                                        
                                        {/* Start indicator for next */}
                                        {isNext && (
                                            <motion.div 
                                                className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#E69A47] px-3 py-1 rounded text-xs font-bold text-[#1a1613] border border-[#D4AF37]/50"
                                                animate={{ y: [-5, 5, -5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                प्रारंभ
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </Link>
                                
                                {/* Lesson Title on Stone Plaque */}
                                <motion.div 
                                    className="mt-4 px-3 py-2 bg-[#2a2420]/90 backdrop-blur-sm rounded border border-[#D4AF37]/30 max-w-[140px] text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                >
                                    <span className="text-xs font-bold text-[#E6D8B8] leading-tight block">
                                        {lesson.title}
                                    </span>
                                    <span className="text-[10px] text-[#D4AF37]/70 mt-1 block">
                                        {lesson.subtitle}
                                    </span>
                                </motion.div>
                                
                                {/* Level number */}
                                <div className="mt-2 text-xs text-[#D4AF37]/50 font-serif">
                                    Level {index + 1}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
                
                {/* Temple Summit Achievement */}
                {lastCompletedIndex === lessons.length - 1 && (
                    <motion.div
                        className="absolute"
                        style={{
                            left: STEPS_START_X + (lessons.length * STEP_WIDTH) - 100,
                            top: STEPS_START_Y - (lessons.length * STEP_HEIGHT) - minY - 100
                        }}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", delay: 0.5 }}
                    >
                        <div className="bg-gradient-to-r from-[#E69A47] to-[#D4AF37] text-[#1a1613] font-bold py-4 px-8 rounded-lg text-xl shadow-[0_0_40px_rgba(230,154,71,0.9)] border-2 border-[#F5F1E8]/50">
                            📜 Introduction Complete! 📜
                        </div>
                        <div className="text-center text-[#E6D8B8] text-sm mt-2">Ready for Swar (Vowels)</div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
