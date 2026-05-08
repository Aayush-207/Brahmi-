// components/lesson/steps/TraceStep.tsx
'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { LessonStep } from '@/types/lesson'
import JainBabaCharacter from '../JainBabaCharacter'
import { getStrokesForCharacter } from '@/data/brahmiStrokes'
import { TracerResult } from '@/components/BrahmiTracer/types'

/**
 * Dynamically import BrahmiTracer with SSR disabled.
 * The tracer accesses SVGSVGElement.getTotalLength() which requires the DOM.
 */
const BrahmiTracer = dynamic(
  () => import('@/components/BrahmiTracer'),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: 340,
          height: 340,
          background: '#13122a',
          border: '2px solid rgba(108,123,175,0.3)',
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-t-transparent"
            style={{
              borderColor: '#7F77DD',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading tracer…</p>
        </div>
      </div>
    ),
  }
)

interface TraceStepProps {
  step: LessonStep
  onComplete: () => void
}

/**
 * TraceStep — renders the WatchThenTrace interaction for a lesson trace step.
 *
 * Data contract (step.data):
 *   character?: string                        — Unicode character or roman key
 *   strokes?:   StrokeDefinition[]            — SVG stroke paths (preferred)
 *   viewBox?:   string                        — e.g. "0 0 120 120"
 *
 * If `strokes` is absent, falls back to getStrokesForCharacter(character)
 * which provides best-effort paths or a simple oval fallback.
 *
 * Calling onComplete (advancing the lesson) requires tier 'good' or 'excellent'.
 * Tier 'keep-trying' / 'try-again' lets the user replay without advancing.
 */
const TraceStep: React.FC<TraceStepProps> = ({ step, onComplete }) => {
  const { character, strokes: rawStrokes, viewBox: rawViewBox } = step.data ?? {}

  // Resolve stroke data — prop strokes take priority over lookup
  const { strokes, viewBox } = rawStrokes
    ? { strokes: rawStrokes, viewBox: rawViewBox ?? '0 0 120 120' }
    : getStrokesForCharacter(character ?? '')

  const [result, setResult] = useState<TracerResult | null>(null)

  const handleComplete = (r: TracerResult) => {
    setResult(r)
    // Auto-advance on success tiers
    if (r.tier === 'excellent' || r.tier === 'good') {
      onComplete()
    }
    // On 'keep-trying' or 'try-again': the FeedbackOverlay shows "Watch again"
    // which resets the tracer internally; user can retry without leaving the step
  }

  const guruMessage = result
    ? result.tier === 'excellent' || result.tier === 'good'
      ? `अद्भुत! ${character ?? ''} को बिल्कुल सही लिखा है! 🌟`
      : `और कोशिश करो! ${character ?? ''} को फिर से लिखने का प्रयास करो। 💪`
    : `शानदार! अब '${character ?? ''}' को सावधानी से लिखो। पहले देखो, फिर लिखो!`

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto p-2">
      {/* Guru mascot message */}
      <JainBabaCharacter
        message={guruMessage}
        variant={result
          ? (result.tier === 'excellent' || result.tier === 'good' ? 'encouraging' : 'default')
          : 'encouraging'}
      />

      {/* BrahmiTracer */}
      <BrahmiTracer
        strokes={strokes}
        viewBox={viewBox}
        animationDuration={1800}
        minCoverage={0.82}
        onComplete={handleComplete}
      />

      {/* Skip button (always available so user is never stuck) */}
      <button
        id="trace-step-skip"
        onClick={onComplete}
        className="mt-1 px-6 py-2 rounded-full text-sm font-medium transition-colors"
        style={{
          background: 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.35)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        Skip
      </button>

      {/* Spinner keyframe (inlined for the loading state) */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default TraceStep
