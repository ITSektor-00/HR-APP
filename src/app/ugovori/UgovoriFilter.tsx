import React, { useState } from 'react';

export type UgovoriFilterValues = {
  broj_ugovora?: string;
  korisnik?: string;
  tip_ugovora?: string;
  status?: string;
  datum_pocetka?: string;
  datum_zavrsetka?: string;
  napomena?: string;
  datum_kreiranja?: string;
  datum_azuriranja?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onFilter: (values: UgovoriFilterValues) => void;
  initialValues?: UgovoriFilterValues;
  tipoviUgovora?: string[];
  statusi?: string[];
};

export default function UgovoriFilter({ open, onClose, onFilter, initialValues = {}, tipoviUgovora = [], statusi = [] }: Props) {
  const [values, setValues] = useState<UgovoriFilterValues>(initialValues);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(values);
    onClose();
  };

  const handleReset = () => {
    setValues({});
    onFilter({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Broj ugovora</label>
            <input name="broj_ugovora" value={values.broj_ugovora || ''} onChange={handleChange} className="w-full border rounded p-2" placeholder="Pretraga..." />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Korisnik</label>
            <input name="korisnik" value={values.korisnik || ''} onChange={handleChange} className="w-full border rounded p-2" placeholder="Ime ili prezime" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Tip ugovora</label>
            <select name="tip_ugovora" value={values.tip_ugovora || ''} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Svi</option>
              {tipoviUgovora.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select name="status" value={values.status || ''} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Svi</option>
              {statusi.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Datum početka</label>
            <input type="date" name="datum_pocetka" value={values.datum_pocetka || ''} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Datum završetka</label>
            <input type="date" name="datum_zavrsetka" value={values.datum_zavrsetka || ''} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Napomena</label>
            <input name="napomena" value={values.napomena || ''} onChange={handleChange} className="w-full border rounded p-2" placeholder="Pretraga..." />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Datum kreiranja</label>
            <input type="date" name="datum_kreiranja" value={values.datum_kreiranja || ''} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Datum ažuriranja</label>
            <input type="date" name="datum_azuriranja" value={values.datum_azuriranja || ''} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={handleReset} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700">Poništi</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Primeni filtere</button>
        </div>
      </form>
    </div>
  );
} 