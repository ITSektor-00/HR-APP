import Link from 'next/link'

const sections = [
  {
    title: 'PRISUSTVO',
    links: [
      { href: '/prisustvo/hronologija', label: 'Hronologija' },
      { href: '/prisustvo/prisustva', label: 'Prisustva' },
      { href: '/prisustvo/odsustva', label: 'Odsustva' },
      { href: '/prisustvo/tokeni', label: 'Tokeni' },
    ],
  },
  {
    title: 'KORISNICI',
    links: [
      { href: '/korisnici/korisnici', label: 'Korisnici', icon: <img src="/ikonice/korisnici.svg" alt="Korisnici" className="w-5 h-5" /> },
      { href: '/korisnici/beleske', label: 'Beleške', icon: <img src="/ikonice/beleske.svg" alt="Beleške" className="w-5 h-5" /> },
    ],
  },
  {
    title: 'KANCELARIJA',
    links: [
      { href: '/kancelarija/ugovori', label: 'Ugovori' },
      { href: '/kancelarija/dokumenti', label: 'Dokumenti' },
    ],
  },
  {
    title: 'ZAPOSLENJE',
    links: [
      { href: '/zaposlenje/oglasi', label: 'Oglasi za posao' },
      { href: '/zaposlenje/prijave', label: 'Prijave' },
      { href: '/zaposlenje/intervjui', label: 'Intervjui' },
    ],
  },
  {
    title: 'SERTIFIKATI',
    links: [
      { href: '/sertifikati/sertifikati', label: 'Sertifikati' },
      { href: '/sertifikati/institucije', label: 'Institucije sertifikata' },
      { href: '/sertifikati/vrste', label: 'Vrste sertifikata' },
    ],
  },
  {
    title: 'VOZILA',
    links: [
      { href: '/vozila/vozila', label: 'Vozila' },
      { href: '/vozila/registracije', label: 'Registracije vozila' },
    ],
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
    ],
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