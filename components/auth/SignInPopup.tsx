'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { getAppBaseUrl } from '@/lib/siteUrl'

interface SignInPopupProps {
  isVisible: boolean
  onClose: () => void
}

export default function SignInPopup({ isVisible, onClose }: SignInPopupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        setError('Google sign-in is not configured on this deployment yet.')
        setIsLoading(false)
        return
      }
      const appBaseUrl = getAppBaseUrl()
      const redirectTo = `${appBaseUrl}/auth/callback?next=${encodeURIComponent(window.location.pathname + window.location.search)}`
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo }
      })

      if (signInError) {
        throw signInError
      }
    } catch (err) {
      console.error('Google sign-in failed:', err)
      setError('Google sign-in failed. Please try again.')
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-2000 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="fixed inset-0 z-2001 flex items-center justify-center overflow-hidden px-3 py-3 sm:px-6"
          >
            <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-linear-to-br from-[#2a2420] to-[#1a1613] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#D4AF37] leading-tight">Save Your Progress</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 ml-auto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="text-center mb-4 sm:mb-5">
                <p className="text-sm sm:text-base text-gray-300 leading-6">
                  Sign in to automatically save your learning progress and access your lessons from any device.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-3 rounded-lg mb-4 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-linear-to-r from-[#D4AF37] to-[#C5A059] text-[#1a1613] rounded-xl px-5 py-3.5 font-bold text-sm hover:scale-105 transition-all duration-300 shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#1a1613] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.652 32.657 29.397 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.967 3.039l5.657-5.657C34.533 6.053 29.612 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.967 3.039l5.657-5.657C34.533 6.053 29.612 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                      <path fill="#4CAF50" d="M24 44c5.515 0 10.332-1.835 14.156-4.977l-6.531-5.52C29.54 35.497 26.951 36 24 36c-5.379 0-9.624-3.322-11.286-7.918l-6.52 5.02C9.505 40.556 16.179 44 24 44z"/>
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.19 3.347-3.71 5.975-6.678 7.503l.002-.001 6.531 5.52C34.69 40.96 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Continue as Guest */}
              <button
                onClick={onClose}
                className="w-full mt-2.5 text-gray-400 hover:text-white transition-colors text-sm py-2"
              >
                Continue as guest
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    , document.body)
}