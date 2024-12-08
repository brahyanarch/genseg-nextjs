// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('token');

  if (!token) {
    return NextResponse.redirect('/auth/login');
  }

  const response = await fetch(`${process.env.BACKEND_URL}/auth/verify-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const data = await response.json();

  if (response.status !== 200 || !data.role) {
    return NextResponse.redirect('/auth/login');
  }

  const { role } = data;

  // Redirige según el rol
  if (req.nextUrl.pathname.startsWith('/dashboard/admin') && role !== 'admin') {
    return NextResponse.redirect('/dashboard/user');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Middleware solo para el dashboard
};
