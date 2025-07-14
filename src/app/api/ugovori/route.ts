/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.naziv_ugovora,
        u.opis,
        u.datum_pocetka,
        u.datum_zavrsetka,
        u.status,
        u.uslovi,
        u.vrsta_ugovora,
        u.korisnik_id,
        u.dokument,
        u.datum_kreiranja,
        u.datum_azuriranja,
        json_build_object('ime', k.ime, 'prezime', k.prezime, 'fotografija', k.fotografija) as zaposleni
      FROM ugovori u
      JOIN zaposleni_korisnici k ON u.korisnik_id = k.id
      ORDER BY u.id DESC
    `);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Greška pri čitanju ugovora.' }, { status: 500 });
  }
} 