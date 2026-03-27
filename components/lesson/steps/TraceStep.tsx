import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LessonStep } from '@/types/lesson';
import CanvasBoard from '@/components/course/CanvasBoard';
import { type ScoringResult } from '@/lib/canvasScoring';
import JainBabaCharacter from '../JainBabaCharacter';

console.log('[TraceStep] Module loaded');

// Dynamically import TracerKonva with SSR disabled (Konva requires browser APIs)
const TracerKonva = dynamic(
  () => {
    console.log('[TraceStep] Starting dynamic import of TracerKonva...');
    return import('@/components/lesson/TracerKonva').then(mod => {
      console.log('[TraceStep] TracerKonva module loaded successfully');
      return mod;
    }).catch(err => {
      console.error('[TraceStep] ERROR loading TracerKonva:', err);
      throw err;
    });
  },
  {
    ssr: false,
    loading: () => {
      console.log('[TraceStep] Showing loading placeholder for TracerKonva');
      return (
        <div className="flex items-center justify-center w-full max-w-[340px] aspect-square border-2 border-dashed border-gray-300 rounded-2xl bg-white mx-auto">
          <p className="text-gray-500">Loading tracer...</p>
        </div>
      );
    },
  }
);

interface TraceStepProps {
    step: LessonStep;
    onComplete: () => void;
}

const TraceStep: React.FC<TraceStepProps> = ({ step, onComplete }) => {
    console.log('[TraceStep] Component rendering, step:', step);
    console.log('[TraceStep] step.data:', step.data);
    
    const { character } = step.data;
    console.log('[TraceStep] Character to trace:', character);
    
    const [score, setScore] = useState<ScoringResult | null>(null);
    const [canvasSize, setCanvasSize] = useState(340);

    useEffect(() => {
        console.log('[TraceStep] Component mounted');
        
        // Set responsive canvas size based on screen width
        const updateCanvasSize = () => {
            const width = window.innerWidth;
            if (width < 400) {
                setCanvasSize(280); // Small phones
            } else if (width < 640) {
                setCanvasSize(320); // Larger phones
            } else {
                setCanvasSize(340); // Tablets and desktop
            }
        };
        
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        
        return () => {
            console.log('[TraceStep] Component unmounting');
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []);

    const handleScoreComplete = (result: ScoringResult) => {
        console.log('[TraceStep] handleScoreComplete called with:', result);
        setScore(result);
        // Score is now handled by TracerKonva which calls onContinue directly
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-8 p-2 sm:p-4 w-full max-w-md mx-auto">
            <JainBabaCharacter 
                message={
                    score 
                        ? score.percentage >= 70 
                            ? `अद्भुत! ${character} को बिल्कुल सही लिखा है! 🌟` 
                            : `और कोशिश करो! ${character} को फिर से लिखने का प्रयास करो। 💪`
                        : `शानदार! अब '${character}' को सावधानी से लिखो। अभ्यास सफलता की कुंजी है!`
                }
                variant={score ? (score.percentage >= 70 ? 'encouraging' : 'default') : 'encouraging'}
            />

            <div className="w-full flex justify-center">
                {/* Konva-based tracer with automatic scoring */}
                <TracerKonva
                    character={character}
                    width={canvasSize}
                    height={canvasSize}
                    onScoreComplete={(scoreValue) => {
                        console.log('[TraceStep] *** onScoreComplete CALLBACK FIRED ***');
                        console.log('[TraceStep] Received score from TracerKonva:', scoreValue);
                        const result: ScoringResult = {
                            percentage: scoreValue,
                            grade: scoreValue >= 85 ? 'Excellent' : scoreValue >= 70 ? 'Very Good' : scoreValue >= 50 ? 'Good' : 'Try Again',
                            coverage: scoreValue,
                            precision: scoreValue,
                            details: { referencePixels: 0, studentPixels: 0, correctPixels: 0 },
                        }
                        console.log('[TraceStep] Created ScoringResult:', result);
                        handleScoreComplete(result)
                    }}
                    onContinue={() => {
                        console.log('[TraceStep] Continue clicked, calling onComplete');
                        onComplete();
                    }}
                />
            </div>

            {!score && (
                <button
                    onClick={onComplete}
                    className="mt-2 sm:mt-4 px-6 sm:px-8 py-2 sm:py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-full transition-colors shadow-lg text-sm sm:text-base"
                >
                    Skip
                </button>
            )}
        </div>
    );
};

export default TraceStep;
