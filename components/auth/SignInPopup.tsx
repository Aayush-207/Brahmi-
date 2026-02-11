'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SignInPopupProps {
  isVisible: boolean
  onClose: () => void
}

export default function SignInPopup({ isVisible, onClose }: SignInPopupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Use localhost in development. Prefer NEXT_PUBLIC_APP_URL in production if set.
      const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : (process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: new URL('/auth/callback', baseUrl).toString(),
        },
      })
      
      if (error) {
        setError(error.message)
      } else {
        onClose()
      }
    } catch (err) {
      setError('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gradient-to-br from-[#1a1613] to-[#2a2420] border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-8 mx-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#D4AF37]/20 rounded-full">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#D4AF37]">
                    Save Your Progress
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <p className="text-gray-300 mb-4">
                  Sign in to automatically save your learning progress and access your lessons from any device.
                </p>
                
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-medium">
                    <User className="w-4 h-4" />
                    <span>Continue learning without losing progress</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#1a1613] rounded-xl px-6 py-4 font-bold text-sm hover:scale-105 transition-all duration-300 shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#1a1613] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Continue as Guest */}
              <button
                onClick={onClose}
                className="w-full mt-3 text-gray-400 hover:text-white transition-colors text-sm py-2"
              >
                Continue as guest (progress won't be saved)
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}