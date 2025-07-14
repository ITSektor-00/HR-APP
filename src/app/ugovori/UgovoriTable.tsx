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
import UrediUgovorModal from './UrediUgovorModal';
import EditableCell from './EditableCell';
import EditStavkaModal from './EditStavkaModal';
import DeleteStavkaConfirm from './DeleteStavkaConfirm';
import ReactDOM from 'react-dom';
import ResizeHandle from './ResizeHandle';

// 1. Interfejs Ugovor - koristi zaposleni kao objekat
interface Ugovor {
  id: number;
  zaposleni: {
    ime: string;
    prezime: string;
    fotografija?: string;
  };
  vrsta_ugovora: string;
  broj_ugovora: string;
  dokument: string;
  status: string;
  uslovi: string;
  napomena: string;
  datum_pocetka: string;
  datum_zavrsetka: string;
  datum_kreiranja: string;
  datum_azuriranja: string;
  [key: string]: any;
}

interface UgovoriTableProps {
  ugovori: Ugovor[];
  visibleColumns: string[];
  columnOrder: string[];
  onToggleColumn: (column: string) => void;
  onOrderChange: (updaterOrValue: string[] | ((old: string[]) => string[])) => void;
  selectedIds?: number[];
  onSelect?: (id: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  loading?: boolean;
  onEdit?: (ugovor: Ugovor) => void;
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

const COLUMN_LABELS: Record<string, string> = {
  broj_ugovora: 'Broj ugovora',
  korisnik: 'Korisnik',
  tip_ugovora: 'Tip ugovora',
  status: 'Status',
  datum_pocetka: 'Datum početka',
  datum_zavrsetka: 'Datum završetka',
  napomena: 'Napomena',
  datum_kreiranja: 'Datum kreiranja',
  datum_azuriranja: 'Datum ažuriranja',
};

const DEFAULT_COLUMNS = [
  "broj_ugovora", "korisnik", "tip_ugovora", "status",
  "datum_pocetka", "datum_zavrsetka", "napomena", "datum_kreiranja", "datum_azuriranja"
];

export default function UgovoriTable({
  ugovori,
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
  columnsOpen = false, // NOVO
  filterOpen = false,  // NOVO
}: UgovoriTableProps & { columnsOpen?: boolean, filterOpen?: boolean }) {
  const [sorting, setSorting] = useState<Array<{id: string, desc: boolean}>>([]);
  const [menuOpenRow, setMenuOpenRow] = useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [menuPopupPos, setMenuPopupPos] = useState<{top: number, left: number, showAbove: boolean}>({top: 0, left: 0, showAbove: false});
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [openHeaderMenu, setOpenHeaderMenu] = useState<string | null>(null);
  const [headerMenuHover, setHeaderMenuHover] = useState<string | null>(null);
  const headerMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const [editModal, setEditModal] = useState<{row: unknown, column: unknown, value: string, ugovor?: Ugovor} | null>(null);
  const [deleteModal, setDeleteModal] = useState<{row: unknown, column: unknown, value: string} | null>(null);
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});

  // Dodaj lokalno stanje za širinu kolona i resize
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const [ghostX, setGhostX] = useState<number | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number | null>(null);
  const [resizeStartWidth, setResizeStartWidth] = useState<number | null>(null);

  // Funkcija za start resize-a
  function handleResizeStart(colId: string, startX: number, startWidth: number) {
    setResizingCol(colId);
    setResizeStartX(startX);
    setResizeStartWidth(startWidth);
    setGhostX(startX);
  }
  // Funkcija za resize
  function handleResize(deltaX: number) {
    if (resizeStartX !== null && resizingCol && resizeStartWidth !== null) {
      setGhostX(resizeStartX + deltaX);
    }
  }
  // Funkcija za kraj resize-a
  function handleResizeEnd() {
    if (resizingCol && resizeStartX !== null && ghostX !== null && resizeStartWidth !== null) {
      const newWidth = Math.max(80, resizeStartWidth + (ghostX - resizeStartX));
      setColumnWidths((prev) => ({ ...prev, [resizingCol]: newWidth }));
      setColumnSizing((prev: any) => ({ ...prev, [resizingCol]: newWidth })); // NOVO: ažuriraj react-table state
    }
    setResizingCol(null);
    setGhostX(null);
    setResizeStartX(null);
    setResizeStartWidth(null);
  }

  visibleColumns = (visibleColumns && visibleColumns.length > 0) ? visibleColumns : DEFAULT_COLUMNS;
  columnOrder = (columnOrder && columnOrder.length > 0) ? columnOrder : DEFAULT_COLUMNS;

