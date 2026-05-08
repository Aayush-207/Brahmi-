// components/BrahmiTracer/useWatchPhase.ts
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { PathPoint } from './types'
import { getPathLength, getPointOnPath } from './utils'

interface UseWatchPhaseOptions {
  /** Ref to the root SVG element */
  svgRef: React.RefObject<SVGSVGElement | null>
  /**
   * Ref to the guide-dot <circle> element in the SVG.
   * The hook updates cx/cy/visibility directly — no React state, no re-renders.
   */
  dotCircleRef: React.RefObject<SVGCircleElement | null>
  /** Ordered stroke ids to animate through */
  strokeIds: string[]
  /** Milliseconds per stroke animation. Default 1800 */
  animationDuration: number
  /** Called when all strokes have finished animating + 600 ms pause */
  onWatchComplete: () => void
}

interface UseWatchPhaseReturn {
  /** True while CSS animation + guide dot rAF loop are running */
  isAnimating: boolean
  /** Replay animation from the first stroke */
  replay: () => void
  /** Index of the currently animating stroke (for ghost styling) */
  activeStrokeIndex: number
  /**
   * The stroke id that currently has the CSS draw-on animation class.
   * Pass as `animatingStrokeId` to the SVG renderer so it can add the class via JSX.
   */
  animatingStrokeId: string | null
}

// CSS class applied to the active <path> to trigger the draw-on keyframe.
// Defined in globals.css as .brahmi-stroke-animating { animation: drawStroke ... }
const ANIMATING_CLASS = 'brahmi-stroke-animating'

/**
 * useWatchPhase — manages the WATCH phase of the letter tracer.
 *
 * Responsibilities:
 * - Triggers the CSS draw-on animation for each stroke in sequence
 * - Drives the guide dot position by writing cx/cy directly to a DOM ref
 *   (bypasses React state → zero re-renders during animation)
 * - Auto-advances through strokes and calls onWatchComplete when done
 * - Exposes `replay()` to restart from the beginning
 *
 * Performance notes:
 * - getDotPos / getPointAtLength are called only inside the rAF loop,
 *   which is started inside a useEffect
 * - dotPos is NOT useState — it is written directly to the SVG element
 *   via dotCircleRef, keeping the render tree completely static during animation
 * - Only `isAnimating`, `activeStrokeIndex`, and `animatingStrokeId` use
 *   useState because they drive visible rendering changes (ghost opacity, CSS class)
 */
