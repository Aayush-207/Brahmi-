'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getNextModuleRoute } from '@/lib/lessonFlow'
import { getVyanjanLessons, getCompletedVyanjanLessonIds, type VyanjanLesson } from '@/lib/vyanjanModule'
import { useLanguage } from '@/lib/LanguageContext'
import { getCurrentIdentity, type Identity } from '@/lib/guestIdentity'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'
import { AnimatedBirds } from '@/components/animations/AnimatedBird'

// --- Temple Steps Layout Constants (Desktop) ---
const STEP_WIDTH = 220          // Horizontal distance between steps
const STEP_HEIGHT = 100         // Vertical rise per step  
const STEPS_START_X = 100       // Starting X position
const STEPS_START_Y = typeof window !== 'undefined' ? window.innerHeight / 2 + 150 : 500

// --- Journey View Layout Constants (Mobile) ---
const JOURNEY_NODE_SPACING = 160    // Vertical spacing between nodes
const JOURNEY_START_Y = 150         // Starting Y position

/**
 * Calculate temple step position (Desktop)
 * Creates horizontal ascending steps from left to right
 */
function getTempleStepPosition(index: number) {
    const x = STEPS_START_X + (index * STEP_WIDTH)
    const y = STEPS_START_Y - (index * STEP_HEIGHT)
    
    return { x, y }
}

/**
 * Calculate journey position (Mobile)
 * Creates a vertical winding path
 */
function getJourneyPosition(index: number, centerX: number) {
    const y = JOURNEY_START_Y + (index * JOURNEY_NODE_SPACING)
    // Alternate left and right for visual interest
    const offset = (index % 2 === 0) ? -40 : 40
    const x = centerX + offset
    
    return { x, y }
}

/**
 * Generate temple path SVG as stepped path (Desktop)
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

/**
 * Generate journey path SVG as curved vertical path (Mobile)
 */
function generateJourneyPath(count: number, centerX: number): string {
    if (count < 2) return ''
    
    const positions = Array.from({ length: count }, (_, i) => getJourneyPosition(i, centerX))
    
    let path = `M ${positions[0].x} ${positions[0].y}`
    
    for (let i = 1; i < positions.length; i++) {
        const prev = positions[i - 1]
        const curr = positions[i]
        
        // Create smooth curve between points
        const controlY = (prev.y + curr.y) / 2
        path += ` Q ${prev.x} ${controlY}, ${curr.x} ${curr.y}`
    }
    
    return path
}

