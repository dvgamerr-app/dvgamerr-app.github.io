<script lang="ts">
  import { type Lang, useTranslations } from '../../i18n/utils'
  import type { Resume } from '../../types'
  import SectionShell from '../SectionShell.svelte'

  interface Props {
    lang: Lang
    resume: Resume
  }

  let { lang, resume }: Props = $props()

  const t = $derived(useTranslations(lang))
</script>

<SectionShell title={t('education')} titleClass="min-w-43.75 text-[1.2rem] -mt-1.5">
  <div class="grid md:grid-cols-2 grid-cols-1 print:grid-cols-2 gap-x-8 gap-y-7 print:gap-y-4 md:text-base">
    {#each resume.education as education, i (i)}
      <div class="flex flex-col">
        <span class="eyebrow text-(--text-color-link)">{education.range}</span>
        <h3 class="mt-1.5 font-semibold text-gray-900 dark:text-gray-100 leading-snug uppercase wrap-break-word">
          {education.major}
        </h3>
        {#if education.location}<h4 class="font-medium text-gray-700 dark:text-gray-300 tracking-wide">{education.location}</h4>{/if}
        {#if education.branch}
          <p class="text-sm -mt-1 text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-4">{education.branch}</p>
        {/if}
      </div>
    {/each}
  </div>
</SectionShell>
