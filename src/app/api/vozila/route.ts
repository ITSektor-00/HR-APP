import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM vozila ORDER BY id DESC');
    return NextResponse.json(result.rows);
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      naslov,
      opis,
      broj_sasije,
      boja,
      proizvodjac,
      komercijalna_oznaka,
      godina_proizvodnje,
      datum_kreiranja,
      datum_azuriranja
    } = body;
    const result = await pool.query(
      `INSERT INTO vozila (naslov, opis, broj_sasije, boja, proizvodjac, komercijalna_oznaka, godina_proizvodnje, datum_kreiranja, datum_azuriranja)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [naslov, opis, broj_sasije, boja, proizvodjac, komercijalna_oznaka, godina_proizvodnje, datum_kreiranja, datum_azuriranja]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    console.error('GRESKA PRI UNOSU VOZILA:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
} 