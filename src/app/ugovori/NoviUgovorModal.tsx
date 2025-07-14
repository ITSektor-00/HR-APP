/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';

interface NoviUgovorModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (ugovor: any) => void;
}

interface KorisnikOption {
  id: number;
  ime: string;
  prezime: string;
}

const initialForm = {
  naziv_ugovora: '',
  opis: '',
  datum_pocetka: '',
  datum_zavrsetka: '',
  status: '',
  uslovi: '',
  vrsta_ugovora: '',
  dokument: '',
  korisnik_id: '',
};

const NoviUgovorModal: React.FC<NoviUgovorModalProps> = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState(initialForm);
  const [korisnici, setKorisnici] = useState<KorisnikOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setError(null);
      fetchKorisnici();
    }
  }, [open]);

  const fetchKorisnici = async () => {
    const res = await fetch('/api/zaposleni/korisnici');
    const data = await res.json();
    setKorisnici(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.naziv_ugovora || !form.korisnik_id || !form.datum_pocetka) {
      setError('Naziv ugovora, korisnik i datum početka su obavezni!');
      return;
    }
    onAdd(form);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Novi ugovor</h2>
        {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Naziv ugovora *</label>
          <input name="naziv_ugovora" value={form.naziv_ugovora} onChange={handleChange} className="w-full border rounded p-2" required />
            </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Opis</label>
          <textarea name="opis" value={form.opis} onChange={handleChange} className="w-full border rounded p-2" />
                        </div>
        <div className="mb-3 flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Datum početka *</label>
            <input type="date" name="datum_pocetka" value={form.datum_pocetka} onChange={handleChange} className="w-full border rounded p-2" required />
                        </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Datum završetka</label>
            <input type="date" name="datum_zavrsetka" value={form.datum_zavrsetka} onChange={handleChange} className="w-full border rounded p-2" />
                        </div>
                      </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Status</label>
          <input name="status" value={form.status} onChange={handleChange} className="w-full border rounded p-2" />
                    </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Uslovi</label>
          <textarea name="uslovi" value={form.uslovi} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Vrsta ugovora</label>
          <input name="vrsta_ugovora" value={form.vrsta_ugovora} onChange={handleChange} className="w-full border rounded p-2" />
                  </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Dokument</label>
          <input name="dokument" value={form.dokument} onChange={handleChange} className="w-full border rounded p-2" />
                  </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Korisnik *</label>
          <select name="korisnik_id" value={form.korisnik_id} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">Izaberi korisnika</option>
            {korisnici.map(k => (
              <option key={k.id} value={k.id}>{k.ime} {k.prezime}</option>
            ))}
                  </select>
                </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Otkaži</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sačuvaj</button>
        </div>
      </form>
      </div>
  );
};

export default NoviUgovorModal; 