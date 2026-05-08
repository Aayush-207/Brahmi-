// components/LetterTracer/types.ts

export interface Point {
  x: number
  y: number
}

export interface TracerResult {
  score: number
  tier: 'great' | 'good' | 'keep-trying' | 'try-again'
  avgDistance: number
  pointerType: string
}

export interface LetterTracerProps {
  // Pre-resampled reference path as an array of 64 {x, y} points
  // normalized to a 0–100 unit bounding box
  referencePoints: Point[]

  // Original SVG path string for rendering the ghost letter underneath
  svgPath: string

  // Callback fired after each completed stroke attempt
  onScore: (result: TracerResult) => void

  // Optional: 'touch' input gets wider tolerance than 'mouse'
  // Defaults to auto-detect via event.pointerType
  inputType?: 'mouse' | 'touch' | 'stylus'

  // Controls scoring sensitivity: multiplier applied to average distance
  // Higher value = stricter grading. Defaults to 2.
  scoreSensitivity?: number
}
