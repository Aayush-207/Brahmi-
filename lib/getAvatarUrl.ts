export function getAvatarUrl(user: any) {
  if (!user) return null

  // Common places providers and Supabase put avatar URLs
  const candidates = [
    user.user_metadata?.avatar_url,
    user.user_metadata?.avatar,
    user.user_metadata?.picture,
    user.user_metadata?.picture_url,
    user.user_metadata?.image,
    user.user_metadata?.profile_image,
    // Provider identity data (e.g., Google/GitHub)
    user.identities?.[0]?.identity_data?.avatar_url,
    user.identities?.[0]?.identity_data?.picture,
    user.identities?.[0]?.identity_data?.avatar,
  ]

  const found = candidates.find((c) => typeof c === 'string' && c.length > 0)
  if (found) return found

  // If none found, try email-based DiceBear fallback
  const email = user.email || (user.user_metadata && (user.user_metadata.email || user.user_metadata.email_address))
  if (email) return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`

  // Final generic fallback
  return `https://api.dicebear.com/7.x/initials/svg?seed=guest`
}
