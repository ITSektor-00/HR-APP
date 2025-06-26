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
  const { theme } = useTheme()
  
  // Za tamni režim koristi bele ikonice
  if (theme === 'dark') {
    const whiteIconName = whiteIconMap[iconName]
    if (whiteIconName && whiteIconName !== iconName) {
      return `/ikonice/beleIkonice/${whiteIconName}.svg`
    }
  }
  
  // Za svetli režim koristi crne ikonice
  return `/ikonice/${iconName}.svg`
}

// Pomoćna funkcija za direktno dobijanje putanje bez hook-a
export function getIconPath(iconName: string, theme: 'light' | 'dark') {
  if (theme === 'dark') {
    const whiteIconName = whiteIconMap[iconName]
    console.log('getIconPath:', { iconName, theme, whiteIconName })
    if (whiteIconName && whiteIconName !== iconName) {
      return `/ikonice/beleIkonice/${whiteIconName}.svg`
    }
  }
  
  console.log('getIconPath:', { iconName, theme, fallback: `/ikonice/${iconName}.svg` })
  return `/ikonice/${iconName}.svg`
} 