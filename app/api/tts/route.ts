import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Get Piper TTS service URL (default to localhost)
    const piperUrl = process.env.PIPER_TTS_URL || 'http://localhost:5000';

    // Call local Piper TTS service
    const response = await fetch(`${piperUrl}/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Piper TTS error:', error);
      // Return with fallback flag to use browser speech
      return NextResponse.json(
        { 
          error: 'Failed to generate speech',
          useFallback: true,
          message: 'Piper TTS service error, using browser voice instead'
        },
        { status: 503 }
      );
    }

    // Piper returns raw audio (WAV format)
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    // Return the base64 encoded audio
    return NextResponse.json({ audioContent: base64Audio });
  } catch (error) {
    console.error('Error in TTS route:', error);
    
    // Return error with fallback flag
    return NextResponse.json(
      { 
        error: 'Piper TTS service unavailable',
        useFallback: true,
        message: 'Please ensure Piper TTS server is running at ' + (process.env.PIPER_TTS_URL || 'http://localhost:5000')
      },
      { status: 503 }
    );
  }
}
