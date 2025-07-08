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
  [key: string]: string | undefined;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (data: KorisnikData) => void;
  korisnik?: KorisnikData;
  editMode?: boolean;
}

const tabs = [
  { key: "licni", label: "Lični podaci", icon: "/korisnici/contacts.svg" },
  { key: "zaposlenje", label: "Zaposlenje", icon: "/korisnici/briefcase.svg" },
  { key: "pristup", label: "Pristup", icon: null },
];

const LockSVG = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="5" y="11" width="14" height="10" rx="2" stroke="#444" strokeWidth="2"/></svg>
);
const EyeSVG = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#888" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2"/></svg>
);
const EyeOffSVG = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.8 21.8 0 0 1 5.06-6.06M9.53 9.53A3.001 3.001 0 0 0 12 15a3 3 0 0 0 2.47-5.47" stroke="#888" strokeWidth="2"/><path d="m1 1 22 22" stroke="#888" strokeWidth="2"/></svg>
);
const CalendarSVG = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" stroke="#888" strokeWidth="2"/><path d="M16 3v4M8 3v4M3 9h18" stroke="#888" strokeWidth="2"/></svg>
);
const MoneySVG = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" stroke="#888" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2"/></svg>
);

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
const PERIODI = ["Po satu", "Dnevno", "Mesečno"];

const CheckSVG = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const XSVG = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const BriefcaseSVG = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M18 7c0-1.654-1.346-3-3-3h-6c-1.654 0-3 1.346-3 3-1.654 0-3 1.346-3 3v7c0 1.654 1.346 3 3 3h12c1.654 0 3-1.346 3-3v-7c0-1.654-1.346-3-3-3zm-9-1h6c.551 0 1 .449 1 1h-8c0-.551.449-1 1-1zm10 11c0 .551-.449 1-1 1h-12c-.551 0-1-.449-1-1v-1h14v1zm-14-2v-5c0-.551.449-1 1-1h12c.551 0 1 .449 1 1v5h-14zM13 12h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1-.45 1-1s-.45-1-1-1z" fill="#fff"/></svg>
);

