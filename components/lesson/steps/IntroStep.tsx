import React from 'react';
import { LessonStep } from '@/types/lesson';
import JainBabaCharacter from '../JainBabaCharacter';

interface IntroStepProps {
    step: LessonStep;
    onComplete: () => void;
}

const IntroStep: React.FC<IntroStepProps> = ({ step, onComplete }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-8 max-w-lg mx-auto">
            <JainBabaCharacter 
                message={`नमस्ते! ${step.prompt}. Let me guide you through this beautiful ancient script.`}
                variant="excited"
                position="center"
            />
            <button
                onClick={onComplete}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full transition-colors text-lg mt-6"
            >
                Start Lesson
            </button>
        </div>
    );
};

export default IntroStep;
