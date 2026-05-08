// components/BrahmiTracer/index.tsx
'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { WatchThenTraceProps, TracerResult, TracerPhase, StrokeDefinition } from './types'
import { useWatchPhase } from './useWatchPhase'
import { useTracePhase } from './useTracePhase'
import FeedbackOverlay from './FeedbackOverlay'
import { computeResult, vibrate } from './utils'

/**
 * BrahmiTracer — "Watch Then Trace" letter tracer
 *
 * Three-phase architecture:
 *   WATCH    → CSS draw-on animation + guide dot (driven via DOM ref, NOT setState)
 *   TRACE    → Pointer Events → proximity check → canvas ink
 *   FEEDBACK → Score overlay with per-stroke coverage bars
 *
 * Layer order (bottom to top):
 *   1. SVG  — ghost paths, completed-stroke coloring, guide dot
 *   2. Canvas — user ink overlay (pointer-events: none)
 *   3. Feedback overlay — absolutely positioned
 *
 * Key fix over previous version:
 *   The guide dot position is NO LONGER managed by React state (useState).
 *   Instead, `dotCircleRef` is passed to `useWatchPhase`, which writes
 *   cx/cy directly to the DOM element every rAF frame.
 *   This eliminates the 60-fps setState chain that caused "Maximum update depth exceeded".
 */
