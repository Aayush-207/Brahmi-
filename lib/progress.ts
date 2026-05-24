import { Identity } from './guestIdentity'
import { loadAccountLessonProgress, saveAccountLessonProgress } from './supabase/lessonProgress'

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

    const progressRows = await loadAccountLessonProgress('module-swar', identity.id)
    const completedIds = Object.values(progressRows)
        .filter((entry) => entry.status === 'completed')
        .map((entry) => entry.lesson_id)
        .sort((a, b) => a.localeCompare(b))

    const currentId = Object.values(progressRows)
        .sort((a, b) => {
            const completedScore = Number(Boolean(a.completed_at)) - Number(Boolean(b.completed_at))
            if (completedScore !== 0) return completedScore
            return new Date(a.last_accessed).getTime() - new Date(b.last_accessed).getTime()
        })
        .at(-1)?.lesson_id || null

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

    await saveAccountLessonProgress('module-swar', letterId, 'completed', 100, identity.id)
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
