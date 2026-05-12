import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    supported: [
      { code: 'hindi',   label: 'हिन्दी',  labelEnglish: 'Hindi'   },
      { code: 'english', label: 'English', labelEnglish: 'English' },
      { code: 'kannada', label: 'ಕನ್ನಡ',   labelEnglish: 'Kannada' },
    ],
    default: 'hindi'
  });
}