  // U columns definiciji koristi camelCase ključeve i COLUMN_LABELS za header
  const columns = useMemo(() => [
    ...(columnOrder ?? []).map((key) => ({
      accessorKey: key,
      enableSorting: true,
      enableResizing: true,
      size: 160,
      minSize: 80,
      maxSize: 400,
      cell: (info: {row: {original: Ugovor}}) => {
        const u = info.row.original;
        switch (key) {
          case 'zaposleni':
            return (
              <span className="flex items-center gap-2">
                {u.zaposleni?.fotografija && !u.zaposleni.fotografija.includes('default-user.jpg') && u.zaposleni.fotografija.trim() !== '' ? (
                  <Image
                    src={u.zaposleni.fotografija}
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover"
                    width={24}
                    height={24}
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-indigo-400">
                    {(u.zaposleni?.ime?.[0] || '').toUpperCase() + (u.zaposleni?.prezime?.[0] || '').toUpperCase()}
                  </span>
                )}
                <span className="whitespace-nowrap">{`${u.zaposleni?.ime || ''} ${u.zaposleni?.prezime || ''}`.trim()}</span>
              </span>
            );
          case 'datum_pocetka':
            return formatDatumBezVremena(u.datum_pocetka);
          case 'datum_zavrsetka':
            return formatDatumBezVremena(u.datum_zavrsetka);
          case 'datum_kreiranja':
            return formatDatum(u.datum_kreiranja);
          case 'datum_azuriranja':
            return formatDatum(u.datum_azuriranja);
          default:
            return u[key];
        }
      },
      header: COLUMN_LABELS[key] || key,
    })),
  ], [columnOrder]);

