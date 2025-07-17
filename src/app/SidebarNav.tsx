/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import DynamicIcon from './components/DynamicIcon'
import SidebarControl from "./SidebarControl";
import { useSidebarMode } from "./ClientLayoutShell";

interface NavLink {
  href: string
  label: string
  icon?: React.ReactElement
}

const sections = [
  {
    title: 'PRISUSTVO',
    links: [
      { href: '/prisustvo/hronologija', label: 'Hronologija', icon: <DynamicIcon iconName="hronologija" alt="Hronologija" /> },
      { href: '/prisustvo/prisustva', label: 'Prisustva', icon: <DynamicIcon iconName="prisustva" alt="Prisustva" /> },
      { href: '/prisustvo/odsustva', label: 'Odsustva', icon: <DynamicIcon iconName="odsustva" alt="Odsustva" /> },
      { href: '/prisustvo/tokeni', label: 'Tokeni', icon: <DynamicIcon iconName="tokeni" alt="Tokeni" /> },
    ] as NavLink[],
  },
  {
    title: 'Zaposleni',
    links: [
      { href: '/zaposleni/korisnici', label: 'Zaposleni', icon: <DynamicIcon iconName="korisnici" alt="Zaposleni" /> },
      { href: '/korisnici/beleske', label: 'Beleške', icon: <DynamicIcon iconName="beleske" alt="Beleške" /> },
    ] as NavLink[],
  },
  {
    title: 'KANCELARIJA',
    links: [
      { href: '/ugovori', label: 'Ugovori', icon: <DynamicIcon iconName="ugovori" alt="Ugovori" /> },
      { href: '/korisnici/dokumenti', label: 'Dokumenti', icon: <DynamicIcon iconName="dokumenti" alt="Dokumenti" /> },
    ] as NavLink[],
  },
  {
    title: 'ZAPOSLENJE',
    links: [
      { href: '/korisnici/oglasiZaPosao', label: 'Oglasi za posao', icon: <DynamicIcon iconName="oglasiZaPosao" alt="Oglasi za posao" /> },
      { href: '/zaposlenje/prijave', label: 'Prijave', icon: <DynamicIcon iconName="prijave" alt="Prijave" /> },
      { href: '/zaposlenje/intervjui', label: 'Intervjui', icon: <DynamicIcon iconName="intervjui" alt="Intervjui" /> },
    ] as NavLink[],
  },
  {
    title: 'SERTIFIKATI',
    links: [
      { href: '/sertifikati/sertifikati', label: 'Sertifikati', icon: <DynamicIcon iconName="sertifikati" alt="Sertifikati" /> },
      { href: '/sertifikati/institucije', label: 'Institucije sertifikata', icon: <DynamicIcon iconName="institucije" alt="Institucije sertifikata" /> },
      { href: '/sertifikati/vrsteSertifikati', label: 'Vrste sertifikata', icon: <DynamicIcon iconName="vrsteSertifikati" alt="Vrste sertifikata" /> },
    ] as NavLink[],
  },
  {
    title: 'VOZILA',
    links: [
      { href: '/vozila/vozila', label: 'Vozila', icon: <DynamicIcon iconName="vozila" alt="Vozila" /> },
      { href: '/vozila/registracijeVozila', label: 'Registracije vozila', icon: <DynamicIcon iconName="registracijeVozila" alt="Registracije vozila" /> },
    ] as NavLink[],
  },
  {
    title: 'KOMPANIJA',
    links: [
      { href: '/kompanija/podesavanja', label: 'Podešavanja', icon: <DynamicIcon iconName="podesavanja" alt="Podešavanja" /> },
      { href: '/kompanija/uloge', label: 'Uloge', icon: <DynamicIcon iconName="uloge" alt="Uloge" /> },
      { href: '/kompanija/pozicije', label: 'Pozicije', icon: <DynamicIcon iconName="pozicije" alt="Pozicije" /> },
      { href: '/kompanija/lokacije', label: 'Lokacije', icon: <DynamicIcon iconName="lokacije" alt="Lokacije" /> },
      { href: '/kompanija/sektori', label: 'Sektori', icon: <DynamicIcon iconName="sektori" alt="Sektori" /> },
      { href: '/kompanija/org-shema', label: 'Organizaciona šema', icon: <DynamicIcon iconName="org-shema" alt="Organizaciona šema" /> },
    ] as NavLink[],
  },
]

