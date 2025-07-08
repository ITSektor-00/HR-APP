"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ColumnsMenu from './ColumnsMenu';
import ExportModal from './ExportModal';
import NoviVoziloModal from './NoviVoziloModal';
import { format } from 'date-fns';

const COLUMN_CONFIG = [
  { key: "naslov", label: "Naslov" },
  { key: "opis", label: "Opis" },
  { key: "broj_sasije", label: "Broj šasije" },
  { key: "boja", label: "Boja" },
  { key: "proizvodjac", label: "Proizvođač" },
  { key: "komercijalna_oznaka", label: "Komercijalna oznaka" },
  { key: "godina_proizvodnje", label: "Godina proizvodnje" },
  { key: "datum_kreiranja", label: "Datum kreiranja" },
  { key: "datum_azuriranja", label: "Datum ažuriranja" },
];

type Vozilo = {
  id: number;
  naslov: string;
  opis: string;
  broj_sasije: string;
  boja: string;
  proizvodjac: string;
  komercijalna_oznaka: string;
  godina_proizvodnje: number;
  datum_kreiranja: string;
  datum_azuriranja: string;
};

export default function VozilaPage() {
  const [vozila, setVozila] = useState<Vozilo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(COLUMN_CONFIG.map(c => c.key));
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [novoOpen, setNovoOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    naslov: '',
    opis: '',
    broj_sasije: '',
    proizvodjac: '',
    komercijalna_oznaka: '',
    datum_kreiranja_od: '',
    datum_kreiranja_do: '',
    datum_azuriranja_od: '',
    datum_azuriranja_do: '',
  });

  const refreshVozila = async (customFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(customFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await fetch('/api/vozila?' + params.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Greška pri učitavanju vozila');
      setVozila(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri učitavanju vozila');
    }
    setLoading(false);
  };

  useEffect(() => { refreshVozila(); }, []);

  const paginatedVozila = vozila.slice((page-1)*rowsPerPage, page*rowsPerPage);
  const allSelected = paginatedVozila.length > 0 && paginatedVozila.every(v => selectedIds.includes(v.id));

  const handleSelect = (id: number, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedVozila.map(v => v.id));
    } else {
      setSelectedIds(prev => prev.filter(id => !paginatedVozila.some(v => v.id === id)));
    }
  };

  return (
    <div className="p-8 w-full h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg flex items-center justify-center" style={{backgroundColor: '#3A3CA6'}}>
            <Image src="/ikonice/beleIkonice/vozilaBelo.svg" alt="Vozila" width={40} height={40} />
          </div>
          <h1 className="text-4xl font-bold ml-2">Vozila</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-end relative">
          <Button onClick={() => setNovoOpen(true)} variant="default" className="font-semibold bg-[#3A3CA6] hover:bg-blue-700 active:bg-blue-800 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2" />
              <path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Novo vozilo
          </Button>
          <Button variant="outline" onClick={() => setExportOpen(true)} className="hover:bg-gray-50 active:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">Izvoz</Button>
          <Button variant="outline" onClick={() => setColumnsOpen(!columnsOpen)} className="flex items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <span className="w-5 h-5 inline-block align-middle">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="columns-3-2" transform="translate(-2 -2)">
                  <path id="secondary" fill="#2ca9bc" d="M4,3H20a1,1,0,0,1,1,1V7H3V4A1,1,0,0,1,4,3Z"/>
                  <path id="primary" d="M15,7H9V21h6ZM3,7H21M20,21H4a1,1,0,0,1-1-1V4A1,1,0,0,1,4,3H20a1,1,0,0,1,1,1V20A1,1,0,0,1,20,21Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </g>
              </svg>
            </span>
            Kolone <span className="ml-1 bg-indigo-600 text-white rounded px-2">{visibleColumns.length}</span>
          </Button>
          <Button variant="outline" onClick={() => setFilterOpen(f => !f)} className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">
            {filterOpen ? 'Zatvori filtere' : 'Filteri'}
          </Button>
          <ColumnsMenu open={columnsOpen} onClose={() => setColumnsOpen(false)} selected={visibleColumns} onChange={setVisibleColumns} />
        </div>
      </div>
      {filterOpen && (
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Naslov</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Pretraga..." value={filters.naslov} onChange={e => setFilters(f => ({...f, naslov: e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Opis</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Pretraga..." value={filters.opis} onChange={e => setFilters(f => ({...f, opis: e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Broj šasije</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Pretraga..." value={filters.broj_sasije} onChange={e => setFilters(f => ({...f, broj_sasije: e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Proizvođač</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Pretraga..." value={filters.proizvodjac} onChange={e => setFilters(f => ({...f, proizvodjac: e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Komercijalna oznaka</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Pretraga..." value={filters.komercijalna_oznaka} onChange={e => setFilters(f => ({...f, komercijalna_oznaka: e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Datum kreiranja</label>
              <div className="flex gap-2">
                <input type="date" className="w-full border rounded px-3 py-2" value={filters.datum_kreiranja_od} onChange={e => setFilters(f => ({...f, datum_kreiranja_od: e.target.value}))} />
                <span className="flex items-center">→</span>
                <input type="date" className="w-full border rounded px-3 py-2" value={filters.datum_kreiranja_do} onChange={e => setFilters(f => ({...f, datum_kreiranja_do: e.target.value}))} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Datum ažuriranja</label>
              <div className="flex gap-2">
                <input type="date" className="w-full border rounded px-3 py-2" value={filters.datum_azuriranja_od} onChange={e => setFilters(f => ({...f, datum_azuriranja_od: e.target.value}))} />
                <span className="flex items-center">→</span>
                <input type="date" className="w-full border rounded px-3 py-2" value={filters.datum_azuriranja_do} onChange={e => setFilters(f => ({...f, datum_azuriranja_do: e.target.value}))} />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => refreshVozila()} className="bg-[#3A3CA6] text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors">Pretraži</Button>
          </div>
        </div>
      )}
      <NoviVoziloModal open={novoOpen} onClose={() => setNovoOpen(false)} onSuccess={refreshVozila} />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} vozila={vozila} />
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 font-medium">Učitavanje vozila...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-8">{error}</div>
        ) : (
          <table className="min-w-full text-sm border">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b">
                <th className="p-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 hover:border-blue-400"
                    checked={allSelected}
                    onChange={e => handleSelectAll(e.target.checked)}
                  />
                </th>
                {COLUMN_CONFIG.filter(col => visibleColumns.includes(col.key)).map(col => (
                  <th key={col.key} className="p-2 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    {col.label}
                  </th>
                ))}
                <th className="p-2 hover:bg-gray-50 transition-colors"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedVozila.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="font-medium">Nema vozila</p>
                      <p className="text-sm">Dodajte prvo vozilo da počnete</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedVozila.map((v) => (
                  <tr key={v.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 hover:border-blue-400"
                        checked={selectedIds.includes(v.id)}
                        onChange={e => handleSelect(v.id, e.target.checked)}
                      />
                    </td>
                    {COLUMN_CONFIG.filter(col => visibleColumns.includes(col.key)).map(col => (
                      <td key={col.key} className="p-2">
                        {col.key === "boja" ? (
                          <span className="px-2 py-1 rounded text-white" style={{backgroundColor: v.boja}}>{v.boja}</span>
                        ) : (
                          v[col.key as keyof Vozilo]
                        )}
                      </td>
                    ))}
                    <td className="p-2 text-center">
                      <Button variant="ghost" size="icon">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          Broj redova:
          <select
            className="ml-2 border rounded p-1"
            value={rowsPerPage}
            onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
          >
            {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          Ukupno stavki: {vozila.length}
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p-1))}>{"<"}</Button>
          <span>{page}</span>
          <Button disabled={page * rowsPerPage >= vozila.length} onClick={() => setPage(p => p+1)}>{">"}</Button>
        </div>
      </div>
    </div>
  );
} 