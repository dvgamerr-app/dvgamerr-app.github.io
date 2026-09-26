<script lang="ts">
  import devToIco from '../../assets/icon/dev-to.svg?raw'
  import emailIco from '../../assets/icon/email.svg?raw'
  import githubIco from '../../assets/icon/github.svg?raw'
  import instagramIco from '../../assets/icon/instagram.svg?raw'
  import mobileIco from '../../assets/icon/mobile.svg?raw'
  import wakatimeIco from '../../assets/icon/wakatime.svg?raw'
  import { type Lang, type TranslationKey, useTranslations } from '../../i18n/utils'
  import type { Experience } from '../../types'

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

<section id="contact" class="scroll-reveal scroll-mt-4 pt-8 md:pt-12 pb-4 md:pb-8">
  <div class="max-w-7xl mx-auto px-4">
    <div class="md:grid md:grid-cols-12 md:gap-8">
      <div class="md:col-span-3 mb-6 md:mb-0">
        <h2 class="text-[1.2rem] -mt-0.5 text-gray-800 dark:text-gray-200 uppercase md:text-right">
          {t('contact')}
        </h2>
      </div>
      <div class="md:col-span-9">
        <div class="grid sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-3 gap-2">
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
            <div class="print:hidden">
              <span class="font-bold text-sm uppercase">{label(e)}</span>
              <br />
              <a
                href={e.url}
                target={filterPrint(e) ? '_blank' : ''}
                aria-label={e.text}
                class="flex items-start justify-start gap-1 hover:text-(--text-color-link) dark:hover:text-(--text-color-link) transition"
              >
                <div aria-hidden="true" class="w-4 my-1 text-gray-800 dark:text-gray-200">{@html iconAssets[e.icon || 'chrome']}</div>
                <div class="pt-0.5 print:text-gray-950">{e.text}</div>
              </a>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
