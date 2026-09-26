<script lang="ts">
  import { type Lang, type TranslationKey, useTranslations } from '../../i18n/utils'
  import type { Experience } from '../../types'
  import SectionShell from '../SectionShell.svelte'

  interface Props {
    lang: Lang
    experience: Experience
  }

  let { lang, experience }: Props = $props()

  const t = $derived(useTranslations(lang))

  const skillGroups = $derived(
    Object.entries(experience.skill as Record<string, string[]>)
      .map(([skill, items]) => ({ skill, list: items.filter((item) => item.toLowerCase() !== 'hack').sort() }))
      .filter(({ list }) => list.length),
  )
</script>

<SectionShell title={t('skills')} titleClass="-mt-0.5">
  <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
    {#each skillGroups as { skill, list } (skill)}
      <div class="group">
        <h3 class="mb-2 font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors">
          {t(`skills.${skill}` as TranslationKey)}
        </h3>
        <ul class="flex flex-wrap gap-2 print:gap-y-0 print:gap-x-1">
          {#each list as item, i (i)}
            <li
              class="skills-badge select-none rounded-sm bg-gray-100/70 px-2 py-1 text-[0.75rem] text-gray-700 ring-1 ring-gray-200/70 backdrop-blur-sm transition hover:bg-indigo-50 dark:bg-gray-800/60 dark:text-gray-300 dark:ring-gray-700/70 print:bg-transparent print:ring-0 print:shadow-none print:backdrop-blur-none dark:print:bg-transparent print:text-black dark:print:text-black print:px-0"
            >
              {item}
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</SectionShell>

<style>
  @media print {
    .skills-badge::after {
      content: ',';
    }
    .skills-badge:last-child::after {
      content: '';
    }
  }
</style>
