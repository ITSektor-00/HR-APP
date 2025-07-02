"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import KorisniciTable from './KorisniciTable';
import NoviKorisnikModal from './NoviKorisnikModal';
import ExportModal from './ExportModal';
import ColumnsMenu from './ColumnsMenu';
import { Button } from '@/components/ui/button';

interface Korisnik {
  id: number;
  ime: string;
  prezime: string;
  pristup: string;
  datum_pocetka: string;
  uloga: string;
  datum_zavrsetka?: string;
  status_zaposlenja: string;
  vrsta_zaposlenja: string;
  pozicija: string;
  sektor: string;
  broj_radne_dozvole: string;
  datum_kreiranja: string;
  datum_azuriranja: string;
  [key: string]: string | number | undefined;
}

interface KorisnikData {
  ime: string;
  prezime: string;
  pol: string;
  datum_rodjenja: string;
  jmbg: string;
  adresa: string;
  mesto: string;
  grad?: string;
  fotografija: string;
  email: string;
  telefon?: string;
  pozicija: string;
  sektor: string;
  status_zaposlenja: string;
  vrsta_zaposlenja: string;
  broj_radne_dozvole: string;
  datum_pocetka: string;
  datum_zavrsetka?: string;
  uloga: string;
  pristup: string;
  sifra: string;
  plata?: string;
  period_plate?: string;
  [key: string]: string | undefined;
}

const initialKorisnici: Korisnik[] = [];

const ALL_COLUMNS = [
  'id',
  'pristup',
  'datum_pocetka',
  'uloga',
  'korisnik',
  'datum_zavrsetka',
  'status_zaposlenja',
  'vrsta_zaposlenja',
  'pozicija',
  'sektor',
  'broj_radne_dozvole',
  'datum_kreiranja',
  'datum_azuriranja',
];

export default function KorisniciPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [korisnici, setKorisnici] = useState(initialKorisnici);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'}|null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(ALL_COLUMNS);
  const [citacLoading, setCitacLoading] = useState(false);

  useEffect(() => {
    fetchKorisnici();
  }, []);

  const fetchKorisnici = async () => {
    setLoading(true);
    const res = await fetch('/api/zaposleni/korisnici');
    const data = await res.json();
    setKorisnici(data);
    setLoading(false);
  };

  const handleView = () => {
    // logika za prikaz detalja
  };
  const handleMore = () => {
    // logika za više opcija
  };
  const handleAdd = async (novi: KorisnikData) => {
    try {
      const res = await fetch('/api/zaposleni/korisnici', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novi),
      });
      if (res.ok) {
        setToast({msg: 'Korisnik uspešno dodat!', type: 'success'});
        setModalOpen(false);
        fetchKorisnici();
      } else {
        const err = await res.json();
        setToast({msg: err.error || 'Greška pri unosu.', type: 'error'});
      }
    } catch {
      setToast({msg: 'Greška pri unosu.', type: 'error'});
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = (columns: string[]) => {
    // Generiši CSV na frontendu
    const rows = korisnici.map((k: Korisnik) => {
      return columns.map(col => {
        if (col === 'korisnik') return `${k.ime || ''} ${k.prezime || ''}`.trim();
        return k[col] ?? '';
      });
    });
    const headerLabels: Record<string, string> = {
      id: 'Identifikator', pristup: 'Pristup', datum_pocetka: 'Datum početka zaposlenja', uloga: 'Uloga', korisnik: 'Korisnik', datum_zavrsetka: 'Datum završetka zaposlenja', status_zaposlenja: 'Status zaposlenja', vrsta_zaposlenja: 'Vrsta zaposlenja', pozicija: 'Pozicija', sektor: 'Sektor', broj_radne_dozvole: 'Broj radne dozvole', datum_kreiranja: 'Datum kreiranja', datum_azuriranja: 'Datum ažuriranja'
    };
    const header = columns.map(col => headerLabels[col] || col);
    const csv = [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'korisnici.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCitac = () => {
    setCitacLoading(true);
    try {
      const link = document.createElement('a');
      link.href = '/hrp-citac.exe';
      link.download = 'hrp-citac.exe';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToast({msg: 'Čitač uspešno preuzet!', type: 'success'});
    } catch {
      setToast({msg: 'Greška pri preuzimanju čitača.', type: 'error'});
    }
    setTimeout(() => setCitacLoading(false), 1000);
  };

  return (
    <div className="p-8 w-full h-full">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition ${toast.type==='success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}
      
      {/* Header sa naslovom i čitačem */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#3A3CA6'}}>
            <Image src="/ikonice/beleIkonice/korisniciBelo.svg" alt="Korisnici" width={24} height={24} />
          </div>
          <h1 className="text-2xl font-bold">Korisnici</h1>
        </div>
        <Button 
          onClick={handleDownloadCitac} 
          variant="outline" 
          className="flex items-center gap-2 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-auto"
          disabled={citacLoading}
          title="Preuzmite aplikaciju za čitanje ličnih kartica"
        >
          {citacLoading ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Image src="/korisnici/upload-file.svg" alt="Upload" width={16} height={16} />
          )}
          {citacLoading ? 'Preuzimanje...' : 'Preuzmite Čitač lične karte'}
        </Button>
      </div>

      {/* Glavni kontejner sa tabelom i kontrolama */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        {/* Naslov tabele i kontrole */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg font-semibold">Tabela</h2>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <Button onClick={() => setModalOpen(true)} variant="default" className="font-semibold bg-[#3A3CA6] hover:bg-blue-700 active:bg-blue-800 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5"/>
              </svg>
              Novi korisnik
            </Button>
            <Button variant="outline" onClick={() => setExportOpen(true)} className="hover:bg-gray-50 active:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">Izvoz</Button>
            <div className="relative">
              <Button variant="outline" onClick={() => setColumnsOpen(!columnsOpen)} className="flex items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="mr-1"><path d="M3 6h18M3 12h18M3 18h18" stroke="#3A3CA6" strokeWidth="2" strokeLinecap="round"/></svg>
                Kolone <span className="ml-1 bg-indigo-600 text-white rounded px-2">{visibleColumns.length}</span>
              </Button>
              {columnsOpen && (
                <ColumnsMenu 
                  open={columnsOpen} 
                  onClose={() => setColumnsOpen(false)} 
                  selected={visibleColumns} 
                  onChange={setVisibleColumns} 
                />
              )}
            </div>
            <Button variant="outline" disabled className="opacity-50 cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none">Filteri</Button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto w-full">
          <KorisniciTable korisnici={korisnici} onView={handleView} onMore={handleMore} loading={loading} visibleColumns={visibleColumns} />
        </div>
      </div>

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} onExport={handleExport} defaultColumns={visibleColumns} />
      <NoviKorisnikModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  );
} 