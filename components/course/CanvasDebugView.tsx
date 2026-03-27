'use client'

import React, { useEffect, useRef } from 'react'
import { scoreLetterTracing } from '@/lib/canvasScoring'

interface CanvasDebugViewProps {
    drawingCanvas: HTMLCanvasElement | null
    guideCanvas: HTMLCanvasElement | null
    isVisible?: boolean
}

const CanvasDebugView: React.FC<CanvasDebugViewProps> = ({
    drawingCanvas,
    guideCanvas,
    isVisible = false,
}) => {
    const debugCanvasRef = useRef<HTMLCanvasElement>(null)
    const guidePreviewRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!isVisible || !drawingCanvas || !guideCanvas) return

        // Show guide canvas content
        if (guidePreviewRef.current) {
            const ctx = guidePreviewRef.current.getContext('2d')
            if (ctx && guideCanvas) {
                const guideCtx = guideCanvas.getContext('2d')
                if (guideCtx) {
                    const imageData = guideCtx.getImageData(0, 0, guideCanvas.width, guideCanvas.height)
                    ctx.putImageData(imageData, 0, 0)
                }
            }
        }

        // Show debug visualization
        if (debugCanvasRef.current && drawingCanvas && guideCanvas) {
            const debugCtx = debugCanvasRef.current.getContext('2d')
            if (!debugCtx) return

            debugCtx.clearRect(0, 0, debugCanvasRef.current.width, debugCanvasRef.current.height)

            // Get pixel data
            const drawingCtx = drawingCanvas.getContext('2d', { willReadFrequently: true })
            const guideCtx = guideCanvas.getContext('2d', { willReadFrequently: true })

            if (!drawingCtx || !guideCtx) return

            const drawingData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height)
            const guideData = guideCtx.getImageData(0, 0, guideCanvas.width, guideCanvas.height)

            // Draw drawing canvas with detected strokes highlighted
            debugCtx.putImageData(drawingData, 0, 0)

            // Highlight detected stroke pixels in blue
            const drawingPixels = drawingData.data
            for (let i = 0; i < drawingPixels.length; i += 4) {
                const r = drawingPixels[i]
                const g = drawingPixels[i + 1]
                const b = drawingPixels[i + 2]
                const luminance = (r + g + b) / 3

                // Detected stroke (dark pixel)
                if (luminance < 100) {
                    drawingPixels[i] = 0 // R
                    drawingPixels[i + 1] = 100 // G (cyan)
                    drawingPixels[i + 2] = 255 // B
                    drawingPixels[i + 3] = 200 // alpha
                }
            }

            debugCtx.putImageData(drawingData, 0, 0)
        }
    }, [drawingCanvas, guideCanvas, isVisible])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 p-4 rounded-lg text-white z-50 max-w-sm">
            <h3 className="font-bold mb-2">Debug: Canvas Pixel Detection</h3>

            <div className="bg-gray-800 p-2 rounded mb-3">
                <p className="text-xs mb-2">Guide Canvas (should show faint letter):</p>
                <canvas
                    ref={guidePreviewRef}
                    width={300}
                    height={300}
                    className="w-full border border-gray-600 rounded"
                    style={{ maxWidth: '200px' }}
                />
            </div>

            <div className="bg-gray-800 p-2 rounded mb-3">
                <p className="text-xs mb-2">Drawing Canvas (blue = detected strokes):</p>
                <canvas
                    ref={debugCanvasRef}
                    width={300}
                    height={300}
                    className="w-full border border-gray-600 rounded"
                    style={{ maxWidth: '200px' }}
                />
            </div>

            <p className="text-xs text-gray-300">
                Check browser console for detailed scoring logs
            </p>
        </div>
    )
}

export default CanvasDebugView
