# Testing Piper TTS with Guruji

## ✅ Setup Complete!

Your Brahmi app is now configured to use Piper TTS for Guruji's voice.

## How to Test:

### Step 1: Download Voice Files (if not done)
Go to: `C:\Users\BHAGIRATH\Documents\piper-tts-service`

Run the check script:
```powershell
cd C:\Users\BHAGIRATH\Documents\piper-tts-service
.\check-setup.ps1
```

If voice files are missing, download from [Piper Releases](https://github.com/rhasspy/piper/releases/tag/2023.11.14-2):
- Extract `voice-hi-hi_HI-medium.tar.gz` 
- Place `hi_HI-medium.onnx` and `hi_HI-medium.onnx.json` in the service folder

### Step 2: Start Piper TTS Server
Open a terminal:
```powershell
cd C:\Users\BHAGIRATH\Documents\piper-tts-service
python server.py
```

You should see:
```
🎙️ Piper TTS Server: http://localhost:5000
```

Keep this terminal running!

### Step 3: Start Your Brahmi App
Open a NEW terminal:
```powershell
cd D:\Brahmi-
npm run dev
```

### Step 4: Test Guruji's Voice
1. Open http://localhost:3000 in your browser
2. Navigate to any lesson
3. Click the "Ask Guruji to speak" button (🔉)
4. You should hear consistent Hindi voice across all browsers!

## Troubleshooting:

### "Failed to generate speech" error
- Make sure Piper server is running (Step 2)
- Check http://localhost:5000/health in browser - should show `{"status":"ok"}`
- Verify voice files are downloaded

### No audio playing
- Check browser console for errors
- Verify both servers are running
- Try clicking the speak button again

### "Connection refused"
- Piper server not running - go back to Step 2
- Wrong port - check `.env.local` has `PIPER_TTS_URL=http://localhost:5000`

## Files Changed:

✅ [app/api/tts/route.ts](app/api/tts/route.ts) - Connects to Piper TTS
✅ [lib/gurujispeech.ts](lib/gurujispeech.ts) - Uses WAV audio format
✅ [.env.local](.env.local) - Configuration added
✅ [.env.example](.env.example) - Updated template

## Benefits:

- ✅ **100% FREE** - No API costs
- ✅ **Consistent** - Same voice across all browsers
- ✅ **Private** - All processing local
- ✅ **Offline** - Works without internet once setup
- ✅ **High Quality** - Neural voice model

Enjoy Guruji's new voice! 🎉
