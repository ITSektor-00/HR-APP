"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import KorisniciTable from './KorisniciTable';
import NoviKorisnikModal from './NoviKorisnikModal';
import ExportModal from './ExportModal';
import ColumnsMenu from './ColumnsMenu';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

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
    const csv = '\uFEFF' + [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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

  const paginatedKorisnici = korisnici.slice((page-1)*rowsPerPage, page*rowsPerPage);
  const totalPages = Math.ceil(korisnici.length / rowsPerPage);

  const handleSelect = (id: number, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedKorisnici.map(k => k.id));
    } else {
      setSelectedIds(prev => prev.filter(id => !paginatedKorisnici.some(k => k.id === id)));
    }
  };
  const handleDelete = async () => {
    for (const id of selectedIds) {
      await fetch(`/api/zaposleni/korisnici?id=${id}`, { method: 'DELETE' });
    }
    setSelectedIds([]);
    fetchKorisnici();
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
          <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg flex items-center justify-center" style={{backgroundColor: '#3A3CA6'}}>
            <Image src="/ikonice/beleIkonice/korisniciBelo.svg" alt="Korisnici" width={40} height={40} />
          </div>
          <h1 className="text-4xl font-bold ml-2">Korisnici</h1>
        </div>
        <Button 
          onClick={handleDownloadCitac} 
          variant="outline" 
          className="flex items-center gap-2 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-auto"
          style={{ backgroundColor: '#D8D8ED' }}
          disabled={citacLoading}
          title="Preuzmite aplikaciju za čitanje ličnih kartica"
        >
          {citacLoading ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {citacLoading ? 'Preuzimanje...' : 'Preuzmite Čitač lične karte'}
        </Button>
      </div>

      {/* Glavni kontejner sa tabelom i kontrolama */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        {/* Naslov tabele i kontrole */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-2xl font-semibold">Tabela</h2>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            {selectedIds.length > 0 && (
              <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2 order-1 sm:order-none">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="6" y="7" width="12" height="12" rx="2" stroke="#fff" strokeWidth="2"/><path d="M9 7V5a3 3 0 1 1 6 0v2" stroke="#fff" strokeWidth="2"/></svg>
                Obriši ({selectedIds.length})
              </Button>
            )}
            <Button onClick={() => setModalOpen(true)} variant="default" className="font-semibold bg-[#3A3CA6] hover:bg-blue-700 active:bg-blue-800 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none order-2 sm:order-none">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5"/>
              </svg>
              Novi korisnik
            </Button>
            <Button variant="outline" onClick={() => setExportOpen(true)} className="hover:bg-gray-50 active:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">Izvoz</Button>
            <div className="relative">
              <Button variant="outline" onClick={() => setColumnsOpen(!columnsOpen)} className="flex items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <span className="w-5 h-5 inline-block align-middle">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="columns-3-2" transform="translate(-2 -2)">
                      <path id="secondary" fill="#2ca9bc" d="M4,3H20a1,1,0,0,1,1,1V7H3V4A1,1,0,0,1,4,3Z"/>
                      <path id="primary" d="M15,7H9V21h6ZM3,7H21M20,21H4a1,1,0,0,1-1-1V4A1,1,0,0,1,4,3H20a1,1,0,0,1,1,1V20A1,1,0,0,1,20,21Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    </g>
                  </svg>
                </span>
                Kolone <span className="ml-1 bg-indigo-600 text-white rounded px-2">12</span>
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
          <KorisniciTable
            korisnici={paginatedKorisnici}
            onView={handleView}
            onMore={handleMore}
            loading={loading}
            visibleColumns={visibleColumns}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            allSelected={paginatedKorisnici.length > 0 && paginatedKorisnici.every(k => selectedIds.includes(k.id))}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </div>

        {/* Pagination i ukupno stavki prikazujem samo ovde */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Broj redova:</span>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
              value={rowsPerPage}
              onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
            >
              {[5, 10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Ukupno stavki: <span className="font-medium">{korisnici.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Prethodna</button>
            <button className="border border-blue-500 bg-blue-500 text-white rounded px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">{page}</button>
            <button className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>Sledeća</button>
          </div>
        </div>
      </div>

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} onExport={handleExport} defaultColumns={visibleColumns} />
      <NoviKorisnikModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  );
} 