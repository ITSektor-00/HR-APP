"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

const MOCK_VOZILA = [
  {
    id: 1,
    naslov: "Službeno vozilo 2",
    opis: "",
    broj_sasije: "XVWZABAUZMW...",
    boja: "#33ff57",
    proizvodjac: "Volkswagen",
    komercijalna_oznaka: "Passat",
    godina_proizvodnje: 2012,
    datum_kreiranja: "1.3.2024. 02:27",
    datum_azuriranja: "1.3.2024. 02:27",
  },
  // ... Dodaj ostale mock podatke po uzoru na sliku
];

export default function VozilaPage() {
  const [vozila, setVozila] = useState(MOCK_VOZILA);
  const [loading, setLoading] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(COLUMN_CONFIG.map(c => c.key));
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg flex items-center justify-center" style={{backgroundColor: '#3A3CA6'}}>
          <Image src="/ikonice/beleIkonice/vozilaBelo.svg" alt="Vozila" width={40} height={40} />
        </div>
        <h1 className="text-4xl font-bold ml-2">Vozila</h1>
      </div>
      <div className="overflow-x-auto">
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
              paginatedVozila.map((v, idx) => (
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
                        (v as any)[col.key]
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