import React from 'react';

interface JainBabaSVGProps {
    variant?: 'default' | 'excited' | 'encouraging' | 'celebrating';
    size?: number;
    isSpeaking?: boolean;
}

const JainBabaSVG: React.FC<JainBabaSVGProps> = ({ variant = 'default', size, isSpeaking = false }) => {
    const containerStyle: React.CSSProperties = size 
        ? { width: size, height: (size * 520) / 500, position: 'relative' } 
        : { width: '100%', aspectRatio: '500 / 520', position: 'relative' };

    return (
        <div style={containerStyle} className="scene-container">
            <style>{`
                .scene-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: visible;
                }

                /* ── AMBIENT GLOW BEHIND CHARACTER ── */
                .bg-glow {
                    position: absolute;
                    width: 76%;
                    height: 73%;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(255,180,30,0.22) 0%, rgba(200,100,0,0.1) 50%, transparent 70%);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    transition: background 0.3s ease;
                }
                .bg-glow.speaking {
                    background: radial-gradient(circle, rgba(255,180,30,0.3) 0%, rgba(200,100,0,0.15) 50%, transparent 70%);
                }

                /* ── ORBIT PATH ── */
                .orbit-ring {
                    position: absolute;
                    width: 84%;
                    height: 31%;
                    border-radius: 50%;
                    border: 1.5px solid rgba(255,180,30,0.2);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotateX(70deg);
                    pointer-events: none;
                }

                /* ── ORBITING BALL ── */
                .orbit-container {
                    position: absolute;
                    width: 76%;
                    height: 73%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -52%);
                    animation: orbitSpin 3.5s linear infinite;
                    pointer-events: none;
                    z-index: 10;
                }
                .orbit-container.speaking {
                    animation-duration: 1.8s;
                }

                .orbit-ball {
                    position: absolute;
                    width: 11%;
                    aspect-ratio: 1;
                    border-radius: 50%;
                    background: radial-gradient(circle at 35% 30%, #fff5a0, #f5c030 40%, #c87800 80%, #7a4400);
                    top: -5.5%;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow:
                        0 0 12px 4px rgba(255,200,50,0.7),
                        0 0 28px 10px rgba(255,160,0,0.4),
                        0 0 55px 20px rgba(200,100,0,0.2);
                }

                .orbit-ball::after {
                    content: '';
                    position: absolute;
                    width: 140%;
                    height: 28%;
                    background: linear-gradient(to left, rgba(255,180,30,0.6), transparent);
                    border-radius: 50%;
                    top: 50%;
                    right: 100%;
                    transform: translateY(-50%);
                    filter: blur(3px);
                }

                @keyframes orbitSpin {
                    from { transform: translate(-50%, -52%) rotate(0deg); }
                    to   { transform: translate(-50%, -52%) rotate(360deg); }
                }

                /* ── CHARACTER IMAGE ── */
                .character {
                    position: relative;
                    z-index: 5;
                    width: 76%;
                    animation: floatIdle 3s ease-in-out infinite;
                    mix-blend-mode: normal;
                    transition: transform 0.2s ease;
                }
                
                .character.speaking {
                    animation: speakBounce 0.4s ease-in-out infinite alternate;
                }

                .character img {
                    width: 100%;
                    height: auto;
                    filter: drop-shadow(0 10px 30px rgba(255,160,30,0.4));
                    transition: filter 0.3s ease;
                }
                
                .character.speaking img {
                    filter: drop-shadow(0 10px 40px rgba(255,160,30,0.6));
                }

                @keyframes floatIdle {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-3.7%); }
                }

                @keyframes speakBounce {
                    from { transform: translateY(0) scale(1); }
                    to   { transform: translateY(-4%) scale(1.04); }
                }



                /* ── GROUND SHADOW ── */
                .shadow {
                    position: absolute;
                    bottom: 2.3%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 44%;
                    height: 4.2%;
                    border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%);
                    animation: shadowPulse 3s ease-in-out infinite;
                    z-index: 1;
                }
                
                .shadow.speaking {
                    animation-duration: 0.4s;
                    animation-name: shadowSpeakPulse;
                }

                @keyframes shadowPulse {
                    0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.55; }
                    50%      { transform: translateX(-50%) scaleX(0.85); opacity: 0.3; }
                }

                @keyframes shadowSpeakPulse {
                    from { transform: translateX(-50%) scaleX(1); opacity: 0.55; }
                    to   { transform: translateX(-50%) scaleX(0.92); opacity: 0.45; }
                }
            `}</style>

            {/* Ambient glow */}
            <div className={`bg-glow ${isSpeaking ? 'speaking' : ''}`} />

            {/* Orbit ring visual */}
            <div className="orbit-ring" />

            {/* Orbiting gold ball */}
            <div className={`orbit-container ${isSpeaking ? 'speaking' : ''}`}>
                <div className="orbit-ball" />
            </div>

            {/* Ground shadow */}
            <div className={`shadow ${isSpeaking ? 'speaking' : ''}`} />

            {/* Real character image (bg removed) */}
            <div className={`character ${isSpeaking ? 'speaking' : ''}`}>
                <img 
                    src="/mascot/guruji.png" 
                    alt="Guruji Character" 
                />
            </div>


        </div>
    );
};

export default JainBabaSVG;
