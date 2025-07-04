"use client";
import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import UrediKorisnikModal from './UrediKorisnikModal';

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
  loading?: boolean;
  visibleColumns: string[];
  selectedIds: number[];
  onSelect: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  page?: number;
  rowsPerPage?: number;
}

const COLUMN_CONFIG = [
  { key: 'rb', label: 'RB' },
  { key: 'korisnik', label: 'Korisnik' },
  { key: 'uloga', label: 'Uloga' },
  { key: 'pristup', label: 'Pristup' },
  { key: 'broj_radne_dozvole', label: 'Broj radne dozvole' },
  { key: 'pozicija', label: 'Pozicija' },
  { key: 'status_zaposlenja', label: 'Status zaposlenja' },
  { key: 'vrsta_zaposlenja', label: 'Vrsta zaposlenja' },
  { key: 'sektor', label: 'Sektor' },
  { key: 'datum_pocetka', label: 'Datum početka zaposlenja' },
  { key: 'datum_zavrsetka', label: 'Datum završetka zaposlenja' },
  { key: 'datum_kreiranja', label: 'Datum kreiranja' },
  { key: 'datum_azuriranja', label: 'Datum ažuriranja' },
];

const SEKTORI = [
  { label: "Finansije", color: "#d1fae5" },
  { label: "Informacione tehnologije", color: "#fecaca" },
  { label: "Istraživanje i razvoj", color: "#bae6fd" },
  { label: "Ljudski resursi", color: "#c7d2fe" },
  { label: "Logistika", color: "#fef9c3" },
  { label: "Marketing", color: "#a7f3d0" },
  { label: "Prodaja", color: "#fca5a5" },
  { label: "Proizvodnja", color: "#a5b4fc" },
];

function formatDatum(datum?: string) {
  if (!datum) return '';
  try {
    const date = new Date(datum);
    if (isNaN(date.getTime())) return datum;
    return format(date, 'd.M.yyyy. HH:mm');
  } catch {
    return datum;
  }
}

function KebabMenu({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="text-gray-600 hover:bg-gray-100 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        onClick={() => setOpen((v) => !v)}
        title="Više opcija"
        type="button"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" fill="#888"/><circle cx="12" cy="12" r="2" fill="#888"/><circle cx="12" cy="19" r="2" fill="#888"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col py-1">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => { setOpen(false); onEdit(); }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M4 21h4.586a1 1 0 0 0 .707-.293l10.414-10.414a2 2 0 0 0 0-2.828l-2.172-2.172a2 2 0 0 0-2.828 0L4.293 15.707A1 1 0 0 0 4 16.414V21z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Uredi
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
            onClick={() => { setOpen(false); onDelete(); }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 7h12M9 7V5a3 3 0 0 1 6 0v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Izbriši
          </button>
        </div>
      )}
    </div>
  );
}

