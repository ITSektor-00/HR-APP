"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

const TABS = [
  { key: 'detalji', label: 'Detalji', icon: '/ikonice/user.svg' },
  { key: 'beleske', label: 'Beleške', icon: '/ikonice/beleske.svg' },
  { key: 'sertifikati', label: 'Sertifikati', icon: '/ikonice/sertifikati.svg' },
  { key: 'prisustva', label: 'Prisustva', icon: '/ikonice/prisustva.svg' },
  { key: 'odsustva', label: 'Odsustva', icon: '/ikonice/odsustva.svg' },
];

function formatDatum(datum: string) {
  if (!datum) return '--';
  try {
    const date = new Date(datum);
    if (isNaN(date.getTime())) return datum;
    return format(date, 'd.M.yyyy. HH:mm');
  } catch {
    return datum;
  }
}

const EditModal = ({ open, onClose, korisnik }: { open: boolean, onClose: () => void, korisnik: any }) => {
  const [tab, setTab] = useState('detalji');
  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-0 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center px-6 pt-6 pb-2 border-b">
          <h2 className="text-xl font-bold">Uređivanje stavke</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="flex gap-2 px-6 pt-4 border-b">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-2 pb-2 border-b-2 transition-all ${tab === t.key ? 'border-indigo-600 font-bold text-indigo-700' : 'border-transparent text-gray-700'}`}>
              <Image src={t.icon} alt={t.label} width={18} height={18} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === 'detalji' && (
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 mb-4">
              <span className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white bg-pink-400">
                {(korisnik.ime?.[0] || '').toUpperCase() + (korisnik.prezime?.[0] || '').toUpperCase()}
              </span>
              <div>
                <div className="font-semibold text-lg">{korisnik.ime} {korisnik.prezime}</div>
                <div className="text-gray-500 text-sm">{korisnik.email}</div>
              </div>
            </div>
          )}
          {tab === 'zaposlenje' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Broj radne dozvole</label>
                <input className="border rounded p-2" value={korisnik.broj_radne_dozvole || ''} readOnly />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Pozicija</label>
                <input className="border rounded p-2" value={korisnik.pozicija || ''} readOnly />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Vrsta zaposlenja</label>
                <input className="border rounded p-2" value={korisnik.vrsta_zaposlenja || ''} readOnly />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Sektor</label>
                <input className="border rounded p-2" value={korisnik.sektor || ''} readOnly />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Status</label>
                <input className="border rounded p-2" value={korisnik.status_zaposlenja || ''} readOnly />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium">Datum početka i datum završetka rada</label>
                <input className="border rounded p-2" value={formatDatum(korisnik.datum_pocetka) + (korisnik.datum_zavrsetka ? ' → ' + formatDatum(korisnik.datum_zavrsetka) : '')} readOnly />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium">Plata</label>
                <input className="border rounded p-2" value={`${korisnik.plata || ''} RSD (${korisnik.period_plate || ''})`} readOnly />
              </div>
            </div>
          )}
          {tab === 'pristup' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Pristup</label>
                <input className="border rounded p-2" value={korisnik.pristup || ''} readOnly />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Uloga</label>
                <input className="border rounded p-2" value={korisnik.uloga || ''} readOnly />
              </div>
            </div>
          )}
          <div className="flex gap-2 justify-end mt-6">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold flex items-center gap-2">
              Sačuvaj
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded font-semibold flex items-center gap-2" onClick={onClose}>
              Otkaži
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default function KorisnikDetaljiClient({ korisnik }: { korisnik: any }) {
  const inicijali = (korisnik.ime?.[0] || '').toUpperCase() + (korisnik.prezime?.[0] || '').toUpperCase();
  const [activeTab, setActiveTab] = useState('detalji');
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  return (
    <div className="p-4 md:p-8 w-full h-full">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-4">
          {korisnik.fotografija ? (
            <Image src={korisnik.fotografija} alt="avatar" width={56} height={56} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <span className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{background:'#a5b4fc'}}>{inicijali}</span>
          )}
          <div>
            <h1 className="text-3xl font-bold">{korisnik.ime} {korisnik.prezime}</h1>
            <div className="text-gray-500 text-lg">{korisnik.email}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded bg-yellow-100 text-yellow-900 font-semibold hover:bg-yellow-200 border border-yellow-200 transition" title="Uredi" onClick={() => setShowEdit(true)}>
            <Image src="/ikonice/komandnaTabla.svg" alt="Uredi" width={18} height={18} />
            Uredi
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 border border-red-200 transition" title="Izbriši" onClick={() => setShowDelete(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7h12M9 7V5a3 3 0 016 0v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Izbriši
          </button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-4 md:gap-6 border-b border-gray-200 mb-4 md:mb-8">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 pb-3 px-2 text-base md:text-lg font-semibold border-b-2 transition ${activeTab === tab.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-indigo-600'}`}>
            <Image src={tab.icon} alt={tab.label} width={22} height={22} />
            {tab.label}
          </button>
        ))}
      </div>
      {/* Delete popup */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Brisanje stavke</h2>
              <button onClick={() => setShowDelete(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="mb-6 text-gray-700">Da li ste sigurni da želite da obrišete ovu stavku? Ako nastavite, sve povezane stavke u sistemu će biti trajno uklonjene. Ova radnja je nepovratna.</div>
            <div className="flex gap-2 justify-end">
              <button className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={() => {/* TODO: implement delete */}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7h12M9 7V5a3 3 0 016 0v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Izbriši
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition" onClick={() => setShowDelete(false)}>
                Otkaži
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit modal */}
      <EditModal open={showEdit} onClose={() => setShowEdit(false)} korisnik={korisnik} />
      {/* Tab content */}
      {activeTab === 'detalji' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div className="bg-white rounded-lg shadow p-2 md:p-4 text-sm md:text-base">
            <h2 className="font-semibold mb-1 md:mb-2 text-base md:text-lg">Lični podaci</h2>
            <div className="grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 text-sm md:text-base">
              <div className="text-gray-500">Ime</div><div>{korisnik.ime || '--'}</div>
              <div className="text-gray-500">Prezime</div><div>{korisnik.prezime || '--'}</div>
              <div className="text-gray-500">Adresa</div><div>{korisnik.adresa || '--'}</div>
              <div className="text-gray-500">Mesto / grad</div><div>{korisnik.mesto || korisnik.grad || '--'}</div>
              <div className="text-gray-500">JMBG</div><div>{korisnik.jmbg || '--'}</div>
              <div className="text-gray-500">E-pošta</div><div>{korisnik.email || '--'}</div>
              <div className="text-gray-500">Broj telefona</div><div>{korisnik.telefon || '--'}</div>
              <div className="text-gray-500">Rod</div><div>{korisnik.pol || '--'}</div>
              <div className="text-gray-500">Pristup</div><div>{korisnik.pristup || '--'}</div>
              <div className="text-gray-500">Uloga</div><div>{korisnik.uloga || '--'}</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-2 md:p-4 text-sm md:text-base">
            <h2 className="font-semibold mb-1 md:mb-2 text-base md:text-lg">Zaposlenje</h2>
            <div className="grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 text-sm md:text-base">
              <div className="text-gray-500">Pozicija</div><div>{korisnik.pozicija || '--'}</div>
              <div className="text-gray-500">Sektor</div><div>{korisnik.sektor || '--'}</div>
              <div className="text-gray-500">Vrsta zaposlenja</div><div>{korisnik.vrsta_zaposlenja || '--'}</div>
              <div className="text-gray-500">Datum početka zaposlenja</div><div>{formatDatum(korisnik.datum_pocetka)}</div>
              <div className="text-gray-500">Datum završetka zaposlenja</div><div>{formatDatum(korisnik.datum_zavrsetka)}</div>
              <div className="text-gray-500">Status</div><div>{korisnik.status_zaposlenja || '--'}</div>
              <div className="text-gray-500">Broj radne dozvole</div><div>{korisnik.broj_radne_dozvole || '--'}</div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'zaposlenje' && (
        <div className="bg-white rounded-2xl shadow p-4 md:p-8 text-base">
          <h2 className="font-semibold mb-2 md:mb-4 text-lg">Zaposlenje</h2>
          {/* ... ovde ide forma za izmenu zaposlenja ... */}
        </div>
      )}
      {activeTab === 'pristup' && (
        <div className="bg-white rounded-2xl shadow p-4 md:p-8 text-base">
          <h2 className="font-semibold mb-2 md:mb-4 text-lg">Pristup</h2>
          {/* ... ovde ide forma za izmenu pristupa ... */}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-2 md:mt-4">
        <div className="bg-white rounded-lg shadow p-2 md:p-4 text-sm md:text-base">
          <h2 className="font-semibold mb-1 md:mb-2 text-base md:text-lg">Plata</h2>
          <div className="grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 text-sm md:text-base">
            <div className="text-gray-500">Plata</div><div>{korisnik.plata || '0'}</div>
            <div className="text-gray-500">Vremenski interval</div><div>{korisnik.period_plate || 'Mesec'}</div>
            <div className="text-gray-500">Valuta</div><div>RSD</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-2 md:p-4 text-sm md:text-base">
          <h2 className="font-semibold mb-1 md:mb-2 text-base md:text-lg">Sistemske informacije</h2>
          <div className="grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 text-sm md:text-base">
            <div className="text-gray-500">Datum kreiranja</div><div>{formatDatum(korisnik.datum_kreiranja)}</div>
            <div className="text-gray-500">Datum ažuriranja</div><div>{formatDatum(korisnik.datum_azuriranja)}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 