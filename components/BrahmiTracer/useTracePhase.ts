// components/BrahmiTracer/useTracePhase.ts
'use client'

import { useEffect, useRef, useCallback } from 'react'
import { StrokeDefinition, SampledStroke, PathPoint } from './types'
import {
  buildSampledStroke,
  nearestOnPath,
  svgCoordsFromPointer,
  canvasCoordsFromSvg,
  setupHiDpiCanvas,
  vibrate,
} from './utils'

interface UseTracePhaseOptions {
  strokes: StrokeDefinition[]
  svgRef: React.RefObject<SVGSVGElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  viewBox: string
  minCoverage: number
  /** Called when a stroke passes the coverage threshold */
  onStrokeComplete: (strokeId: string, coverage: number) => void
  /** Called when the user lifts pointer and stroke fails coverage */
  onStrokeFail: (strokeId: string) => void
}

interface UseTracePhaseReturn {
  /**
   * Call this when entering the trace phase.
   * Pre-samples all strokes and sets up the active stroke index.
   */
  startTrace: (activeIndex?: number) => void
  /** Reset all progress and clear canvas ink */
  resetTrace: () => void
  /**
   * Set the active stroke index manually (e.g. to retry a failed stroke).
   * Does NOT clear previous ink — ghost traces remain.
   */
  setActiveStrokeIndex: (i: number) => void
  /** Read the latest coverage value for the active stroke */
  getCoverage: () => number
  /** Read whether the pointer is currently on the path */
  getIsOnPath: () => boolean
}

const INK_COLOR = '#534AB7' // purple-600 per spec
const INK_LINE_WIDTH = 3.5  // multiplied by dpr in draw loop
const MAX_JUMP = 6           // teleport prevention — max index advance per pointermove event

/**
 * useTracePhase — manages the TRACE phase of the letter tracer.
 *
 * Responsibilities:
 * - Pre-samples all stroke paths once (in useEffect, never during interaction)
 * - Registers pointermove on the SVG element with { passive: false }
 * - Performs proximity check on each pointermove (O(k) forward scan + small backward window)
 * - Collects ink points in a ref-based queue, flushed by rAF draw loop
 * - Tracks per-stroke coverage; fires onStrokeComplete / onStrokeFail on pointerup
 * - Reads pointerType from pointerdown, uses it for tolerance throughout the gesture
 *
 * State kept in refs (hot-path, no re-renders):
 *   sampledStrokesRef, inkQueueRef, lastProgressIndexRef, isTracingRef,
 *   activeStrokeIndexRef, pointerTypeRef, prevInkCountRef, coverageRef,
 *   isOnPathRef, startTimeRef, animFrameRef, strokeCoveragesRef
 *
 * Only reads from props during useEffect setup, never during pointer events.
 */
