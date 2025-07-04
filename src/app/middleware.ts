import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('=== MIDDLEWARE SE IZVRŠAVA ===')
  console.log('URL:', request.url)
  
  const { pathname, searchParams } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const allCookies = request.cookies.getAll()
  const prijavaUspesna = searchParams.get('prijava') === 'uspesna'

  // Debug logovi
  console.log('=== MIDDLEWARE DEBUG ===')
  console.log('Pathname:', pathname)
  console.log('Search params:', searchParams.toString())
  console.log('Prijava uspesna:', prijavaUspesna)
  console.log('Token:', token)
  console.log('Token type:', typeof token)
  console.log('Token length:', token?.length)
  console.log('Token === "":', token === '')
  console.log('Token === null:', token === null)
  console.log('Token === undefined:', token === undefined)
  console.log('All cookies:', allCookies.map(c => `${c.name}=${c.value}`))
  console.log('=======================')

  // Dozvoli pristup /prijava i /registracija bez provere
  if (pathname.startsWith('/prijava') || pathname.startsWith('/registracija')) {
    console.log('Dozvoljen pristup:', pathname)
    return NextResponse.next()
  }

  // Ako se korisnik tek prijavio, dozvoli pristup (token će se postaviti)
  if (prijavaUspesna) {
    console.log('Korisnik se tek prijavio, dozvoljen pristup.')
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

// Matcher: proveri sve rute osim _next, favicon, i statičkih fajlova
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files (svg, png, jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
} 