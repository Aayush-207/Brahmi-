"use client";

import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import { motion } from 'framer-motion';

export function MarketingHero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-6 overflow-hidden bg-gradient-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613]">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px),
                                      radial-gradient(circle at 75% 75%, #E6D8B8 2px, transparent 2px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#E6D8B8]/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    
                    {/* Left: Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left space-y-8 order-2 lg:order-1"
                    >
                        {/* Decorative Tag */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E69A47]/10 border border-[#E69A47]/40 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-[#E69A47] animate-pulse"></span>
                            <span className="text-[#E69A47] text-sm font-medium tracking-wider">प्राचीन ज्ञान की प्रतिध्वनि</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#F5F1E8] font-bold leading-[1.1] tracking-tight">
                                ब्राह्मी लिपि में{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E69A47] via-[#D4AF37] to-[#CC7722] animate-gradient">
                                    जैन दर्शन
                                </span>
                            </h1>
                            
                            <h2 className="text-2xl md:text-3xl text-[#E6D8B8] font-semibold leading-relaxed">
                                ब्राह्मी लिपि के माध्यम से संरक्षित शाश्वत जैन ज्ञान।
                            </h2>
                            
                            <p className="text-lg md:text-xl text-[#B8AFA0] font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                यह पाठ्यक्रम ब्राह्मी लिपि को उस माध्यम के रूप में प्रस्तुत करता है जिसके द्वारा जैन दर्शन, मूल्य और आध्यात्मिक सिद्धांत पीढ़ी दर पीढ़ी सुरक्षित रहे हैं।
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center lg:justify-start">
                            <Link href="/learn" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto group relative h-16 px-12 text-lg font-bold bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#1a1613] rounded-2xl shadow-xl shadow-[#D4AF37]/20 hover:shadow-2xl hover:shadow-[#D4AF37]/30 hover:scale-105 transition-all duration-300 overflow-hidden">
                                    <span className="relative z-10 uppercase tracking-wider">अध्ययन प्रारंभ करें</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#E6D8B8] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Button>
                            </Link>
                            <Button className="w-full sm:w-auto h-16 px-12 text-lg font-medium bg-transparent border-2 border-[#D4A373]/40 text-[#D4A373] rounded-2xl hover:bg-[#D4A373]/10 hover:border-[#D4A373] transition-all duration-300 backdrop-blur-sm">
                                मूल आधार को समझिए
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
                            
                            <div className="relative w-72 h-72 md:w-[550px] md:h-[550px] animate-float">
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
