import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'tajna';

function getUserIdFromRequest(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const result = await pool.query('SELECT id, ime, prezime, email, telefon, slika FROM korisnici WHERE id = $1', [userId]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: "Došlo je do greške." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const data = await req.json();
    const { ime, prezime, email, telefon, lozinka, slika } = data;

    let query = 'UPDATE korisnici SET ime = $1, prezime = $2, email = $3, telefon = $4';
    const params: any[] = [ime, prezime, email, telefon];
    let idx = 5;

    if (slika !== undefined) {
      query += `, slika = $${idx++}`;
      params.push(slika);
    }
    if (lozinka) {
      const hashed = await bcrypt.hash(lozinka, 10);
      query += `, lozinka = $${idx++}`;
      params.push(hashed);
    }
    query += ` WHERE id = $${idx} RETURNING id, ime, prezime, email, telefon, slika`;
    params.push(userId);

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: "Došlo je do greške." }, { status: 500 });
  }
} 