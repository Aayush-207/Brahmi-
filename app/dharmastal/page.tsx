"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

function Strong({ children }: { children: React.ReactNode }) {
    return <strong className="font-bold text-black">{children}</strong>;
}

const PAGE_COPY = {
    hi: {
        home: 'होम',
        title: 'धर्मस्थल परिचय',
        subtitle: 'ब्राह्मी लिपि संरक्षण एवं संवर्धन में अभिन्नन्दनीय प्रयास',
        intro1: (
            <>
                <Strong>धर्मस्थल</Strong> कर्नाटक राज्य के दक्षिण कन्नड़ जनपद की नेत्रावती नदी के तट पर स्थित एक अद्वितीय आध्यात्मिक एवं आध्यात्मिक तीर्थक्षेत्र है।
                यह पुण्यभूमि जैन, हिन्दू एवं विविध आस्थाओं के समन्वित सहअस्तित्व की अनुपम परम्परा का सजीव प्रतीक माना जाती है। यहाँ स्थित प्राचीन
                जैन प्रतिमाओं की उपस्थिति, भगवान श्री मंजुनाथेश्वर की आराधना तथा धार्मिक सौहार्द की दीर्घ परम्परा; भारतीय संस्कृति की उदार एवं
                समन्वयशील चेतना को अभिव्यक्त करती है।
            </>
        ),
        intro2: (
            <>
                <Strong>धर्मस्थल संस्थान</Strong> केवल एक धार्मिक केन्द्र न होकर शिक्षा, आरोग्य-सेवा, ग्रामोन्नयन, सांस्कृतिक संरक्षण एवं लोक-कल्याण के
                विविध आयामों में समर्पित एक विराट सेवा-संस्थान के रूप में प्रतिष्ठित है, जिसने असंख्य जनमानस के जीवन को स्पर्श कर उन्हें नवीन दिशा प्रदान की है।
            </>
        ),
        section1Lead: (
            <>
                <Strong>ब्राह्मी लिपि प्रचारक, श्रुताराधक सन्त क्षुल्लक श्री प्रज्ञांशसागर जी गुरुदेव</Strong> की मंगल प्रेरणा एवं आध्यात्मिक मार्गदर्शन से
                संचालित ब्राह्मी लिपि पुनर्जागरण एवं संरक्षण-अभियान में धर्माधिकारी <Strong>डॉ. डी. वीरेन्द्र हेगड़े जी तथा श्रद्धेया हेमवती हेगड़े</Strong>
                जी द्वारा प्रदत्त सहयोग अत्यन्त प्रशंसनीय एवं प्रेरणास्पद है।
            </>
        ),
        section1Body: (
            <>
                डॉ. डी. वीरेन्द्र हेगड़े जी, विगत अनेक दशकों से शिक्षा, ग्रामीण पुनरुत्थान, आरोग्य-सेवा, भारतीय संस्कृति एवं प्राचीन ज्ञान-परम्पराओं के
                संरक्षण हेतु उल्लेखनीय कार्य कर रहे हैं। भारतीय आध्यात्मिक धरोहर के प्रति उनकी गहन संवेदनशीलता एवं सांस्कृतिक प्रतिबद्धता ब्राह्मी लिपि जैसे
                महत्त्वपूर्ण अभियान से उनके जुड़ाव में स्पष्ट रूप से परिलक्षित होती है।
            </>
        ),
        section2Body: (
            <>
                श्रद्धेया हेमवती हेगड़े जी की सामाजिक, सांस्कृतिक एवं सेवा-प्रधान गतिविधियों में सतत सक्रिय सहभागिता ने भी इस पवित्र प्रयास को निरन्तर
                प्रेरणा एवं सशक्तता प्रदान की है।
            </>
        ),
        section3Body: (
            <>
                <Strong>गुड लाइफ जैन फाउंडेशन</Strong> - धर्मस्थल संस्थान, आदरणीय डॉ. डी. वीरेन्द्र हेगड़े जी एवं श्रद्धेया हेमवती हेगड़े जी के प्रति
                हृदयांगम कृतज्ञता ज्ञापित करता है। उनके अमूल्य सहयोग एवं सद्भावनापूर्ण सहभागिता से भारतीय प्राचीन जैन श्रुत-परम्परा एवं ब्राह्मी लिपि
                संरक्षण का यह पुण्य उपक्रम और अधिक दृढ़, व्यापक एवं प्रभावी स्वरूप ग्रहण कर सका है।
            </>
        ),
        caption: 'जैन वाङ्मय संरक्षण एवं अध्ययन की प्रेरणा',
    },
    en: {
        home: 'Home',
        title: 'DHARMASTHALA: AN INTRODUCTION',
        subtitle: 'A Commendable Initiative for the Preservation and Promotion of the Brahmi Script',
        intro1: (
            <>
                <Strong>Dharmasthala</Strong>, situated on the banks of the sacred Nethravathi River in the Dakshina Kannada district of Karnataka, is a unique centre of cultural and spiritual heritage.
                This revered land is widely regarded as a living symbol of the harmonious coexistence of Jainism, Hinduism, and diverse faith traditions.
                The presence of ancient Jain idols, the worship of Lord Shri Manjunatheshwara, and the long-standing tradition of religious harmony collectively reflect the inclusive and integrative spirit of Indian civilization.
            </>
        ),
        intro2: (
            <>
                <Strong>Dharmasthala</Strong> is not merely a religious centre; it has earned distinction as a remarkable institution dedicated to education, healthcare, rural development, cultural preservation, and public welfare.
                Through its multifaceted service activities, it has touched and transformed the lives of countless individuals, providing them with inspiration and direction.
            </>
        ),
        section1Lead: (
            <>
                The Brahmi Script Revival and Preservation Movement, conducted under the auspicious inspiration and spiritual guidance of <Strong>Brahmi script propagator and Shrutaradhaka Saint Kshullaka Shri Pragyanshsagar Ji Gurudev</Strong>, has received the wholehearted support of Dharmadhikari <Strong>Dr. D. Veerendra Heggade and Smt. Hemavathi Heggade</Strong>, who have undertaken the noble resolve to carry this mission to the masses. Their commitment to this cause is both admirable and deeply inspiring.
            </>
        ),
        section1Body: (
            <>
                For several decades, <Strong>Dr. D. Veerendra Heggade</Strong> has rendered extraordinary service in the fields of education, rural upliftment, healthcare, Indian culture, and the preservation of ancient knowledge traditions.
                His profound sensitivity toward India&apos;s spiritual heritage and his unwavering cultural commitment are clearly reflected in his association with this significant initiative dedicated to the Brahmi script.
            </>
        ),
        section2Body: (
            <>
                Likewise, the continuous and active participation of <Strong>Smt. Hemavathi Heggade</Strong> in social, cultural, and humanitarian activities has provided enduring inspiration and strength to this sacred endeavour.
            </>
        ),
        section3Body: (
            <>
                The <Strong>Good Life Jain Foundation</Strong> expresses its heartfelt gratitude to Dharmasthala Institution, the esteemed <Strong>Dr. D. Veerendra Heggade</Strong>, and <Strong>Smt. Hemavathi Heggade</Strong>.
                Their benevolent support and meaningful participation will undoubtedly strengthen, expand, and enhance this noble undertaking devoted to the preservation of the ancient Jain scriptural tradition and the Brahmi script, enabling it to achieve an even broader and more enduring impact.
            </>
        ),
        caption: 'Inspiration for the Preservation and Study of Jain Literary Heritage',
    },
    kn: {
        home: 'ಮುಖಪುಟ',
        title: 'ಧರ್ಮಸ್ಥಳ ಪರಿಚಯ',
        subtitle: 'ಬ್ರಾಹ್ಮೀ ಲಿಪಿಯ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಪ್ರಚಾರದಲ್ಲಿ ಶ್ಲಾಘನೀಯ ಪ್ರಯತ್ನ',
        intro1: (
            <>
                <Strong>ಧರ್ಮಸ್ಥಳವು</Strong> ಕರ್ನಾಟಕ ರಾಜ್ಯದ ದಕ್ಷಿಣ ಕನ್ನಡ ಜಿಲ್ಲೆಯ ನೇತ್ರಾವತಿ ನದಿಯ ತೀರದಲ್ಲಿ ನೆಲೆಗೊಂಡಿರುವ ವಿಶಿಷ್ಟ ಸಾಂಸ್ಕೃತಿಕ ಹಾಗೂ ಆಧ್ಯಾತ್ಮಿಕ ತೀರ್ಥಕ್ಷೇತ್ರವಾಗಿದೆ. ಈ ಪುಣ್ಯಭೂಮಿ ಜೈನ, ಹಿಂದೂ ಹಾಗೂ ವಿವಿಧ ಧಾರ್ಮಿಕ ನಂಬಿಕೆಗಳ ಸೌಹಾರ್ದಯುತ ಸಹಅಸ್ತಿತ್ವದ ಅಪೂರ್ವ ಪರಂಪರೆಯ ಜೀವಂತ ಪ್ರತೀಕವಾಗಿ ಪರಿಗಣಿಸಲ್ಪಡುತ್ತದೆ. ಇಲ್ಲಿ ನೆಲೆಗೊಂಡಿರುವ ಪ್ರಾಚೀನ ಜೈನ ಪ್ರತಿಮೆಗಳು, ಭಗವಾನ್ ಶ್ರೀ ಮಂಜುನಾಥೇಶ್ವರರ ಆರಾಧನೆ ಹಾಗೂ ದೀರ್ಘಕಾಲದಿಂದ ಬೆಳೆದು ಬಂದಿರುವ ಧಾರ್ಮಿಕ ಸೌಹಾರ್ದದ ಪರಂಪರೆ ಭಾರತೀಯ ಸಂಸ್ಕೃತಿಯ ಉದಾರತೆ ಮತ್ತು ಸಮನ್ವಯಶೀಲತೆಯನ್ನು ಪ್ರತಿಬಿಂಬಿಸುತ್ತವೆ.
            </>
        ),
        intro2: (
            <>
                <Strong>ಧರ್ಮಸ್ಥಳ</Strong> ಸಂಸ್ಥೆಯು ಕೇವಲ ಧಾರ್ಮಿಕ ಕೇಂದ್ರವಲ್ಲ; ಅದು ಶಿಕ್ಷಣ, ಆರೋಗ್ಯ ಸೇವೆ, ಗ್ರಾಮೀಣ ಅಭಿವೃದ್ಧಿ, ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆಯ ಸಂರಕ್ಷಣೆ ಹಾಗೂ ಜನಕಲ್ಯಾಣದ ಅನೇಕ ಕ್ಷೇತ್ರಗಳಿಗೆ ಸಮರ್ಪಿತವಾಗಿರುವ ಮಹತ್ವದ ಸೇವಾ ಸಂಸ್ಥೆಯಾಗಿದೆ. ತನ್ನ ವೈವಿಧ್ಯಮಯ ಸೇವಾ ಚಟುವಟಿಕೆಗಳ ಮೂಲಕ ಅನೇಕ ಜನರ ಜೀವನವನ್ನು ಸ್ಪರ್ಶಿಸಿ ಅವರಿಗೆ ಹೊಸ ದಿಕ್ಕು ಮತ್ತು ಪ್ರೇರಣೆಯನ್ನು ನೀಡಿದೆ.
            </>
        ),
        section1Lead: (
            <>
                ಬ್ರಾಹ್ಮೀ ಲಿಪಿಯ ಪ್ರಚಾರಕ ಹಾಗೂ ಶ್ರುತಾರಾಧಕ ಸಂತ <Strong>ಕ್ಷುಲ್ಲಕ ಶ್ರೀ ಪ್ರಜ್ಞಾನಸಾಗರ ಜೀ ಗುರುದೇವರ</Strong> ಮಂಗಳಪ್ರೇರಣೆ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ನಡೆಯುತ್ತಿರುವ ಬ್ರಾಹ್ಮೀ ಲಿಪಿ ಪುನರುಜ್ಜೀವನ ಮತ್ತು ಸಂರಕ್ಷಣಾ ಅಭಿಯಾನವನ್ನು ಜನಸಾಮಾನ್ಯರ ನಡುವೆ ವ್ಯಾಪಕವಾಗಿ ತಲುಪಿಸುವ ಸಂಕಲ್ಪವನ್ನು ಧರ್ಮಾಧಿಕಾರಿ <Strong>ಡಾ. ಡಿ. ವೀರೇಂದ್ರ ಹೆಗ್ಗಡೆ ಅವರು ಹಾಗೂ ಪೂಜ್ಯೆ ಶ್ರೀಮತಿ ಹೇಮಾವತಿ ಹೆಗ್ಗಡೆ ಅವರು</Strong> ಕೈಗೊಂಡಿರುವುದು ಅತ್ಯಂತ ಶ್ಲಾಘನೀಯ ಹಾಗೂ ಪ್ರೇರಣಾದಾಯಕವಾಗಿದೆ.
            </>
        ),
        section1Body: (
            <>
                <Strong>ಡಾ. ಡಿ. ವೀರೇಂದ್ರ ಹೆಗ್ಗಡೆ ಅವರು</Strong> ಅನೇಕ ದಶಕಗಳಿಂದ ಶಿಕ್ಷಣ, ಗ್ರಾಮೀಣ ಪುನರುತ್ಥಾನ, ಆರೋಗ್ಯ ಸೇವೆ, ಭಾರತೀಯ ಸಂಸ್ಕೃತಿ ಹಾಗೂ ಪ್ರಾಚೀನ ಜ್ಞಾನ ಪರಂಪರೆಗಳ ಸಂರಕ್ಷಣೆಗೆ ಮಹತ್ತರ ಕೊಡುಗೆ ನೀಡುತ್ತಾ ಬಂದಿದ್ದಾರೆ. ಭಾರತದ ಆಧ್ಯಾತ್ಮಿಕ ಪರಂಪರೆಯ ಬಗ್ಗೆ ಅವರಿಗಿರುವ ಆಳವಾದ ಸಂವೇದನೆ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಬದ್ಧತೆ ಬ್ರಾಹ್ಮೀ ಲಿಪಿಯಂತಹ ಮಹತ್ವದ ಅಭಿಯಾನದಲ್ಲಿ ಅವರ ಸಕ್ರಿಯ ಭಾಗವಹಿಸುವಿಕೆಯಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಗೋಚರಿಸುತ್ತದೆ.
            </>
        ),
        section2Body: (
            <>
                ಅದೇ ರೀತಿ, ಸಾಮಾಜಿಕ, ಸಾಂಸ್ಕೃತಿಕ ಹಾಗೂ ಸೇವಾಮೂಲಕ ಚಟುವಟಿಕೆಗಳಲ್ಲಿ <Strong>ಪೂಜ್ಯೆ ಶ್ರೀಮತಿ ಹೇಮಾವತಿ ಹೆಗ್ಗಡೆ ಅವರ</Strong> ನಿರಂತರ ಮತ್ತು ಸಕ್ರಿಯ ಭಾಗವಹಿಸುವಿಕೆ ಈ ಪವಿತ್ರ ಪ್ರಯತ್ನಕ್ಕೆ ನಿರಂತರ ಪ್ರೇರಣೆ ಮತ್ತು ಶಕ್ತಿಯನ್ನು ಒದಗಿಸಿದೆ.  
            </>
        ),  
        section3Body: (
            <>
                <Strong>ಗುಡ್ ಲೈಫ್ ಜೈನ್ ಫೌಂಡೇಶನ್</Strong> ಧರ್ಮಸ್ಥಳ ಸಂಸ್ಥೆ, ಆದರಣೀಯ <Strong>ಡಾ. ಡಿ. ವೀರೇಂದ್ರ ಹೆಗ್ಗಡೆ ಅವರು</Strong> ಹಾಗೂ <Strong>ಪೂಜ್ಯೆ ಶ್ರೀಮತಿ ಹೇಮಾವತಿ ಹೆಗ್ಗಡೆ ಅವರ</Strong> նկատմամբ ಹೃತ್ಪೂರ್ವಕ ಕೃತಜ್ಞತೆಯನ್ನು ವ್ಯಕ್ತಪಡಿಸುತ್ತದೆ. ಅವರ ಸೌಹಾರ್ದಪೂರ್ಣ ಸಹಕಾರ ಮತ್ತು ಅಮೂಲ್ಯ ಬೆಂಬಲದಿಂದ ಭಾರತೀಯ ಪ್ರಾಚೀನ ಜೈನ ಶ್ರುತ ಪರಂಪರೆ ಹಾಗೂ ಬ್ರಾಹ್ಮೀ ಲಿಪಿಯ ಸಂರಕ್ಷಣೆಯ ಈ ಪುಣ್ಯ ಕಾರ್ಯವು ಇನ್ನಷ್ಟು ದೃಢ, ವ್ಯಾಪಕ ಮತ್ತು ಪರಿಣಾಮಕಾರಿಯಾಗಿ ಬೆಳೆಯಲಿದೆ ಎಂಬ ವಿಶ್ವಾಸವಿದೆ.
            </>
        ),
        caption: 'ಜೈನ ವಾಂಗ್ಮಯದ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಅಧ್ಯಯನಕ್ಕೆ ಪ್ರೇರಣೆ',
    },
    ta: {
        home: 'Home',
        title: 'Dharmasthal Introduction',
        subtitle: 'Brahmi script preservation and development effort',
        intro1: (
            <>
                <Strong>Dharmasthal</Strong> is a unique spiritual and pilgrimage center situated on the banks of the Netravati River in South Kannada district, Karnataka.
            </>
        ),
        intro2: (
            <>
                <Strong>The Dharmasthal Institution</Strong> is a vast service organization dedicated to education, healthcare, rural development, cultural preservation, and public welfare.
            </>
        ),
        section1Lead: (
            <>
                Brahmi script promoter and revered monk <Strong>Shrutaaradhak Saint Kshullak Shri Prajnansagar Ji Gurudev</Strong>&apos;s inspiration and guidance,
                along with the support of Dharmadhikari <Strong>Dr. D. Veerendra Heggade Ji and revered H. Hemavathi Heggade</Strong>, is commendable.
            </>
        ),
        section1Body: (
            <>
                Dr. D. Veerendra Heggade Ji has been doing remarkable work for many decades in education, rural upliftment, healthcare, Indian culture, and ancient knowledge traditions.
            </>
        ),
        section2Body: (
            <>
                H. Hemavathi Heggade Ji&apos;s continuous active participation in social, cultural, and service-oriented activities has provided constant strength to this sacred effort.
            </>
        ),
        section3Body: (
            <>
                <Strong>Good Life Jain Foundation</Strong> expresses heartfelt gratitude to the Dharmasthal Institution, respected Dr. D. Veerendra Heggade Ji, and revered H. Hemavathi Heggade Ji.
            </>
        ),
        caption: 'Inspiration for Jain literary preservation and study',
    },
} as const;

