<script lang="ts">
  import { type Lang, useTranslations } from '../../i18n/utils'
  import { pill } from '../../lib/ui'
  import type { Resume } from '../../types'
  import { getWorkDuration, getWorkPeriod, isNewJob } from '../../utils/dateUtils'
  import SectionTitle from '../SectionTitle.svelte'
  import SectionWork from '../SectionWork.svelte'

  interface Props {
    lang: Lang
    workExperience: Resume['work']
    /** Compiled Markdown keyed by work file name (see utils/workContent.ts). */
    workHtml: Record<string, string>
  }

  let { lang, workExperience, workHtml }: Props = $props()

  const t = $derived(useTranslations(lang))
</script>

<section class="pt-8 md:pt-0 pb-6 md:pb-10">
  <div class="max-w-7xl mx-auto px-4 md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-1 print:mt-12">
    <div class="md:col-span-3 mb-2">
      <SectionTitle>{t('experience')}</SectionTitle>
    </div>
    <div class="md:col-span-9 mb-2 hidden md:block"></div>
    {#each workExperience as e, i (i)}
      {#if 'pagebreak' in e && e.pagebreak}
        <p class="pagebreak md:col-span-12"></p>
      {:else if 'work' in e}
        <div class="contents md:col-span-12">
          <div class="md:col-span-3 md:text-right print:mt-12">
            <h4
              title={e.work}
              class="th-label font-bold sm:text-lg text-2xl text-gray-900 dark:text-gray-100 leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {e.work}
            </h4>
          </div>
          <div class="md:col-span-9 hidden md:block print:mt-12"></div>
          {#each Array.isArray(e.level) ? e.level : [] as j (j.file)}
            <div class="scroll-reveal md:col-span-3 mb-2 md:mb-0 md:mt-3 mt-6 md:text-right">
              <small
                class="caps flex xl:flex-row flex-col xs:flex-row justify-end gap-0.5 mb-1 text-[11px] font-medium text-gray-500 dark:text-gray-400"
              >
                <span>{getWorkPeriod(j, lang, t)}</span>
                <span>{getWorkDuration(j, lang, t)}</span>
              </small>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide leading-snug">{j.job}</h3>
              {#if isNewJob(j.begin)}
                <span class={[pill('success'), 'mt-1.5 uppercase']}>
                  {t('experience.newjob')}
                </span>
              {/if}
            </div>
            <article
              class="scroll-reveal md:col-span-9 relative group mb-0 last:mb-8 md:border-l md:border-gray-900/10 md:pl-6 md:dark:border-white/10 print:border-0 print:pl-0"
            >
              <span
                class="absolute top-4 -left-[3px] hidden size-1.5 rounded-full bg-(--text-color-link) md:block print:hidden"
                aria-hidden="true"
              ></span>
              <div class="text-gray-700 dark:text-gray-300 leading-relaxed">
                <SectionWork html={workHtml[j.file] ?? ''} />
              </div>
            </article>
          {/each}
        </div>
      {/if}
    {/each}
  </div>
</section>
