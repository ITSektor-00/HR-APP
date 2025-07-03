import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

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
      broj_radne_dozvole, datum_pocetka, datum_zavrsetka, uloga, pristup, sifra,
      plata, period_plate
    } = body;
    if (!ime || !prezime || !email) {
      return NextResponse.json({ error: 'Ime, prezime i email su obavezni.' }, { status: 400 });
    }
    const gradSafe = grad || null;
    const datum_zavrsetkaSafe = datum_zavrsetka || null;
    const now = new Date().toISOString();
    // If no image is provided, use a default Cloudinary image (thispersondoesnotexist)
    let fotografijaUrl = fotografija;
    if (fotografija && fotografija.startsWith('data:image')) {
      // Ako je base64, uploaduj na Cloudinary
      const uploadResult = await uploadImageToCloudinary(fotografija, 'HR_APLIKACIJA');
      fotografijaUrl = uploadResult.secure_url;
    } else if (!fotografija || fotografija.trim() === "") {
      fotografijaUrl = 'https://res.cloudinary.com/dpprqbwvp/image/upload/v1710000000/HR_APLIKACIJA/default-user.jpg';
    }
    const result = await pool.query(
      `INSERT INTO zaposleni_korisnici
      (ime, prezime, pol, datum_rodjenja, jmbg, adresa, mesto, grad, fotografija, email, telefon, pozicija, sektor, status_zaposlenja, vrsta_zaposlenja, broj_radne_dozvole, datum_pocetka, datum_zavrsetka, uloga, pristup, sifra, plata, period_plate, datum_kreiranja, datum_azuriranja)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
      RETURNING *`,
      [ime, prezime, pol, datum_rodjenja, jmbg, adresa, mesto, gradSafe, fotografijaUrl, email, telefon, pozicija, sektor, status_zaposlenja, vrsta_zaposlenja, broj_radne_dozvole, datum_pocetka, datum_zavrsetkaSafe, uloga, pristup, sifra, plata, period_plate, now, now]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Greška pri upisu.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 });
    }

    const body = await req.json();
    const {
      ime, prezime, pol, datum_rodjenja, jmbg, adresa, mesto, grad, fotografija,
      email, telefon, pozicija, sektor, status_zaposlenja, vrsta_zaposlenja,
      broj_radne_dozvole, datum_pocetka, datum_zavrsetka, uloga, pristup, sifra,
      plata, period_plate, valuta
    } = body;

    const gradSafe = grad || null;
    const datum_rodjenjaSafe = datum_rodjenja && datum_rodjenja !== '' ? datum_rodjenja : null;
    const datum_pocetkaSafe = datum_pocetka && datum_pocetka !== '' ? datum_pocetka : null;
    const datum_zavrsetkaSafe = datum_zavrsetka && datum_zavrsetka !== '' ? datum_zavrsetka : null;
    const now = new Date().toISOString();

    // Handle image upload if needed
    let fotografijaUrl = fotografija;
    if (fotografija && fotografija.startsWith('data:image')) {
      const uploadResult = await uploadImageToCloudinary(fotografija, 'HR_APLIKACIJA');
      fotografijaUrl = uploadResult.secure_url;
    }

    const result = await pool.query(
      `UPDATE zaposleni_korisnici SET
      ime = $1, prezime = $2, pol = $3, datum_rodjenja = $4, jmbg = $5, adresa = $6, mesto = $7, grad = $8, 
      fotografija = $9, email = $10, telefon = $11, pozicija = $12, sektor = $13, status_zaposlenja = $14, 
      vrsta_zaposlenja = $15, broj_radne_dozvole = $16, datum_pocetka = $17, datum_zavrsetka = $18, 
      uloga = $19, pristup = $20, sifra = $21, plata = $22, period_plate = $23, valuta = $24, datum_azuriranja = $25
      WHERE id = $26
      RETURNING *`,
      [ime, prezime, pol, datum_rodjenjaSafe, jmbg, adresa, mesto, gradSafe, fotografijaUrl, email, telefon, 
       pozicija, sektor, status_zaposlenja, vrsta_zaposlenja, broj_radne_dozvole, datum_pocetkaSafe, 
       datum_zavrsetkaSafe, uloga, pristup, sifra, plata, period_plate, valuta, now, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Greška pri ažuriranju.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 });
  }
  try {
    // Samo obriši korisnika, ne pomeraj ID-ove
    await pool.query('DELETE FROM zaposleni_korisnici WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Greška pri brisanju.' }, { status: 500 });
  }
} 