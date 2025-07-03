import React, { useState, useEffect, useRef } from 'react';

const ALL_COLUMNS = [
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

type ColumnsMenuProps = {
  open: boolean;
  onClose: () => void;
  selected: string[];
  onChange: (cols: string[]) => void;
};

export default function ColumnsMenu({ open, onClose, selected, onChange }: ColumnsMenuProps) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [columns, setColumns] = useState(ALL_COLUMNS.map(c => c.key));
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setColumns(ALL_COLUMNS.map(c => c.key));
  }, [selected]);

  // Auto-focus input when menu opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open, onClose]);

  const handleToggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((c) => c !== key));
    } else {
      onChange([...selected, key]);
    }
  };
  const handleAll = () => onChange(ALL_COLUMNS.map((c) => c.key));
  const handleNone = () => onChange([]);

  if (!open) return null;
  // Filtriraj kolone po pretrazi
  const filtered = ALL_COLUMNS.filter(col => col.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={menuRef} className="absolute top-full left-0 mt-1 z-50 min-w-64 max-w-xs sm:max-w-sm bg-white shadow-lg border border-gray-200 rounded-lg p-3" role="menu" aria-label="Izbor kolona">
      <input
        ref={inputRef}
        className="w-full border border-gray-300 rounded px-2 py-1 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Pretraga kolona..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Pretraga kolona"
      />
      <div className="max-h-48 overflow-y-auto mb-3 space-y-1" role="group" aria-label="Lista kolona">
        {filtered.map((col, idx) => (
          <div
            key={col.key}
            className="flex items-center gap-2 group px-2 py-1 rounded hover:bg-gray-50"
            draggable
            onDragStart={() => setDraggedIdx(idx)}
            onDragOver={e => { e.preventDefault(); if (draggedIdx !== null && draggedIdx !== idx) {
              const newOrder = [...columns];
              const [removed] = newOrder.splice(draggedIdx, 1);
              newOrder.splice(idx, 0, removed);
              setDraggedIdx(idx);
              setColumns(newOrder);
            }}}
            onDragEnd={() => { setDraggedIdx(null); onChange(columns); }}
            style={{ opacity: draggedIdx === idx ? 0.5 : 1 }}
            tabIndex={0}
            role="menuitemcheckbox"
            aria-checked={selected.includes(col.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle(col.key);
              }
            }}
          >
            {/* Switch dugme */}
            <button
              type="button"
              className={`w-6 h-3 rounded-full flex items-center transition-colors duration-200 ${selected.includes(col.key) ? 'bg-blue-600' : 'bg-gray-300'}`}
              onClick={() => handleToggle(col.key)}
              aria-pressed={selected.includes(col.key)}
              aria-label={`${selected.includes(col.key) ? 'Sakrij' : 'Prikaži'} kolonu ${col.label}`}
            >
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full bg-white shadow transform transition-transform duration-200 ${selected.includes(col.key) ? 'translate-x-3' : 'translate-x-0.5'}`}
              />
            </button>
            <span className="flex-1 text-sm select-none truncate">{col.label}</span>
            <span className="text-gray-400 group-hover:text-gray-600 cursor-move text-xs flex-shrink-0" aria-label="Prevucite za promenu redosleda">≡</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t border-gray-200 gap-2">
        <div className="w-full flex flex-row justify-between">
          <button 
            onClick={handleAll} 
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Prikaži sve
          </button>
          <button 
            onClick={handleNone} 
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Sakrij sve
          </button>
        </div>
      </div>
    </div>
  );
} 