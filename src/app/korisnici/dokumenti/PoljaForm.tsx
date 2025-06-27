"use client";
import { useState, useEffect } from "react";

interface PoljaFormProps {
  open: boolean;
  onClose: () => void;
  values: {
    clanZakona: string;
    nazivAkta: string;
    lokacija: string;
    godina: string;
    datumPisanja: string;
    datumPotpisa: string;
  };
  onChange: (values: PoljaFormProps["values"]) => void;
  onAddStavka?: (stavka: { zaposleni: string; nekorisceni: string; korisceni: string }) => void;
}

const lokacije = ["Beograd", "Novi Sad", "Niš", "Kragujevac", "Drugo..."];

export default function PoljaForm({ open, onClose, values, onChange, onAddStavka }: PoljaFormProps) {
  const [form, setForm] = useState(values);
  const [lokacijaInput, setLokacijaInput] = useState("");
  const [showCustomLokacija, setShowCustomLokacija] = useState(false);
  const [showStavkaForm, setShowStavkaForm] = useState(false);
  const [stavka, setStavka] = useState({ zaposleni: "", nekorisceni: "", korisceni: "" });

  // Kada se otvori forma, inicijalizuj lokalni state iz props.values
  useEffect(() => {
    if (open) {
      setForm(values);
      setLokacijaInput(values.lokacija && !lokacije.includes(values.lokacija) ? values.lokacija : "");
      setShowCustomLokacija(Boolean(values.lokacija && !lokacije.includes(values.lokacija)));
    }
    // eslint-disable-next-line
  }, [open]);

  // Kada se forma zatvori, pošalji promene parentu
  const handleClose = () => {
    onChange({ ...form, lokacija: showCustomLokacija ? lokacijaInput : form.lokacija });
    onClose();
  };

  return !open ? null : (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30" style={{backdropFilter: 'blur(2px)'}}>
      <div className="bg-white rounded-xl shadow-xl mt-2 w-[350px] max-w-full p-4 relative animate-fade-in overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
          onClick={handleClose}
          aria-label="Zatvori"
        >
          ×
        </button>
        <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); handleClose(); }}>
          <label className="text-sm font-medium">Član zakona
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
              type="text"
              value={form.clanZakona}
              onChange={e => setForm(f => ({ ...f, clanZakona: e.target.value }))}
              placeholder="Unesite član zakona"
            />
          </label>
          <label className="text-sm font-medium">Naziv opšteg akta poslodavca
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
              type="text"
              value={form.nazivAkta}
              onChange={e => setForm(f => ({ ...f, nazivAkta: e.target.value }))}
              placeholder="Unesite naziv akta"
            />
          </label>
          <label className="text-sm font-medium">Lokacija
            <select
              className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
              value={showCustomLokacija ? "custom" : form.lokacija}
              onChange={e => {
                if (e.target.value === "custom") {
                  setShowCustomLokacija(true);
                  setForm(f => ({ ...f, lokacija: lokacijaInput }));
                } else {
                  setShowCustomLokacija(false);
                  setForm(f => ({ ...f, lokacija: e.target.value }));
                }
              }}
            >
              <option value="">Izaberite lokaciju</option>
              {lokacije.map(lok => (
                <option key={lok} value={lok}>{lok}</option>
              ))}
              <option value="custom">Unesi lokaciju...</option>
            </select>
            {showCustomLokacija && (
              <input
                className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                type="text"
                value={lokacijaInput}
                onChange={e => {
                  setLokacijaInput(e.target.value);
                  setForm(f => ({ ...f, lokacija: e.target.value }));
                }}
                placeholder="Unesite lokaciju"
              />
            )}
          </label>
          <label className="text-sm font-medium">Godina
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
              type="number"
              value={form.godina}
              onChange={e => setForm(f => ({ ...f, godina: e.target.value }))}
              min="2000"
              max="2100"
            />
          </label>
          <label className="text-sm font-medium">Datum pisanja
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
              type="date"
              value={form.datumPisanja}
              onChange={e => setForm(f => ({ ...f, datumPisanja: e.target.value }))}
            />
          </label>
          <label className="text-sm font-medium">Datum potpisivanja
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
              type="date"
              value={form.datumPotpisa}
              onChange={e => setForm(f => ({ ...f, datumPotpisa: e.target.value }))}
            />
          </label>
          {/* Dugmad dole */}
          <div className="flex gap-1 mt-2">
            <button type="button" className="flex-1 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg cursor-pointer">Zaposleni</button>
            <button type="button" className="flex-1 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg cursor-pointer">Nekorišćeni</button>
            <button type="button" className="flex-1 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg cursor-pointer">Korišćeni</button>
          </div>
          <button type="button" className="w-full mt-2 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg flex items-center justify-center gap-2" onClick={() => setShowStavkaForm(true)}>
            <span className="text-xl">＋</span> Nova stavka
          </button>
        </form>
        {showStavkaForm && (
          <div className="mt-4 p-3 border rounded-lg bg-[#f7f7fa] flex flex-col gap-2">
            <label className="text-sm font-medium flex items-center gap-2">Zaposleni
              <input
                className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                type="text"
                value={stavka.zaposleni}
                onChange={e => setStavka(s => ({ ...s, zaposleni: e.target.value }))}
                placeholder="Ime i prezime zaposlenog"
              />
              {stavka.zaposleni && (
                <button type="button" className="ml-2 p-2 bg-red-100 hover:bg-red-200 rounded" onClick={() => setStavka(s => ({ ...s, zaposleni: "" }))} title="Obriši ime">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </label>
            <label className="text-sm font-medium">Nekorišćeni
              <input
                className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                type="text"
                value={stavka.nekorisceni}
                onChange={e => setStavka(s => ({ ...s, nekorisceni: e.target.value }))}
                placeholder="Neiskorišćen godišnji odmor iz prethodne godine*"
              />
            </label>
            <label className="text-sm font-medium">Korišćeni
              <input
                className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                type="text"
                value={stavka.korisceni}
                onChange={e => setStavka(s => ({ ...s, korisceni: e.target.value }))}
                placeholder="Korišćen godišnji odmor u tekućoj godini"
              />
            </label>
            <div className="flex gap-2 mt-2">
              <button type="button" className="flex-1 bg-[#3A3CA6] text-white font-semibold py-2 rounded-lg" onClick={() => {
                if (stavka.zaposleni && stavka.nekorisceni && stavka.korisceni && typeof onAddStavka === 'function') {
                  onAddStavka(stavka);
                  setStavka({ zaposleni: "", nekorisceni: "", korisceni: "" });
                  setShowStavkaForm(false);
                }
              }}>Potvrdi</button>
              <button type="button" className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg" onClick={() => {
                setShowStavkaForm(false);
                setStavka({ zaposleni: "", nekorisceni: "", korisceni: "" });
              }}>Otkaži</button>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .animate-fade-in { animation: fade-in 0.2s ease; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
} 