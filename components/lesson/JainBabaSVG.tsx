import React from 'react';

interface JainBabaSVGProps {
    variant?: 'default' | 'excited' | 'encouraging' | 'celebrating';
    size?: number;
    isSpeaking?: boolean;
}

const JainBabaSVG: React.FC<JainBabaSVGProps> = ({ variant = 'default', size, isSpeaking = false }) => {
    // Serene expressions / mouth path adjustments based on variant
    const getMouthD = () => {
        switch (variant) {
            case 'excited':
                return 'M112,128 Q120,138 128,128';
            case 'celebrating':
                return 'M112,128 Q120,140 128,128';
            case 'encouraging':
                return 'M112,128 Q120,136 128,128';
            default:
                return 'M112,128 Q120,134 128,128';
        }
    };

    const getShadowMouthD = () => {
        switch (variant) {
            case 'excited':
                return 'M114,130 Q120,137 126,130';
            case 'celebrating':
                return 'M114,130 Q120,139 126,130';
            default:
                return 'M114,130 Q120,134 126,130';
        }
    };

    const mouthD = getMouthD();
    const shadowMouthD = getShadowMouthD();

    return (
        <svg
            width={size || "100%"}
            height={size ? size * (340 / 240) : "100%"}
            viewBox="0 0 240 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="char-svg drop-shadow-lg"
        >
            <style>{`
                .char-svg {
                    filter: drop-shadow(0 0 20px rgba(218,165,32,0.35)) drop-shadow(0 0 40px rgba(180,80,0,0.15));
                    animation: char-float 4s ease-in-out infinite;
                }
                @keyframes char-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                .lotus-glow {
                    animation: lotus-breathe 3s ease-in-out infinite;
                }
                @keyframes lotus-breathe {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.75; }
                }
                .eye-l, .eye-r {
                    animation: blink 5s ease-in-out infinite;
                }
                .eye-l {
                    transform-origin: 109px 110px;
                }
                .eye-r {
                    transform-origin: 131px 110px;
                }
                @keyframes blink {
                    0%, 90%, 100% { transform: scaleY(1); }
                    95% { transform: scaleY(0.15); }
                }
                .hands-glow {
                    animation: hands-pulse 2.5s ease-in-out infinite;
                    transform-origin: 120px 198px;
                }
                @keyframes hands-pulse {
                    0%, 100% { opacity: 0.6; transform: scale(0.9); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                .third-eye {
                    animation: third-eye-glow 2s ease-in-out infinite;
                }
                @keyframes third-eye-glow {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }
            `}</style>

            <defs>
                {/* Gold gradient body */}
                <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4B54A"/>
                    <stop offset="40%" stopColor="#C8860A"/>
                    <stop offset="100%" stopColor="#7A4A00"/>
                </linearGradient>
                {/* Robe gradient */}
                <linearGradient id="robeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B1A00"/>
                    <stop offset="100%" stopColor="#5A0A00"/>
                </linearGradient>
                {/* Lotus gradient */}
                <radialGradient id="lotusGrad" cx="50%" cy="60%" r="50%">
                    <stop offset="0%" stopColor="#FFD700"/>
                    <stop offset="60%" stopColor="#E8A020"/>
                    <stop offset="100%" stopColor="#C87000"/>
                </radialGradient>
                {/* Halo gradient */}
                <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFE066" stopOpacity={0.9}/>
                    <stop offset="70%" stopColor="#C8860A" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#C8860A" stopOpacity={0}/>
                </radialGradient>
                {/* Skin gradient */}
                <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8C060"/>
                    <stop offset="100%" stopColor="#C89030"/>
                </linearGradient>
                {/* Eye gradient */}
                <radialGradient id="eyeGrad" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#8B1A00"/>
                    <stop offset="100%" stopColor="#3A0800"/>
                </radialGradient>
                {/* Third eye glow */}
                <radialGradient id="thirdEyeGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFD700"/>
                    <stop offset="100%" stopColor="#E05000" stopOpacity={0}/>
                </radialGradient>
                {/* Hands glow */}
                <radialGradient id="handsGlowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFE066" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#FFE066" stopOpacity={0}/>
                </radialGradient>
                {/* Gold border */}
                <linearGradient id="borderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFE066"/>
                    <stop offset="50%" stopColor="#C8860A"/>
                    <stop offset="100%" stopColor="#7A4A00"/>
                </linearGradient>

                <filter id="soft-glow">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* ===== DIVINE HALO ===== */}
            <circle cx="120" cy="90" r="65" fill="url(#haloGrad)" opacity={0.8}/>
            <circle cx="120" cy="90" r="55" fill="none" stroke="url(#borderGrad)" strokeWidth="1.5" opacity={0.6}/>
            <circle cx="120" cy="90" r="48" fill="none" stroke="#FFE066" strokeWidth="0.5" opacity={0.4} strokeDasharray="4 3"/>

            {/* Halo tick marks (divine) */}
            <g opacity={0.5}>
                <line x1="120" y1="38" x2="120" y2="42" stroke="#FFE066" strokeWidth="1.5"/>
                <line x1="120" y1="138" x2="120" y2="142" stroke="#FFE066" strokeWidth="1.5"/>
                <line x1="68" y1="90" x2="72" y2="90" stroke="#FFE066" strokeWidth="1.5"/>
                <line x1="168" y1="90" x2="172" y2="90" stroke="#FFE066" strokeWidth="1.5"/>
                <line x1="83" y1="53" x2="86" y2="57" stroke="#FFE066" strokeWidth="1"/>
                <line x1="154" y1="53" x2="157" y2="57" stroke="#FFE066" strokeWidth="1"/>
                <line x1="83" y1="127" x2="86" y2="123" stroke="#FFE066" strokeWidth="1"/>
                <line x1="154" y1="127" x2="157" y2="123" stroke="#FFE066" strokeWidth="1"/>
            </g>

            {/* ===== BODY / TORSO ===== */}
            {/* Robe/dhoti base */}
            <ellipse cx="120" cy="250" rx="52" ry="28" fill="#6A1200" opacity={0.5}/>

            {/* Seated body shape */}
            <path d="M80,220 Q75,200 78,185 L82,175 Q100,168 120,168 Q140,168 158,175 L162,185 Q165,200 160,220 Q150,240 120,245 Q90,240 80,220Z"
                  fill="url(#robeGrad)"/>

            {/* Robe folds */}
            <path d="M88,190 Q92,210 90,225" stroke="#C03000" strokeWidth="1" fill="none" opacity={0.6}/>
            <path d="M105,185 Q108,215 106,230" stroke="#C03000" strokeWidth="1" fill="none" opacity={0.4}/>
            <path d="M135,185 Q132,215 134,230" stroke="#C03000" strokeWidth="1" fill="none" opacity="0.4"/>
            <path d="M152,190 Q148,210 150,225" stroke="#C03000" strokeWidth="1" fill="none" opacity="0.6"/>

            {/* ===== LOTUS SEAT ===== */}
            {/* Back petals */}
            <ellipse cx="120" cy="248" rx="48" ry="16" fill="#8B6000" opacity={0.4}/>

            {/* Lotus petals group (front) */}
            <g className="lotus-glow">
                {/* Left outer */}
                <path d="M72,248 Q60,230 75,218 Q88,230 85,248Z" fill="url(#lotusGrad)" opacity={0.9}/>
                {/* Left inner */}
                <path d="M90,248 Q80,232 92,222 Q102,234 98,248Z" fill="#FFD700" opacity={0.85}/>
                {/* Center */}
                <path d="M108,248 Q104,228 120,220 Q136,228 132,248Z" fill="#FFE560" opacity={0.95}/>
                {/* Right inner */}
                <path d="M130,248 Q138,234 148,222 Q160,232 150,248Z" fill="#FFD700" opacity={0.85}/>
                {/* Right outer */}
                <path d="M155,248 Q165,230 165,218 Q178,230 168,248Z" fill="url(#lotusGrad)" opacity={0.9}/>
                {/* Petal tips highlights */}
                <path d="M120,222 Q118,218 120,215 Q122,218 120,222Z" fill="#FFF5A0" opacity={0.8}/>
            </g>

            {/* Lotus center base */}
            <ellipse cx="120" cy="249" rx="45" ry="10" fill="#C87000" opacity={0.6}/>
            <ellipse cx="120" cy="247" rx="35" ry="7" fill="#E8A020" opacity={0.5}/>

            {/* ===== NECK ===== */}
            <path d="M110,165 Q120,160 130,165 L132,175 Q120,172 108,175Z" fill="url(#skinGrad)"/>

            {/* Neck ornament line */}
            <path d="M108,170 Q120,167 132,170" stroke="#C8860A" strokeWidth="1" fill="none" opacity={0.8}/>

            {/* ===== HEAD ===== */}
            {/* Head shape - slightly stylized */}
            <ellipse cx="120" cy="110" rx="38" ry="42" fill="url(#skinGrad)"/>

            {/* Subtle cheek shading */}
            <ellipse cx="100" cy="118" rx="10" ry="8" fill="#C08020" opacity={0.2}/>
            <ellipse cx="140" cy="118" rx="10" ry="8" fill="#C08020" opacity="0.2"/>

            {/* ===== HAIR / TOPKNOT ===== */}
            <path d="M90,80 Q95,60 120,55 Q145,60 150,80 Q140,72 120,70 Q100,72 90,80Z" fill="#3A1A00"/>
            {/* Topknot bun */}
            <ellipse cx="120" cy="62" rx="14" ry="10" fill="#4A2200"/>
            <ellipse cx="120" cy="60" rx="10" ry="7" fill="#5A2A00"/>
            {/* Hair highlight */}
            <path d="M110,64 Q120,58 130,64" stroke="#8A5A20" strokeWidth="1" fill="none" opacity="0.5"/>

            {/* Gold hair ornament / mukuta */}
            <path d="M106,75 L110,68 L115,72 L120,65 L125,72 L130,68 L134,75Z"
                  fill="url(#borderGrad)" opacity={0.9}/>
            <circle cx="120" cy="65" r="3" fill="#FFE066"/>

            {/* ===== FACE FEATURES ===== */}

            {/* Eyebrows */}
            <path d="M103,101 Q110,97 116,100" stroke="#5A3000" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M124,100 Q130,97 137,101" stroke="#5A3000" strokeWidth="2" fill="none" strokeLinecap="round"/>

            {/* Eyes */}
            <g className="eye-l">
                <ellipse cx="109" cy="110" rx="8" ry="7" fill="white" opacity={0.95}/>
                <ellipse cx="110" cy="111" rx="5" ry="5.5" fill="url(#eyeGrad)"/>
                <circle cx="111" cy="110" r="2.5" fill="#1A0800"/>
                <circle cx="113" cy="108" r="1.2" fill="white" opacity={0.9}/>
            </g>
            <g className="eye-r">
                <ellipse cx="131" cy="110" rx="8" ry="7" fill="white" opacity={0.95}/>
                <ellipse cx="130" cy="111" rx="5" ry="5.5" fill="url(#eyeGrad)"/>
                <circle cx="129" cy="110" r="2.5" fill="#1A0800"/>
                <circle cx="131" cy="108" r="1.2" fill="white" opacity="0.9"/>
            </g>
            {/* Eye lashes top */}
            <path d="M102,107 Q109,103 116,106" stroke="#3A1A00" strokeWidth="1.5" fill="none" opacity={0.8}/>
            <path d="M124,106 Q131,103 138,107" stroke="#3A1A00" strokeWidth="1.5" fill="none" opacity="0.8"/>

            {/* Third eye (tilak) */}
            <g className="third-eye">
                <ellipse cx="120" cy="97" rx="5" ry="3.5" fill="url(#thirdEyeGrad)"/>
                <ellipse cx="120" cy="97" rx="3" ry="2" fill="#FFD700" opacity="0.9"/>
                <circle cx="120" cy="97" r="1.2" fill="#FF6000"/>
            </g>

            {/* Nose */}
            <path d="M117,118 Q120,122 123,118" stroke="#C08020" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7"/>
            <circle cx="116" cy="118" r="1.5" fill="#B07010" opacity="0.4"/>
            <circle cx="124" cy="118" r="1.5" fill="#B07010" opacity="0.4"/>

            {/* Smile - serene */}
            <path d={mouthD} stroke="#9A5010" strokeWidth="1.8" fill="none" strokeLinecap="round">
                {isSpeaking && (
                    <animate
                        attributeName="d"
                        values={`${mouthD};M112,128 Q120,144 128,128;${mouthD}`}
                        dur="0.4s"
                        repeatCount="indefinite"
                    />
                )}
            </path>
            <path d={shadowMouthD} fill="#C06010" opacity={0.3}>
                {isSpeaking && (
                    <animate
                        attributeName="d"
                        values={`${shadowMouthD};M114,130 Q120,142 126,130;${shadowMouthD}`}
                        dur="0.4s"
                        repeatCount="indefinite"
                    />
                )}
            </path>

            {/* Ear decorations */}
            <ellipse cx="82" cy="112" rx="5" ry="7" fill="#D4A030" opacity={0.9}/>
            <ellipse cx="82" cy="112" rx="3" ry="5" fill="#E8C050"/>
            <ellipse cx="158" cy="112" rx="5" ry="7" fill="#D4A030" opacity="0.9"/>
            <ellipse cx="158" cy="112" rx="3" ry="5" fill="#E8C050"/>

            {/* ===== ARMS ===== */}
            {/* Left arm */}
            <path d="M88,185 Q75,190 72,202 Q70,212 80,218 Q88,210 90,200 Q92,192 88,185Z"
                  fill="url(#skinGrad)"/>
            {/* Right arm */}
            <path d="M152,185 Q165,190 168,202 Q170,212 160,218 Q152,210 150,200 Q148,192 152,185Z"
                  fill="url(#skinGrad)"/>

            {/* Arm ornament bands */}
            <path d="M76,200 Q80,198 84,200" stroke="#C8860A" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M156,200 Q160,198 164,200" stroke="#C8860A" strokeWidth="2" fill="none" strokeLinecap="round"/>

            {/* ===== HANDS IN NAMASTE / ANJALI MUDRA ===== */}
            {/* Glow behind hands */}
            <circle className="hands-glow" cx="120" cy="198" r="20" fill="url(#handsGlowGrad)"/>

            {/* Left hand */}
            <path d="M105,205 Q108,195 114,190 L118,188 Q120,192 119,198 Q117,204 112,208 Q108,210 105,205Z"
                  fill="url(#skinGrad)"/>
            {/* Right hand */}
            <path d="M135,205 Q132,195 126,190 L122,188 Q120,192 121,198 Q123,204 128,208 Q132,210 135,205Z"
                  fill="url(#skinGrad)"/>
            {/* Hands overlap center */}
            <ellipse cx="120" cy="198" rx="8" ry="11" fill="url(#skinGrad)" opacity={0.9}/>

            {/* Finger details */}
            <path d="M116,189 L116,182" stroke="#C09030" strokeWidth="1" opacity={0.6} strokeLinecap="round"/>
            <path d="M119,188 L119,181" stroke="#C09030" strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
            <path d="M122,188 L122,181" stroke="#C09030" strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
            <path d="M125,189 L125,182" stroke="#C09030" strokeWidth="1" opacity="0.6" strokeLinecap="round"/>

            {/* ===== NECKLACE ===== */}
            <path d="M95,172 Q120,182 145,172" stroke="#C8860A" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M95,172 Q120,185 145,172" stroke="#FFE066" strokeWidth="1" fill="none" strokeLinecap="round" opacity={0.5}/>
            {/* Pendant */}
            <circle cx="120" cy="180" r="4" fill="#FFE066"/>
            <circle cx="120" cy="180" r="2.5" fill="#C8860A"/>
            <circle cx="120" cy="180" r="1.2" fill="#FFE066"/>

            {/* ===== JAIN SYMBOL ON CHEST ===== */}
            <text x="120" y="213" textAnchor="middle" fontSize="11" fill="#FFE066" opacity={0.6} fontFamily="serif">ॐ</text>

            {/* ===== BOTTOM SHADOW ===== */}
            <ellipse cx="120" cy="262" rx="50" ry="8" fill="#000" opacity={0.3}/>
        </svg>
    );
};

export default JainBabaSVG;
