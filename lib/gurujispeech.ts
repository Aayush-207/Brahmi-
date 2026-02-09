/**
 * Guruji Speech Utility
 * Provides text-to-speech functionality with elderly saint voice characteristics
 */

export interface GurujiSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

const DEFAULT_OPTIONS: GurujiSpeechOptions = {
  rate: 0.9,  // Very slow for elderly speech
  pitch: 0.5,  // Very low pitch for deep male elderly voice
  volume: 1.0, // Full volume for clarity
  lang: 'hi-IN' // Hindi language for proper Hindi pronunciation
};

/**
 * Speaks text with Guruji's elderly saint voice
 * @param text - The text to speak
 * @param options - Optional voice settings
 * @param callbacks - Optional callback functions
 */
export function speakAsGuruji(
  text: string,
  options?: GurujiSpeechOptions,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: SpeechSynthesisErrorEvent) => void;
  }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  // Function to perform the actual speech
  const speak = () => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    const settings = { ...DEFAULT_OPTIONS, ...options };
    utterance.rate = settings.rate!;
    utterance.pitch = settings.pitch!;
    utterance.volume = settings.volume!;
    utterance.lang = settings.lang!;

    // Try to use a Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    
    console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
    
    // Filter out child/young voices
    const adultVoices = voices.filter(voice => 
      !voice.name.toLowerCase().includes('child') &&
      !voice.name.toLowerCase().includes('kid') &&
      !voice.name.toLowerCase().includes('young')
    );
    
    // Prefer male Hindi voices for Guruji
    const maleHindiVoice = adultVoices.find(voice => 
      (voice.lang.startsWith('hi') || voice.lang === 'hi-IN') && 
      (voice.name.toLowerCase().includes('male') || 
       voice.name.toLowerCase().includes('man') ||
       voice.name.toLowerCase().includes('hemant') || // Common Indian male voice
       voice.name.toLowerCase().includes('prabhat'))
    );
    
    // Fallback to any Hindi voice that's not female
    const hindiVoice = maleHindiVoice || adultVoices.find(voice => 
      (voice.lang.startsWith('hi') || voice.lang === 'hi-IN') &&
      !voice.name.toLowerCase().includes('female') &&
      !voice.name.toLowerCase().includes('woman') &&
      !voice.name.toLowerCase().includes('swara')  // Common female voice name
    );
    
    // Try English-India male voices as backup (they can speak Hindi)
    const enIndianMaleVoice = hindiVoice || adultVoices.find(voice =>
      voice.lang === 'en-IN' &&
      (voice.name.toLowerCase().includes('male') ||
       voice.name.toLowerCase().includes('ravi'))
    );
    
    // Last resort: any Hindi voice
    const anyHindiVoice = enIndianMaleVoice || adultVoices.find(voice => 
      voice.lang.startsWith('hi') || voice.lang === 'hi-IN'
    );
    
    if (anyHindiVoice) {
      utterance.voice = anyHindiVoice;
      console.log('✓ Using voice for Guruji:', anyHindiVoice.name, '| Lang:', anyHindiVoice.lang, '| Local:', anyHindiVoice.localService);
    } else {
      console.log('⚠ No suitable Hindi voice found, using default with hi-IN lang and low pitch');
    }

    // Set up callbacks
    if (callbacks?.onStart) {
      utterance.onstart = callbacks.onStart;
    }
    if (callbacks?.onEnd) {
      utterance.onend = callbacks.onEnd;
    }
    if (callbacks?.onError) {
      utterance.onerror = callbacks.onError;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Check if voices are loaded
  const voices = window.speechSynthesis.getVoices();
  
  if (voices.length === 0) {
    // Wait for voices to be loaded
    window.speechSynthesis.addEventListener('voiceschanged', function handler() {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      speak();
    });
  } else {
    speak();
  }
}

/**
 * Stops any ongoing Guruji speech
 */
export function stopGurujiSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Checks if speech synthesis is available
 */
export function isGurujiSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
