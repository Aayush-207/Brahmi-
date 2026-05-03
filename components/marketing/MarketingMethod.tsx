"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const STEPS = [
    {
        title: "method.steps.0.title",
        desc: "method.steps.0.description",
        image: "/mascot/mascot_2.png",
        icon: "🏛️"
    },
    {
        title: "method.steps.1.title",
        desc: "method.steps.1.description",
        image: "/mascot/mascot_3.png",
        icon: "📝"
    },
    {
        title: "method.steps.2.title",
        desc: "method.steps.2.description",
        image: "/mascot/mascot_1.png",
        icon: "✨"
    }
];

export function MarketingMethod() {
    const { t } = useLanguage();
    
    const translatedSteps = STEPS.map(step => ({
        ...step,
        title: t(step.title),
        desc: t(step.desc)
    }));
    
    return (
        <section className="py-32 bg-gradient-to-b from-[#1a1613] to-[#2a2420] relative overflow-hidden">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4A373]/10 border border-[#D4A373]/40">
                        <span className="text-[#D4A373] text-sm font-bold tracking-[0.3em] uppercase">{t('method.tag')}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5F1E8] leading-tight">
                        {t('method.title')}
                    </h2>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37]/50 via-[#E6D8B8]/30 to-[#D4AF37]/50 transform -translate-x-1/2"></div>

                <div className="space-y-32">
                    {translatedSteps.map((step, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className={`flex flex-col md:flex-row items-center gap-12 md:gap-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Content */}
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                {/* Step Number Badge */}
                                <div className="flex items-center gap-4 justify-center md:justify-start">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E69A47] to-[#CC7722] flex items-center justify-center text-3xl shadow-xl shadow-[#E69A47]/30">
                                            {step.icon}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#D4A373] border-2 border-[#1a1613] flex items-center justify-center text-xs font-bold text-[#1a1613]">
                                            {index + 1}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#D4A373] leading-tight">
                                    {step.title}
                                </h3>
                                
                                <p className="text-lg md:text-xl text-[#B8AFA0] font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                                    {step.desc}
                                </p>
                            </div>

                            {/* Image Card */}
                            <div className="flex-1 flex justify-center w-full">
                                <div className="relative group">
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#E6D8B8]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                                    
                                    {/* Card */}
                                    <div className="relative w-full max-w-sm aspect-square bg-gradient-to-br from-[#2a2420] to-[#1a1613] rounded-3xl shadow-2xl border border-[#E6D8B8]/20 flex items-center justify-center overflow-hidden backdrop-blur-sm transform group-hover:scale-105 transition-all duration-500">
                                        {/* Inner glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="relative z-10 w-4/5 h-4/5 object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
