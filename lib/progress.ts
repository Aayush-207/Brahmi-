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

    // Backend will provide progress data
    console.log('User progress: Waiting for backend implementation')
    return { completedIds: [], currentId: null }
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

    // Backend will handle saving progress for authenticated users
    console.log('Lesson complete: Waiting for backend implementation')
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
