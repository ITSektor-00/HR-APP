export function useIconPath(iconName: string) {
  // Uvek koristi light varijantu
  return `/ikonice/${iconName}.svg`;
}

// Pomoćna funkcija za direktno dobijanje putanje bez hook-a
export function getIconPath(iconName: string) {
  // Uvek koristi light varijantu
  return `/ikonice/${iconName}.svg`;
} 