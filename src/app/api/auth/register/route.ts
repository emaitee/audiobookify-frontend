import { apiHelper } from '@/app/utils/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    // Call your actual registration API
    const response = await apiHelper.post('/auth/register', {
        email,
        password,
        name
      });

    if (!response?.ok) {
      const errorData = await response?.json();
      return NextResponse.json(
        { message: errorData.message || 'Registration failed' },
        { status: response?.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      token: data.token,
      user: {
        email,
        name
      }
    });
    
  } catch (err:any) {
    console.error(err?.message || 'Registration error');
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}