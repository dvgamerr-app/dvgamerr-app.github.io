<script lang="ts">
  import dayjs from 'dayjs'

  import telemetry from '../../i18n/telemetry.json'
  import { type Lang, type TranslationKey, useTranslations } from '../../i18n/utils'
  import SectionShell from '../SectionShell.svelte'
  import StatGrid from '../StatGrid.svelte'

  interface Props {
    lang: Lang
  }

  let { lang }: Props = $props()

  const t = $derived(useTranslations(lang))

  const { categories, editorsCount, longestStreakDays } = telemetry.workType
  const range = `${dayjs(telemetry.rangeStart).format('DD-MM-YYYY')} – ${dayjs(telemetry.rangeEnd).format('DD-MM-YYYY')}`

  const categoryStyle: Record<string, { key: TranslationKey; color: string }> = {
    'AI Coding': { key: 'work-type.ai', color: 'bg-(--charts-highlight)' },
    Coding: { key: 'work-type.coding', color: 'bg-(--text-color-link)' },
    'Writing Docs': { key: 'work-type.docs', color: 'bg-violet-500' },
    'Writing Tests': { key: 'work-type.tests', color: 'bg-(--charts-color)' },
  }

  const percent = (n = 0) => `${Math.round(n * 10) / 10}%`
  const share = (name: string) => categories.find((category) => category.name === name)?.percent

  const slices = $derived(
    categories.map(({ name, percent: value }) => ({
      label: categoryStyle[name] ? t(categoryStyle[name].key) : name,
      color: categoryStyle[name]?.color ?? 'bg-gray-400',
      value,
    })),
  )

  const stats = $derived([
    { label: t('work-type.docs'), value: percent(share('Writing Docs')) },
    { label: t('work-type.tests'), value: percent(share('Writing Tests')) },
    { label: t('work-type.editors'), value: editorsCount },
    { label: t('work-type.streak'), value: `${longestStreakDays} ${t('work-type.days')}` },
  ])
</script>

<SectionShell title={t('work-type')} note={range} printHidden titleClass="text-[1.2rem] -mt-0.5">
  <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('work-type.caption')}</p>
  <div class="flex h-7 w-full overflow-hidden" aria-hidden="true">
    {#each slices as slice (slice.label)}
      <div class={slice.color} style:width="{slice.value}%" title="{slice.label} {percent(slice.value)}"></div>
    {/each}
  </div>
  <ul class="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-gray-600 dark:text-gray-300">
    {#each slices as slice (slice.label)}
      <li class="inline-flex items-center gap-1.5">
        <span class={['size-2.5 shrink-0', slice.color]} aria-hidden="true"></span>
        <span class="capitalize">{slice.label}</span>
        <span class="text-gray-500 dark:text-gray-400">{percent(slice.value)}</span>
      </li>
    {/each}
  </ul>
  <div class="mt-8">
    <StatGrid items={stats} />
  </div>
</SectionShell>
