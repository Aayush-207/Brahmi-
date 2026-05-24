const PLACEHOLDER_APP_URL = 'your_production_url (for production)'

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/$/, '')
}

export function getAppBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL

  if (configuredUrl && configuredUrl !== PLACEHOLDER_APP_URL) {
    return normalizeUrl(configuredUrl)
  }

  if (typeof window !== 'undefined') {
    return normalizeUrl(window.location.origin)
  }

  return ''
}