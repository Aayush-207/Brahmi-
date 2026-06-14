import React from 'react';

interface JainBabaSVGProps {
    variant?: 'default' | 'excited' | 'encouraging' | 'celebrating';
    size?: number;
    isSpeaking?: boolean;
}

const JainBabaSVG: React.FC<JainBabaSVGProps> = ({ variant = 'default', size, isSpeaking = false }) => {
    // Gentle expressions / mouth path adjustments based on variant
    const getMouthD = () => {
        switch (variant) {
            case 'excited':
                return 'M283,120 Q300,138 317,120';
            case 'celebrating':
                return 'M283,120 Q300,140 317,120';
            case 'encouraging':
                return 'M283,120 Q300,135 317,120';
            default:
                return 'M283,120 Q300,132 317,120';
        }
    };

    const mouthD = getMouthD();

    return (
        <svg
            width={size || "100%"}
            height={size ? size * (480 / 440) : "100%"}
            viewBox="80 30 440 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="char-svg drop-shadow-lg"
            style={{ overflow: 'visible' }}
        >
            <style>{`
                .char-svg {
                    filter: drop-shadow(0 0 20px rgba(218,165,32,0.2)) drop-shadow(0 0 40px rgba(180,80,0,0.1));
                    animation: char-float 3s ease-in-out infinite;
                    transform-origin: center bottom;
                }
                @keyframes char-float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-8px); }
                }
                .ground-shadow {
                    animation: shadowPulse 3s ease-in-out infinite;
                    transform-origin: center;
                }
                @keyframes shadowPulse {
                    0%, 100% { transform: scaleX(1);    opacity: 0.30; }
                    50%      { transform: scaleX(0.85); opacity: 0.18; }
                }
                .arm-left-g {
                    transform-origin: 230px 198px;
                    animation: armL 2.5s ease-in-out infinite alternate;
                }
                @keyframes armL {
                    from { transform: rotate(-8deg); }
                    to   { transform: rotate(10deg); }
                }
                .arm-right-g {
                    transform-origin: 370px 198px;
                    animation: armR 2.5s ease-in-out infinite alternate;
                    animation-delay: 1.25s;
                }
                @keyframes armR {
                    from { transform: rotate(8deg); }
                    to   { transform: rotate(-10deg); }
                }
                .leg-left-g {
                    transform-origin: 268px 355px;
                    animation: legL 2.8s ease-in-out infinite alternate;
                }
                @keyframes legL {
                    from { transform: rotate(-6deg); }
                    to   { transform: rotate(6deg); }
                }
                .leg-right-g {
                    transform-origin: 332px 355px;
                    animation: legR 2.8s ease-in-out infinite alternate;
                    animation-delay: 1.4s;
                }
                @keyframes legR {
                    from { transform: rotate(6deg); }
                    to   { transform: rotate(-6deg); }
                }
                .blink-group {
                    transform-origin: 283px 92px;
                    animation: eyeBlink 5s ease-in-out infinite;
                }
                .blink-group2 {
                    transform-origin: 317px 92px;
                    animation: eyeBlink 5s ease-in-out infinite;
                    animation-delay: 0.15s;
                }
                @keyframes eyeBlink {
                    0%, 85%, 100% { transform: scaleY(1); }
                    90%           { transform: scaleY(0.08); }
                }
            `}</style>

            <defs>
                {/* Hex gold */}
                <linearGradient id="gHex" x1="0.1" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="#EDD870"/>
                    <stop offset="28%" stopColor="#D4B84A"/>
                    <stop offset="62%" stopColor="#B89025"/>
                    <stop offset="100%" stopColor="#896510"/>
                </linearGradient>
                {/* Limb / face skin */}
                <linearGradient id="gSkin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F2CD78"/>
                    <stop offset="100%" stopColor="#D4A040"/>
                </linearGradient>
                {/* Shoe */}
                <linearGradient id="gShoe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8980A"/>
                    <stop offset="100%" stopColor="#7A5200"/>
                </linearGradient>
                {/* Eye white */}
                <radialGradient id="gEW" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#ffffff"/>
                    <stop offset="100%" stopColor="#F0E4C0"/>
                </radialGradient>
                {/* Drop shadow filter */}
                <filter id="fDrop" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="rgba(80,40,0,0.28)"/>
                </filter>
                <filter id="fSm" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="1" dy="3" stdDeviation="4" floodColor="rgba(80,40,0,0.22)"/>
                </filter>
            </defs>

            {/* ══════════ LEFT ARM ══════════ */}
            <g className="arm-left-g" filter="url(#fSm)">
                <rect x="142" y="190" width="50" height="110" rx="25" fill="url(#gSkin)"/>
                <circle cx="167" cy="310" r="26" fill="url(#gSkin)"/>
                <path d="M153,304 Q167,298 181,304" stroke="#C8980A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                <ellipse cx="142" cy="302" rx="12" ry="18" fill="url(#gSkin)" transform="rotate(-15,142,302)"/>
            </g>

            {/* ══════════ RIGHT ARM ══════════ */}
            <g className="arm-right-g" filter="url(#fSm)">
                <rect x="408" y="190" width="50" height="110" rx="25" fill="url(#gSkin)"/>
                <circle cx="433" cy="310" r="26" fill="url(#gSkin)"/>
                <path d="M419,304 Q433,298 447,304" stroke="#C8980A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                <ellipse cx="458" cy="302" rx="12" ry="18" fill="url(#gSkin)" transform="rotate(15,458,302)"/>
            </g>

            {/* ══════════ LEFT LEG ══════════ */}
            <g className="leg-left-g" filter="url(#fSm)">
                <rect x="244" y="385" width="48" height="110" rx="24" fill="url(#gSkin)"/>
                <ellipse cx="268" cy="500" rx="36" ry="16" fill="url(#gShoe)"/>
                <ellipse cx="265" cy="495" rx="26" ry="10" fill="#D4A030"/>
                <ellipse cx="256" cy="490" rx="11" ry="5" fill="#FFE070" opacity="0.30"/>
            </g>

            {/* ══════════ RIGHT LEG ══════════ */}
            <g className="leg-right-g" filter="url(#fSm)">
                <rect x="308" y="385" width="48" height="110" rx="24" fill="url(#gSkin)"/>
                <ellipse cx="332" cy="500" rx="36" ry="16" fill="url(#gShoe)"/>
                <ellipse cx="329" cy="495" rx="26" ry="10" fill="#D4A030"/>
                <ellipse cx="320" cy="490" rx="11" ry="5" fill="#FFE070" opacity="0.30"/>
            </g>

            {/* ══════════ NECK ══════════ */}
            <rect x="278" y="150" width="44" height="28" rx="14" fill="url(#gSkin)"/>

            {/* ══════════ FACE ══════════ */}
            <circle cx="300" cy="95" r="62" fill="url(#gSkin)" filter="url(#fSm)"/>

            {/* Cheek blush */}
            <ellipse cx="258" cy="108" rx="16" ry="10" fill="#E06030" opacity="0.18"/>
            <ellipse cx="342" cy="108" rx="16" ry="10" fill="#E06030" opacity="0.18"/>

            {/* Eyebrows */}
            <path d="M268,74 Q283,65 296,72" stroke="#7A3A00" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M304,72 Q317,65 332,74" stroke="#7A3A00" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

            {/* LEFT EYE */}
            <ellipse cx="283" cy="92" rx="16" ry="17" fill="url(#gEW)"/>
            <g className="blink-group">
                <ellipse cx="283" cy="94" rx="10" ry="11" fill="#8B1A00"/>
                <circle cx="283" cy="94" r="6.5" fill="#1A0600"/>
                <circle cx="287" cy="89" r="3" fill="white" opacity="0.88"/>
            </g>
            <path d="M268,82 Q283,74 298,81" stroke="#5A2000" strokeWidth="3" fill="none" strokeLinecap="round"/>

            {/* RIGHT EYE */}
            <ellipse cx="317" cy="92" rx="16" ry="17" fill="url(#gEW)"/>
            <g className="blink-group2">
                <ellipse cx="317" cy="94" rx="10" ry="11" fill="#8B1A00"/>
                <circle cx="317" cy="94" r="6.5" fill="#1A0600"/>
                <circle cx="321" cy="89" r="3" fill="white" opacity="0.88"/>
            </g>
            <path d="M302,81 Q317,74 332,82" stroke="#5A2000" strokeWidth="3" fill="none" strokeLinecap="round"/>

            {/* Nose */}
            <path d="M294,108 Q300,114 306,108" stroke="#C89030" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

            {/* Smile */}
            <path d={mouthD} stroke="#A05010" strokeWidth="3.2" fill="none" strokeLinecap="round">
                {isSpeaking && (
                    <animate
                        attributeName="d"
                        values={`${mouthD};M283,120 Q300,144 317,120;${mouthD}`}
                        dur="0.4s"
                        repeatCount="indefinite"
                    />
                )}
            </path>

            {/* Hexagon Body */}
            <g filter="url(#fDrop)">
                <path d="M300,152 L420,220 L420,388 L300,456 L180,388 L180,220 Z" fill="url(#gHex)" stroke="#C8980A" strokeWidth="4"/>
                <path d="M300,162 L412,226 L412,382 L300,448 L188,382 L188,226 Z" fill="none" stroke="rgba(255,240,100,0.25)" strokeWidth="2"/>

                {/* ROW 1 LEFT: Big rectangular frame */}
                <rect x="196" y="218" width="84" height="66" rx="4" fill="none" stroke="#DD1111" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"/>
                {/* Wavy vertical inside rect */}
                <path d="M268,224 Q261,237 268,252 Q275,267 268,280" stroke="#DD1111" strokeWidth="7" fill="none" strokeLinecap="round"/>

                {/* ROW 1 RIGHT TOP */}
                <line x1="302" y1="220" x2="302" y2="256" stroke="#DD1111" strokeWidth="8" strokeLinecap="round"/>
                <line x1="302" y1="238" x2="328" y2="238" stroke="#DD1111" strokeWidth="8" strokeLinecap="round"/>
                <line x1="328" y1="220" x2="328" y2="252" stroke="#DD1111" strokeWidth="8" strokeLinecap="round"/>
                {/* Curl */}
                <path d="M328,220 C342,208 354,214 354,226 C354,236 344,242 328,238" stroke="#DD1111" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

                {/* ROW 1 RIGHT BOTTOM */}
                <line x1="314" y1="252" x2="314" y2="284" stroke="#DD1111" strokeWidth="8" strokeLinecap="round"/>
                <circle cx="336" cy="270" r="16" fill="none" stroke="#DD1111" strokeWidth="7"/>

                {/* ROW 2 LEFT */}
                <line x1="210" y1="300" x2="210" y2="346" stroke="#DD1111" strokeWidth="8" strokeLinecap="round"/>
                <line x1="238" y1="300" x2="238" y2="346" stroke="#DD1111" strokeWidth="8" strokeLinecap="round"/>
                <line x1="210" y1="314" x2="244" y2="314" stroke="#DD1111" strokeWidth="8" strokeLinecap="round"/>
                <line x1="238" y1="300" x2="256" y2="300" stroke="#DD1111" strokeWidth="8" strokeLinecap="round"/>
                {/* Left foot curl */}
                <path d="M210,346 C202,360 190,358 190,344 C190,332 200,328 210,334" stroke="#DD1111" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

                {/* ROW 2 RIGHT */}
                <line x1="278" y1="300" x2="278" y2="350" stroke="#DD1111" strokeWidth="8" strokeLinecap="round"/>
                <line x1="278" y1="300" x2="302" y2="300" stroke="#DD1111" strokeWidth="8" strokeLinecap="round"/>
                {/* Omega/curved foot */}
                <path d="M278,350 C278,366 292,370 300,360 C308,350 304,338 294,336" stroke="#DD1111" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </g>

            {/* Ground shadow */}
            <ellipse className="ground-shadow" cx="300" cy="510" rx="90" ry="12" fill="rgba(100,50,0,0.28)"/>
        </svg>
    );
};

export default JainBabaSVG;
