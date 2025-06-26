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
}

const lokacije = ["Beograd", "Novi Sad", "Niš", "Kragujevac", "Drugo..."];

export default function PoljaForm({ open, onClose, values, onChange }: PoljaFormProps) {
  const [form, setForm] = useState(values);
  const [lokacijaInput, setLokacijaInput] = useState("");
  const [showCustomLokacija, setShowCustomLokacija] = useState(false);

  // Kada se otvori forma, inicijalizuj lokalni state iz props.values
  useEffect(() => {
    if (open) {
      setForm(values);
      setLokacijaInput(values.lokacija && !lokacije.includes(values.lokacija) ? values.lokacija : "");
      setShowCustomLokacija(values.lokacija && !lokacije.includes(values.lokacija));
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
      <div className="bg-white rounded-xl shadow-xl mt-2 w-[350px] max-w-full p-4 relative animate-fade-in">
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
              onBlur={() => onChange({ ...form, lokacija: showCustomLokacija ? lokacijaInput : form.lokacija })}
            />
          </label>
          <label className="text-sm font-medium">Naziv opšteg akta poslodavca
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
              type="text"
              value={form.nazivAkta}
              onChange={e => setForm(f => ({ ...f, nazivAkta: e.target.value }))}
              placeholder="Unesite naziv akta"
              onBlur={() => onChange({ ...form, lokacija: showCustomLokacija ? lokacijaInput : form.lokacija })}
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
                onBlur={() => onChange({ ...form, lokacija: lokacijaInput })}
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
              onBlur={() => onChange({ ...form, lokacija: showCustomLokacija ? lokacijaInput : form.lokacija })}
            />
          </label>
          <label className="text-sm font-medium">Datum pisanja
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
              type="date"
              value={form.datumPisanja}
              onChange={e => setForm(f => ({ ...f, datumPisanja: e.target.value }))}
              onBlur={() => onChange({ ...form, lokacija: showCustomLokacija ? lokacijaInput : form.lokacija })}
            />
          </label>
          <label className="text-sm font-medium">Datum potpisivanja
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
              type="date"
              value={form.datumPotpisa}
              onChange={e => setForm(f => ({ ...f, datumPotpisa: e.target.value }))}
              onBlur={() => onChange({ ...form, lokacija: showCustomLokacija ? lokacijaInput : form.lokacija })}
            />
          </label>
          {/* Dugmad dole */}
          <div className="flex gap-1 mt-2">
            <button type="button" className="flex-1 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg cursor-pointer">Zap...</button>
            <button type="button" className="flex-1 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg cursor-pointer">Nek...</button>
            <button type="button" className="flex-1 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg cursor-pointer">Kori...</button>
          </div>
          <button type="button" className="w-full mt-2 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
            <span className="text-xl">＋</span> Nova stavka
          </button>
        </form>
      </div>
      <style jsx>{`
        .animate-fade-in { animation: fade-in 0.2s ease; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
} 