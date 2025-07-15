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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      naziv_ugovora,
      opis,
      datum_pocetka,
      datum_zavrsetka,
      status,
      uslovi,
      vrsta_ugovora,
      korisnik_id,
      dokument
    } = body;

    // Obrađujemo prazne datume - konvertujemo prazne stringove u null
    const processedDatumPocetka = datum_pocetka === "" ? null : datum_pocetka;
    const processedDatumZavrsetka = datum_zavrsetka === "" ? null : datum_zavrsetka;

    const result = await pool.query(`
      INSERT INTO ugovori (
        naziv_ugovora,
        opis,
        datum_pocetka,
        datum_zavrsetka,
        status,
        uslovi,
        vrsta_ugovora,
        korisnik_id,
        dokument,
        datum_kreiranja,
        datum_azuriranja
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      naziv_ugovora,
      opis,
      processedDatumPocetka,
      processedDatumZavrsetka,
      status,
      uslovi,
      vrsta_ugovora,
      korisnik_id,
      dokument
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('Greška pri unosu ugovora:', err);
    return NextResponse.json({ error: 'Greška pri unosu ugovora.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID ugovora je obavezan.' }, { status: 400 });
    }

    const body = await req.json();
    const {
      naziv_ugovora,
      opis,
      datum_pocetka,
      datum_zavrsetka,
      status,
      uslovi,
      vrsta_ugovora,
      korisnik_id,
      dokument
    } = body;

    // Obrađujemo prazne datume - konvertujemo prazne stringove u null
    const processedDatumPocetka = datum_pocetka === "" ? null : datum_pocetka;
    const processedDatumZavrsetka = datum_zavrsetka === "" ? null : datum_zavrsetka;

    const result = await pool.query(`
      UPDATE ugovori SET 
        naziv_ugovora = $1,
        opis = $2,
        datum_pocetka = $3,
        datum_zavrsetka = $4,
        status = $5,
        uslovi = $6,
        vrsta_ugovora = $7,
        korisnik_id = $8,
        dokument = $9,
        datum_azuriranja = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      naziv_ugovora,
      opis,
      processedDatumPocetka,
      processedDatumZavrsetka,
      status,
      uslovi,
      vrsta_ugovora,
      korisnik_id,
      dokument,
      id
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Ugovor nije pronađen.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Greška pri ažuriranju ugovora:', err);
    return NextResponse.json({ error: 'Greška pri ažuriranju ugovora.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID ugovora je obavezan.' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM ugovori WHERE id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Ugovor nije pronađen.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Ugovor uspešno obrisan.' });
  } catch (err) {
    console.error('Greška pri brisanju ugovora:', err);
    return NextResponse.json({ error: 'Greška pri brisanju ugovora.' }, { status: 500 });
  }
} 