'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Canvas, PencilBrush, Text } from 'fabric'
import { motion } from 'framer-motion'
import { scoreLetterTracing, type ScoringResult } from '@/lib/canvasScoring'
import CanvasDebugView from './CanvasDebugView'

interface CanvasBoardProps {
    traceCharacter: string
    onScoreComplete?: (result: ScoringResult) => void
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({ traceCharacter, onScoreComplete }) => {
    const canvasEl = useRef<HTMLCanvasElement>(null)
    const guideCanvasEl = useRef<HTMLCanvasElement>(null)
    const [canvas, setCanvas] = useState<Canvas | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [hasDrawn, setHasDrawn] = useState(false)
    const [isScoring, setIsScoring] = useState(false)
    const [score, setScore] = useState<ScoringResult | null>(null)
    const [showDebug, setShowDebug] = useState(false)

    useEffect(() => {
        if (!canvasEl.current) return

        // Create canvas
        const newCanvas = new Canvas(canvasEl.current, {
            isDrawingMode: true,
            width: 300,
            height: 300,
            backgroundColor: '#ffffff',
        })

        // Configure brush
        const brush = new PencilBrush(newCanvas)
        brush.width = 12
        brush.color = '#111827' // gray-900
        newCanvas.freeDrawingBrush = brush

        // Track when user draws
        const handleObjectAdded = () => {
            setHasDrawn(true)
        }

        newCanvas.on('object:added', handleObjectAdded)

        setCanvas(newCanvas)

        return () => {
            newCanvas.off('object:added', handleObjectAdded)
            newCanvas.dispose()
        }
    }, [])

    // Create hidden guide canvas for scoring reference
    useEffect(() => {
        if (!guideCanvasEl.current) return

        const guideCanvas = guideCanvasEl.current
        guideCanvas.width = 300
        guideCanvas.height = 300

        const ctx = guideCanvas.getContext('2d')
        if (!ctx) return

        // Fill with white background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, 300, 300)

        // Draw guide text (light gray - must match light color for detection)
        ctx.fillStyle = '#d1d5db' // gray-300 - more visible than gray-200 for detection
        ctx.font = 'bold 200px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(traceCharacter, 150, 160)

        console.log('Guide canvas initialized with letter:', traceCharacter);
    }, [traceCharacter])

    // Update character when props change or canvas is ready
    useEffect(() => {
        if (!canvas || !traceCharacter) return

        // Clear existing content 
        canvas.clear()

        // Restore background color
        canvas.backgroundColor = '#ffffff'

        // Add the character to trace (as light gray guide)
        const text = new Text(traceCharacter, {
            fontSize: 200,
            fontFamily: 'serif',
            fill: '#e5e7eb', // gray-200 for tracing guide
            selectable: false,
            evented: false,
            originX: 'center',
            originY: 'center',
            left: (canvas.width || 300) / 2,
            top: (canvas.height || 300) / 2 + 10, // slight offset for visual centering
        })

        canvas.add(text)
        canvas.renderAll()

        // Reset state
        setHasDrawn(false)
        setScore(null)
    }, [canvas, traceCharacter])

    const clearCanvas = () => {
        if (!canvas) return
        canvas.clear()
        canvas.backgroundColor = '#ffffff'

        // Re-add text
        const text = new Text(traceCharacter, {
            fontSize: 200,
            fontFamily: 'serif',
            fill: '#e5e7eb',
            selectable: false,
            evented: false,
            originX: 'center',
            originY: 'center',
            left: (canvas.width || 300) / 2,
            top: (canvas.height || 300) / 2 + 10,
        })
        canvas.add(text)
        canvas.renderAll()

        setHasDrawn(false)
        setScore(null)
    }

    const handleSubmit = async () => {
        if (!canvasEl.current || !guideCanvasEl.current || !hasDrawn) return

        setIsScoring(true)

        // Simulate brief delay for UX
        await new Promise((resolve) => setTimeout(resolve, 800))

        try {
            // Get the actual HTML canvas from Fabric's canvas wrapper
            const fabricCanvas = canvasEl.current;
            
            console.log('About to score:');
            console.log('- Fabric canvas element:', fabricCanvas);
            console.log('- Guide canvas element:', guideCanvasEl.current);

            // Score the tracing
            const result = scoreLetterTracing(guideCanvasEl.current, fabricCanvas)
            
            console.log('Score result:', result);
            
            setScore(result)

            // Notify parent component if callback provided
            if (onScoreComplete) {
                onScoreComplete(result)
            }
        } catch (err) {
            console.error('Scoring error:', err)
            setScore({
                percentage: 0,
                grade: 'Try Again',
                coverage: 0,
                precision: 0,
                details: {
                    referencePixels: 0,
                    studentPixels: 0,
                    correctPixels: 0,
                },
            })
        } finally {
            setIsScoring(false)
        }
    }

    // Show scoring result state
    if (score) {
        return (
            <div className="flex flex-col items-center gap-4 w-full animate-fadeIn">
                <div className="bg-white border-2 border-gray-300 rounded-xl p-8 text-center w-full max-w-sm">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        className="text-5xl mb-4"
                    >
                        {score.grade === 'Excellent' && '🌟'}
                        {score.grade === 'Very Good' && '⭐'}
                        {score.grade === 'Good' && '👍'}
                        {score.grade === 'Try Again' && '💪'}
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{score.grade}</h3>

                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="text-sm text-gray-600 uppercase tracking-widest mb-1 font-bold">
                            Accuracy
                        </div>
                        <div className="text-4xl font-bold text-blue-600 flex justify-center items-baseline gap-1">
                            {score.percentage}<span className="text-lg text-gray-600">%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-6">
                        <div className="bg-green-50 p-2 rounded">
                            <div className="text-xs text-gray-600 font-bold">Coverage</div>
                            <div className="text-lg font-bold text-green-600">{score.coverage}%</div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                            <div className="text-xs text-gray-600 font-bold">Precision</div>
                            <div className="text-lg font-bold text-purple-600">{score.precision}%</div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setScore(null)
                            clearCanvas()
                        }}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors mb-2"
                    >
                        Try Again
                    </button>

                    {onScoreComplete && (
                        <button
                            onClick={() => setScore(null)}
                            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Continue
                        </button>
                    )}
                </div>
            </div>
        )
    }

    // Scoring state
    if (isScoring) {
        return (
            <div className="flex flex-col items-center justify-center bg-white border-2 border-gray-300 rounded-xl p-8 gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="text-4xl"
                >
                    ✨
                </motion.div>
                <p className="text-gray-700 font-medium">Analyzing your trace...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Debug visualizer */}
            <CanvasDebugView 
                drawingCanvas={canvasEl.current} 
                guideCanvas={guideCanvasEl.current}
                isVisible={showDebug}
            />

            {/* Hidden guide canvas for scoring reference */}
            <canvas ref={guideCanvasEl} style={{ display: 'none' }} />

            {/* Drawing canvas */}
            <div
                ref={containerRef}
                className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden shadow-sm bg-white"
            >
                <canvas ref={canvasEl} width={300} height={300} />
            </div>

            {/* Controls */}
            <div className="flex gap-3 w-full max-w-sm">
                <button
                    onClick={clearCanvas}
                    className="flex-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                    🧹 Clear
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={!hasDrawn}
                    className={`flex-1 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                        hasDrawn
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-md active:translate-y-[1px]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    ✓ Check
                </button>
            </div>

            <p className="text-xs text-center text-gray-500">
                {!hasDrawn ? '✍️ Trace the letter' : '✨ Ready! Tap Check to score'}
            </p>

            {/* Debug toggle */}
            <button
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs text-gray-400 hover:text-gray-600 mt-2"
            >
                {showDebug ? '✓ Debug ON' : 'Debug OFF'}
            </button>
        </div>
    )

}

export default CanvasBoard
