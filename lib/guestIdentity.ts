import { createClient } from '@/lib/supabase/client'

const GUEST_ID_KEY = 'brahmi_guest_id'

export type Identity =
    | { type: 'user'; id: string }
    | { type: 'guest'; id: string }
    | { type: 'none'; id: null }

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

/**
 * Get or create a guest ID from sessionStorage
 * Data is lost when tab closes
 */
export function getOrCreateGuestId(): string {
    try {
        const existing = sessionStorage.getItem(GUEST_ID_KEY)
        if (existing) {
            return existing
        }

        const newGuestId = `guest_${generateUUID()}`
        sessionStorage.setItem(GUEST_ID_KEY, newGuestId)
        return newGuestId
    } catch (error) {
        // Fallback if sessionStorage is unavailable
        console.warn('sessionStorage unavailable, using in-memory guest ID')
        return `guest_${generateUUID()}`
    }
}

/**
 * Get the current identity (user or guest)
 * This is async because it needs to check Supabase auth
 */
export async function getCurrentIdentity(): Promise<Identity> {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user?.id) {
            return { type: 'user', id: user.id }
        }

        // No authenticated user, use guest ID
        const guestId = getOrCreateGuestId()
        return { type: 'guest', id: guestId }
    } catch (error: any) {
        // Supabase or fetch may abort requests (navigation, timeout, etc.). Treat AbortError as non-fatal.
        if (error && error.name === 'AbortError') {
            // Silently fallback to guest identity without noisy logging
            const guestId = getOrCreateGuestId()
            return { type: 'guest', id: guestId }
        }

        console.error('Error getting identity:', error)
        // Fallback to guest
        const guestId = getOrCreateGuestId()
        return { type: 'guest', id: guestId }
    }
}

/**
 * Clear guest identity from sessionStorage
 * Called after successful migration to authenticated user
 */
export function clearGuestIdentity(): void {
    try {
        sessionStorage.removeItem(GUEST_ID_KEY)
        console.log('Guest identity cleared')
    } catch (error) {
        console.warn('Failed to clear guest identity:', error)
    }
}

/**
 * Check if a guest ID exists
 */
export function hasGuestIdentity(): boolean {
    try {
        return sessionStorage.getItem(GUEST_ID_KEY) !== null
    } catch {
        return false
    }
}

/**
 * Get guest ID without creating one (returns null if doesn't exist)
 */
export function getGuestIdIfExists(): string | null {
    try {
        return sessionStorage.getItem(GUEST_ID_KEY)
    } catch {
        return null
    }
}
