"use client"

import React, { useRef, useState, useEffect } from 'react'

// Log at module load time
console.log('[TracerKonva] Module loading...');

let Stage: any, Layer: any, Line: any, KonvaText: any;
try {
  const konvaModule = require('react-konva');
  Stage = konvaModule.Stage;
  Layer = konvaModule.Layer;
  Line = konvaModule.Line;
  KonvaText = konvaModule.Text;
  console.log('[TracerKonva] react-konva imported successfully');
} catch (err) {
  console.error('[TracerKonva] ERROR importing react-konva:', err);
}

interface TracerKonvaProps {
  character: string          // The letter/character to trace
  width?: number
  height?: number
  onScoreComplete?: (score: number) => void
  onContinue?: () => void    // Called when user clicks Continue after seeing score
  showControls?: boolean     // Whether to show Clear/Exit controls (default: true)
}

export default function TracerKonva({ 
  character, 
  width = 340, 
  height = 340, 
  onScoreComplete,
  onContinue,
  showControls = true
}: TracerKonvaProps) {
  console.log('[TracerKonva] ========================================');
  console.log('[TracerKonva] Component function called');
  console.log('[TracerKonva] Props:', { character, width, height, hasCallback: !!onScoreComplete });
  
  // Check if we're in browser
  useEffect(() => {
    console.log('[TracerKonva] useEffect: Component MOUNTED in browser');
    console.log('[TracerKonva] window exists:', typeof window !== 'undefined');
    console.log('[TracerKonva] Stage component exists:', !!Stage);
    
    return () => {
      console.log('[TracerKonva] useEffect cleanup: Component UNMOUNTING');
    };
  }, []);
  
  const [lines, setLines] = useState<number[][]>([])
  const linesRef = useRef<number[][]>([]) // Keep a ref to avoid stale closure
  const isDrawing = useRef(false)
  const stageRef = useRef<any>(null)
  const [currentLine, setCurrentLine] = useState<number[]>([])
  const currentLineRef = useRef<number[]>([])
  const [lastScore, setLastScore] = useState<number | null>(null)
  const [isScoring, setIsScoring] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [showRetryMessage, setShowRetryMessage] = useState(false)

  // Sync refs with state
  useEffect(() => {
    linesRef.current = lines
    console.log('[TracerKonva] Lines state updated, count:', lines.length)
  }, [lines])

  useEffect(() => {
    currentLineRef.current = currentLine
  }, [currentLine])

  // Reset when character changes
  useEffect(() => {
    console.log('[TracerKonva] Character changed, resetting state')
    setLines([])
    linesRef.current = []
    setCurrentLine([])
    currentLineRef.current = []
    setLastScore(null)
    setHasDrawn(false)
    setShowRetryMessage(false)
  }, [character])

  // Auto-continue when score is calculated (only if score is good enough)
  useEffect(() => {
    if (lastScore !== null && onContinue) {
      const PASSING_SCORE = 90 // Minimum score to continue - requires excellent tracing
      
      if (lastScore >= PASSING_SCORE) {
        console.log('[TracerKonva] Score passed (', lastScore, '), auto-continuing...')
        // Small delay so user sees something happened
        const timer = setTimeout(() => {
          onContinue()
        }, 800)
        return () => clearTimeout(timer)
      } else {
        console.log('[TracerKonva] Score too low (', lastScore, '), showing retry message')
        setShowRetryMessage(true)
        // Hide retry message after a delay and reset for another attempt
        const timer = setTimeout(() => {
          setShowRetryMessage(false)
          setLastScore(null)
          setIsScoring(false)
        }, 2500)
        return () => clearTimeout(timer)
      }
    }
  }, [lastScore, onContinue])

  // Check if a point is within character bounds by checking pixel color
  const isPointOnCharacter = (x: number, y: number): boolean => {
    const stage = stageRef.current
    if (!stage) return false
    
    // Get the layer and check if position intersects with the guide text
    const layer = stage.findOne('Layer')
    if (!layer) return false
    
    // Check if there's the guide text shape at this position
    const shape = layer.getIntersection({ x, y })
    
    // Only allow drawing if pointer is over the guide character - no drawing outside allowed
    return shape && shape.className === 'Text' && shape.name() === 'guideText'
  }

  const handlePointerDown = (e: any) => {
    console.log('[TracerKonva] === POINTER DOWN ===')
    e.evt?.preventDefault?.()
    const stage = e.target?.getStage?.()
    console.log('[TracerKonva] Stage object:', stage ? 'exists' : 'null')
    const pos = stage?.getPointerPosition?.()
    console.log('[TracerKonva] Pointer position:', pos)
    
    if (pos && isPointOnCharacter(pos.x, pos.y)) {
      isDrawing.current = true
      const newLine = [pos.x, pos.y]
      setCurrentLine(newLine)
      currentLineRef.current = newLine
      console.log('[TracerKonva] Started new line at:', pos.x, pos.y)
    } else {
      console.log('[TracerKonva] Point not on character, ignoring')
    }
  }

  const handlePointerMove = (e: any) => {
    if (!isDrawing.current) return
    e.evt?.preventDefault?.()
    const stage = e.target?.getStage?.()
    const pos = stage?.getPointerPosition?.()
    
    if (pos) {
      // Continue drawing continuously - add all points for smooth drawing
      setCurrentLine(prev => {
        const updated = [...prev, pos.x, pos.y]
        currentLineRef.current = updated
        return updated
      })
    }
  }

  const handlePointerUp = () => {
    console.log('[TracerKonva] === POINTER UP ===')
    console.log('[TracerKonva] isDrawing:', isDrawing.current)
    console.log('[TracerKonva] currentLineRef length:', currentLineRef.current.length)
    
    if (!isDrawing.current) {
      console.log('[TracerKonva] Not drawing, ignoring pointerUp')
      return
    }
    isDrawing.current = false
    
    const lineToAdd = [...currentLineRef.current]
    console.log('[TracerKonva] Line to add has', lineToAdd.length, 'values (', lineToAdd.length/2, 'points)')
    
    if (lineToAdd.length >= 4) { // At least 2 points (x,y pairs)
      setLines(prev => {
        const updated = [...prev, lineToAdd]
        linesRef.current = updated
        console.log('[TracerKonva] ✓ Added line! Total lines now:', updated.length)
        return updated
      })
      setHasDrawn(true)
      console.log('[TracerKonva] hasDrawn set to true')
    } else {
      console.log('[TracerKonva] Line too short, not adding')
    }
    setCurrentLine([])
    currentLineRef.current = []
  }

  const clear = () => {
    console.log('[TracerKonva] === CLEAR ===')
    setLines([])
    linesRef.current = []
    setCurrentLine([])
    currentLineRef.current = []
    setLastScore(null)
    setHasDrawn(false)
    setShowRetryMessage(false)
  }

  const checkTracing = async () => {
    console.log('[TracerKonva] === CHECK TRACING ===')
    const currentLines = linesRef.current
    console.log('[TracerKonva] Lines from ref:', currentLines.length)
    console.log('[TracerKonva] Lines from state:', lines.length)
    
    if (currentLines.length === 0) {
      console.log('[TracerKonva] No lines to check!')
      alert('Please draw the character first!')
      return
    }

    // Log all lines
    currentLines.forEach((line, i) => {
      console.log(`[TracerKonva] Line ${i}: ${line.length} values (${line.length/2} points)`)
    })

    setIsScoring(true)
    console.log('[TracerKonva] Set isScoring to true')

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    // Calculate score based on stroke coverage and positioning
    console.log('[TracerKonva] Calling calculateScore...')
    const score = calculateScore(currentLines)
    console.log('[TracerKonva] === FINAL SCORE:', score, '===')
    
    setIsScoring(false)

    if (onScoreComplete) {
      console.log('[TracerKonva] Calling onScoreComplete callback with score:', score)
      onScoreComplete(score)
    } else {
      console.log('[TracerKonva] No onScoreComplete callback provided')
    }

    // Skip showing score result - directly go to next letter
    if (onContinue) {
      console.log('[TracerKonva] Skipping score display, calling onContinue directly')
      onContinue()
    }
  }

  const calculateScore = (linesToScore: number[][]): number => {
    console.log('[TracerKonva] === CALCULATE SCORE ===')
    console.log('[TracerKonva] Input lines count:', linesToScore.length)
    
    // Get all drawn points
    const allPoints: { x: number; y: number }[] = []
    for (const line of linesToScore) {
      for (let i = 0; i < line.length; i += 2) {
        if (line[i] !== undefined && line[i+1] !== undefined) {
          allPoints.push({ x: line[i], y: line[i + 1] })
        }
      }
    }

    console.log('[TracerKonva] Total points extracted:', allPoints.length)
    if (allPoints.length > 0) {
      console.log('[TracerKonva] First point:', allPoints[0])
      console.log('[TracerKonva] Last point:', allPoints[allPoints.length - 1])
    }

    if (allPoints.length < 5) {
      console.log('[TracerKonva] Too few points (<5), returning minimum score 15')
      return 15
    }

    // Calculate bounding box of user's drawing
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const p of allPoints) {
      minX = Math.min(minX, p.x)
      minY = Math.min(minY, p.y)
      maxX = Math.max(maxX, p.x)
      maxY = Math.max(maxY, p.y)
    }

    console.log('[TracerKonva] Bounding box:', { minX, minY, maxX, maxY })

    const drawnWidth = maxX - minX
    const drawnHeight = maxY - minY
    const drawnCenterX = (minX + maxX) / 2
    const drawnCenterY = (minY + maxY) / 2

    console.log('[TracerKonva] Drawn size:', drawnWidth, 'x', drawnHeight)
    console.log('[TracerKonva] Drawn center:', drawnCenterX, drawnCenterY)

    // Expected center (middle of canvas)
    const expectedCenterX = width / 2
    const expectedCenterY = height / 2

    console.log('[TracerKonva] Expected center:', expectedCenterX, expectedCenterY)

    // Expected size (character takes up ~60% of canvas)
    const expectedSize = Math.min(width, height) * 0.6
    console.log('[TracerKonva] Expected size:', expectedSize)

    // 1. Centering Score (30 points max)
    const centerOffsetX = Math.abs(drawnCenterX - expectedCenterX)
    const centerOffsetY = Math.abs(drawnCenterY - expectedCenterY)
    const maxAllowedOffset = Math.min(width, height) * 0.35
    const centerScore = Math.max(0, 30 - ((centerOffsetX + centerOffsetY) / maxAllowedOffset) * 15)
    console.log('[TracerKonva] Center offset:', centerOffsetX, centerOffsetY, '-> centerScore:', centerScore)

    // 2. Size Score (25 points max)
    const avgDrawnSize = (drawnWidth + drawnHeight) / 2
    const sizeRatio = avgDrawnSize / expectedSize
    let sizeScore = 0
    if (sizeRatio >= 0.3 && sizeRatio <= 2.0) {
      sizeScore = 25 - Math.abs(1 - sizeRatio) * 15
    } else if (sizeRatio < 0.3) {
      sizeScore = sizeRatio * 40
    } else {
      sizeScore = Math.max(0, 25 - (sizeRatio - 2.0) * 8)
    }
    sizeScore = Math.max(5, sizeScore)
    console.log('[TracerKonva] Size ratio:', sizeRatio, '-> sizeScore:', sizeScore)

    // 3. Stroke Density Score (25 points max)
    const expectedPoints = 100
    const densityRatio = Math.min(1, allPoints.length / expectedPoints)
    const densityScore = Math.max(5, densityRatio * 25)
    console.log('[TracerKonva] Density ratio:', densityRatio, '-> densityScore:', densityScore)

    // 4. Coverage/Completeness Score (20 points max)
    const aspectRatio = drawnWidth / (drawnHeight || 1)
    let coverageScore = 20
    if (aspectRatio < 0.2 || aspectRatio > 5) {
      coverageScore = 12
    }
    console.log('[TracerKonva] Aspect ratio:', aspectRatio, '-> coverageScore:', coverageScore)

    const totalScore = Math.round(centerScore + sizeScore + densityScore + coverageScore)
    const finalScore = Math.max(15, Math.min(100, totalScore))

    console.log('[TracerKonva] === SCORE SUMMARY ===')
    console.log('[TracerKonva] centerScore:', centerScore.toFixed(1))
    console.log('[TracerKonva] sizeScore:', sizeScore.toFixed(1))
    console.log('[TracerKonva] densityScore:', densityScore.toFixed(1))
    console.log('[TracerKonva] coverageScore:', coverageScore.toFixed(1))
    console.log('[TracerKonva] TOTAL:', totalScore, '-> FINAL:', finalScore)

    return finalScore
  }

  // Show scoring state
  if (isScoring) {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 border-8 border-amber-900 rounded-2xl p-8 gap-4 shadow-2xl" style={{ width, height }}>
        <div className="text-4xl animate-spin">✨</div>
        <p className="text-amber-100 font-medium">Checking your trace...</p>
      </div>
    )
  }

  // Show retry message if score was too low
  if (showRetryMessage) {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-orange-900 via-red-800 to-orange-900 border-8 border-amber-900 rounded-2xl p-8 gap-4 shadow-2xl" style={{ width, height }}>
        <div className="text-5xl">💪</div>
        <h3 className="text-2xl font-bold text-amber-100">Keep Practicing!</h3>
        <p className="text-amber-200/90 text-center">Try to trace more carefully following the guide</p>
        <div className="text-sm text-amber-300/70 animate-pulse">Resetting canvas...</div>
      </div>
    )
  }

  // Check if Konva components are available
  if (!Stage || !Layer || !Line || !KonvaText) {
    console.error('[TracerKonva] Konva components not loaded!', { Stage: !!Stage, Layer: !!Layer, Line: !!Line, KonvaText: !!KonvaText });
    return (
      <div className="flex flex-col items-center justify-center bg-red-50 border-2 border-red-300 rounded-2xl p-8 gap-4" style={{ width, height }}>
        <p className="text-red-600 font-medium">Error: Konva failed to load</p>
        <p className="text-red-400 text-sm">Check console for details</p>
      </div>
    );
  }

  console.log('[TracerKonva] Rendering main canvas UI');
  console.log('[TracerKonva] Current state - lines:', lines.length, 'hasDrawn:', hasDrawn, 'currentLine length:', currentLine.length);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas container - Green blackboard style */}
      <div 
        style={{ width, height, touchAction: 'none' }} 
        className="border-8 border-amber-900 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 shadow-2xl"
      >
        <Stage
          width={width}
          height={height}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          ref={stageRef}
          style={{ touchAction: 'none' }}
        >
          <Layer>
            {/* Invisible hit detection character (for constraining drawing) */}
            <KonvaText
              text={character}
              x={width / 2}
              y={height / 2}
              fontSize={Math.min(width, height) * 0.55}
              fontFamily="serif"
              fontStyle="bold"
              fill="rgba(0,0,0,0.01)"
              offsetX={Math.min(width, height) * 0.55 * 0.3}
              offsetY={Math.min(width, height) * 0.55 * 0.45}
              listening={true}
              name="guideText"
              strokeWidth={40}
              stroke="rgba(0,0,0,0.01)"
            />
            
            {/* Guide character (faint chalk) - centered manually */}
            <KonvaText
              text={character}
              x={width / 2}
              y={height / 2}
              fontSize={Math.min(width, height) * 0.55}
              fontFamily="serif"
              fontStyle="bold"
              fill="rgba(255, 255, 255, 0.15)"
              offsetX={Math.min(width, height) * 0.55 * 0.3}
              offsetY={Math.min(width, height) * 0.55 * 0.45}
              listening={false}
            />

            {/* User's completed strokes - chalk white */}
            {lines.map((ln, i) => (
              <Line 
                key={i} 
                points={ln} 
                stroke="#FFFFFF" 
                strokeWidth={6} 
                lineCap="round" 
                lineJoin="round" 
                tension={0.3}
                shadowColor="rgba(255,255,255,0.5)"
                shadowBlur={2}
              />
            ))}

            {/* Current stroke being drawn - chalk white */}
            {currentLine.length > 0 && (
              <Line 
                points={currentLine} 
                stroke="#FFFFFF" 
                strokeWidth={6} 
                lineCap="round" 
                lineJoin="round" 
                tension={0.3}
                shadowColor="rgba(255,255,255,0.5)"
                shadowBlur={2}
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Controls - amber/teal theme */}
      {showControls && (
        <>
          <div className="flex gap-3 w-full">
            <button
              onClick={clear}
              className="flex-1 px-4 py-2 text-sm text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors font-medium border border-amber-200"
            >
              🧹 Clear
            </button>
            <button
              onClick={onContinue}
              className="flex-1 px-4 py-2 text-sm font-bold rounded-lg transition-all bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-md active:translate-y-[1px]"
            >
              Exit →
            </button>
          </div>

          <p className="text-xs text-center text-emerald-700">
            ✍️ Trace the character "{character}"
          </p>
        </>
      )}
    </div>
  )
}