export default function SidebarNav({ sidebarOpen }: { sidebarOpen: boolean }) {
  const pathname = usePathname()
  const { mode, setMode } = useSidebarMode();
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [tooltipPos, setTooltipPos] = React.useState<{top: number, left: number, label: string} | null>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!popupOpen) return;
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [popupOpen]);

  // Sakrij tooltip kad sidebar postane expanded
  React.useEffect(() => {
    if (sidebarOpen) setTooltipPos(null);
  }, [sidebarOpen]);

  // Tooltip prikaz
  const showTooltip = (e: React.MouseEvent, label: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipPos({
      top: rect.top + rect.height / 2,
      left: rect.right + 8,
      label,
    });
  };
  const hideTooltip = () => setTooltipPos(null);

  return (
    <nav className={`flex flex-col items-center ${sidebarOpen ? 'py-1 gap-0.5 h-full w-full' : 'py-1 gap-0 h-full w-12'}`} style={{ position: 'relative', height: '100%' }}>
      <div className="flex flex-col w-full flex-1">
        <div className="relative">
          <SidebarItem
            href="/"
            icon={<DynamicIcon iconName="komandnaTabla" alt="Komandna tabla" />}
            label="Komandna tabla"
            active={pathname === '/'}
            sidebarOpen={sidebarOpen}
            onMouseEnter={e => !sidebarOpen && showTooltip(e, 'Komandna tabla')}
            onMouseLeave={hideTooltip}
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
                <div key={link.href} className="relative">
                  <SidebarItem
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                    active={pathname === link.href}
                    sidebarOpen={sidebarOpen}
                    onMouseEnter={e => !sidebarOpen && showTooltip(e, link.label)}
                    onMouseLeave={hideTooltip}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Ikonica sidebar-control ostaje odmah ispod sekcija, popup je fiksiran u donjem levom uglu sidebar-a */}
        <div className={`hidden lg:flex flex-col mt-6 mb-2 ${sidebarOpen ? 'w-full items-start pl-0' : 'w-12 justify-center items-center'}`}>
          <img
            src="/ikonice/sidebar-control.svg"
            alt="Sidebar control"
            className="w-5 h-5 cursor-pointer hover:bg-gray-100 rounded-xl p-0 transition-all"
            onClick={() => setPopupOpen((o) => !o)}
            style={{ userSelect: 'none' }}
          />
        </div>
      </div>
      {/* Popup je fiksiran u donjem levom uglu sidebar-a, nezavisan od ikonice */}
      {popupOpen && (
        <div
          ref={popupRef}
          className="flex flex-col items-stretch bg-white rounded-xl shadow-xl border border-gray-200 py-2 px-2 z-50"
          style={{ position: 'fixed', left: sidebarOpen ? 40 : 56, bottom: 16, minWidth: 110 }}
        >
          <SidebarControl value={mode} onChange={(m) => { setMode(m); setPopupOpen(false); }} />
        </div>
      )}
      {/* Tooltip fixed za collapsed */}
      {!sidebarOpen && tooltipPos && (
        <div
          className="bg-gray-100 text-gray-900 px-3 py-1.5 rounded-xl shadow font-medium z-50 whitespace-nowrap pointer-events-none"
          style={{ position: 'fixed', top: tooltipPos.top, left: tooltipPos.left, transform: 'translateY(-50%)' }}
        >
          {tooltipPos.label}
        </div>
      )}
    </nav>
  )
}

function SidebarItem({ href, icon, label, active, sidebarOpen, onMouseEnter, onMouseLeave }: { 
  href: string, 
  icon?: React.ReactElement, 
  label: string, 
  active: boolean, 
  sidebarOpen: boolean,
  onMouseEnter?: (e: React.MouseEvent) => void,
  onMouseLeave?: () => void
}) {
  if (!sidebarOpen) {
    return (
      <div className="relative flex items-center justify-center w-full">
        <Link
          href={href}
          scroll={false}
          className={`flex items-center justify-center w-full h-10 my-0.5 rounded-lg transition-colors duration-100
            ${active ? 'bg-gray-200 text-black font-bold border border-gray-400' : 'text-[var(--text-primary)]'}
            hover:bg-[var(--border-color)] focus:outline-none
          `}
          tabIndex={0}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <span className={`w-5 h-5 flex items-center justify-center ${active ? 'font-bold' : ''}`}>{icon}</span>
        </Link>
      </div>
    )
  }
  return (
    <Link
      href={href}
      scroll={false}
      className={`flex items-center w-full px-0 py-1.5 transition-all duration-200 group relative overflow-hidden
        ${active ? 'sidebar-active-link' : 'text-[var(--text-primary)] font-normal'}
        ${!active && 'hover:bg-[var(--sidebar-bg)]'}
        ${sidebarOpen ? 'pl-0 pr-4' : 'justify-center'}
        ${active && !sidebarOpen ? 'justify-center' : ''}
        focus:outline-none
      `}
      title={label}
      style={{fontSize: 13, minHeight: 32, maxWidth: sidebarOpen ? 220 : 48, overflow: 'hidden'}}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className={`w-4 h-4 flex items-center justify-center z-10 ${active ? 'font-bold' : ''}`}>{icon}</span>
      {sidebarOpen && (
        <span className={`truncate z-10 ${active ? 'font-bold' : 'font-normal'} hover:underline`} style={{maxWidth: 120, marginLeft: 8}}>{label}</span>
      )}
    </Link>
  )
} 