export default function BrahmiTracer({
  strokes,
  viewBox,
  animationDuration = 1800,
  minCoverage = 0.82,
  onComplete,
}: WatchThenTraceProps): React.ReactElement {
  // ── Refs ─────────────────────────────────────────────────
  const svgRef      = useRef<SVGSVGElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const dotCircleRef = useRef<SVGCircleElement>(null) // guide dot — written by useWatchPhase directly

  const strokeCoveragesRef = useRef<Record<string, number>>({})
  const startTimeRef       = useRef<number>(0)
  const pointerTypeRef     = useRef<string>('mouse')
  const hintTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── State (only discrete phase-level changes) ────────────
  const [phase, setPhase]                         = useState<TracerPhase>('watch')
  const [activeStrokeIdx, setActiveStrokeIdx]     = useState(0)
  const [completedStrokes, setCompletedStrokes]   = useState<string[]>([])
  const [failedStroke, setFailedStroke]           = useState<string | null>(null)
  const [feedback, setFeedback]                   = useState<TracerResult | null>(null)

  // Sort strokes by order
  const sortedStrokes: StrokeDefinition[] = [...strokes].sort((a, b) => a.order - b.order)
  const strokeIds = sortedStrokes.map(s => s.id)

  // ── Watch phase ───────────────────────────────────────────
  const handleWatchComplete = useCallback(() => {
    setPhase('trace')
  }, [])

  const {
    isAnimating,
    replay: replayWatch,
    activeStrokeIndex: watchActiveIndex,
    animatingStrokeId,
  } = useWatchPhase({
    svgRef,
    dotCircleRef,          // hook writes dot position directly to this ref
    strokeIds,
    animationDuration,
    onWatchComplete: handleWatchComplete,
  })

  // Keep activeStrokeIdx in sync with watch phase
  useEffect(() => {
    if (phase === 'watch') setActiveStrokeIdx(watchActiveIndex)
  }, [watchActiveIndex, phase])

  // ── Stroke completion handler (trace phase) ──────────────
  // We use a ref for traceApi to avoid the circular-reference ordering issue
  const traceApiRef = useRef<ReturnType<typeof useTracePhase> | null>(null)

  const handleStrokeComplete = useCallback((strokeId: string, coverage: number) => {
    strokeCoveragesRef.current[strokeId] = coverage
    setCompletedStrokes(prev => {
      const next = [...prev, strokeId]
      if (next.length === sortedStrokes.length) {
        const result = computeResult(
          strokeCoveragesRef.current,
          pointerTypeRef.current,
          startTimeRef.current
        )
        setFeedback(result)
        setPhase('feedback')
        if (result.tier === 'excellent') vibrate([40, 60, 40])
        else if (result.tier === 'good') vibrate(40)
        else vibrate([10, 30, 10])
      } else {
        const nextIdx = next.length
        setActiveStrokeIdx(nextIdx)
        traceApiRef.current?.setActiveStrokeIndex(nextIdx)
        setFailedStroke(null)
      }
      return next
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedStrokes.length])

  const handleStrokeFail = useCallback((strokeId: string) => {
    setFailedStroke(strokeId)
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    hintTimerRef.current = setTimeout(() => setFailedStroke(null), 2500)
  }, [])

  const traceApi = useTracePhase({
    strokes: sortedStrokes,
    svgRef,
    canvasRef,
    viewBox,
    minCoverage,
    onStrokeComplete: handleStrokeComplete,
    onStrokeFail: handleStrokeFail,
  })
  traceApiRef.current = traceApi

  // Track pointer type for scoring
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const handler = (e: PointerEvent) => { pointerTypeRef.current = e.pointerType }
    svg.addEventListener('pointerdown', handler)
    return () => svg.removeEventListener('pointerdown', handler)
  }, [])

  // Start trace phase on phase change
  useEffect(() => {
    if (phase === 'trace') {
      traceApi.startTrace(0)
      setActiveStrokeIdx(completedStrokes.length)
      startTimeRef.current = performance.now()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Cleanup hint timer
  useEffect(() => () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
  }, [])

  // ── Reset handlers ────────────────────────────────────────
  const handleWatchAgain = useCallback(() => {
    traceApi.resetTrace()
    setCompletedStrokes([])
    setFeedback(null)
    setFailedStroke(null)
    strokeCoveragesRef.current = {}
    startTimeRef.current = 0
    setActiveStrokeIdx(0)
    setPhase('watch')
    replayWatch()
  }, [traceApi, replayWatch])

  const handleContinue = useCallback(() => {
    if (feedback) onComplete(feedback)
  }, [feedback, onComplete])

  // ── Visual state helpers ──────────────────────────────────
  const getStrokeColor = (id: string): string => {
    if (completedStrokes.includes(id)) return '#1D9E75'
    return '#6C7BAF'
  }

  const getStrokeOpacity = (id: string, idx: number): number => {
    if (completedStrokes.includes(id)) return 1
    if (phase === 'watch') {
      if (idx === watchActiveIndex) return 0.9
      if (idx < watchActiveIndex) return 1
      return 0.15
    }
    if (phase === 'trace') {
      if (idx === completedStrokes.length) return 0.55
      if (idx < completedStrokes.length) return 1
      return 0.15
    }
    return completedStrokes.includes(id) ? 0.7 : 0.15
  }

  const activeInTrace = phase === 'trace' ? completedStrokes.length : -1

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-3 w-full select-none">
      {/* Status row */}
      <div className="flex items-center justify-between w-full max-w-[340px]">
        {phase === 'watch' && (
          <p className="text-sm font-semibold tracking-widest uppercase"
             style={{ color: '#D4AF37', animation: 'watchPulse 1.4s ease-in-out infinite' }}>
            👁 Watch
          </p>
        )}
        {phase === 'trace' && (
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#6C7BAF' }}>
            ✍️ Trace
          </p>
        )}
        {phase === 'feedback' && (
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#1D9E75' }}>
            ✅ Done
          </p>
        )}

        {/* Stroke dots */}
        <div className="flex gap-1.5">
          {sortedStrokes.map((s, i) => (
            <div key={s.id} className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: completedStrokes.includes(s.id)
                  ? '#1D9E75'
                  : i === activeInTrace ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                transform: i === activeInTrace ? 'scale(1.4)' : 'scale(1)',
              }} />
          ))}
        </div>
      </div>

      {/* Main tracer */}
      <div className="relative w-full max-w-[340px] rounded-2xl overflow-hidden"
        style={{
          aspectRatio: '1',
          background: '#13122a',
          border: '2px solid rgba(108,123,175,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Touch affordance */}
        {phase === 'trace' && completedStrokes.length === 0 && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none z-10"
               style={{ animation: 'watchPulse 2s ease-in-out infinite' }}>
            <span className="text-xs text-white/30 tracking-wide">touch to trace</span>
          </div>
        )}

        {/* ── SVG ghost layer ── */}
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ touchAction: 'none', userSelect: 'none',
                   cursor: phase === 'watch' ? 'pointer' : 'crosshair' }}
          onPointerDown={phase === 'watch' ? () => replayWatch() : undefined}
        >
          <defs>
            <pattern id="brahmi-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#brahmi-grid)" />

          {sortedStrokes.map((stroke, idx) => {
            const isAnimatingThis = animatingStrokeId === stroke.id
            const isActiveTrace   = phase === 'trace' && idx === completedStrokes.length

            // Parse start point from M command for start-indicator dot
            const mMatch = stroke.svgPath.match(/M\s*([\d.]+)\s+([\d.]+)/)
            const startX = mMatch ? parseFloat(mMatch[1]) : null
            const startY = mMatch ? parseFloat(mMatch[2]) : null

            return (
              <g key={stroke.id}>
                {/* Dashed guide */}
                <path
                  d={stroke.svgPath}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6 4"
                />

                {/* Main stroke path
                    * IMPORTANT: strokeDasharray & strokeDashoffset are NOT set here.
                    * useWatchPhase sets them imperatively via el.style — React must not
                    * overwrite them, so they must not appear in JSX props.
                    * The animation class is applied via className so React manages it
                    * declaratively (avoids React removing it on re-render). */}
                <path
                  id={stroke.id}
                  d={stroke.svgPath}
                  fill="none"
                  stroke={getStrokeColor(stroke.id)}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={getStrokeOpacity(stroke.id, idx)}
                  className={isAnimatingThis ? 'brahmi-stroke-animating' : undefined}
                  style={{
                    transition: completedStrokes.includes(stroke.id)
                      ? 'stroke 0.3s ease, opacity 0.3s ease' : undefined,
                  }}
                />

                {/* Active trace pulse */}
                {isActiveTrace && (
                  <path d={stroke.svgPath} fill="none" stroke="#7F77DD" strokeWidth="1.5"
                        strokeLinecap="round" opacity="0.35" strokeDasharray="4 6"
                        style={{ animation: 'pulseDash 2s linear infinite' }} />
                )}

                {/* Start indicator */}
                {isActiveTrace && startX !== null && startY !== null && (
                  <circle cx={startX} cy={startY} r="4" fill="#D4AF37" opacity="0.8"
                          style={{ animation: 'watchPulse 1s ease-in-out infinite' }} />
                )}
              </g>
            )
          })}

          {/* Guide dot — written to directly by useWatchPhase (NOT via React state).
              Starts hidden; hook sets visibility="visible" when animating. */}
          <circle
            ref={dotCircleRef}
            cx={50}
            cy={50}
            r={5}
            fill="#7F77DD"
            stroke="white"
            strokeWidth="1.5"
            visibility="hidden"
            style={{ filter: 'drop-shadow(0 0 4px #7F77DD)', pointerEvents: 'none' }}
          />
        </svg>

        {/* ── Canvas ink overlay ── */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            touchAction: 'none', pointerEvents: 'none', display: 'block',
          }}
        />

        {/* ── Feedback overlay ── */}
        {phase === 'feedback' && feedback && (
          <FeedbackOverlay
            result={feedback}
            strokeCount={sortedStrokes.length}
            onWatchAgain={handleWatchAgain}
            onContinue={handleContinue}
          />
        )}
      </div>

      {/* Below-canvas controls */}
      <div className="flex flex-col items-center gap-2 w-full max-w-[340px]">
        {/* Fail hint */}
        {failedStroke && (
          <p className="text-xs text-center px-3 py-1.5 rounded-lg"
             style={{ background: 'rgba(163,45,45,0.15)', color: '#e48585',
                      border: '1px solid rgba(163,45,45,0.3)' }}>
            ✋ Try to stay on the dotted path
          </p>
        )}

        {/* Watch controls */}
        {phase === 'watch' && (
          <div className="flex gap-2 w-full">
            <button id="brahmi-watch-again" onClick={replayWatch}
              className="flex-1 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
              style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37',
                       border: '1px solid rgba(212,175,55,0.25)' }}>
              ↩ Watch again
            </button>
            {!isAnimating && (
              <button id="brahmi-now-try" onClick={() => setPhase('trace')}
                className="flex-[2] py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ background: '#1D9E75', color: '#fff' }}>
                Now you try →
              </button>
            )}
          </div>
        )}

        {/* Trace progress bar */}
        {phase === 'trace' && (
          <div className="w-full">
            <div className="w-full h-1.5 rounded-full overflow-hidden"
                 style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round((completedStrokes.length / sortedStrokes.length) * 100)}%`,
                  background: '#1D9E75',
                }} />
            </div>
            <p className="text-center text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Stroke {Math.min(completedStrokes.length + 1, sortedStrokes.length)} of {sortedStrokes.length}
            </p>
          </div>
        )}
      </div>

      {/* Inline keyframes — scoped to this component */}
      <style>{`
        @keyframes pulseDash {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -20; }
        }
        @keyframes feedbackScalePop {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        .brahmi-feedback-enter {
          animation: brahmiOverlayIn 0.2s ease both;
        }
        @keyframes brahmiOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
