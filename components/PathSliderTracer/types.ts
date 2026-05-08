// components/PathSliderTracer/types.ts

export interface StrokeDefinition {
  id: string
  path: string
}

export interface PathSliderTracerProps {
  strokes: StrokeDefinition[]
  viewBox: string
  onComplete: () => void
}
