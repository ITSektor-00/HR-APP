import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Dozvoli pristup samo na /prijava i /registracija bez tokena
  if (
    !token &&
    !request.nextUrl.pathname.startsWith('/prijava') &&
    !request.nextUrl.pathname.startsWith('/registracija')
  ) {
    return NextResponse.redirect(new URL('/prijava', request.url));
  }

  // Ako je ulogovan i ide na /prijava ili /registracija, preusmeri na home
  if (
    token &&
    (request.nextUrl.pathname.startsWith('/prijava') ||
      request.nextUrl.pathname.startsWith('/registracija'))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}; 