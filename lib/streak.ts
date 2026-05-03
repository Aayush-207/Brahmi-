export type StreakData = {
    currentStreak: number
    longestStreak: number
    lastLoginDate: string | null
    isNewStreak: boolean
}

/**
 * Check and update user's login streak
 * Call this on app load or user login
 */
export async function updateLoginStreak(userId: string): Promise<StreakData> {
    console.log('Streak update: Waiting for backend implementation')
    return {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        isNewStreak: false
    }
}

/**
 * Get user's streak data without updating
 */
export async function getLoginStreak(userId: string): Promise<StreakData> {
    console.log('Streak data: Waiting for backend implementation')
    return {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        isNewStreak: false
    }
}
