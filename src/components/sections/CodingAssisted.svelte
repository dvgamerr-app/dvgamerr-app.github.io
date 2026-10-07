<script lang="ts">
  import dayjs from 'dayjs'

  import telemetry from '../../i18n/telemetry.json'
  import { type Lang, useTranslations } from '../../i18n/utils'
  import SectionShell from '../SectionShell.svelte'
  import StatGrid from '../StatGrid.svelte'

  interface Props {
    lang: Lang
  }

  let { lang }: Props = $props()

  const t = $derived(useTranslations(lang))

  const { aiLinePercent, agentSessions, longestTaskSeconds, linesPerMillionTokens, monthly, models, tokens } = telemetry.aiAssisted
  const range = `${dayjs(telemetry.rangeStart).format('DD-MM-YYYY')} – ${dayjs(telemetry.rangeEnd).format('DD-MM-YYYY')}`

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  const duration = (seconds: number) =>
    `${Math.floor(seconds / 3600)}${t('code-history.hour')} ${Math.round((seconds % 3600) / 60)}${t('code-history.minute')}`

  const stats = $derived([
    { label: t('ai-assisted.lines'), value: `${Math.round(aiLinePercent)}%` },
    { label: t('ai-assisted.sessions'), value: agentSessions.toLocaleString('en-US') },
    { label: t('ai-assisted.longest'), value: duration(longestTaskSeconds) },
    { label: t('ai-assisted.efficiency'), value: Math.round(linesPerMillionTokens) },
  ])

  // The range starts and ends mid-month, so the oldest partial month is dropped to keep one bar per calendar month.
  const monthFormat = $derived(new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-US', { month: 'short' }))
  const months = $derived(
    monthly.slice(-12).map(({ aiLines }, i, list) => ({
      label: monthFormat.format(
        dayjs(telemetry.rangeEnd)
          .subtract(list.length - 1 - i, 'month')
          .toDate(),
      ),
      ai: Math.round(aiLines),
    })),
  )

  const topModels = models.slice(0, 6)
  const maxHours = Math.max(...topModels.map(({ hours }) => hours))
</script>

<SectionShell title={t('ai-assisted')} note={range} printHidden titleClass="text-[1.2rem] -mt-0.5">
  <StatGrid items={stats} />
  <div class="grid gap-x-10 gap-y-12 lg:grid-cols-2 mt-10">
    <figure>
      <figcaption class="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('ai-assisted.monthly')}</figcaption>
      <ol class="flex h-40 gap-1.5">
        {#each months as month (month.label)}
          <li class="flex flex-1 flex-col-reverse" title="{month.label}: {month.ai}% / {100 - month.ai}%">
            <span class="bg-(--charts-highlight)" style:height="{month.ai}%"></span>
            <span class="bg-(--charts-color)" style:height="{100 - month.ai}%"></span>
            <span class="sr-only">{month.label}: {t('ai-assisted.ai')} {month.ai}%, {t('ai-assisted.human')} {100 - month.ai}%</span>
          </li>
        {/each}
      </ol>
      <div class="flex gap-1.5 mt-1.5" aria-hidden="true">
        {#each months as month (month.label)}
          <span class="flex-1 text-center text-[10px] sm:text-xs font-semibold">{month.label}</span>
        {/each}
      </div>
      <ul class="flex flex-wrap gap-x-4 mt-3 text-xs text-gray-600 dark:text-gray-300">
        <li class="inline-flex items-center gap-1.5">
          <span class="size-2.5 bg-(--charts-highlight)" aria-hidden="true"></span>{t('ai-assisted.ai')}
        </li>
        <li class="inline-flex items-center gap-1.5">
          <span class="size-2.5 bg-(--charts-color)" aria-hidden="true"></span>{t('ai-assisted.human')}
        </li>
      </ul>
    </figure>
    <figure>
      <figcaption class="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('ai-assisted.models')}</figcaption>
      <ol class="grid gap-2">
        {#each topModels as model, i (model.name)}
          <li class="grid grid-cols-[8.5rem_1fr_3rem] items-center gap-2.5 text-xs">
            <span class="truncate">{model.name}</span>
            <span class="h-3.5 bg-gray-900/5 dark:bg-white/5" aria-hidden="true">
              <span
                class={['block h-full', i === 0 ? 'bg-(--charts-highlight)' : 'bg-(--charts-color)']}
                style:width="{(model.hours / maxHours) * 100}%"
              ></span>
            </span>
            <span class="text-right text-gray-500 dark:text-gray-400">{Math.round(model.hours)}{t('code-history.hour')}</span>
          </li>
        {/each}
      </ol>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
        {t('ai-assisted.tokens')}: {compact.format(tokens.inputTokens)}
        {t('ai-assisted.input')} · {compact.format(tokens.outputTokens)}
        {t('ai-assisted.output')} · {t('ai-assisted.cost')}
        {usd.format(tokens.estCostUSD)}
      </p>
    </figure>
  </div>
</SectionShell>
