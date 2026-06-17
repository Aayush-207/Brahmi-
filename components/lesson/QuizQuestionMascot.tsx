'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

type QuizQuestionMascotProps = {
  className?: string
}

export default function QuizQuestionMascot({ className = '' }: QuizQuestionMascotProps) {
  return (
    <div
      className={`pointer-events-none absolute top-0 right-0 z-10 -translate-x-2 -translate-y-4 sm:-translate-x-6 sm:-translate-y-8 ${className}`}
      aria-hidden="true"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image
          src="/mascot/bramhi_surprised_no_bg.png"
          alt=""
          width={80}
          height={80}
          className="h-12 w-12 sm:h-14 sm:w-14 md:h-20 md:w-20 object-contain drop-shadow-md"
          priority
        />
      </motion.div>
    </div>
  )
}
