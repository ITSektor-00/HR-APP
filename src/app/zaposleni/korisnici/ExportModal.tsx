import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const ALL_COLUMNS = [
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

type ExportModalProps = {
  open: boolean;
  onClose: () => void;
  onExport: (columns: string[], fileType: string) => void;
  defaultColumns?: string[];
};

export default function ExportModal({ open, onClose, onExport, defaultColumns }: ExportModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(defaultColumns || ALL_COLUMNS.map((c) => c.key));
  const [fileType, setFileType] = useState<string>('CSV');

  const handleToggle = (key: string) => {
    setSelectedColumns((cols) =>
      cols.includes(key) ? cols.filter((c) => c !== key) : [...cols, key]
    );
  };

  const handleExport = () => {
    onExport(selectedColumns, fileType);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80">
        <h2 className="text-lg font-bold mb-4">Izvoz</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Tip datoteke</label>
          <select value={fileType} onChange={e => setFileType(e.target.value)} className="w-full border rounded p-2">
            <option value="CSV">CSV</option>
          </select>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-sm mb-1">Kolone</div>
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            {ALL_COLUMNS.map(col => (
              <label key={col.key} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col.key)}
                  onChange={() => handleToggle(col.key)}
                />
                {col.label}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="default" onClick={handleExport}>Potvrdi</Button>
          <Button variant="outline" onClick={onClose}>Otkaži</Button>
        </div>
      </div>
    </div>
  );
} 