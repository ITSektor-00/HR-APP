import React from 'react';

interface DeleteStavkaConfirmProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  naziv?: string;
}

const DeleteStavkaConfirm: React.FC<DeleteStavkaConfirmProps> = ({ open, onClose, onDelete, naziv }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 flex flex-col items-center">
        <div className="text-xl font-bold mb-2 text-red-700">Brisanje stavke</div>
        <div className="mb-4 text-center text-gray-700">Da li ste sigurni da želite da izbrišete {naziv ? <b>{naziv}</b> : 'ovu stavku'}?</div>
        <div className="flex gap-3 mt-2">
          <button className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700" onClick={onDelete}>Potvrdi</button>
          <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200" onClick={onClose}>Otkaži</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStavkaConfirm; 