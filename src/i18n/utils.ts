import { ui, defaultLang } from './ui'

export type Lang = keyof typeof ui
export type TranslationKey = keyof (typeof ui)[typeof defaultLang]

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as Lang
  return defaultLang
}

export function useTranslations(lang: Lang) {
  return (key: TranslationKey) => ui[lang][key] || ui[defaultLang][key]
}

export function getTranslate(url: URL) {
  return useTranslations(getLangFromUrl(url))
}
