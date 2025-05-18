import { VAPID } from '@/config';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ publicKey: VAPID.publicKey });
}