"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity';
import { getAvatarUrl } from '@/lib/getAvatarUrl';
import SignInPopup from './SignInPopup';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function AuthButton() {
    const router = useRouter();
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null });
    const [showSignInPopup, setShowSignInPopup] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();

        const loadIdentity = async () => {
            const currentIdentity = await getCurrentIdentity();
            setIdentity(currentIdentity);

            const { data } = await supabase.auth.getUser();
            const user = data.user;
            if (user) {
                setAvatarUrl(getAvatarUrl(user));
                setUserName(
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.email ||
                    'User'
                );
            } else {
                setAvatarUrl(null);
                setUserName(null);
            }
        };

        loadIdentity();

        const { data: authListener } = supabase.auth.onAuthStateChange(() => {
            loadIdentity();
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
        setIdentity({ type: 'guest', id: 'guest_' + Math.random().toString(36) });
        setAvatarUrl(null);
        setUserName(null);
        router.push('/');
    };

    if (identity.type === 'user') {
        return (
            <>
                <div className="flex items-center gap-3">
                    {avatarUrl && (
                        <Image src={avatarUrl} alt={userName || 'User'} width={36} height={36} className="h-9 w-9 rounded-full border border-[#D4AF37]/40 object-cover" unoptimized />
                    )}
                    <div className="hidden md:block text-right">
                        <div className="text-xs text-[#E6D8B8] font-semibold">{userName || 'Signed in'}</div>
                        <button onClick={handleSignOut} className="text-[10px] uppercase tracking-wider text-[#D4AF37] hover:text-[#E69A47]">Sign out</button>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="md:hidden text-sm font-bold text-[#EDEDED] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 px-4 py-2 rounded-md transition-all uppercase tracking-widest border border-transparent hover:border-[#D4AF37]/50"
                    >
                        Sign out
                    </button>
                </div>
                <SignInPopup
                    isVisible={showSignInPopup}
                    onClose={() => setShowSignInPopup(false)}
                />
            </>
        );
    }

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
