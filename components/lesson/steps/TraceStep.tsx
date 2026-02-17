import React, { useState } from 'react';
import { LessonStep } from '@/types/lesson';
import CanvasBoard from '@/components/course/CanvasBoard';
import { type ScoringResult } from '@/lib/canvasScoring';
import JainBabaCharacter from '../JainBabaCharacter';

interface TraceStepProps {
    step: LessonStep;
    onComplete: () => void;
}

const TraceStep: React.FC<TraceStepProps> = ({ step, onComplete }) => {
    const { character } = step.data;
    const [score, setScore] = useState<ScoringResult | null>(null);

    const handleScoreComplete = (result: ScoringResult) => {
        setScore(result);
        
        // Auto-progress if score is good enough (70%+)
        // Otherwise let user retry
        if (result.percentage >= 70) {
            setTimeout(onComplete, 2000); // Show result for 2 seconds, then continue
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-4 w-full max-w-md mx-auto">
            <JainBabaCharacter 
                message={
                    score 
                        ? score.percentage >= 70 
                            ? `अद्भुत! ${character} को बिल्कुल सही लिखा है! 🌟` 
                            : `और कोशिश करो! ${character} को फिर से लिखने का प्रयास करो। 💪`
                        : `शानदार! अब '${character}' को सावधानी से लिखो। अभ्यास सफलता की कुंजी है!`
                }
                variant={score ? (score.percentage >= 70 ? 'encouraging' : 'neutral') : 'encouraging'}
            />

            <div className="w-full">
                <CanvasBoard 
                    traceCharacter={character}
                    onScoreComplete={handleScoreComplete}
                />
            </div>

            {!score && (
                <button
                    onClick={onComplete}
                    className="mt-4 px-8 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-full transition-colors shadow-lg"
                >
                    Skip
                </button>
            )}
        </div>
    );
};

export default TraceStep;
