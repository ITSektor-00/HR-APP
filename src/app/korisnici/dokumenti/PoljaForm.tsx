"use client";
import { useState, useEffect } from "react";

// Tipovi za vrednosti forme
export interface PoljaPlanFormValues {
  clanZakona: string;
  nazivAkta: string;
  lokacija: string;
  godina: string;
  datumPisanja: string;
  datumPotpisa: string;
}
export interface PoljaUgovorVoziloFormValues {
  korisnik: string;
  direktor: string;
  kompanija: string;
  adresa: string;
  maticniBroj: string;
  pib: string;
  marka: string;
  model: string;
  registracija: string;
  datumPotpisa: string;
}
export interface PoljaResenjeOdsustvoFormValues {
  zaposleni: string;
  direktor: string;
  kompanija: string;
  adresa: string;
  maticniBroj: string;
  pib: string;
  clanZakona: string;
  nazivAkta: string;
  lokacija: string;
  datumPisanja: string;
  datumPotpisa: string;
  razlogOdsustva: string;
  periodOdsustva: string;
  broj: string;
  nazivPoslova: string;
  odredjenoNeodredjeno: string;
  brojUgovora: string;
  ovlascenoLice: string;
  dostavljeno2: string;
  dostavljeno3: string;
  datumPocetka?: string;
  datumZavrsetka?: string;
}
export interface PoljaResenjeZamenaGodisnjiFormValues {
  kompanija: string;
  adresa: string;
  broj: string;
  mesto: string;
  datum: string;
  zakon: string;
  clanZakona: string;
  clanUgovora: string;
  brojOvlascenja: string;
  direktor: string;
  zaposleni: string;
  nazivPosla: string;
  brojResenja: string;
  brojRada: string;
  mestoDomaZdravlja: string;
  dostavljeno2: string;
  dostavljeno3: string;
  datumPocetka: string;
  datumZavrsetka: string;
  trajanjeUDanima?: string;
}
export interface PoljaUgovorORaduFormValues {
  kompanija: string;
  maticniBroj: string;
  pib: string;
  adresa: string;
  datumPotpisa: string;
  direktor: string;
  zaposleni: string;
  posao: string;
  stepenStrucneSpreme: string;
  mestoRodjenja: string;
  zanimanje: string;
  odredjenoNeodredjeno: string;
  datumPocetka: string;
  datumZavrsetka: string;
  nadoknadaZaIshranu: string;
  regresZaGodisnji: string;
  odgovornost: string;
  plata: string;
}
type PoljaFormValues = PoljaPlanFormValues | PoljaUgovorVoziloFormValues | PoljaResenjeOdsustvoFormValues | PoljaResenjeZamenaGodisnjiFormValues | PoljaUgovorORaduFormValues;

interface PoljaFormProps {
  open: boolean;
  onClose: () => void;
  values: PoljaFormValues;
  onChange: (values: PoljaFormValues) => void;
  onAddStavka?: (stavka: { zaposleni: string; nekorisceni: string; korisceni: string }) => void;
  docType?: 'plan' | 'ugovor-vozilo' | 'resenje-odsustvo' | 'resenje-zamena-godisnji' | 'ugovor-o-radu';
}

const lokacije = ["Beograd", "Novi Sad", "Niš", "Kragujevac", "Drugo..."];
const korisnici = ["Milan Jovanović", "Ana Petrović", "Marko Marković"];
const direktori = ["Petar Petrović", "Jelena Ilić"];
const registracije = ["BG123AA", "NS456BB", "NI789CC"];

