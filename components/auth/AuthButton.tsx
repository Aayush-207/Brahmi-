"use client";

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity';
import { getAvatarUrl } from '@/lib/getAvatarUrl';
import SignInPopup from './SignInPopup';

export default function AuthButton() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null });
    const [showSignInPopup, setShowSignInPopup] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const loadIdentity = async () => {
            const currentIdentity = await getCurrentIdentity();
            setIdentity(currentIdentity);
        };
        loadIdentity();

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            loadIdentity();
            // Close the popup when user signs in
            if (_event === 'SIGNED_IN') {
                setShowSignInPopup(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <button onClick={handleSignOut} className="text-sm font-bold text-[#EDEDED] hover:text-[#D4AF37]">
                    Sign Out
                </button>
                <img src={getAvatarUrl(user)} alt="Profile" className="w-8 h-8 rounded-full" />
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center gap-3">
                {identity.type === 'guest' && (
                    <span className="text-xs text-[#D4AF37]/70 hidden md:inline">
                        Sign in to save progress
                    </span>
                )}
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
