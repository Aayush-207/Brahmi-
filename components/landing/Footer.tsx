"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export function Footer() {
    const { t, language } = useLanguage();

    return (
        <footer className="bg-[#111111] text-[#E6D8B8] py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                    {/* Left column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 relative">
                                <Image src="/assets/jain_foundation_logo.jpg" alt="logo" fill className="object-contain rounded" />
                            </div>
                            <div>
                                <h4 className="text-xl font-serif text-[#E6B116] font-bold">Good Life Jain Foundation</h4>
                                <p className="text-sm text-[#B8AFA0]">Reviving Brahmi Script</p>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-sm text-[#E6B116] font-semibold">Under the Guidance of</h5>
                            <p className="mt-2 text-[#E6B116]">शृुताराधक सन्त ध्वुलक श्री प्रशांसागर जी गुरुदेव</p>
                        </div>

                        <div>
                            <h6 className="text-sm text-[#E6B116] font-semibold">CONNECT WITH US</h6>
                            <div className="flex gap-3 mt-3 items-center">
                                {/* Facebook - larger, filled circle with 'f' */}
                                <a className="group w-11 h-11 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#E6B116]/10 transition-colors text-[#9CA3AF] hover:text-[#E6B116]" href="https://www.facebook.com/pragyansh.sagar.5?rdid=3Y7scf0cG0lszMxL&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FaytFEk9LmPVULqta%2F#" target="_blank" rel="noopener noreferrer" aria-label="facebook">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 1.86 6.48 1.86 12.07c0 4.99 3.66 9.13 8.44 9.88v-6.99H8.26v-2.89h2.04V9.41c0-2.02 1.2-3.13 3.04-3.13.88 0 1.8.16 1.8.16v1.98h-1.03c-1.02 0-1.34.63-1.34 1.28v1.53h2.27l-.36 2.89h-1.91v6.99c4.78-.75 8.44-4.89 8.44-9.88z"/></svg>
                                </a>

                                {/* Play Store - icon only */}
                                <a className="group w-11 h-11 rounded-md bg-[#222] flex items-center justify-center hover:bg-[#E6B116]/10 transition-colors text-[#9CA3AF] hover:text-[#E6B116]" href="https://play.google.com/store/apps/details?id=com.goodlife.bramhi" target="_blank" rel="noopener noreferrer" aria-label="playstore">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3.7 2.4C3.3 2.6 3 3.1 3 3.7v16.6c0 .6.3 1.1.7 1.3 0 0 13.3-7.4 16.5-9.2 1.1-.6 1.1-1.5 0-2.1C17.8 9.6 3.7 2.4 3.7 2.4zM10 12l7 4-7-4z"/></svg>
                                </a>

                                {/* Instagram - larger rounded */}
                                <a className="group w-11 h-11 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#E6B116]/10 transition-colors text-[#9CA3AF] hover:text-[#E6B116]" href="https://www.instagram.com/pragyanshsagar_/profilecard/?igsh=MXNrdmp2d2xvc2t1Zw%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="instagram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" stroke="currentColor" strokeWidth="1.4" fill="none"/><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor"/></svg>
                                </a>

                                {/* YouTube - larger */}
                                <a className="group w-11 h-11 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#E6B116]/10 transition-colors text-[#9CA3AF] hover:text-[#E6B116]" href="https://www.youtube.com/@shrutaaraadhak_sant_pragyansh" target="_blank" rel="noopener noreferrer" aria-label="youtube">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M23.5 7.2s-.2-1.7-.8-2.4c-.8-1-1.8-1.1-2.4-1.2C16.4 3 12 3 12 3s-4.4 0-7.8.5c-.6.1-1.6.2-2.4 1.2C1.7 5.5 1.5 7.2 1.5 7.2S1 9 1.1 10.7c.1 1.7.5 3.5.5 3.5s.2 1.7.8 2.4c.8 1 1.9 1 2.5 1.1 1.8.2 7.6.4 7.6.4s4.4 0 7.8-.4c.6-.1 1.6-.2 2.4-1.2.6-.7.8-2.4.8-2.4s.4-1.8.5-3.5c-.1-1.7-.5-3.5-.5-3.5zM10.2 14.1V8.1l5 3-5 3z"/></svg>
                                </a>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h6 className="text-sm text-[#E6B116] font-semibold">WRITE TO US</h6>
                            <div className="mt-2 flex items-center gap-3 text-[#E6B116]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-1 4-7 4.5L5 8V6l7 4.5L19 6v2z" fill="#E6B116"/></svg>
                                <a href="mailto:goodlifejainfoundation@gmail.com" className="text-[#E6B116]">goodlifejainfoundation@gmail.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Middle column - Section Links */}
                    <div className="text-[#B8AFA0]">
                        <h5 className="text-lg text-[#E6B116] font-semibold mb-4">Quick Links</h5>
                        <div className="flex flex-col gap-3 text-sm">
                            <a href="#method" className="hover:underline">{t('method.tag')}</a>
                            <a href="#trust" className="hover:underline">{t('trust.badge')}</a>
                            <Link href="/learn" className="hover:underline">{t('header.startLearning') || 'Start Learning'}</Link>
                        </div>
                    </div>

                    {/* Right column - Get in Touch */}
                    <div className="">
                        <h5 className="text-lg text-[#E6B116] font-semibold mb-4">Get in Touch</h5>

                        <button className="w-full md:w-auto inline-flex items-center gap-3 bg-[#E6B116] text-black px-6 py-3 rounded-md shadow-md mb-4">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 8L12 13 3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1z" fill="black"/></svg>
                            <span className="font-medium">Send us your thoughts</span>
                        </button>

                        <div className="mt-2 bg-[#1f1f1f] p-4 rounded-md border border-[#2a2a2a]">
                            <div className="text-sm text-[#9CA3AF]">Brahmi Script</div>
                            <div className="mt-3 text-2xl text-[#E6B116] font-serif">𑀦𑀫</div>
                            <div className="text-xs text-[#9CA3AF] mt-2">Namaskaar (Greetings)</div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#2a2a2a] mt-8 pt-6 flex items-center justify-between text-sm text-[#9CA3AF]">
                    <div>© {new Date().getFullYear()} Good Life Jain Foundation. All rights reserved.</div>
                    <div className="hidden md:block text-[#E6B116]">शृुताराधक सन्त ध्वुलक श्री प्रशांसागर जी गुरुदेव</div>
                </div>
            </div>
        </footer>
    );
}
