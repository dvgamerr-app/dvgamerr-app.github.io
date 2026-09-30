<script lang="ts">
  import { GodRays } from '../lib/motion-core'
  import type { SkyState } from '../lib/orbit'
  import type { Theme } from '../lib/theme.svelte'

  interface Props {
    theme: Theme
    sky: SkyState
    reduced: boolean
  }

  let { theme, sky, reduced }: Props = $props()

  // Page background per theme (matches `bg-background`), so the opaque ray canvas blends into the page.
  const PALETTE = {
    dark: { background: '#020817', intensity: 0.2, rays: '#8ea3e6', spread: 0.8 },
    light: { background: '#ffffff', intensity: 0.95, rays: '#ffb24a', spread: 1.25 },
  }
  const palette = $derived(PALETTE[theme])

  // Deterministic star field so server and client markup match.
  const stars = Array.from({ length: 90 }, (_, i) => {
    const r = (n: number) => {
      const v = Math.sin(i * 127.1 + n * 311.7) * 43758.5453
      return v - Math.floor(v)
    }
    return { delay: r(4) * 6, left: r(1) * 100, opacity: 0.25 + r(3) * 0.6, size: r(2) > 0.85 ? 2 : 1, top: r(5) * 100 }
  })
</script>

<div class="absolute inset-0" aria-hidden="true">
  <GodRays
    backgroundColor={palette.background}
    color={palette.rays}
    intensity={palette.intensity}
    lightSpread={palette.spread}
    anchorX={sky.x / Math.max(1, sky.width)}
    anchorY={1 - sky.y / Math.max(1, sky.height)}
    directionX={sky.dirX}
    directionY={sky.dirY}
    rayLength={1.3}
    fadeDistance={1.1}
    speed={reduced ? 0 : 0.5}
  />

  <div class={['absolute inset-0 transition-opacity duration-1000', theme === 'dark' ? 'opacity-100' : 'opacity-0']}>
    {#each stars as star, i (i)}
      <span
        class="star absolute rounded-full bg-white"
        style:left={`${star.left}%`}
        style:top={`${star.top}%`}
        style:width={`${star.size}px`}
        style:height={`${star.size}px`}
        style:opacity={star.opacity}
        style:animation-delay={`${star.delay}s`}
      ></span>
    {/each}
  </div>

  <!-- Both bodies share the orbit point and cross-fade with the theme: the sun sets as the moon rises. -->
  <div
    class={['absolute top-0 left-0 transition-opacity duration-700', !sky.ready && 'opacity-0']}
    style:transform={`translate3d(${sky.x}px, ${sky.y}px, 0)`}
  >
    <span
      class={['sun absolute block rounded-full transition duration-1000', theme === 'light' ? 'opacity-100' : 'translate-y-6 opacity-0']}
    ></span>
    <span
      class={['moon absolute block rounded-full transition duration-1000', theme === 'dark' ? 'opacity-100' : 'translate-y-6 opacity-0']}
    ></span>
  </div>
</div>

<style>
  .sun {
    width: 56px;
    height: 56px;
    margin: -28px 0 0 -28px;
    background: radial-gradient(circle at 42% 40%, #fffbea 0%, #ffe39a 38%, #ffb24a 72%, #ff9a3c 100%);
    box-shadow:
      0 0 40px 12px rgb(255 190 90 / 0.55),
      0 0 120px 40px rgb(255 170 70 / 0.25);
  }

  .moon {
    width: 42px;
    height: 42px;
    margin: -21px 0 0 -21px;
    background:
      radial-gradient(circle at 34% 58%, rgb(150 156 170 / 0.55) 0 9%, transparent 10%),
      radial-gradient(circle at 60% 30%, rgb(150 156 170 / 0.45) 0 7%, transparent 8%),
      radial-gradient(circle at 64% 66%, rgb(150 156 170 / 0.4) 0 5%, transparent 6%),
      radial-gradient(circle at 40% 38%, #c9ccd4 0%, #9ea4b1 70%, #7d8392 100%);
    /* Crescent phase: the inset shadow is the night side. */
    box-shadow:
      inset -13px 5px 0 1px rgb(2 8 23 / 0.85),
      0 0 22px 3px rgb(150 170 235 / 0.16),
      0 0 70px 16px rgb(130 150 230 / 0.06);
    /* Keep the moon a quiet backdrop element rather than a bright focal point. */
    filter: brightness(0.8);
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    .star {
      animation: twinkle 4.5s ease-in-out infinite;
    }
  }

  @keyframes twinkle {
    50% {
      opacity: 0.1;
    }
  }
</style>
