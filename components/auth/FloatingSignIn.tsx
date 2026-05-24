'use client'

import { useState, useEffect } from 'react'
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SignInPopup from '@/components/auth/SignInPopup'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { getAvatarUrl } from '@/lib/getAvatarUrl'
import Image from 'next/image'

export function FloatingSignIn() {
  const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSignInPopup, setShowSignInPopup] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadIdentity = async () => {
      const currentIdentity = await getCurrentIdentity()
      setIdentity(currentIdentity)

      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        const { data } = await supabase.auth.getUser()
        const user = data.user
        if (user) {
          setAvatarUrl(getAvatarUrl(user))
          setUserName(
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email ||
            'User'
          )
        } else {
          setAvatarUrl(null)
          setUserName(null)
        }
      }
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
        {identity.type === 'user' ? (
          <div className="flex items-center gap-3 rounded-full border border-[#D4AF37]/30 bg-[#2a2420]/95 px-3 py-2 shadow-xl shadow-black/20 backdrop-blur-sm">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={userName || 'User'}
                width={34}
                height={34}
                className="h-8 w-8 rounded-full border border-[#D4AF37]/40 object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-sm">
                {(userName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block min-w-0">
              <div className="max-w-35 truncate text-sm font-semibold text-[#E6D8B8]">{userName || 'Signed in'}</div>
              <button
                onClick={async () => {
                  const supabase = getSupabaseBrowserClient()
                  if (supabase) {
                    await supabase.auth.signOut()
                  }
                  const nextIdentity = await getCurrentIdentity()
                  setIdentity(nextIdentity)
                  setAvatarUrl(null)
                  setUserName(null)
                  router.refresh()
                }}
                className="text-[10px] uppercase tracking-wider text-[#D4AF37] hover:text-[#E69A47]"
              >
                Sign out
              </button>
            </div>
            <button
              onClick={async () => {
                const supabase = getSupabaseBrowserClient()
                if (supabase) {
                  await supabase.auth.signOut()
                }
                const nextIdentity = await getCurrentIdentity()
                setIdentity(nextIdentity)
                setAvatarUrl(null)
                setUserName(null)
                router.refresh()
              }}
              className="sm:hidden rounded-full p-2 text-[#E6D8B8] hover:bg-white/10"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSignInPopup(true)}
            className="bg-linear-to-r from-[#D4AF37]/90 to-[#C5A059]/90 backdrop-blur-sm border border-[#D4AF37]/40 text-[#1a1613] hover:from-[#D4AF37] hover:to-[#C5A059] rounded-full px-4 py-3 font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
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