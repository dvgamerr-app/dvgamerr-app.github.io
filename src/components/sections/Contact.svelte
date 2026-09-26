<script lang="ts">
  import devToIco from '../../assets/icon/dev-to.svg?raw'
  import emailIco from '../../assets/icon/email.svg?raw'
  import githubIco from '../../assets/icon/github.svg?raw'
  import instagramIco from '../../assets/icon/instagram.svg?raw'
  import mobileIco from '../../assets/icon/mobile.svg?raw'
  import wakatimeIco from '../../assets/icon/wakatime.svg?raw'
  import { type Lang, type TranslationKey, useTranslations } from '../../i18n/utils'
  import type { Experience } from '../../types'
  import SectionShell from '../SectionShell.svelte'

  type ContactItem = Experience['contact'][number] & { qrcode?: string }

  interface Props {
    lang: Lang
    experience: Experience
  }

  let { lang, experience }: Props = $props()

  const t = $derived(useTranslations(lang))

  const iconAssets: Record<string, string> = {
    devto: devToIco,
    email: emailIco,
    github: githubIco,
    instagram: instagramIco,
    mobile: mobileIco,
    wakatime: wakatimeIco,
  }

  const filterPrint = (e: ContactItem) => e.label !== 'MOBILE' && e.label !== 'EMAIL'
  const label = (e: ContactItem) => t(`contact.${e.label.toLowerCase()}` as TranslationKey)

  const contacts = $derived(experience.contact as ContactItem[])
  const contactPrint = $derived(contacts.filter((e) => e.print && filterPrint(e)))
  const contactView = $derived(contacts.filter((e) => !e.print))
</script>

<SectionShell id="contact" title={t('contact')} titleClass="-mt-0.5">
  <div class="grid sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-3 gap-x-6 gap-y-5 print:gap-2">
    {#each contactPrint.filter((e) => e.qrcode) as e, i (i)}
      <div class="hidden print:block">
        <img src={`/${e.qrcode}`} height="160" alt={`QR ${e.label}`} data-not-lazy />
      </div>
    {/each}
    <div class="hidden print:block">
      {#each contactPrint.filter((e) => !e.qrcode) as e, i (i)}
        <div class="my-5">
          <strong>{label(e)}</strong>
          <a href={e.url} target={filterPrint(e) ? '_blank' : ''} aria-label={e.text} class="flex items-start justify-start gap-1">
            <div aria-hidden="true" class="w-4 mx-1 my-1 text-gray-800 dark:text-gray-200">
              {@html iconAssets[e.icon || 'chrome']}
            </div>
            <div class="pt-0.5 print:text-gray-950">{e.text}</div>
          </a>
        </div>
      {/each}
    </div>
    {#each contactView as e, i (i)}
      <a
        href={e.url}
        target={filterPrint(e) ? '_blank' : ''}
        rel={filterPrint(e) ? 'noopener noreferrer' : undefined}
        class="group flex min-h-11 items-start gap-3 print:hidden"
      >
        <span
          aria-hidden="true"
          class="mt-0.5 shrink-0 text-gray-400 transition group-hover:text-(--text-color-link) dark:text-gray-500 [&>svg]:size-5"
        >
          {@html iconAssets[e.icon || 'chrome']}
        </span>
        <span class="min-w-0">
          <span class="eyebrow block text-[10px] text-gray-500 dark:text-gray-400">{label(e)}</span>
          <span
            class="mt-1 flex items-center gap-1 text-sm font-medium text-gray-900 transition group-hover:text-(--text-color-link) dark:text-gray-100"
          >
            <!-- Allow long emails to wrap after "@" instead of mid-domain. -->
            <span class="wrap-break-word"
              >{#each e.text.split('@') as part, p (p)}{#if p > 0}@<wbr />{/if}{part}{/each}</span
            >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
              class="shrink-0 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
            >
              <path d="M7 17 17 7M8 7h9v9"></path>
            </svg>
          </span>
        </span>
      </a>
    {/each}
  </div>
</SectionShell>
