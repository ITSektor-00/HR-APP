import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import KorisnikDetaljiClient from './KorisnikDetaljiClient';

async function getKorisnik(id: string) {
  let baseUrl = '';
  const headersList = await headers();
  const host = headersList.get('host');
  if (host) {
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    baseUrl = `${protocol}://${host}`;
  }
  const res = await fetch(`${baseUrl}/api/zaposleni/korisnici`);
  const data = await res.json();
  return data.find((k: Record<string, unknown>) => String(k.id) === String(id));
}

export default async function KorisnikDetaljiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const korisnik = await getKorisnik(id);
  if (!korisnik) return notFound();
  return <KorisnikDetaljiClient korisnik={korisnik} />;
} 