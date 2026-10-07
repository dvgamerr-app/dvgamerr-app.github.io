<script lang="ts">
  interface Stat {
    label: string
    value: number | string
  }

  interface Props {
    items: Stat[]
  }

  let { items }: Props = $props()

  // "13 year 4 month" → figures stay large, units and a trailing "(…)" aside render small so the numbers lead.
  const splitValue = (value: number | string) => {
    const [, main = '', aside = ''] = String(value).match(/^(.*?)(\s*\(.*\))?$/) ?? []
    return { aside, parts: main.split(/(\d[\d.,]*)/) }
  }

  const unitClass = 'text-sm sm:text-base font-semibold text-gray-500 dark:text-gray-400'
</script>

<!-- Borderless figures: whitespace groups the stats; column-reverse shows the value first while dt stays before dd. -->
<dl class="grid grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8 -mt-1">
  {#each items as { label, value } (label)}
    {@const { aside, parts } = splitValue(value)}
    <div class="flex flex-col-reverse justify-end gap-1.5">
      <dt class="eyebrow text-[10px] text-gray-500 dark:text-gray-400">{label}</dt>
      <dd class="th-label text-2xl sm:text-3xl font-bold leading-tight text-gray-900 dark:text-gray-50">
        {#each parts as part, i (i)}{#if i % 2}{part}{:else if part}<span class={unitClass}>{part}</span>{/if}{/each}{#if aside}<span
            class={unitClass}>{aside}</span
          >{/if}
      </dd>
    </div>
  {/each}
</dl>
