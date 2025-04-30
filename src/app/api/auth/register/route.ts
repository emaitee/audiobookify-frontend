import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  
  // Replace with your actual registration logic
  return NextResponse.json({
    token: 'fake-jwt-token',
    user: {
      email,
      name
    }
  });
}