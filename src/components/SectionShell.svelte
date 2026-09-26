<script lang="ts">
  import type { Snippet } from 'svelte'

  import SectionTitle from './SectionTitle.svelte'

  interface Props {
    title: string
    note?: string
    printHidden?: boolean
    titleClass?: string
    id?: string
    children: Snippet
  }

  let { title, note, printHidden = false, titleClass, id, children }: Props = $props()
</script>

<section {id} class={['scroll-reveal scroll-mt-4 max-w-7xl mx-auto px-4 pt-8 md:pt-12 pb-4 md:pb-8', { 'print:hidden': printHidden }]}>
  <div class="md:grid md:grid-cols-12 md:gap-8 items-start">
    <header class="md:col-span-3 mb-6 md:mb-0">
      <SectionTitle class={titleClass}>{title}</SectionTitle>
      {#if note}<p class="hidden md:block md:text-right text-xs text-gray-500 dark:text-gray-400 -mt-1">{note}</p>{/if}
    </header>
    <div class="md:col-span-9">
      {@render children()}
      {#if note}<p class="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-3">{note}</p>{/if}
    </div>
  </div>
</section>