export function useWatchPhase({
  svgRef,
  dotCircleRef,
  strokeIds,
  animationDuration,
  onWatchComplete,
}: UseWatchPhaseOptions): UseWatchPhaseReturn {
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeStrokeIndex, setActiveStrokeIndex] = useState(0)
  const [animatingStrokeId, setAnimatingStrokeId] = useState<string | null>(null)

  // Mutable refs — zero re-renders
  const activeIndexRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)
  const animStartTimeRef = useRef<number>(0)
  const currentLengthRef = useRef<number>(0)
  const cleanedUpRef = useRef(false)
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Stable ref to animationDuration so the rAF tick always reads the latest value
  // without needing to be in the tick closure's dependency chain
  const animDurRef = useRef(animationDuration)
  useEffect(() => { animDurRef.current = animationDuration }, [animationDuration])

  // Stable ref to onWatchComplete
  const onCompleteRef = useRef(onWatchComplete)
  useEffect(() => { onCompleteRef.current = onWatchComplete }, [onWatchComplete])

  /** Cancel all pending rAF and timers */
  const cancelAll = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    if (autoAdvanceTimerRef.current !== null) {
      clearTimeout(autoAdvanceTimerRef.current)
      autoAdvanceTimerRef.current = null
    }
  }, [])

  /**
   * Show/hide the guide dot by writing directly to the SVG element.
   * This is intentionally NOT setState — avoids re-renders every rAF frame.
   */
  const setDotPosition = useCallback((pos: PathPoint | null) => {
    const circle = dotCircleRef.current
    if (!circle) return
    if (!pos) {
      circle.setAttribute('visibility', 'hidden')
    } else {
      circle.setAttribute('cx', String(pos.x))
      circle.setAttribute('cy', String(pos.y))
      circle.setAttribute('visibility', 'visible')
    }
  }, [dotCircleRef])

  /**
   * Reset a stroke path's dasharray/dashoffset and CSS animation class
   * so it appears invisible (ready to animate from scratch).
   */
  const resetPathStyle = useCallback((svg: SVGSVGElement, id: string, len: number) => {
    const el = svg.querySelector<SVGPathElement>(`#${id}`)
    if (!el) return
    el.classList.remove(ANIMATING_CLASS)
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
    el.style.setProperty('--path-len', `${len}px`)
    el.style.setProperty('--anim-dur', `${animDurRef.current}ms`)
  }, [])

  /**
   * Animate one stroke:
   * 1. Measure path length (inside useEffect, safe from DOM perspective)
   * 2. Reset dashoffset to full (invisible)
   * 3. On next rAF, add the animation class to trigger CSS keyframe
   * 4. Run rAF loop to move guide dot (writes to DOM ref, not React state)
   * 5. After animation, wait 600 ms then advance or call onWatchComplete
   */
  const animateStroke = useCallback((index: number) => {
    const svg = svgRef.current
    if (!svg || cleanedUpRef.current) return

    const id = strokeIds[index]
    if (!id) return

    const len = getPathLength(svg, id)
    currentLengthRef.current = len

    resetPathStyle(svg, id, len)

    // Flush the dashoffset reset before adding the animation class
    requestAnimationFrame(() => {
      if (cleanedUpRef.current) return
      const el = svg.querySelector<SVGPathElement>(`#${id}`)
      if (!el) return

      el.classList.add(ANIMATING_CLASS)
      animStartTimeRef.current = performance.now()

      // ── React state updates (discrete, not per-frame) ──────────────
      setIsAnimating(true)
      setActiveStrokeIndex(index)
      setAnimatingStrokeId(id)
      activeIndexRef.current = index
      // ──────────────────────────────────────────────────────────────

      // rAF loop — drives dot position via direct DOM write (NOT setState)
      const tick = (now: number) => {
        if (cleanedUpRef.current) return
        const dur = animDurRef.current
        const elapsed = now - animStartTimeRef.current
        const t = Math.min(elapsed / dur, 1)

        const pt = getPointOnPath(svg, id, t, len)
        setDotPosition(pt) // ← writes to DOM element, NOT React state

        if (t < 1) {
          rafIdRef.current = requestAnimationFrame(tick)
        } else {
          // Animation complete — brief pause then advance
          rafIdRef.current = null
          autoAdvanceTimerRef.current = setTimeout(() => {
            if (cleanedUpRef.current) return
            const next = index + 1
            if (next < strokeIds.length) {
              animateStroke(next)
            } else {
              // All strokes done
              setIsAnimating(false)
              setAnimatingStrokeId(null)
              setDotPosition(null)
              onCompleteRef.current()
            }
          }, 600)
        }
      }

      rafIdRef.current = requestAnimationFrame(tick)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgRef, strokeIds, resetPathStyle, setDotPosition])
  // Note: animDurRef and onCompleteRef are stable refs — intentionally excluded

  /** Replay from stroke 0 */
  const replay = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return

    cancelAll()
    cleanedUpRef.current = false
    setDotPosition(null)

    // Reset all stroke paths
    strokeIds.forEach(id => {
      const len = getPathLength(svg, id)
      resetPathStyle(svg, id, len)
    })

    setActiveStrokeIndex(0)
    setAnimatingStrokeId(null)
    animateStroke(0)
  }, [svgRef, strokeIds, cancelAll, resetPathStyle, setDotPosition, animateStroke])

  // Start animation on mount / when strokeIds change
  useEffect(() => {
    cleanedUpRef.current = false
    if (strokeIds.length === 0) return

    animateStroke(0)

    return () => {
      cleanedUpRef.current = true
      cancelAll()
      setDotPosition(null)
    }
    // Re-run only when the set of strokes or duration changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokeIds.join('|'), animationDuration])

  return { isAnimating, replay, activeStrokeIndex, animatingStrokeId }
}
