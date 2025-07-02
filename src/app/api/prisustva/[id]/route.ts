import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await pool.query("SELECT * FROM prisustva WHERE id = $1", [id]);
  return NextResponse.json(result.rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { korisnik_id, lokacija, datum_pocetka, datum_zavrsetka } = body;
  const result = await pool.query(
    `UPDATE prisustva SET korisnik_id = $1, lokacija = $2, datum_pocetka = $3, datum_zavrsetka = $4, updated_at = NOW() WHERE id = $5 RETURNING *;`,
    [korisnik_id, lokacija, datum_pocetka, datum_zavrsetka, id]
  );
  return NextResponse.json(result.rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await pool.query("DELETE FROM prisustva WHERE id = $1", [id]);
  return NextResponse.json({ success: true });
} 