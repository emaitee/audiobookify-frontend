import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Replace with your actual authentication logic
  if (email === 'test@example.com' && password === 'password') {
    return NextResponse.json({
      token: 'fake-jwt-token',
      user: {
        email: 'test@example.com',
        name: 'Test User'
      }
    });
  }

  return NextResponse.json(
    { message: 'Invalid credentials' },
    { status: 401 }
  );
}