'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getLoginStreak, type StreakData } from '@/lib/streak'

interface StreakDisplayProps {
    userId: string
    compact?: boolean
}

export default function StreakDisplay({ userId, compact = false }: StreakDisplayProps) {
    const [streak, setStreak] = useState<StreakData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStreak() {
            const data = await getLoginStreak(userId)
            setStreak(data)
            setLoading(false)
        }
        loadStreak()
    }, [userId])

    if (loading || !streak) return null

    if (compact) {
        return (
            <motion.div 
                className="relative w-16 h-16"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
            >
                {/* Sun Rays */}
                <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-1 h-5 bg-gradient-to-t from-[#E69A47] to-transparent origin-bottom"
                            style={{
                                transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                            }}
                        />
                    ))}
                </motion.div>

                {/* Sun Body */}
                <motion.div
                    className="absolute inset-0 m-2 rounded-full bg-gradient-to-br from-[#E69A47] to-[#D4AF37] shadow-[0_0_20px_rgba(230,154,71,0.6)] flex items-center justify-center"
                    animate={{ 
                        scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <span className="text-[#1a1613] text-lg font-bold">
                        {streak.currentStreak}
                    </span>
                </motion.div>

                {/* Glow Effect */}
                <div className="absolute inset-0 m-2 rounded-full bg-[#E69A47] opacity-30 blur-md" />
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#2a2420] to-[#1a1613] border-2 border-[#D4AF37]/30 rounded-xl p-4 shadow-lg"
        >
            <div className="flex items-center gap-3">
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="text-4xl"
                >
                    🔥
                </motion.div>
                
                <div>
                    <div className="text-[#E6D8B8] text-xs uppercase tracking-wider font-bold">
                        Daily Streak
                    </div>
                    <div className="text-[#D4AF37] text-2xl font-bold">
                        {streak.currentStreak} {streak.currentStreak === 1 ? 'Day' : 'Days'}
                    </div>
                    {streak.longestStreak > streak.currentStreak && (
                        <div className="text-[#E6D8B8]/60 text-xs mt-1">
                            Best: {streak.longestStreak} days
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
