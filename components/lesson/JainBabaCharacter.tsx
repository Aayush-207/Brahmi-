import React, { useEffect, useState, useRef } from 'react';
import JainBabaSVG from './JainBabaSVG';
import { speakAsGuruji, stopGurujiSpeech, isGurujiSpeechAvailable } from '@/lib/gurujispeech';

interface JainBabaCharacterProps {
    message: string;
    variant?: 'default' | 'excited' | 'encouraging' | 'celebrating';
    position?: 'left' | 'center';
    autoSpeak?: boolean;
}

const JainBabaCharacter: React.FC<JainBabaCharacterProps> = ({ 
    message, 
    variant = 'default',
    position = 'left',
    autoSpeak = false
}) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [canSpeak, setCanSpeak] = useState(false);
    const hasSpokenRef = useRef(false);
    const alignmentClass = position === 'center' ? 'justify-center' : 'justify-start';

    // Check if speech synthesis is available
    useEffect(() => {
        setCanSpeak(isGurujiSpeechAvailable());
    }, []);

    // Function to speak with elderly saint voice
    const speakMessage = () => {
        if (!canSpeak || !message) return;

        speakAsGuruji(message, {}, {
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false)
        });
    };

    // Function to stop speech
    const handleStopSpeech = () => {
        stopGurujiSpeech();
        setIsSpeaking(false);
    };

    // Auto-speak when message changes (only once per message)
    useEffect(() => {
        if (autoSpeak && canSpeak && message && !hasSpokenRef.current) {
            // Small delay to ensure UI is ready
            const timer = setTimeout(() => {
                speakMessage();
                hasSpokenRef.current = true;
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [message, autoSpeak, canSpeak]);

    // Reset hasSpoken when message changes
    useEffect(() => {
        hasSpokenRef.current = false;
    }, [message]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopGurujiSpeech();
        };
    }, []);

    return (
        <div className={`flex flex-row ${alignmentClass} items-center gap-3 mb-6 animate-in fade-in slide-in-from-left-4 duration-500`}>
            {/* Jain Baba Character */}
            <div className="relative flex-shrink-0">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 animate-in zoom-in duration-700 transition-transform ${isSpeaking ? 'scale-110' : 'scale-100'}`}>
                    <JainBabaSVG variant={variant} size={80} isSpeaking={isSpeaking} />
                </div>
                {/* Floating animation indicator */}
                <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 bg-learning-gold rounded-full ${isSpeaking ? 'animate-ping' : 'animate-pulse'}`}></div>
            </div>

            {/* Speech Bubble with Prompt */}
            <div className="relative">
                {/* Speech bubble tail */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 
                               border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-white
                               drop-shadow-sm"></div>
                
                {/* Speech bubble content */}
                <div className="bg-white rounded-xl px-4 py-2 shadow-md border border-learning-gold/20 flex items-center gap-2">
                    {canSpeak && (
                        <>
                            <button
                                onClick={speakMessage}
                                disabled={isSpeaking}
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                    isSpeaking 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-100 hover:bg-learning-gold/20 text-gray-600 hover:text-learning-gold'
                                }`}
                                title="Listen to Guruji"
                                aria-label="Speak message"
                            >
                                🔉
                            </button>
                            {isSpeaking && (
                                <button
                                    onClick={handleStopSpeech}
                                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700"
                                    title="Stop Guruji"
                                    aria-label="Stop speaking"
                                >
                                    ⏹
                                </button>
                            )}
                        </>
                    )}
                    <p className="text-gray-700 text-xs sm:text-sm font-medium whitespace-nowrap">
                        {isSpeaking ? 'Speaking...' : 'Ask Guruji to speak'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JainBabaCharacter;
