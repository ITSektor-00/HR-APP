"use client";
import React, { useState, useMemo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Image from 'next/image';
import { format } from 'date-fns';
import UrediKorisnikModal from './UrediKorisnikModal';
import EditableCell from './EditableCell';
import EditStavkaModal from './EditStavkaModal';
import DeleteStavkaConfirm from './DeleteStavkaConfirm';
import ReactDOM from 'react-dom';

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
  sifra?: string;
  plata?: string;
  period_plate?: string;
  valuta?: string;
  datum_rodjenja?: string;
  [key: string]: string | number | undefined;
}

interface KorisniciTableProps {
  korisnici: Korisnik[];
  visibleColumns: string[];
  columnOrder: string[];
  onToggleColumn: (column: string) => void;
  onOrderChange: (updaterOrValue: string[] | ((old: string[]) => string[])) => void;
  selectedIds?: number[];
  onSelect?: (id: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  loading?: boolean;
  onEdit?: (korisnik: Korisnik) => void;
  onDelete?: (id: number) => void;
  onSortByName?: () => void;
  onSortByNajskorijiPocetak?: () => void;
  onSortByNajskorijiZavrsetak?: () => void;
}

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

function formatDatumBezVremena(datum?: string) {
  if (!datum) return '';
  try {
    const date = new Date(datum);
    if (isNaN(date.getTime())) return datum;
    return date.toLocaleDateString('sr-RS');
  } catch {
    return datum;
  }
}

const columnLabels: Record<string, string> = {
  korisnik: 'Korisnik',
  uloga: 'Uloga',
  pristup: 'Pristup',
  broj_radne_dozvole: 'Broj radne dozvole',
  pozicija: 'Pozicija',
  status_zaposlenja: 'Status zaposlenja',
  vrsta_zaposlenja: 'Vrsta zaposlenja',
  sektor: 'Sektor',
  datum_pocetka: 'Datum početka zaposlenja',
  datum_zavrsetka: 'Datum završetka zaposlenja',
  datum_kreiranja: 'Datum kreiranja',
  datum_azuriranja: 'Datum ažuriranja',
};

const DEFAULT_COLUMNS = [
  "korisnik", "uloga", "pristup", "broj_radne_dozvole", "pozicija",
  "status_zaposlenja", "vrsta_zaposlenja", "sektor",
  "datum_pocetka", "datum_zavrsetka", "datum_kreiranja", "datum_azuriranja"
];

export default function KorisniciTable({
  korisnici,
  visibleColumns,
  columnOrder,
  onToggleColumn,
  onOrderChange,
  selectedIds = [],
  onSelect = () => {},
  onSelectAll = () => {},
  allSelected = false,
  loading,
  onEdit = () => {},
  onDelete = () => {},
  onSortByName,
  onSortByNajskorijiPocetak,
  onSortByNajskorijiZavrsetak,
}: KorisniciTableProps) {
  const [sorting, setSorting] = useState<Array<{id: string, desc: boolean}>>([]);
  const [menuOpenRow, setMenuOpenRow] = useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [menuPopupPos, setMenuPopupPos] = useState<{top: number, left: number, showAbove: boolean}>({top: 0, left: 0, showAbove: false});
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [openHeaderMenu, setOpenHeaderMenu] = useState<string | null>(null);
  const [headerMenuHover, setHeaderMenuHover] = useState<string | null>(null);
  const headerMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const [editModal, setEditModal] = useState<{row: unknown, column: unknown, value: string, korisnik?: Korisnik} | null>(null);
  const [deleteModal, setDeleteModal] = useState<{row: unknown, column: unknown, value: string} | null>(null);

  visibleColumns = (visibleColumns && visibleColumns.length > 0) ? visibleColumns : DEFAULT_COLUMNS;
  columnOrder = (columnOrder && columnOrder.length > 0) ? columnOrder : DEFAULT_COLUMNS;

  const columns = useMemo(() => [
    ...(columnOrder ?? []).map((key) => ({
      accessorKey: key,
      enableSorting: true,
      enableResizing: true,
      size: 160,
      minSize: 80,
      maxSize: 400,
      cell: (info: {row: {original: Korisnik}}) => {
        const k = info.row.original;
        switch (key) {
          case 'korisnik':
            return (
              <span className="flex items-center gap-2">
                {k.fotografija && !k.fotografija.includes('default-user.jpg') && k.fotografija.trim() !== '' ? (
                  <Image
                    src={k.fotografija}
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover"
                    width={24}
                    height={24}
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-indigo-400">
                    {(k.ime?.[0] || '').toUpperCase() + (k.prezime?.[0] || '').toUpperCase()}
                  </span>
                )}
                <span className="whitespace-nowrap">{`${k.ime || ''} ${k.prezime || ''}`.trim()}</span>
              </span>
            );
          case 'uloga':
            return k.uloga;
          case 'pristup':
            return k.pristup;
          case 'broj_radne_dozvole':
            return k.broj_radne_dozvole;
          case 'pozicija':
            return k.pozicija;
          case 'status_zaposlenja':
            return k.status_zaposlenja;
          case 'vrsta_zaposlenja':
            return k.vrsta_zaposlenja;
          case 'sektor':
            const sektorObj = SEKTORI.find(s => s.label === k.sektor);
            return <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{backgroundColor: sektorObj?.color || '#d1d5db'}}></span>{k.sektor}</span>;
          case 'datum_pocetka':
            return formatDatumBezVremena(k.datum_pocetka);
          case 'datum_zavrsetka':
            return formatDatumBezVremena(k.datum_zavrsetka);
          case 'datum_kreiranja':
            return formatDatum(k.datum_kreiranja);
          case 'datum_azuriranja':
            return formatDatum(k.datum_azuriranja);
          default:
            return k[key as keyof Korisnik] as string;
        }
      },
      header: key === 'datum_pocetka' ? 'Datum početka zaposlenja' : key === 'datum_zavrsetka' ? 'Datum završetka zaposlenja' : (columnLabels[key] || key),
    })),
  ], [columnOrder]);

