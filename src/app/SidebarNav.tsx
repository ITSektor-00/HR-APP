import Link from 'next/link'

interface NavLink {
  href: string
  label: string
  icon?: React.ReactElement
}

const sections = [
  {
    title: 'PRISUSTVO',
    links: [
      { href: '/prisustvo/hronologija', label: 'Hronologija' },
      { href: '/prisustvo/prisustva', label: 'Prisustva' },
      { href: '/prisustvo/odsustva', label: 'Odsustva' },
      { href: '/prisustvo/tokeni', label: 'Tokeni' },
    ] as NavLink[],
  },
  {
    title: 'KORISNICI',
    links: [
      { href: '/korisnici/korisnici', label: 'Korisnici', icon: <img src="/ikonice/korisnici.svg" alt="Korisnici" className="w-5 h-5" /> },
      { href: '/korisnici/beleske', label: 'Beleške', icon: <img src="/ikonice/beleske.svg" alt="Beleške" className="w-5 h-5" /> },
    ] as NavLink[],
  },
  {
    title: 'KANCELARIJA',
    links: [
      { href: '/korisnici/ugovori', label: 'Ugovori', icon: <img src="/ikonice/ugovori.svg" alt="Ugovori" className="w-5 h-5" /> },
      { href: '/korisnici/dokumenti', label: 'Dokumenti', icon: <img src="/ikonice/dokumenti.svg" alt="Dokumenti" className="w-5 h-5" /> },
    ],
  },
  {
    title: 'ZAPOSLENJE',
    links: [
      { href: '/korisnici/oglasiZaPosao', label: 'Oglasi za posao', icon: <img src="/ikonice/oglasiZaPosao.svg" alt="Oglasi za posao" className="w-5 h-5" /> },
      { href: '/zaposlenje/prijave', label: 'Prijave', icon: <img src="/ikonice/prijave.svg" alt="Prijave" className="w-5 h-5" /> },
      { href: '/zaposlenje/intervjui', label: 'Intervjui', icon: <img src="/ikonice/intervjui.svg" alt="Intervjui" className="w-5 h-5" /> },
    ],
  },
  {
    title: 'SERTIFIKATI',
    links: [
      { href: '/sertifikati/sertifikati', label: 'Sertifikati', icon: <img src="/ikonice/sertifikati.svg" alt="Sertifikati" className="w-5 h-5" /> },
      { href: '/sertifikati/institucije', label: 'Institucije sertifikata', icon: <img src="/ikonice/institucije.svg" alt="Institucije sertifikata" className="w-5 h-5" /> },
      { href: '/sertifikati/vrsteSertifikati', label: 'Vrste sertifikata', icon: <img src="/ikonice/vrsteSertifikati.svg" alt="Vrste sertifikata" className="w-5 h-5" /> },
    ] as NavLink[],
  },
  {
    title: 'VOZILA',
    links: [
      { href: '/vozila/vozila', label: 'Vozila' },
      { href: '/vozila/registracije', label: 'Registracije vozila' },
    ] as NavLink[],
  },
  {
    title: 'KOMPANIJA',
    links: [
      { href: '/kompanija/podesavanja', label: 'Podešavanja' },
      { href: '/kompanija/uloge', label: 'Uloge' },
      { href: '/kompanija/pozicije', label: 'Pozicije' },
      { href: '/kompanija/lokacije', label: 'Lokacije' },
      { href: '/kompanija/sektori', label: 'Sektori' },
      { href: '/kompanija/org-shema', label: 'Organizaciona šema' },
    ] as NavLink[],
  },
]

export default function SidebarNav() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 font-medium text-black">
          <span className="w-5 h-5 bg-black/10 rounded" />
          Komandna tabla
        </Link>
      </div>
      {sections.map((section) => (
        <div key={section.title}>
          <div className="text-xs text-gray-400 font-semibold px-3 mb-1 mt-4">{section.title}</div>
          <div className="space-y-1">
            {section.links.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-black">
                {link.icon ? link.icon : <span className="w-5 h-5 bg-black/10 rounded" />}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 