/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import UgovoriTable from './UgovoriTable';
import NoviUgovorModal from './NoviUgovorModal';
import UrediUgovorModal from './UrediUgovorModal';
import ExportModal from './ExportModal';
import ColumnsMenu from './ColumnsMenu';
import { Button } from '@/components/ui/button';
import UgovoriFilter from './UgovoriFilter';
import UgovoriStatistika from './UgovoriStatistika';

export interface Ugovor {
  id: number;
  zaposleni: {
    ime: string;
    prezime: string;
    fotografija?: string;
  };
  vrsta_ugovora: string;
  naziv_ugovora: string;
  opis: string;
  dokument: string;
  status: string;
  uslovi: string;
  datum_pocetka: string;
  datum_zavrsetka: string;
  datum_kreiranja: string;
  datum_azuriranja: string;
  [key: string]: any;
}

const ALL_COLUMNS = [
  "zaposleni",
  "vrsta_ugovora",
  "naziv_ugovora",
  "dokument",
  "status",
  "uslovi",
  "opis",
  "datum_pocetka",
  "datum_zavrsetka",
  "datum_kreiranja",
  "datum_azuriranja",
];

const COLUMN_LABELS: Record<string, string> = {
  zaposleni: 'Zaposleni',
  vrsta_ugovora: 'Vrsta ugovora',
  naziv_ugovora: 'Broj ugovora',
  dokument: 'Dokument',
  status: 'Status',
  uslovi: 'Uslovi',
  opis: 'Napomena',
  datum_pocetka: 'Datum početka',
  datum_zavrsetka: 'Datum završetka',
  datum_kreiranja: 'Datum kreiranja',
  datum_azuriranja: 'Datum ažuriranja',
};

