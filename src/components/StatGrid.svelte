<script lang="ts">
  interface Stat {
    label: string
    value: number | string
  }

  interface Props {
    items: Stat[]
  }

  let { items }: Props = $props()
</script>

<dl class="grid sm:grid-cols-2 xl:grid-cols-4 gap-2 -mt-2.5">
  {#each items as { label, value } (label)}
    <div class="p-4 rounded bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <dt class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">{label}</dt>
      <dd class="mt-1 text-lg font-bold text-gray-800 dark:text-gray-100">{value}</dd>
    </div>
  {/each}
</dl>
