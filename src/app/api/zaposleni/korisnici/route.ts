import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query('SELECT * FROM zaposleni_korisnici ORDER BY id DESC');
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requiredFields = [
      'ime', 'prezime', 'pol', 'datum_rodjenja', 'jmbg', 'adresa', 'mesto', 'fotografija',
      'email', 'telefon', 'pozicija', 'sektor', 'status_zaposlenja', 'vrsta_zaposlenja',
      'broj_radne_dozvole', 'datum_pocetka', 'uloga', 'pristup', 'sifra'
    ];
    for (const field of requiredFields) {
      if (!body[field] || body[field] === "") {
        return NextResponse.json({ error: `Polje '${field}' je obavezno.` }, { status: 400 });
      }
    }
    const {
      ime, prezime, pol, datum_rodjenja, jmbg, adresa, mesto, grad, fotografija,
      email, telefon, pozicija, sektor, status_zaposlenja, vrsta_zaposlenja,
      broj_radne_dozvole, datum_pocetka, datum_zavrsetka, uloga, pristup, sifra
    } = body;
    if (!ime || !prezime || !email) {
      return NextResponse.json({ error: 'Ime, prezime i email su obavezni.' }, { status: 400 });
    }
    const gradSafe = grad || null;
    const datum_zavrsetkaSafe = datum_zavrsetka || null;
    const result = await pool.query(
      `INSERT INTO zaposleni_korisnici
      (ime, prezime, pol, datum_rodjenja, jmbg, adresa, mesto, grad, fotografija, email, telefon, pozicija, sektor, status_zaposlenja, vrsta_zaposlenja, broj_radne_dozvole, datum_pocetka, datum_zavrsetka, uloga, pristup, sifra)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
      RETURNING *`,
      [ime, prezime, pol, datum_rodjenja, jmbg, adresa, mesto, gradSafe, fotografija, email, telefon, pozicija, sektor, status_zaposlenja, vrsta_zaposlenja, broj_radne_dozvole, datum_pocetka, datum_zavrsetkaSafe, uloga, pristup, sifra]
    );
    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: 'Greška pri upisu.' }, { status: 500 });
  }
} 