const fs = require('fs');
const path = require('path');

const content = `// components/PathSliderTracer/index.tsx
'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { PathSliderTracerProps } from './types'

const C_GHOST         = 'rgba(108, 123, 175, 0.18)'
const C_GUIDE         = 'rgba(255, 255, 255, 0.06)'
const C_PROGRESS      = '#7F77DD'
const C_SUCCESS       = '#1D9E75'
const C_HANDLE        = '#7F77DD'
const C_HANDLE_ACTIVE = '#A09AFF'
const C_START         = '#D4AF37'
const C_WHITE         = '#ffffff'

export default function PathSliderTracer({
  letter,
  sensitivity = 0.4,
  completionThreshold = 0.95,
  onComplete,
}: PathSliderTracerProps): React.ReactElement {
  const svgRef         = useRef<SVGSVGElement>(null)
  const measurePathRef = useRef<SVGPathElement>(null)
  const progressRef    = useRef(0)
  const totalRef       = useRef(0)
  const draggingRef    = useRef(false)
  const completedRef   = useRef(false)
  const pointerTypeRef = useRef('mouse')

  const [handlePos, setHandlePos]             = useState<{x:number;y:number}|null>(null)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [isComplete, setIsComplete]           = useState(false)
  const [isGrabbing, setIsGrabbing]           = useState(false)

  useEffect(() => {
    const pathEl = measurePathRef.current
    if (!pathEl) return
    const len = pathEl.getTotalLength()
    totalRef.current = len
    progressRef.current = 0
    completedRef.current = false
    setDisplayProgress(0)
    setIsComplete(false)
    if (len > 0) {
      const pt = pathEl.getPointAtLength(0)
      setHandlePos({ x: pt.x, y: pt.y })
    }
  }, [letter.path])

  const advanceProgress = useCallback((delta: number) => {
    const pathEl = measurePathRef.current
    const total  = totalRef.current
    if (!pathEl || total === 0) return
    const next = Math.max(0, Math.min(total, progressRef.current + delta * sensitivity))
    progressRef.current = next
    const pt = pathEl.getPointAtLength(next)
    setHandlePos({ x: pt.x, y: pt.y })
    setDisplayProgress(next)
    if (!completedRef.current && next >= total * completionThreshold) {
      completedRef.current = true
      setIsComplete(true)
      try { navigator.vibrate?.(40) } catch { /* ignore */ }
      onComplete?.()
    }
  }, [sensitivity, completionThreshold, onComplete])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      e.preventDefault()
      advanceProgress(e.movementX + e.movementY)
    }
    svg.addEventListener('pointermove', onMove, { passive: false })
    return () => svg.removeEventListener('pointermove', onMove)
  }, [advanceProgress])

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    e.preventDefault()
    svg.setPointerCapture(e.pointerId)
    draggingRef.current    = true
    pointerTypeRef.current = e.pointerType
    setIsGrabbing(true)
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    draggingRef.current = false
    setIsGrabbing(false)
    const svg = svgRef.current
    if (svg?.hasPointerCapture(e.pointerId)) svg.releasePointerCapture(e.pointerId)
  }, [])

  const handleRetry = useCallback(() => {
    const pathEl = measurePathRef.current
    if (!pathEl || totalRef.current === 0) return
    progressRef.current  = 0
    completedRef.current = false
    draggingRef.current  = false
    setDisplayProgress(0)
    setIsComplete(false)
    setIsGrabbing(false)
    const pt = pathEl.getPointAtLength(0)
    setHandlePos({ x: pt.x, y: pt.y })
  }, [])

  const total      = totalRef.current
  const dashoffset = total > 0 ? total - displayProgress : 0
  const pct        = total > 0 ? Math.round((displayProgress / total) * 100) : 0
  const isStarting = pct < 5
  const handleR    = pointerTypeRef.current === 'touch' ? 6.5 : 4.5

  return (
    <div className="flex flex-col items-center gap-3 w-full select-none" style={{ maxWidth: 340 }}>
      <div className="flex items-center justify-between w-full px-1">
        <span className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: isComplete ? C_SUCCESS : C_PROGRESS }}>
          {isComplete ? '\\u2705 Done!' : '\\u270d\\ufe0f  Trace'}
        </span>
        <span className="text-xs font-mono tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {pct}%
        </span>
      </div>
      <div className="relative w-full rounded-2xl overflow-hidden" style={{
        aspectRatio: '1', background: '#13122a',
        border: \`2px solid \${isComplete ? C_SUCCESS : 'rgba(108,123,175,0.3)'}\`,
        boxShadow: isComplete ? \`0 0 28px \${C_SUCCESS}55\` : '0 8px 32px rgba(0,0,0,0.45)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        cursor: isGrabbing ? 'grabbing' : 'grab',
      }}>
        <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-full block"
          preserveAspectRatio="xMidYMid meet"
          aria-label={\`Trace the Brahmi letter \${letter.label}\`}
          style={{ touchAction: 'none', userSelect: 'none' }}
          onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          <defs>
            <pattern id="pst-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
            </pattern>
            <filter id="pst-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <path ref={measurePathRef} d={letter.path} fill="none" stroke="none" />
          </defs>
          <rect width="100" height="100" fill="url(#pst-grid)" />
          <path d={letter.path} fill="none" stroke={C_GHOST} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={letter.path} fill="none" stroke={C_GUIDE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 6" />
          {total > 0 && (
            <path d={letter.path} fill="none" stroke={isComplete ? C_SUCCESS : C_PROGRESS}
              strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={total} strokeDashoffset={dashoffset}
              style={{ transition: 'stroke 0.4s ease' }} />
          )}
          {handlePos && isStarting && (
            <circle cx={handlePos.x} cy={handlePos.y} r={3.5}
                    fill={C_START} opacity={0.85}
                    style={{ animation: 'pstPulse 1.1s ease-in-out infinite' }} />
          )}
          {handlePos && (<>
            <circle cx={handlePos.x} cy={handlePos.y} r={handleR + 5}
                    fill="transparent" style={{ cursor: 'grab' }} />
            <circle id="pst-handle" cx={handlePos.x} cy={handlePos.y} r={handleR}
                    fill={isGrabbing ? C_HANDLE_ACTIVE : (isComplete ? C_SUCCESS : C_HANDLE)}
                    stroke={C_WHITE} strokeWidth="1.5" filter="url(#pst-glow)"
                    style={{ transition: 'fill 0.15s ease', cursor: isGrabbing ? 'grabbing' : 'grab' }} />
          </>)}
          {isComplete && handlePos && (
            <g style={{ animation: 'pstPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <circle cx={handlePos.x} cy={handlePos.y} r={handleR + 3}
                      fill={C_SUCCESS} opacity={0.25} />
              <text x={handlePos.x} y={handlePos.y} textAnchor="middle"
                    dominantBaseline="central" fontSize="5" fill="white" fontWeight="900">\\u2713</text>
            </g>
          )}
        </svg>
        {isComplete && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
               style={{ animation: 'pstFadeIn 0.35s ease 0.15s both' }}>
            <div className="px-6 py-3 rounded-2xl text-center"
                 style={{ background: 'rgba(19,18,42,0.82)', backdropFilter: 'blur(8px)',
                          border: \`1px solid \${C_SUCCESS}55\` }}>
              <p className="text-2xl mb-1">\\ud83c\\udf1f</p>
              <p className="text-sm font-bold tracking-wide" style={{ color: C_SUCCESS }}>Traced!</p>
            </div>
          </div>
        )}
        {!isComplete && isStarting && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none"
               style={{ animation: 'pstPulse 2s ease-in-out infinite' }}>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>drag the circle \\u2192</span>
          </div>
        )}
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full" style={{
          width: \`\${pct}%\`,
          background: isComplete ? C_SUCCESS : 'linear-gradient(90deg,#534AB7,#7F77DD)',
          transition: 'width 0.08s linear'
        }} />
      </div>
      <div className="flex gap-2 w-full">
        <button id="pst-retry" onClick={handleRetry}
          className="flex-1 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)',
                   border: '1px solid rgba(255,255,255,0.1)' }}>
          \\u21a9 Retry
        </button>
        {isComplete && (
          <button id="pst-continue" onClick={onComplete}
            className="flex-[2] py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: C_SUCCESS, color: '#fff' }}>
            Continue \\u2192
          </button>
        )}
      </div>
      <style>{\`
        @keyframes pstPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes pstPopIn { from{opacity:0;transform:scale(0.3)} to{opacity:1;transform:scale(1)} }
        @keyframes pstFadeIn { from{opacity:0} to{opacity:1} }
      \`}</style>
    </div>
  )
}
`;

fs.writeFileSync(
  path.join(__dirname, '../components/PathSliderTracer/index.tsx'),
  content,
  'utf8'
);
console.log('Written', content.length, 'chars');
