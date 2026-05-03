'use client'

import { useState, useEffect } from 'react'
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SignInPopup from '@/components/auth/SignInPopup'

export function FloatingSignIn() {
  const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSignInPopup, setShowSignInPopup] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadIdentity = async () => {
      const currentIdentity = await getCurrentIdentity()
      setIdentity(currentIdentity)
      setIsLoaded(true)
    }
    loadIdentity()
  }, [])

  if (!isLoaded) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full animate-pulse" />
      </div>
    )
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowSignInPopup(true)}
          className="bg-gradient-to-r from-[#D4AF37]/90 to-[#C5A059]/90 backdrop-blur-sm border border-[#D4AF37]/40 text-[#1a1613] hover:from-[#D4AF37] hover:to-[#C5A059] rounded-full px-4 py-3 font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span className="hidden sm:block text-sm">Sign in to save progress</span>
          <span className="sm:hidden text-sm">Sign in</span>
        </button>
      </div>

      {/* Sign In Popup */}
      <SignInPopup
        isVisible={showSignInPopup}
        onClose={() => setShowSignInPopup(false)}
      />
    </>
  )
}