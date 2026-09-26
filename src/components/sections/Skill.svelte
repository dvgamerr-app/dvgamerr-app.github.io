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
        <h3 class="th-label eyebrow mb-3 text-gray-500 dark:text-gray-400">
          {t(`skills.${skill}` as TranslationKey)}
        </h3>
        <ul class="flex flex-wrap gap-2 print:gap-y-0 print:gap-x-1">
          {#each list as item, i (i)}
            <li
              class="skills-badge select-none rounded-full border border-gray-900/10 bg-white/60 px-2.5 py-1 text-[0.75rem] text-gray-700 backdrop-blur-sm transition hover:border-(--text-color-link)/50 hover:text-(--text-color-link) dark:border-white/10 dark:bg-white/5 dark:text-gray-300 print:border-0 print:bg-transparent print:shadow-none print:backdrop-blur-none dark:print:bg-transparent print:text-black dark:print:text-black print:px-0"
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