export default function VyanjanLessonsPage() {
    const router = useRouter()
    const { language } = useLanguage()
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
    const [lessons, setLessons] = useState<VyanjanLesson[]>([])
    const [completedIds, setCompletedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
    const [showCelebration, setShowCelebration] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [showCompletionModal, setShowCompletionModal] = useState(false)
    const [completionDismissed, setCompletionDismissed] = useState(false)
    
    // Refs for scrolling
    const containerRef = useRef<HTMLDivElement>(null)
    const lessonRefs = useRef<Map<number, HTMLDivElement>>(new Map())

    // Derived state
    const lastCompletedLesson = lessons.filter(l => completedIds.includes(l.lesson_id)).sort((a, b) => b.order_no - a.order_no)[0]
    const lastCompletedIndex = lastCompletedLesson ? lessons.findIndex(l => l.lesson_id === lastCompletedLesson.lesson_id) : -1

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        async function loadData() {
            const currentIdentity = await getCurrentIdentity()
            setIdentity(currentIdentity)
            
            const lessonsData = await getVyanjanLessons(language)
            setLessons(lessonsData)
            
            // Get completed lessons for both guests and authenticated users
            const completed = await getCompletedVyanjanLessonIds(currentIdentity)
            setCompletedIds(completed)
            
            setLoading(false)
        }
        
        loadData()
    }, [language])

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
                                router.replace('/learn/vyanjan', { scroll: false })
                            }, 2000)
                        }, 1000)
                    }
                }
            }
        }
    }, [justCompletedId, lessons, completedIds, router])

    // Show completion modal when vyanjan module is completed
    useEffect(() => {
        if (!loading && lessons.length > 0 && completedIds.length === lessons.length && !showCompletionModal && !completionDismissed) {
            // All lessons completed - show modal (unless dismissed)
            const timer = setTimeout(() => {
                setShowCompletionModal(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [loading, lessons.length, completedIds.length, showCompletionModal, completionDismissed])

    useEffect(() => {
        if (completedIds.length !== lessons.length && completionDismissed) {
            setCompletionDismissed(false)
        }
    }, [completedIds.length, lessons.length, completionDismissed])

    // Auto-scroll to center current/next lesson
    useEffect(() => {
        if (!containerRef.current || lessons.length === 0 || loading) return
        
        const currentStepIndex = lastCompletedIndex === -1 ? 0 : lastCompletedIndex + 1
        
        if (isMobile) {
            // Mobile: Journey view - scroll vertically
            const centerX = window.innerWidth / 2
            const currentPos = getJourneyPosition(currentStepIndex, centerX)
            const containerHeight = containerRef.current.clientHeight
            const scrollTop = currentPos.y - (containerHeight / 2)
            
            containerRef.current.scrollTo({
                left: 0,
                top: Math.max(0, scrollTop),
                behavior: 'smooth'
            })
        } else {
            // Desktop: Temple steps view
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
        }
    }, [lessons, completedIds, loading, lastCompletedIndex, isMobile])

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] flex items-center justify-center text-[#D4AF37]">
                Loading...
            </div>
        )
    }

    // Calculate bounds based on view type
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 200
    
    // Desktop: Temple steps bounds - add extra space for completion node
    const minY = lessons.length > 0 ? STEPS_START_Y - ((lessons.length - 1) * STEP_HEIGHT) - 200 : 0
    const maxY = STEPS_START_Y + 200
    const totalWidth = STEPS_START_X + ((lessons.length + 1) * STEP_WIDTH) + 300
    const totalHeight = maxY - minY
    
    // Mobile: Journey bounds - add extra space for completion node
    const journeyTotalHeight = JOURNEY_START_Y + ((lessons.length + 1) * JOURNEY_NODE_SPACING) + 300

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

            {/* Animated Birds - Duolingo Style */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
                <AnimatedBirds />
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

            {/* Mobile: Journey View */}
            {isMobile ? (
                <div 
                    className="relative w-full"
                    style={{ 
                        height: `${journeyTotalHeight}px`,
                        minHeight: '100vh'
                    }}
                >
                    {/* SVG Path Layer - Journey */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                        viewBox={`0 0 ${window.innerWidth} ${journeyTotalHeight}`}
                        preserveAspectRatio="xMidYMin meet"
                    >
                        <defs>
                            <linearGradient id="vyanjanJourneyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#CC7722" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#E69A47" stopOpacity="0.8" />
                            </linearGradient>
                            
                            <filter id="vyanjanJourneyGlow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Background dashed path */}
                        <path
                            d={generateJourneyPath(lessons.length + 1, centerX) ?? ''}
                            fill="none"
                            stroke="url(#vyanjanJourneyGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="10 8"
                            opacity="0.4"
                        />
                        
                        {/* Completed solid path */}
                        {lastCompletedIndex >= 0 && (
                            <path
                                d={generateJourneyPath(
                                    lastCompletedIndex === lessons.length - 1 
                                        ? lessons.length + 1 
                                        : lastCompletedIndex + 2, 
                                    centerX
                                ) ?? ''}
                                fill="none"
                                stroke="#D4AF37"
                                strokeWidth="6"
                                strokeLinecap="round"
                                filter="url(#vyanjanJourneyGlow)"
                            />
                        )}
                    </svg>

                    {/* Lesson Nodes - Journey View */}
                    <div className="relative z-20">
                        {lessons.map((lesson, index) => {
                            const pos = getJourneyPosition(index, centerX)
                            const isCompleted = completedIds.includes(lesson.lesson_id)
                            const isNext = (lastCompletedIndex === -1 && index === 0) || (index === lastCompletedIndex + 1)
                            const isCelebrating = showCelebration && (index === animatingIndex)
                            
                            return (
                                <motion.div
                                    key={lesson.id}
                                    ref={(el) => {
                                        if (el) lessonRefs.current.set(index, el)
                                    }}
                                    className="absolute flex flex-col items-center"
                                    style={{ 
                                        left: pos.x - 48,
                                        top: pos.y - 48,
                                    }}
                                    initial={{ scale: 0, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{ delay: index * 0.08, type: "spring" }}
                                >
                                    {/* Lesson Node */}
                                    <Link href={`/learn/vyanjan/${lesson.lesson_id}`}>
                                        <motion.div
                                            className={`
                                                relative w-20 h-20 flex items-center justify-center border-4 rounded-full transition-all duration-500
                                                ${isCompleted || isCelebrating 
                                                    ? 'bg-gradient-to-br from-[#E69A47] to-[#CC7722] border-[#D4AF37] text-[#1a1613] shadow-[0_0_25px_rgba(212,175,55,0.8)]' 
                                                    : isNext 
                                                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#CC7722] border-[#E69A47] text-[#1a1613] animate-pulse shadow-[0_0_35px_rgba(230,154,71,0.9)]'
                                                    : 'bg-gradient-to-br from-[#3a3230] to-[#2a2420] border-[#4a3f2f] text-[#E6D8B8]/40'
                                                }
                                            `}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="text-2xl">{lesson.thumbnail_icon}</span>
                                            
                                            {/* Completed indicator */}
                                            {isCompleted && (
                                                <motion.div 
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#E69A47] rounded-full flex items-center justify-center border-2 border-[#1a1613] shadow-[0_0_10px_rgba(230,154,71,0.8)]"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    <span className="text-[#1a1613] text-xs">🔥</span>
                                                </motion.div>
                                            )}
                                            
                                            {/* Next indicator */}
                                            {isNext && (
                                                <motion.div 
                                                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#E69A47] px-2 py-1 rounded text-xs font-bold text-[#1a1613]"
                                                    animate={{ y: [-3, 3, -3] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    प्रारंभ
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </Link>
                                    
                                    {/* Lesson Title */}
                                    <motion.div 
                                        className="mt-3 px-2 py-1 bg-[#2a2420]/90 backdrop-blur-sm rounded border border-[#D4AF37]/30 max-w-[120px] text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.08 + 0.2 }}
                                    >
                                        <span className="text-[10px] font-bold text-[#E6D8B8] leading-tight block">
                                            {lesson.title}
                                        </span>
                                    </motion.div>
                                </motion.div>
                            )
                        })}

                        {/* Completion Node - Journey View */}
                        {lastCompletedIndex === lessons.length - 1 && (
                            <motion.div
                                className="absolute flex flex-col items-center"
                                style={{ 
                                    left: getJourneyPosition(lessons.length, centerX).x - 48,
                                    top: getJourneyPosition(lessons.length, centerX).y - 48,
                                }}
                                initial={{ scale: 0, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ delay: lessons.length * 0.08, type: "spring" }}
                            >
                                {/* Completion Node */}
                                <button
                                    onClick={() => setShowCompletionModal(true)}
                                    className="relative w-20 h-20 flex items-center justify-center border-4 rounded-full bg-gradient-to-br from-[#E69A47] to-[#CC7722] border-[#D4AF37] text-[#1a1613] shadow-[0_0_30px_rgba(212,175,55,0.9)] hover:scale-110 transition-all duration-300"
                                >
                                    <span className="text-2xl">📜</span>
                                    
                                    {/* Completed indicator */}
                                    <motion.div 
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#E69A47] rounded-full flex items-center justify-center border-2 border-[#1a1613] shadow-[0_0_10px_rgba(230,154,71,0.8)]"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <span className="text-[#1a1613] text-xs">→</span>
                                    </motion.div>
                                </button>
                                
                                {/* Lesson Title */}
                                <motion.div 
                                    className="mt-3 px-2 py-1 bg-[#2a2420]/90 backdrop-blur-sm rounded border border-[#D4AF37]/30 max-w-[120px] text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: lessons.length * 0.08 + 0.2 }}
                                >
                                    <span className="text-[10px] font-bold text-[#E6D8B8] leading-tight block">
                                        Vyanjan Completed!
                                    </span>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                </div>
            ) : (
                /* Desktop: Temple Steps Container */
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
                            <linearGradient id="vyanjanGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#CC7722" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#E69A47" stopOpacity="0.8" />
                            </linearGradient>
                            
                            <filter id="vyanjanGlow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Background dashed path */}
                        <path
                            d={generateTemplePath(lessons.length + 1) ?? ''}
                            fill="none"
                            stroke="url(#vyanjanGradient)"
                            strokeWidth="6"
                            strokeLinecap="square"
                            strokeDasharray="15 10"
                            opacity="0.3"
                        />
                        
                        {/* Completed solid path */}
                        {lastCompletedIndex >= 0 && (
                            <path
                                d={generateTemplePath(
                                    lastCompletedIndex === lessons.length - 1 
                                        ? lessons.length + 1 
                                        : lastCompletedIndex + 2
                                ) ?? ''}
                                fill="none"
                                stroke="#D4AF37"
                                strokeWidth="8"
                                strokeLinecap="square"
                                filter="url(#vyanjanGlow)"
                            />
                        )}
                    </svg>

                    {/* Lesson Nodes as Temple Stones */}
                    <div className="relative z-20">
                        {lessons.map((lesson, index) => {
                            const pos = getTempleStepPosition(index)
                            const isCompleted = completedIds.includes(lesson.lesson_id)
                            const isNext = (lastCompletedIndex === -1 && index === 0) || (index === lastCompletedIndex + 1)
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
                                    <Link href={`/learn/vyanjan/${lesson.lesson_id}`}>
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
                                    
                                </motion.div>
                            )
                        })}

                        {/* Completion Node - Temple Steps */}
                        {lastCompletedIndex === lessons.length - 1 && (
                            <motion.div
                                className="absolute flex flex-col items-center"
                                style={{ 
                                    left: getTempleStepPosition(lessons.length).x - 60,
                                    top: getTempleStepPosition(lessons.length).y - minY - 80,
                                }}
                                initial={{ scale: 0, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ delay: lessons.length * 0.1, type: "spring" }}
                            >
                                {/* Temple Stone Step Base */}
                                <div className="absolute -bottom-4 w-32 h-3 bg-gradient-to-b from-[#4a3f2f]/60 to-transparent rounded-full blur-sm" />
                                
                                {/* Completion Stone */}
                                <button
                                    onClick={() => setShowCompletionModal(true)}
                                    className="relative w-24 h-24 flex items-center justify-center border-4 bg-gradient-to-br from-[#E69A47] to-[#CC7722] border-[#D4AF37] text-[#1a1613] shadow-[0_0_30px_rgba(212,175,55,0.8),0_8px_0_rgba(204,119,34,0.6)] rounded-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.9),0_10px_0_rgba(204,119,34,0.7)] transition-all duration-300"
                                    style={{ transform: 'translateY(-4px)' }}
                                >
                                    <span className="text-3xl">📜</span>
                                    
                                    {/* Golden indicator */}
                                    <motion.div 
                                        className="absolute -top-3 -right-3 w-6 h-6 bg-[#E69A47] rounded-full flex items-center justify-center border-2 border-[#1a1613] shadow-[0_0_15px_rgba(230,154,71,0.8)]"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                    >
                                        <span className="text-[#1a1613] text-xs">→</span>
                                    </motion.div>
                                </button>
                                
                                {/* Lesson Title on Stone Plaque */}
                                <motion.div 
                                    className="mt-4 px-3 py-2 bg-[#2a2420]/90 backdrop-blur-sm rounded border border-[#D4AF37]/30 max-w-[140px] text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: lessons.length * 0.1 + 0.3 }}
                                >
                                    <span className="text-xs font-bold text-[#E6D8B8] leading-tight block">
                                        Vyanjan Completed!
                                    </span>
                                    <span className="text-[10px] text-[#D4AF37]/70 mt-1 block">
                                        All Consonants Mastered
                                    </span>
                                </motion.div>
                                
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

            {/* Completion Modal */}
            {showCompletionModal && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-[#1a1613] border-2 border-[#D4AF37]/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_60px_rgba(212,175,55,0.4)]"
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        {/* Celebration Header */}
                        <div className="text-center mb-6">
                            <motion.div
                                className="text-6xl mb-4"
                                animate={{ rotate: [0, 10, -10, 10, 0] }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                🎉
                            </motion.div>
                            <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">
                                Vyanjan Module Completed!
                            </h2>
                            <p className="text-[#E6D8B8] text-base">
                                You&apos;ve mastered all the consonants! What&apos;s next?
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            {/* Continue to Next Module (Matra) */}
                            <button
                                onClick={() => {
                                    setShowCompletionModal(false)
                                    setCompletionDismissed(true)
                                    const nextRoute = getNextModuleRoute('module-vyanjan')
                                    router.push(nextRoute || '/learn')
                                }}
                                className="w-full bg-gradient-to-r from-[#E69A47] to-[#D4AF37] text-[#1a1613] font-bold py-4 px-6 rounded-lg hover:brightness-110 hover:scale-105 transition-all shadow-lg border-2 border-[#F5F1E8]/50"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-lg">📖</span>
                                    <span>Continue to Matra (Diacritics)</span>
                                    <span className="text-lg">→</span>
                                </div>
                            </button>

                            {/* Practice Letters */}
                            <button
                                onClick={() => {
                                    setShowCompletionModal(false)
                                    setCompletionDismissed(true)
                                    router.push('/letters')
                                }}
                                className="w-full bg-[#2a2420] text-[#E6D8B8] font-semibold py-4 px-6 rounded-lg hover:bg-[#3a3230] hover:text-[#D4AF37] transition-all border-2 border-[#4a3f2f] hover:border-[#D4AF37]"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-lg">✍️</span>
                                    <span>Practice Letters</span>
                                </div>
                            </button>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => { setShowCompletionModal(false); setCompletionDismissed(true) }}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2a2420] transition-colors text-[#D4AF37] hover:text-[#E69A47]"
                        >
                            ✕
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
