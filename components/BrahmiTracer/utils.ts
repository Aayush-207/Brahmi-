// components/BrahmiTracer/utils.ts

import { PathPoint, SampledStroke, TracerResult } from './types'

// ---------------------------------------------------------------------------
// Path Sampling
// ---------------------------------------------------------------------------

/**
 * Sample an SVG path string into evenly-spaced points along its arc length.
 *
 * Algorithm: O(n) where n = ceil(totalLength / density).
 * Creates a temporary off-DOM SVGPathElement, calls getTotalLength() once,
 * then getPointAtLength(i * len / N) for each sample.
 *
 * MUST be called inside useEffect — never during pointermove.
 *
 * @param svgPathString - The "d" attribute value of the path
 * @param density       - Arc-length distance between adjacent samples (default 4 SVG units)
 * @returns Array of PathPoint objects evenly distributed along the arc
 */
export function sampleStroke(svgPathString: string, density = 4): PathPoint[] {
  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  pathEl.setAttribute('d', svgPathString)

  // Attach to a hidden SVG so the browser can compute geometry
  const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  tempSvg.style.cssText = 'position:absolute;visibility:hidden;width:0;height:0'
  tempSvg.appendChild(pathEl)
  document.body.appendChild(tempSvg)

  let points: PathPoint[] = []
  try {
    const len = pathEl.getTotalLength()
    if (len === 0) return []
    const N = Math.ceil(len / density)
    points = Array.from({ length: N + 1 }, (_, i) => {
      const pt = pathEl.getPointAtLength((i * len) / N)
      return { x: pt.x, y: pt.y }
    })
  } finally {
    document.body.removeChild(tempSvg)
  }

  return points
}

// ---------------------------------------------------------------------------
// Proximity Check (hot-path — must complete < 1 ms)
// ---------------------------------------------------------------------------

/**
 * Check whether a query point is within `tolerance` of any sampled path point,
 * scanning forward from `fromIndex` first, then a small backward window.
 *
 * Complexity: O(k) where k ≤ remaining points + 8 backward slack.
 * Returns early on first hit — performance critical for 60 fps pointermove.
 *
 * @param pt         - Query point in SVG coordinates
 * @param points     - Pre-sampled path points
 * @param fromIndex  - Start scanning forward from this index (lastProgressIndex)
 * @param tolerance  - Maximum allowed Euclidean distance in SVG units
 * @returns { hit: true, index: closestIdx } or { hit: false, index: fromIndex }
 */
export function nearestOnPath(
  pt: PathPoint,
  points: PathPoint[],
  fromIndex: number,
  tolerance: number
): { hit: boolean; index: number } {
  // Forward scan from current progress position
  for (let i = fromIndex; i < points.length; i++) {
    const dx = pt.x - points[i].x
    const dy = pt.y - points[i].y
    if (Math.sqrt(dx * dx + dy * dy) <= tolerance) {
      return { hit: true, index: i }
    }
  }

  // Backward window — allows slight backtracking without penalty
  const backWindow = Math.min(fromIndex, 8)
  for (let i = fromIndex - backWindow; i < fromIndex; i++) {
    const dx = pt.x - points[i].x
    const dy = pt.y - points[i].y
    if (Math.sqrt(dx * dx + dy * dy) <= tolerance) {
      return { hit: true, index: i }
    }
  }

  return { hit: false, index: fromIndex }
}

// ---------------------------------------------------------------------------
// Coordinate Conversion
// ---------------------------------------------------------------------------

/**
 * Convert a PointerEvent's client coordinates to SVG viewport space.
 *
 * Uses createSVGPoint + getScreenCTM().inverse() which correctly handles
 * any CSS transform, scaling, or scrolling applied to the SVG element.
 *
 * Complexity: O(1)
 *
 * @param e     - PointerEvent (clientX / clientY)
 * @param svgEl - The SVGSVGElement owning the paths
 * @returns Point in SVG viewBox coordinate space
 */
export function svgCoordsFromPointer(e: PointerEvent, svgEl: SVGSVGElement): PathPoint {
  const pt = svgEl.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  const ctm = svgEl.getScreenCTM()
  if (!ctm) return { x: 0, y: 0 }
  const svgPt = pt.matrixTransform(ctm.inverse())
  return { x: svgPt.x, y: svgPt.y }
}

/**
 * Convert a point in SVG viewBox units to canvas pixel coordinates.
 *
 * The canvas is sized in device pixels (width = cssWidth * dpr).
 * We map viewBox units → CSS pixels first, which the caller has already
 * applied the dpr scaling to the canvas context via ctx.scale(dpr, dpr).
 * So we return CSS-pixel coordinates — the ctx scale handles the rest.
 *
 * Complexity: O(1)
 *
 * @param pt      - Point in SVG viewBox space
 * @param viewBox - SVG viewBox string "minX minY width height"
 * @param canvas  - The HTMLCanvasElement (used only for CSS display dimensions)
 * @returns Point in canvas CSS-pixel coordinates (before dpr scaling)
 */
export function canvasCoordsFromSvg(
  pt: PathPoint,
  viewBox: string,
  canvas: HTMLCanvasElement
): PathPoint {
  const [vbX, vbY, vbW, vbH] = viewBox.split(' ').map(Number)
  // Use CSS display size (getBoundingClientRect), not canvas.width which is DPR-scaled
  const rect = canvas.getBoundingClientRect()
  return {
    x: ((pt.x - vbX) / vbW) * rect.width,
    y: ((pt.y - vbY) / vbH) * rect.height,
  }
}

