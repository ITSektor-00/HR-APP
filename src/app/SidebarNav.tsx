'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface NavLink {
  href: string
  label: string
  icon?: React.ReactElement
}

const sections = [
  {
    title: 'PRISUSTVO',
    links: [
      { href: '/prisustvo/hronologija', label: 'Hronologija', icon: <img src="/ikonice/hronologija.svg" alt="Hronologija" className="w-4 h-4" /> },
      { href: '/prisustvo/prisustva', label: 'Prisustva', icon: <img src="/ikonice/prisustva.svg" alt="Prisustva" className="w-4 h-4" /> },
      { href: '/prisustvo/odsustva', label: 'Odsustva', icon: <img src="/ikonice/odsustva.svg" alt="Odsustva" className="w-4 h-4" /> },
      { href: '/prisustvo/tokeni', label: 'Tokeni', icon: <img src="/ikonice/tokeni.svg" alt="Tokeni" className="w-4 h-4" /> },
    ] as NavLink[],
  },
  {
    title: 'KORISNICI',
    links: [
      { href: '/korisnici/korisnici', label: 'Korisnici', icon: <img src="/ikonice/korisnici.svg" alt="Korisnici" className="w-4 h-4" /> },
      { href: '/korisnici/beleske', label: 'Beleške', icon: <img src="/ikonice/beleske.svg" alt="Beleške" className="w-4 h-4" /> },
    ] as NavLink[],
  },
  {
    title: 'KANCELARIJA',
    links: [
      { href: '/korisnici/ugovori', label: 'Ugovori', icon: <img src="/ikonice/ugovori.svg" alt="Ugovori" className="w-4 h-4" /> },
      { href: '/korisnici/dokumenti', label: 'Dokumenti', icon: <img src="/ikonice/dokumenti.svg" alt="Dokumenti" className="w-4 h-4" /> },
    ] as NavLink[],
  },
  {
    title: 'ZAPOSLENJE',
    links: [
      { href: '/korisnici/oglasiZaPosao', label: 'Oglasi za posao', icon: <img src="/ikonice/oglasiZaPosao.svg" alt="Oglasi za posao" className="w-4 h-4" /> },
      { href: '/zaposlenje/prijave', label: 'Prijave', icon: <img src="/ikonice/prijave.svg" alt="Prijave" className="w-4 h-4" /> },
      { href: '/zaposlenje/intervjui', label: 'Intervjui', icon: <img src="/ikonice/intervjui.svg" alt="Intervjui" className="w-4 h-4" /> },
    ] as NavLink[],
  },
  {
    title: 'SERTIFIKATI',
    links: [
      { href: '/sertifikati/sertifikati', label: 'Sertifikati', icon: <img src="/ikonice/sertifikati.svg" alt="Sertifikati" className="w-4 h-4" /> },
      { href: '/sertifikati/institucije', label: 'Institucije sertifikata', icon: <img src="/ikonice/institucije.svg" alt="Institucije sertifikata" className="w-4 h-4" /> },
      { href: '/sertifikati/vrsteSertifikati', label: 'Vrste sertifikata', icon: <img src="/ikonice/vrsteSertifikati.svg" alt="Vrste sertifikata" className="w-4 h-4" /> },
    ] as NavLink[],
  },
  {
    title: 'VOZILA',
    links: [
      { href: '/vozila/vozila', label: 'Vozila', icon: <img src="/ikonice/vozila.svg" alt="Vozila" className="w-4 h-4" /> },
      { href: '/vozila/registracijeVozila', label: 'Registracije vozila', icon: <img src="/ikonice/registracijeVozila.svg" alt="Registracije vozila" className="w-4 h-4" /> },
    ] as NavLink[],
  },
  {
    title: 'KOMPANIJA',
    links: [
      { href: '/kompanija/podesavanja', label: 'Podešavanja', icon: <img src="/ikonice/podesavanja.svg" alt="Podešavanja" className="w-4 h-4" /> },
      { href: '/kompanija/uloge', label: 'Uloge', icon: <img src="/ikonice/uloge.svg" alt="Uloge" className="w-4 h-4" /> },
      { href: '/kompanija/pozicije', label: 'Pozicije', icon: <img src="/ikonice/pozicije.svg" alt="Pozicije" className="w-4 h-4" /> },
      { href: '/kompanija/lokacije', label: 'Lokacije', icon: <img src="/ikonice/lokacije.svg" alt="Lokacije" className="w-4 h-4" /> },
      { href: '/kompanija/sektori', label: 'Sektori', icon: <img src="/ikonice/sektori.svg" alt="Sektori" className="w-4 h-4" /> },
      { href: '/kompanija/org-shema', label: 'Organizaciona šema', icon: <img src="/ikonice/org-shema.svg" alt="Organizaciona šema" className="w-4 h-4" /> },
    ] as NavLink[],
  },
]

