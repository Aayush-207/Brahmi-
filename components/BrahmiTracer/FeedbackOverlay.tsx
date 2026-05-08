// components/BrahmiTracer/FeedbackOverlay.tsx
'use client'

import React from 'react'
import { TracerResult } from './types'
import { TIER_LABELS, TIER_EMOJI, TIER_COLOR } from './utils'

interface FeedbackOverlayProps {
  result: TracerResult
  strokeCount: number
  onWatchAgain: () => void
  onContinue: () => void
}

/**
 * FeedbackOverlay — pure display component for Phase 3.
 *
 * Renders:
 * - Animated score badge with tier color
 * - Per-stroke coverage bars
 * - Action buttons (Watch again always; Continue only on good/excellent)
 *
 * CSS fade-in is handled by the `feedback-enter` class defined in globals.css.
 * No state, no logic — all data flows in through props.
 */
export default function FeedbackOverlay({
  result,
  strokeCount,
  onWatchAgain,
  onContinue,
}: FeedbackOverlayProps): React.ReactElement {
  const { score, tier, strokeCoverages } = result
  const color = TIER_COLOR[tier]
  const isSuccess = tier === 'excellent' || tier === 'good'

  return (
    <div
      className="brahmi-feedback-enter absolute inset-0 flex flex-col items-center justify-center rounded-2xl overflow-hidden"
      style={{ background: 'rgba(31, 29, 58, 0.92)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-label={`Tracing result: ${TIER_LABELS[tier]}, score ${score}`}
    >
      {/* Score badge */}
      <div
        className="flex flex-col items-center gap-2 mb-6"
        style={{ animation: 'feedbackScalePop 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <span className="text-5xl" role="img" aria-label={tier}>
          {TIER_EMOJI[tier]}
        </span>
        <h2
          className="text-4xl font-bold tracking-tight"
          style={{ color }}
        >
          {TIER_LABELS[tier]}
        </h2>
        <p className="text-6xl font-black text-white tabular-nums">{score}</p>
        <p className="text-sm text-white/60 uppercase tracking-widest">out of 100</p>
      </div>

      {/* Per-stroke coverage bars */}
      {strokeCount > 1 && (
        <div className="w-full max-w-[240px] flex flex-col gap-2 mb-8">
          {Array.from({ length: strokeCount }, (_, i) => {
            const sid = Object.keys(strokeCoverages)[i] ?? `stroke-${i}`
            const pct = Math.round((strokeCoverages[sid] ?? 0) * 100)
            return (
              <div key={sid} className="flex items-center gap-2">
                <span className="text-xs text-white/60 w-16 shrink-0">Stroke {i + 1}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: pct >= 80 ? '#1D9E75' : pct >= 60 ? '#D4AF37' : '#A32D2D',
                    }}
                  />
                </div>
                <span className="text-xs text-white/60 tabular-nums w-8 text-right">{pct}%</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full max-w-[240px]">
        {/* Primary CTA: Watch again (always shown, primary on fail) */}
        <button
          id="brahmi-feedback-watch-again"
          onClick={onWatchAgain}
          className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all active:scale-95"
          style={{
            background: isSuccess ? 'rgba(255,255,255,0.12)' : color,
            color: isSuccess ? 'rgba(255,255,255,0.85)' : '#fff',
            border: isSuccess ? '1px solid rgba(255,255,255,0.2)' : 'none',
          }}
        >
          ↩ Watch again
        </button>

        {/* Continue: only on good or excellent */}
        {isSuccess && (
          <button
            id="brahmi-feedback-continue"
            onClick={onContinue}
            className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95 shadow-lg"
            style={{ background: color, color: '#fff' }}
          >
            Continue →
          </button>
        )}
      </div>

      {/* Score hint for poor attempts */}
      {!isSuccess && (
        <p className="mt-4 text-xs text-white/40 text-center max-w-[200px]">
          Watch the guide dot carefully, then trace slowly along the path
        </p>
      )}
    </div>
  )
}
