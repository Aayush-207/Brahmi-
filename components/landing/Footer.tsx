import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-gradient-to-b from-[#2a2420] to-[#1a1613] text-[#E6D8B8] py-16 border-t border-[#E6D8B8]/20 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E69A47] rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A373] rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif text-[#E69A47] font-bold">ब्राह्मी लिपि</h3>
                        <p className="text-[#B8AFA0] text-sm leading-relaxed">
                            आधुनिक तकनीक के माध्यम से प्राचीन ज्ञान का संरक्षण।
                        </p>
                        {/* Decorative element */}
                        <div className="flex items-center gap-2 pt-2">
                            <div className="h-px w-12 bg-gradient-to-r from-[#E69A47] to-transparent"></div>
                            <span className="text-[#CC7722] text-xs">✨</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-[#E6D8B8] text-lg font-serif">सीखें</h4>
                        <ul className="space-y-3 text-sm text-[#B8AFA0]">
                            <li><Link href="/letters" className="hover:text-[#CC7722] transition-colors duration-300 flex items-center gap-2">
                                <span className="text-[#E69A47]">→</span> पाठ्यक्रम
                            </Link></li>
                            <li><Link href="/letters" className="hover:text-[#CC7722] transition-colors duration-300 flex items-center gap-2">
                                <span className="text-[#E69A47]">→</span> अभ्यास
                            </Link></li>
                            <li><Link href="#" className="hover:text-[#CC7722] transition-colors duration-300 flex items-center gap-2">
                                <span className="text-[#E69A47]">→</span> शब्दकोश
                            </Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-[#E6D8B8] text-lg font-serif">दर्शन</h4>
                        <ul className="space-y-3 text-sm text-[#B8AFA0]">
                            <li><Link href="#philosophy" className="hover:text-[#CC7722] transition-colors duration-300 flex items-center gap-2">
                                <span className="text-[#E69A47]">→</span> जैन सिद्धांत
                            </Link></li>
                            <li><Link href="#" className="hover:text-[#CC7722] transition-colors duration-300 flex items-center gap-2">
                                <span className="text-[#E69A47]">→</span> इतिहास
                            </Link></li>
                            <li><Link href="#" className="hover:text-[#CC7722] transition-colors duration-300 flex items-center gap-2">
                                <span className="text-[#E69A47]">→</span> हस्तलेख
                            </Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-[#E6D8B8] text-lg font-serif">संपर्क</h4>
                        <ul className="space-y-3 text-sm text-[#B8AFA0]">
                            <li><Link href="#about" className="hover:text-[#CC7722] transition-colors duration-300 flex items-center gap-2">
                                <span className="text-[#E69A47]">→</span> हमारे बारे में
                            </Link></li>
                            <li><Link href="#" className="hover:text-[#CC7722] transition-colors duration-300 flex items-center gap-2">
                                <span className="text-[#E69A47]">→</span> संपर्क करें
                            </Link></li>
                            <li><Link href="#" className="hover:text-[#CC7722] transition-colors duration-300 flex items-center gap-2">
                                <span className="text-[#E69A47]">→</span> समुदाय
                            </Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[#E6D8B8]/20 text-center">
                    <p className="text-sm text-[#B8AFA0]">
                        © {new Date().getFullYear()} ब्राह्मी लिपि शिक्षण मंच। सर्वाधिकार सुरक्षित।
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <div className="h-px w-8 bg-[#D4A373]/30"></div>
                        <span className="text-[#CC7722] text-xs">🕉️</span>
                        <div className="h-px w-8 bg-[#D4A373]/30"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
