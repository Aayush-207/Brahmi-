"use client";

import Image from "next/image";
import Link from "next/link";

export default function DharmastalPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#141212] text-[#E6D8B8] py-16">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1a1613]/60 to-[#2a2420]/60 p-10 rounded-3xl shadow-2xl border border-[#E6D8B8]/10">
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 relative flex-shrink-0">
                            <Image src="/assets/jain_foundation_logo.jpg" alt="logo" fill className="object-contain rounded" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif text-[#E6B116] font-bold">धर्मस्थल का सहयोग</h1>
                            <p className="mt-2 text-[#B8AFA0]">धर्मस्थल संस्थान — ब्राह्मी लिपि संरक्षण एवं संवर्धन में अभिनन्दनीय सहयोग</p>
                        </div>
                    </div>

                    <article className="mt-8 prose prose-invert text-[#E6D8B8] prose-lg max-w-none">
                        <p><strong>धर्मस्थल</strong> कर्नाटक राज्य के दक्षिण कन्नड़ जनपद में पावन नेत्रावती नदी के तट पर अवस्थित एक अद्वितीय आध्यात्मिक एवं सांस्कृतिक तीर्थक्षेत्र है। यह पुण्यभूमि जैन, हिन्दू एवं विविध आस्थाओं के समन्वित सहअस्तित्व की अनुपम परम्परा का सजीव प्रतीक मानी जाती है। यहाँ स्थित प्राचीन जैन प्रतिमाओं की उपस्थिति, भगवान श्री मंजुनाथेश्वर की आराधना, प्राचीन शिव मन्दिर की उपस्थिति तथा धार्मिक सौहार्द की दीर्घ परम्परा; भारतीय संस्कृति की उदार एवं समन्वयशील चेतना को अभिव्यक्त करती है।</p>
                        <br />
                        <p><strong>धर्मस्थल संस्थान</strong> केवल एक धार्मिक केन्द्र न होकर शिक्षा, आरोग्य-सेवा, ग्रामोन्नयन, सांस्कृतिक संरक्षण एवं लोक-कल्याण के विविध आयामों में समर्पित एक विराट सेवा-संस्थान के रूप में प्रतिष्ठित है, जिसने असंख्य जनमानस के जीवन को स्पर्श कर उन्हें नवीन दिशा प्रदान की है।</p>
                        <br />
                        <blockquote>
                            <p><em>ब्राह्मी लिपि प्रचारक, श्रुताराधक सन्त क्षुल्लक श्री प्रज्ञांशसागर जी गुरुदेव की मंगल प्रेरणा एवं आध्यात्मिक मार्गदर्शन से संचालित ब्राह्मी लिपि पुनर्जागरण एवं संरक्षण-अभियान में धर्माधिकारी डॉ. डी. वीरेन्द्र हेगड़े जी तथा श्रद्धेया हेमवती हेगड़े जी द्वारा प्रदत्त सहयोग अत्यन्त प्रशन्सनीय एवं प्रेरणास्पद है।</em></p>
                        </blockquote>
                        <br />
                        <p>डॉ. डी. वीरेन्द्र हेगड़े जी, विगत अनेक दशकों से शिक्षा, ग्रामीण पुनरुत्थान, आरोग्य-सेवा, भारतीय संस्कृति एवं प्राचीन ज्ञान- परम्पराओं के संरक्षण हेतु उल्लेखनीय कार्य कर रहे हैं। भारतीय आध्यात्मिक धरोहर के प्रति उनकी गहन संवेदनशीलता एवं सांस्कृतिक प्रतिबद्धता ब्राह्मी लिपि जैसे महत्त्वपूर्ण अभियान से उनके जुड़ाव में स्पष्ट रूप से परिलक्षित होती है। श्रद्धेया हेमवती हेगड़े जी की सामाजिक, सांस्कृतिक एवं सेवा-प्रधान गतिविधियों में सतत् सक्रिय सहभागिता ने भी इस पवित्र प्रयास को निरन्तर प्रेरणा एवं सशक्तता प्रदान की है।</p>
                        <br />
                        <p><strong>गुड लाइफ जैन फाउंडेशन</strong> - धर्मस्थल संस्थान, आदरणीय डॉ. डी. वीरेन्द्र हेगड़े जी एवं श्रद्धेया हेमवती हेगड़े जी के प्रति हृदयांगम कृतज्ञता ज्ञापित करता है। उनके अमूल्य सहयोग एवं सद्भावनापूर्ण सहभागिता से भारतीय प्राचीन जैन श्रुत-परम्परा एवं ब्राह्मी लिपि संरक्षण का यह पुण्य उपक्रम और अधिक दृढ़, व्यापक एवं प्रभावी स्वरूप ग्रहण कर सका है।</p>

                        
                            <div className="mt-8">
                                <Link
                                    href="/"
                                    aria-label="Back to home"
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#292929] text-[#c09a05] hover:bg-transparent hover:text-[#E6D8B8] transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
                                        <path d="M19 12H6" />
                                        <path d="M12 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                            </div>
                    </article>
                </div>
            </div>
        </main>
    );
}
