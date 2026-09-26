// Class recipes for the design language introduced with the hero: square buttons and hairline pills.
// Content sections stay borderless and separate groups with whitespace instead of cards.
// Text colors carry `!` because the global `a` rule in global.css is unlayered and would otherwise beat utilities on links.

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2'

export const button = {
  icon: `th-label inline-flex h-10 min-w-10 items-center justify-center gap-1.5 border border-gray-600/30 bg-white/50 px-2.5 text-xs font-semibold uppercase text-gray-700! backdrop-blur-sm transition hover:border-(--text-color-link) hover:text-(--text-color-link)! dark:border-white/15 dark:bg-gray-900/40 dark:text-gray-200! lg:px-3 ${focusRing} focus-visible:outline-gray-400`,
  primary: `th-label inline-flex min-h-11 items-center justify-center gap-2 border border-(--text-color-link) bg-(--text-color-link) px-5 text-sm font-semibold text-white! transition hover:bg-transparent hover:text-(--text-color-link)! ${focusRing} focus-visible:outline-(--text-color-link)`,
  secondary: `th-label inline-flex min-h-11 items-center justify-center gap-2 border border-gray-600/40 bg-white/40 px-5 text-sm font-semibold text-gray-700! backdrop-blur-sm transition hover:border-(--text-color-link) hover:text-(--text-color-link)! dark:bg-gray-900/30 dark:text-gray-100! ${focusRing} focus-visible:outline-gray-400`,
}

const pillTones = {
  accent: 'border-(--text-color-link)/30 bg-(--text-color-link)/10 text-(--text-color-link)!',
  danger: 'border-red-600/30 bg-red-50/80 text-red-700! dark:border-red-400/30 dark:bg-red-900/30 dark:text-red-300!',
  info: 'border-blue-600/30 bg-blue-50/80 text-blue-700! dark:border-blue-400/30 dark:bg-blue-900/30 dark:text-blue-300!',
  neutral: 'border-gray-900/10 bg-white/60 text-gray-700! dark:border-white/10 dark:bg-white/5 dark:text-gray-300!',
  success: 'border-green-600/30 bg-green-50/80 text-green-700! dark:border-green-400/30 dark:bg-green-900/30 dark:text-green-300!',
  warning: 'border-amber-600/30 bg-amber-50/80 text-amber-700! dark:border-amber-400/30 dark:bg-amber-900/30 dark:text-amber-300!',
}

export type PillTone = keyof typeof pillTones

export const pill = (tone: PillTone = 'neutral') =>
  `th-label inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${pillTones[tone]}`
