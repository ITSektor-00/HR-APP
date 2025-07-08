import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'tajna';

interface JwtPayload {
  id: number;
  email: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ isLoggedIn: false });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const result = await pool.query('SELECT id, ime, prezime, email, telefon FROM korisnici WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ isLoggedIn: false });
    }

    return NextResponse.json({ 
      isLoggedIn: true, 
      user: result.rows[0] 
    });
  } catch {
    return NextResponse.json({ isLoggedIn: false });
  }
} 