const DownloadSVG = () => (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const UploadFileSVG = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M13.5 3H12H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H7.5M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V9.75V12V19C19 20.1046 18.1046 21 17 21H16.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 21L12 13M12 13L14.5 15.5M12 13L9.5 15.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const DateTimeKorSVG = () => (
  <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="20" height="16" rx="3" stroke="#222" strokeWidth="2" fill="#fff"/>
    <rect x="8" y="4" width="2" height="6" rx="1" fill="#222"/>
    <rect x="18" y="4" width="2" height="6" rx="1" fill="#222"/>
    <line x1="4" y1="12" x2="24" y2="12" stroke="#222" strokeWidth="2"/>
    <circle cx="22.5" cy="21.5" r="4.5" stroke="#222" strokeWidth="2" fill="#fff"/>
    <line x1="22.5" y1="21.5" x2="22.5" y2="19.5" stroke="#222" strokeWidth="2"/>
    <line x1="22.5" y1="21.5" x2="24.5" y2="21.5" stroke="#222" strokeWidth="2"/>
  </svg>
);

// Add Cloudinary upload helper
async function uploadToCloudinary(file: File): Promise<string | null> {
  const url = `https://api.cloudinary.com/v1_1/dpprqbwvp/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'unsigned-hr-app'); // You must create this unsigned preset in your Cloudinary dashboard
  formData.append('folder', 'HR_APLIKACIJA');
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.secure_url) return data.secure_url;
    return null;
  } catch {
    return null;
  }
}

// Dodaj funkciju za upload PDF-a i ekstrakciju podataka
async function extractFromPdf(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/ekstraktuj-podatke', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Greška pri ekstrakciji podataka iz PDF-a');
  return await res.json();
}

// Custom options for sektor
const sektorOptions = SEKTORI.map(s => ({ value: s.label, label: (
  <span style={{display:'flex',alignItems:'center',gap:6}}>
    <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:s.color}}></span>
    {s.label}
  </span>
)}));

const NoviKorisnikModal: React.FC<Props> = ({ open, onClose, onAdd, korisnik, editMode }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState("licni");
  const [showPassword, setShowPassword] = useState(false);
  const [datumRodjenja, setDatumRodjenja] = useState<Date | null>(null);
  const [datumPocetka, setDatumPocetka] = useState<Date | null>(null);
  const [datumZavrsetka, setDatumZavrsetka] = useState<Date | null>(null);
  const [slika, setSlika] = useState<string | null>(null);
  const [periodPlate, setPeriodPlate] = useState("Mesečno");
  const [showPeriodi, setShowPeriodi] = useState(false);
  const [sektor, setSektor] = useState(SEKTORI[0].label);
  const [showLkModal, setShowLkModal] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const initialErrors = useMemo((): Record<string, string> => ({
    ime: '', prezime: '', pol: '', datum_rodjenja: '', jmbg: '', adresa: '', mesto: '', grad: '', fotografija: '',
    email: '', telefon: '', email_ili_telefon: '', pozicija: '', sektor: '', status_zaposlenja: '', vrsta_zaposlenja: '', broj_radne_dozvole: '',
    datum_pocetka: '', datum_zavrsetka: '', uloga: '', pristup: '', sifra: ''
  }), []);
  
  const [form, setForm] = useState<KorisnikData>({} as KorisnikData);
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);
  const [backendError, setBackendError] = useState<string | null>(null);

  const obaveznaPolja = [
    'ime', 'prezime', 'pol', 'jmbg', 'adresa', 'mesto',
    'broj_radne_dozvole', 'pozicija', 'vrsta_zaposlenja', 'sektor', 'status_zaposlenja', 'datum_pocetka', 'plata',
    'sifra', 'pristup', 'uloga',
  ];

  const [showPopup, setShowPopup] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  useEffect(() => {
    if (open) {
      if (editMode && korisnik) {
        setForm(korisnik);
        setDatumRodjenja(korisnik.datum_rodjenja ? new Date(korisnik.datum_rodjenja) : null);
        setDatumPocetka(korisnik.datum_pocetka ? new Date(korisnik.datum_pocetka) : null);
        setDatumZavrsetka(korisnik.datum_zavrsetka ? new Date(korisnik.datum_zavrsetka) : null);
        setSlika(korisnik.fotografija || null);
        setSektor(korisnik.sektor || SEKTORI[0].label);
        setPeriodPlate(korisnik.period_plate || 'Mesečno');
      } else {
        setForm({} as KorisnikData);
        setDatumRodjenja(null);
        setDatumPocetka(null);
        setDatumZavrsetka(null);
        setSlika(null);
        setSektor(SEKTORI[0].label);
        setPeriodPlate('Mesečno');
      }
      setActiveTab("licni");
      setErrors(initialErrors);
      setBackendError(null);
      setMissingFields([]);
      setTouched({});
      setShowPopup(false);
      setShowPassword(false);
      setShowPeriodi(false);
      setShowLkModal(false);
      setShowLkModal(false);
    }
  }, [open, editMode, korisnik, initialErrors]);

  if (!open) return null;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (obaveznaPolja.includes(name)) {
      setErrors({ ...errors, [name]: value ? '' : 'Obavezno polje' });
    }
    
    // Custom validacija za email/telefon
    if (name === 'email' || name === 'telefon') {
      const email = name === 'email' ? value : form.email;
      const telefon = name === 'telefon' ? value : form.telefon;
      
      if ((!email || email.trim() === '') && (!telefon || telefon.trim() === '')) {
        setErrors({ ...errors, email_ili_telefon: 'Bar jedan od ta dva polja mora biti unet' });
      } else {
        setErrors({ ...errors, email_ili_telefon: '' });
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    if (obaveznaPolja.includes(name)) {
      setErrors({ ...errors, [name]: form[name] ? '' : 'Obavezno polje' });
    }
    
    // Custom validacija za email/telefon na blur
    if (name === 'email' || name === 'telefon') {
      const email = form.email;
      const telefon = form.telefon;
      
      if ((!email || email.trim() === '') && (!telefon || telefon.trim() === '')) {
        setErrors({ ...errors, email_ili_telefon: 'Bar jedan od ta dva polja mora biti unet' });
      } else {
        setErrors({ ...errors, email_ili_telefon: '' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form };
    data.datum_rodjenja = datumRodjenja ? datumRodjenja.toISOString().split("T")[0] : '';
    data.datum_pocetka = datumPocetka ? datumPocetka.toISOString().split("T")[0] : '';
    data.datum_zavrsetka = datumZavrsetka ? datumZavrsetka.toISOString().split("T")[0] : '';
    data.fotografija = slika || '';
    data.sektor = sektor;
    data.period_plate = periodPlate;
    setForm(data);
    
    // Provera obaveznih polja
    const missing: string[] = [];
    obaveznaPolja.forEach(key => {
      if (!data[key] || data[key] === '') missing.push(key);
    });
    
    // Custom validacija za email/telefon - bar jedan mora biti unet
    if ((!data.email || data.email.trim() === '') && (!data.telefon || data.telefon.trim() === '')) {
      missing.push('email_ili_telefon');
    }
    
    setMissingFields(missing);
    if (missing.length > 0) {
      setShowPopup(true);
      return;
    }
    setBackendError(null);
    try {
      await onAdd(data);
    } catch (err: unknown) {
      setBackendError(err instanceof Error ? err.message : 'Greška pri unosu.');
    }
  };

  const handleSlika = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setSlika(ev.target?.result as string);
    reader.readAsDataURL(file);
    // Upload to Cloudinary
    const url = await uploadToCloudinary(file);
    if (url) setSlika(url);
  };

  // Dodaj handler za PDF upload
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await extractFromPdf(file);
      setForm(f => ({
        ...f,
        ime: data.ime || f.ime,
        prezime: data.prezime || f.prezime,
        jmbg: data.jmbg || f.jmbg,
        pol: data.pol === 'M' ? 'Muški' : data.pol === 'Ž' ? 'Ženski' : f.pol,
        adresa: data.prebivaliste || f.adresa,
        datum_rodjenja: data.datum_rodjenja || f.datum_rodjenja,
        mesto: data.mesto_rodjenja || f.mesto,
        // Dodaj još polja po potrebi
      }));
      if (data.datum_rodjenja) setDatumRodjenja(new Date(data.datum_rodjenja.replace(/\./g, '-')));
    } catch {
      alert('Greška pri ekstrakciji podataka iz PDF-a.');
    }
  };

  return (
    <>
      {/* Blur overlay */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-[#f3f4f8] rounded-lg w-full max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl" onClick={onClose}>&times;</button>
          <h2 className="text-xl font-bold mb-4">Novi korisnik</h2>
          {backendError && <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-center">{backendError}</div>}
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-2 border-b pb-2">
              {tabs.map(tab => (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1 px-2 pb-1 border-b-2 transition-all ${activeTab === tab.key ? "border-indigo-600 font-bold text-indigo-700" : "border-transparent text-gray-700"}`}
                >
                  {tab.icon ? <Image src={tab.icon} alt={tab.label} width={18} height={18} /> : <LockSVG />}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            {activeTab === "licni" && (
              <>
                <div className="mb-4">
                  {showLkModal ? (
                    <div className="rounded w-full bg-white border border-gray-200 p-3 flex flex-col gap-3">
                      <button
                        className="flex items-center justify-center gap-2 border-b border-gray-200 pb-2 mb-2 w-full hover:bg-gray-50 transition text-center"
                        onClick={() => setShowLkModal(false)}
                        type="button"
                      >
                        <XSVG />
                        <span className="font-semibold underline cursor-pointer">Otkaži uvoz iz lične karte</span>
                      </button>
                      <div className="flex gap-3 items-start">
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <a
                            href="/hrp-citac.exe"
                            download
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded flex items-center gap-2 w-full justify-center text-sm transition"
                          >
                            <BriefcaseSVG /> Čitač lične karte
                          </a>
                          <span className="text-xs text-gray-600 text-left w-full mt-1">Da biste koristili ovu funkcionalnost morate imati instaliran i pokrenut program HRP Čitač.</span>
                        </div>
                        <div className="flex flex-col items-center justify-center h-full px-1">
                          <span className="text-gray-400 font-bold text-base">ili</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="border-dashed border-2 rounded flex flex-col items-center justify-center py-4 text-gray-400 cursor-pointer hover:bg-gray-50 transition w-full"
                            onClick={() => document.getElementById('json-upload')?.click()}
                          >
                            <span className="mb-1"><UploadFileSVG /></span>
                            <span className="text-indigo-700 underline font-semibold text-sm">Izaberite ili prevucite datoteku</span>
                            <input
                              id="json-upload"
                              type="file"
                              accept="application/json"
                              className="hidden"
                            />
                          </div>
                          <span className="text-xs text-gray-600 text-left w-full mt-1">Prevucite ili izaberite JSON datoteku koja sadrži podatke iz lične karte. Ime datoteke sadrži JMBG i sadrži .json ekstenziju.</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="w-full bg-gray-400/80 hover:bg-gray-500 text-white font-bold underline rounded py-2 flex items-center justify-center gap-2 mb-2 text-base transition"
                      onClick={() => setShowLkModal(true)}
                      style={{ fontWeight: 700 }}
                    >
                      <span className="mr-2"><UploadFileSVG /></span> Uvezi iz lične karte
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Ime</label>
                    <input className="border rounded p-2" name="ime" value={form.ime || ''} onChange={handleInput} onBlur={handleBlur} required />
                    {errors.ime && <div className="text-red-500 text-xs mt-1">* {errors.ime || 'Unesite ime'}</div>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Prezime</label>
                    <input className="border rounded p-2" name="prezime" value={form.prezime || ''} onChange={handleInput} onBlur={handleBlur} required />
                    {errors.prezime && <div className="text-red-500 text-xs mt-1">* {errors.prezime || 'Unesite prezime'}</div>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Pol</label>
                    <select className="border rounded p-2" name="pol" value={form.pol || ''} onChange={handleInput} onBlur={handleBlur} required>
                      <option value="">Pol</option>
                      <option>Muški</option>
                      <option>Ženski</option>
                    </select>
                    {errors.pol && <div className="text-red-500 text-xs mt-1">* {errors.pol || 'Unesite pol'}</div>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Datum rođenja</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 z-10"><CalendarSVG /></span>
                      <DatePicker
                        selected={datumRodjenja}
                        onChange={setDatumRodjenja}
                        dateFormat="dd.MM.yyyy."
                        placeholderText="Izaberi datum (opciono)"
                        className="border rounded pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        calendarClassName="z-50"
                        popperClassName="z-50"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm font-medium">JMBG</label>
                    <input className="border rounded p-2" name="jmbg" value={form.jmbg || ''} onChange={handleInput} onBlur={handleBlur} />
                    {errors.jmbg && <div className="text-red-500 text-xs mt-1">* {errors.jmbg || 'Unesite JMBG'}</div>}
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm font-medium">Adresa</label>
                    <input className="border rounded p-2" name="adresa" value={form.adresa || ''} onChange={handleInput} onBlur={handleBlur} />
                    {errors.adresa && <div className="text-red-500 text-xs mt-1">* {errors.adresa || 'Unesite adresu'}</div>}
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm font-medium">Mesto</label>
                    <input className="border rounded p-2" name="mesto" value={form.mesto || ''} onChange={handleInput} onBlur={handleBlur} />
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm font-medium">Fotografija (opciono)</label>
                    <div
                      className="border-dashed border-2 rounded flex flex-col items-center justify-center py-10 text-gray-400 cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      {slika ? (
                        <Image src={slika} alt="preview" width={80} height={80} className="object-cover rounded mb-2" />
                      ) : (
                        <>
                          <span className="mb-2"><DownloadSVG /></span>
                          <span className="text-2xl font-semibold text-gray-400 mb-1">Izaberite ili prevucite datoteku</span>
                        </>
                      )}
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSlika}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">E-pošta</label>
                    <input className="border rounded p-2" name="email" value={form.email || ''} onChange={handleInput} onBlur={handleBlur} placeholder="Unesite e-poštu" />
                    {errors.email && <div className="text-red-500 text-xs mt-1">* {errors.email || 'Unesite e-poštu'}</div>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Broj telefona</label>
                    <input className="border rounded p-2" name="telefon" value={form.telefon || ''} onChange={handleInput} onBlur={handleBlur} placeholder="Unesite broj telefona" />
                    {errors.telefon && <div className="text-red-500 text-xs mt-1">* {errors.telefon || 'Unesite broj telefona'}</div>}
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-xs text-gray-600">* Bar jedan od ta dva polja (e-pošta ili broj telefona) mora biti unet</span>
                    {errors.email_ili_telefon && <div className="text-red-500 text-xs mt-1">* {errors.email_ili_telefon}</div>}
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm font-medium">Učitaj PDF lične karte</label>
                    <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
                    <span className="text-xs text-gray-600">Automatski popunjava polja iz PDF-a lične karte.</span>
                  </div>
                </div>
              </>
            )}
            {activeTab === "zaposlenje" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-sm font-medium">Broj radne dozvole</label>
                  <input className="border rounded p-2" name="broj_radne_dozvole" value={form.broj_radne_dozvole || ''} onChange={handleInput} onBlur={handleBlur} />
                  {errors.broj_radne_dozvole && <div className="text-red-500 text-xs mt-1">* {errors.broj_radne_dozvole || 'Unesite broj radne dozvole'}</div>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Pozicija</label>
                  <select className="border rounded p-2" name="pozicija" value={form.pozicija || ''} onChange={handleInput} onBlur={handleBlur} required>
                    <option value="">Izaberi poziciju</option>
                    {POZICIJE.map(p => <option key={p}>{p}</option>)}
                  </select>
                  {errors.pozicija && <div className="text-red-500 text-xs mt-1">* {errors.pozicija || 'Unesite poziciju'}</div>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Vrsta zaposlenja</label>
                  <select className="border rounded p-2" name="vrsta_zaposlenja" value={form.vrsta_zaposlenja || ''} onChange={handleInput} onBlur={handleBlur} required>
                    <option value="">Izaberi vrstu</option>
                    {VRSTE_ZAPOSLENJA.map(v => <option key={v}>{v}</option>)}
                  </select>
                  {errors.vrsta_zaposlenja && <div className="text-red-500 text-xs mt-1">* {errors.vrsta_zaposlenja || 'Unesite vrstu zaposlenja'}</div>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Sektor</label>
                  <Select
                    options={sektorOptions}
                    value={sektorOptions.find(opt => opt.value === sektor)}
                    onChange={opt => opt && setSektor(opt.value)}
                    classNamePrefix="react-select"
                    className="w-full"
                    styles={{ menu: (base) => ({ ...base, backgroundColor: 'white', zIndex: 100 }) }}
                  />
                  {errors.sektor && <div className="text-red-500 text-xs mt-1">* {errors.sektor || 'Unesite sektor'}</div>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Status</label>
                  <select className="border rounded p-2" name="status_zaposlenja" value={form.status_zaposlenja || ''} onChange={handleInput} onBlur={handleBlur} required>
                    <option value="">Izaberi status</option>
                    {STATUSI.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {errors.status_zaposlenja && <div className="text-red-500 text-xs mt-1">* {errors.status_zaposlenja || 'Unesite status zaposlenja'}</div>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Datum početka rada</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 z-10"><CalendarSVG /></span>
                    <DatePicker
                      selected={datumPocetka}
                      onChange={setDatumPocetka}
                      dateFormat="dd.MM.yyyy."
                      placeholderText="Izaberi datum"
                      className="border rounded pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      calendarClassName="z-50"
                      popperClassName="z-50"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                  {errors.datum_pocetka && <div className="text-red-500 text-xs mt-1">* {errors.datum_pocetka || 'Unesite datum početka rada'}</div>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Datum završetka rada</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 z-10"><CalendarSVG /></span>
                    <DatePicker
                      selected={datumZavrsetka}
                      onChange={setDatumZavrsetka}
                      dateFormat="dd.MM.yyyy."
                      placeholderText="Izaberi datum (opciono)"
                      className="border rounded pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      calendarClassName="z-50"
                      popperClassName="z-50"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Plata</label>
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center border rounded p-2 bg-gray-50 gap-2">
                      <span className="text-gray-400"><MoneySVG /></span>
                      <input className="w-16 border-none outline-none bg-transparent text-gray-700" name="plata_valuta" placeholder="RSD" value={form.plata_valuta || ''} onChange={handleInput} onBlur={handleBlur} />
                      <input className="w-24 border-none outline-none bg-transparent text-gray-700" name="plata" placeholder="0" type="number" min="0" value={form.plata || ''} onChange={handleInput} onBlur={handleBlur} />
                    </div>
                    <div className="flex items-center justify-center h-full px-3" style={{ minWidth: '48px', minHeight: '48px' }}>
                      <DateTimeKorSVG />
                    </div>
                    <div className="relative">
                      <button type="button" className="ml-2 px-3 py-2 border rounded bg-white font-medium text-gray-700 hover:bg-indigo-50 transition flex items-center gap-2 min-w-[110px]" onClick={() => setShowPeriodi(v => !v)}>
                        <span>{periodPlate}</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {showPeriodi && (
                        <div className="absolute left-0 top-12 bg-white border rounded shadow z-20 min-w-[90px] max-w-[120px] text-sm">
                          {PERIODI.map(period => (
                            <div
                              key={period}
                              className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${periodPlate === period ? "font-bold text-indigo-600" : ""}`}
                              onClick={() => { setPeriodPlate(period); setShowPeriodi(false); }}
                            >
                              <span>{period}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.plata && <div className="text-red-500 text-xs mt-1">* {errors.plata || 'Unesite platu'}</div>}
                </div>
              </div>
            )}
            {activeTab === "pristup" && (
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1 relative">
                  <label className="text-sm font-medium flex items-center gap-2">Lozinka</label>
                  <input
                    className="border rounded p-2 w-full pr-10"
                    name="sifra"
                    type={showPassword ? "text" : "password"}
                    placeholder="Unesite lozinku"
                    autoComplete="new-password"
                    required
                    value={form.sifra || ''}
                    onChange={handleInput}
                    onBlur={handleBlur}
                  />
                  <button type="button" className="absolute right-2 top-8 text-gray-500" tabIndex={-1} onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <EyeOffSVG /> : <EyeSVG />}
                  </button>
                  {errors.sifra && <div className="text-red-500 text-xs mt-1">* {errors.sifra || 'Unesite lozinku'}</div>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Pristup</label>
                  <select className="border rounded p-2" name="pristup" value={form.pristup || ''} onChange={handleInput} onBlur={handleBlur} required>
                    <option value="">Pristup</option>
                    <option value="Aktivan">Aktivan</option>
                    <option value="Neaktivan">Neaktivan</option>
                  </select>
                  {errors.pristup && <div className="text-red-500 text-xs mt-1">* {errors.pristup || 'Unesite pristup'}</div>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Uloga</label>
                  <input className="border rounded p-2" name="uloga" value={form.uloga || ''} onChange={handleInput} onBlur={handleBlur} required />
                  {errors.uloga && <div className="text-red-500 text-xs mt-1">* {errors.uloga || 'Unesite ulogu'}</div>}
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold flex items-center gap-2"
              >
                <CheckSVG /> Sačuvaj
              </button>
              <button type="button" className="bg-gray-200 px-4 py-2 rounded font-semibold flex items-center gap-2" onClick={onClose}>
                <XSVG /> Otkaži
              </button>
            </div>
          </form>
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg flex flex-col items-center">
                <h3 className="text-lg font-bold mb-2 text-red-600">Niste popunili sva obavezna polja!</h3>
                <ul className="text-sm text-gray-700 mb-4 list-disc list-inside">
                  {missingFields.map(f => (
                    <li key={f}>
                      {f === 'email_ili_telefon' 
                        ? '* Unesite bar jedan od sledećih: e-poštu ili broj telefona' 
                        : `* Unesite ${f.replace('_', ' ')}`
                      }
                    </li>
                  ))}
                </ul>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold" onClick={() => setShowPopup(false)}>U redu</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NoviKorisnikModal; 