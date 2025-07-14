import React from 'react';

interface DeleteStavkaConfirmProps {
  open: boolean;
  onClose: () => void;
  naziv: string;
  onDelete: () => void;
}

const DeleteStavkaConfirm: React.FC<DeleteStavkaConfirmProps> = ({ open, onClose, naziv, onDelete }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80">
        <h2 className="text-lg font-bold mb-4">Brisanje ugovora</h2>
        <p className="mb-4">Da li ste sigurni da želite da obrišete: <span className="font-semibold">{naziv}</span>?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Otkaži</button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Obriši</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStavkaConfirm; 