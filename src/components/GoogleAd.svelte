<script lang="ts">
  // Reusable Google AdSense unit. Only renders in production with a configured client and slot.
  import { onMount } from 'svelte'

  interface Props {
    adSlot?: string
    layout?: string
    format?: string
    style?: string
    responsive?: boolean
  }

  let { adSlot, layout = '', format = 'auto', style = 'display:block; text-align:center;', responsive = true }: Props = $props()

  const client = import.meta.env.PUBLIC_ADSENSE_CLIENT
  const canRender = $derived(import.meta.env.PROD && !!client && !!adSlot)

  onMount(() => {
    if (!canRender) return
    const w = window as typeof window & { adsbygoogle?: unknown[] }
    ;(w.adsbygoogle = w.adsbygoogle || []).push({})
  })
</script>

{#if canRender}
  <ins
    class="adsbygoogle"
    {style}
    data-ad-layout={layout}
    data-ad-client={client}
    data-ad-slot={adSlot}
    data-ad-format={format}
    data-full-width-responsive={responsive ? 'true' : 'false'}
  ></ins>
{/if}
