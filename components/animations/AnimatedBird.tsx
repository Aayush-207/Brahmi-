'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedBirdProps {
    delay?: number
    duration?: number
    color?: 'golden' | 'orange' | 'brown'
    size?: 'sm' | 'md' | 'lg'
    startX?: number
    startY?: number
}

export function AnimatedBird({ 
    delay = 0, 
    duration = 15, 
    color = 'golden',
    size = 'md',
    startX = -100,
    startY = 20
}: AnimatedBirdProps) {
    
    const colorMap = {
        golden: '#D4AF37',
        orange: '#E69A47',
        brown: '#8B7355'
    }
    
    const sizeMap = {
        sm: 24,
        md: 32,
        lg: 40
    }
    
    const birdSize = sizeMap[size]
    const birdColor = colorMap[color]
    
    const [screenWidth, setScreenWidth] = useState<number | null>(typeof window !== 'undefined' ? window.innerWidth : null)

    useEffect(() => {
        const update = () => setScreenWidth(window.innerWidth)
        if (typeof window !== 'undefined') {
            update()
            window.addEventListener('resize', update)
            return () => window.removeEventListener('resize', update)
        }
    }, [])

    return (
        <motion.div
            className="absolute pointer-events-none z-5"
            initial={{ x: startX, y: startY, opacity: 0 }}
            animate={{
                x: [startX, (screenWidth ?? startX) + 100],
                y: [
                    startY,
                    startY - 30,
                    startY - 10,
                    startY - 40,
                    startY - 20,
                    startY - 50,
                    startY - 30
                ],
                opacity: [0, 1, 1, 1, 1, 1, 0]
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                repeatDelay: Math.random() * 5,
                ease: "linear"
            }}
        >
            <svg 
                width={birdSize} 
                height={birdSize} 
                viewBox="0 0 32 32" 
                fill="none"
                className="drop-shadow-lg"
            >
                {/* Animated wings */}
                <motion.path
                    d="M16 16 Q8 10, 4 12"
                    stroke={birdColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    animate={{
                        d: [
                            "M16 16 Q8 10, 4 12",
                            "M16 16 Q8 14, 4 16",
                            "M16 16 Q8 10, 4 12"
                        ]
                    }}
                    transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.path
                    d="M16 16 Q24 10, 28 12"
                    stroke={birdColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    animate={{
                        d: [
                            "M16 16 Q24 10, 28 12",
                            "M16 16 Q24 14, 28 16",
                            "M16 16 Q24 10, 28 12"
                        ]
                    }}
                    transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                {/* Body */}
                <circle cx="16" cy="16" r="3" fill={birdColor} opacity="0.9" />
                {/* Head */}
                <circle cx="18" cy="14" r="2" fill={birdColor} />
            </svg>
        </motion.div>
    )
}

export function AnimatedBirds() {
    return (
        <>
            <AnimatedBird delay={0} duration={20} color="golden" size="md" startY={10} />
            <AnimatedBird delay={5} duration={18} color="orange" size="sm" startY={30} />
            <AnimatedBird delay={10} duration={22} color="brown" size="md" startY={50} />
            <AnimatedBird delay={15} duration={19} color="golden" size="lg" startY={70} />
            <AnimatedBird delay={8} duration={21} color="orange" size="md" startY={15} />
        </>
    )
}
