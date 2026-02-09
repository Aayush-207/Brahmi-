'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { COURSE_MODULES } from '@/lib/courseData'

// --- Layout Constants ---
const VERTICAL_GAP = 220     // Reduced for mobile density
const PADDING_TOP = 100
const SVG_WIDTH = 360        // Fits standard mobile width (360px)
const CENTER_X = 180         // Half of 360
const OFFSET = 45            // Slightly tighter organic curve

/**
 * Calculate (x, y) coordinates for the snake path
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
 * Generate smooth Bezier path
 */
function generateSVGPath(count: number): string {
    if (count < 2) return ''
    const points = Array.from({ length: count }, (_, i) => getPosition(i))
    let d = `M ${points[0].x} ${points[0].y}`

    for (let i = 0; i < count - 1; i++) {
        const current = points[i]
        const next = points[i + 1]
        const cp1x = current.x
        const cp1y = current.y + (VERTICAL_GAP * 0.5)
        const cp2x = next.x
        const cp2y = next.y - (VERTICAL_GAP * 0.5)
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`
    }
    return d
}

export default function LearnPage() {
    const router = useRouter()

    // In a real implementation, activeModuleIndex would come from DB
    // For now, let's say "Vowels" (Index 1) is active/in-progress
    const activeModuleIndex = 1
    const completedUpTo = 0 // Introduction is done

    return (
        // 1. ISOLATION: Explicit dark background, full height, no footer leakage
        <div className="min-h-screen w-full bg-[#1F1D3A] text-white flex flex-col items-center relative overflow-hidden font-sans">

            {/* 2. Header (Consistent with Vowels Page) */}
            <div className="w-full border-b border-[#D4AF37]/20 py-4 md:py-6 text-center bg-[#1F1D3A]/95 backdrop-blur-sm sticky top-0 z-50 px-4">
                <button onClick={() => router.push('/')} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    ← <span className="hidden sm:inline">Home</span>
                </button>
                <div className="text-[#6C7BAF] font-bold tracking-[0.2em] text-[10px] mb-1 uppercase">Ancient Echoes</div>
                <h1 className="text-2xl md:text-3xl font-serif text-white font-bold tracking-wide">Course Overview</h1>
            </div>

            {/* 3. Main Journey Container */}
            <div
                className="relative w-full max-w-[360px] mx-auto mt-4 pb-32"
                style={{ height: `${PADDING_TOP + (COURSE_MODULES.length * VERTICAL_GAP)}px` }}
            >
                {/* LAYER 0: The Path (Z-0) */}
                <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
                    viewBox={`0 0 ${SVG_WIDTH} ${PADDING_TOP + (COURSE_MODULES.length * VERTICAL_GAP)}`}
                    preserveAspectRatio="xMidYMin slice"
                >
                    {/* Path Glow Definition */}
                    <defs>
                        <filter id="path-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* The Path Line */}
                    <motion.path
                        d={generateSVGPath(COURSE_MODULES.length)}
                        fill="none"
                        stroke="#D4AF37"
                        strokeOpacity="0.3"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="10 10"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>

                {/* LAYER 1 & 2: Content */}
                {COURSE_MODULES.map((module, index) => {
                    const pos = getPosition(index)

                    // Logic: Even = Mascot Left, Odd = Mascot Right (Alternating)
                    const mascotSide = index % 2 === 0 ? 'left' : 'right'
                    const mascotImg = (index % 3) + 1

                    // State Logic
                    const isCompleted = index <= completedUpTo
                    const isLocked = module.locked === true

                    return (
                        <div
                            key={module.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                            style={{ left: pos.x, top: pos.y }}
                        >
                            {/* LAYER 1: Mascots (Z-10) */}
                            {/* Strictly anchored relative to node center. Closer offset for mobile. */}
                            <div
                                className={`absolute w-28 md:w-36 pointer-events-none z-10 opacity-80
                                    ${mascotSide === 'left' ? '-left-[110px] md:-left-[160px]' : '-right-[110px] md:-right-[160px]'}
                                `}
                            >
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 4,
                                        ease: "easeInOut",
                                        delay: index * 0.7 // Staggered float
                                    }}
                                >
                                    <Image
                                        src={`/assets/mascot_${mascotImg}.png`}
                                        alt=""
                                        width={120} height={120}
                                        className={`object-contain ${mascotSide === 'right' ? 'scale-x-[-1]' : ''} ${isLocked ? 'grayscale opacity-50' : ''}`}
                                    />
                                </motion.div>
                            </div>

                            {/* LAYER 2: Module Node (Z-20) */}
                            {isLocked ? (
                                <div className="z-20 group relative cursor-not-allowed outline-none">
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 + (index * 0.1), type: "spring" }}
                                        className="w-28 h-28 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center 
                                        transition-all duration-300 relative bg-[#1F1D3A]
                                        border-2 border-gray-600/40 shadow-[0_0_10px_rgba(100,100,100,0.1)]
                                        opacity-50"
                                    >
                                        {/* Lock Icon Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-[#1F1D3A]/80 rounded-full">
                                            <span className="text-4xl">🔒</span>
                                        </div>

                                        {/* Inner Character/Icon (Faded) */}
                                        <span className="text-4xl md:text-5xl mb-1 filter grayscale opacity-30">
                                            {module.icon}
                                        </span>
                                    </motion.div>

                                    {/* Hover Tooltip */}
                                    <div className="absolute top-[120px] md:top-[140px] left-1/2 -translate-x-1/2 w-56 md:w-64 text-center z-30 pointer-events-none">
                                        <h3 className="text-gray-500 font-bold text-lg md:text-xl leading-tight font-serif">
                                            {module.title}
                                        </h3>
                                        <p className="text-gray-600 text-[10px] uppercase tracking-[0.15em] mt-1 md:mt-2 font-bold">
                                            {module.subtitle}
                                        </p>
                                        {/* Development in Progress message on hover */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 bg-[#2C2C2C] text-amber-400 text-xs py-1.5 px-3 rounded-lg border border-amber-400/30">
                                            Development in progress
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link href={module.route} className="z-20 group relative cursor-pointer outline-none">
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 + (index * 0.1), type: "spring" }}
                                        className={`
                                        w-28 h-28 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center 
                                        transition-all duration-300 relative bg-[#1F1D3A]
                                        ${isCompleted
                                            ? 'border-4 border-[#E69138] shadow-[0_0_40px_rgba(230,145,56,0.3)]'
                                            : 'border-2 border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                                        }
                                        group-hover:scale-105 active:scale-95
                                    `}
                                    >
                                        {/* Inner Character/Icon */}
                                        <span className={`text-4xl md:text-5xl mb-1 filter drop-shadow-lg ${isCompleted ? 'text-[#E69138]' : 'text-white'}`}>
                                            {module.icon}
                                        </span>

                                        {/* Completion Check (Optional visual flair) */}
                                        {isCompleted && index === 0 && ( // Just showing logic potential
                                            <div className="absolute -bottom-2 w-8 h-8 bg-[#E69138] rounded-full flex items-center justify-center border-4 border-[#1F1D3A]">
                                                <span className="text-[#1F1D3A] text-xs font-bold">✓</span>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Text Label (Below) - Z-30 */}
                                    <div className="absolute top-[120px] md:top-[140px] left-1/2 -translate-x-1/2 w-56 md:w-64 text-center z-30 pointer-events-none">
                                        <h3 className="text-[#D4AF37] font-bold text-lg md:text-xl leading-tight group-hover:text-white transition-colors font-serif">
                                            {module.title}
                                        </h3>
                                        <p className="text-[#6C7BAF] text-[10px] uppercase tracking-[0.15em] mt-1 md:mt-2 font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                                            {module.subtitle}
                                        </p>
                                    </div>
                                </Link>
                            )}

                        </div>
                    )
                })}
            </div>

            {/* NO FOOTER HERE */}
        </div>
    )
}