export default function PoljaForm({ open, onClose, values, onChange, onAddStavka, docType = 'plan' }: PoljaFormProps) {
  const [form, setForm] = useState<PoljaFormValues>(values);
  const [lokacijaInput, setLokacijaInput] = useState("");
  const [showCustomLokacija, setShowCustomLokacija] = useState(false);
  const [showStavkaForm, setShowStavkaForm] = useState(false);
  const [stavka, setStavka] = useState({ zaposleni: "", nekorisceni: "", korisceni: "" });

  // Kada se otvori forma, inicijalizuj lokalni state iz props.values
  useEffect(() => {
    if (open) {
      setForm(values);
      if (docType === 'plan') {
        const v = values as PoljaPlanFormValues;
        setLokacijaInput(v.lokacija && !lokacije.includes(v.lokacija) ? v.lokacija : "");
        setShowCustomLokacija(Boolean(v.lokacija && !lokacije.includes(v.lokacija)));
      }
    }
    // eslint-disable-next-line
  }, [open, values, docType]);

  // Kada se forma zatvori, pošalji promene parentu
  const handleClose = () => {
    if (docType === 'plan') {
      onChange({ ...(form as PoljaPlanFormValues), lokacija: showCustomLokacija ? lokacijaInput : (form as PoljaPlanFormValues).lokacija });
    } else if (docType === 'ugovor-vozilo') {
      onChange(form as PoljaUgovorVoziloFormValues);
    } else if (docType === 'resenje-odsustvo') {
      onChange(form as PoljaResenjeOdsustvoFormValues);
    } else if (docType === 'resenje-zamena-godisnji') {
      onChange(form as PoljaResenjeZamenaGodisnjiFormValues);
    } else if (docType === 'ugovor-o-radu') {
      onChange(form as PoljaUgovorORaduFormValues);
    }
    onClose();
  };

  if (!open) return null;

  return (
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
          {docType === 'plan' && (
            <>
              <label className="text-sm font-medium">Član zakona
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="text"
                  value={(form as PoljaPlanFormValues).clanZakona}
                  onChange={e => setForm((f) => ({ ...(f as PoljaPlanFormValues), clanZakona: e.target.value }))}
                  placeholder="Unesite član zakona"
                />
              </label>
              <label className="text-sm font-medium">Naziv opšteg akta poslodavca
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="text"
                  value={(form as PoljaPlanFormValues).nazivAkta}
                  onChange={e => setForm((f) => ({ ...(f as PoljaPlanFormValues), nazivAkta: e.target.value }))}
                  placeholder="Unesite naziv akta"
                />
              </label>
              <label className="text-sm font-medium">Lokacija
                <select
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  value={showCustomLokacija ? "custom" : (form as PoljaPlanFormValues).lokacija}
                  onChange={e => {
                    if (e.target.value === "custom") {
                      setShowCustomLokacija(true);
                      setForm(f => ({ ...(f as PoljaPlanFormValues), lokacija: lokacijaInput }));
                    } else {
                      setShowCustomLokacija(false);
                      setForm(f => ({ ...(f as PoljaPlanFormValues), lokacija: e.target.value }));
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
                      setForm(f => ({ ...(f as PoljaPlanFormValues), lokacija: e.target.value }));
                    }}
                    placeholder="Unesite lokaciju"
                  />
                )}
              </label>
              <label className="text-sm font-medium">Godina
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="number"
                  value={(form as PoljaPlanFormValues).godina}
                  onChange={e => setForm(f => ({ ...(f as PoljaPlanFormValues), godina: e.target.value }))}
                  min="2000"
                  max="2100"
                />
              </label>
              <label className="text-sm font-medium">Datum pisanja
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="date"
                  value={(form as PoljaPlanFormValues).datumPisanja}
                  onChange={e => setForm(f => ({ ...(f as PoljaPlanFormValues), datumPisanja: e.target.value }))}
                />
              </label>
              <label className="text-sm font-medium">Datum potpisivanja
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="date"
                  value={(form as PoljaPlanFormValues).datumPotpisa}
                  onChange={e => setForm(f => ({ ...(f as PoljaPlanFormValues), datumPotpisa: e.target.value }))}
                />
              </label>
              <div className="flex gap-1 mt-2">
                <button type="button" className="flex-1 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg cursor-pointer">Zaposleni</button>
                <button type="button" className="flex-1 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg cursor-pointer">Nekorišćeni</button>
                <button type="button" className="flex-1 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg cursor-pointer">Korišćeni</button>
              </div>
              <button type="button" className="w-full mt-2 bg-[#e5e8ef] text-[#3A3CA6] font-semibold py-2 rounded-lg flex items-center justify-center gap-2" onClick={() => setShowStavkaForm(true)}>
                <span className="text-xl">＋</span> Nova stavka
              </button>
            </>
          )}
          {docType === 'ugovor-vozilo' && (
            <>
              <label className="text-sm font-medium">Korisnici
                <select
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  value={(form as PoljaUgovorVoziloFormValues).korisnik || ''}
                  onChange={e => setForm(f => ({ ...(f as PoljaUgovorVoziloFormValues), korisnik: e.target.value }))}
                >
                  <option value="">Izaberite korisnika</option>
                  {korisnici.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Direktor
                <select
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  value={(form as PoljaUgovorVoziloFormValues).direktor || ''}
                  onChange={e => setForm(f => ({ ...(f as PoljaUgovorVoziloFormValues), direktor: e.target.value }))}
                >
                  <option value="">Izaberite direktora</option>
                  {direktori.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Kompanija
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="text"
                  value={(form as PoljaUgovorVoziloFormValues).kompanija || ''}
                  onChange={e => setForm(f => ({ ...(f as PoljaUgovorVoziloFormValues), kompanija: e.target.value }))}
                  placeholder="Kompanija 1"
                />
              </label>
              <label className="text-sm font-medium">Adresa
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="text"
                  value={(form as PoljaUgovorVoziloFormValues).adresa || ''}
                  onChange={e => setForm(f => ({ ...(f as PoljaUgovorVoziloFormValues), adresa: e.target.value }))}
                />
              </label>
              <label className="text-sm font-medium">Matični broj
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="text"
                  value={(form as PoljaUgovorVoziloFormValues).maticniBroj || ''}
                  onChange={e => setForm(f => ({ ...(f as PoljaUgovorVoziloFormValues), maticniBroj: e.target.value }))}
                />
              </label>
              <label className="text-sm font-medium">PIB
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="text"
                  value={(form as PoljaUgovorVoziloFormValues).pib || ''}
                  onChange={e => setForm(f => ({ ...(f as PoljaUgovorVoziloFormValues), pib: e.target.value }))}
                />
              </label>
              <label className="text-sm font-medium">Marka
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="text"
                  value={(form as PoljaUgovorVoziloFormValues).marka || ''}
                  onChange={e => setForm(f => ({ ...(f as PoljaUgovorVoziloFormValues), marka: e.target.value }))}
                />
              </label>
              <label className="text-sm font-medium">Model
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="text"
                  value={(form as PoljaUgovorVoziloFormValues).model || ''}
                  onChange={e => setForm(f => ({ ...(f as PoljaUgovorVoziloFormValues), model: e.target.value }))}
                />
              </label>
              <label className="text-sm font-medium">Registracija vozila
                <select
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  value={(form as PoljaUgovorVoziloFormValues).registracija || ''}
                  onChange={e => setForm(f => ({ ...(f as PoljaUgovorVoziloFormValues), registracija: e.target.value }))}
                >
                  <option value="">Izaberite registraciju</option>
                  {registracije.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Datum potpisivanja
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]"
                  type="date"
                  value={(form as PoljaUgovorVoziloFormValues).datumPotpisa || ''}
                  onChange={e => setForm(f => ({ ...(f as PoljaUgovorVoziloFormValues), datumPotpisa: e.target.value }))}
                />
              </label>
            </>
          )}
          {docType === 'resenje-odsustvo' && (
            <>
              <label className="text-sm font-medium">Kompanija
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).kompanija || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), kompanija: e.target.value }))} placeholder="Kompanija 1" />
              </label>
              <label className="text-sm font-medium">Adresa
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).adresa || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), adresa: e.target.value }))} placeholder="Adresa" />
              </label>
              <label className="text-sm font-medium">Zakon
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).clanZakona || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), clanZakona: e.target.value }))} placeholder="Zakon" />
              </label>
              <label className="text-sm font-medium">Nadležni organ
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).nazivAkta || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), nazivAkta: e.target.value }))} placeholder="Nadležni organ" />
              </label>
              <label className="text-sm font-medium">Korisnici
                <select className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" value={(form as PoljaResenjeOdsustvoFormValues).zaposleni || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), zaposleni: e.target.value }))}>
                  <option value="">Izaberite korisnika</option>
                  {korisnici.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Matični broj
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).maticniBroj || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), maticniBroj: e.target.value }))} placeholder="Matični broj" />
              </label>
              <label className="text-sm font-medium">Ovlašćeno lice
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).ovlascenoLice || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), ovlascenoLice: e.target.value }))} placeholder="Ovlašćeno lice" />
              </label>
              <label className="text-sm font-medium">Lokacija
                <select className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" value={(form as PoljaResenjeOdsustvoFormValues).lokacija || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), lokacija: e.target.value }))}>
                  <option value="">Izaberite lokaciju</option>
                  {lokacije.map(lok => <option key={lok} value={lok}>{lok}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Posao
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).nazivPoslova || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), nazivPoslova: e.target.value }))} placeholder="Posao" />
              </label>
              <label className="text-sm font-medium">Period
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).periodOdsustva || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), periodOdsustva: e.target.value }))} placeholder="Period" />
              </label>
              <label className="text-sm font-medium">Vrsta zaposlenja
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).odredjenoNeodredjeno || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), odredjenoNeodredjeno: e.target.value }))} placeholder="Vrsta zaposlenja" />
              </label>
              <label className="text-sm font-medium">Broj ugovora
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).brojUgovora || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), brojUgovora: e.target.value }))} placeholder="Broj ugovora" />
              </label>
              <label className="text-sm font-medium">Dostavljeno 2
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).dostavljeno2 || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), dostavljeno2: e.target.value }))} placeholder="Dostavljeno 2" />
              </label>
              <label className="text-sm font-medium">Dostavljeno 3
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeOdsustvoFormValues).dostavljeno3 || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), dostavljeno3: e.target.value }))} placeholder="Dostavljeno 3" />
              </label>
              <label className="text-sm font-medium">Datum zaključenja ugovora
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaResenjeOdsustvoFormValues).datumPisanja || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), datumPisanja: e.target.value }))} />
              </label>
              <label className="text-sm font-medium">Datum zahtevanja odsustva
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaResenjeOdsustvoFormValues).datumPotpisa || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), datumPotpisa: e.target.value }))} />
              </label>
              <label className="text-sm font-medium">Datum potpisivanja ugovora o zapošljavanju
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaResenjeOdsustvoFormValues).datumPotpisa || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), datumPotpisa: e.target.value }))} />
              </label>
              <div className="flex gap-2">
                <label className="text-sm font-medium flex-1">Datum početka
                  <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaResenjeOdsustvoFormValues).datumPocetka || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), datumPocetka: e.target.value }))} />
                </label>
                <div className="flex items-end pb-2">→</div>
                <label className="text-sm font-medium flex-1">Datum završetka
                  <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaResenjeOdsustvoFormValues).datumZavrsetka || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeOdsustvoFormValues), datumZavrsetka: e.target.value }))} />
                </label>
              </div>
            </>
          )}
          {docType === 'resenje-zamena-godisnji' && (
            <>
              <label className="text-sm font-medium">Kompanija
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).kompanija || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), kompanija: e.target.value }))} placeholder="Kompanija 1" />
              </label>
              <label className="text-sm font-medium">Broj kompanije
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).broj || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), broj: e.target.value }))} placeholder="Broj kompanije" />
              </label>
              <label className="text-sm font-medium">Adresa
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).adresa || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), adresa: e.target.value }))} placeholder="Adresa" />
              </label>
              <label className="text-sm font-medium">Zakon
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).zakon || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), zakon: e.target.value }))} placeholder="Zakon" />
              </label>
              <label className="text-sm font-medium">Član zakona
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).clanZakona || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), clanZakona: e.target.value }))} placeholder="Član zakona" />
              </label>
              <label className="text-sm font-medium">Direktor
                <select className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" value={(form as PoljaResenjeZamenaGodisnjiFormValues).direktor || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), direktor: e.target.value }))}>
                  <option value="">Izaberite direktora</option>
                  {direktori.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Član ugovora
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).clanUgovora || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), clanUgovora: e.target.value }))} placeholder="Član ugovora" />
              </label>
              <label className="text-sm font-medium">Datum ugovora
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaResenjeZamenaGodisnjiFormValues).datum || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), datum: e.target.value }))} />
              </label>
              <label className="text-sm font-medium">Broj ovlašćenja
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).brojOvlascenja || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), brojOvlascenja: e.target.value }))} placeholder="Broj ovlašćenja" />
              </label>
              <label className="text-sm font-medium">Dostavljeno 2
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).dostavljeno2 || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), dostavljeno2: e.target.value }))} placeholder="Dostavljeno 2" />
              </label>
              <label className="text-sm font-medium">Dostavljeno 3
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).dostavljeno3 || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), dostavljeno3: e.target.value }))} placeholder="Dostavljeno 3" />
              </label>
              <label className="text-sm font-medium">Adresa
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).adresa || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), adresa: e.target.value }))} placeholder="Adresa" />
              </label>
              <label className="text-sm font-medium">Korisnici
                <select className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" value={(form as PoljaResenjeZamenaGodisnjiFormValues).zaposleni || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), zaposleni: e.target.value }))}>
                  <option value="">Izaberite korisnika</option>
                  {korisnici.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Posao
                <select className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" value={(form as PoljaResenjeZamenaGodisnjiFormValues).nazivPosla || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), nazivPosla: e.target.value }))}>
                  <option value="">Izaberite posao</option>
                  <option value="Radno mesto 1">Radno mesto 1</option>
                  <option value="Radno mesto 2">Radno mesto 2</option>
                </select>
              </label>
              <label className="text-sm font-medium">Godina
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="number" value={2025} readOnly />
              </label>
              <label className="text-sm font-medium">Trajanje u danima
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="number" value={(form as PoljaResenjeZamenaGodisnjiFormValues).trajanjeUDanima || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), trajanjeUDanima: e.target.value }))} placeholder="Trajanje u danima" />
              </label>
              <div className="flex gap-2">
                <label className="text-sm font-medium flex-1">Datum početka
                  <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaResenjeZamenaGodisnjiFormValues).datumPocetka || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), datumPocetka: e.target.value }))} />
                </label>
                <div className="flex items-end pb-2">→</div>
                <label className="text-sm font-medium flex-1">Datum završetka
                  <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaResenjeZamenaGodisnjiFormValues).datumZavrsetka || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), datumZavrsetka: e.target.value }))} />
                </label>
              </div>
              <label className="text-sm font-medium">Broj rešenja
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).brojResenja || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), brojResenja: e.target.value }))} placeholder="Broj rešenja" />
              </label>
              <label className="text-sm font-medium">Datum rešenja
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaResenjeZamenaGodisnjiFormValues).datum || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), datum: e.target.value }))} />
              </label>
              <label className="text-sm font-medium">Broj rada
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).brojRada || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), brojRada: e.target.value }))} placeholder="Broj rada" />
              </label>
              <label className="text-sm font-medium">Mesto doma zdravlja
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaResenjeZamenaGodisnjiFormValues).mestoDomaZdravlja || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), mestoDomaZdravlja: e.target.value }))} placeholder="Mesto doma zdravlja" />
              </label>
              <label className="text-sm font-medium">Datum podnošenja
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaResenjeZamenaGodisnjiFormValues).datum || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), datum: e.target.value }))} />
              </label>
              <label className="text-sm font-medium">Mesto
                <select className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" value={(form as PoljaResenjeZamenaGodisnjiFormValues).mesto || ''} onChange={e => setForm(f => ({ ...(f as PoljaResenjeZamenaGodisnjiFormValues), mesto: e.target.value }))}>
                  <option value="">Izaberite mesto</option>
                  {lokacije.map(lok => <option key={lok} value={lok}>{lok}</option>)}
                </select>
              </label>
            </>
          )}
          {docType === 'ugovor-o-radu' && (
            <>
              <label className="text-sm font-medium">Kompanija
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).kompanija || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), kompanija: e.target.value }))} placeholder="Kompanija" />
              </label>
              <label className="text-sm font-medium">Matični broj
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).maticniBroj || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), maticniBroj: e.target.value }))} placeholder="Matični broj" />
              </label>
              <label className="text-sm font-medium">PIB
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).pib || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), pib: e.target.value }))} placeholder="PIB" />
              </label>
              <label className="text-sm font-medium">Adresa
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).adresa || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), adresa: e.target.value }))} placeholder="Adresa" />
              </label>
              <label className="text-sm font-medium">Datum potpisivanja
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaUgovorORaduFormValues).datumPotpisa || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), datumPotpisa: e.target.value }))} />
              </label>
              <label className="text-sm font-medium">Direktor
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).direktor || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), direktor: e.target.value }))} placeholder="Direktor" />
              </label>
              <label className="text-sm font-medium">Zaposleni
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).zaposleni || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), zaposleni: e.target.value }))} placeholder="Zaposleni" />
              </label>
              <label className="text-sm font-medium">Posao
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).posao || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), posao: e.target.value }))} placeholder="Posao" />
              </label>
              <label className="text-sm font-medium">Stepen stručne spreme
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).stepenStrucneSpreme || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), stepenStrucneSpreme: e.target.value }))} placeholder="Stepen stručne spreme" />
              </label>
              <label className="text-sm font-medium">Mesto rođenja zaposlenog
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).mestoRodjenja || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), mestoRodjenja: e.target.value }))} placeholder="Mesto rođenja" />
              </label>
              <label className="text-sm font-medium">Zanimanje zaposlenog
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).zanimanje || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), zanimanje: e.target.value }))} placeholder="Zanimanje" />
              </label>
              <label className="text-sm font-medium">Određeno ili neodređeno
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).odredjenoNeodredjeno || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), odredjenoNeodredjeno: e.target.value }))} placeholder="Određeno ili neodređeno" />
              </label>
              <label className="text-sm font-medium">Datum početka
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaUgovorORaduFormValues).datumPocetka || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), datumPocetka: e.target.value }))} />
              </label>
              <label className="text-sm font-medium">Datum završetka
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="date" value={(form as PoljaUgovorORaduFormValues).datumZavrsetka || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), datumZavrsetka: e.target.value }))} />
              </label>
              <label className="text-sm font-medium">Nadoknada za ishranu
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).nadoknadaZaIshranu || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), nadoknadaZaIshranu: e.target.value }))} placeholder="Nadoknada za ishranu" />
              </label>
              <label className="text-sm font-medium">Regres za korišćenje godišnjeg odmora
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).regresZaGodisnji || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), regresZaGodisnji: e.target.value }))} placeholder="Regres za godišnji" />
              </label>
              <label className="text-sm font-medium">Odgovornost
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).odgovornost || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), odgovornost: e.target.value }))} placeholder="Odgovornost" />
              </label>
              <label className="text-sm font-medium">Plata
                <input className="mt-1 w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#3A3CA6]" type="text" value={(form as PoljaUgovorORaduFormValues).plata || ''} onChange={e => setForm(f => ({ ...(f as PoljaUgovorORaduFormValues), plata: e.target.value }))} placeholder="Plata" />
              </label>
            </>
          )}
          <div className="flex gap-1 mt-2">
            <button type="submit" className="flex-1 bg-[#3A3CA6] text-white font-semibold py-2 rounded-lg cursor-pointer">Sačuvaj</button>
          </div>
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