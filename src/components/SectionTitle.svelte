<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue } from 'svelte/elements'

  interface Props {
    class?: ClassValue
    children: Snippet
  }

  let { class: className, children }: Props = $props()
</script>

<!-- The accent rule echoes the hero scroll cue and points from the heading column into the content column. -->
<h2 class={['th-label caps flex items-center gap-3 text-gray-900 dark:text-gray-100 md:justify-end', className]}>
  <span class="h-px w-6 shrink-0 bg-(--text-color-link) md:order-last print:hidden" aria-hidden="true"></span>
  {@render children()}
</h2>
