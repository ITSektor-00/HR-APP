import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query("SELECT * FROM prisustva ORDER BY created_at DESC");
  const rows = result.rows;
  if (!rows.length) return new NextResponse("", { status: 204 });
  const header = Object.keys(rows[0]).join(",") + "\n";
  const csv = header + rows.map(r => Object.values(r).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=prisustva.csv"
    }
  });
} 