import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query("SELECT * FROM prisustva ORDER BY created_at DESC");
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { korisnik_id, lokacija, datum_pocetka, datum_zavrsetka } = body;
  const result = await pool.query(
    "INSERT INTO prisustva (korisnik_id, lokacija, datum_pocetka, datum_zavrsetka) VALUES ($1, $2, $3, $4) RETURNING *;",
    [korisnik_id, lokacija, datum_pocetka, datum_zavrsetka]
  );
  return NextResponse.json(result.rows[0]);
} 