'use client'

import { useEffect, useState, useRef } from 'react'
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity'
import { getUserProgress } from '@/lib/progress'
import { getVowels } from '@/lib/swarModule'
import Link from 'next/link'
import { toHindiNum } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'
import { AnimatedBirds } from '@/components/animations/AnimatedBird'

// --- Types ---
type Letter = {
    id: string
    letter_name: string
    brahmi_symbol: string
    order_no: number
}

// --- Temple Steps Layout Constants (Desktop) ---
const STEP_WIDTH = 220          // Horizontal distance between steps
const STEP_HEIGHT = 100         // Vertical rise per step  
const STEPS_START_X = 100       // Starting X position
const STEPS_START_Y = typeof window !== 'undefined' ? window.innerHeight / 2 + 150 : 500  // Center vertically

// --- Journey View Layout Constants (Mobile) ---
const JOURNEY_NODE_SPACING = 160    // Vertical spacing between nodes
const JOURNEY_START_Y = 150         // Starting Y position
const JOURNEY_CENTER_X = typeof window !== 'undefined' ? window.innerWidth / 2 : 200

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

export default function LettersPage() {
    // --- State ---
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
    const [isLoaded, setIsLoaded] = useState(false)
    const [letters, setLetters] = useState<Letter[]>([])
    const [loading, setLoading] = useState(true)
    const [completedIds, setCompletedIds] = useState<string[]>([])
    const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
    const [showCelebration, setShowCelebration] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    
    // Refs for scrolling
    const containerRef = useRef<HTMLDivElement>(null)
    const letterRefs = useRef<Map<number, HTMLDivElement>>(new Map())

    // Derived state
    const lastCompletedLetter = letters.filter(l => completedIds.includes(l.id)).sort((a, b) => b.order_no - a.order_no)[0]
    const lastCompletedIndex = lastCompletedLetter ? letters.findIndex(l => l.id === lastCompletedLetter.id) : -1

    const router = useRouter()

    // --- Effects ---

    // 0. Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // 1. Load User Identity then immediately load completed IDs
    useEffect(() => {
        const loadIdentity = async () => {
            const id = await getCurrentIdentity()
            setIdentity(id)
            setIsLoaded(true)
            // Load persisted progress right after identity resolves
            const { completedIds: saved } = await getUserProgress(id)
            setCompletedIds(saved)
        }
        loadIdentity()
    }, [])

    // 2. Fetch Swar (Vowels) Data
    useEffect(() => {
        async function fetchVowels() {
            try {
                console.log('[LettersPage] Fetching vowels from swarModule')
                const vowels = await getVowels()
                
                // Transform Vowel type to Letter type
                const transformedLetters: Letter[] = vowels.map(vowel => ({
                    id: vowel.id,
                    letter_name: vowel.devanagari,  // Show Devanagari name
                    brahmi_symbol: vowel.brahmi,    // Brahmi symbol
                    order_no: vowel.order
                }))
                
                setLetters(transformedLetters)
                console.log(`[LettersPage] Loaded ${transformedLetters.length} vowels`)
            } catch (error) {
                console.error('[LettersPage] Error fetching vowels:', error)
                setLetters([])
            } finally {
                setLoading(false)
            }
        }
        
        fetchVowels()
    }, [])

    // Animation Trigger via Search Params
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const justCompletedId = searchParams ? searchParams.get('completed') : null

    useEffect(() => {
        if (!justCompletedId || letters.length === 0) return
        // Add to completedIds in state if not already there
        setCompletedIds(prev => prev.includes(justCompletedId) ? prev : [...prev, justCompletedId])
        // Trigger celebration animation
        const letter = letters.find(l => l.id === justCompletedId)
        if (letter) {
            const idx = letters.findIndex(l => l.id === letter.id)
            if (idx < letters.length - 1) {
                setAnimatingIndex(idx)
                setTimeout(() => {
                    setShowCelebration(true)
                    setTimeout(() => {
                        setShowCelebration(false)
                        setAnimatingIndex(null)
                        router.replace('/letters', { scroll: false })
                    }, 2000)
                }, 1000)
            }
        }
    }, [justCompletedId, letters, router])

    // Auto-scroll to center current/next letter
    useEffect(() => {
        if (!containerRef.current || letters.length === 0 || loading) return
        
        // Determine current step index
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
            const minY = STEPS_START_Y - ((letters.length - 1) * STEP_HEIGHT) - 200
            
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
    }, [letters, completedIds, loading, lastCompletedIndex, isMobile])

    if (loading) return <div className="fixed inset-0 bg-gradient-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] flex items-center justify-center text-[#D4AF37]">Loading...</div>

    // Calculate bounds based on view type
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 200
    
    // Desktop: Temple steps bounds
    const minY = letters.length > 0 ? STEPS_START_Y - ((letters.length - 1) * STEP_HEIGHT) - 200 : 0  // Highest point with padding
    const maxY = STEPS_START_Y + 200  // Lowest point with padding
    const totalWidth = STEPS_START_X + (letters.length * STEP_WIDTH) + 200
    const totalHeight = maxY - minY  // Total vertical span
    
    // Mobile: Journey bounds
    const journeyTotalHeight = JOURNEY_START_Y + (letters.length * JOURNEY_NODE_SPACING) + 200

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

            {/* Back Button Only */}
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
                            <linearGradient id="swarJourneyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#CC7722" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#E69A47" stopOpacity="0.8" />
                            </linearGradient>
                            
                            <filter id="swarJourneyGlow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Background dashed path - draws in */}
                        <motion.path
                            d={generateJourneyPath(letters.length, centerX) ?? ''}
                            fill="none"
                            stroke="url(#swarJourneyGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="10 8"
                            opacity="0.4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.4 }}
                            transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
                        />
                        
                        {/* Completed solid path */}
                        {lastCompletedIndex >= 0 && (
                            <path
                                d={generateJourneyPath(lastCompletedIndex + 2, centerX) ?? ''}
                                fill="none"
                                stroke="#D4AF37"
                                strokeWidth="6"
                                strokeLinecap="round"
                                filter="url(#swarJourneyGlow)"
                            />
                        )}
                    </svg>

                    {/* Letter Nodes - Journey View */}
                    <div className="relative z-20">
                        {letters.map((letter, index) => {
                            const pos = getJourneyPosition(index, centerX)
                            const isCompleted = completedIds.includes(letter.id)
                            const isNext = (lastCompletedIndex === -1 && index === 0) || (index === lastCompletedIndex + 1)
                            const isCelebrating = showCelebration && (index === animatingIndex)
                            
                            return (
                                <motion.div
                                    key={letter.id}
                                    ref={(el) => { if (el) letterRefs.current.set(index, el) }}
                                    className="absolute flex flex-col items-center"
                                    style={{ left: pos.x - 48, top: pos.y - 48 }}
                                    initial={{ opacity: 0, scale: 0, y: 40, rotate: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 240, damping: 18 }}
                                >
                                    {/* Letter Node */}
                                    <Link href={`/lesson/${letter.id}`}>
                                        <motion.div
                                            className={`relative w-20 h-20 flex items-center justify-center border-4 rounded-full
                                                ${isCompleted || isCelebrating
                                                    ? 'bg-gradient-to-br from-[#E69A47] to-[#CC7722] border-[#D4AF37] text-[#1a1613]'
                                                    : isNext
                                                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#CC7722] border-[#E69A47] text-[#1a1613]'
                                                    : 'bg-gradient-to-br from-[#3a3230] to-[#2a2420] border-[#4a3f2f] text-[#E6D8B8]/40'
                                                }`}
                                            animate={
                                                isCelebrating
                                                    ? { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, -6, 6, -3, 0] }
                                                    : isCompleted
                                                    ? { boxShadow: ['0 0 15px rgba(212,175,55,0.5)', '0 0 30px rgba(212,175,55,0.9)', '0 0 15px rgba(212,175,55,0.5)'] }
                                                    : isNext
                                                    ? { y: [0, -6, 0], boxShadow: ['0 0 25px rgba(230,154,71,0.7)', '0 0 45px rgba(230,154,71,1)', '0 0 25px rgba(230,154,71,0.7)'] }
                                                    : {}
                                            }
                                            transition={
                                                isCelebrating ? { duration: 0.6 }
                                                    : isCompleted || isNext ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                                                    : {}
                                            }
                                            whileHover={{ scale: 1.12, boxShadow: '0 0 40px rgba(212,175,55,0.9)' }}
                                            whileTap={{ scale: 0.92 }}
                                        >
                                            {/* Symbol with micro-pulse */}
                                            <motion.span
                                                className="text-2xl font-serif font-bold"
                                                animate={isNext ? { scale: [1, 1.1, 1] } : {}}
                                                transition={isNext ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : {}}
                                            >
                                                {letter.brahmi_symbol}
                                            </motion.span>

                                            {/* Shimmer for completed */}
                                            {isCompleted && (
                                                <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                                        animate={{ x: ['-120%', '200%'] }}
                                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                                                    />
                                                </div>
                                            )}

                                            {/* Completed badge */}
                                            {isCompleted && (
                                                <motion.div
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#E69A47] rounded-full flex items-center justify-center border-2 border-[#1a1613] shadow-[0_0_10px_rgba(230,154,71,0.8)]"
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                                                >
                                                    <span className="text-[#1a1613] text-xs">🔥</span>
                                                </motion.div>
                                            )}

                                            {/* Next label */}
                                            {isNext && (
                                                <motion.div
                                                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#E69A47] px-2 py-1 rounded text-xs font-bold text-[#1a1613] whitespace-nowrap"
                                                    animate={{ y: [-3, 3, -3] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    प्रारंभ
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </Link>

                                    {/* Letter Name */}
                                    <motion.div
                                        className="mt-3 px-2 py-1 bg-[#2a2420]/90 backdrop-blur-sm rounded border border-[#D4AF37]/30"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 + 0.25, duration: 0.4 }}
                                    >
                                        <span className="text-[10px] font-bold text-[#E6D8B8] uppercase tracking-wider">{letter.letter_name}</span>
                                    </motion.div>
                                </motion.div>
                            )
                        })}
                    </div>
                    
                    {/* Journey Completion */}
                    {lastCompletedIndex === letters.length - 1 && (
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2"
                            style={{ top: journeyTotalHeight - 150 }}
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: "spring", delay: 0.5 }}
                        >
                            <div className="bg-gradient-to-r from-[#E69A47] to-[#D4AF37] text-[#1a1613] font-bold py-3 px-6 rounded-lg text-base shadow-[0_0_30px_rgba(230,154,71,0.9)] border-2 border-[#F5F1E8]/50">
                                🕉️ Complete! 🕉️
                            </div>
                        </motion.div>
                    )}
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
                            <linearGradient id="templeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#CC7722" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#E69A47" stopOpacity="0.8" />
                            </linearGradient>
                            
                            <filter id="templeGlow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Background dashed path - draws in */}
                        <motion.path
                            d={generateTemplePath(letters.length) ?? ''}
                            fill="none"
                            stroke="url(#templeGradient)"
                            strokeWidth="6"
                            strokeLinecap="square"
                            strokeDasharray="15 10"
                            opacity="0.3"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
                        />
                        
                        {/* Completed solid path */}
                        {lastCompletedIndex >= 0 && (
                            <path
                                d={generateTemplePath(lastCompletedIndex + 2) ?? ''}
                                fill="none"
                                stroke="#D4AF37"
                                strokeWidth="8"
                                strokeLinecap="square"
                                filter="url(#templeGlow)"
                            />
                        )}
                    </svg>

                    {/* Letter Nodes as Temple Stones */}
                    <div className="relative z-20">
                        {letters.map((letter, index) => {
                            const pos = getTempleStepPosition(index)
                            const isCompleted = completedIds.includes(letter.id)
                            const isNext = (lastCompletedIndex === -1 && index === 0) || (index === lastCompletedIndex + 1)
                            const isLocked = false // Allow access to all lessons
                            const isCelebrating = showCelebration && (index === animatingIndex)
                            
                            return (
                                <motion.div
                                    key={letter.id}
                                    ref={(el) => {
                                        if (el) letterRefs.current.set(index, el)
                                    }}
                                    className="absolute flex flex-col items-center"
                                    style={{ left: pos.x - 60, top: pos.y - minY - 80 }}
                                    initial={{ opacity: 0, scale: 0, y: 50, rotate: -12 }}
                                    animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                                    transition={{ delay: index * 0.12, type: 'spring', stiffness: 220, damping: 16 }}
                                >
                                    {/* Stone shadow base */}
                                    <div className="absolute -bottom-4 w-32 h-3 bg-gradient-to-b from-[#4a3f2f]/60 to-transparent rounded-full blur-sm" />

                                    {/* Letter Stone */}
                                    <Link href={`/lesson/${letter.id}`}>
                                        <motion.div
                                            className={`relative w-24 h-24 flex items-center justify-center border-4
                                                ${isCompleted || isCelebrating
                                                    ? 'bg-gradient-to-br from-[#E69A47] to-[#CC7722] border-[#D4AF37] text-[#1a1613] rounded-lg'
                                                    : isNext
                                                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#CC7722] border-[#E69A47] text-[#1a1613] rounded-lg'
                                                    : 'bg-gradient-to-br from-[#3a3230] to-[#2a2420] border-[#4a3f2f] text-[#E6D8B8]/40 rounded-md'
                                                }`}
                                            animate={
                                                isCelebrating
                                                    ? { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, -6, 6, -3, 0] }
                                                    : isCompleted
                                                    ? { y: -4, boxShadow: ['0 0 20px rgba(212,175,55,0.5)', '0 0 40px rgba(212,175,55,0.9)', '0 0 20px rgba(212,175,55,0.5)'] }
                                                    : isNext
                                                    ? { y: [0, -7, 0], boxShadow: ['0 0 35px rgba(230,154,71,0.7)', '0 0 55px rgba(230,154,71,1)', '0 0 35px rgba(230,154,71,0.7)'] }
                                                    : { y: 0, boxShadow: '0 6px 0 rgba(42,36,32,0.8)' }
                                            }
                                            transition={
                                                isCelebrating
                                                    ? { duration: 0.6 }
                                                    : isCompleted || isNext
                                                    ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                                                    : {}
                                            }
                                            whileHover={{ scale: 1.1, y: -10, boxShadow: '0 0 45px rgba(212,175,55,0.9), 0 12px 0 rgba(42,36,32,0.8)' }}
                                            whileTap={{ scale: 0.92, y: 0 }}
                                        >
                                            {/* Brahmi symbol with micro-pulse on next */}
                                            <motion.span
                                                className="text-3xl font-serif font-bold"
                                                animate={isNext ? { scale: [1, 1.08, 1] } : {}}
                                                transition={isNext ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : {}}
                                            >
                                                {letter.brahmi_symbol}
                                            </motion.span>

                                            {/* Shimmer sweep for completed */}
                                            {isCompleted && (
                                                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                                                        animate={{ x: ['-120%', '200%'] }}
                                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                                                    />
                                                </div>
                                            )}

                                            {/* Completed badge */}
                                            {isCompleted && (
                                                <motion.div
                                                    className="absolute -top-3 -right-3 w-6 h-6 bg-[#E69A47] rounded-full flex items-center justify-center border-2 border-[#1a1613] shadow-[0_0_15px_rgba(230,154,71,0.8)]"
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                                                >
                                                    <span className="text-[#1a1613] text-xs">🔥</span>
                                                </motion.div>
                                            )}

                                            {/* Next label */}
                                            {isNext && (
                                                <motion.div
                                                    className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#E69A47] px-3 py-1 rounded text-xs font-bold text-[#1a1613] border border-[#D4AF37]/50 whitespace-nowrap"
                                                    animate={{ y: [-5, 5, -5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    प्रारंभ
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </Link>

                                    {/* Name plaque */}
                                    <motion.div
                                        className="mt-4 px-3 py-1 bg-[#2a2420]/90 backdrop-blur-sm rounded border border-[#D4AF37]/30"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.12 + 0.35, duration: 0.4 }}
                                    >
                                        <span className="text-xs font-bold text-[#E6D8B8] uppercase tracking-wider">{letter.letter_name}</span>
                                    </motion.div>

                                    {/* Level number */}
                                    <motion.div
                                        className="mt-2 text-xs text-[#D4AF37]/50 font-serif"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.12 + 0.5 }}
                                    >
                                        स्तर {toHindiNum(index + 1)}
                                    </motion.div>
                                </motion.div>
                            )
                        })}
                    </div>
                    
                    {/* Temple Summit Achievement */}
                    {lastCompletedIndex === letters.length - 1 && (
                        <motion.div
                            className="absolute"
                            style={{
                                left: STEPS_START_X + (letters.length * STEP_WIDTH) - 100,
                                top: STEPS_START_Y - (letters.length * STEP_HEIGHT) - minY - 100  // Offset by minY
                            }}
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: "spring", delay: 0.5 }}
                        >
                            <div className="bg-gradient-to-r from-[#E69A47] to-[#D4AF37] text-[#1a1613] font-bold py-4 px-8 rounded-lg text-xl shadow-[0_0_40px_rgba(230,154,71,0.9)] border-2 border-[#F5F1E8]/50">
                                🕉️ Temple Mastered! 🕉️
                            </div>
                            <div className="text-center text-[#E6D8B8] text-sm mt-2">All Vowels Conquered</div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    )
}