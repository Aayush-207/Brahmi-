'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserProgress } from '@/lib/progress'
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

// --- Types ---
type Letter = {
    id: string
    letter_name: string
    brahmi_symbol: string
    order_no: number
}

// --- Layout Constants ---
const VERTICAL_GAP = 180    // Vertical spacing between nodes
const PADDING_TOP = 100     // Initial top padding
const SVG_WIDTH = 400       // Virtual coordinate width
const CENTER_X = 200        // Center axis
const OFFSET = 80           // Gentler curves (was 120/90)

/**
 * Calculate the (x, y) position for a specific lesson node.
 * Uses a 4-step cycle: Center -> Right -> Center -> Left
 */
function getPosition(index: number) {
    const cycle = index % 4
    let x = CENTER_X

    if (cycle === 1) x = CENTER_X + OFFSET // Right
    if (cycle === 3) x = CENTER_X - OFFSET // Left

    const y = PADDING_TOP + (index * VERTICAL_GAP)
    return { x, y }
}

/**
 * Generate path segments for individual animation
 */
function generatePathSegments(count: number): string[] {
    const segments: string[] = []
    const positions = Array.from({ length: count }, (_, i) => getPosition(i))

    for (let i = 0; i < count - 1; i++) {
        const from = positions[i]
        const to = positions[i + 1]

        // Control points for smooth vertical entry/exit
        const cp1x = from.x
        const cp1y = from.y + (VERTICAL_GAP * 0.5)

        const cp2x = to.x
        const cp2y = to.y - (VERTICAL_GAP * 0.5)

        segments.push(
            `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`
        )
    }

    return segments
}

/**
 * Generate a smooth cubic bezier path connecting all nodes.
 */
function generateSVGPath(count: number): string {
    if (count < 2) return ''
    const segments = generatePathSegments(count)

    // Join segments: Start with Move (M), then append Curves (C)
    // We can just join them, as M commands re-position the "pen" harmlessly to the same spot
    return segments.join(' ')
}