export default function UgovoriPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUgovor, setEditingUgovor] = useState<Ugovor | null>(null);
  const [ugovori, setUgovori] = useState<Ugovor[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'}|null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState<string[]>(ALL_COLUMNS);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(ALL_COLUMNS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'tabela' | 'statistika'>('tabela');

  useEffect(() => {
    fetchUgovori(filterValues);
  }, [filterValues]);

  const fetchUgovori = async (filters: any = {}) => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') params.append(key, String(value));
    });
    const res = await fetch('/api/ugovori' + (params.size ? `?${params.toString()}` : ''));
    const data = await res.json();
    setUgovori(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  // Filter na frontendu po nazivu ugovora ili korisniku
  let filteredUgovori = ugovori;
  if (filterValues.naziv_ugovora && filterValues.naziv_ugovora.trim() !== '') {
    const q = filterValues.naziv_ugovora.trim().toLowerCase();
    filteredUgovori = filteredUgovori.filter(u => (u.naziv_ugovora || '').toLowerCase().includes(q));
  }
  if (filterValues.korisnik && filterValues.korisnik.trim() !== '') {
    const q = filterValues.korisnik.trim().toLowerCase();
    filteredUgovori = filteredUgovori.filter(u => {
      const ime = (u.ime || '').toLowerCase();
      const prezime = (u.prezime || '').toLowerCase();
      const puno = (ime + ' ' + prezime).trim();
      return puno.includes(q) || ime.includes(q) || prezime.includes(q);
    });
  }
  // Pre paginacije
  const safeFilteredUgovori = Array.isArray(filteredUgovori) ? filteredUgovori : [];
  const paginatedUgovori = safeFilteredUgovori.slice((page-1)*rowsPerPage, page*rowsPerPage);
  const totalPages = Math.ceil(safeFilteredUgovori.length / rowsPerPage);

  const handleAdd = async (novi: any) => {
    try {
      const res = await fetch('/api/ugovori', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novi),
      });
      if (res.ok) {
        setToast({msg: 'Ugovor uspešno dodat!', type: 'success'});
        setModalOpen(false);
        fetchUgovori();
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
    const rows = ugovori.map((u: Ugovor) => {
      return columns.map(col => u[col as keyof Ugovor] ?? '');
    });
    const header = columns;
    const csv = '\uFEFF' + [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ugovori.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelect = (id: number, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedUgovori.map(u => u.id));
    } else {
      setSelectedIds(prev => prev.filter(id => !paginatedUgovori.some(u => u.id === id)));
    }
  };
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/ugovori?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast({msg: 'Ugovor uspešno obrisan!', type: 'success'});
        fetchUgovori(filterValues);
      } else {
        const err = await res.json();
        setToast({msg: err.error || 'Greška pri brisanju.', type: 'error'});
      }
    } catch {
      setToast({msg: 'Greška pri brisanju.', type: 'error'});
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (ugovor: Ugovor) => {
    setEditingUgovor(ugovor);
    setEditModalOpen(true);
  };

  const handleUpdate = async (updatedUgovor: any) => {
    if (!editingUgovor) return;
    try {
      const res = await fetch(`/api/ugovori?id=${editingUgovor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUgovor),
      });
      if (res.ok) {
        setToast({msg: 'Ugovor uspešno ažuriran!', type: 'success'});
        setEditModalOpen(false);
        setEditingUgovor(null);
        fetchUgovori(filterValues);
      } else {
        const err = await res.json();
        setToast({msg: err.error || 'Greška pri ažuriranju.', type: 'error'});
      }
    } catch {
      setToast({msg: 'Greška pri ažuriranju.', type: 'error'});
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleColumn = (col: string) => {
    setVisibleColumns(cols => cols.includes(col) ? cols.filter(c => c !== col) : [...cols, col]);
  };

  // Sortiranje po srpskoj abecedi na frontendu
  const handleSortByName = () => {
    const sorted = [...ugovori].sort((a, b) => {
      const imeA = `${a.zaposleni?.ime || ''} ${a.zaposleni?.prezime || ''}`.trim();
      const imeB = `${b.zaposleni?.ime || ''} ${b.zaposleni?.prezime || ''}`.trim();
      return imeA.localeCompare(imeB, 'sr', { sensitivity: 'base' });
    });
    setUgovori(sorted);
  };

  const handleSortByNajskorijiPocetak = () => {
    const sorted = [...ugovori].sort((a, b) => {
      const dA = a.datum_pocetka ? new Date(a.datum_pocetka).getTime() : 0;
      const dB = b.datum_pocetka ? new Date(b.datum_pocetka).getTime() : 0;
      return dB - dA;
    });
    setUgovori(sorted);
  };

  const handleSortByNajskorijiZavrsetak = () => {
    const sorted = [...ugovori].sort((a, b) => {
      const dA = a.datum_zavrsetka ? new Date(a.datum_zavrsetka).getTime() : 0;
      const dB = b.datum_zavrsetka ? new Date(b.datum_zavrsetka).getTime() : 0;
      return dB - dA;
    });
    setUgovori(sorted);
  };

  return (
    <div className="p-8 w-full h-full">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition ${toast.type==='success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.msg}</div>
      )}
      {/* Header sa naslovom */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg flex items-center justify-center" style={{backgroundColor: '#3A3CA6'}}>
            <Image src="/ikonice/beleIkonice/ugovoriBelo.svg" alt="Ugovori" width={40} height={40} />
          </div>
          <h1 className="text-4xl font-bold ml-2">Ugovori</h1>
        </div>
      </div>
      {/* Tabovi za prikaz */}
      <div className="flex gap-8 border-b border-gray-200 mb-8 relative">
        <button
          className={`flex items-center gap-2 px-2 pb-2 font-semibold text-lg transition-colors duration-150 focus:outline-none cursor-pointer ${activeTab === 'tabela' ? 'text-indigo-700' : 'text-gray-800'}`}
          style={{ position: 'relative' }}
          onClick={() => setActiveTab('tabela')}
        >
          <Image src="/table.svg" alt="Tabela" width={22} height={22} />
          Tabela
          {activeTab === 'tabela' && <span className="absolute left-0 right-0 -bottom-[2px] h-1 bg-indigo-600 rounded-full" />}
        </button>
        <button
          className={`flex items-center gap-2 px-2 pb-2 font-semibold text-lg transition-colors duration-150 focus:outline-none cursor-pointer ${activeTab === 'statistika' ? 'text-indigo-700' : 'text-gray-800'}`}
          style={{ position: 'relative' }}
          onClick={() => setActiveTab('statistika')}
        >
          <Image src="/statistic.svg" alt="Statistika" width={22} height={22} />
          Statistika
          {activeTab === 'statistika' && <span className="absolute left-0 right-0 -bottom-[2px] h-1 bg-indigo-600 rounded-full" />}
        </button>
      </div>
      {/* Prikaz tabele ili statistike */}
      {activeTab === 'tabela' ? (
        <>
          {/* Naslov tabele i kontrole */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <Image src="/table.svg" alt="Tabela" width={28} height={28} />
              <h2 className="text-3xl font-semibold">Tabela</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              {selectedIds.length > 0 && (
                <Button variant="destructive" onClick={async () => {
                  const confirmed = window.confirm('Da li ste sigurni da želite da obrišete izabrane ugovore?');
                  if (confirmed) {
                    for (const id of selectedIds) {
                      await handleDelete(id);
                    }
                    setSelectedIds([]);
                  }
                }} className="flex items-center gap-2 order-1 sm:order-none">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="6" y="7" width="12" height="12" rx="2" stroke="#fff" strokeWidth="2"/><path d="M9 7V5a3 3 0 1 1 6 0v2" stroke="#fff" strokeWidth="2"/></svg>
                  Obriši ({selectedIds.length})
                </Button>
              )}
              <Button onClick={() => setModalOpen(true)} variant="default" className="font-semibold bg-[#3A3CA6] hover:bg-blue-700 active:bg-blue-800 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5"/>
                </svg>
                Novi ugovor
              </Button>
              <Button variant="outline" onClick={() => setExportOpen(true)} className="hover:bg-gray-50 active:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer">Izvoz</Button>
              <div className="relative">
                <Button variant="outline" onClick={() => setColumnsOpen(!columnsOpen)} className="flex items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer">
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
                {columnsOpen && (
                  <ColumnsMenu
                    open={columnsOpen}
                    onClose={() => setColumnsOpen(false)}
                    visibleColumns={visibleColumns}
                    onToggleColumn={handleToggleColumn}
                    columnOrder={columnOrder}
                    onOrderChange={setColumnOrder}
                  />
                )}
              </div>
              <Button variant="outline" onClick={() => setFilterOpen(true)} className="hover:bg-gray-50 active:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer">Filteri</Button>
            </div>
          </div>
          {/* Sadržaj tabele */}
          <div className="overflow-x-auto w-full">
            <UgovoriTable
              ugovori={paginatedUgovori}
              visibleColumns={visibleColumns}
              columnOrder={columnOrder}
              onToggleColumn={handleToggleColumn}
              onOrderChange={setColumnOrder}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              allSelected={selectedIds.length === paginatedUgovori.length && paginatedUgovori.length > 0}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSortByName={handleSortByName}
              onSortByNajskorijiPocetak={handleSortByNajskorijiPocetak}
              onSortByNajskorijiZavrsetak={handleSortByNajskorijiZavrsetak}
              columnsOpen={columnsOpen}
              filterOpen={filterOpen}
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
              Ukupno stavki: <span className="font-medium">{safeFilteredUgovori.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Prethodna</button>
              <button className="border border-blue-500 bg-blue-500 text-white rounded px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">{page}</button>
              <button className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>Sledeća</button>
            </div>
          </div>
        </>
      ) : (
        <UgovoriStatistika ugovori={ugovori} />
      )}
      {/* Modali i ostalo ostaje isto */}
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} onExport={handleExport} defaultColumns={visibleColumns} />
      {modalOpen && (
        <NoviUgovorModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
      )}
      {editModalOpen && editingUgovor && (
        <UrediUgovorModal
          open={editModalOpen}
          ugovor={editingUgovor}
          onClose={() => { setEditModalOpen(false); setEditingUgovor(null); }}
          onSave={handleUpdate}
        />
      )}

      {filterOpen && (
        <UgovoriFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onFilter={setFilterValues}
          initialValues={filterValues}
        />
      )}
    </div>
  );
} 