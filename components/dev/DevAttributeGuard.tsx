"use client"

import { useEffect } from 'react'

export default function DevAttributeGuard() {
  useEffect(() => {
    // Only active in non-production builds
    if (typeof window === 'undefined') return
    if (process.env.NODE_ENV === 'production') return

    const win = window as any
    if (win.__setAttributeGuardInstalled) return
    win.__setAttributeGuardInstalled = true

    const original = Element.prototype.setAttribute

    Element.prototype.setAttribute = function (name: string, value: any) {
      try {
        // Defensive: block writing invalid `d` values which trigger browser console errors
        if (name === 'd') {
          if (value === undefined || value === null || String(value) === 'undefined') {
            // Build richer diagnostic info
            const tag = this && (this as Element).tagName ? (this as Element).tagName : 'unknown'
            const id = this && (this as Element).id ? `#${(this as Element).id}` : ''
            const cls = this && (this as Element).className ? `.${String((this as Element).className).split(' ').join('.')}` : ''
            let outer = ''
            try { outer = (this as Element).outerHTML?.slice(0, 300) } catch (e) { outer = '' }

            // Silent in production of logs per user request: keep an in-memory record only

            // Store a short record on window for easy retrieval in devtools
            try {
              const win = window as any
              win.__DevAttrGuardRecords = win.__DevAttrGuardRecords || []
              win.__DevAttrGuardRecords.push({ time: Date.now(), tag, id, cls, value: String(value), stack: new Error().stack, outer })
            } catch (e) { /* ignore */ }

            // Coerce invalid values to empty path to avoid browser console errors
            try {
              return original.call(this, name, '')
            } catch (e) {
              return
            }
          }
        }

        return original.call(this, name, value)
      } catch (err) {
        // If the guard itself errors, fall back to original implementation
        // eslint-disable-next-line no-console
        console.error('[DevAttributeGuard] error in guard', err)
        return original.call(this, name, value)
      }
    }

    return () => {
      Element.prototype.setAttribute = original
      win.__setAttributeGuardInstalled = false
    }
  }, [])

  return null
}
