"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function Hero() {
    return (
        <Section className="min-h-screen flex items-center relative overflow-hidden p-0">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/Gemini_Generated_Image_dvlyj0dvlyj0dvly.png"
                    alt="Brahmi Lipi Background"
                    className="w-full h-full object-cover"
                />

                {/* Bottom gradient for smooth footer transition only */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </div>

            {/* Content - Left Aligned, No Card, High Contrast */}
            <div className="relative z-10 mx-auto px-4 md:px-8 h-full flex items-center pt-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-2xl space-y-8"
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="flex items-center space-x-4"
                        >
                            <div className="h-[2px] w-12 bg-accent-gold shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                            <h2 className="text-accent-gold font-bold tracking-[0.3em] uppercase text-xs md:text-sm drop-shadow-md">
                                प्राचीन ज्ञान की प्रतिध्वनि
                            </h2>
                        </motion.div>

                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-[#F5F1E8] leading-[0.9] tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                            ब्राह्मी लिपि में <br />
                            <span className="italic text-accent-saffron relative inline-block pt-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                                जैन दर्शन
                                {/* Decorative underline */}
                                <svg className="absolute w-full h-3 -bottom-2 left-0 text-accent-saffron/80 drop-shadow-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-[#F5F1E8]/90 max-w-xl leading-relaxed font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            ब्राह्मी लिपि के माध्यम से संरक्षित शाश्वत जैन ज्ञान। यह केवल अक्षरों का समूह नहीं, बल्कि जैन परंपरा की आत्मा है।
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 pt-4">
                        <Link href="/letters">
                            <Button size="lg" variant="primary" className="text-lg px-6 sm:px-10 py-4 sm:py-6 h-auto shadow-xl hover:shadow-accent-gold/20 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto whitespace-normal text-center">
                                अध्ययन प्रारंभ करें
                            </Button>
                        </Link>
                        <Button size="lg" variant="secondary" className="text-lg px-6 sm:px-10 py-4 sm:py-6 h-auto bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/40 hover:border-white/40 text-white transition-all duration-300 shadow-lg whitespace-normal">
                            मूल आधार को समझिए
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-10 flex flex-col items-center gap-2 text-[#F5F1E8]/50 drop-shadow-md"
            >
                <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#F5F1E8]/50 to-transparent" />
            </motion.div>
        </Section>
    );
}
