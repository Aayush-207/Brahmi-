"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export function MarketingCTA() {
    const { t, language } = useLanguage();

    return (
        <section className="py-32 bg-gradient-to-b from-[#1a1613] to-[#2a2420] text-center px-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#D4AF37]/10 via-[#E6D8B8]/5 to-transparent rounded-full blur-3xl"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto relative z-10"
            >
                {/* Decorative card container */}
                <div className="relative p-12 md:p-16 lg:p-20 rounded-3xl bg-gradient-to-br from-[#2a2420]/60 to-[#1a1613]/60 backdrop-blur-xl border border-[#E6D8B8]/30 shadow-2xl">
                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#D4AF37] rounded-br-3xl"></div>

                    <div className="space-y-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#8B3A3A]/20 border border-[#8B3A3A]/50">
                            <span className="w-2 h-2 rounded-full bg-[#E69A47] animate-pulse"></span>
                            <span className="text-[#E69A47] text-sm font-bold tracking-[0.3em] uppercase">{t('cta.badge')}</span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-[#F5F1E8] leading-tight">
                            {t('cta.title')}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E69A47] via-[#CC7722] to-[#D4AF37]">
                                {t('cta.titleGradient')}
                            </span>
                        </h2>
                        
                        {/* Description */}
                        <p className="text-xl md:text-2xl text-[#B8AFA0] font-medium leading-relaxed max-w-3xl mx-auto">
                            {t('cta.description')}
                        </p>
                        
                        {/* CTA Button */}
                        <div className="pt-8">
                            <Link href="/learn">
                                <Button className="group relative h-16 sm:h-20 px-6 sm:px-16 text-lg sm:text-xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#E6D8B8] to-[#D4AF37] text-[#1a1613] rounded-2xl shadow-2xl shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 hover:scale-110 transition-all duration-500 overflow-hidden uppercase tracking-wider w-full sm:w-auto max-w-full">
                                    <span className="relative z-10 flex items-center gap-3">
                                        {t('cta.button')}
                                        <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#E6D8B8] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </Button>
                            </Link>
                        </div>

                        {/* Stats or features */}
                        <div className="pt-8 flex flex-wrap justify-center gap-8 md:gap-12 text-center">
                            <div className="space-y-2">
                                <div className="text-3xl md:text-4xl font-bold text-[#E69A47]">100+</div>
                                <div className="text-sm text-[#D4A373] uppercase tracking-wider">अक्षर</div>
                            </div>
                            <div className="w-px h-12 bg-[#D4A373]/30"></div>
                            <div className="space-y-2">
                                <div className="text-3xl md:text-4xl font-bold text-[#CC7722]">∞</div>
                                <div className="text-sm text-[#D4A373] uppercase tracking-wider">ज्ञान</div>
                            </div>
                            <div className="w-px h-12 bg-[#D4A373]/30"></div>
                            <div className="space-y-2">
                                <div className="text-3xl md:text-4xl font-bold text-[#D4AF37]">2500+</div>
                                <div className="text-sm text-[#D4A373] uppercase tracking-wider">वर्ष</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
