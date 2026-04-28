const KEY = 'ichko.favorites'

export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function toggleFavorite(id: string): void {
  const favs = getFavorites()
  const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
}
