import React from 'react';
import { LessonStep } from '@/types/lesson';
import JainBabaCharacter from '../JainBabaCharacter';

interface ExplanationStepProps {
    step: LessonStep;
    onComplete: () => void;
}

const ExplanationStep: React.FC<ExplanationStepProps> = ({ step, onComplete }) => {
    const { devnagari, brahmi, heading, text, audioUrl } = step.data;

    const playAudio = () => {
        if (audioUrl) {
            new Audio(audioUrl).play();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6 p-6 max-w-lg mx-auto">
            <JainBabaCharacter 
                message={`Look carefully! This is how '${devnagari}' transforms into the ancient Brahmi script. Notice the beautiful evolution of the character.`}
                variant="default"
            />
            {heading && <h3 className="text-2xl font-bold text-gray-800 text-center">{heading}</h3>}

            <div className="flex items-center justify-center space-x-8 my-4">
                {devnagari && (
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Devnagari</span>
                        <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
                            <span className="text-4xl text-gray-800 font-serif">{devnagari}</span>
                        </div>
                    </div>
                )}

                {brahmi && (
                    <>
                        <span className="text-xl text-orange-400">→</span>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-orange-400 mb-1 uppercase tracking-wider">Brahmi</span>
                            <div className="w-24 h-24 flex items-center justify-center bg-orange-50 rounded-xl border border-orange-200">
                                <span className="text-5xl text-orange-800">{brahmi}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {text && <p className="text-lg text-gray-600 text-center leading-relaxed">{text}</p>}

            {audioUrl && (
                <button
                    onClick={playAudio}
                    className="flex items-center space-x-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
                >
                    <span>🔊</span> <span>Play Audio</span>
                </button>
            )}

            <div className="pt-4 w-full">
                <button
                    onClick={onComplete}
                    className="w-full px-8 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-xl transition-colors shadow-lg"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default ExplanationStep;
