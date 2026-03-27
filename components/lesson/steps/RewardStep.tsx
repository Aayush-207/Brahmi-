import React from 'react';
import { LessonStep } from '@/types/lesson';
import Link from 'next/link';
import JainBabaCharacter from '../JainBabaCharacter';

interface RewardStepProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reward?: { points: number; badge: string };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    step: LessonStep; // Keeping consistent props signature
    onComplete: () => void;
    nextLessonId?: string | null;
}

const RewardStep: React.FC<RewardStepProps> = ({ reward, step, onComplete, nextLessonId }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center max-w-lg mx-auto">
            <JainBabaCharacter 
                message={`साधुवाद! Wonderful work! You have completed this lesson with great dedication. ${reward ? `You earned the '${reward.badge}' badge!` : 'Keep learning!'}`}
                variant="celebrating"
                position="center"
            />
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                🏆
            </div>

            <h2 className="text-3xl font-bold text-gray-900">Lesson Complete!</h2>

            {reward && (
                <div className="bg-orange-50 p-6 rounded-2xl w-full border border-orange-100">
                    <p className="text-sm text-orange-600 mb-1 font-semibold uppercase tracking-wider">Badge Earned</p>
                    <p className="text-2xl font-bold text-gray-800 mb-4">{reward.badge}</p>

                    <div className="h-px bg-orange-200 w-full mb-4"></div>

                    <p className="text-gray-600">
                        You earned <span className="font-bold text-orange-600">{reward.points} Points</span>
                    </p>
                </div>
            )}

            {nextLessonId ? (
                <Link
                    href={`/learn/lesson/${nextLessonId}?completed=${step.letterId}`}
                    className="mt-8 px-12 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-full transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                >
                    Next Lesson <span>→</span>
                </Link>
            ) : (
                <Link
                    href={`/letters?completed=${step.letterId}`}
                    onClick={onComplete}
                    className="mt-8 px-12 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-full transition-all hover:scale-105 shadow-lg"
                >
                    Finish
                </Link>
            )}
        </div>
    );
};

export default RewardStep;
