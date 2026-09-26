<script lang="ts">
  import { version } from '../../package.json'
  import webring from '../assets/webring.svg?url'
  import { type Lang, useTranslations } from '../i18n/utils'

  interface Props {
    lang: Lang
  }

  let { lang }: Props = $props()

  const t = $derived(useTranslations(lang))
  const year = new Date().getFullYear()
</script>

<footer class="print:hidden max-w-7xl mx-auto px-4 pt-8 md:pt-12 pb-4 md:pb-8">
  <div class="md:grid md:grid-cols-12 md:gap-8">
    <div class="md:col-start-4 md:col-span-9">
      <div class="flex flex-row flex-nowrap justify-end items-end gap-1 font-sans font-normal text-[0.8rem]">
        &copy; {year}
        <b>dvgamerr</b>
        {t('footer.sponser')}
        <a href="https://sponsor.dvgamerr.app/" target="_blank" rel="noopener noreferrer">Kananek T.</a>
        {t('footer.and')}
        <a href="https://webring.wonderful.software#dvgamerr.app" class="inline-flex items-end gap-0.5">
          webring <img
            alt="webring"
            src={webring}
            width="14"
            height="14"
            loading="lazy"
            decoding="async"
            class="-mt-[0.2em] inline-block"
          />
        </a>
        v{version}
      </div>
    </div>
  </div>
</footer>
