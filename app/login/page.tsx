'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [hasGuestProgress, setHasGuestProgress] = useState(false)

    useEffect(() => {
        // Backend authentication will be implemented when available
        setError('Backend sign-in feature coming soon!')
        
        // Check if there's guest progress saved
        try {
            const guestProgress = sessionStorage.getItem('GUEST_PROGRESS')
            setHasGuestProgress(!!guestProgress)
        } catch {
            setHasGuestProgress(false)
        }
    }, [])

    const handleLogin = async () => {
        try {
            const supabase = getSupabaseBrowserClient()
            const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/learn')}`
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo }
            })

            if (error) {
                throw error
            }
        } catch (err) {
            console.error('Login failed:', err)
            setError('Google sign-in failed. Please try again.')
        }
    }

    return (
        <div className="flex h-[calc(100vh-72px)] w-full items-center justify-center bg-[#1C1C1C]">
            <div className="w-full max-w-sm rounded-3xl bg-[#1a1a1a]/90 backdrop-blur-sm shadow-2xl border border-white/10 p-8 flex flex-col items-center">
                <h2 className="text-2xl font-semibold text-white mb-2 text-center">
                    Welcome Back
                </h2>
                <p className="text-gray-400 text-sm mb-6 text-center">
                    Sign in to track your learning progress
                </p>

                <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 p-3 rounded-lg mb-4 text-sm w-full text-center">
                    🔐 Sign in required to access lessons and track progress
                </div>

                {hasGuestProgress && (
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] p-3 rounded-lg mb-4 text-sm w-full text-center">
                        ✨ Your progress will be saved to your account
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm w-full text-center">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-b from-[#232526] to-[#2d2e30] rounded-full px-5 py-3 font-medium text-white shadow hover:brightness-110 transition mb-2 text-sm"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button>
            </div>
        </div>
    )
}
