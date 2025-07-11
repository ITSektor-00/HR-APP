"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './NoviKorisnikModal.css';
import Select from 'react-select';

interface KorisnikData {
  ime: string;
  prezime: string;
  pol: string;
  datum_rodjenja: string;
  jmbg: string;
  adresa: string;
  mesto: string;
  grad?: string;
  fotografija: string;
  email: string;
  telefon?: string;
  pozicija: string;
  sektor: string;
  status_zaposlenja: string;
  vrsta_zaposlenja: string;
  broj_radne_dozvole: string;
  datum_pocetka: string;
  datum_zavrsetka?: string;
  uloga: string;
  pristup: string;
  sifra: string;
  plata?: string;
  period_plate?: string;
  valuta?: string;
  [key: string]: string | undefined;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: KorisnikData) => void;
  korisnik: KorisnikData;
}

const tabs = [
  { key: "licni", label: "Lični podaci", icon: "/ikonice/user-edit.svg" },
  { key: "zaposlenje", label: "Zaposlenje", icon: "/korisnici/briefcase.svg" },
  { key: "pristup", label: "Pristup", icon: "/ikonice/secure-box.svg" },
];



const POZICIJE = [
  "Direktor prodaje", "Finansijski direktor", "Izvršni direktor", "Marketing direktor", "Menadžer ljudskih resursa", "Operativni direktor", "Poslovni analitičar", "Tehnološki direktor"
];
const VRSTE_ZAPOSLENJA = ["Honorano", "Na određeno vreme", "Puno radno vreme"];
const SEKTORI = [
  { label: "Finansije", color: "#d1fae5" },
  { label: "Informacione tehnologije", color: "#fecaca" },
  { label: "Istraživanje i razvoj", color: "#bae6fd" },
  { label: "Ljudski resursi", color: "#c7d2fe" },
  { label: "Logistika", color: "#fef9c3" },
  { label: "Marketing", color: "#a7f3d0" },
  { label: "Prodaja", color: "#fca5a5" },
  { label: "Proizvodnja", color: "#a5b4fc" },
];
const STATUSI = ["Aktivan", "Na odsustvu", "U procesu odlaska"];
const ULOGE = ["Admin", "Korisnik", "Menadžer", "Direktor"];
const PRISTUPI = ["Pun pristup", "Ograničen pristup", "Samo čitanje"];
const PERIODI = ["Po satu", "Dnevno", "Mesečno"];
const VALUTE = ["RSD", "EUR", "USD"];

// Custom options for sektor
const sektorOptions = SEKTORI.map(s => ({ value: s.label, label: (
  <span style={{display:'flex',alignItems:'center',gap:6}}>
    <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:s.color}}></span>
    {s.label}
  </span>
)}));

