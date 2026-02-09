import React from 'react';

interface JainBabaSVGProps {
    variant?: 'default' | 'excited' | 'encouraging' | 'celebrating';
    size?: number;
    isSpeaking?: boolean;
}

const JainBabaSVG: React.FC<JainBabaSVGProps> = ({ variant = 'default', size = 100, isSpeaking = false }) => {
    // Different expressions based on variant
    const getExpression = () => {
        switch (variant) {
            case 'excited':
                return {
                    eyeSize: 8,
                    eyeY: 55,
                    mouthPath: 'M 45 85 Q 60 98 75 85', // Big smile
                    eyebrowY: 45,
                };
            case 'encouraging':
                return {
                    eyeSize: 7,
                    eyeY: 56,
                    mouthPath: 'M 48 85 Q 60 93 72 85', // Gentle smile
                    eyebrowY: 47,
                };
            case 'celebrating':
                return {
                    eyeSize: 9,
                    eyeY: 54,
                    mouthPath: 'M 42 85 Q 60 100 78 85', // Wide smile
                    eyebrowY: 44,
                };
            default:
                return {
                    eyeSize: 7,
                    eyeY: 56,
                    mouthPath: 'M 48 84 Q 60 92 72 84', // Calm smile
                    eyebrowY: 48,
                };
        }
    };

    const expression = getExpression();

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
        >
            <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF7E6" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#F4E4C1" stopOpacity="0.2" />
                </radialGradient>
                <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F5D7B8" />
                    <stop offset="100%" stopColor="#E8C5A0" />
                </linearGradient>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
                </filter>
                <filter id="softGlow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                    <feOffset dx="0" dy="0" result="offsetblur"/>
                    <feFlood floodColor="#FFD700" floodOpacity="0.3"/>
                    <feComposite in2="offsetblur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Divine Aura/Glow */}
            <circle cx="60" cy="60" r="58" fill="url(#glow)" opacity="0.7" />

            {/* Main face - chubby and round kid's face */}
            <ellipse cx="60" cy="62" rx="40" ry="44" fill="url(#skinGradient)" 
                     stroke="#D4A574" strokeWidth="1.5" filter="url(#shadow)" />
            
            {/* Cheek fullness - chubby baby cheeks */}
            <ellipse cx="35" cy="68" rx="14" ry="16" fill="#F0CAA8" opacity="0.6" />
            <ellipse cx="85" cy="68" rx="14" ry="16" fill="#F0CAA8" opacity="0.6" />
            
            {/* Chubby chin */}
            <ellipse cx="60" cy="88" rx="26" ry="16" fill="#F0D5B8" opacity="0.5" />

            {/* Sacred Teeka/Tilak on forehead */}
            <g filter="url(#softGlow)">
                {/* Main vertical mark */}
                <ellipse cx="60" cy="38" rx="4" ry="12" fill="#DC2626" opacity="0.95" />
                <ellipse cx="60" cy="38" rx="3" ry="10" fill="#EF4444" />
                {/* Kumkum dot at top */}
                <circle cx="60" cy="28" r="3.5" fill="#DC2626" />
                <circle cx="60" cy="28" r="2.5" fill="#EF4444" />
                {/* Sandalwood paste lines */}
                <ellipse cx="54" cy="36" rx="2" ry="8" fill="#FCD34D" opacity="0.8" />
                <ellipse cx="66" cy="36" rx="2" ry="8" fill="#FCD34D" opacity="0.8" />
            </g>

            {/* Eyebrows - soft and gentle kid's eyebrows */}
            <path
                d={`M 40 ${expression.eyebrowY} Q 46 ${expression.eyebrowY - 1} 52 ${expression.eyebrowY}`}
                stroke="#6B5744"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
            />
            <path
                d={`M 68 ${expression.eyebrowY} Q 74 ${expression.eyebrowY - 1} 80 ${expression.eyebrowY}`}
                stroke="#6B5744"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
            />

            {/* Eyes - large innocent kid's eyes */}
            <g>
                {/* Left eye */}
                <ellipse cx="46" cy={expression.eyeY} rx={expression.eyeSize + 1} ry={expression.eyeSize + 3} 
                         fill="white" stroke="#3A3028" strokeWidth="1" />
                <circle cx="46" cy={expression.eyeY + 1} r={expression.eyeSize - 1} fill="#4A3F35" />
                <circle cx="47.5" cy={expression.eyeY - 1} r="3.5" fill="white" opacity="0.95" />
                <circle cx="44.5" cy={expression.eyeY + 2} r="1.5" fill="white" opacity="0.8" />
                
                {/* Right eye */}
                <ellipse cx="74" cy={expression.eyeY} rx={expression.eyeSize + 1} ry={expression.eyeSize + 3} 
                         fill="white" stroke="#3A3028" strokeWidth="1" />
                <circle cx="74" cy={expression.eyeY + 1} r={expression.eyeSize - 1} fill="#4A3F35" />
                <circle cx="75.5" cy={expression.eyeY - 1} r="3.5" fill="white" opacity="0.95" />
                <circle cx="72.5" cy={expression.eyeY + 2} r="1.5" fill="white" opacity="0.8" />
            </g>

            {/* Nose - cute button nose */}
            <path
                d="M 60 68 Q 58 73 60 75"
                stroke="#D4A574"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
            />
            {/* Nostrils - small and cute */}
            <circle cx="57" cy="74" r="1.5" fill="#D4A574" opacity="0.3" />
            <circle cx="63" cy="74" r="1.5" fill="#D4A574" opacity="0.3" />

            {/* Mouth/Smile with animation - cute kid's smile */}
            <path
                d={expression.mouthPath}
                stroke="#E85D75"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
            >
                {isSpeaking && (
                    <animate
                        attributeName="d"
                        values={`${expression.mouthPath};M 50 88 Q 60 95 70 88;${expression.mouthPath}`}
                        dur="0.4s"
                        repeatCount="indefinite"
                    />
                )}
            </path>
            
            {/* Cute dimples */}
            <circle cx="38" cy="78" r="3" fill="#F0CAA8" opacity="0.4" />
            <circle cx="82" cy="78" r="3" fill="#F0CAA8" opacity="0.4" />

            {/* Divine sparkles for celebrating variant */}
            {variant === 'celebrating' && (
                <>
                    <circle cx="15" cy="30" r="3" fill="#FFD700">
                        <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="105" cy="30" r="3" fill="#FFD700">
                        <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="10" cy="60" r="2.5" fill="#FCD34D">
                        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="110" cy="60" r="2.5" fill="#FCD34D">
                        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <path d="M 18 90 L 21 93 L 18 96 L 15 93 Z" fill="#FFD700">
                        <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" />
                    </path>
                    <path d="M 102 90 L 105 93 L 102 96 L 99 93 Z" fill="#FFD700">
                        <animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite" />
                    </path>
                </>
            )}
        </svg>
    );
};

export default JainBabaSVG;
