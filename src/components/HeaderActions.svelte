<script lang="ts">
  import { type Lang, useTranslations } from '../i18n/utils'
  import { languages } from '../i18n/ui'
  import { applyTheme, themeState } from '../lib/theme.svelte'
  import { button } from '../lib/ui'

  interface Props {
    lang: Lang
  }

  let { lang }: Props = $props()

  const t = $derived(useTranslations(lang))
  const otherLang = $derived<Lang>(lang === 'en' ? 'th' : 'en')
</script>

<ul class="flex items-center gap-2 text-sm print:hidden">
  <li>
    <a href="https://github.com/sponsors/dvgamerr" target="_blank" rel="noopener noreferrer" class={button.icon} aria-label="Sponsor">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height="16"
        width="16"
        fill="currentColor"
        class="text-pink-500"
        aria-hidden="true"
      >
        <path
          d="M12.1 21.35l-1.1-1.01C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-9 11.84l-1 .91z"
        ></path>
      </svg>
      <span class="mt-0.5 hidden xl:inline">{t('head.sponsor')}</span>
    </a>
  </li>
  <li>
    <a href={otherLang === 'en' ? '/' : '/th'} hreflang={otherLang} class={button.icon} aria-label="Switch language">
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"></path>
      </svg>
      <span class="mt-0.5 hidden xl:inline">{languages[lang]}</span>
    </a>
  </li>
  <li>
    <button type="button" class={button.icon} aria-label="Print CV" onclick={() => print()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        height="16"
        width="16"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9V4h12v5"></path>
        <path d="M6 14H5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1"></path>
        <path d="M6 17h12v3H6z"></path>
        <path d="M9 14h6"></path>
      </svg>
      <span class="mt-0.5 hidden xl:inline">cv</span>
    </button>
  </li>
  <li>
    <button
      type="button"
      class={button.icon}
      aria-label="Toggle theme"
      onclick={() => applyTheme(themeState.current === 'dark' ? 'light' : 'dark')}
    >
      <svg viewBox="0 0 25 25" height="16" width="16" class="pointer-events-none" aria-hidden="true">
        <path
          class="fill-current dark:fill-transparent"
          fill-rule="evenodd"
          d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zm0 1.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm12-7a.8.8 0 0 1-.8.8h-2.4a.8.8 0 0 1 0-1.6h2.4a.8.8 0 0 1 .8.8zM4 12a.8.8 0 0 1-.8.8H.8a.8.8 0 0 1 0-1.6h2.5a.8.8 0 0 1 .8.8zm16.5-8.5a.8.8 0 0 1 0 1l-1.8 1.8a.8.8 0 0 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM6.3 17.7a.8.8 0 0 1 0 1l-1.7 1.8a.8.8 0 1 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM12 0a.8.8 0 0 1 .8.8v2.5a.8.8 0 0 1-1.6 0V.8A.8.8 0 0 1 12 0zm0 20a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-1.6 0v-2.4a.8.8 0 0 1 .8-.8zM3.5 3.5a.8.8 0 0 1 1 0l1.8 1.8a.8.8 0 1 1-1 1L3.5 4.6a.8.8 0 0 1 0-1zm14.2 14.2a.8.8 0 0 1 1 0l1.8 1.7a.8.8 0 0 1-1 1l-1.8-1.7a.8.8 0 0 1 0-1z"
        ></path>
        <path
          class="fill-transparent dark:fill-current"
          fill-rule="evenodd"
          d="M16.5 6A10.5 10.5 0 0 1 4.7 16.4 8.5 8.5 0 1 0 16.4 4.7l.1 1.3zm-1.7-2a9 9 0 0 1 .2 2 9 9 0 0 1-11 8.8 9.4 9.4 0 0 1-.8-.3c-.4 0-.8.3-.7.7a10 10 0 0 0 .3.8 10 10 0 0 0 9.2 6 10 10 0 0 0 4-19.2 9.7 9.7 0 0 0-.9-.3c-.3-.1-.7.3-.6.7a9 9 0 0 1 .3.8z"
        ></path>
      </svg>
      <span class="mt-0.5 hidden xl:inline xl:dark:hidden">{t('button.light')}</span>
      <span class="mt-0.5 hidden xl:dark:inline">{t('button.dark')}</span>
    </button>
  </li>
</ul>
