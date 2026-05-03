"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity';
import { getAvatarUrl } from '@/lib/getAvatarUrl';
import SignInPopup from './SignInPopup';

export default function AuthButton() {
    const router = useRouter();
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null });
    const [showSignInPopup, setShowSignInPopup] = useState(false);

    useEffect(() => {
        const loadIdentity = async () => {
            const currentIdentity = await getCurrentIdentity();
            setIdentity(currentIdentity);
        };
        loadIdentity();
    }, []);

    const handleSignOut = async () => {
        // Backend sign out will be implemented when backend is available
        console.log('Sign out: Backend implementation pending');
        setIdentity({ type: 'guest', id: 'guest_' + Math.random().toString(36) });
        router.push('/');
    };

    // Show sign in button for guests
    if (identity.type === 'guest' || identity.type === 'none') {
        return (
            <>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-[#D4AF37]/70 hidden md:inline">
                        Sign in to save progress
                    </span>
                    <button
                        onClick={() => setShowSignInPopup(true)}
                        className="text-sm font-bold text-[#EDEDED] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 px-4 py-2 rounded-md transition-all uppercase tracking-widest border border-transparent hover:border-[#D4AF37]/50"
                    >
                        Sign in
                    </button>
                </div>
                <SignInPopup
                    isVisible={showSignInPopup}
                    onClose={() => setShowSignInPopup(false)}
                />
            </>
        );
    }

    // For now, always show guest UI (user auth will be implemented with backend)
    return (
        <>
            <div className="flex items-center gap-3">
                <span className="text-xs text-[#D4AF37]/70 hidden md:inline">
                    Sign in to save progress
                </span>
                <button
                    onClick={() => setShowSignInPopup(true)}
                    className="text-sm font-bold text-[#EDEDED] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 px-4 py-2 rounded-md transition-all uppercase tracking-widest border border-transparent hover:border-[#D4AF37]/50"
                >
                    Sign in
                </button>
            </div>
            <SignInPopup
                isVisible={showSignInPopup}
                onClose={() => setShowSignInPopup(false)}
            />
        </>
    );
}
