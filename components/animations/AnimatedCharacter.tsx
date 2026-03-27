'use client'

import { motion } from 'framer-motion'

interface AnimatedCharacterProps {
    type?: 'celebrating' | 'reading' | 'waving' | 'thinking'
    position?: 'left' | 'right' | 'center'
    size?: 'sm' | 'md' | 'lg'
    delay?: number
}

export function AnimatedCharacter({ 
    type = 'celebrating', 
    position = 'left',
    size = 'md',
    delay = 0
}: AnimatedCharacterProps) {
    
    const sizeMap = {
        sm: 60,
        md: 80,
        lg: 100
    }
    
    const positionMap = {
        left: 'left-8',
        right: 'right-8',
        center: 'left-1/2 -translate-x-1/2'
    }
    
    const characterSize = sizeMap[size]
    
    return (
        <motion.div
            className={`absolute bottom-24 ${positionMap[position]} pointer-events-none z-10`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.6, type: "spring" }}
        >
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: type === 'waving' ? [0, 5, -5, 0] : 0
                }}
                transition={{
                    duration: type === 'waving' ? 2 : 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {type === 'celebrating' && (
                    <CelebratingCharacter size={characterSize} />
                )}
                {type === 'reading' && (
                    <ReadingCharacter size={characterSize} />
                )}
                {type === 'waving' && (
                    <WavingCharacter size={characterSize} />
                )}
                {type === 'thinking' && (
                    <ThinkingCharacter size={characterSize} />
                )}
            </motion.div>
        </motion.div>
    )
}

function CelebratingCharacter({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            {/* Body */}
            <circle cx="50" cy="40" r="18" fill="#E6D8B8" />
            <ellipse cx="50" cy="70" rx="20" ry="25" fill="#D4AF37" />
            
            {/* Head */}
            <circle cx="50" cy="25" r="15" fill="#E69A47" />
            
            {/* Eyes - happy */}
            <circle cx="45" cy="23" r="2" fill="#1a1613" />
            <circle cx="55" cy="23" r="2" fill="#1a1613" />
            
            {/* Smile */}
            <path d="M45 28 Q50 32, 55 28" stroke="#1a1613" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Arms raised */}
            <motion.path
                d="M35 45 L25 35"
                stroke="#E6D8B8"
                strokeWidth="5"
                strokeLinecap="round"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ originX: '35px', originY: '45px' }}
            />
            <motion.path
                d="M65 45 L75 35"
                stroke="#E6D8B8"
                strokeWidth="5"
                strokeLinecap="round"
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ originX: '65px', originY: '45px' }}
            />
            
            {/* Legs */}
            <path d="M45 90 L45 95" stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
            <path d="M55 90 L55 95" stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
            
            {/* Sparkles */}
            <motion.text
                x="20"
                y="30"
                fontSize="16"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
            >
                ✨
            </motion.text>
            <motion.text
                x="70"
                y="30"
                fontSize="16"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            >
                ✨
            </motion.text>
        </svg>
    )
}

function ReadingCharacter({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            {/* Body */}
            <circle cx="50" cy="45" r="18" fill="#E6D8B8" />
            <ellipse cx="50" cy="75" rx="20" ry="25" fill="#8B7355" />
            
            {/* Head - looking down */}
            <circle cx="50" cy="30" r="15" fill="#E69A47" />
            
            {/* Eyes - looking down */}
            <circle cx="45" cy="32" r="2" fill="#1a1613" />
            <circle cx="55" cy="32" r="2" fill="#1a1613" />
            
            {/* Focused mouth */}
            <line x1="47" y1="36" x2="53" y2="36" stroke="#1a1613" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Arms holding book */}
            <path d="M35 50 L40 60" stroke="#E6D8B8" strokeWidth="5" strokeLinecap="round" />
            <path d="M65 50 L60 60" stroke="#E6D8B8" strokeWidth="5" strokeLinecap="round" />
            
            {/* Book */}
            <rect x="35" y="55" width="30" height="20" rx="2" fill="#D4AF37" stroke="#8B7355" strokeWidth="2" />
            <line x1="50" y1="55" x2="50" y2="75" stroke="#8B7355" strokeWidth="1" />
            <line x1="38" y1="62" x2="47" y2="62" stroke="#8B7355" strokeWidth="0.5" />
            <line x1="38" y1="68" x2="47" y2="68" stroke="#8B7355" strokeWidth="0.5" />
            
            {/* Legs */}
            <path d="M45 95 L45 100" stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
            <path d="M55 95 L55 100" stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
        </svg>
    )
}

