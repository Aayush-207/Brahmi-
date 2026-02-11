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
    autoSpeak = true
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
        <div className={`flex flex-col sm:flex-row ${alignmentClass} items-center sm:items-start gap-4 mb-6 w-full animate-in fade-in slide-in-from-left-4 duration-500`}>
            {/* Jain Baba Character */}
            <div className="relative flex-shrink-0">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 animate-in zoom-in duration-700 transition-transform ${isSpeaking ? 'scale-110' : 'scale-100'}`}>
                    <JainBabaSVG variant={variant} size={96} isSpeaking={isSpeaking} />
                </div>
                {/* Floating animation indicator */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 bg-learning-gold rounded-full ${isSpeaking ? 'animate-ping' : 'animate-pulse'}`}></div>
            </div>

            {/* Speech Bubble */}
            <div className="relative flex-1 max-w-md">
                {/* Speech bubble tail - responsive positioning */}
                <div className="absolute sm:-left-2 sm:top-4 -top-2 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 w-0 h-0 
                               border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white
                               sm:border-l-0 sm:border-r-8 sm:border-r-white sm:border-t-8 sm:border-t-transparent sm:border-b-8 sm:border-b-transparent
                               drop-shadow-sm"></div>
                
                {/* Speech bubble content */}
                <div className="bg-white rounded-2xl px-6 py-4 shadow-lg border-2 border-learning-gold/20 animate-in fade-in slide-in-from-left-2 duration-700 delay-300">
                    <div className="flex items-start gap-3">
                        <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed font-medium flex-1 text-center sm:text-left">
                            {message}
                        </p>
                        {canSpeak && (
                            <button
                                onClick={speakMessage}
                                disabled={isSpeaking}
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                    isSpeaking 
                                        ? 'bg-learning-gold text-white animate-pulse' 
                                        : 'bg-gray-100 hover:bg-learning-gold/20 text-gray-600 hover:text-learning-gold'
                                }`}
                                title="Listen to Guruji"
                                aria-label="Speak message"
                            >
                                {isSpeaking ? '🔊' : '🔉'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JainBabaCharacter;
