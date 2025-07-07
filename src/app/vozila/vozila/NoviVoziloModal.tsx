import React, { useState } from 'react';

const BOJE = [
  '#33ff57', '#b533ff', '#33ffb5', '#ffb533', '#aa33ff', '#33aaff', '#ff5733', '#ff33b5', '#5733ff', '#ff33aa',
  '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#000000', '#ffffff',
];

type NoviVoziloModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function NoviVoziloModal({ open, onClose, onSuccess }: NoviVoziloModalProps) {
  const [form, setForm] = useState({
    naslov: '',
    opis: '',
    broj_sasije: '',
    proizvodjac: '',
    komercijalna_oznaka: '',
    godina_proizvodnje: new Date().getFullYear(),
    boja: '',
  });
  const [bojaPicker, setBojaPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleBojaSelect = (color: string) => {
    setForm(f => ({ ...f, boja: color }));
    setBojaPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const datum = now.toISOString();
      const res = await fetch('/api/vozila', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          godina_proizvodnje: Number(form.godina_proizvodnje),
          datum_kreiranja: datum,
          datum_azuriranja: datum,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Greška pri unosu vozila');
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri unosu vozila');
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Novo vozilo</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Naslov</label>
            <input name="naslov" value={form.naslov} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Opis</label>
            <textarea name="opis" value={form.opis} onChange={handleChange} className="w-full border rounded px-2 py-1 min-h-[60px]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Broj šasije</label>
            <input name="broj_sasije" value={form.broj_sasije} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Proizvođač</label>
              <input name="proizvodjac" value={form.proizvodjac} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Komercijalna oznaka</label>
              <input name="komercijalna_oznaka" value={form.komercijalna_oznaka} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Godina proizvodnje</label>
              <input name="godina_proizvodnje" type="number" min="1900" max="2100" value={form.godina_proizvodnje} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Boja</label>
            <div className="relative">
              <input
                name="boja"
                value={form.boja}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 pr-10"
                placeholder="Transparentno"
                onFocus={() => setBojaPicker(true)}
                readOnly
                style={{ backgroundColor: form.boja || undefined }}
              />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: form.boja || '#fff' }} onClick={() => setBojaPicker(v => !v)} tabIndex={-1} />
              {bojaPicker && (
                <div className="absolute z-10 mt-2 bg-white border rounded shadow p-2 grid grid-cols-6 gap-1" style={{ minWidth: 180 }}>
                  {BOJE.map(color => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() => handleBojaSelect(color)}
                    />
                  ))}
                  <button type="button" className="col-span-6 text-xs text-gray-500 mt-1 underline" onClick={() => handleBojaSelect('')}>Transparentno</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        <div className="flex gap-2 mt-6">
          <button type="submit" disabled={loading} className="flex-1 bg-[#3A3CA6] hover:bg-blue-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2">
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Sačuvaj
              </>
            )}
          </button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Otkaži
          </button>
        </div>
      </form>
    </div>
  );
} 