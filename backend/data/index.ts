import hindiIntro from './hindi/introduction.json';
import hindiSwar from './hindi/swar.json';
import hindiVyanjan from './hindi/vyanjan.json';
import hindiMatras from './hindi/matras.json';

import englishIntro from './english/introduction.json';
import englishSwar from './english/swar.json';
import englishVyanjan from './english/vyanjan.json';
import englishMatras from './english/matras.json';

import kannadaIntro from './kannada/introduction.json';

const data: Record<string, any> = {
  hindi: { introduction: hindiIntro, swar: hindiSwar, vyanjan: hindiVyanjan, matras: hindiMatras },
  english: { introduction: englishIntro, swar: englishSwar, vyanjan: englishVyanjan, matras: englishMatras },
  kannada: { introduction: kannadaIntro, swar: hindiSwar, vyanjan: hindiVyanjan, matras: hindiMatras },
};

export const SUPPORTED_LANGUAGES = ['hindi', 'english', 'kannada'];
export const DEFAULT_LANGUAGE = 'hindi';

export function getDataForLanguage(lang: string) {
  let language = lang;
  if (lang === 'hi') language = 'hindi';
  if (lang === 'en') language = 'english';
  if (lang === 'kn') language = 'kannada';
  
  const finalLang = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
  console.log(`[getDataForLanguage] Requested: ${lang}, Mapped: ${language}, Final: ${finalLang}`);
  return data[finalLang];
}
