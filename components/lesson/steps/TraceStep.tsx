import React from 'react';
import { LessonStep } from '@/types/lesson';
import CanvasBoard from '@/components/course/CanvasBoard';
import JainBabaCharacter from '../JainBabaCharacter';

interface TraceStepProps {
    step: LessonStep;
    onComplete: () => void;
}

const TraceStep: React.FC<TraceStepProps> = ({ step, onComplete }) => {
    const { character } = step.data;

    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-4 w-full max-w-md mx-auto">
            <JainBabaCharacter 
                message={`Excellent! Now trace '${character}' with your finger or mouse. Follow the strokes carefully. Practice makes perfect!`}
                variant="encouraging"
            />

            <div className="w-full">
                <CanvasBoard traceCharacter={character} />
            </div>

            <button
                onClick={onComplete}
                className="mt-4 px-8 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-full transition-colors shadow-lg"
            >
                Continue
            </button>
        </div>
    );
};

export default TraceStep;
