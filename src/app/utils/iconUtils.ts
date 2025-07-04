import { useTheme } from '../useTheme'

// Mapiranje imena ikonica iz beleIkonice direktorijuma
const whiteIconMap: Record<string, string> = {
  'hronologija': 'hronologijaBelo',
  'prisustva': 'prisustvaBelo',
  'odsustva': 'odsustvaBelo',
  'tokeni': 'tokeniBelo',
  'korisnici': 'korisniciBelo',
  'beleske': 'beleskeBelo',
  'ugovori': 'ugovoriBelo',
  'dokumenti': 'dokumentiBelo',
  'oglasiZaPosao': 'oglasiZaPosaoBelo',
  'prijave': 'prijaveBelo',
  'intervjui': 'intervjuiBelo',
  'sertifikati': 'serifikatiBelo',
  'institucije': 'institucijeSertifikataBelo',
  'vrsteSertifikati': 'vrsteSertifikataBelo',
  'vozila': 'vozilaBelo',
  'registracijeVozila': 'registracijeBelo',
  'podesavanja': 'podesavanjaBelo',
  'uloge': 'ulogeBelo',
  'pozicije': 'pozicijeBelo',
  'lokacije': 'lokacijeBelo',
  'sektori': 'sektoriBelo',
  'org-shema': 'organizacionaSemaBelo',
  'komandnaTabla': 'komandnaTablaBelo',
  'human-resources': 'human-resources' // Ova ikonica nema belu verziju, ostaje ista
}

export function useIconPath(iconName: string) {
  // Uvek koristi light varijantu
  return `/ikonice/${iconName}.svg`;
}

// Pomoćna funkcija za direktno dobijanje putanje bez hook-a
export function getIconPath(iconName: string, theme?: 'light') {
  // Uvek koristi light varijantu
  return `/ikonice/${iconName}.svg`;
} 