export default function DharmastalPage() {
    const { language } = useLanguage();
    const content = PAGE_COPY[language as keyof typeof PAGE_COPY] ?? PAGE_COPY.hi;

    return (
        <main className="min-h-screen bg-white text-black">
            <Link
                href="/"
                className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-black hover:text-white sm:left-6 sm:top-6"
            >
                <span aria-hidden="true">←</span>
                <span>{content.home}</span>
            </Link>

            <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                <header className="text-center">
                    <h1 className="text-[2rem] font-bold leading-none text-red-600 sm:text-[2.25rem] lg:text-[2.5rem]">
                        {content.title}
                    </h1>
                    <h2 className="mt-5 text-[1.15rem] font-bold leading-snug text-black sm:text-[1.35rem] lg:text-[1.5rem]">
                        {content.subtitle}
                    </h2>
                </header>

                <section className="mt-5 space-y-4 text-justify text-[1.06rem] leading-[1.65] sm:text-[1.08rem] lg:text-[1.12rem]">
                    <p>{content.intro1}</p>

                    <p>{content.intro2}</p>
                </section>

                <section className="mt-5 grid gap-4 md:grid-cols-[1.05fr_0.95fr] md:items-start">
                    <div className="relative w-full h-52 sm:h-64 md:h-72 md:-mt-2 lg:-mt-3">
                        <Image
                            src="/Ndharmastal-1.png"
                            alt="धर्मस्थल दृश्य 1"
                            fill
                            className="object-contain object-top"
                        />
                    </div>

                    <div className="space-y-4 text-justify text-[1.06rem] leading-[1.65] sm:text-[1.08rem] lg:text-[1.12rem] md:pt-1">
                        <p>{content.section1Lead}</p>
                    </div>
                </section>

                <section className="mt-5 space-y-4 text-justify text-[1.06rem] leading-[1.65] sm:text-[1.08rem] lg:text-[1.12rem]">
                    <p>{content.section1Body}</p>
                </section>

                <section className="mt-5 space-y-4 text-justify text-[1.06rem] leading-[1.65] sm:text-[1.08rem] lg:text-[1.12rem]">
                    <p>{content.section2Body}</p>
                </section>

                <section className="mt-5 grid gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-start">
                    <div className="order-2 md:order-1 space-y-4 text-justify text-[1.06rem] leading-[1.65] sm:text-[1.08rem] lg:text-[1.12rem]">
                        <p>{content.section3Body}</p>
                    </div>

                    <div className="order-1 md:order-2 relative w-full h-48 sm:h-60 md:h-64">
                        <Image
                            src="/Ndharmastal-2.png"
                            alt="धर्मस्थल दृश्य 2"
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                <section className="mt-5 flex flex-col items-center gap-3 text-center">
                    <div className="w-full max-w-sm relative h-44 sm:h-56 md:h-60">
                        <Image
                            src="/Ndharmastal-3.png"
                            alt="धर्मस्थल दृश्य 3"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <p className="text-[1.02rem] font-bold leading-tight text-red-600 sm:text-[1.08rem] lg:text-[1.12rem]">
                        {content.caption}
                    </p>
                </section>
            </article>
        </main>
    );
}
