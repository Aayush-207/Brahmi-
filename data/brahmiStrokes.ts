// data/brahmiStrokes.ts
//
// Sample SVG stroke definitions for Brahmi letters.
// Paths are defined in a 120×120 viewBox.
//
// Each entry can be passed directly as `strokes` to <BrahmiTracer />.
// Real production data should include all 48+ Brahmi characters with
// archaeologically accurate stroke order from Salomon (1998).

import { StrokeDefinition } from '@/components/BrahmiTracer/types'

// ─────────────────────────────────────────────────────────────
// 𑀅  Brahmi Letter A
// Simple rounded form — single stroke
// ─────────────────────────────────────────────────────────────
export const BRAHMI_A: StrokeDefinition[] = [
  {
    id: 'brahmi-a-s1',
    order: 1,
    svgPath: 'M 40 30 C 30 30 20 45 20 60 C 20 80 35 95 60 95 C 85 95 100 80 100 60 C 100 40 85 25 65 25 C 50 25 42 35 55 50 C 68 65 60 80 50 80',
  },
]

export const BRAHMI_A_VIEWBOX = '0 0 120 120'

// ─────────────────────────────────────────────────────────────
// 𑀓  Brahmi Letter Ka
// Two strokes: vertical stem + cross-bar
// ─────────────────────────────────────────────────────────────
export const BRAHMI_KA: StrokeDefinition[] = [
  {
    id: 'brahmi-ka-s1',
    order: 1,
    // Vertical stem
    svgPath: 'M 45 20 L 45 100',
  },
  {
    id: 'brahmi-ka-s2',
    order: 2,
    // Top horizontal with curve down-right
    svgPath: 'M 45 38 C 60 35 80 40 90 55 C 100 70 85 90 65 90',
  },
]

export const BRAHMI_KA_VIEWBOX = '0 0 120 120'

// ─────────────────────────────────────────────────────────────
// 𑀢  Brahmi Letter Ta
// Three strokes: top bar, left diagonal, right curve
// ─────────────────────────────────────────────────────────────
export const BRAHMI_TA: StrokeDefinition[] = [
  {
    id: 'brahmi-ta-s1',
    order: 1,
    // Top horizontal bar
    svgPath: 'M 25 30 L 95 30',
  },
  {
    id: 'brahmi-ta-s2',
    order: 2,
    // Left diagonal down
    svgPath: 'M 35 30 C 30 50 28 75 35 95',
  },
  {
    id: 'brahmi-ta-s3',
    order: 3,
    // Right curve
    svgPath: 'M 60 30 C 75 45 85 65 80 90 C 75 100 60 100 50 95',
  },
]

export const BRAHMI_TA_VIEWBOX = '0 0 120 120'

// ─────────────────────────────────────────────────────────────
// 𑀤  Brahmi Letter Da  (single-stroke, simpler for beginners)
// ─────────────────────────────────────────────────────────────
export const BRAHMI_DA: StrokeDefinition[] = [
  {
    id: 'brahmi-da-s1',
    order: 1,
    svgPath: 'M 30 25 L 90 25 C 100 25 105 35 100 45 L 65 90 C 60 96 52 96 48 90 L 25 50 C 18 38 22 25 30 25 Z',
  },
]

export const BRAHMI_DA_VIEWBOX = '0 0 120 120'

// ─────────────────────────────────────────────────────────────
// Helper: get stroke data by key
// ─────────────────────────────────────────────────────────────
export const BRAHMI_STROKE_MAP: Record<string, { strokes: StrokeDefinition[]; viewBox: string }> = {
  '𑀅': { strokes: BRAHMI_A, viewBox: BRAHMI_A_VIEWBOX },
  A:   { strokes: BRAHMI_A, viewBox: BRAHMI_A_VIEWBOX },
  '𑀓': { strokes: BRAHMI_KA, viewBox: BRAHMI_KA_VIEWBOX },
  Ka:  { strokes: BRAHMI_KA, viewBox: BRAHMI_KA_VIEWBOX },
  '𑀢': { strokes: BRAHMI_TA, viewBox: BRAHMI_TA_VIEWBOX },
  Ta:  { strokes: BRAHMI_TA, viewBox: BRAHMI_TA_VIEWBOX },
  '𑀤': { strokes: BRAHMI_DA, viewBox: BRAHMI_DA_VIEWBOX },
  Da:  { strokes: BRAHMI_DA, viewBox: BRAHMI_DA_VIEWBOX },
}

/**
 * Look up stroke data for a Brahmi character.
 * Returns a default single-stroke oval if the character is not yet mapped.
 *
 * @param character - Unicode character or romanization key
 */
export function getStrokesForCharacter(character: string): {
  strokes: StrokeDefinition[]
  viewBox: string
} {
  const found = BRAHMI_STROKE_MAP[character]
  if (found) return found

  // Fallback: single ellipse stroke so the component always renders something
  return {
    strokes: [
      {
        id: `fallback-${character}-s1`,
        order: 1,
        svgPath: 'M 60 20 C 90 20 105 38 105 60 C 105 82 90 100 60 100 C 30 100 15 82 15 60 C 15 38 30 20 60 20 Z',
      },
    ],
    viewBox: '0 0 120 120',
  }
}
