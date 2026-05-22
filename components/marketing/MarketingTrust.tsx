"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const TRUST_ITEMS = [
    {
        icon: "🏛️",
        title: "trust.items.0.title",
        desc: "trust.items.0.description"
    },
    {
        icon: "🧘‍♂️",
        title: "trust.items.1.title",
        desc: "trust.items.1.description"
    },
    {
        icon: "📜",
        title: "trust.items.2.title",
        desc: "trust.items.2.description"
    }
];

export function MarketingTrust() {
    const { t } = useLanguage();

    const translatedItems = TRUST_ITEMS.map(item => ({
        ...item,
        title: t(item.title),
        desc: t(item.desc)
    }));
    
    return (
        <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-b from-[#2a2420] to-[#1a1613] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[#E6D8B8] rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16 md:mb-20 space-y-4 sm:space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B3A3A]/10 border border-[#8B3A3A]/40">
                        <span className="text-[#E69A47] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">{t('trust.badge')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5F1E8] leading-tight">
                        {t('trust.title')}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-[#B8AFA0] max-w-3xl mx-auto leading-relaxed">
                        {t('trust.description')}
                    </p>
                </motion.div>

                {/* Trust Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {translatedItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            {/* Card glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#E6D8B8]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Card */}
                            <div className="relative p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#2a2420]/80 to-[#1a1613]/80 backdrop-blur-sm rounded-3xl border border-[#D4A373]/20 hover:border-[#E69A47]/50 transition-all duration-500 shadow-xl h-full">
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#E69A47]/20 to-[#D4A373]/10 flex items-center justify-center text-4xl sm:text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        {item.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#D4A373] mb-3 sm:mb-4 font-serif">
                                    {item.title}
                                </h3>
                                <p className="text-base sm:text-lg text-[#B8AFA0] leading-relaxed">
                                    {item.desc}
                                </p>

                                {/* Decorative corner */}
                                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#E69A47]/40 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
