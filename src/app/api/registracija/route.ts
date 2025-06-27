import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'tajna';

export async function POST(req: NextRequest) {
  try {
    const { ime, prezime, email, lozinka, telefon } = await req.json();
    if (!ime || !prezime || !email || !lozinka) {
      return NextResponse.json({ error: 'Sva polja su obavezna.' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(lozinka, 10);
    const result = await pool.query(
      'INSERT INTO korisnici (ime, prezime, email, lozinka, telefon) VALUES ($1, $2, $3, $4, $5) RETURNING id, ime, prezime, email, telefon, datum_kreiranja',
      [ime, prezime, email, hashedPassword, telefon || null]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const response = NextResponse.json({ user });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dana
    });
    return response;
  } catch (err: unknown) {
    if (typeof err === "object" && err && "code" in err && (err as any).code === "23505") {
      return NextResponse.json({ error: 'Email je već registrovan.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Greška na serveru.' }, { status: 500 });
  }
} 