  const table = useReactTable({
    data: ugovori,
    columns,
    state: {
      sorting,
      columnOrder,
      columnVisibility: Object.fromEntries((columnOrder ?? []).map(k => [k, visibleColumns.includes(k)])),
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        onOrderChange((updaterOrValue as (old: string[]) => string[])(columnOrder));
      } else {
        onOrderChange(updaterOrValue);
      }
    },
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  });

  // Da li je bilo koji popup otvoren
  const anyPopupOpen = Boolean(openHeaderMenu || menuOpenRow || columnsOpen || filterOpen);

  return (
    <div className="relative">
      {loading ? (
        <div className="overflow-x-auto w-full border-t border-l border-r border-gray-300 rounded-t-xl animate-pulse">
          <table className="min-w-full table-fixed border-collapse divide-y divide-gray-300">
            <thead>
              <tr className="bg-[#f5f6fa]">
                <th className="p-2 text-left font-medium text-gray-300 border-b border-gray-300 bg-[#f5f6fa] select-none w-8" style={{ minWidth: 40 }}>
                  <div className="h-4 w-4 bg-gray-200 rounded" />
                </th>
                {visibleColumns.map((col, idx) => (
                  <th key={col} className="p-2 text-left font-bold border-b border-gray-300 text-[13px] bg-[#f5f6fa] select-none">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </th>
                ))}
                <th className="p-2 text-center font-bold border-b border-gray-300 text-[13px] bg-[#f5f6fa] select-none" style={{ width: 80, minWidth: 80 }}>
                  <div className="h-4 w-12 bg-gray-200 rounded" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td className="p-2 w-8"><div className="h-4 w-4 bg-gray-100 rounded" /></td>
                  {visibleColumns.map((col, j) => (
                    <td key={j} className="p-2"><div className="h-4 w-24 bg-gray-100 rounded" /></td>
                  ))}
                  <td className="p-2 text-center"><div className="h-4 w-12 bg-gray-100 rounded" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto w-full border-t border-l border-r border-gray-300 rounded-t-xl">
          <table className="min-w-full table-fixed border-collapse divide-y divide-gray-300" style={{ tableLayout: 'auto' }}>
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
                      style={{
                        width: columnSizing[header.id] ? columnSizing[header.id] + 'px' : header.getSize() ? header.getSize() + 'px' : undefined,
                        minWidth: header.column.columnDef.minSize ? header.column.columnDef.minSize + 'px' : '80px',
                        maxWidth: header.column.columnDef.maxSize ? header.column.columnDef.maxSize + 'px' : undefined
                      }}
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
                                    {header.id === 'Datum početka' && (
                                      <button
                                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-[#5B2EFF] font-bold"
                                        onClick={() => {
                                          setOpenHeaderMenu(null);
                                          setHeaderMenuHover(null);
                                          if (onSortByNajskorijiPocetak) onSortByNajskorijiPocetak();
                                        }}
                                      >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#5B2EFF]"><path d="M12 4v16m0 0l-4-4m4 4l4-4" stroke="#5B2EFF" strokeWidth="2"/></svg>
                                        Najskoriji početak
                                      </button>
                                    )}
                                    {header.id === 'Datum završetka' && (
                                      <button
                                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-[#5B2EFF] font-bold"
                                        onClick={() => {
                                          setOpenHeaderMenu(null);
                                          setHeaderMenuHover(null);
                                          if (onSortByNajskorijiZavrsetak) onSortByNajskorijiZavrsetak();
                                        }}
                                      >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#5B2EFF]"><path d="M12 4v16m0 0l-4-4m4 4l4-4" stroke="#5B2EFF" strokeWidth="2"/></svg>
                                        Najskoriji završetak
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* Novi robustan resize handle */}
                        {header.column.getCanResize && header.column.getCanResize() && (
                          <ResizeHandle
                            onResizeStart={(startX) => handleResizeStart(header.id, startX, columnWidths[header.id] || header.getSize() || 160)}
                            onResize={handleResize}
                            onResizeEnd={handleResizeEnd}
                          />
                        )}
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
                      <p className="font-medium">Nema ugovora</p>
                      <p className="text-sm">Dodajte prvog ugovora da počnete</p>
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
                          style={{
                            width: columnSizing[cell.column.id] ? columnSizing[cell.column.id] + 'px' : cell.column.getSize() ? cell.column.getSize() + 'px' : undefined,
                            minWidth: cell.column.columnDef.minSize ? cell.column.columnDef.minSize + 'px' : '80px',
                            maxWidth: cell.column.columnDef.maxSize ? cell.column.columnDef.maxSize + 'px' : undefined
                          }}
                        >
                          {isEditable ? (
                            <EditableCell
                              value={flexRender(cell.column.columnDef.cell, cell.getContext())}
                              column={cell.column}
                              row={row}
                              onEdit={(row, column) => {
                                if (column.id === 'Zaposleni') {
                                  // Pripremi kompletan objekat za modal
                                  const ugovor = {
                                    id: row.original.id,
                                    broj_ugovora: row.original.broj_ugovora || '',
                                    zaposleni: {
                                      ime: row.original.zaposleni?.ime || '',
                                      prezime: row.original.zaposleni?.prezime || '',
                                      fotografija: row.original.zaposleni?.fotografija || '',
                                    },
                                    datum_pocetka: row.original.datum_pocetka || '',
                                    datum_zavrsetka: row.original.datum_zavrsetka || '',
                                    vrsta_ugovora: row.original.vrsta_ugovora || '',
                                    status: row.original.status || '',
                                    napomena: row.original.napomena || '',
                                    datum_kreiranja: row.original.datum_kreiranja || '',
                                    datum_azuriranja: row.original.datum_azuriranja || '',
                                    dokument: row.original.dokument || '',
                                    uslovi: row.original.uslovi || '',
                                  };
                                  setEditModal({ row, column, value: '', ugovor });
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
                          onClick={() => window.location.href = `/ugovori/${row.original.id}`}
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
                                  if (confirm('Da li ste sigurni da želite da obrišete ovog ugovora?')) {
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
      {editModal && editModal.ugovor && (
        <UrediUgovorModal
          open={!!editModal}
          onClose={() => setEditModal(null)}
          ugovor={{
            broj_ugovora: editModal.ugovor.broj_ugovora || '',
            korisnik_id: String(editModal.ugovor.zaposleni_id || ''),
            korisnik_ime: editModal.ugovor.zaposleni?.ime || '',
            korisnik_prezime: editModal.ugovor.zaposleni?.prezime || '',
            datum_pocetka: editModal.ugovor.datum_pocetka || '',
            datum_zavrsetka: editModal.ugovor.datum_zavrsetka || '',
            tip_ugovora: editModal.ugovor.vrsta_ugovora || '',
            status: editModal.ugovor.status || '',
            napomena: editModal.ugovor.napomena || '',
            datum_kreiranja: editModal.ugovor.datum_kreiranja || '',
            datum_azuriranja: editModal.ugovor.datum_azuriranja || '',
            dokument: editModal.ugovor.dokument || '',
            uslovi: editModal.ugovor.uslovi || '',
          }}
          onSave={async (data) => {
            // Sačuvaj izmenu ugovora u backendu
            if (editModal && editModal.ugovor) {
              await fetch(`/api/ugovori?id=${editModal.ugovor.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...data,
                  zaposleni_id: data.zaposleni_id,
                  zaposleni_ime: data.zaposleni_ime,
                  zaposleni_prezime: data.zaposleni_prezime,
                })
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
      {editModal && !editModal.ugovor && (
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
      {/* Ghost linija dok traje resize */}
      {resizingCol && ghostX !== null && (
        <div
          className="fixed top-0 bottom-0 w-0.5 bg-blue-500 z-[99999] pointer-events-none"
          style={{ left: ghostX + 'px' }}
        />
      )}
    </div>
  );
} 