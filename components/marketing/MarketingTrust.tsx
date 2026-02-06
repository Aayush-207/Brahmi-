"use client";

import { motion } from "framer-motion";

const TRUST_ITEMS = [
    {
        icon: "🏛️",
        title: "पवित्र उत्पत्ति",
        desc: "भगवान ऋषभदेव द्वारा रचित, उनकी पुत्री ब्रह्मी को प्रदान की गई। जैन आगमों की मूल लिपि।"
    },
    {
        icon: "🧘‍♂️",
        title: "अनुशासित अध्ययन",
        desc: "चरणबद्ध, धैर्यपूर्ण पद्धति। जैन शिक्षण परंपरा और आध्यात्मिक अध्ययन के अनुरूप।"
    },
    {
        icon: "📜",
        title: "ज्ञान का संरक्षण",
        desc: "जैन दार्शनिक ज्ञान को उसकी मूल लिपि और संरचना में सुरक्षित रखने के लिए डिज़ाइन किया गया।"
    }
];

export function MarketingTrust() {
    return (
        <section className="py-32 bg-gradient-to-b from-[#2a2420] to-[#1a1613] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E6D8B8] rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-20 space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B3A3A]/10 border border-[#8B3A3A]/40">
                        <span className="text-[#E69A47] text-sm font-bold tracking-[0.3em] uppercase">प्रामाणिकता</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#F5F1E8] leading-tight">
                        विश्वास का आधार
                    </h2>
                    <p className="text-xl text-[#B8AFA0] max-w-3xl mx-auto leading-relaxed">
                        हमारी पद्धति जैन परंपरा और शास्त्रीय अध्ययन के प्राचीन सिद्धांतों पर आधारित है
                    </p>
                </motion.div>

                {/* Trust Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {TRUST_ITEMS.map((item, index) => (
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
                            <div className="relative p-8 lg:p-10 bg-gradient-to-br from-[#2a2420]/80 to-[#1a1613]/80 backdrop-blur-sm rounded-3xl border border-[#D4A373]/20 hover:border-[#E69A47]/50 transition-all duration-500 shadow-xl h-full">
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E69A47]/20 to-[#D4A373]/10 flex items-center justify-center text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        {item.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl md:text-3xl font-bold text-[#D4A373] mb-4 font-serif">
                                    {item.title}
                                </h3>
                                <p className="text-lg text-[#B8AFA0] leading-relaxed">
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
