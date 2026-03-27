'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface LessonTracerProps {
    letterSymbol: string
    onComplete: () => void
    // We keep strokes prop optional to avoid breaking existing call immediately, but we won't really use it for validation
    strokes?: any[]
}

export default function LessonTracer({ letterSymbol, onComplete }: LessonTracerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const bgCanvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [interactionCount, setInteractionCount] = useState(0) // Quantity of "draw" events
    const [hasCompleted, setHasCompleted] = useState(false)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    const [showCursor, setShowCursor] = useState(false)
    
    // Store user strokes separately
    const userStrokesRef = useRef<{x: number, y: number}[][]>([])
    const currentStrokeRef = useRef<{x: number, y: number}[]>([])

    // New state for summary and calculation
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [isCalculating, setIsCalculating] = useState(false)
    const [accuracy, setAccuracy] = useState(0)

    // Bounds tracking for heuristic accuracy
    const boundsRef = useRef({ minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })

    // Config
    const MIN_INTERACTION = 50 // Lowered slightly to allow simple letters
    const STROKE_COLOR = "#FFFFFF" // White chalk
    const STROKE_WIDTH = 8
    const GUIDE_OPACITY = 0.25

    // Initialize Canvas
    useEffect(() => {
        if (hasSubmitted || isCalculating) return

        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext('2d')
        const bgCanvas = bgCanvasRef.current
        const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null
        if (!ctx) return

        // Handle high DPR for sharp rendering
        const dpr = window.devicePixelRatio || 1
        const rect = container.getBoundingClientRect()

        // Setup foreground canvas (user strokes)
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
        ctx.setTransform(1,0,0,1,0,0)
        ctx.scale(dpr, dpr)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = STROKE_COLOR
        ctx.lineWidth = STROKE_WIDTH

        // Setup background canvas (guide)
        if (bgCanvas && bgCtx) {
            bgCanvas.width = rect.width * dpr
            bgCanvas.height = rect.height * dpr
            bgCanvas.style.width = `${rect.width}px`
            bgCanvas.style.height = `${rect.height}px`
            bgCtx.setTransform(1,0,0,1,0,0)
            bgCtx.scale(dpr, dpr)
            // Draw guide on background so user strokes remain separate
            drawGuide(bgCtx, rect.width, rect.height)
        }

        // Handle resize (simple reset for now)
        const handleResize = () => {
            if (!containerRef.current || !canvasRef.current) return
            const newRect = containerRef.current.getBoundingClientRect()
            canvas.width = newRect.width * dpr
            canvas.height = newRect.height * dpr
            ctx.setTransform(1,0,0,1,0,0)
            ctx.scale(dpr, dpr)
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.strokeStyle = STROKE_COLOR
            ctx.lineWidth = STROKE_WIDTH
            if (bgCanvas && bgCtx) {
                bgCanvas.width = newRect.width * dpr
                bgCanvas.height = newRect.height * dpr
                bgCtx.setTransform(1,0,0,1,0,0)
                bgCtx.scale(dpr, dpr)
                drawGuide(bgCtx, newRect.width, newRect.height)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [letterSymbol, hasSubmitted, isCalculating])

    const drawGuide = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.save()
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = `rgba(255, 255, 255, ${GUIDE_OPACITY})`
        ctx.font = `bold ${Math.min(width, height) * 0.5}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(letterSymbol, width / 2, height / 2 + 20) // +20 for visual centering
        ctx.restore()
    }

    const updateBounds = (x: number, y: number) => {
        const b = boundsRef.current
        b.minX = Math.min(b.minX, x)
        b.maxX = Math.max(b.maxX, x)
        b.minY = Math.min(b.minY, y)
        b.maxY = Math.max(b.maxY, y)
    }

    // Drawing Handlers
    const startDrawing = (e: React.PointerEvent) => {
        e.preventDefault()
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Get relative pos
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        ctx.beginPath()
        ctx.moveTo(x, y)
        setIsDrawing(true)
        updateBounds(x, y)
        
        // Start new stroke
        currentStrokeRef.current = [{x, y}]
    }

    const draw = (e: React.PointerEvent) => {
        if (!isDrawing) return
        e.preventDefault() // Stop scrolling

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Update cursor position
        setCursorPos({ x: e.clientX, y: e.clientY })

        ctx.lineTo(x, y)
        ctx.stroke()
        updateBounds(x, y)
        
        // Add to current stroke
        currentStrokeRef.current.push({x, y})

        // Track interaction
        setInteractionCount(prev => {
            const newVal = prev + 1
            if (newVal > MIN_INTERACTION && !hasCompleted) {
                setHasCompleted(true)
            }
            return newVal
        })
    }

    const handleMouseMove = (e: React.PointerEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
            setCursorPos({ x: e.clientX, y: e.clientY })
        }
    }

    const stopDrawing = () => {
        if (!isDrawing) return
        setIsDrawing(false)
        const ctx = canvasRef.current?.getContext('2d')
        ctx?.closePath()
        
        // Save completed stroke
        if (currentStrokeRef.current.length > 0) {
            userStrokesRef.current.push([...currentStrokeRef.current])
            currentStrokeRef.current = []
        }
    }

    // Controls
    const handleClear = () => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = container.getBoundingClientRect()
        ctx.clearRect(0, 0, rect.width, rect.height)
        // redraw guide on background canvas
        const bgCanvas = bgCanvasRef.current
        const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null
        if (bgCtx) drawGuide(bgCtx, rect.width, rect.height)
        setInteractionCount(0)
        setHasCompleted(false)
        boundsRef.current = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
        userStrokesRef.current = []
        currentStrokeRef.current = []
    }

    const calculateRealAccuracy = (): number => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return 0

        const ctx = canvas.getContext('2d')
        if (!ctx) return 0

        const rect = container.getBoundingClientRect()

        // Check if user drew anything
        if (interactionCount < 20) return 30

        // Save current state and get image data WITHOUT the guide
        ctx.save()
        // Clear background to get only user strokes
        const userImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        ctx.restore()
        
        // Use the background guide canvas as the reference (ensures same rendering)
        const bgCanvas = bgCanvasRef.current
        if (!bgCanvas) {
            console.error('No background guide canvas found')
            return 50
        }

        const refCtx = bgCanvas.getContext('2d')
        if (!refCtx) return 50

        const refImageData = refCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height)

        // Create set of reference pixel positions for fast lookup
        // The guide is drawn at low opacity, so check both alpha and luminance
        const refPixelSet = new Set<string>()
        let refMinX = Infinity, refMinY = Infinity, refMaxX = -Infinity, refMaxY = -Infinity

        for (let y = 0; y < canvas.height; y += 2) {
            for (let x = 0; x < canvas.width; x += 2) {
                const idx = (y * canvas.width + x) * 4
                const rRef = refImageData.data[idx]
                const gRef = refImageData.data[idx + 1]
                const bRef = refImageData.data[idx + 2]
                const aRef = refImageData.data[idx + 3]
                const lumRef = (rRef + gRef + bRef) / 3

                // Consider it a guide pixel if it has noticeable alpha or high luminance
                if (aRef > 20 || lumRef > 140) {
                    refPixelSet.add(`${x},${y}`)
                    refMinX = Math.min(refMinX, x)
                    refMinY = Math.min(refMinY, y)
                    refMaxX = Math.max(refMaxX, x)
                    refMaxY = Math.max(refMaxY, y)
                }
            }
        }

        console.log('Reference Character:', {
            letterSymbol,
            refPixelsFound: refPixelSet.size,
            canvasSize: `${canvas.width}x${canvas.height}`,
            rectSize: `${rect.width}x${rect.height}`
        })

        if (refPixelSet.size === 0) {
            console.error('No reference pixels found! Character may not be rendering.')
            return 50
        }

        // Count user pixels and how many are near reference pixels
        let userPixelCount = 0
        let matchingPixelCount = 0
        const tolerance = 8  // pixels distance to consider a "match"

        for (let y = 0; y < canvas.height; y += 2) {
            for (let x = 0; x < canvas.width; x += 2) {
                const idx = (y * canvas.width + x) * 4
                const r = userImageData.data[idx]
                const g = userImageData.data[idx + 1]
                const b = userImageData.data[idx + 2]
                const alpha = userImageData.data[idx + 3]
                
                // Check if this is a user-drawn bright pixel (stroke)
                // Use luminance and alpha threshold to be robust to antialiasing
                const luminance = (r + g + b) / 3
                if (luminance > 200 && alpha > 100) {
                    userPixelCount++
                    
                    // Check if any reference pixel is within tolerance
                    let foundMatch = false
                    for (let dy = -tolerance; dy <= tolerance; dy += 2) {
                        for (let dx = -tolerance; dx <= tolerance; dx += 2) {
                            if (refPixelSet.has(`${x + dx},${y + dy}`)) {
                                foundMatch = true
                                break
                            }
                        }
                        if (foundMatch) break
                    }
                    
                    if (foundMatch) matchingPixelCount++
                }
            }
        }

        const matchRatePercent = userPixelCount > 0 ? (matchingPixelCount / userPixelCount) * 100 : 0

        console.log('Tracing Analysis:', {
            userPixels: userPixelCount,
            matchingPixels: matchingPixelCount,
            refPixels: refPixelSet.size,
            matchRate: matchRatePercent.toFixed(1) + '%'
        })

        if (userPixelCount === 0) return 30

        // Calculate accuracy using stored strokes
        const strokes = userStrokesRef.current

        // Basic checks
        if (strokes.length === 0 || interactionCount < 20) return 30

        const b = boundsRef.current
        const drawnW = b.maxX - b.minX
        const drawnH = b.maxY - b.minY

        if (drawnW === 0 || drawnH === 0) return 30

        // Expected character center based on reference bounding box
        const expectedCenterX = refPixelSet.size > 0 ? (refMinX + refMaxX) / 2 : rect.width / 2
        const expectedCenterY = refPixelSet.size > 0 ? (refMinY + refMaxY) / 2 : rect.height / 2

        // Actual drawing center
        const actualCenterX = (b.minX + b.maxX) / 2
        const actualCenterY = (b.minY + b.maxY) / 2

        // 1. Centering Score (30 points)
        const centerOffsetX = Math.abs(actualCenterX - expectedCenterX)
        const centerOffsetY = Math.abs(actualCenterY - expectedCenterY)
        const maxOffset = Math.min(rect.width, rect.height) * 0.25
        const centerScore = Math.max(0, 30 - ((centerOffsetX + centerOffsetY) / maxOffset) * 15)

        // 2. Size Score (25 points) based on reference bounding box
        const refBoxW = refPixelSet.size > 0 ? (refMaxX - refMinX) : Math.min(rect.width, rect.height) * 0.5
        const refBoxH = refPixelSet.size > 0 ? (refMaxY - refMinY) : Math.min(rect.width, rect.height) * 0.5
        const expectedMin = Math.min(refBoxW, refBoxH) * 0.7
        const expectedMax = Math.max(refBoxW, refBoxH) * 1.6
        const avgSize = (drawnW + drawnH) / 2
        let sizeScore = 0
        if (avgSize >= expectedMin && avgSize <= expectedMax) {
            sizeScore = 25
        } else if (avgSize < expectedMin) {
            sizeScore = (avgSize / expectedMin) * 25
        } else {
            sizeScore = Math.max(0, 25 - ((avgSize - expectedMax) / expectedMax) * 10)
        }

        // 3. Stroke Quality (25 points)
        let totalStrokeLength = 0
        for (const stroke of strokes) {
            for (let i = 1; i < stroke.length; i++) {
                const dx = stroke[i].x - stroke[i-1].x
                const dy = stroke[i].y - stroke[i-1].y
                totalStrokeLength += Math.sqrt(dx * dx + dy * dy)
            }
        }
        const strokeScore = Math.min(25, (totalStrokeLength / Math.max(1, expectedMax)) * 8)

        // 4. Coverage Score (20 points)
        const interactionScore = Math.min(20, (interactionCount / 150) * 20)

        const totalScore = centerScore + sizeScore + strokeScore + interactionScore

        // Incorporate match rate (how many user pixels were near reference) into final score
        // matchRatePercent already calculated above at line 326

        // Combine heuristics and pixel-match. Heuristics weighted 60%, pixel-match 40%.
        const combinedScore = (totalScore * 0.6) + (matchRatePercent * 0.4)

        console.log('Scoring Breakdown:', {
            strokes: strokes.length,
            interactions: interactionCount,
            bounds: `${drawnW.toFixed(0)}x${drawnH.toFixed(0)}`,
            center: `${actualCenterX.toFixed(0)},${actualCenterY.toFixed(0)}`,
            centerScore: centerScore.toFixed(1),
            sizeScore: sizeScore.toFixed(1),
            strokeScore: strokeScore.toFixed(1),
            interactionScore: interactionScore.toFixed(1),
            totalScore: totalScore.toFixed(1),
            matchRate: matchRatePercent.toFixed(1) + '%',
            combinedScore: combinedScore.toFixed(1)
        })

        // Final score is the rounded combined score, clamped 0-100 (no random variance)
        const finalScore = Math.max(0, Math.min(100, Math.round(combinedScore)))

        return finalScore
    }

    const handleSubmit = async () => {
        setIsCalculating(true)

        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Calculate real accuracy based on pixel comparison
        const calculatedAccuracy = calculateRealAccuracy()
        setAccuracy(calculatedAccuracy)

        setIsCalculating(false)
        setHasSubmitted(true)
    }

    if (isCalculating) {
        return (
            <div className="flex items-center justify-center w-full min-h-[600px] bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 rounded-3xl border-8 border-amber-900 p-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="text-6xl mb-4"
                >
                    ✨
                </motion.div>
                <h3 className="text-white text-2xl font-bold animate-pulse ml-4">गुरुजी आपकी लिखावट देख रहे हैं...</h3>
            </div>
        )
    }

    if (hasSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-[600px] animate-fadeIn bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 rounded-3xl border-8 border-amber-900 p-12">
                <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-white/20 w-full max-w-md text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="text-6xl mb-6"
                    >
                        🏆
                    </motion.div>

                    <h2 className="text-yellow-300 text-3xl font-bold mb-2">बहुत बढ़िया!</h2>
                    <p className="text-white/80 mb-8">आपने अक्षर को अच्छी तरह लिखा है।</p>

                    <div className="bg-black/50 rounded-2xl p-6 mb-8 border border-white/30">
                        <div className="text-sm text-yellow-200 uppercase tracking-widest mb-2 font-bold">Accuracy</div>
                        <div className="text-5xl font-bold text-white flex justify-center items-center gap-2">
                            {accuracy}<span className="text-2xl text-yellow-400">%</span>
                        </div>
                    </div>

                    <button
                        onClick={onComplete}
                        className="w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-[#58CC02] text-white shadow-[0_4px_0_#46a302] active:translate-y-[2px] active:shadow-none hover:brightness-110 transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto px-4">
                {/* Blackboard Canvas */}
                <div
                    ref={containerRef}
                    className="relative w-full aspect-[4/3] bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 rounded-2xl shadow-2xl border-8 border-amber-900"
                >
                    {/* Wooden frame effect */}
                    <div className="absolute inset-0 rounded-xl border-4 border-amber-950/50 pointer-events-none" />
                    
                    {/* Background guide canvas */}
                    <canvas
                        ref={bgCanvasRef}
                        className="absolute inset-0 w-full h-full rounded-lg pointer-events-none"
                        aria-hidden
                    />

                    {/* Foreground drawing canvas */}
                    <canvas
                        ref={canvasRef}
                        className="relative w-full h-full rounded-lg"
                        onPointerDown={startDrawing}
                        onPointerMove={(e) => {
                            handleMouseMove(e);
                            draw(e);
                        }}
                        onPointerUp={stopDrawing}
                        onPointerLeave={stopDrawing}
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 mt-6">
                    <button
                        onClick={handleClear}
                        className="flex-1 py-3 px-6 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-colors border-2 border-red-300"
                    >
                        🧹 साफ़ करें
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!hasCompleted}
                        className={`
                            flex-[2] py-4 px-6 rounded-xl font-bold uppercase tracking-widest transition-all
                            ${hasCompleted
                                ? 'bg-[#58CC02] text-white shadow-[0_4px_0_#46a302] active:translate-y-[2px] active:shadow-none hover:brightness-110'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                        `}
                    >
                        ✓ जाँचें
                    </button>
                </div>

                {/* Hint */}
                <p className="mt-4 text-center text-sm text-gray-300 font-medium">
                    {hasCompleted ? "✨ तैयार है! जाँचें बटन दबाएं" : "✍️ ऊपर दिए गए अक्षर को लिखें"}
                </p>
        </div>
    )
}
