import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const next = searchParams.get('next') ?? '/learn'

    // Ensure localhost is used in development. In production prefer NEXT_PUBLIC_APP_URL
    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : (process.env.NEXT_PUBLIC_APP_URL ?? origin)

    // Authentication will be handled by backend when available
    console.log('Auth callback: Backend authentication will be implemented')
    const successRedirect = new URL(next, baseUrl).toString()
    return NextResponse.redirect(successRedirect)
}
