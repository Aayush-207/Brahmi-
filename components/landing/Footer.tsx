"use client";

import { useLanguage } from "@/lib/LanguageContext";

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-gradient-to-b from-[#2a2420] to-[#1a1613] text-[#E6D8B8] py-16 border-t border-[#E6D8B8]/20 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E69A47] rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A373] rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex justify-center">
                    <div className="space-y-4 text-center">
                        <h3 className="text-2xl font-serif text-[#E69A47] font-bold">{t('footer.title')}</h3>
                        <p className="text-[#B8AFA0] text-sm leading-relaxed">
                            {t('footer.description')}
                        </p>
                    </div>
                </div>

                <div className="mt-16 pt-8 text-center">
                    <p className="text-sm text-[#B8AFA0]">
                        {t('footer.copyright').replace('{{year}}', new Date().getFullYear().toString())}
                    </p>
                </div>
            </div>
        </footer>
    );
}
