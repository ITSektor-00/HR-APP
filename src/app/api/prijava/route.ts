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
    const { email, lozinka } = await req.json();
    if (!email || !lozinka) {
      return NextResponse.json({ error: 'Sva polja su obavezna.' }, { status: 400 });
    }
    const result = await pool.query('SELECT * FROM korisnici WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pogrešan email ili lozinka.' }, { status: 401 });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(lozinka, user.lozinka);
    if (!valid) {
      return NextResponse.json({ error: 'Pogrešan email ili lozinka.' }, { status: 401 });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const response = NextResponse.json({ user: { id: user.id, ime: user.ime, prezime: user.prezime, email: user.email, telefon: user.telefon } });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dana
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Došlo je do greške.' }, { status: 500 });
  }
} 