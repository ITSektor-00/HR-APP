/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import KorisnikEditPopup from './KorisnikEditPopup';

interface EditableCellProps {
  value: React.ReactNode;
  column: any;
  row: any;
  onEdit: (row: any, column: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, column, row, onEdit }) => {
  const [hovered, setHovered] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const [editIconTooltip, setEditIconTooltip] = useState(false);
  const cellRef = useRef<HTMLDivElement | null>(null);
  const [popupPos, setPopupPos] = useState<{top: number, left: number, width: number, showAbove: boolean}>({top: 0, left: 0, width: 0, showAbove: false});
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editKorisnik, setEditKorisnik] = useState<any>(null);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

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

  // Helper za formatiranje datuma
  const formatDatum = (datum?: string) => {
    if (!datum) return '--';
    try {
      const date = new Date(datum);
      if (isNaN(date.getTime())) return datum;
      return date.toLocaleDateString('sr-RS');
    } catch {
      return datum;
    }
  };

  // Helper za formatiranje datuma sa vremenom
  const formatDatumSaVremenom = (datum?: string) => {
    if (!datum) return '--';
    try {
      const date = new Date(datum);
      if (isNaN(date.getTime())) return datum;
      return date.toLocaleString('sr-RS');
    } catch {
      return datum;
    }
  };

  // Helper za status zaposlenja
  const statusLabel = (status?: string) => {
    if (!status) return '--';
    const statusMap: Record<string, string> = {
      'aktivan': 'Aktivan',
      'neaktivan': 'Neaktivan',
      'otkaz': 'Otkaz',
      'penzija': 'Penzija'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  // Helper za vrstu zaposlenja
  const vrstaZaposlenjaLabel = (vrsta?: string) => {
    if (!vrsta) return '--';
    const vrstaMap: Record<string, string> = {
      'puno_vreme': 'Puno vreme',
      'deo_vremena': 'Deo vremena',
      'ugovor_na_odredjeno': 'Ugovor na određeno',
      'ugovor_na_neodredjeno': 'Ugovor na neodređeno'
    };
    return vrstaMap[vrsta.toLowerCase()] || vrsta;
  };

  // Helper za pristup
  const pristupLabel = (pristup?: string) => {
    if (!pristup) return '--';
    const pristupMap: Record<string, string> = {
      'admin': 'Administrator',
      'manager': 'Menadžer',
      'user': 'Korisnik',
      'viewer': 'Pregledač'
    };
    return pristupMap[pristup.toLowerCase()] || pristup;
  };

  // Helper za ulogu
  const ulogaLabel = (uloga?: string) => {
    if (!uloga) return '--';
    const ulogaMap: Record<string, string> = {
      'admin': 'Administrator',
      'manager': 'Menadžer',
      'employee': 'Zaposleni',
      'intern': 'Praktikant'
    };
    return ulogaMap[uloga.toLowerCase()] || uloga;
  };

  // Funkcija za generisanje sadržaja popup-a na osnovu kolone
  const getPopupContent = () => {
    const korisnik = row.original;
    
    switch (column.id) {
      case 'korisnik':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Korisnik</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[13px] text-gray-600 font-semibold w-20">Fotografija</span>
                {korisnik.fotografija ? (
                  <img src={korisnik.fotografija} alt="avatar" className="w-10 h-10 rounded-full object-cover border" />
                ) : (
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white bg-yellow-300 border">
                    {getInitials(korisnik.ime, korisnik.prezime)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Ime</span><span>{showOrDash(korisnik.ime)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Prezime</span><span>{showOrDash(korisnik.prezime)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Datum rođenja</span><span>{showOrDash(korisnik.datum_rodjenja)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Rod</span><span>{polLabel(korisnik.pol)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">E-pošta</span><span>{showOrDash(korisnik.email)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Broj telefona</span><span>{showOrDash(korisnik.telefon)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">JMBG</span><span>{showOrDash(korisnik.jmbg)}</span></div>
            </div>
          </>
        );
      
      case 'uloga':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Uloga</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Uloga</span><span>{ulogaLabel(korisnik.uloga)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Definiše nivo pristupa i odgovornosti u sistemu</span></div>
            </div>
          </>
        );
      
      case 'pristup':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Pristup</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Nivo pristupa</span><span>{pristupLabel(korisnik.pristup)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Određuje koje funkcionalnosti su dostupne korisniku</span></div>
            </div>
          </>
        );
      
      case 'broj_radne_dozvole':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Broj radne dozvole</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Broj</span><span>{showOrDash(korisnik.broj_radne_dozvole)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Jedinstveni identifikator radne dozvole</span></div>
            </div>
          </>
        );
      
      case 'pozicija':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Pozicija</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Naziv pozicije</span><span>{showOrDash(korisnik.pozicija)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Radna pozicija i odgovornosti</span></div>
            </div>
          </>
        );
      
      case 'status_zaposlenja':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Status zaposlenja</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Status</span><span>{statusLabel(korisnik.status_zaposlenja)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Trenutni status zaposlenja korisnika</span></div>
            </div>
          </>
        );
      
      case 'vrsta_zaposlenja':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Vrsta zaposlenja</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Vrsta</span><span>{vrstaZaposlenjaLabel(korisnik.vrsta_zaposlenja)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Tip ugovora o radu</span></div>
            </div>
          </>
        );
      
      case 'sektor':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Sektor</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Naziv sektora</span><span>{showOrDash(korisnik.sektor)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Organizaciona jedinica u kojoj korisnik radi</span></div>
            </div>
          </>
        );
      
      case 'datum_pocetka':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Datum početka zaposlenja</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Datum</span><span>{formatDatum(korisnik.datum_pocetka)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Datum kada je korisnik počeo da radi</span></div>
            </div>
          </>
        );
      
      case 'datum_zavrsetka':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Datum završetka zaposlenja</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Datum</span><span>{formatDatum(korisnik.datum_zavrsetka)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Datum kada je korisnik prestao da radi</span></div>
            </div>
          </>
        );
      
      case 'datum_kreiranja':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Datum kreiranja</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Datum</span><span>{formatDatumSaVremenom(korisnik.datum_kreiranja)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Datum i vreme kreiranja zapisa</span></div>
            </div>
          </>
        );
      
      case 'datum_azuriranja':
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">Datum ažuriranja</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Datum</span><span>{formatDatumSaVremenom(korisnik.datum_azuriranja)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Datum i vreme poslednje izmene</span></div>
            </div>
          </>
        );
      
      default:
        return (
          <>
            <div className="px-4 pt-4 pb-2 border-b font-bold text-[15px]">{column.columnDef?.header as string}</div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Vrednost</span><span>{String(value)}</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold w-20">Opis</span><span className="text-gray-500">Informacije o polju</span></div>
            </div>
          </>
        );
    }
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
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [popupOpen]);

  // Izračunaj poziciju popup-a kad se otvori
  useEffect(() => {
    if (popupOpen && cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      const popupWidth = 280;
      const popupHeight = 380; // procenjena visina popup-a
      const padding = 8;
      
      // Popup centriran po širini ćelije
      let left = rect.left + rect.width / 2 - popupWidth / 2;
      // Popup odmah ispod ćelije (samo 2px razmaka)
      let top = rect.bottom + 2;
      let showAbove = false;
      
      // Ako izlazi van desne ivice ekrana
      if (left + popupWidth + padding > window.innerWidth) {
        left = window.innerWidth - popupWidth - padding;
      }
      // Ako izlazi van leve ivice ekrana
      if (left < padding) {
        left = padding;
      }
      // Ako izlazi van donje ivice ekrana
      if (top + popupHeight + padding > window.innerHeight) {
        // Prikaži iznad ćelije
        top = rect.top - popupHeight - 2;
        showAbove = true;
      }
      // Ako bi popup bio van gornje ivice ekrana
      if (top < padding) {
        top = padding;
      }
      setPopupPos({
        top,
        left,
        width: rect.width,
        showAbove,
      });
    }
  }, [popupOpen]);

  // Reset hovered kada se popup zatvori
  useEffect(() => {
    if (!popupOpen) {
      setHovered(false);
    }
  }, [popupOpen]);

  // Funkcija za potpuno zatvaranje edit popup-a i reset hovera
  const closeEditPopup = () => {
    setEditPopupOpen(false);
    setHovered(false);
    setPopupOpen(false);
  };

  return (
    <div
      ref={cellRef}
      className="relative w-full h-full group"
      onMouseEnter={() => { setHovered(true); }}
      onMouseLeave={() => { setHovered(false); setEditIconTooltip(false); }}
      style={{ minHeight: 32 }}
    >
      {/* Edit ikonica u gornjem levom uglu na hover */}
      {hovered && !popupOpen && (
        <div className="absolute -top-2 -left-2 z-10">
          <button
            className="bg-gray-500 text-white rounded p-1 shadow hover:bg-blue-600 transition"
            style={{ width: 24, height: 24 }}
            onClick={e => { e.stopPropagation(); setPopupOpen(true); }}
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
      {/* Popup meni za sve kolone kroz portal */}
      {popupOpen && typeof window !== 'undefined' && ReactDOM.createPortal(
        <div
          className={`max-w-[280px] min-w-[240px] bg-white border border-gray-300 rounded-xl shadow-2xl z-[9999] p-0 flex flex-col overflow-y-auto`}
          style={{
            position: 'fixed',
            top: popupPos.top,
            left: popupPos.left,
            fontSize: '14px',
            boxShadow: '0 8px 32px 0 rgba(60,60,60,0.18)',
            maxHeight: window.innerWidth < 640 ? '55vh' : '70vh',
            minHeight: 0,
            width: '100%',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{flex: 1, minHeight: 0, width: '100%', overflowY: 'auto'}}>
            {/* X dugme za zatvaranje */}
            <button
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
              style={{zIndex: 2}}
              onClick={() => setPopupOpen(false)}
              title="Zatvori"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18" stroke="#888" strokeWidth="2" strokeLinecap="round"/><path d="M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            {/* Dinamički sadržaj na osnovu kolone */}
            {getPopupContent()}
            {/* Dugme za izmenu dole levo */}
            <div className="flex items-center px-4 pb-3 pt-2 border-t">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-md bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border border-yellow-200 shadow"
                title="Izmeni"
                onClick={() => {
                  setPopupOpen(false);
                  if (column.id === 'korisnik') {
                    setEditKorisnik(row.original);
                    setEditPopupOpen(true);
                  } else {
                    onEdit(row, column);
                  }
                }}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#b45309" strokeWidth="2"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#b45309" strokeWidth="2"/></svg>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Novi popup za edit korisnika */}
      {editPopupOpen && (
        <KorisnikEditPopup
          open={editPopupOpen}
          korisnik={editKorisnik}
          onClose={closeEditPopup}
          onSave={async (data) => {
            await fetch(`/api/zaposleni/korisnici?id=${editKorisnik.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            setGlobalToast('Korisnik uspešno ažuriran!');
            setTimeout(() => setGlobalToast(null), 2000);
            closeEditPopup();
            window.location.reload();
          }}
        />
      )}
      {globalToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-base font-semibold z-[99999] animate-fade-in">
          {globalToast}
        </div>
      )}
    </div>
  );
};

export default EditableCell; 