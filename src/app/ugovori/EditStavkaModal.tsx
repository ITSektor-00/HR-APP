import React, { useState } from 'react';

interface EditStavkaModalProps {
  open: boolean;
  onClose: () => void;
  stavka: { naslov: string; opis: string };
  onSave: (data: { naslov: string; opis: string }) => void;
}

const EditStavkaModal: React.FC<EditStavkaModalProps> = ({ open, onClose, stavka, onSave }) => {
  const [naslov, setNaslov] = useState(stavka.naslov);
  const [opis, setOpis] = useState(stavka.opis);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Izmena ugovora</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Naslov</label>
          <input value={naslov} onChange={e => setNaslov(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Opis</label>
          <textarea value={opis} onChange={e => setOpis(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Otkaži</button>
          <button onClick={() => onSave({ naslov, opis })} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sačuvaj</button>
        </div>
      </div>
    </div>
  );
};

export default EditStavkaModal; 