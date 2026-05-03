import { NextRequest, NextResponse } from 'next/server';
import { getDataForLanguage } from '@/backend/data/index';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'hindi';
  const data = getDataForLanguage(lang);
  return NextResponse.json(data.vyanjan);
}