  const table = useReactTable({
    data: korisnici,
    columns,
    state: {
      sorting,
      columnOrder,
      columnVisibility: Object.fromEntries((columnOrder ?? []).map(k => [k, visibleColumns.includes(k)])),
    },
    onSortingChange: setSorting,
    onColumnOrderChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        onOrderChange((updaterOrValue as (old: string[]) => string[])(columnOrder));
      } else {
        onOrderChange(updaterOrValue);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  });

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
        <div className="overflow-x-auto w-full border-t border-l border-r border-gray-300 rounded-t-xl">
          <table className="min-w-full divide-y divide-gray-300 border-separate border-spacing-0">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-[#f5f6fa]">
                  {/* Checkbox za selektovanje svih */}
                  <th className="p-2 text-left font-medium text-gray-700 border-b border-gray-300 bg-[#f5f6fa] select-none w-8" style={{ minWidth: 40 }}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={e => onSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  {headerGroup.headers.map((header, idx) => (
                    <th
                      key={header.id}
                      className="p-2 text-left font-bold text-gray-700 relative group border-b border-gray-300 text-[13px] bg-[#f5f6fa] select-none"
                      style={{ width: header.getSize(), minWidth: 80 }}
                    >
                      <div
                        className={`flex items-center gap-2 relative w-full group ${idx === 0 ? 'pr-10' : 'pr-10'}`}
                        onMouseEnter={() => setHoveredCol(header.id)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <div className="relative flex items-center">
                          <span className="font-bold">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                        </div>
                        {/* Kebab meni u headeru kolone, sada i za prvu kolonu ali poseban stil */}
                        {(hoveredCol === header.id || openHeaderMenu === header.id || headerMenuHover === header.id) && (
                          <div
                            className={idx === 0 ? "absolute right-3 top-1/2 -translate-y-1/2 z-40" : "absolute right-3 top-1/2 -translate-y-1/2 z-40"}
                            onMouseEnter={() => {
                              if (headerMenuTimeout.current) clearTimeout(headerMenuTimeout.current);
                              setHeaderMenuHover(header.id);
                            }}
                            onMouseLeave={() => {
                              if (headerMenuTimeout.current) clearTimeout(headerMenuTimeout.current);
                              headerMenuTimeout.current = setTimeout(() => {
                                setHeaderMenuHover(null);
                                setOpenHeaderMenu(null);
                              }, 250);
                            }}
                          >
                            <button
                              className="p-1 rounded hover:bg-gray-200 focus:outline-none"
                              onClick={e => {
                                e.stopPropagation();
                                setOpenHeaderMenu(openHeaderMenu === header.id ? null : header.id);
                              }}
                            >
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="5" r="2" fill="#888"/>
                                <circle cx="12" cy="12" r="2" fill="#888"/>
                                <circle cx="12" cy="19" r="2" fill="#888"/>
                              </svg>
                            </button>
                            {openHeaderMenu === header.id && (
                              <div className={idx === 0 ? "absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 text-sm" : "absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 text-sm"}>
                                {/* Prva kolona: abecedno + sakrij kolonu, sortirano */}
                                {idx === 0 ? (
                                  <>
                                    <button
                                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-[#5B2EFF] font-bold"
                                      onClick={() => {
                                        setOpenHeaderMenu(null);
                                        setHeaderMenuHover(null);
                                        if (onSortByName) onSortByName();
                                      }}
                                    >
                                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#5B2EFF]"><path d="M7 7h10M7 12h7M7 17h4" stroke="#5B2EFF" strokeWidth="2"/><text x="2" y="22" fontSize="10" fill="#5B2EFF">A</text><text x="10" y="22" fontSize="10" fill="#5B2EFF">Z</text></svg>
                                      Poređaj abecedno
                                    </button>
                                    <button
                                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-[#5B2EFF] font-bold"
                                      onClick={() => {
                                        setOpenHeaderMenu(null);
                                        setHeaderMenuHover(null);
                                        if (onToggleColumn) onToggleColumn(header.column.id);
                                      }}
                                    >
                                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#5B2EFF]">
                                        <path d="M1 12C1 12 5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="#5B2EFF" strokeWidth="2"/>
                                        <circle cx="12" cy="12" r="3" stroke="#5B2EFF" strokeWidth="2"/>
                                      </svg>
                                      Sakrij kolonu
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {/* Pomeri ulevo, ali samo ako ova kolona nije odmah desno od 'korisnik' */}
                                    {columnOrder.indexOf(header.column.id) > 1 && columnOrder[columnOrder.indexOf(header.column.id) - 1] !== 'korisnik' && (
                                      <button
                                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-[#5B2EFF] font-bold"
                                        onClick={() => {
                                          setOpenHeaderMenu(null);
                                          setHeaderMenuHover(null);
                                          const idx2 = columnOrder.indexOf(header.column.id);
                                          if (idx2 > 0) {
                                            const newOrder = [...columnOrder];
                                            [newOrder[idx2-1], newOrder[idx2]] = [newOrder[idx2], newOrder[idx2-1]];
                                            onOrderChange(newOrder);
                                          }
                                        }}
                                      >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#5B2EFF]"><path d="M15 19l-7-7 7-7" stroke="#5B2EFF" strokeWidth="2"/></svg>
                                        Pomeri ulevo
                                      </button>
                                    )}
                                    {/* Pomeri udesno */}
                                    <button
                                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-[#5B2EFF] font-bold"
                                      onClick={() => {
                                        setOpenHeaderMenu(null);
                                        setHeaderMenuHover(null);
                                        const idx2 = columnOrder.indexOf(header.column.id);
                                        if (idx2 < columnOrder.length - 1) {
                                          const newOrder = [...columnOrder];
                                          [newOrder[idx2+1], newOrder[idx2]] = [newOrder[idx2], newOrder[idx2+1]];
                                          onOrderChange(newOrder);
                                        }
                                      }}
                                    >
                                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#5B2EFF]">
                                        <path d="M9 5l7 7-7 7" stroke="#5B2EFF" strokeWidth="2"/>
                                      </svg>
                                      Pomeri udesno
                                    </button>
                                    {/* Sakrij kolonu */}
                                    <button
                                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-[#5B2EFF] font-bold"
                                      onClick={() => {
                                        setOpenHeaderMenu(null);
                                        setHeaderMenuHover(null);
                                        if (onToggleColumn) onToggleColumn(header.column.id);
                                      }}
                                    >
                                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#5B2EFF]">
                                        <path d="M1 12C1 12 5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="#5B2EFF" strokeWidth="2"/>
                                        <circle cx="12" cy="12" r="3" stroke="#5B2EFF" strokeWidth="2"/>
                                      </svg>
                                      Sakrij kolonu
                                    </button>
                                    {header.id === 'datum_pocetka' && (
                                      <button
                                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-[#5B2EFF] font-bold"
                                        onClick={() => {
                                          setOpenHeaderMenu(null);
                                          setHeaderMenuHover(null);
                                          if (onSortByNajskorijiPocetak) onSortByNajskorijiPocetak();
                                        }}
                                      >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#5B2EFF]"><path d="M12 4v16m0 0l-4-4m4 4l4-4" stroke="#5B2EFF" strokeWidth="2"/></svg>
                                        Sortiraj od najskorijeg početka zaposlenja
                                      </button>
                                    )}
                                    {header.id === 'datum_zavrsetka' && (
                                      <button
                                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-[#5B2EFF] font-bold"
                                        onClick={() => {
                                          setOpenHeaderMenu(null);
                                          setHeaderMenuHover(null);
                                          if (onSortByNajskorijiZavrsetak) onSortByNajskorijiZavrsetak();
                                        }}
                                      >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#5B2EFF]"><path d="M12 4v16m0 0l-4-4m4 4l4-4" stroke="#5B2EFF" strokeWidth="2"/></svg>
                                        Sortiraj od najskorijeg završetka zaposlenja
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* Resize handle ili dekorativna linija - uvek isto pozicionirana i iste visine */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 right-0 h-6 w-3 flex items-center justify-center z-30"
                          style={{ pointerEvents: header.column.getCanResize && header.column.getCanResize() ? 'auto' : 'none' }}
                        >
                          <div
                            className={
                              `h-full w-1 rounded-full ${
                                (header.column.getCanResize && header.column.getCanResize())
                                  ? (hoveredCol === header.id ? 'bg-blue-500' : 'bg-gray-400')
                                  : 'bg-gray-200'
                              } transition-all`
                            }
                            style={{ cursor: header.column.getCanResize && header.column.getCanResize() ? 'col-resize' : 'default' }}
                            onMouseDown={header.column.getCanResize && header.column.getCanResize() ? header.getResizeHandler() : undefined}
                            onTouchStart={header.column.getCanResize && header.column.getCanResize() ? header.getResizeHandler() : undefined}
                          />
                        </div>
                      </div>
                      {/* Zatvori meni klikom van */}
                      {openHeaderMenu && (
                        <div className="fixed inset-0 z-30" onClick={() => { setOpenHeaderMenu(null); setHeaderMenuHover(null); }} />
                      )}
                    </th>
                  ))}
                  {/* Akcije kolona header */}
                  <th className="p-2 text-center font-bold text-gray-700 border-b border-gray-300 text-[13px] bg-[#f5f6fa] select-none" style={{ width: 80, minWidth: 80 }}>
                    Akcije
                  </th>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
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
                table.getRowModel().rows.map((row, idx, arr) => (
                  <tr key={row.id} className={idx !== arr.length - 1 ? "border-b" : ""}>
                    {/* Checkbox za selektovanje reda */}
                    <td className="p-2 w-8">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.original.id)}
                        onChange={e => onSelect(row.original.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    {row.getVisibleCells().map((cell) => {
                      // Ne prikazuj editable za checkbox i akcije kolonu
                      const isEditable = cell.column.id !== 'akcije' && cell.column.id !== 'select';
                      return (
                        <td
                          key={cell.id}
                          className="p-2 text-[13px] bg-white transition-all duration-300 overflow-visible text-ellipsis whitespace-nowrap relative group"
                          style={{ width: cell.column.getSize(), minWidth: 80 }}
                        >
                          {isEditable ? (
                            <EditableCell
                              value={flexRender(cell.column.columnDef.cell, cell.getContext())}
                              column={cell.column}
                              row={row}
                              onEdit={(row, column) => {
                                if (column.id === 'korisnik') {
                                  // Pripremi kompletan objekat za modal
                                  const korisnik = {
                                    id: row.original.id,
                                    ime: row.original.ime || '',
                                    prezime: row.original.prezime || '',
                                    pol: row.original.pol || '',
                                    datum_rodjenja: row.original.datum_rodjenja || '',
                                    jmbg: row.original.jmbg || '',
                                    adresa: row.original.adresa || '',
                                    mesto: row.original.mesto || '',
                                    grad: row.original.grad || '',
                                    fotografija: row.original.fotografija || '',
                                    email: row.original.email || '',
                                    telefon: row.original.telefon || '',
                                    pozicija: row.original.pozicija || '',
                                    sektor: row.original.sektor || '',
                                    status_zaposlenja: row.original.status_zaposlenja || '',
                                    vrsta_zaposlenja: row.original.vrsta_zaposlenja || '',
                                    broj_radne_dozvole: row.original.broj_radne_dozvole || '',
                                    datum_pocetka: row.original.datum_pocetka || '',
                                    datum_zavrsetka: row.original.datum_zavrsetka || '',
                                    uloga: row.original.uloga || '',
                                    pristup: row.original.pristup || '',
                                    sifra: row.original.sifra || '',
                                    plata: row.original.plata || '',
                                    period_plate: row.original.period_plate || '',
                                    valuta: row.original.valuta || '',
                                  };
                                  setEditModal({ row, column, value: '', korisnik });
                                } else {
                                  setEditModal({ row, column, value: row.original[column.id] || '' });
                                }
                              }}
                            />
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      );
                    })}
                    {/* Akcije kolona - stara logika */}
                    <td className="p-2 text-center bg-white" style={{ width: 80, minWidth: 80 }}>
                      <div className="flex items-center justify-center gap-1">
                        {/* Oko dugme za detalje */}
                        <button
                          className="p-1 rounded hover:bg-gray-100 focus:outline-none transition-colors"
                          title="Detalji"
                          onClick={() => window.location.href = `/zaposleni/korisnici/${row.original.id}`}
                        >
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#888" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2"/>
                          </svg>
                        </button>
                        
                        {/* Kebab meni */}
                        <div className="relative">
                          <button
                            className="p-1 rounded hover:bg-gray-100 focus:outline-none transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              const btn = e.currentTarget as HTMLButtonElement;
                              if (menuOpenRow === row.original.id) {
                                setMenuOpenRow(null);
                                setMenuAnchor(null);
                              } else {
                                setMenuOpenRow(row.original.id);
                                setMenuAnchor(btn);
                                // Izračunaj poziciju popup-a
                                const rect = btn.getBoundingClientRect();
                                const popupWidth = 180;
                                const popupHeight = 100;
                                const padding = 8;
                                let left = rect.left + rect.width / 2 - popupWidth / 2;
                                let top = rect.bottom + 2;
                                let showAbove = false;
                                if (left + popupWidth + padding > window.innerWidth) {
                                  left = window.innerWidth - popupWidth - padding;
                                }
                                if (left < padding) {
                                  left = padding;
                                }
                                if (top + popupHeight + padding > window.innerHeight) {
                                  top = rect.top - popupHeight - 2;
                                  showAbove = true;
                                }
                                if (top < padding) {
                                  top = padding;
                                }
                                setMenuPopupPos({top, left, showAbove});
                              }
                            }}
                            title="Više opcija"
                          >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                              <circle cx="12" cy="5" r="2" fill="#888"/>
                              <circle cx="12" cy="12" r="2" fill="#888"/>
                              <circle cx="12" cy="19" r="2" fill="#888"/>
                            </svg>
                          </button>
                          
                          {/* Portal popup meni */}
                          {menuOpenRow === row.original.id && menuAnchor && typeof window !== 'undefined' && ReactDOM.createPortal(
                            <div
                              className="bg-white border border-gray-200 rounded-md shadow-lg min-w-[140px] text-sm py-1 z-[9999]"
                              style={{
                                position: 'fixed',
                                top: menuPopupPos.top,
                                left: menuPopupPos.left,
                                width: 180,
                                boxShadow: '0 8px 32px 0 rgba(60,60,60,0.18)',
                              }}
                              onClick={e => e.stopPropagation()}
                            >
                              <button 
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left transition-colors"
                                onClick={() => {
                                  onEdit(row.original);
                                  setMenuOpenRow(null);
                                  setMenuAnchor(null);
                                }}
                              >
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#666" strokeWidth="2"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#666" strokeWidth="2"/>
                                </svg>
                                Uredi
                              </button>
                              <button 
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left transition-colors text-red-600"
                                onClick={() => {
                                  if (confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
                                    onDelete(row.original.id);
                                  }
                                  setMenuOpenRow(null);
                                  setMenuAnchor(null);
                                }}
                              >
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                  <path d="M3 6h18" stroke="#dc2626" strokeWidth="2"/>
                                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#dc2626" strokeWidth="2"/>
                                </svg>
                                Obriši
                              </button>
                            </div>,
                            document.body
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Zatvaranje menija kada se klikne van tabele */}
      {menuOpenRow && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => { setMenuOpenRow(null); setMenuAnchor(null); }}
        />
      )}
      {/* Modal za uređivanje stavke */}
      {editModal && editModal.korisnik && (
        <UrediKorisnikModal
          open={!!editModal}
          onClose={() => setEditModal(null)}
          korisnik={{
            ime: editModal.korisnik.ime || '',
            prezime: editModal.korisnik.prezime || '',
            pol: editModal.korisnik.pol || '',
            datum_rodjenja: editModal.korisnik.datum_rodjenja || '',
            jmbg: editModal.korisnik.jmbg || '',
            adresa: editModal.korisnik.adresa || '',
            mesto: editModal.korisnik.mesto || '',
            grad: editModal.korisnik.grad || '',
            fotografija: editModal.korisnik.fotografija || '',
            email: editModal.korisnik.email || '',
            telefon: editModal.korisnik.telefon || '',
            pozicija: editModal.korisnik.pozicija || '',
            sektor: editModal.korisnik.sektor || '',
            status_zaposlenja: editModal.korisnik.status_zaposlenja || '',
            vrsta_zaposlenja: editModal.korisnik.vrsta_zaposlenja || '',
            broj_radne_dozvole: editModal.korisnik.broj_radne_dozvole || '',
            datum_pocetka: editModal.korisnik.datum_pocetka || '',
            datum_zavrsetka: editModal.korisnik.datum_zavrsetka || '',
            uloga: editModal.korisnik.uloga || '',
            pristup: editModal.korisnik.pristup || '',
            sifra: editModal.korisnik.sifra || '',
            plata: editModal.korisnik.plata || '',
            period_plate: editModal.korisnik.period_plate || '',
            valuta: editModal.korisnik.valuta || '',
          }}
          onSave={async (data) => {
            // Sačuvaj izmenu korisnika u backendu
            if (editModal && editModal.korisnik) {
              await fetch(`/api/zaposleni/korisnici?id=${editModal.korisnik.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
            }
            setEditModal(null);
            // Osveži podatke u tabeli (GET)
            if (typeof window !== 'undefined') {
              window.location.reload(); // najjednostavnije, može i bolje sa state-om
            }
          }}
        />
      )}
      {editModal && !editModal.korisnik && (
        <EditStavkaModal
          open={!!editModal}
          onClose={() => setEditModal(null)}
          stavka={{ naslov: editModal.value, opis: '' }}
          onSave={() => {
            // TODO: Sačuvaj izmenu u backendu ili state-u
            setEditModal(null);
          }}
        />
      )}
      {/* Potvrda za brisanje stavke */}
      {deleteModal && (
        <DeleteStavkaConfirm
          open={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          naziv={deleteModal.value}
          onDelete={() => {
            // TODO: Izbriši stavku iz backend-a ili state-a
            setDeleteModal(null);
          }}
        />
      )}
    </div>
  );
} 