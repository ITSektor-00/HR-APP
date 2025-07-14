/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

interface EditableCellProps {
  value: React.ReactNode;
  column: any;
  row: any;
  onEdit: (row: any, column: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, column, row, onEdit }) => {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <div className="relative group">
      <div
        className="cursor-pointer"
        onClick={() => setPopupOpen(true)}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') setPopupOpen(true); }}
      >
        {value}
      </div>
      {popupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setPopupOpen(false)}>
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[300px] relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Izmena vrednosti</h2>
            <div className="mb-4">
              <span className="font-semibold">Kolona:</span> {column.id.replace(/_/g, ' ')}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Trenutna vrednost:</span> {String(value)}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPopupOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Zatvori</button>
              <button onClick={() => { setPopupOpen(false); onEdit(row, column); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Izmeni</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableCell; 