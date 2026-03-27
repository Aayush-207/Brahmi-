import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/learn'

    // Ensure localhost is used in development. In production prefer NEXT_PUBLIC_APP_URL
    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : (process.env.NEXT_PUBLIC_APP_URL ?? origin)

    try {
        if (code) {
            const cookieStore = await cookies()
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        get(name: string) {
                            return cookieStore.get(name)?.value
                        },
                        set(name: string, value: string, options: CookieOptions) {
                            cookieStore.set({ name, value, ...options })
                        },
                        remove(name: string, options: CookieOptions) {
                            cookieStore.delete({ name, ...options })
                        },
                    },
                }
            )

            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (!error) {
                // Guest progress migration happens client-side
                // The letters page will automatically sync progress when user logs in
                console.log('Auth callback: User authenticated successfully')
                const successRedirect = new URL(next, baseUrl).toString()
                return NextResponse.redirect(successRedirect)
            } else {
                console.error('Auth callback error from supabase:', error)
            }
        }
    } catch (err) {
        console.error('Auth callback handler error:', err)
    }

    // return the user to an error page with instructions
    const errorRedirect = new URL('/auth/auth-code-error', baseUrl).toString()
    return NextResponse.redirect(errorRedirect)
}
