import React, { useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { useUser } from "./ThemeContext";
<<<<<<< HEAD
import SidebarControl from "./SidebarControl";
import { useSidebarMode } from "./ClientLayoutShell";
=======
// import SidebarControl from "./SidebarControl";
// import { useSidebarMode } from "./ClientLayoutShell";
>>>>>>> luka

type User = {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon?: string;
  slika?: string;
};

export default function Navbar() {
  const [profilOpen, setProfilOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { user, loading } = useUser();
<<<<<<< HEAD
  const { mode, setMode } = useSidebarMode();
=======
  // const { mode, setMode } = useSidebarMode();
>>>>>>> luka

  React.useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  if (loading) return null;

  async function handleLogout() {
    await fetch('/api/odjava', { method: 'POST', credentials: 'include' })
    window.location.replace('/prijava')
  }

  function handleSidebarToggle() {
    const event = new CustomEvent('openSidebar', { bubbles: true })
    window.dispatchEvent(event)
  }

  return (
    <header className="sticky top-0 z-30 h-12 bg-[var(--navbar-bg)] border-b border-[var(--border-color)] flex items-center px-2 sm:px-4 justify-between w-full shadow-sm transition-all duration-300">
      {/* Leva strana: logo i naziv (klikabilno) */}
      <div className="flex items-center gap-2 select-none">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
          <Image
            src="/logoBeli.svg"
            alt="Logo"
            width={36}
            height={36}
            className="w-9 h-9"
            style={{ display: 'inline-block' }}
            priority
          />
          <span className="hidden sm:inline font-semibold text-xl tracking-wide text-white" style={{fontFamily: 'InterVariable, sans-serif', letterSpacing: '0.04em'}}>HR Platforma</span>
        </Link>
      </div>
      {/* Sredina: search input, samo na lg+ */}
      <div className="hidden lg:flex flex-1 justify-center px-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Pretraži sve..."
            className="w-full px-3 py-2 rounded-lg bg-white/90 border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-[#3A3CA6] placeholder:text-[#3A3CA6]/60 font-medium shadow-sm text-sm transition-all duration-300"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-[#3A3CA6]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      {/* Desna strana: hamburger, notifikacije, profil dugme uvek vidljivo */}
      <div className="flex items-center gap-1">
        {/* Hamburger dugme za mobilne */}
        <button
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--navbar-hover)] focus:outline-none lg:hidden text-white transition-colors duration-200"
          aria-label="Otvori meni"
          onClick={handleSidebarToggle}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Notifikacije, samo na md+ */}
        <button className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--navbar-hover)] focus:outline-none transition-colors duration-200">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        {/* Profil dugme uvek vidljivo */}
        <div className="relative">
          <button
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--navbar-hover)] focus:outline-none transition-colors duration-200 bg-primary-200 text-primary-900 font-bold text-lg overflow-hidden"
            onClick={() => user && setProfilOpen(v => !v)}
            aria-label="Profil"
          >
            {user && user.slika ? (
              <Image
                src={user.slika}
                alt="Profil"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover"
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <svg className="w-7 h-7 text-primary-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
              </svg>
            )}
          </button>
          {/* Dropdown samo ako postoji user */}
          {user && profilOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                {user.slika ? (
                  <Image
                    src={user.slika}
                    alt="Profil"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover"
                    priority
                  />
                ) : (
                  <svg className="w-14 h-14 text-primary-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="6" />
                    <path d="M3 21a9 9 0 0 1 18 0" />
                  </svg>
                )}
                <div>
                  <div className="font-bold text-lg text-black">{user.ime} {user.prezime}</div>
                </div>
              </div>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-900 text-black font-semibold mb-2 transition-colors"
                onClick={() => { setModalOpen(true); setProfilOpen(false); }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6l9-9a2.828 2.828 0 10-4-4l-9 9z" />
                </svg>
                Uredi profil
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold"
                onClick={handleLogout}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
                Odjava
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Modal za izmenu profila */}
      {modalOpen && (
        <ProfileModal user={user} onClose={() => setModalOpen(false)} />
      )}
    </header>
  )
}

// Modal za izmenu profila
function ProfileModal({ user, onClose }: { user: User | null, onClose: () => void }) {
  const [ime, setIme] = useState(user?.ime || "")
  const [prezime, setPrezime] = useState(user?.prezime || "")
  const [email, setEmail] = useState(user?.email || "")
  const [telefon, setTelefon] = useState(user?.telefon || "")
  const [lozinka, setLozinka] = useState("")
  const [slika, setSlika] = useState(user?.slika || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setSlika(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch('/api/profil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ime, prezime, email, telefon, lozinka: lozinka || undefined, slika }),
    })
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }
    setLoading(false)
    if (!res.ok) {
      setError(data.error || "Greška pri čuvanju profila.")
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in-up border border-gray-100 z-50 pointer-events-auto">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl cursor-pointer" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Uredi profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-900">Fotografija</label>
            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition border-gray-200" onClick={() => document.getElementById('file-upload')?.click()}>
              {slika ? (
                <Image
                  src={slika}
                  alt="Profil"
                  width={24}
                  height={24}
                  className="w-24 h-24 rounded-full object-cover mb-2"
                  priority
                />
              ) : (
                <span className="text-gray-400">Izaberite ili prevucite datoteku</span>
              )}
              <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900">Ime</label>
              <input type="text" className="w-full rounded-lg border px-3 py-2 bg-white text-gray-900 border-gray-200 placeholder-gray-400" value={ime} onChange={e => setIme(e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900">Prezime</label>
              <input type="text" className="w-full rounded-lg border px-3 py-2 bg-white text-gray-900 border-gray-200 placeholder-gray-400" value={prezime} onChange={e => setPrezime(e.target.value)} required />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900">E-pošta</label>
              <input type="email" className="w-full rounded-lg border px-3 py-2 bg-white text-gray-900 border-gray-200 placeholder-gray-400" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900">Broj telefona</label>
              <input type="tel" className="w-full rounded-lg border px-3 py-2 bg-white text-gray-900 border-gray-200 placeholder-gray-400" value={telefon} onChange={e => setTelefon(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-900">Lozinka</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className="w-full rounded-lg border px-3 py-2 pr-10 bg-white text-gray-900 border-gray-200 placeholder-gray-400" value={lozinka} onChange={e => setLozinka(e.target.value)} placeholder="Lozinka neće biti promenjena ako se ostavi prazna." />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700 transition-colors p-1 rounded-full bg-white shadow-sm border border-gray-200" onClick={() => setShowPassword(v => !v)} aria-label="Prikaži/sakrij lozinku">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.042-3.292M9.88 9.88a3 3 0 104.24 4.24" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">Lozinka neće biti promenjena ako se ostavi prazna.</div>
          </div>
          {error && <div className="text-red-500 text-center font-semibold animate-shake">{error}</div>}
          <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-gray-100">
            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold border-2 transition-all duration-200 shadow-xl
                bg-gradient-to-r from-primary-100 via-primary-200 to-primary-300
                hover:from-primary-200 hover:to-primary-400 hover:scale-105
                active:scale-95
                border-primary-400
                text-black
                ${loading ? "opacity-70 cursor-not-allowed grayscale" : ""}
              `}
              style={{ boxShadow: '0 4px 24px 0 rgba(99,102,241,0.18)' }}
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {loading ? "Čuvam..." : "Sačuvaj"}
            </button>
            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold border border-gray-200" onClick={onClose}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Otkaži
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 