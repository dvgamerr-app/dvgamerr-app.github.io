<script lang="ts">
  import coding from '../../i18n/coding.json'
  import { type Lang, useTranslations } from '../../i18n/utils'
  import SectionShell from '../SectionShell.svelte'

  interface Props {
    lang: Lang
  }

  let { lang }: Props = $props()

  const t = $derived(useTranslations(lang))

  const maxDayTime = Math.max(...coding.daytime)
  const maxWeekTime = Math.max(...coding.weektime)

  const weekDay = $derived([
    t('daytime.mon'),
    t('daytime.tue'),
    t('daytime.wed'),
    t('daytime.thu'),
    t('daytime.fri'),
    t('daytime.sat'),
    t('daytime.sun'),
  ])
  const weekSize = [0, 1, 2, 3, 4, 5]

  const chartDay = $derived([
    { name: t('daytime.morning'), startOfIndex: 6 },
    { name: t('daytime.daytime'), startOfIndex: 12 },
    { name: t('daytime.evening'), startOfIndex: 18 },
    { name: t('daytime.night'), startOfIndex: 0 },
  ])

  const maxGroupDay = $derived(
    chartDay.find((group) => maxDayTime === Math.max(...weekSize.map((hour) => coding.daytime[hour + group.startOfIndex])))?.name,
  )

  const getDayHighlight = (group: { name: string }) => (maxGroupDay === group.name ? 'highlight' : '')
  const dayOfWeek = (value: number) => weekDay[coding.weektime.findIndex((weekTime) => weekTime === value)]
  const getWeekHighlight = (value: number) => (maxWeekTime === value ? 'highlight' : '')
  const colDaySize = (n: number = 0) => `--size: calc( ${(coding.daytime[n] * 100) / maxDayTime} / 100 )`
  const colWeekSize = (n: number = 0) => `--size: calc( ${(n * 100) / maxWeekTime} / 100 )`
</script>

<SectionShell title={t('daytime')} note="wakatime.com" printHidden titleClass="text-[1.2rem] -mt-0.5">
  <div class="grid gap-x-10 gap-y-12 lg:grid-cols-2">
    <div class="mt-6">
      <table class="w-full h-50 charts-css column show-heading data-spacing-2 datasets-spacing-3 hide-data show-labels">
        <caption>{t('daytime.caption')}</caption>
        <thead>
          <tr>
            {#each chartDay as group (group.startOfIndex)}<th>{group.name}</th>{/each}
          </tr>
        </thead>
        <tbody>
          {#each chartDay as group (group.startOfIndex)}
            <tr>
              <th scope="row" class={getDayHighlight(group)}>
                {group.name}
              </th>
              {#each weekSize as hour (hour)}
                <td class={getDayHighlight(group)} style={colDaySize(hour + group.startOfIndex)}></td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="mt-6">
      <table id="charts-weektime" class="w-full h-50 charts-css column data-spacing-5 datasets-spacing-3 hide-data show-labels">
        <tbody>
          {#each coding.weektime as weekTime, i (i)}
            <tr>
              <th scope="row" class={getWeekHighlight(weekTime)}>
                {dayOfWeek(weekTime)}
              </th>
              <td style={colWeekSize(weekTime)} class={getWeekHighlight(weekTime)}></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</SectionShell>

<style>
  :global(html) {
    --charts-color: #cbcbcb;
    --charts-highlight: #37d67a;
  }

  :global(html.dark) {
    --charts-color: #444758;
    --charts-highlight: #ffdc5a;
  }

  table.charts-css > caption {
    color: var(--text-muted);
    font-size: 0.75rem;
    position: absolute;
    margin-top: -1.9em;
  }

  table.charts-css > tbody th {
    text-transform: capitalize;
    font-size: 0.75rem;
  }

  table.charts-css > tbody th.highlight {
    color: var(--charts-highlight);
  }

  table.charts-css > tbody td.highlight {
    background-color: var(--charts-highlight);
  }

  table.charts-css > tbody td {
    --color: var(--charts-color);
  }

  table.charts-css > tbody tr > th[scope='row'] {
    margin-bottom: -2.3em;
    line-height: 2.2em;
    border-top: 0.15em solid var(--text-muted);
  }
</style>