const KorisniciTable: React.FC<Props> = ({ korisnici, loading, visibleColumns, selectedIds, onSelect, onSelectAll, allSelected, page = 1, rowsPerPage = korisnici.length }) => {
  const [editKorisnik, setEditKorisnik] = useState<Korisnik | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleEdit = (korisnik: Korisnik) => {
    setEditKorisnik(korisnik);
    setShowEditModal(true);
  };
  const handleDelete = async (id: number) => {
    await fetch(`/api/zaposleni/korisnici?id=${id}`, { method: 'DELETE' });
    setDeleteId(null);
    window.location.reload();
  };
  const handleEditSave = async (data: Record<string, unknown>) => {
    if (!editKorisnik) return;
    await fetch(`/api/zaposleni/korisnici?id=${editKorisnik.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setShowEditModal(false);
    setEditKorisnik(null);
    window.location.reload();
  };

  return (
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
                    checked={allSelected}
                    onChange={e => onSelectAll(e.target.checked)}
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
              korisnici.map((k, idx) => (
                <tr key={k.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 hover:border-blue-400"
                        checked={selectedIds.includes(k.id)}
                        onChange={e => onSelect(k.id, e.target.checked)}
                    />
                  </td>
                  {COLUMN_CONFIG.filter(col => visibleColumns.includes(col.key)).map(col => {
                    if (col.key === 'rb') {
                      return <td key={col.key} className="p-2">{(page - 1) * rowsPerPage + idx + 1}</td>;
                    }
                    switch (col.key) {
                                              case 'korisnik':
                          return (
                            <td key={col.key} className="p-2 flex items-center gap-2">
                            {k.fotografija ? (
                              <Image
                                src={
                                  k.fotografija.startsWith('http')
                                    ? k.fotografija
                                    : k.fotografija.startsWith('/')
                                      ? k.fotografija
                                      : '/' + k.fotografija
                                }
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover"
                                width={32}
                                height={32}
                              />
                            ) : (
                                <span className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold text-white" style={{background:'#a5b4fc'}}>
                                  {(k.ime?.[0] || '').toUpperCase() + (k.prezime?.[0] || '').toUpperCase()}
                              </span>
                            )}
                            {k.ime} {k.prezime}
                          </td>
                        );
                        case 'uloga': return <td key={col.key} className="p-2">{k.uloga}</td>;
                        case 'pristup': return <td key={col.key} className="p-2">{k.pristup}</td>;
                        case 'broj_radne_dozvole': return <td key={col.key} className="p-2">{k.broj_radne_dozvole}</td>;
                        case 'pozicija': return <td key={col.key} className="p-2">{k.pozicija}</td>;
                      case 'status_zaposlenja': return <td key={col.key} className="p-2">{k.status_zaposlenja}</td>;
                      case 'vrsta_zaposlenja': return <td key={col.key} className="p-2">{k.vrsta_zaposlenja}</td>;
                        case 'sektor':
                          const sektorObj = SEKTORI.find(s => s.label === k.sektor);
                          return <td key={col.key} className="p-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{backgroundColor: sektorObj?.color || '#d1d5db'}}></span>{k.sektor}</td>;
                        case 'datum_pocetka': return <td key={col.key} className="p-2">{formatDatum(k.datum_pocetka)}</td>;
                        case 'datum_zavrsetka': return <td key={col.key} className="p-2">{formatDatum(k.datum_zavrsetka)}</td>;
                        case 'datum_kreiranja': return <td key={col.key} className="p-2">{formatDatum(k.datum_kreiranja)}</td>;
                        case 'datum_azuriranja': return <td key={col.key} className="p-2">{formatDatum(k.datum_azuriranja)}</td>;
                      default: return null;
                    }
                  })}
                  <td className="p-2 flex gap-2">
                      <Link
                        href={`/zaposleni/korisnici/${k.id}`}
                      className="text-indigo-600 hover:bg-indigo-50 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      title="Pogledaj detalje"
                    >
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#888" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2"/></svg>
                      </Link>
                      <KebabMenu onEdit={() => handleEdit(k)} onDelete={() => setDeleteId(k.id)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
          </div>
      )}
      {showEditModal && editKorisnik && (
        <UrediKorisnikModal
          open={showEditModal}
          onClose={() => { setShowEditModal(false); setEditKorisnik(null); }}
          onSave={handleEditSave}
          korisnik={{
            ime: editKorisnik.ime || '',
            prezime: editKorisnik.prezime || '',
            pol: '',
            datum_rodjenja: '',
            jmbg: '',
            adresa: '',
            mesto: '',
            grad: '',
            fotografija: editKorisnik.fotografija || '',
            email: editKorisnik.email || '',
            telefon: editKorisnik.telefon || '',
            pozicija: editKorisnik.pozicija || '',
            sektor: editKorisnik.sektor || '',
            status_zaposlenja: editKorisnik.status_zaposlenja || '',
            vrsta_zaposlenja: editKorisnik.vrsta_zaposlenja || '',
            broj_radne_dozvole: editKorisnik.broj_radne_dozvole || '',
            datum_pocetka: editKorisnik.datum_pocetka || '',
            datum_zavrsetka: editKorisnik.datum_zavrsetka || '',
            uloga: editKorisnik.uloga || '',
            pristup: editKorisnik.pristup || '',
            sifra: '',
            plata: '',
            period_plate: '',
          }}
        />
      )}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Brisanje korisnika</h2>
              <button onClick={() => setDeleteId(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
          </div>
            <div className="mb-6 text-gray-700">Da li ste sigurni da želite da obrišete ovog korisnika?</div>
            <div className="flex gap-2 justify-end">
              <button className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={() => handleDelete(deleteId)}>
                Izbriši
            </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition" onClick={() => setDeleteId(null)}>
                Otkaži
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default KorisniciTable; 