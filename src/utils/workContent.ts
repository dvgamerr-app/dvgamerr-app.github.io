import type { MarkdownInstance } from 'astro'

import type { Lang } from '../i18n/utils'

const workFiles: Record<Lang, Record<string, () => Promise<MarkdownInstance<Record<string, unknown>>>>> = {
  en: import.meta.glob('../components/work/en/*.md'),
  th: import.meta.glob('../components/work/th/*.md'),
}

// Svelte SSR cannot await Markdown compilation, so the page preloads the HTML keyed by file name.
export async function loadWorkHtml(lang: Lang) {
  const entries = await Promise.all(
    Object.entries(workFiles[lang]).map(async ([path, load]) => {
      const post = await load()
      return [path.split('/').pop(), await post.compiledContent()] as const
    }),
  )
  return Object.fromEntries(entries) as Record<string, string>
}
