/**
 * Guruji Speech Utility
 * Provides text-to-speech functionality with elderly saint voice characteristics
 * Uses Web Speech API (browser built-in)
 */

export interface GurujiSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

/**
 * Speaks text with Guruji's elderly saint voice using Web Speech API
 * @param text - The text to speak
 * @param options - Optional voice settings
 * @param callbacks - Optional callback functions
 */
export async function speakAsGuruji(
  text: string,
  options?: GurujiSpeechOptions,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
  }
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not available');
    callbacks?.onError?.({ error: 'Speech synthesis not supported' });
    return;
  }

  const speak = () => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure for elderly male Hindi voice
    utterance.lang = options?.lang || 'hi-IN';
    utterance.rate = options?.rate || 0.85;
    utterance.pitch = options?.pitch || 0.7;
    utterance.volume = options?.volume || 1.0;

    // Try to find a Hindi male voice
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(voice => 
      voice.lang.startsWith('hi') && 
      !voice.name.toLowerCase().includes('female')
    ) || voices.find(voice => voice.lang.startsWith('hi'));
    
    if (hindiVoice) {
      utterance.voice = hindiVoice;
      console.log('Using Hindi voice:', hindiVoice.name);
    } else {
      console.log('Using default voice with hi-IN language');
    }

    utterance.onstart = () => {
      console.log('Guruji speaking...');
      callbacks?.onStart?.();
    };
    
    utterance.onend = () => {
      console.log('Guruji finished speaking');
      callbacks?.onEnd?.();
    };
    
    utterance.onerror = (error) => {
      console.error('Speech error:', error);
      callbacks?.onError?.(error);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Check if voices are loaded
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    speak();
  } else {
    // Wait for voices to load
    const handleVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      speak();
    };
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    
    // Fallback timeout in case voiceschanged never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      speak();
    }, 1000);
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
