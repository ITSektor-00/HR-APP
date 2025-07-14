import React from 'react';

interface ColumnsMenuProps {
  open: boolean;
  onClose: () => void;
  visibleColumns: string[];
  onToggleColumn: (col: string) => void;
  columnOrder: string[];
  onOrderChange: (order: string[]) => void;
}

const ALL_COLUMNS = [
  'naziv_ugovora',
  'opis',
  'datum_pocetka',
  'datum_zavrsetka',
  'status',
  'uslovi',
  'vrsta_ugovora',
  'dokument',
  'datum_kreiranja',
  'datum_azuriranja',
  'ime',
  'prezime',
];

export default function ColumnsMenu({ open, onClose, visibleColumns, onToggleColumn, columnOrder, onOrderChange }: ColumnsMenuProps) {
  if (!open) return null;

  const handleOrderChange = (idx: number, dir: 'up' | 'down') => {
    const newOrder = [...columnOrder];
    if (dir === 'up' && idx > 0) {
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    } else if (dir === 'down' && idx < newOrder.length - 1) {
      [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
    }
    onOrderChange(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Prikaži/sakrij kolone</h2>
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
          {ALL_COLUMNS.map((col, idx) => (
            <div key={col} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={visibleColumns.includes(col)}
                onChange={() => onToggleColumn(col)}
              />
              <span className="flex-1 text-sm">{col.replace(/_/g, ' ')}</span>
              <button disabled={idx === 0} onClick={() => handleOrderChange(idx, 'up')} className="px-1 text-gray-500 disabled:opacity-30">↑</button>
              <button disabled={idx === ALL_COLUMNS.length - 1} onClick={() => handleOrderChange(idx, 'down')} className="px-1 text-gray-500 disabled:opacity-30">↓</button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Zatvori</button>
        </div>
      </div>
    </div>
  );
} 