export function useTracePhase({
  strokes,
  svgRef,
  canvasRef,
  viewBox,
  minCoverage,
  onStrokeComplete,
  onStrokeFail,
}: UseTracePhaseOptions): UseTracePhaseReturn {
  // ---- Mutable hot-path refs ------------------------------------------------
  const sampledStrokesRef = useRef<SampledStroke[]>([])
  const activeStrokeIndexRef = useRef(0)
  const lastProgressIndexRef = useRef(0)
  const isTracingRef = useRef(false)
  const isOnPathRef = useRef(false)
  const coverageRef = useRef(0)
  const pointerTypeRef = useRef<string>('mouse')
  const inkQueueRef = useRef<PathPoint[]>([])
  const prevInkCountRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)
  const strokeCoveragesRef = useRef<Record<string, number>>({})
  const startTimeRef = useRef<number>(0)
  const rafActiveRef = useRef(false)

  // Stable ref to latest props so pointer events always read fresh values
  const viewBoxRef = useRef(viewBox)
  const minCoverageRef = useRef(minCoverage)
  const onStrokeCompleteRef = useRef(onStrokeComplete)
  const onStrokeFailRef = useRef(onStrokeFail)

  useEffect(() => { viewBoxRef.current = viewBox }, [viewBox])
  useEffect(() => { minCoverageRef.current = minCoverage }, [minCoverage])
  useEffect(() => { onStrokeCompleteRef.current = onStrokeComplete }, [onStrokeComplete])
  useEffect(() => { onStrokeFailRef.current = onStrokeFail }, [onStrokeFail])

  // ---- Tolerance resolution -------------------------------------------------
  const getToleranceForType = (type: string): number => {
    return type === 'touch' ? 26 : 15
  }

  // ---- Canvas draw loop ----------------------------------------------------
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const queue = inkQueueRef.current
    const prev = prevInkCountRef.current
    const dpr = window.devicePixelRatio || 1

    if (queue.length > prev) {
      ctx.strokeStyle = INK_COLOR
      ctx.lineWidth = INK_LINE_WIDTH * dpr
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      // Continue path from the last drawn point to avoid gaps
      const startIdx = prev === 0 ? 0 : prev - 1
      ctx.moveTo(queue[startIdx].x * dpr, queue[startIdx].y * dpr)
      for (let i = startIdx + 1; i < queue.length; i++) {
        ctx.lineTo(queue[i].x * dpr, queue[i].y * dpr)
      }
      ctx.stroke()
      prevInkCountRef.current = queue.length
    }

    if (rafActiveRef.current) {
      animFrameRef.current = requestAnimationFrame(drawFrame)
    }
  }, [canvasRef])

  // ---- Pointer event handlers (registered via addEventListener) ------------

  const handlePointerDown = useCallback((e: PointerEvent) => {
    pointerTypeRef.current = e.pointerType || 'mouse'
    isTracingRef.current = true
    if (startTimeRef.current === 0) {
      startTimeRef.current = performance.now()
    }
    // Start rAF loop
    if (!rafActiveRef.current) {
      rafActiveRef.current = true
      animFrameRef.current = requestAnimationFrame(drawFrame)
    }
  }, [drawFrame])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    e.preventDefault() // MUST prevent scroll — registered with passive: false

    const svg = svgRef.current
    const canvas = canvasRef.current
    if (!svg || !canvas || !isTracingRef.current) return
    if (sampledStrokesRef.current.length === 0) return

    const activeIdx = activeStrokeIndexRef.current
    const currentStroke = sampledStrokesRef.current[activeIdx]
    if (!currentStroke || currentStroke.points.length === 0) return

    const tolerance = getToleranceForType(pointerTypeRef.current)

    // Convert to SVG space
    const svgPt = svgCoordsFromPointer(e, svg)

    // Proximity check
    const result = nearestOnPath(
      svgPt,
      currentStroke.points,
      lastProgressIndexRef.current,
      tolerance
    )

    isOnPathRef.current = result.hit

    if (result.hit) {
      const newIdx = result.index
      const lastIdx = lastProgressIndexRef.current

      // Advance progress — cap teleport at MAX_JUMP points per event
      if (newIdx > lastIdx) {
        lastProgressIndexRef.current = Math.min(newIdx, lastIdx + MAX_JUMP)
      }

      // Compute coverage
      const totalPts = currentStroke.points.length
      coverageRef.current = totalPts > 1
        ? lastProgressIndexRef.current / (totalPts - 1)
        : 1

      // Collect ink point in canvas CSS-pixel space
      const canvasPt = canvasCoordsFromSvg(svgPt, viewBoxRef.current, canvas)
      inkQueueRef.current.push(canvasPt)
    }
    // If not on path: no ink drawn — pointer events continue
  }, [svgRef, canvasRef])

  const handlePointerUp = useCallback(() => {
    if (!isTracingRef.current) return
    isTracingRef.current = false
    rafActiveRef.current = false

    const activeIdx = activeStrokeIndexRef.current
    const currentStroke = sampledStrokesRef.current[activeIdx]
    if (!currentStroke) return

    const coverage = coverageRef.current
    strokeCoveragesRef.current[currentStroke.id] = coverage

    if (coverage >= minCoverageRef.current) {
      vibrate(40)
      onStrokeCompleteRef.current(currentStroke.id, coverage)
    } else {
      vibrate([10, 30, 10])
      onStrokeFailRef.current(currentStroke.id)
    }
  }, [])

  // ---- Pre-sampling (runs once when strokes prop stabilizes) ----------------
  useEffect(() => {
    if (!strokes || strokes.length === 0) return

    const sorted = [...strokes].sort((a, b) => a.order - b.order)
    sampledStrokesRef.current = sorted.map(s => buildSampledStroke(s.id, s.svgPath, 4))
    strokeCoveragesRef.current = {}
    activeStrokeIndexRef.current = 0
    lastProgressIndexRef.current = 0
    coverageRef.current = 0
    startTimeRef.current = 0
  }, [strokes])

  // ---- Event listener setup on SVG (pointermove MUST be on SVG for passive:false) --
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const opts = { passive: false }
    svg.addEventListener('pointerdown', handlePointerDown as EventListener)
    svg.addEventListener('pointermove', handlePointerMove as EventListener, opts)
    svg.addEventListener('pointerup', handlePointerUp as EventListener)
    svg.addEventListener('pointercancel', handlePointerUp as EventListener)
    // Pointer leave: only stop if we were tracing (handles mouse leaving SVG bounds)
    const handleLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') handlePointerUp()
    }
    svg.addEventListener('pointerleave', handleLeave as EventListener)

    return () => {
      svg.removeEventListener('pointerdown', handlePointerDown as EventListener)
      svg.removeEventListener('pointermove', handlePointerMove as EventListener)
      svg.removeEventListener('pointerup', handlePointerUp as EventListener)
      svg.removeEventListener('pointercancel', handlePointerUp as EventListener)
      svg.removeEventListener('pointerleave', handleLeave as EventListener)
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      rafActiveRef.current = false
    }
  }, [svgRef, handlePointerDown, handlePointerMove, handlePointerUp])

  // ---- Canvas HiDPI setup on mount + resize --------------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    setupHiDpiCanvas(canvas)

    const obs = new ResizeObserver(() => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      setupHiDpiCanvas(canvas)
      // Re-draw ink after resize (simplified: clear — future enhancement could redraw)
      inkQueueRef.current = []
      prevInkCountRef.current = 0
    })
    obs.observe(canvas)
    return () => obs.disconnect()
  }, [canvasRef])

  // ---- Exposed API ---------------------------------------------------------

  const startTrace = useCallback((activeIndex = 0) => {
    activeStrokeIndexRef.current = activeIndex
    lastProgressIndexRef.current = 0
    coverageRef.current = 0
    isTracingRef.current = false
    isOnPathRef.current = false
  }, [])

  const resetTrace = useCallback(() => {
    // Stop rAF
    rafActiveRef.current = false
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }

    // Clear canvas
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1
      ctx?.clearRect(0, 0, canvas.width * dpr, canvas.height * dpr)
    }

    // Reset all refs
    inkQueueRef.current = []
    prevInkCountRef.current = 0
    lastProgressIndexRef.current = 0
    coverageRef.current = 0
    isTracingRef.current = false
    isOnPathRef.current = false
    activeStrokeIndexRef.current = 0
    strokeCoveragesRef.current = {}
    startTimeRef.current = 0
  }, [canvasRef])

  const setActiveStrokeIndex = useCallback((i: number) => {
    activeStrokeIndexRef.current = i
    lastProgressIndexRef.current = 0
    coverageRef.current = 0
    // Do NOT clear ink — ghost trace of previous strokes stays
    inkQueueRef.current = inkQueueRef.current // unchanged
    prevInkCountRef.current = inkQueueRef.current.length
  }, [])

  const getCoverage = useCallback(() => coverageRef.current, [])
  const getIsOnPath = useCallback(() => isOnPathRef.current, [])

  return { startTrace, resetTrace, setActiveStrokeIndex, getCoverage, getIsOnPath }
}

/**
 * Expose the stable stroke coverages ref for score computation on completion.
 * This is a workaround for returning a ref without making it part of the main
 * return interface (which would cause re-renders on change).
 *
 * Usage: call inside a useEffect or event handler, not render.
 */
export type TracePhaseRef = {
  strokeCoveragesRef: React.MutableRefObject<Record<string, number>>
  startTimeRef: React.MutableRefObject<number>
}
