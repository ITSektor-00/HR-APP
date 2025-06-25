'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  // Helper za tooltip
  function Tooltip({ children, label }: { children: React.ReactNode, label: string }) {
    return (
      <div className="relative group">
        {children}
        <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-[#e5e7eb] text-[#343741] text-[15px] font-semibold shadow border border-[#e5e7eb] opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap z-20">
          {label}
        </span>
      </div>
    )
  }

  return (
    <nav className={`flex flex-col items-center ${sidebarOpen ? 'py-1 gap-0.5 h-full w-full' : 'py-1 gap-0 h-full w-12'} overflow-x-hidden`}>
      <div className="flex flex-col w-full">
        <SidebarItem
          href="/"
          icon={<img src="/ikonice/komandnaTabla.svg" alt="Komandna tabla" className="w-4 h-4" />}
          label="Komandna tabla"
          active={pathname === '/'}
          sidebarOpen={sidebarOpen}
          Tooltip={Tooltip}
        />
      </div>
      {sections.map((section, idx) => (
        <div key={section.title} className="flex flex-col w-full mt-1.5">
          {!sidebarOpen && idx !== 0 && (
            <div className="w-7 h-0.5 bg-[#e5e7eb] mx-auto my-1 rounded-full opacity-70" />
          )}
          {sidebarOpen && (
            <div className="text-[10px] text-[#7c7e8c] font-bold px-2 mb-0.5 mt-2 tracking-widest uppercase">
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
                Tooltip={Tooltip}
              />
            ))}
          </div>
        </div>
      ))}
      {/* Dugme za otvaranje sidebar-a na dnu liste, samo kada je zatvoren */}
      {!sidebarOpen && (
        <button
          className="mt-4 mb-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#e5e7eb] text-[#3A3CA6] hover:bg-[#3A3CA6] hover:text-white transition-colors duration-150 shadow border border-[#e5e7eb]"
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

function SidebarItem({ href, icon, label, active, sidebarOpen, Tooltip }: { href: string, icon?: React.ReactElement, label: string, active: boolean, sidebarOpen: boolean, Tooltip: any }) {
  // Kada je zatvoren sidebar, hover efekat i tooltip
  if (!sidebarOpen) {
    return (
      <Tooltip label={label}>
        <Link
          href={href}
          scroll={false}
          className={`flex items-center justify-center w-full h-10 my-0.5 rounded-lg transition-colors duration-100
            ${active ? 'bg-white text-black font-bold' : 'text-[#343741]'}
            hover:bg-[#e5e7eb] focus:outline-none
          `}
          tabIndex={0}
        >
          <span className={`w-5 h-5 flex items-center justify-center ${active ? 'font-bold' : ''}`}>{icon}</span>
        </Link>
      </Tooltip>
    )
  }
  // Otvoreni sidebar - stara logika
  return (
    <Link
      href={href}
      scroll={false}
      className={`flex items-center w-full px-0 py-1.5 transition-all duration-200 group relative overflow-hidden
        ${active ? 'bg-white rounded-r-full font-bold text-black' : 'text-[#343741] font-normal'}
        ${!active && 'hover:bg-[#f3f4f6]'}
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
      {/* Tooltip za zatvoren sidebar */}
      {!sidebarOpen && (
        <span className="absolute left-full ml-2 px-2 py-1 rounded bg-[#e5e7eb] text-[#343741] text-[15px] font-semibold shadow border border-[#e5e7eb] opacity-100 group-hover:opacity-100 transition-opacity duration-75 whitespace-nowrap z-20 pointer-events-none">
          {label}
        </span>
      )}
    </Link>
  )
} 