export default function LettersPage() {
    // --- State ---
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
    const [isLoaded, setIsLoaded] = useState(false)
    const [letters, setLetters] = useState<Letter[]>([])
    const [loading, setLoading] = useState(true)

    const [completedIds, setCompletedIds] = useState<string[]>([])
    // animatingIndex: The index of the path segment being animated
    // If Lesson 0 is just completed, we animate segment 0 (L0 -> L1)
    const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
    const [showCelebration, setShowCelebration] = useState(false)

    // Derived state
    const lastCompletedLetter = letters.filter(l => completedIds.includes(l.id)).sort((a, b) => b.order_no - a.order_no)[0]
    const lastCompletedIndex = lastCompletedLetter ? letters.findIndex(l => l.id === lastCompletedLetter.id) : -1

    const router = useRouter()
    const supabase = createClient()

    // --- Effects ---

    // 1. Load User Identity
    useEffect(() => {
        const loadIdentity = async () => {
            const currentIdentity = await getCurrentIdentity()
            setIdentity(currentIdentity)
            setIsLoaded(true)
            
            // Require authentication for lessons
            if (currentIdentity.type === 'none' || currentIdentity.type === 'guest') {
                router.push('/login')
            }
        }
        loadIdentity()
    }, [router])

    // 2. Fetch Letters (VOWELS ONLY)
    useEffect(() => {
        async function fetchLetters() {
            const { data, error } = await supabase
                .from('letters')
                .select('*')
                .eq('letter_type', 'vowel') // STRICT FILTER
                .order('order_no', { ascending: true })

            if (!error) setLetters(data || [])
            setLoading(false)
        }
        fetchLetters()
    }, [])

    // 3. Fetch Progress & Handle New Completions (Via URL Params)
    // We use a URL parameter '?completed=ID' to robustly detect when to animate.
    useEffect(() => {
        if (!isLoaded || letters.length === 0) return

        async function fetchProgress() {
            const { completedIds: fetchedIds } = await getUserProgress(identity)
            setCompletedIds(fetchedIds)

            // Check URL for completion flag
            // Note: We need to use useSearchParams() but for now accessing via window (or router state if complex) is tricky in minimal setup?
            // Safer: Just assume standard Next.js SearchParams availability.
            // Since we are in client component, let's parse window.location.search directly or import useSearchParams.
            // Let's use simple window check to avoid adding hooks if possible, or better adds `useSearchParams`.
        }

        fetchProgress()
    }, [isLoaded, letters.length, identity.type, identity.id])

    // Animation Trigger via Search Params
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const justCompletedId = searchParams ? searchParams.get('completed') : null

    useEffect(() => {
        if (justCompletedId && letters.length > 0 && completedIds.length > 0) {
            // Check if this ID is actually done (sanity check)
            if (completedIds.includes(justCompletedId)) {
                const letter = letters.find(l => l.id === justCompletedId)
                if (letter) {
                    const idx = letters.findIndex(l => l.id === letter.id)
                    // Animate segment starting from this index
                    if (idx < letters.length - 1) {
                        setAnimatingIndex(idx)

                        // Clear param after animation started so it doesn't loop on refresh? 
                        // Actually router.replace is good.
                        setTimeout(() => {
                            setShowCelebration(true)

                            setTimeout(() => {
                                setShowCelebration(false)
                                setAnimatingIndex(null)
                                // Clean up URL
                                router.replace('/letters', { scroll: false })
                            }, 2000)
                        }, 1000)
                    }
                }
            }
        }
    }, [justCompletedId, letters, completedIds, router])


    if (loading) return <div className="min-h-screen bg-[#1F1D3A] flex items-center justify-center text-[#D4AF37]">Loading...</div>


    // --- Path Logic ---
    // If I have completed Index 0. 
    // I want Segment 0 (L0->L1) to be SOLID.
    // So solid segments = lastCompletedIndex + 1? No.
    // If L0 is done. lastCompletedIndex = 0.
    // We want segment 0 to be solid. 
    // So solidLimit = 1 (slice(0,1) -> [0]).

    // BUT if we are actively animating Segment 0.
    // We want solidLimit = 0.

    let solidLimit = lastCompletedIndex
    // WAIT. Logic check:
    // If L0 is done. CompletedIds=['id_0']. lastCompletedIndex=0.
    // Next unlocked is L1.
    // Path L0->L1 should be solid.
    // That is segment index 0.
    // So if lastCompletedIndex=0, we want solid up to index 0 (inclusive of segment index).
    // slice(0, solidLimit).
    // slice(0, 1) returns [0].
    // So solidLimit = lastCompletedIndex + 1? -> 1. Correct.

    // Correction: If L0 is NOT done (-1). solidLimit = 0. Correct.

    solidLimit = lastCompletedIndex + 1

    if (animatingIndex !== null) {
        // If animating segment N. We want segments 0 to N-1 to be solid.
        // So solidLimit = N.
        solidLimit = animatingIndex
    }

    // Bounds check
    if (solidLimit > letters.length - 1) solidLimit = letters.length - 1
    if (solidLimit < 0) solidLimit = 0


    return (
        <div className="min-h-screen bg-[#1F1D3A] text-white overflow-hidden flex flex-col items-center">
            {/* Header */}
            <div className="w-full border-b border-[#D4AF37]/20 py-6 text-center bg-[#1F1D3A]/95 backdrop-blur-sm sticky top-0 z-50">
                <button onClick={() => router.push('/learn')} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                    ← Back
                </button>
                <div className="text-[#6C7BAF] font-bold tracking-[0.2em] text-xs mb-2 uppercase">Journey</div>
                <h1 className="text-3xl font-serif text-white font-bold">Vowels</h1>
            </div>

            {/* Journey Container */}
            <div
                className="relative w-full max-w-[400px] mx-auto mt-12 pb-40"
                style={{ height: `${PADDING_TOP + (letters.length * VERTICAL_GAP)}px` }}
            >

                {/* --- LAYER 0: SVG PATHS (Z-0) --- */}
                <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
                    viewBox={`0 0 ${SVG_WIDTH} ${PADDING_TOP + (letters.length * VERTICAL_GAP)}`}
                    preserveAspectRatio="xMidYMin slice"
                >
                    {/* Background Dashed Path */}
                    <path
                        d={generateSVGPath(letters.length)}
                        fill="none"
                        stroke="#D4AF37"
                        strokeOpacity="0.3"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                    />

                    {/* Progress Solid Path */}
                    {solidLimit > 0 && (
                        <path
                            d={generatePathSegments(letters.length).slice(0, solidLimit).join(' ')}
                            fill="none"
                            stroke="#D4AF37"
                            strokeOpacity="1"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Animated Segment */}
                    <AnimatePresence>
                        {animatingIndex !== null && (
                            <motion.path
                                key={`anim-path-${animatingIndex}`}
                                d={generatePathSegments(letters.length)[animatingIndex]}
                                fill="none"
                                stroke="#E69138" // Saffron accent
                                strokeWidth="8"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            />
                        )}
                    </AnimatePresence>
                </svg>


                {/* --- LAYER 1 & 2: MASCOTS & NODES --- */}
                {letters.map((letter, index) => {
                    const pos = getPosition(index)

                    const isCompleted = completedIds.includes(letter.id)
                    // If no lessons completed, index 0 is active.
                    // If X completed, X+1 is active.
                    // "lastCompletedIndex" is index of Completed X.
                    let isNext = (lastCompletedIndex === -1 && index === 0) || (index === lastCompletedIndex + 1)

                    // FORCE UNLOCK: All lessons are accessible.
                    let isLocked = false

                    const isCelebrating = showCelebration && (index === animatingIndex)

                    // DELAYED UNLOCK:
                    // If we are currently animating the path to this node, keep it LOCKED until animation finishes.
                    // animatingIndex is the index of the "Source" node.
                    // If animatingIndex = 0 (L0->L1). We want L1 (Index 1) to stay locked.
                    if (animatingIndex !== null && index === animatingIndex + 1) {
                        isNext = false
                        isLocked = true
                    }

                    // Visual Styles
                    let nodeClass = "relative w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-300 z-20 "
                    if (isCompleted || isCelebrating) {
                        nodeClass += "bg-[#E69138] border-[#FFD6A5] text-white shadow-[0_0_20px_rgba(230,145,56,0.5)]"
                    } else if (isNext) {
                        nodeClass += "bg-[#D4AF37] border-white text-white animate-pulse shadow-[0_0_30px_rgba(212,175,55,0.6)] scale-110"
                    } else {
                        // Unlocked but not active/completed (Standard State)
                        // Removed grayscale, made it inviting but neutral
                        nodeClass += "bg-[#1F1D3A] border-[#D4AF37]/50 text-[#D4AF37] hover:border-[#D4AF37] hover:scale-105"
                    }

                    // Mascot Logic
                    // Show on ODD indices (1, 3, 5) to alternate with the timeline curves
                    // If Node is Right (Index 1), Place Mascot Left.
                    // If Node is Left (Index 3), Place Mascot Right.
                    const showMascot = (index % 2 !== 0 && index !== letters.length - 1)
                    const side = (index % 4 === 1) ? 'left' : 'right'

                    const mascotImg = (index % 3) + 1

                    return (
                        <div
                            key={letter.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                            style={{ left: pos.x, top: pos.y }}
                        >

                            {/* LAYER 1: Mascot (Z-10) */}
                            {showMascot && (
                                <div className={`absolute w-32 pointer-events-none z-10 ${side === 'left' ? '-left-40' : '-right-40'}`}>
                                    <Image
                                        src={`/assets/mascot_${mascotImg}.png`}
                                        alt="Mascot"
                                        width={128} height={128}
                                        className={`object-contain transition-transform hover:scale-110 ${side === 'right' ? 'scale-x-[-1]' : ''}`}
                                    />
                                </div>
                            )}

                            {/* LAYER 2: Node (Z-20) */}
                            <Link href={isLocked ? '#' : `/lesson/${letter.id}`} className={`${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} z-20`}>
                                <div className={nodeClass}>
                                    <span className="text-3xl font-serif font-bold">{letter.brahmi_symbol}</span>
                                    
                                    {/* Completion Checkmark */}
                                    {isCompleted && (
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center border-4 border-[#1F1D3A] shadow-lg z-50">
                                            <span className="text-white text-base font-bold">✓</span>
                                        </div>
                                    )}
                                </div>

                                {/* Start Bubble (Only on Next/Active) */}
                                {isNext && (
                                    <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-[#E69138] border-2 border-[#FFD6A5] px-4 py-1 rounded-xl text-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] animate-bounce z-40 whitespace-nowrap">
                                        <span className="text-white font-black text-xs uppercase tracking-widest">Start</span>
                                        <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#E69138] border-b-2 border-r-2 border-[#FFD6A5] rotate-45"></div>
                                    </div>
                                )}

                                {/* LAYER 3: Text Label (Z-30) */}
                                {/* Added Background Pill for legibility over path */}
                                <div className="absolute top-[85px] left-1/2 -translate-x-1/2 mt-2 bg-[#1F1D3A] px-3 py-1 rounded-full border border-[#D4AF37]/30 z-30 whitespace-nowrap shadow-lg">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${isLocked ? 'text-gray-500' : 'text-[#D4AF37]'}`}>
                                        {letter.letter_name}
                                    </span>
                                </div>
                            </Link>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}