// ---------------------------------------------------------------------------
// Score Calculation
// ---------------------------------------------------------------------------

/**
 * Compute a final TracerResult from per-stroke coverage values.
 *
 * Formula:
 *   avgCoverage = mean of all stroke coverages
 *   score       = round(avgCoverage * 100), clamped [0, 100]
 *   tier:       90–100 → excellent | 70–89 → good | 50–69 → keep-trying | 0–49 → try-again
 *
 * Complexity: O(n) where n = stroke count
 *
 * @param coverages   - Record<strokeId, coverage [0..1]>
 * @param pointerType - 'mouse' | 'touch' | 'pen'
 * @param startTime   - performance.now() at first pointerdown
 * @returns Complete TracerResult ready to pass to onComplete
 */
export function computeResult(
  coverages: Record<string, number>,
  pointerType: string,
  startTime: number
): TracerResult {
  const values = Object.values(coverages)
  const empty = values.length === 0

  const avgCoverage = empty ? 0 : values.reduce((a, b) => a + b, 0) / values.length
  const score = Math.max(0, Math.min(100, Math.round(avgCoverage * 100)))

  let tier: TracerResult['tier']
  if (score >= 90) tier = 'excellent'
  else if (score >= 70) tier = 'good'
  else if (score >= 50) tier = 'keep-trying'
  else tier = 'try-again'

  return {
    score,
    tier,
    strokeCoverages: coverages,
    totalDurationMs: Math.round(performance.now() - startTime),
    pointerType,
  }
}

// ---------------------------------------------------------------------------
// Tier Display Helpers (used by FeedbackOverlay + index)
// ---------------------------------------------------------------------------

/** Human-readable label for each tier */
export const TIER_LABELS: Record<TracerResult['tier'], string> = {
  excellent: 'Excellent!',
  good: 'Good work',
  'keep-trying': 'Keep trying',
  'try-again': 'Try again',
}

/** Emoji per tier */
export const TIER_EMOJI: Record<TracerResult['tier'], string> = {
  excellent: '🌟',
  good: '👍',
  'keep-trying': '💪',
  'try-again': '🎯',
}

/** Hex colors per tier (matches spec) */
export const TIER_COLOR: Record<TracerResult['tier'], string> = {
  excellent: '#1D9E75',
  good: '#0F6E56',
  'keep-trying': '#BA7517',
  'try-again': '#A32D2D',
}

// ---------------------------------------------------------------------------
// Haptics Helper
// ---------------------------------------------------------------------------

/**
 * Fire navigator.vibrate safely (no-op if API unavailable).
 * @param pattern - ms or ms[] pattern
 */
export function vibrate(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    // ignore — vibration not available
  }
}

// ---------------------------------------------------------------------------
// Canvas Setup
// ---------------------------------------------------------------------------

/**
 * Set up an HTMLCanvasElement for HiDPI rendering.
 * Sizes the canvas backing store to devicePixelRatio × CSS size,
 * then scales the 2D context so drawing code uses CSS pixels.
 *
 * @param canvas - The canvas to configure
 * @returns The 2D rendering context, or null if unavailable
 */
export function setupHiDpiCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = Math.round(rect.width * dpr)
  canvas.height = Math.round(rect.height * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.scale(dpr, dpr)
  return ctx
}

// ---------------------------------------------------------------------------
// Path Length Helper (used in useWatchPhase, in useEffect only)
// ---------------------------------------------------------------------------

/**
 * Get the total arc length of an SVG path element.
 * MUST only be called inside useEffect — never during a pointer event.
 *
 * @param svgEl  - The root SVGSVGElement
 * @param pathId - The `id` attribute of the target path element
 * @returns Total arc length in SVG units, or 0 if not found
 */
export function getPathLength(svgEl: SVGSVGElement, pathId: string): number {
  const el = svgEl.querySelector<SVGPathElement>(`#${pathId}`)
  return el ? el.getTotalLength() : 0
}

/**
 * Get a point along an SVG path at parameter t ∈ [0, 1].
 * MUST only be called inside a useEffect or rAF callback registered from useEffect.
 *
 * @param svgEl  - The root SVGSVGElement
 * @param pathId - The `id` attribute of the target path element
 * @param t      - Normalized position along the path [0, 1]
 * @param len    - Pre-computed total length (avoids redundant getTotalLength call)
 * @returns PathPoint, or {x:0, y:0} if element not found
 */
export function getPointOnPath(
  svgEl: SVGSVGElement,
  pathId: string,
  t: number,
  len: number
): PathPoint {
  const el = svgEl.querySelector<SVGPathElement>(`#${pathId}`)
  if (!el) return { x: 0, y: 0 }
  const pt = el.getPointAtLength(Math.min(t, 1) * len)
  return { x: pt.x, y: pt.y }
}

// ---------------------------------------------------------------------------
// SampledStroke builder (called from useTracePhase)
// ---------------------------------------------------------------------------

/**
 * Build a SampledStroke from a StrokeDefinition.
 * Wraps sampleStroke with metadata needed by the proximity engine.
 *
 * @param id        - Id of the stroke
 * @param svgPath   - SVG path data string
 * @param density   - Sampling density (default 4)
 */
export function buildSampledStroke(
  id: string,
  svgPath: string,
  density = 4
): import('./types').SampledStroke {
  const points = sampleStroke(svgPath, density)
  return {
    id,
    points,
    totalLength: points.length > 0 ? points.length * density : 0,
    N: points.length - 1,
  }
}
