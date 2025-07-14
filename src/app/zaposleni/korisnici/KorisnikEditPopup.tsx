/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface KorisnikEditPopupProps {
  open: boolean;
  onClose: () => void;
  korisnik: {
    ime: string;
    prezime: string;
    email: string;
    telefon?: string;
    pol: string;
    datum_rodjenja: string;
    fotografija?: string;
  };
  onSave: (data: unknown) => void;
}

const polOptions = [
  { value: 'M', label: 'M' },
  { value: 'Z', label: 'Z' },
];

const KorisnikEditPopup: React.FC<KorisnikEditPopupProps> = ({ open, onClose, korisnik, onSave }) => {
  const [form, setForm] = useState({ ...korisnik });
  const [slika, setSlika] = useState<string | undefined>(korisnik.fotografija);
  const [datumRodjenja, setDatumRodjenja] = useState<Date | null>(korisnik.datum_rodjenja ? new Date(korisnik.datum_rodjenja) : null);
  const [success, setSuccess] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...korisnik });
      setSlika(korisnik.fotografija);
      setDatumRodjenja(korisnik.datum_rodjenja ? new Date(korisnik.datum_rodjenja) : null);
      setSuccess(false);
      setIsChanged(false);
    }
  }, [open, korisnik]);

  useEffect(() => {
    const initial = JSON.stringify({ ...korisnik, fotografija: korisnik.fotografija || '', datum_rodjenja: korisnik.datum_rodjenja || '' });
    const current = JSON.stringify({ ...form, fotografija: slika || '', datum_rodjenja: datumRodjenja ? datumRodjenja.toISOString() : '' });
    setIsChanged(initial !== current);
  }, [form, slika, datumRodjenja, korisnik]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChanged) return;
    await onSave({ ...form, datum_rodjenja: datumRodjenja ? datumRodjenja.toISOString() : '', fotografija: slika });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Toast za uspešno ažuriranje */}
      {success && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-base font-semibold z-[99999] animate-fade-in">
          Korisnik uspešno ažuriran!
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[95vh] overflow-y-auto p-0 flex flex-col items-center justify-center">
        <div className="flex justify-between items-center p-4 w-full">
          <h2 className="text-xl font-bold">Uređivanje stavke</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <form className="px-4 pb-4 w-full" onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Fotografija</label>
            <div
              className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center min-h-[90px] cursor-pointer"
              onClick={() => document.getElementById('upload-slika')?.click()}
            >
              {slika ? (
                <img src={slika} alt="avatar" className="w-16 h-16 rounded-full object-cover mb-2" />
              ) : (
                <span className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white bg-purple-300 mb-2">
                  {form.ime?.[0]?.toUpperCase()}{form.prezime?.[0]?.toUpperCase()}
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="upload-slika"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setSlika(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label htmlFor="upload-slika" className="text-[#5B2EFF] cursor-pointer text-sm mt-1 select-none" onClick={e => e.stopPropagation()}>
                Izaberite ili prevucite datoteku
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block mb-1">Ime</label>
              <input name="ime" value={form.ime} onChange={handleInput} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">Prezime</label>
              <input name="prezime" value={form.prezime} onChange={handleInput} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">E-pošta</label>
              <input name="email" value={form.email} onChange={handleInput} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1">Broj telefona</label>
              <input name="telefon" value={form.telefon || ''} onChange={handleInput} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1">Rod</label>
              <select name="pol" value={form.pol} onChange={handleInput} className="w-full border rounded px-3 py-2">
                {polOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">Datum rođenja</label>
              <DatePicker
                selected={datumRodjenja}
                onChange={date => setDatumRodjenja(date)}
                className="w-full border rounded px-3 py-2"
                dateFormat="dd/MM/yyyy"
                placeholderText="Izaberi datum"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="submit" className="bg-[#5B2EFF] text-white px-6 py-2 rounded font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" style={{color: 'white'}} disabled={!isChanged}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-white"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2"/></svg>
              Sačuvaj
            </button>
            <button type="button" className="bg-gray-100 text-gray-700 px-6 py-2 rounded font-semibold cursor-pointer" onClick={onClose}>
              × Otkaži
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KorisnikEditPopup; 