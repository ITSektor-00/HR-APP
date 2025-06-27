import React, { useState, useEffect } from 'react'
import { useThemeContext } from './ThemeContext'
import DynamicIcon from './components/DynamicIcon'
import Image from "next/image"
import Link from "next/link"

type User = {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon?: string;
  slika?: string;
  // dodaj ostala polja iz baze ako ih imaš
};

export default function Navbar() {
  const { theme, toggleTheme, mounted } = useThemeContext()
  const [profilOpen, setProfilOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.pathname === '/prijava' || window.location.pathname === '/registracija')) return;
    fetch('/api/profil', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
  }, [])

  async function handleLogout() {
    await fetch('/api/odjava', { method: 'POST', credentials: 'include' })
    window.location.replace('/prijava')
  }

  return (
    <header className="sticky top-0 z-30 h-12 bg-[var(--navbar-bg)] border-b border-[var(--border-color)] flex items-center px-2 sm:px-4 justify-between w-full shadow-sm transition-all duration-300">
      {/* Leva strana: logo i naziv */}
      <div className="flex items-center gap-2 select-none">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
          <DynamicIcon 
            iconName="human-resources" 
            alt="HR Platforma" 
            width={28} 
            height={28} 
            className="w-6 h-6 sm:w-7 sm:h-7" 
            priority 
          />
          <span className="hidden sm:inline font-extrabold text-base sm:text-lg tracking-wide text-white" style={{fontFamily: 'InterVariable, sans-serif', letterSpacing: '0.04em'}}>HR Platforma</span>
        </Link>
      </div>
      {/* Sredina: search input, samo na lg+ */}
      <div className="hidden lg:flex flex-1 justify-center px-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Pretraži sve..."
            className="w-full px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 border-0 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-gray-600/50 text-[#3A3CA6] dark:text-white placeholder:text-[#3A3CA6]/60 dark:placeholder:text-gray-400 font-medium shadow-sm text-sm transition-all duration-300"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-[#3A3CA6]/60 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      {/* Desna strana: ikone i profil */}
      <div className="flex items-center gap-1">
        {/* Theme Toggle Button - prelepo dugme */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="theme-toggle inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--navbar-hover)] focus:outline-none focus:ring-2 focus:ring-white/20 text-white relative overflow-hidden group"
            aria-label={theme === 'light' ? 'Prebaci na tamnu temu' : 'Prebaci na svetlu temu'}
          >
            {/* Pozadinska animacija */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            {/* Sun ikonica za svetlu temu */}
            <svg 
              className={`w-5 h-5 transition-all duration-500 ${theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            
            {/* Moon ikonica za tamnu temu */}
            <svg 
              className={`absolute w-5 h-5 transition-all duration-500 ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            
            {/* Glow efekat */}
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${theme === 'light' ? 'shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'shadow-[0_0_20px_rgba(99,102,241,0.3)]'}`}></div>
          </button>
        )}
        
        {/* Hamburger dugme za mobilne */}
        <button
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--navbar-hover)] focus:outline-none lg:hidden text-white transition-colors duration-200"
          aria-label="Otvori meni"
          onClick={() => window.dispatchEvent(new CustomEvent('openSidebar', { bubbles: true }))}
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
        
        {/* Profil meni */}
        {user && (
          <div className="relative">
            <button
              className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--navbar-hover)] focus:outline-none transition-colors duration-200 bg-primary-200 text-primary-900 font-bold text-lg"
              onClick={() => setProfilOpen(v => !v)}
            >
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
                <div className="w-14 h-14 rounded-full bg-primary-200 flex items-center justify-center text-2xl font-bold text-primary-900">
                  {user.ime?.[0]}{user.prezime?.[0]}
                </div>
              )}
            </button>
            {profilOpen && (
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
                    <div className="w-14 h-14 rounded-full bg-primary-200 flex items-center justify-center text-2xl font-bold text-primary-900">
                      {user.ime?.[0]}{user.prezime?.[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-lg text-black">{user.ime} {user.prezime}</div>
                  </div>
                </div>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-900 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-black dark:text-white font-semibold mb-2 transition-colors"
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
        )}
      </div>
      {/* Modal za izmenu profila */}
      {modalOpen && (
        <ProfileModal user={user} onClose={() => setModalOpen(false)} onSave={u => { setUser(u); setModalOpen(false); }} />
      )}
    </header>
  )
}

// Modal za izmenu profila
function ProfileModal({ user, onClose, onSave }: { user: User | null, onClose: () => void, onSave: (u: User | null) => void }) {
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
    onSave(data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/70">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] w-full max-w-lg p-6 relative animate-fade-in-up border border-gray-100 dark:border-gray-700">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Uredi profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-900 dark:text-white">Fotografija</label>
            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition border-gray-200 dark:border-gray-700" onClick={() => document.getElementById('file-upload')?.click()}>
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
                <span className="text-gray-400 dark:text-gray-500">Izaberite ili prevucite datoteku</span>
              )}
              <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900 dark:text-white">Ime</label>
              <input type="text" className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500" value={ime} onChange={e => setIme(e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900 dark:text-white">Prezime</label>
              <input type="text" className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500" value={prezime} onChange={e => setPrezime(e.target.value)} required />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900 dark:text-white">E-pošta</label>
              <input type="email" className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-900 dark:text-white">Broj telefona</label>
              <input type="tel" className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500" value={telefon} onChange={e => setTelefon(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-900 dark:text-white">Lozinka</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className="w-full rounded-lg border px-3 py-2 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500" value={lozinka} onChange={e => setLozinka(e.target.value)} placeholder="Lozinka neće biti promenjena ako se ostavi prazna." />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200 transition-colors p-1 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700" onClick={() => setShowPassword(v => !v)} aria-label="Prikaži/sakrij lozinku">
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
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lozinka neće biti promenjena ako se ostavi prazna.</div>
          </div>
          {error && <div className="text-red-500 text-center font-semibold animate-shake">{error}</div>}
          <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold border-2 transition-all duration-200 shadow-xl
                bg-gradient-to-r from-primary-100 via-primary-200 to-primary-300 dark:from-primary-700 dark:via-primary-800 dark:to-primary-900
                hover:from-primary-200 hover:to-primary-400 dark:hover:from-primary-800 dark:hover:to-primary-950 hover:scale-105
                active:scale-95
                border-primary-400 dark:border-primary-900
                text-black dark:text-white
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
            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold border border-gray-200 dark:border-gray-700" onClick={onClose}>
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