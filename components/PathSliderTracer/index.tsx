'use client'

// components/PathSliderTracer/index.tsx
//
// Path-constrained slider tracer.
//
// How it works:
//   - One or more SVG <path> elements define the shape.
//   - A draggable handle lives ON the path. It cannot leave it.
//   - Dragging changes a progress value (0 → totalLength).
//   - Handle position is ALWAYS derived from getPointAtLength(progress).
//   - Pointer X/Y coordinates are NEVER mapped to path position.
//
// Progress advances via:
//   delta = movementX + movementY        (signed: forward or backward)
//   progress = clamp(progress + delta * sensitivity, 0, totalLength)
//
// Forbidden by design:
//   - Canvas
//   - Pointer coordinate → path coordinate mapping
//   - Snapping
//   - Free drawing

import React, { useRef, useEffect, useState, useCallback } from 'react'
import type { PathSliderTracerProps } from './types'

// Pixels of pointer movement per SVG arc-length unit.
// Tune upward if the handle feels sluggish; downward if too fast.
const SENSITIVITY = 0.5

// Fraction of total length that counts as "complete".
const DONE_THRESHOLD = 0.95

export default function PathSliderTracer({
  strokes,
  viewBox,
  onComplete,
}: PathSliderTracerProps) {
  // We combine all strokes into a single concatenated SVG path string.
  // This means getTotalLength / getPointAtLength covers all sub-paths in order.
  const combinedPath = strokes.map((s) => s.path).join(' ')

  // --- Refs (hot path — no re-renders) ---
  const svgRef      = useRef<SVGSVGElement>(null)
  const pathRef     = useRef<SVGPathElement>(null)   // the invisible measurement path
  const handleRef   = useRef<SVGCircleElement>(null) // the draggable dot
  const progressRef = useRef(0)                      // current arc-length position
  const totalRef    = useRef(0)                      // getTotalLength() result
  const dragging    = useRef(false)
  const doneRef     = useRef(false)

  // --- State (only what is needed to re-render) ---
  const [ready, setReady]           = useState(false)  // true once we have totalLength
  const [progress, setProgress]     = useState(0)      // drives strokeDashoffset
  const [isDone, setIsDone]         = useState(false)

  // Measure the path once it is in the DOM.
  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    const len = el.getTotalLength()
    totalRef.current   = len
    progressRef.current = 0
    doneRef.current    = false
    setProgress(0)
    setIsDone(false)
    setReady(len > 0)
  }, [combinedPath])

  // Move handle to the current progress position by writing cx/cy directly.
  // This runs on every pointermove — keeping it out of React state is critical
  // for performance (no re-render per frame).
  const moveHandle = useCallback((p: number) => {
    const el = pathRef.current
    const h  = handleRef.current
    if (!el || !h) return
    const pt = el.getPointAtLength(p)
    h.setAttribute('cx', String(pt.x))
    h.setAttribute('cy', String(pt.y))
  }, [])

  // Called on every pointermove.
  const onMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return
    e.preventDefault() // blocks scroll on iOS — requires passive:false

    const total = totalRef.current
    if (total === 0) return

    // movementX + movementY is the signed scalar advance.
    const delta = e.movementX + e.movementY
    const next  = Math.max(0, Math.min(total, progressRef.current + delta * SENSITIVITY))

    progressRef.current = next
    moveHandle(next)

    // Update dash offset (cheap — just a setState for a number).
    setProgress(next)

    // Completion gate.
    if (!doneRef.current && next / total >= DONE_THRESHOLD) {
      doneRef.current = true
      setIsDone(true)
      try { navigator.vibrate(40) } catch { /* ignore if unavailable */ }
      onComplete()
    }
  }, [moveHandle, onComplete])

  // Register pointermove with passive:false on the SVG.
  // Cannot be done via JSX (React forces passive:true for onPointerMove).
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.addEventListener('pointermove', onMove, { passive: false })
    return () => svg.removeEventListener('pointermove', onMove)
  }, [onMove])

  // Pointer down: capture so events continue outside SVG bounds.
  const onDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
  }, [])

  // Pointer up: release.
  const onUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    dragging.current = false
  }, [])

  // Retry from start.
  const retry = useCallback(() => {
    progressRef.current = 0
    doneRef.current     = false
    dragging.current    = false
    setProgress(0)
    setIsDone(false)
    moveHandle(0)
  }, [moveHandle])

  // Initial handle placement once path is measured.
  useEffect(() => {
    if (ready) moveHandle(0)
  }, [ready, moveHandle])

  // --- Derived display values ---
  const total      = totalRef.current
  const dashOffset = ready ? total - progress : 0
  const pct        = ready && total > 0 ? Math.round((progress / total) * 100) : 0

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '12px',
        width:         '100%',
        maxWidth:      '340px',
        userSelect:    'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* SVG tracer */}
      <div
        style={{
          position:    'relative',
          width:       '100%',
          aspectRatio: '1',
          background:  '#13122a',
          borderRadius: '16px',
          border:      `2px solid ${isDone ? '#1D9E75' : 'rgba(108,123,175,0.35)'}`,
          overflow:    'hidden',
          cursor:      dragging.current ? 'grabbing' : 'grab',
        }}
      >
        <svg
          ref={svgRef}
          viewBox={viewBox}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block', touchAction: 'none' }}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* ── Invisible measurement path (always in DOM) ────────── */}
          {/* getTotalLength() and getPointAtLength() read from this.  */}
          {/* It must match the visible path geometry exactly.         */}
          <path
            ref={pathRef}
            d={combinedPath}
            fill="none"
            stroke="none"
            strokeWidth="0"
          />

          {/* ── Ghost: faint reference so user knows where to drag ── */}
          <path
            d={combinedPath}
            fill="none"
            stroke="rgba(130, 120, 220, 0.22)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ── Progress trail: revealed as handle advances ────────── */}
          {ready && (
            <path
              d={combinedPath}
              fill="none"
              stroke={isDone ? '#1D9E75' : '#7F77DD'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={total}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke 0.3s ease' }}
            />
          )}

          {/* ── Handle: circle pinned to path via ref ─────────────── */}
          {/* cx/cy are set imperatively in moveHandle() every frame.  */}
          {/* Initial position is cx=0 cy=0 until useEffect fires.     */}
          <circle
            ref={handleRef}
            cx={0}
            cy={0}
            r={6}
            fill={isDone ? '#1D9E75' : '#7F77DD'}
            stroke="white"
            strokeWidth="2"
            style={{
              filter:     'drop-shadow(0 0 5px rgba(127,119,221,0.8))',
              cursor:     'grab',
              transition: 'fill 0.3s ease',
            }}
          />
        </svg>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%', height: '6px',
          borderRadius: '3px', overflow: 'hidden',
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            height: '100%', borderRadius: '3px',
            width: `${pct}%`,
            background: isDone ? '#1D9E75' : '#7F77DD',
            transition: 'width 0.08s linear, background 0.3s ease',
          }}
        />
      </div>

      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontSize: '12px', color: isDone ? '#1D9E75' : 'rgba(255,255,255,0.4)' }}>
          {isDone ? '✅ Complete' : '↔ Drag the dot along the path'}
        </span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
          {pct}%
        </span>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <button
          onClick={retry}
          style={{
            flex: 1, padding: '8px 0', borderRadius: '10px', fontSize: '13px',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
          }}
        >
          ↩ Retry
        </button>
        {isDone && (
          <button
            onClick={onComplete}
            style={{
              flex: 2, padding: '8px 0', borderRadius: '10px', fontSize: '13px',
              fontWeight: 'bold', background: '#1D9E75', color: 'white',
              border: 'none', cursor: 'pointer',
            }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}
