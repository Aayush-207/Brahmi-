"use client";

import React, { useState } from 'react';
import { Lesson, LessonStep, LessonStepType } from '@/types/lesson';
import IntroStep from './steps/IntroStep';
import ExplanationStep from './steps/ExplanationStep';
import RecognitionMCQStep from './steps/RecognitionMCQStep';
import TraceStep from './steps/TraceStep';
import RewardStep from './steps/RewardStep';

interface LessonRendererProps {
    lesson: Lesson;
    nextLessonId?: string | null;
}

// Map step types to components
// Any type usage here to handle different step props generically
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STEP_COMPONENTS: Record<LessonStepType, React.FC<any>> = {
    intro: IntroStep,
    explanation: ExplanationStep,
    recognition_mcq: RecognitionMCQStep,
    trace: TraceStep,
    reward: RewardStep,
    // Fallbacks for unimplemented types map to fragments for now
    reverse_mcq: () => <div>TODO: Reverse MCQ</div>,
    listen_repeat: () => <div>TODO: Listen Repeat</div>,
    quiz: () => <div>TODO: Quiz</div>,
};

const LessonRenderer: React.FC<LessonRendererProps> = ({ lesson, nextLessonId }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const currentStep = lesson.steps[currentStepIndex];

    // Handler passed to child steps
    const handleStepComplete = () => {
        // Mark current step as completed if not already
        if (!completedSteps.includes(currentStep.id)) {
            setCompletedSteps(prev => [...prev, currentStep.id]);
        }

        // Advance to next step
        if (currentStepIndex < lesson.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            console.log('Lesson Complete!');
            // Could trigger parent callback or redirect here
        }
    };

    // Allow jumping to any step
    const handleStepJump = (stepIndex: number) => {
        setCurrentStepIndex(stepIndex);
    };

    const StepComponent = STEP_COMPONENTS[currentStep.type];

    if (!StepComponent) {
        return <div className="text-red-500">Error: Unknown step type {currentStep.type}</div>;
    }

    // Progress logic
    const progressPercent = ((currentStepIndex + 1) / lesson.steps.length) * 100;

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
            {/* Header / Progress */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                    <h1 className="text-xl font-serif font-bold text-learning-surface tracking-wide">{lesson.title}</h1>
                    <span className="text-sm font-medium text-learning-surface/80">Step {currentStepIndex + 1} of {lesson.steps.length}</span>
                </div>
                {/* Progress Bar used to be gray-100/orange-500, now learning-surface/20 and learning-gold */}
                <div className="h-3 w-full bg-learning-surface/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-learning-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Step Navigation */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {lesson.steps.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => handleStepJump(index)}
                            className={`
                                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                                ${currentStepIndex === index 
                                    ? 'bg-learning-gold text-learning-bg shadow-[0_0_15px_rgba(212,175,55,0.5)]' 
                                    : completedSteps.includes(step.id)
                                    ? 'bg-learning-surface/30 text-learning-gold border border-learning-gold/30 hover:bg-learning-gold/20'
                                    : 'bg-learning-surface/20 text-learning-surface/70 hover:bg-learning-surface/30 hover:text-learning-surface'
                                }
                            `}
                            title={`Step ${index + 1}: ${step.type}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Step Render Area - The Museum Exhibit Card */}
            <div className="min-h-[500px] flex items-stretch outline-none">
                <div className="w-full bg-learning-surface text-learning-bg rounded-2xl shadow-2xl border-4 border-transparent flex flex-col p-6 md:p-10 relative overflow-hidden">
                    {/* Inner Content */}
                    <div className="flex-1 flex flex-col">
                        <StepComponent
                            step={currentStep}
                            onComplete={handleStepComplete}
                            reward={currentStep.type === 'reward' ? lesson.reward : undefined}
                            nextLessonId={currentStep.type === 'reward' ? nextLessonId : undefined}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonRenderer;
