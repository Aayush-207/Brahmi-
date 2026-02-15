# Piper TTS Setup Guide - FREE & Self-Hosted (Separate Service)

## Why Piper TTS?
Piper is a fast, local neural text-to-speech system that:
- ✅ **100% FREE** - No API costs ever
- ✅ **Self-hosted** - Complete control and privacy
- ✅ **Fast** - Real-time TTS with minimal latency  
- ✅ **High Quality** - Neural voices, sounds natural
- ✅ **Offline** - Works without internet
- ✅ **Hindi Support** - Good quality Hindi voices

## Setup (In a Separate Folder)

### Step 1: Create Piper TTS Service Folder
Create this **outside** your Brahmi project:
```powershell
# Create a new folder anywhere (e.g., Desktop, Documents)
cd ~\Documents
mkdir piper-tts-service
cd piper-tts-service
```

### Step 2: Download Piper Binary
1. Go to [Piper Releases](https://github.com/rhasspy/piper/releases/latest)
2. Download for Windows: `piper_windows_amd64.zip`
3. Extract to your `piper-tts-service` folder
4. You should have `piper.exe`

### Step 3: Download Hindi Voice Model
1. Visit [Piper Voice Models](https://huggingface.co/rhasspy/piper-voices/tree/main/hi/hi_HI/medium)
2. Download these 2 files:
   - `hi_HI-medium.onnx` (voice model)
   - `hi_HI-medium.onnx.json` (config)
3. Place them in your `piper-tts-service` folder

### Step 4: Create Simple Server
Create `server.py` in your `piper-tts-service` folder:

```python
"""
Simple Piper TTS HTTP Server
Runs independently from the main Brahmi app
"""

from flask import Flask, request, send_file
from flask_cors import CORS
import subprocess
import tempfile
import os

app = Flask(__name__)
CORS(app)  # Allow requests from your Next.js app

PIPER_PATH = './piper.exe'  # Windows
# PIPER_PATH = './piper'  # Linux/Mac
VOICE_MODEL = './hi_HI-medium.onnx'

@app.route('/tts', methods=['POST'])
def tts():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return {'error': 'No text'}, 400
    
    # Generate audio in temp file
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
        output = f.name
    
    try:
        subprocess.run([
            PIPER_PATH,
            '--model', VOICE_MODEL,
            '--output_file', output,
            '--length_scale', '1.15'  # Slower for elderly voice
        ], input=text.encode('utf-8'), timeout=30)
        
        return send_file(output, mimetype='audio/wav')
    except Exception as e:
        return {'error': str(e)}, 500

@app.route('/health')
def health():
    return {'status': 'ok'}

if __name__ == '__main__':
    print('🎙️ Piper TTS Server running on http://localhost:5000')
    app.run(host='0.0.0.0', port=5000)
```

### Step 5: Install Python Dependencies
In your `piper-tts-service` folder:
```powershell
pip install flask flask-cors
```

### Step 6: Start the Server
In your `piper-tts-service` folder:
```powershell
python server.py
```
Keep this running! Open a new terminal for your Brahmi app.

### Step 7: Configure Your Brahmi App
In your Brahmi project, create/edit `.env.local`:
```
PIPER_TTS_URL=http://localhost:5000
```

### Step 8: Create API Route in Brahmi
Create `app/api/tts/route.ts` in your Brahmi project (if not exists):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    const piperUrl = process.env.PIPER_TTS_URL || 'http://localhost:5000';
    
    const response = await fetch(`${piperUrl}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'TTS failed' }, { status: 500 });
    }
    
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return NextResponse.json({ audioContent: base64Audio });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

### Step 9: Update Speech Library
In your Brahmi project, edit `lib/gurujispeech.ts`:

```typescript
// Change the audio format from mp3 to wav
const audioBlob = base64ToBlob(data.audioContent, 'audio/wav');
```

## Folder Structure
```
Your Computer:
├── Documents/piper-tts-service/     ← Separate TTS service
│   ├── piper.exe
│   ├── hi_HI-medium.onnx
│   ├── hi_HI-medium.onnx.json
│   └── server.py
│
└── Projects/Brahmi/                  ← Your main app
    ├── app/api/tts/route.ts
    ├── lib/gurujispeech.ts
    └── .env.local (PIPER_TTS_URL=http://localhost:5000)
```

## Running Both Services

**Terminal 1** (Piper TTS):
```powershell
cd ~\Documents\piper-tts-service
python server.py
```

**Terminal 2** (Brahmi App):
```powershell
cd D:\Brahmi-
npm run dev
```

## Alternative: Docker Container
If you prefer Docker, run Piper as a container:
```powershell
docker run -d -p 5000:5000 --name piper-tts mycroftai/piper:latest
```

## Production Deployment
For production, you can:
1. **Deploy Piper on separate VPS** (e.g., DigitalOcean, AWS EC2)
2. **Use Railway/Render** to host the Python server
3. **Keep it local** on your hosting server
4. Update `PIPER_TTS_URL` to point to the deployed service

## Cost: $0
- No API fees
- No usage limits
- Run on any computer
- Can be same server as your app, just different port

## Testing
Test the Piper service directly:
```powershell
curl -X POST http://localhost:5000/tts `
  -H "Content-Type: application/json" `
  -d '{"text":"नमस्ते"}' `
  --output test.wav
```
