import { apiHelper } from '@/app/utils/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Call your actual login API
    const response = await apiHelper.post('/auth/login', {
        email,
        password
      });

    if (!response?.ok) {
      const errorData = await response?.json();
      return NextResponse.json(
        { message: errorData.message || 'Login failed' },
        { status: response?.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      token: data.token,
      user: {
        email: data.user.email,
        name: data.user.name
        // Include any other user fields you need
      }
    });
    
  } catch (err:any) {
    console.error(err?.message || 'Login error');
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}