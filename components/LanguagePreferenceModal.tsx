'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Globe, Languages } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

const LANGUAGE_SELECTION_KEY = 'brahmi_language_selected'

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'hi', label: 'हिन्दी' },
] as const

export default function LanguagePreferenceModal() {
  const { language, setLanguage, markLanguageSelected } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 640)

    updateViewport()

    try {
      const hasPreference = localStorage.getItem(LANGUAGE_SELECTION_KEY) === 'true'
      const savedLanguage = localStorage.getItem('language')

      if (!hasPreference && !savedLanguage) {
        const timer = window.setTimeout(() => setIsOpen(true), 2500)
        return () => window.clearTimeout(timer)
      }
    } catch {
      const timer = window.setTimeout(() => setIsOpen(true), 2500)
      return () => window.clearTimeout(timer)
    }
  }, [])

  const chooseLanguage = (nextLanguage: typeof language) => {
    setLanguage(nextLanguage)
    markLanguageSelected()
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            className="fixed inset-x-0 top-1/2 z-101 mx-auto w-[min(94vw,560px)] -translate-y-1/2 px-3 sm:px-4"
          >
            <div className="overflow-hidden rounded-2xl sm:rounded-[28px] border border-[#D4AF37]/25 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),rgba(26,22,19,0.98)_50%)] shadow-2xl shadow-black/60">
              <div className="flex items-start gap-3 border-b border-white/10 px-4 py-4 sm:px-6 sm:pt-6 sm:pb-4">
                <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] ${isMobile ? 'h-10 w-10' : 'h-12 w-12'}`}>
                  <Globe size={isMobile ? 18 : 22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#E6D8B8]/70">
                    Choose your language
                  </p>
                  <h2 className="mt-1.5 text-lg font-bold text-[#F5E8C8] sm:mt-2 sm:text-3xl">
                    Start in the language you prefer
                  </h2>
                </div>
              </div>

              <div className="px-4 py-4 sm:px-8 sm:py-6">
                <p className="max-w-lg text-sm leading-5 text-[#E6D8B8]/80 sm:text-base sm:leading-6">
                  Pick a language once. Your choice will be saved and the site will open in that language next time, while the top dropdown stays available for later changes.
                </p>

                <div className="mt-4 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
                  {languageOptions.map((option) => {
                    const isActive = language === option.value

                    return (
                      <button
                        key={option.value}
                        onClick={() => chooseLanguage(option.value)}
                        className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-left transition-all duration-300 sm:px-4 sm:py-4 ${
                          isActive
                            ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F5E8C8] shadow-lg shadow-[#D4AF37]/10'
                            : 'border-white/10 bg-white/5 text-[#E6D8B8]/90 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10'
                        }`}
                      >
                        <span className="text-sm font-semibold sm:text-base">{option.label}</span>
                        {isActive ? (
                          <Check size={isMobile ? 16 : 18} className="text-[#D4AF37]" />
                        ) : (
                          <Languages size={isMobile ? 16 : 18} className="text-[#E6D8B8]/60" />
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-[11px] text-[#E6D8B8]/70 sm:mt-6 sm:px-4 sm:text-xs">
                  <span>Current language: {languageOptions.find((option) => option.value === language)?.label || 'English'}</span>
                  <button
                    onClick={() => {
                      markLanguageSelected()
                      setIsOpen(false)
                    }}
                    className="font-semibold text-[#D4AF37] transition-colors hover:text-[#E6D8B8]"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}