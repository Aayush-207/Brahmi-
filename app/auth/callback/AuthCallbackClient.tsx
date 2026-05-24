'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { upsertUserProfile } from '@/lib/supabase/profiles';

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Completing sign in...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          setError('Google sign-in is not configured on this deployment yet.');
          return;
        }
        const code = searchParams.get('code');
        const next = searchParams.get('next') || '/learn';

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          if (data.user) {
            await upsertUserProfile(data.user);
          }
        } else {
          const { data, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          if (data.session?.user) {
            await upsertUserProfile(data.session.user);
          }
        }

        if (isMounted) {
          setMessage('Sign in complete. Redirecting...');
          router.replace(next);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        if (isMounted) {
          setError('Sign-in could not be completed. Please try again.');
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1C1C1C] px-4 text-center">
      <div className="max-w-md rounded-3xl border border-[#D4AF37]/20 bg-[#1a1a1a]/90 p-8 shadow-2xl">
        <div className="mb-4 text-3xl">✦</div>
        <h1 className="text-2xl font-bold text-white">Google Sign-In</h1>
        <p className="mt-3 text-sm text-gray-300">{error || message}</p>
      </div>
    </div>
  );
}