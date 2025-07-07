import React, { useState } from 'react';

interface EditStavkaModalProps {
  open: boolean;
  onClose: () => void;
  stavka: { naslov: string; opis?: string };
  onSave: (data: { naslov: string; opis?: string }) => void;
}

const TABS = [
  { key: 'osnovno', label: 'Osnovne informacije', icon: <span className="mr-1">📄</span> },
  { key: 'dozvole', label: 'Dozvole', icon: <span className="mr-1">👁️</span> },
  { key: 'obavestenja', label: 'Obaveštenja', icon: <span className="mr-1">🔔</span> },
];

const EditStavkaModal: React.FC<EditStavkaModalProps> = ({ open, onClose, stavka, onSave }) => {
  const [tab, setTab] = useState('osnovno');
  const [form, setForm] = useState(stavka);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Uređivanje stavke</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <div className="flex gap-2 px-6 pt-4 border-b">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`flex items-center gap-1 px-3 py-2 font-semibold text-base transition-colors duration-150 ${tab === t.key ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-800 border-b-2 border-transparent'}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === 'osnovno' && (
            <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Naslov</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                  value={form.naslov}
                  onChange={e => setForm(f => ({ ...f, naslov: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Opis</label>
                <textarea
                  className="w-full border rounded px-3 py-2 bg-gray-50 min-h-[60px]"
                  value={form.opis || ''}
                  onChange={e => setForm(f => ({ ...f, opis: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="px-4 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800">Sačuvaj</button>
                <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200" onClick={onClose}>Otkaži</button>
              </div>
            </form>
          )}
          {tab === 'dozvole' && (
            <div className="text-gray-500 italic">(Ovde ide tabela dozvola... demo)</div>
          )}
          {tab === 'obavestenja' && (
            <div className="text-gray-500 italic">(Ovde idu obaveštenja... demo)</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditStavkaModal; 