function WavingCharacter({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            {/* Body */}
            <circle cx="50" cy="45" r="18" fill="#E6D8B8" />
            <ellipse cx="50" cy="75" rx="20" ry="25" fill="#E69A47" />
            
            {/* Head */}
            <circle cx="50" cy="28" r="15" fill="#D4AF37" />
            
            {/* Eyes - friendly */}
            <circle cx="45" cy="26" r="2" fill="#1a1613" />
            <circle cx="55" cy="26" r="2" fill="#1a1613" />
            
            {/* Smile */}
            <path d="M43 32 Q50 35, 57 32" stroke="#1a1613" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Left arm down */}
            <path d="M35 50 L30 65" stroke="#E6D8B8" strokeWidth="5" strokeLinecap="round" />
            
            {/* Right arm waving */}
            <motion.path
                d="M65 45 L75 30"
                stroke="#E6D8B8"
                strokeWidth="5"
                strokeLinecap="round"
                animate={{ rotate: [-15, 15, -15] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{ originX: '65px', originY: '45px' }}
            />
            
            {/* Hand waving */}
            <motion.circle
                cx="78"
                cy="25"
                r="4"
                fill="#E6D8B8"
                animate={{ x: [-2, 2, -2], y: [-2, 2, -2] }}
                transition={{ duration: 0.4, repeat: Infinity }}
            />
            
            {/* Legs */}
            <path d="M45 95 L45 100" stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
            <path d="M55 95 L55 100" stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
        </svg>
    )
}

function ThinkingCharacter({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            {/* Body */}
            <circle cx="50" cy="48" r="18" fill="#E6D8B8" />
            <ellipse cx="50" cy="78" rx="20" ry="25" fill="#8B7355" />
            
            {/* Head */}
            <circle cx="50" cy="30" r="15" fill="#E69A47" />
            
            {/* Eyes - thoughtful */}
            <circle cx="45" cy="28" r="2" fill="#1a1613" />
            <circle cx="55" cy="28" r="2" fill="#1a1613" />
            
            {/* Thinking mouth */}
            <path d="M45 35 L55 34" stroke="#1a1613" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Arm to chin */}
            <path d="M60 50 Q65 40, 55 35" stroke="#E6D8B8" strokeWidth="5" strokeLinecap="round" />
            
            {/* Other arm */}
            <path d="M38 50 L33 65" stroke="#E6D8B8" strokeWidth="5" strokeLinecap="round" />
            
            {/* Thought bubble */}
            <motion.g
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <circle cx="75" cy="20" r="8" fill="#D4AF37" opacity="0.6" />
                <circle cx="70" cy="28" r="4" fill="#D4AF37" opacity="0.5" />
                <circle cx="66" cy="32" r="2" fill="#D4AF37" opacity="0.4" />
                <text x="70" y="24" fontSize="10" textAnchor="middle">?</text>
            </motion.g>
            
            {/* Legs */}
            <path d="M45 98 L45 103" stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
            <path d="M55 98 L55 103" stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
        </svg>
    )
}

export function DuolingoCharacters() {
    return (
        <>
            <AnimatedCharacter type="celebrating" position="left" size="md" delay={0} />
            <AnimatedCharacter type="reading" position="right" size="sm" delay={0.3} />
        </>
    )
}
