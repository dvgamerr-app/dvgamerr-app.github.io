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
  <div class="grid md:grid-cols-2 grid-cols-1 print:grid-cols-2 gap-2 md:text-base">
    {#each resume.education as education, i (i)}
      <div class="group flex flex-col pb-3 transition">
        <div class="flex items-start gap-2 flex-wrap mb-2 w-full">
          <span
            class="text-sm inline-flex items-center rounded-md bg-gray-200/70 dark:bg-gray-700/40 print:bg-transparent print:dark:bg-transparent text-gray-800 dark:text-gray-200 px-2 pt-1 print:px-0 font-semibold tracking-wide uppercase"
          >
            {education.range}
          </span>
          <div class="flex-1 min-w-[60%] mt-1">
            <h3 class="font-semibold text-gray-800 dark:text-gray-200 leading-snug uppercase wrap-break-word transition-colors">
              {education.major}
            </h3>
          </div>
        </div>
        {#if education.location}<h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1 tracking-wide">{education.location}</h4>{/if}
        {#if education.branch}
          <p class="text-sm -mt-2 text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4">{education.branch}</p>
        {/if}
      </div>
    {/each}
  </div>
</SectionShell>
