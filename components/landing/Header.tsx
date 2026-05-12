"use client";

import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    // Hide header on App routes (Journey, Lesson, etc.)
    const isAppPage = pathname?.startsWith('/letters') || pathname?.startsWith('/lesson') || pathname?.startsWith('/learn');

    if (isAppPage) return null;

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-gradient-to-r from-[#1a1613] via-[#2a2420] to-[#1a1613] border-b border-[#E6D8B8]/20 shadow-2xl backdrop-blur-sm"
            >
                <div className="h-full px-4 md:px-6 flex items-center justify-between">
                    {/* Left: Logo & Brand + Language Dropdown */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border-2 border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition-all duration-300 shrink-0 shadow-lg">
                                <img
                                    src="/assets/jain_foundation_logo.jpg"
                                    alt="Good Life Jain Foundation"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-base md:text-xl font-serif font-bold text-[#D4AF37] leading-tight tracking-wide group-hover:text-[#E6D8B8] transition-colors duration-300">
                                    {t('header.brandName')}
                                </span>
                                <span className="text-[10px] md:text-xs font-medium text-[#B8AFA0] tracking-wider leading-none mt-0.5">
                                    {t('header.brandTagline')}
                                </span>
                            </div>
                        </Link>

                        {/* Language Dropdown - Desktop */}
                        <div className="hidden md:block relative z-[999]">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2a2420] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300"
                            >
                                <Globe size={18} />
                                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                            </button>
                            <AnimatePresence>
                                {isLangMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 mt-2 bg-[#2a2420] border border-[#D4AF37]/30 rounded-lg shadow-2xl overflow-hidden z-[9999] min-w-max"
                                    >
                                        <button
                                            onClick={() => {
                                                setLanguage('hi');
                                                setIsLangMenuOpen(false);
                                            }}
                                            className={`w-full px-6 py-3 text-left hover:bg-[#D4AF37]/10 transition-colors whitespace-nowrap ${
                                                language === 'hi' ? 'text-[#E69A47]' : 'text-[#B8AFA0]'
                                            }`}
                                        >
                                            हिन्दी (Hindi)
                                        </button>
                                        <button
                                            onClick={() => {
                                                setLanguage('en');
                                                setIsLangMenuOpen(false);
                                            }}
                                            className={`w-full px-6 py-3 text-left hover:bg-[#D4AF37]/10 transition-colors border-t border-[#D4AF37]/20 whitespace-nowrap ${
                                                language === 'en' ? 'text-[#E69A47]' : 'text-[#B8AFA0]'
                                            }`}
                                        >
                                            English
                                        </button>
                                        <button
                                            onClick={() => {
                                                setLanguage('kn');
                                                setIsLangMenuOpen(false);
                                            }}
                                            className={`w-full px-6 py-3 text-left hover:bg-[#D4AF37]/10 transition-colors border-t border-[#D4AF37]/20 whitespace-nowrap ${
                                                language === 'kn' ? 'text-[#E69A47]' : 'text-[#B8AFA0]'
                                            }`}
                                        >
                                            ಕನ್ನಡ (Kannada)
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Desktop Actions - Right */}
                    <div className="hidden md:flex items-center gap-4">
                        <AuthButton />
                        <Link href="/learn">
                            <Button className="relative h-11 px-8 text-sm font-bold bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#1a1613] rounded-xl hover:scale-105 transition-all duration-300 uppercase tracking-wider shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 overflow-hidden group">
                                <span className="relative z-10">{t('header.startLearning')}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#E6D8B8] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-[#2a2420] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden border-t border-[#E6D8B8]/20 bg-gradient-to-b from-[#2a2420] to-[#1a1613] overflow-hidden"
                        >
                            <div className="flex flex-col gap-4 p-6 items-center">
                                {/* Language Dropdown Mobile */}
                                <div className="w-full flex flex-col gap-2">
                                    <button
                                        onClick={() => {
                                            setLanguage('hi');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                                            language === 'hi'
                                                ? 'bg-[#D4AF37]/20 text-[#E69A47]'
                                                : 'bg-[#2a2420] border border-[#D4AF37]/30 text-[#B8AFA0] hover:bg-[#D4AF37]/10'
                                        }`}
                                    >
                                        हिन्दी (Hindi)
                                    </button>
                                    <button
                                        onClick={() => {
                                            setLanguage('en');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                                            language === 'en'
                                                ? 'bg-[#D4AF37]/20 text-[#E69A47]'
                                                : 'bg-[#2a2420] border border-[#D4AF37]/30 text-[#B8AFA0] hover:bg-[#D4AF37]/10'
                                        }`}
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => {
                                            setLanguage('kn');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                                            language === 'kn'
                                                ? 'bg-[#D4AF37]/20 text-[#E69A47]'
                                                : 'bg-[#2a2420] border border-[#D4AF37]/30 text-[#B8AFA0] hover:bg-[#D4AF37]/10'
                                        }`}
                                    >
                                        ಕನ್ನಡ (Kannada)
                                    </button>
                                </div>

                                <AuthButton />
                                <Link href="/learn" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="relative w-full h-12 text-sm font-bold bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#1a1613] rounded-xl hover:scale-105 transition-all duration-300 uppercase tracking-wider shadow-lg shadow-[#D4AF37]/30 overflow-hidden group">
                                        <span className="relative z-10">{t('header.startLearning')}</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#E6D8B8] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
            {/* Spacer to prevent content from hiding behind fixed header */}
            <div className="h-[72px]" aria-hidden="true" />
        </>
    );
}
