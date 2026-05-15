import { NextRequest, NextResponse } from 'next/server';
import hindiSwar from '@/backend/data/hindi/swar.json';
import englishSwar from '@/backend/data/english/swar.json';
import kannadaSwar from '@/backend/data/kannada/swar.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get('lang') || 'hindi').toLowerCase();
  let swarData = hindiSwar;
  if (lang === 'english' || lang === 'en') swarData = englishSwar;
  if (lang === 'kannada' || lang === 'kn') swarData = kannadaSwar;
  return NextResponse.json(swarData);
}
