'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface SignInPopupProps {
  isVisible: boolean
  onClose: () => void
}

export default function SignInPopup({ isVisible, onClose }: SignInPopupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = getSupabaseBrowserClient()
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname + window.location.search)}`
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
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-linear-to-br from-[#2a2420] to-[#1a1613] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                <h2 className="text-2xl font-bold text-[#D4AF37]">Save Your Progress</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 ml-auto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <p className="text-gray-300 mb-4">
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
                className="w-full flex items-center justify-center gap-3 bg-linear-to-r from-[#D4AF37] to-[#C5A059] text-[#1a1613] rounded-xl px-6 py-4 font-bold text-sm hover:scale-105 transition-all duration-300 shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                Continue as guest
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}