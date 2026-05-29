"use client";

import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export function MarketingHero() {
    const { t, language } = useLanguage();
    const badgeClassName = language === 'en'
        ? 'text-[#E69A47] text-xs sm:text-sm font-medium tracking-wider uppercase'
        : 'text-[#E69A47] text-xs sm:text-sm font-medium tracking-normal normal-case';
    const heroPrefix = language === 'hi'
        ? 'ब्राह्मी लिपि में'
        : language === 'kn'
            ? 'ಬ್ರಾಹ್ಮೀ ಲಿಪಿಯಲ್ಲಿ'
            : language === 'ta'
                ? 'பிராமி எழுத்தில்'
                : 'Brahmi Script in';

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613]">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px),
                                      radial-gradient(circle at 75% 75%, #E6D8B8 2px, transparent 2px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-20 right-10 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[#E6D8B8]/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
                    
                    {/* Left: Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1"
                    >
                        {/* Decorative Tag */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E69A47]/10 border border-[#E69A47]/40 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-[#E69A47] animate-pulse"></span>
                            <span className={badgeClassName}>{t('hero.tag')}</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-serif text-[#F5F1E8] font-bold leading-[1.1] tracking-tight">
                                {heroPrefix}{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E69A47] via-[#D4AF37] to-[#CC7722] animate-gradient">
                                    {t('hero.titleGradient')}
                                </span>
                            </h1>
                            
                            <h2 className="text-lg sm:text-xl md:text-3xl text-[#E6D8B8] font-semibold leading-relaxed">
                                {t('hero.subtitle')}
                            </h2>
                            
                            <p className="text-base sm:text-lg md:text-xl text-[#B8AFA0] font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                {t('hero.description')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 pt-3 sm:pt-4 justify-center lg:justify-start">
                            <Link href="/learn" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto group relative h-12 sm:h-14 md:h-16 px-5 sm:px-8 md:px-12 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#1a1613] rounded-2xl shadow-xl shadow-[#D4AF37]/20 hover:shadow-2xl hover:shadow-[#D4AF37]/30 hover:scale-105 transition-all duration-300 overflow-hidden">
                                    <span className="relative z-10 uppercase tracking-wider">{t('hero.primaryBtn')}</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#E6D8B8] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Button>
                            </Link>
                            <Button className="w-full sm:w-auto h-12 sm:h-14 md:h-16 px-5 sm:px-8 md:px-12 text-sm sm:text-base md:text-lg font-medium bg-transparent border-2 border-[#D4A373]/40 text-[#D4A373] rounded-2xl hover:bg-[#D4A373]/10 hover:border-[#D4A373] transition-all duration-300 backdrop-blur-sm">
                                {t('hero.secondaryBtn')}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right: Mascot */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center lg:justify-end order-1 lg:order-2"
                    >
                        <div className="relative">
                            {/* Glow effect behind mascot */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#E6D8B8]/20 rounded-full blur-2xl scale-110"></div>
                            
                            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-[550px] md:h-[550px] animate-float">
                                <img
                                    src="/mascot/mascot_hero.png"
                                    alt="Brahmi Scholar Mascot"
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