export default function SidebarNav({ sidebarOpen }: { sidebarOpen: boolean }) {
  const pathname = usePathname()

  return (
    <nav className={`flex flex-col items-center ${sidebarOpen ? 'py-1 gap-0.5 h-full w-full' : 'py-1 gap-0 h-full w-12'} overflow-x-hidden`}>
      <div className="flex flex-col w-full">
        <SidebarItem
          href="/"
          icon={<img src="/ikonice/komandnaTabla.svg" alt="Komandna tabla" className="w-4 h-4" />}
          label="Komandna tabla"
          active={pathname === '/'}
          sidebarOpen={sidebarOpen}
        />
      </div>
      {sections.map((section, idx) => (
        <div key={section.title} className="flex flex-col w-full mt-1.5">
          {!sidebarOpen && idx !== 0 && (
            <div className="w-7 h-0.5 bg-[var(--border-color)] mx-auto my-1 rounded-full opacity-70" />
          )}
          {sidebarOpen && (
            <div className="text-[14px] text-[var(--text-secondary)] font-bold px-2 mb-0.5 mt-2 tracking-widest uppercase">
              {section.title}
            </div>
          )}
          <div className="flex flex-col gap-0.5 w-full">
            {section.links.map((link) => (
              <SidebarItem
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={pathname === link.href}
                sidebarOpen={sidebarOpen}
              />
            ))}
          </div>
        </div>
      ))}
      {/* Dugme za otvaranje sidebar-a na dnu liste, samo kada je zatvoren */}
      {!sidebarOpen && (
        <button
          className="mt-4 mb-2 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--border-color)] text-[#3A3CA6] dark:text-white hover:bg-[#3A3CA6] hover:text-white transition-colors duration-150 shadow border border-[var(--border-color)]"
          style={{ outline: 'none' }}
          tabIndex={0}
          aria-label="Otvori meni"
          onClick={() => {
            // Custom event za otvaranje sidebar-a, biće uhvaćen u parentu
            const event = new CustomEvent('openSidebar', { bubbles: true })
            window.dispatchEvent(event)
          }}
        >
          <span className="text-xl">»</span>
        </button>
      )}
    </nav>
  )
}

function SidebarItem({ href, icon, label, active, sidebarOpen }: { href: string, icon?: React.ReactElement, label: string, active: boolean, sidebarOpen: boolean }) {
  const iconRef = React.useRef<HTMLSpanElement>(null);
  const [tooltipPos, setTooltipPos] = React.useState<{top: number, left: number} | null>(null);

  // On hover, set tooltip position
  function handleMouseEnter() {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
    }
  }
  function handleMouseLeave() {
    setTooltipPos(null);
  }

  if (!sidebarOpen) {
    return (
      <div className="relative flex items-center justify-center w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={href}
          scroll={false}
          className={`flex items-center justify-center w-full h-10 my-0.5 rounded-lg transition-colors duration-100
            ${active ? 'bg-white dark:bg-gray-800 text-black dark:text-white font-bold' : 'text-[var(--text-primary)]'}
            hover:bg-[var(--border-color)] focus:outline-none
          `}
          tabIndex={0}
        >
          <span ref={iconRef} className={`w-5 h-5 flex items-center justify-center ${active ? 'font-bold' : ''}`}>{icon}</span>
        </Link>
        {/* Tooltip koji se pojavljuje odmah na hover, fixed pozicija */}
        {tooltipPos && (
          <span
            className="pointer-events-none fixed px-3 py-1.5 rounded-lg bg-[var(--border-color)] text-[var(--text-primary)] text-[15px] font-semibold shadow-lg border border-[var(--border-color)] opacity-100 whitespace-nowrap z-50 select-none drop-shadow-md"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: 'translateY(-50%)',
              minWidth: 80,
            }}
          >
            {label}
          </span>
        )}
      </div>
    )
  }
  
  // Otvoreni sidebar - stara logika
  return (
    <Link
      href={href}
      scroll={false}
      className={`flex items-center w-full px-0 py-1.5 transition-all duration-200 group relative overflow-hidden
        ${active ? 'bg-white dark:bg-gray-800 rounded-r-full font-bold text-black dark:text-white' : 'text-[var(--text-primary)] font-normal'}
        ${!active && 'hover:bg-[var(--sidebar-bg)]'}
        ${sidebarOpen ? 'pl-0 pr-4' : 'justify-center'}
        ${active && !sidebarOpen ? 'justify-center' : ''}
        focus:outline-none
      `}
      title={label}
      style={{fontSize: 13, minHeight: 32, maxWidth: sidebarOpen ? 220 : 48, overflow: 'hidden'}}
    >
      <span className={`w-4 h-4 flex items-center justify-center z-10 ${active ? 'font-bold' : ''}`}>{icon}</span>
      {sidebarOpen && (
        <span className={`truncate z-10 ${active ? 'font-bold' : 'font-normal'} hover:underline`} style={{maxWidth: 120, marginLeft: 8}}>{label}</span>
      )}
    </Link>
  )
} 