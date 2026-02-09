"use client";

import React, { useState } from 'react';
import { LessonStep } from '@/types/lesson';
import JainBabaCharacter from '../JainBabaCharacter';

interface RecognitionMCQStepProps {
    step: LessonStep;
    onComplete: () => void;
}

const RecognitionMCQStep: React.FC<RecognitionMCQStepProps> = ({ step, onComplete }) => {
    const { question, options, answer } = step.data;
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleSelect = (option: string) => {
        if (isCorrect === true) return; // Prevent changing after correct

        setSelected(option);
        const correct = option === answer;
        setIsCorrect(correct);

        if (correct) {
            // Auto advance after a short delay or show a wrapper with "Next"
            // For now, let's keep the user on screen to see "Correct!" then they click next.
            // But re-reading requirements: "Shows 'Next' only when step is completed"
            // So onComplete triggers the parent to show next or we can just render a next button here.
            // The requirement says: "Shows 'Next' only when step is completed".
            // Let's assume the parent handles the "Next" button if we tell it we are done?
            // Or we render the "Next" button here?
            // Requirement: "Render exactly one step at a time. Shows “Next” only when step is completed"
            // Usually "Step marks itself complete by calling onComplete()".
            // Let's adding a "Next" button that appears when correct.
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-8 max-w-lg mx-auto">
            <JainBabaCharacter 
                message={question}
                variant="encouraging"
            />

            <div className="grid grid-cols-2 gap-4 w-full">
                {options.map((option: string, idx: number) => {
                    let styles = "bg-white border-2 border-gray-100 hover:border-orange-200";
                    if (selected === option) {
                        styles = isCorrect
                            ? "bg-green-50 border-green-500 text-green-700"
                            : "bg-red-50 border-red-500 text-red-700";
                    } else if (selected && option === answer) {
                        styles = "bg-green-50 border-green-500 text-green-700"; // Show correct answer if wrong one picked
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(option)}
                            disabled={isCorrect === true}
                            className={`h-24 text-4xl rounded-xl transition-all duration-200 ${styles}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            <div className="h-12 flex items-center justify-center">
                {isCorrect === true && (
                    <button
                        onClick={onComplete}
                        className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors animate-in fade-in slide-in-from-bottom-2"
                    >
                        Correct! Continued →
                    </button>
                )}
                {isCorrect === false && (
                    <span className="text-red-500 font-medium">Try again</span>
                )}
            </div>
        </div>
    );
};

export default RecognitionMCQStep;
