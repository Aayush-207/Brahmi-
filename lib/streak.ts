import { createClient } from '@/lib/supabase/client'

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
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    
    try {
        // 1. Get current streak data
        const { data: streakData, error: streakError } = await supabase
            .from('login_streaks')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (streakError && streakError.code !== 'PGRST116') { // Not found error is ok
            throw streakError
        }

        // 2. Check if already logged in today
        const { data: todayLogin } = await supabase
            .from('login_history')
            .select('*')
            .eq('user_id', userId)
            .eq('login_date', today)
            .single()

        if (todayLogin) {
            // Already logged in today, return current streak
            return {
                currentStreak: streakData?.current_streak || 0,
                longestStreak: streakData?.longest_streak || 0,
                lastLoginDate: streakData?.last_login_date || null,
                isNewStreak: false
            }
        }

        // 3. Calculate new streak
        let newStreak = 1
        let isNewStreak = true

        if (streakData && streakData.last_login_date) {
            const lastLogin = new Date(streakData.last_login_date)
            const todayDate = new Date(today)
            const diffDays = Math.floor((todayDate.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))

            if (diffDays === 1) {
                // Consecutive day - increment streak
                newStreak = streakData.current_streak + 1
            } else if (diffDays > 1) {
                // Streak broken - reset to 1
                newStreak = 1
            }
        }

        const newLongestStreak = Math.max(newStreak, streakData?.longest_streak || 0)

        // 4. Update login_history
        await supabase
            .from('login_history')
            .insert({
                user_id: userId,
                login_date: today
            })

        // 5. Upsert streak data
        await supabase
            .from('login_streaks')
            .upsert({
                user_id: userId,
                current_streak: newStreak,
                longest_streak: newLongestStreak,
                last_login_date: today,
                updated_at: new Date().toISOString()
            })

        return {
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastLoginDate: today,
            isNewStreak
        }
    } catch (error) {
        console.error('Error updating streak:', error)
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastLoginDate: null,
            isNewStreak: false
        }
    }
}

/**
 * Get user's streak data without updating
 */
export async function getLoginStreak(userId: string): Promise<StreakData> {
    const supabase = createClient()
    
    const { data, error } = await supabase
        .from('login_streaks')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (error || !data) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastLoginDate: null,
            isNewStreak: false
        }
    }

    return {
        currentStreak: data.current_streak,
        longestStreak: data.longest_streak,
        lastLoginDate: data.last_login_date,
        isNewStreak: false
    }
}
