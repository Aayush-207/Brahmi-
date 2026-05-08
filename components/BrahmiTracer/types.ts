// components/BrahmiTracer/types.ts

/**
 * A single point in 2D space (SVG or canvas coordinate system).
 */
export interface PathPoint {
  x: number
  y: number
}

/**
 * A stroke path definition provided by the caller.
 * The svgPath must be a valid SVG path data string (d attribute).
 */
export interface StrokeDefinition {
  /** Unique identifier for this stroke */
  id: string
  /** Valid SVG path data, e.g. "M 20 10 C 40 5 60 30 80 80" */
  svgPath: string
  /** 1-indexed draw order — strokes must be traced in this order */
  order: number
}

/**
 * Pre-sampled version of a StrokeDefinition.
 * Created once on mount in useTracePhase; stored in a ref.
 */
export interface SampledStroke {
  id: string
  /** Evenly-spaced points along the arc length */
  points: PathPoint[]
  totalLength: number
  /** Number of sampled segments */
  N: number
}

/**
 * Props for the top-level WatchThenTrace component.
 */
export interface WatchThenTraceProps {
  /** Stroke paths that define the letter, in draw order */
  strokes: StrokeDefinition[]
  /** SVG viewBox string, e.g. "0 0 120 120" */
  viewBox: string
  /** Milliseconds per stroke in the watch phase. Default: 1800 */
  animationDuration?: number
  /**
   * Snapping tolerance in SVG units.
   * Auto-adjusted by pointerType if not supplied.
   * Default: 15 (pen/mouse) or 26 (touch)
   */
  toleranceRadius?: number
  /** Fraction of stroke that must be covered to pass. Default: 0.82 */
  minCoverage?: number
  /** Called once when the user completes all strokes */
  onComplete: (result: TracerResult) => void
}

/**
 * Result emitted on letter completion.
 */
export interface TracerResult {
  /** 0–100 */
  score: number
  tier: 'excellent' | 'good' | 'keep-trying' | 'try-again'
  /** Per-stroke coverage fractions, keyed by stroke id */
  strokeCoverages: Record<string, number>
  /** Total time from first pointerdown to last pointerup in ms */
  totalDurationMs: number
  /** 'mouse' | 'touch' | 'pen' */
  pointerType: string
}

/**
 * The three interaction phases of the tracer.
 */
export type TracerPhase = 'watch' | 'trace' | 'feedback'
