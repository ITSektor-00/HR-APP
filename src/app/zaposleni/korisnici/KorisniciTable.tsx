"use client";
import React from "react";
import Image from 'next/image';

interface Korisnik {
  id: number;
  ime: string;
  prezime: string;
  pol?: string;
  jmbg?: string;
  adresa?: string;
  mesto?: string;
  grad?: string;
  fotografija?: string;
  email?: string;
  telefon?: string;
  pozicija?: string;
  sektor?: string;
  status_zaposlenja?: string;
  vrsta_zaposlenja?: string;
  broj_radne_dozvole?: string;
  datum_pocetka?: string;
  datum_zavrsetka?: string;
  datum_kreiranja?: string;
  datum_azuriranja?: string;
  uloga?: string;
  pristup?: string;
}

interface Props {
  korisnici: Korisnik[];
  onView: (id: number) => void;
  onMore: (id: number) => void;
  loading?: boolean;
  visibleColumns: string[];
}

const COLUMN_CONFIG = [
  { key: 'id', label: 'Identifikator' },
  { key: 'pristup', label: 'Pristup' },
  { key: 'datum_pocetka', label: 'Datum početka zaposlenja' },
  { key: 'uloga', label: 'Uloga' },
  { key: 'korisnik', label: 'Korisnik' },
  { key: 'datum_zavrsetka', label: 'Datum završetka zaposlenja' },
  { key: 'status_zaposlenja', label: 'Status zaposlenja' },
  { key: 'vrsta_zaposlenja', label: 'Vrsta zaposlenja' },
  { key: 'pozicija', label: 'Pozicija' },
  { key: 'sektor', label: 'Sektor' },
  { key: 'broj_radne_dozvole', label: 'Broj radne dozvole' },
  { key: 'datum_kreiranja', label: 'Datum kreiranja' },
  { key: 'datum_azuriranja', label: 'Datum ažuriranja' },
];

const KorisniciTable: React.FC<Props> = ({ korisnici, onView, onMore, loading, visibleColumns }) => (
  <div className="relative">
    {loading ? (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Učitavanje korisnika...</p>
        </div>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b">
              <th className="p-2">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 hover:border-blue-400"
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
            {korisnici.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 2} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="font-medium">Nema korisnika</p>
                    <p className="text-sm">Dodajte prvog korisnika da počnete</p>
                  </div>
                </td>
              </tr>
            ) : (
              korisnici.map((k) => (
                <tr key={k.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 hover:border-blue-400"
                    />
                  </td>
                  {COLUMN_CONFIG.filter(col => visibleColumns.includes(col.key)).map(col => {
                    switch (col.key) {
                      case 'id': return <td key={col.key} className="p-2">{k.id}</td>;
                      case 'pristup': return <td key={col.key} className="p-2">{k.pristup}</td>;
                      case 'datum_pocetka': return <td key={col.key} className="p-2">{k.datum_pocetka}</td>;
                      case 'uloga': return <td key={col.key} className="p-2">{k.uloga}</td>;
                      case 'korisnik':
                        return <td key={col.key} className="p-2 flex items-center gap-2">{k.fotografija ? (<Image src={k.fotografija} alt="avatar" className="w-8 h-8 rounded-full object-cover" width={32} height={32} />) : (<span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gray-300`}>{(k.ime?.[0] || '') + (k.prezime?.[0] || '')}</span>)}{k.ime} {k.prezime}</td>;
                      case 'datum_zavrsetka': return <td key={col.key} className="p-2">{k.datum_zavrsetka}</td>;
                      case 'status_zaposlenja': return <td key={col.key} className="p-2">{k.status_zaposlenja}</td>;
                      case 'vrsta_zaposlenja': return <td key={col.key} className="p-2">{k.vrsta_zaposlenja}</td>;
                      case 'pozicija': return <td key={col.key} className="p-2">{k.pozicija}</td>;
                      case 'sektor': return <td key={col.key} className="p-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300"></span>{k.sektor}</td>;
                      case 'broj_radne_dozvole': return <td key={col.key} className="p-2">{k.broj_radne_dozvole}</td>;
                      case 'datum_kreiranja': return <td key={col.key} className="p-2">{k.datum_kreiranja}</td>;
                      case 'datum_azuriranja': return <td key={col.key} className="p-2">{k.datum_azuriranja}</td>;
                      default: return null;
                    }
                  })}
                  <td className="p-2 flex gap-2">
                    <button 
                      className="text-indigo-600 hover:bg-indigo-50 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      onClick={() => onView(k.id)}
                      title="Pogledaj detalje"
                    >
                      <span className="material-icons">visibility</span>
                    </button>
                    <button 
                      className="text-gray-600 hover:bg-gray-100 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500" 
                      onClick={() => onMore(k.id)}
                      title="Više opcija"
                    >
                      <span className="material-icons">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Broj redova:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Ukupno stavki: <span className="font-medium">{korisnici.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
              Prethodna
            </button>
            <button className="border border-blue-500 bg-blue-500 text-white rounded px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
              1
            </button>
            <button className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
              Sledeća
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default KorisniciTable; 