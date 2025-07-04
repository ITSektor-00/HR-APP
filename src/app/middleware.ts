import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Debug logovi
  console.log('MIDDLEWARE:', { pathname, token })

  // Dozvoli pristup /prijava i /registracija bez provere
  if (pathname.startsWith('/prijava') || pathname.startsWith('/registracija')) {
    console.log('Dozvoljen pristup:', pathname)
    return NextResponse.next()
  }

  // Ako postoji token i nije prazan string, dozvoli pristup
  if (token && token !== '') {
    console.log('Token postoji, dozvoljen pristup.')
    return NextResponse.next()
  }

  // Ako nema tokena, redirektuj na /prijava
  console.log('Nema tokena, REDIRECT na /prijava')
  return NextResponse.redirect(new URL('/prijava', request.url))
}

// Matcher: ignoriši _next, favicon, api, public, prijava, registracija
export const config = {
  matcher: [
    '/((?!_next|favicon|api|public|prijava|registracija).*)',
  ],
} 