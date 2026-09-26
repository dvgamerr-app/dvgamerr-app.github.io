<script lang="ts">
  import coding from '../../i18n/coding.json'
  import { type Lang, useTranslations } from '../../i18n/utils'
  import SectionShell from '../SectionShell.svelte'
  import StatGrid from '../StatGrid.svelte'

  interface Props {
    lang: Lang
  }

  let { lang }: Props = $props()

  const t = $derived(useTranslations(lang))

  const parseTime = (seconds: number = 0) =>
    `${seconds > 60 * 60 ? `${Math.round(seconds / 60 / 60)}${t('code-history.hour')} ` : ''}${Math.round((seconds / 60) % 60)}${t('code-history.minute')}`

  const stats = $derived([
    { label: t('code-history.weekly'), value: parseTime(coding.weekly_seconds) },
    { label: t('code-history.daily'), value: parseTime(coding.average_seconds) },
    { label: t('code-history.best'), value: parseTime(coding.best_seconds) },
    { label: t('code-history.languages'), value: coding.languages.length },
  ])
</script>

<SectionShell title={t('code-history')} note="wakatime.com" printHidden titleClass="text-[1.2rem] -mt-0.5">
  <StatGrid items={stats} />
</SectionShell>
