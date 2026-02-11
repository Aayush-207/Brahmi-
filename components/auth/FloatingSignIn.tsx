'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity'
import { User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SignInPopup from '@/components/auth/SignInPopup'

export function FloatingSignIn() {
  const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSignInPopup, setShowSignInPopup] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const loadIdentity = async () => {
      const currentIdentity = await getCurrentIdentity()
      setIdentity(currentIdentity)
      setIsLoaded(true)
      
      // Get user data if authenticated
      if (currentIdentity.type === 'user') {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      }
    }
    loadIdentity()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        setIdentity({ type: 'user', id: session.user.id })
        setShowSignInPopup(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        const currentIdentity = await getCurrentIdentity()
        setIdentity(currentIdentity)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

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
        {identity.type === 'user' && user ? (
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#1a1613]/90 to-[#2a2420]/90 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full px-4 py-2 shadow-lg">
            {/* User Info */}
            <div className="flex items-center gap-2">
              <img
                src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-[#D4AF37]/30"
              />
              <span className="text-sm text-gray-300 font-medium hidden sm:block">
                {user.user_metadata?.full_name?.split(' ')[0] || 'User'}
              </span>
            </div>
            
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Sign In Button for Guests */
          <button
            onClick={() => setShowSignInPopup(true)}
            className="bg-gradient-to-r from-[#D4AF37]/90 to-[#C5A059]/90 backdrop-blur-sm border border-[#D4AF37]/40 text-[#1a1613] hover:from-[#D4AF37] hover:to-[#C5A059] rounded-full px-4 py-3 font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:block text-sm">Sign in to save progress</span>
            <span className="sm:hidden text-sm">Sign in</span>
          </button>
        )}
      </div>

      {/* Sign In Popup */}
      <SignInPopup
        isVisible={showSignInPopup}
        onClose={() => setShowSignInPopup(false)}
      />
    </>
  )
}