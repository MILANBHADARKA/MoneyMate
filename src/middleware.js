import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt'; // assumes lib/jwt.js contains your token verification
import { cookies } from 'next/headers';

export async function middleware(request) {

  return NextResponse.next();
}


// Protect only dashboard and profile routes
export const config = {
//   matcher: ['/dashboard/:path*', '/profile/:path*'], // adjust as needed
  matcher: [], // adjust as needed
};
