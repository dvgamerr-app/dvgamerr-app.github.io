export type Theme = 'dark' | 'light'

const THEME_COLOR: Record<Theme, string> = { dark: '#0f121f', light: '#C84B31' }

const readTheme = (): Theme => (typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light')

// The inline script in Layout.astro sets the root class before hydration, so the first client read is already correct.
export const themeState = $state<{ current: Theme }>({ current: readTheme() })

export function applyTheme(next: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', next === 'dark')
  root.classList.toggle('light', next === 'light')
  localStorage.setItem('theme', next)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next])
  themeState.current = next
}
