import React, { useState } from 'react';

const ALL_COLUMNS = [
  { key: 'id', label: 'Identifikator' },
  { key: 'naslov', label: 'Naslov' },
  { key: 'registracija', label: 'Registracija' }, // Dodaj ako imaš ovo polje u bazi, ili izbaci ako nemaš
  { key: 'opis', label: 'Opis' },
  { key: 'boja', label: 'Boja' },
  { key: 'proizvodjac', label: 'Proizvođač' },
  { key: 'komercijalna_oznaka', label: 'Komercijalna oznaka' },
  { key: 'broj_sasije', label: 'Broj šasije' },
  { key: 'godina_proizvodnje', label: 'Godina proizvodnje' },
  { key: 'datum_kreiranja', label: 'Datum kreiranja' },
  { key: 'datum_azuriranja', label: 'Datum ažuriranja' },
];

type ExportModalProps = {
  open: boolean;
  onClose: () => void;
  vozila: any[];
};

export default function ExportModal({ open, onClose, vozila }: ExportModalProps) {
  const [selectedCols, setSelectedCols] = useState<string[]>(ALL_COLUMNS.map(c => c.key));
  const [fileType] = useState('CSV');

  const handleToggle = (key: string) => {
    setSelectedCols(cols => cols.includes(key) ? cols.filter(c => c !== key) : [...cols, key]);
  };
  const handleAll = () => setSelectedCols(ALL_COLUMNS.map(c => c.key));
  const handleNone = () => setSelectedCols([]);

  const handleExport = () => {
    // Generiši CSV
    const header = ALL_COLUMNS.filter(c => selectedCols.includes(c.key)).map(c => c.label);
    const rows = vozila.map(v =>
      ALL_COLUMNS.filter(c => selectedCols.includes(c.key)).map(c => {
        // Ako nema polja (npr. registracija), stavi prazno
        return v[c.key] !== undefined ? v[c.key] : '';
      })
    );
    const csv = '\uFEFF' + [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vozila.csv';
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-80 max-w-full p-4 relative">
        <h2 className="text-lg font-bold mb-2">Izvoz</h2>
        <label className="block text-xs font-medium mb-1">Tip datoteke</label>
        <select className="w-full border rounded px-2 py-1 mb-3 text-sm bg-gray-100 cursor-not-allowed" value={fileType} disabled>
          <option value="CSV">CSV</option>
        </select>
        <div className="mb-2 text-xs font-semibold text-gray-700">Kolone</div>
        <div className="max-h-48 overflow-y-auto mb-2 space-y-1">
          {ALL_COLUMNS.map(col => (
            <label key={col.key} className="flex items-center gap-2 px-1 py-0.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedCols.includes(col.key)}
                onChange={() => handleToggle(col.key)}
                className="accent-blue-600 w-4 h-4 rounded"
              />
              <span className="text-sm">{col.label}</span>
            </label>
          ))}
        </div>
        <div className="flex flex-row justify-between mb-3">
          <button onClick={handleAll} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Prikaži sve</button>
          <button onClick={handleNone} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Sakrij sve</button>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleExport} className="flex-1 bg-[#3A3CA6] hover:bg-blue-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Potvrdi
          </button>
          <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Otkaži
          </button>
        </div>
      </div>
    </div>
  );
} 