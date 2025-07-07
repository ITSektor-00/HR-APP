import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface EditableCellProps {
  value: React.ReactNode;
  column: any;
  row: any;
  onEdit: (row: any, column: any) => void;
  onDelete: (row: any, column: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, column, row, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [editIconTooltip, setEditIconTooltip] = useState(false);
  const cellRef = useRef<HTMLDivElement | null>(null);
  const [popupPos, setPopupPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0});

  // Helper za inicijale
  const getInitials = (ime?: string, prezime?: string) => {
    return ((ime?.[0] || '').toUpperCase() + (prezime?.[0] || '').toUpperCase()) || '--';
  };

  // Helper za prikaz vrednosti ili --
  const showOrDash = (v?: string) => v && v.trim() !== '' ? v : '--';

  // Helper za pol
  const polLabel = (pol?: string) => {
    if (!pol) return '--';
    if (pol.toLowerCase() === 'm') return 'Muški';
    if (pol.toLowerCase() === 'ž') return 'Ženski';
    return pol;
  };

  // Portal close on click outside or ESC
  useEffect(() => {
    if (!popupOpen) return;
    function handleClick(e: MouseEvent) {
      if (cellRef.current && !cellRef.current.contains(e.target as Node)) {
        setPopupOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setPopupOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [popupOpen]);

  // Izračunaj poziciju popup-a kad se otvori
  useEffect(() => {
    if (popupOpen && cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      const popupWidth = 280;
      const padding = 8;
      let left = rect.left;
      // Ako bi popup prešao desnu ivicu ekrana, pomeri ulevo
      if (left + popupWidth + padding > window.innerWidth) {
        left = window.innerWidth - popupWidth - padding;
      }
      setPopupPos({
        top: rect.bottom + 2,
        left,
        width: rect.width
      });
    }
  }, [popupOpen]);

  return (
    <div
      ref={cellRef}
      className="relative w-full h-full group"
      onMouseEnter={() => { setHovered(true); setTooltip(true); }}
      onMouseLeave={() => { setHovered(false); setTooltip(false); setEditIconTooltip(false); }}
      style={{ minHeight: 32 }}
    >
      {/* Edit ikonica u gornjem levom uglu na hover */}
      {hovered && !popupOpen && (
        <div className="absolute -top-2 -left-2 z-10">
          <button
            className="bg-gray-500 text-white rounded p-1 shadow hover:bg-blue-600 transition"
            style={{ width: 24, height: 24 }}
            onClick={e => { e.stopPropagation(); setPopupOpen(true); setTooltip(false); }}
            onMouseEnter={() => setEditIconTooltip(true)}
            onMouseLeave={() => setEditIconTooltip(false)}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#fff" strokeWidth="2"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth="2"/></svg>
          </button>
          {/* Tooltip za edit ikonicu */}
          {editIconTooltip && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-[11px] rounded px-2 py-1 shadow z-50 whitespace-nowrap pointer-events-none">
              Izmeni
            </div>
          )}
        </div>
      )}
      {/* Prikaz vrednosti ćelije */}
      <div className={`w-full h-full px-2 py-1 rounded ${popupOpen ? 'bg-yellow-50 border border-yellow-200' : ''}`}>{value}</div>
      {/* Popup meni za edit/delete kroz portal */}
      {popupOpen && column.id === 'korisnik' && typeof window !== 'undefined' && ReactDOM.createPortal(
        <div
          className="max-w-[280px] min-w-[240px] bg-white border border-gray-300 rounded-xl shadow-2xl z-[9999] p-0 flex flex-col"
          style={{
            position: 'fixed',
            top: popupPos.top,
            left: popupPos.left,
            fontSize: '14px',
            boxShadow: '0 8px 32px 0 rgba(60,60,60,0.18)'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* X dugme za zatvaranje */}
          <button
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
            style={{zIndex: 2}}
            onClick={() => setPopupOpen(false)}
            title="Zatvori"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18" stroke="#888" strokeWidth="2" strokeLinecap="round"/><path d="M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          {/* Header - naziv kolone */}
          <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Korisnik</div>
          {/* Podaci o korisniku */}
          <div className="px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[13px] text-gray-600 font-semibold w-20">Fotografija</span>
              {row.original.fotografija ? (
                <img src={row.original.fotografija} alt="avatar" className="w-10 h-10 rounded-full object-cover border" />
              ) : (
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white bg-yellow-300 border">
                  {getInitials(row.original.ime, row.original.prezime)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3"><span className="font-semibold w-20">Ime</span><span>{showOrDash(row.original.ime)}</span></div>
            <div className="flex items-center gap-3"><span className="font-semibold w-20">Prezime</span><span>{showOrDash(row.original.prezime)}</span></div>
            <div className="flex items-center gap-3"><span className="font-semibold w-20">Datum rođenja</span><span>{showOrDash(row.original.datum_rodjenja)}</span></div>
            <div className="flex items-center gap-3"><span className="font-semibold w-20">Rod</span><span>{polLabel(row.original.pol)}</span></div>
            <div className="flex items-center gap-3"><span className="font-semibold w-20">E-pošta</span><span>{showOrDash(row.original.email)}</span></div>
            <div className="flex items-center gap-3"><span className="font-semibold w-20">Broj telefona</span><span>{showOrDash(row.original.telefon)}</span></div>
            <div className="flex items-center gap-3"><span className="font-semibold w-20">JMBG</span><span>{showOrDash(row.original.jmbg)}</span></div>
          </div>
          {/* Dugme za izmenu dole levo */}
          <div className="flex items-center px-4 pb-3 pt-2 border-t">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-md bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border border-yellow-200 shadow"
              title="Izmeni"
              onClick={() => { setPopupOpen(false); onEdit(row, column); }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#b45309" strokeWidth="2"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#b45309" strokeWidth="2"/></svg>
            </button>
          </div>
        </div>,
        document.body
      )}
      {/* Popup meni za edit/delete za ostale kolone */}
      {popupOpen && column.id !== 'korisnik' && (
        <div
          className="absolute left-0 top-full mt-2 min-w-[220px] bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-0 flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header - naziv kolone */}
          <div className="px-4 pt-3 pb-2 border-b font-bold text-[15px]">{column.columnDef?.header as string}</div>
          {/* Naslov i opis kao na slici */}
          <div className="px-4 py-2 flex flex-col gap-1">
            <div className="text-xs text-gray-500">Naslov</div>
            <div className="font-bold text-[15px] flex items-center gap-2"><span>{value}</span></div>
            <div className="text-xs text-gray-500 mt-2">Opis</div>
            <div className="text-[13px] text-gray-500">(Dodajte opis...)</div>
          </div>
          {/* Dugmad dole */}
          <div className="flex items-center gap-2 px-4 pb-3 pt-2 border-t">
            <button
              className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200"
              onClick={() => { setPopupOpen(false); onEdit(row, column); }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#b45309" strokeWidth="2"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#b45309" strokeWidth="2"/></svg>
            </button>
            <button
              className="flex items-center gap-1 px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
              onClick={() => { setPopupOpen(false); onDelete(row, column); }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M3 6h18" stroke="#dc2626" strokeWidth="2"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#dc2626" strokeWidth="2"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableCell; 