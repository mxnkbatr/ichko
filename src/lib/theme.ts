export type ThemeMode = 'dark' | 'light'

const STORAGE_KEY = 'hool.theme'

export function getStoredTheme(): ThemeMode | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === 'dark' || raw === 'light') return raw
  return null
}

export function applyTheme(theme: ThemeMode) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  localStorage.setItem(STORAGE_KEY, theme)
}

export function initTheme(defaultTheme: ThemeMode = 'dark') {
  const stored = getStoredTheme()
  applyTheme(stored ?? defaultTheme)
}

