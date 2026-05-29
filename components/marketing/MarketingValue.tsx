"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export function MarketingValue() {
    const { t, language } = useLanguage();
    const badgeClassName = language === 'en'
        ? 'text-[#D4A373] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase'
        : 'text-[#D4A373] text-xs sm:text-sm font-bold tracking-normal normal-case';

    return (
        <section className="py-20 sm:py-24 md:py-32 bg-linear-to-b from-[#2a2420] to-[#1a1613] relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#E6D8B8]/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
                    {/* Mascot - Enhanced with card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex justify-center"
                    >
                        <div className="relative group">
                            {/* Card background with glassmorphism */}
                            <div className="absolute inset-0 bg-linear-to-br from-[#E6D8B8]/10 to-[#D4AF37]/5 rounded-3xl backdrop-blur-sm border border-[#E6D8B8]/20 transform group-hover:scale-105 transition-transform duration-500"></div>
                            
                            <div className="relative p-6 sm:p-8 md:p-12">
                                <img
                                    src="/mascot/mascot_1.png"
                                    alt="Brahmi Mascot"
                                    className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-6 sm:space-y-8 text-center md:text-left"
                    >
                        {/* Decorative line */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4A373]/10 border border-[#D4A373]/40">
                            <span className={badgeClassName}>{t('value.tag')}</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5F1E8] leading-tight">
                            {t('value.title')}
                        </h2>
                        
                        <p className="text-base sm:text-lg md:text-2xl text-[#B8AFA0] font-medium leading-relaxed">
                            {t('value.description')}
                        </p>
                        
                        <div className="pt-4">
                            <a href="/dharmastal">
                                <Button className="group px-5 sm:px-7 md:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-[#CC7722] border-2 border-[#CC7722]/40 bg-transparent hover:bg-[#CC7722]/10 hover:border-[#CC7722] rounded-xl uppercase tracking-widest transition-all duration-300">
                                    {t('value.button')}
                                    <span className="inline-block ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
