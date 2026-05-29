import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    supported: [
      { code: 'english', label: 'English', labelEnglish: 'English' },
      { code: 'kannada', label: 'ಕನ್ನಡ',   labelEnglish: 'Kannada' },
      { code: 'tamil',   label: 'தமிழ்',    labelEnglish: 'Tamil'   },
      { code: 'hindi',   label: 'हिन्दी',   labelEnglish: 'Hindi'   },
    ],
    default: 'hindi'
  });
}
