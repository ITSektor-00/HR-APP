import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url!);
    const filters = [];
    const values = [];
    let idx = 1;

    if (searchParams.get('naslov')) {
      filters.push(`naslov ILIKE $${idx++}`);
      values.push(`%${searchParams.get('naslov')}%`);
    }
    if (searchParams.get('opis')) {
      filters.push(`opis ILIKE $${idx++}`);
      values.push(`%${searchParams.get('opis')}%`);
    }
    if (searchParams.get('broj_sasije')) {
      filters.push(`broj_sasije ILIKE $${idx++}`);
      values.push(`%${searchParams.get('broj_sasije')}%`);
    }
    if (searchParams.get('proizvodjac')) {
      filters.push(`proizvodjac ILIKE $${idx++}`);
      values.push(`%${searchParams.get('proizvodjac')}%`);
    }
    if (searchParams.get('komercijalna_oznaka')) {
      filters.push(`komercijalna_oznaka ILIKE $${idx++}`);
      values.push(`%${searchParams.get('komercijalna_oznaka')}%`);
    }
    if (searchParams.get('datum_kreiranja_od')) {
      filters.push(`datum_kreiranja >= $${idx++}`);
      values.push(searchParams.get('datum_kreiranja_od'));
    }
    if (searchParams.get('datum_kreiranja_do')) {
      filters.push(`datum_kreiranja <= $${idx++}`);
      values.push(searchParams.get('datum_kreiranja_do'));
    }
    if (searchParams.get('datum_azuriranja_od')) {
      filters.push(`datum_azuriranja >= $${idx++}`);
      values.push(searchParams.get('datum_azuriranja_od'));
    }
    if (searchParams.get('datum_azuriranja_do')) {
      filters.push(`datum_azuriranja <= $${idx++}`);
      values.push(searchParams.get('datum_azuriranja_do'));
    }

    let query = 'SELECT * FROM vozila';
    if (filters.length > 0) {
      query += ' WHERE ' + filters.join(' AND ');
    }
    query += ' ORDER BY id DESC';

    const result = await pool.query(query, values);
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