const UrediKorisnikModal: React.FC<Props> = ({ open, onClose, onSave, korisnik }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState("licni");

  const [datumRodjenja, setDatumRodjenja] = useState<Date | null>(null);
  const [datumPocetka, setDatumPocetka] = useState<Date | null>(null);
  const [datumZavrsetka, setDatumZavrsetka] = useState<Date | null>(null);
  const [slika, setSlika] = useState<string | null>(null);
  const [sektor, setSektor] = useState(SEKTORI[0].label);

  const [valuta, setValuta] = useState(korisnik.valuta || "RSD");

  const initialErrors = useMemo((): Record<string, string> => ({
    ime: '', prezime: '', pol: '', datum_rodjenja: '', jmbg: '', adresa: '', mesto: '', grad: '', fotografija: '',
    email: '', telefon: '', pozicija: '', sektor: '', status_zaposlenja: '', vrsta_zaposlenja: '', broj_radne_dozvole: '',
    datum_pocetka: '', datum_zavrsetka: '', uloga: '', pristup: '', sifra: ''
  }), []);
  
  const [form, setForm] = useState<KorisnikData>({} as KorisnikData);


  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  useEffect(() => {
    if (open && korisnik) {
      setForm(korisnik);
      setDatumRodjenja(korisnik.datum_rodjenja ? new Date(korisnik.datum_rodjenja) : null);
      setDatumPocetka(korisnik.datum_pocetka ? new Date(korisnik.datum_pocetka) : null);
      setDatumZavrsetka(korisnik.datum_zavrsetka ? new Date(korisnik.datum_zavrsetka) : null);
      setSlika(korisnik.fotografija || null);
      setSektor(korisnik.sektor || SEKTORI[0].label);
      setValuta(korisnik.valuta || "RSD");

    }
  }, [open, korisnik, initialErrors]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "valuta") setValuta(value);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields based on active tab
    const tabValidations: Record<string, string[]> = {
      licni: ['ime', 'prezime', 'pol', 'datum_rodjenja', 'jmbg', 'adresa', 'mesto', 'email'],
      zaposlenje: ['pozicija', 'sektor', 'status_zaposlenja', 'vrsta_zaposlenja', 'broj_radne_dozvole', 'datum_pocetka'],
      pristup: ['uloga', 'pristup']
    };

    const requiredFields = tabValidations[activeTab] || [];
    const newErrors: Record<string, string> = { ...initialErrors };

    requiredFields.forEach(field => {
      if (!form[field] || form[field] === '') {
        newErrors[field] = 'Ovo polje je obavezno';
      }
    });


    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    // Prepare final data (uvek šalji SVA polja iz forme)
    const finalData = {
      ...form,
      datum_rodjenja: datumRodjenja ? datumRodjenja.toISOString() : '',
      datum_pocetka: datumPocetka ? datumPocetka.toISOString() : '',
      datum_zavrsetka: datumZavrsetka ? datumZavrsetka.toISOString() : '',
      fotografija: slika || '',
      sektor: sektor,
      valuta: valuta
    };

    onSave(finalData);
  };



  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ pointerEvents: 'auto' }}>
      {/* Backdrop koji blokira klikove na pozadinu */}
      <div className="absolute inset-0 bg-black/50 z-40" style={{ pointerEvents: 'auto' }} onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden z-50">
        {/* Header bez border-b */}
        <div className="flex justify-between items-center p-6">
          <h2 className="text-2xl font-bold">Uredi korisnika</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        {/* Tabovi raspoređeni levo, centar, desno, sa paddingom, bez border linije iznad */}
        <div className="relative">
          <div className="flex justify-between mb-4 px-8 relative z-10 w-full">
            <button
              className={`flex items-center gap-2 px-4 py-2 focus:outline-none font-semibold text-base transition-colors duration-150 ${activeTab === tabs[0].key ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-800 border-b-2 border-transparent'}`}
              onClick={() => setActiveTab(tabs[0].key)}
            >
              <Image src={tabs[0].icon} alt="" width={20} height={20} className="w-5 h-5" />
              <span className="text-lg">{tabs[0].label}</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 focus:outline-none font-semibold text-base transition-colors duration-150 ${activeTab === tabs[1].key ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-800 border-b-2 border-transparent'}`}
              onClick={() => setActiveTab(tabs[1].key)}
            >
              <Image src={tabs[1].icon} alt="" width={20} height={20} className="w-5 h-5" />
              <span className="text-lg">{tabs[1].label}</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 focus:outline-none font-semibold text-base transition-colors duration-150 ${activeTab === tabs[2].key ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-800 border-b-2 border-transparent'}`}
              onClick={() => setActiveTab(tabs[2].key)}
            >
              <Image src={tabs[2].icon} alt="" width={20} height={20} className="w-5 h-5" />
              <span className="text-lg">{tabs[2].label}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form ref={formRef} onSubmit={handleSubmit}>
            {activeTab === "licni" && (
              <div className="bg-[#f6f8fc] rounded-xl shadow-sm p-6 flex items-center gap-6 mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{background:'#e879f9'}}>
                  {((form.ime?.[0] || '').toUpperCase()) + (form.prezime?.[0] || '').toUpperCase()}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{form.ime} {form.prezime}</div>
                  <div className="text-gray-500 text-base">{form.email}</div>
                </div>
              </div>
            )}

            {activeTab === "zaposlenje" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Broj radne dozvole</label>
                  <input
                    type="text"
                    name="broj_radne_dozvole"
                    value={form.broj_radne_dozvole || ''}
                    onChange={handleInput}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pozicija</label>
                  <select
                    name="pozicija"
                    value={form.pozicija || ''}
                    onChange={handleInput}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {POZICIJE.map(poz => (
                      <option key={poz} value={poz}>{poz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vrsta zaposlenja</label>
                  <select
                    name="vrsta_zaposlenja"
                    value={form.vrsta_zaposlenja || ''}
                    onChange={handleInput}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {VRSTE_ZAPOSLENJA.map(vrsta => (
                      <option key={vrsta} value={vrsta}>{vrsta}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sektor</label>
                  <Select
                    value={sektorOptions.find(opt => opt.value === sektor)}
                    onChange={(option) => {
                      setSektor(option?.value || '');
                      setForm(prev => ({ ...prev, sektor: option?.value || '' }));
                    }}
                    options={sektorOptions}
                    className="w-full"
                    placeholder="Izaberi sektor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status_zaposlenja"
                    value={form.status_zaposlenja || ''}
                    onChange={handleInput}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUSI.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-6 col-span-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Datum početka rada</label>
                    <DatePicker
                      selected={datumPocetka}
                      onChange={(date) => setDatumPocetka(date)}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholderText="dd/mm/yyyy"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Datum završetka rada</label>
                    <DatePicker
                      selected={datumZavrsetka}
                      onChange={(date) => setDatumZavrsetka(date)}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholderText="dd/mm/yyyy"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 col-span-2 mt-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plata</label>
                    <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2 gap-2">
                      <Image src="/korisnici/money.svg" alt="valuta" width={24} height={24} className="w-6 h-6 opacity-60" />
                      <select
                        name="valuta"
                        value={valuta}
                        onChange={handleInput}
                        className="bg-transparent outline-none text-gray-500 text-base font-medium"
                        style={{width: 60}}
                      >
                        {VALUTE.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                      <input
                        type="number"
                        name="plata"
                        value={form.plata || ''}
                        onChange={handleInput}
                        className="bg-transparent outline-none flex-1 text-gray-700 text-base font-medium"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period plate</label>
                    <select
                      name="period_plate"
                      value={form.period_plate || ''}
                      onChange={handleInput}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {PERIODI.map(period => (
                        <option key={period} value={period}>{period}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pristup" && (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pristup</label>
                  <select
                    name="pristup"
                    value={form.pristup || ''}
                    onChange={handleInput}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PRISTUPI.map(pristup => (
                      <option key={pristup} value={pristup}>{pristup}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uloga</label>
                  <select
                    name="uloga"
                    value={form.uloga || ''}
                    onChange={handleInput}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ULOGE.map(uloga => (
                      <option key={uloga} value={uloga}>{uloga}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Otkaži
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sačuvaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrediKorisnikModal; 