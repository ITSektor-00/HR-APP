import React, { useState } from 'react';

export type KorisniciFilterValues = {
  zaposleni?: string;
  uloga?: string;
  pristup?: string;
  broj_radne_dozvole?: string;
  pozicija?: string;
  status_zaposlenja?: string;
  vrsta_zaposlenja?: string;
  sektor?: string;
  datum_pocetka?: string;
  datum_zavrsetka?: string;
  datum_kreiranja?: string;
  datum_azuriranja?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onFilter: (values: KorisniciFilterValues) => void;
  initialValues?: KorisniciFilterValues;
  uloge?: string[];
  pozicije?: string[];
  sektori?: string[];
  statusi?: string[];
  vrsteZaposlenja?: string[];
  pristupi?: string[];
};

export default function KorisniciFilter({ open, onClose, onFilter, initialValues = {}, uloge = [], pozicije = [], sektori = [], statusi = [], vrsteZaposlenja = [], pristupi = [] }: Props) {
  const [values, setValues] = useState<KorisniciFilterValues>(initialValues);

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
                    <label className="block text-sm font-semibold mb-1">Zaposleni</label>
        <input name="zaposleni" value={values.zaposleni || ''} onChange={handleChange} className="w-full border rounded p-2" placeholder="Ime ili prezime" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Uloga</label>
            <select name="uloga" value={values.uloga || ''} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Sve</option>
              {uloge.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Pristup</label>
            <select name="pristup" value={values.pristup || ''} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Sve</option>
              {pristupi.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Broj radne dozvole</label>
            <input name="broj_radne_dozvole" value={values.broj_radne_dozvole || ''} onChange={handleChange} className="w-full border rounded p-2" placeholder="Pretraga..." />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Pozicija</label>
            <select name="pozicija" value={values.pozicija || ''} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Sve</option>
              {pozicije.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Status zaposlenja</label>
            <select name="status_zaposlenja" value={values.status_zaposlenja || ''} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Svi</option>
              {statusi.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Vrsta zaposlenja</label>
            <select name="vrsta_zaposlenja" value={values.vrsta_zaposlenja || ''} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Sve</option>
              {vrsteZaposlenja.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Sektor</label>
            <select name="sektor" value={values.sektor || ''} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Svi</option>
              {sektori.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Datum početka zaposlenja</label>
            <input type="date" name="datum_pocetka" value={values.datum_pocetka || ''} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-1">Datum završetka zaposlenja</label>
            <input type="date" name="datum_zavrsetka" value={values.datum_zavrsetka || ''} onChange={handleChange} className="w-full border rounded p-2" />
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