import { createClient } from '@/lib/supabase/client'
import { Identity } from './guestIdentity'

const GUEST_PROGRESS_KEY = 'brahmi_guest_progress'

type GuestProgress = {
    completedIds: string[]
    currentId: string | null
    lastUpdated: string
}

/**
 * Get guest progress from sessionStorage
 */
function getGuestProgressFromStorage(): { completedIds: string[], currentId: string | null } {
    try {
        const stored = sessionStorage.getItem(GUEST_PROGRESS_KEY)
        if (!stored) {
            return { completedIds: [], currentId: null }
        }

        const progress: GuestProgress = JSON.parse(stored)
        return {
            completedIds: progress.completedIds || [],
            currentId: progress.currentId || null
        }
    } catch (error) {
        console.error('Error reading guest progress:', error)
        return { completedIds: [], currentId: null }
    }
}

/**
 * Save guest progress to sessionStorage
 */
function saveGuestProgressToStorage(completedIds: string[], currentId: string | null): void {
    try {
        const progress: GuestProgress = {
            completedIds,
            currentId,
            lastUpdated: new Date().toISOString()
        }
        sessionStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress))
    } catch (error) {
        console.error('Error saving guest progress:', error)
    }
}

/**
 * Get user progress - supports both authenticated users and guests
 */
export async function getUserProgress(identity: Identity) {
    // Handle guest users
    if (identity.type === 'guest') {
        return getGuestProgressFromStorage()
    }

    // Handle no identity
    if (identity.type === 'none' || !identity.id) {
        return { completedIds: [], currentId: null }
    }

    // Handle authenticated users (existing logic)
    const supabase = createClient()
    const { data, error } = await supabase
        .from('user_progress')
        .select('letter_id, status')
        .eq('user_id', identity.id)

    if (error) {
        console.error('Error fetching progress:', error)
        return { completedIds: [], currentId: null }
    }

    const completedIds = data.filter(p => p.status === 'completed').map(p => p.letter_id)
    const currentItem = data.find(p => p.status === 'current')
    const currentId = currentItem ? currentItem.letter_id : null

    return { completedIds, currentId }
}

/**
 * Mark a lesson as complete - supports both authenticated users and guests
 */
export async function markLessonComplete(identity: Identity, letterId: string) {
    // Handle guest users
    if (identity.type === 'guest') {
        const { completedIds } = getGuestProgressFromStorage()

        // Add current letter to completed if not already there
        if (!completedIds.includes(letterId)) {
            completedIds.push(letterId)
        }

        // For guests, we'll determine the next letter on the client side
        // This is a simplified version - the full logic would require fetching letters
        saveGuestProgressToStorage(completedIds, null)
        return
    }

    // Handle no identity
    if (identity.type === 'none' || !identity.id) {
        console.warn('Cannot save progress: no identity')
        return
    }

    // Handle authenticated users (existing logic)
    const supabase = createClient()

    // 1. Mark current as completed
    const { error: completeError } = await supabase
        .from('user_progress')
        .upsert({
            user_id: identity.id,
            letter_id: letterId,
            status: 'completed'
        })

    if (completeError) throw completeError

    // 2. Find next letter
    // Get current letter order
    const { data: currentLetter, error: letterError } = await supabase
        .from('letters')
        .select('order_no')
        .eq('id', letterId)
        .single()

    if (letterError || !currentLetter) return // specific error handling or end of course

    // Get next letter
    const { data: nextLetter } = await supabase
        .from('letters')
        .select('id')
        .gt('order_no', currentLetter.order_no)
        .order('order_no', { ascending: true })
        .limit(1)
        .single()

    // 3. Mark next as current (if exists)
    if (nextLetter) {
        // Check if already completed (re-doing lesson)
        const { data: existingProgress } = await supabase
            .from('user_progress')
            .select('status')
            .eq('user_id', identity.id)
            .eq('letter_id', nextLetter.id)
            .single()

        if (!existingProgress || existingProgress.status !== 'completed') {
            await supabase
                .from('user_progress')
                .upsert({
                    user_id: identity.id,
                    letter_id: nextLetter.id,
                    status: 'current'
                })
        }
    }
}

/**
 * Get guest progress for migration to authenticated user
 * Returns the raw progress data that can be sent to backend
 */
export function getGuestProgressForMigration(): GuestProgress | null {
    try {
        const stored = sessionStorage.getItem(GUEST_PROGRESS_KEY)
        if (!stored) return null
        return JSON.parse(stored)
    } catch (error) {
        console.error('Error getting guest progress for migration:', error)
        return null
    }
}

/**
 * Clear guest progress from sessionStorage
 * Called after successful migration
 */
export function clearGuestProgress(): void {
    try {
        sessionStorage.removeItem(GUEST_PROGRESS_KEY)
        console.log('Guest progress cleared')
    } catch (error) {
        console.warn('Failed to clear guest progress:', error)
    }
}
