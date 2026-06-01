"use client";

import Image from "next/image";

function Strong({ children }: { children: React.ReactNode }) {
    return <strong className="font-bold text-black">{children}</strong>;
}

export default function DharmastalPage() {
    return (
        <main className="min-h-screen bg-white text-black">
            <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <header className="text-center">
                    <h1 className="text-[2rem] font-bold leading-none text-red-600 sm:text-[2.25rem] lg:text-[2.5rem]">
                        धर्मस्थल परिचय
                    </h1>
                    <h2 className="mt-5 text-[1.15rem] font-bold leading-snug text-black sm:text-[1.35rem] lg:text-[1.5rem]">
                        ब्राह्मी लिपि संरक्षण एवं संवर्धन में अभिन्नन्दनीय प्रयास
                    </h2>
                </header>

                <section className="mt-5 space-y-4 text-justify text-[1.06rem] leading-[1.65] sm:text-[1.08rem] lg:text-[1.12rem]">
                    <p>
                        <Strong>धर्मस्थल</Strong> कर्नाटक राज्य के दक्षिण कन्नड़ जनपद की नेत्रावती नदी के तट पर स्थित एक अद्वितीय आध्यात्मिक एवं आध्यात्मिक तीर्थक्षेत्र है।
                        यह पुण्यभूमि जैन, हिन्दू एवं विविध आस्थाओं के समन्वित सहअस्तित्व की अनुपम परम्परा का सजीव प्रतीक माना जाती है। यहाँ स्थित प्राचीन
                        जैन प्रतिमाओं की उपस्थिति, भगवान श्री मंजुनाथेश्वर की आराधना तथा धार्मिक सौहार्द की दीर्घ परम्परा; भारतीय संस्कृति की उदार एवं
                        समन्वयशील चेतना को अभिव्यक्त करती है।
                    </p>

                    <p>
                        <Strong>धर्मस्थल संस्थान</Strong> केवल एक धार्मिक केन्द्र न होकर शिक्षा, आरोग्य-सेवा, ग्रामोन्नयन, सांस्कृतिक संरक्षण एवं लोक-कल्याण के
                        विविध आयामों में समर्पित एक विराट सेवा-संस्थान के रूप में प्रतिष्ठित है, जिसने असंख्य जनमानस के जीवन को स्पर्श कर उन्हें नवीन दिशा प्रदान की है।
                    </p>
                </section>

                <section className="mt-5 grid gap-4 md:grid-cols-[1.05fr_0.95fr] md:items-start">
                    <div className="relative w-full h-56 sm:h-72">
                        <Image
                            src="/dharmastal-1.png"
                            alt="धर्मस्थल दृश्य 1"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-4 text-justify text-[1.06rem] leading-[1.65] sm:text-[1.08rem] lg:text-[1.12rem]">
                        <p>
                            <Strong>ब्राह्मी लिपि प्रचारक, श्रुताराधक सन्त क्षुल्लक श्री प्रज्ञांशसागर जी गुरुदेव</Strong> की मंगल प्रेरणा एवं आध्यात्मिक मार्गदर्शन से
                            संचालित ब्राह्मी लिपि पुनर्जागरण एवं संरक्षण-अभियान में धर्माधिकारी <Strong>डॉ. डी. वीरेन्द्र हेगड़े जी तथा श्रद्धेया हेमवती हेगड़े</Strong>
                            जी द्वारा प्रदत्त सहयोग अत्यन्त प्रशंसनीय एवं प्रेरणास्पद है।
                        </p>

                        <p>
                            डॉ. डी. वीरेन्द्र हेगड़े जी, विगत अनेक दशकों से शिक्षा, ग्रामीण पुनरुत्थान, आरोग्य-सेवा, भारतीय संस्कृति एवं प्राचीन ज्ञान-परम्पराओं के
                            संरक्षण हेतु उल्लेखनीय कार्य कर रहे हैं। भारतीय आध्यात्मिक धरोहर के प्रति उनकी गहन संवेदनशीलता एवं सांस्कृतिक प्रतिबद्धता ब्राह्मी लिपि जैसे
                            महत्त्वपूर्ण अभियान से उनके जुड़ाव में स्पष्ट रूप से परिलक्षित होती है।
                        </p>
                    </div>
                </section>

                <section className="mt-5 space-y-4 text-justify text-[1.06rem] leading-[1.65] sm:text-[1.08rem] lg:text-[1.12rem]">
                    <p>
                        श्रद्धेया हेमवती हेगड़े जी की सामाजिक, सांस्कृतिक एवं सेवा-प्रधान गतिविधियों में सतत सक्रिय सहभागिता ने भी इस पवित्र प्रयास को निरन्तर
                        प्रेरणा एवं सशक्तता प्रदान की है।
                    </p>
                </section>

                <section className="mt-5 grid gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-center">
                    <div className="order-2 md:order-1 space-y-4 text-justify text-[1.06rem] leading-[1.65] sm:text-[1.08rem] lg:text-[1.12rem]">
                        <p>
                            <Strong>गुड लाइफ जैन फाउंडेशन</Strong> - धर्मस्थल संस्थान, आदरणीय डॉ. डी. वीरेन्द्र हेगड़े जी एवं श्रद्धेया हेमवती हेगड़े जी के प्रति
                            हृदयांगम कृतज्ञता ज्ञापित करता है। उनके अमूल्य सहयोग एवं सद्भावनापूर्ण सहभागिता से भारतीय प्राचीन जैन श्रुत-परम्परा एवं ब्राह्मी लिपि
                            संरक्षण का यह पुण्य उपक्रम और अधिक दृढ़, व्यापक एवं प्रभावी स्वरूप ग्रहण कर सका है।
                        </p>
                    </div>

                    <div className="order-1 md:order-2 relative w-full h-56 sm:h-72">
                        <Image
                            src="/dharmastal-2.png"
                            alt="धर्मस्थल दृश्य 2"
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                <section className="mt-5 flex flex-col items-center gap-3 text-center">
                    <div className="w-full max-w-sm relative h-48 sm:h-64">
                        <Image
                            src="/dharmastal-3.png"
                            alt="धर्मस्थल दृश्य 3"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <p className="text-[1.02rem] font-bold leading-tight text-red-600 sm:text-[1.08rem] lg:text-[1.12rem]">
                        जैन वाङ्मय संरक्षण एवं अध्ययन की प्रेरणा
                    </p>
                </section>
            </article>
        </main>
    );
}
