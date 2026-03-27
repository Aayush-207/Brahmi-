'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface StreakCelebrationProps {
    show: boolean
    streakCount: number
    onClose: () => void
}

export default function StreakCelebration({ show, streakCount, onClose }: StreakCelebrationProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000)
            return () => clearTimeout(timer)
        }
    }, [show, onClose])

    const getMessage = () => {
        if (streakCount === 1) return "Welcome back! 🎉"
        if (streakCount === 7) return "One Week Streak! 🔥"
        if (streakCount === 30) return "30 Days! Amazing! 🌟"
        if (streakCount === 100) return "Century! Legendary! 👑"
        if (streakCount % 10 === 0) return `${streakCount} Days! Keep going! 💪`
        return `${streakCount} Day Streak! 🔥`
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.5, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.5, y: 50 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="bg-gradient-to-br from-[#E69A47] to-[#D4AF37] rounded-2xl p-8 text-center shadow-2xl max-w-md mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            animate={{ 
                                scale: [1, 1.3, 1],
                                rotate: [0, 360]
                            }}
                            transition={{ duration: 1 }}
                            className="text-6xl mb-4"
                        >
                            🔥
                        </motion.div>
                        
                        <h2 className="text-3xl font-bold text-[#1a1613] mb-2">
                            {getMessage()}
                        </h2>
                        
                        <p className="text-[#2a2420] font-medium">
                            You're on a roll! Keep learning every day.
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
