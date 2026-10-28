<script lang="ts">
  import type { SkyState } from '../lib/orbit'
  import type { Theme } from '../lib/theme.svelte'
  import AsciiSprite from './AsciiSprite.svelte'

  interface Props {
    theme: Theme
    sky: SkyState
    reduced: boolean
  }

  let { theme, sky, reduced }: Props = $props()

  // ASCII bodies in the globe's cell grid: a rayed sun and a crescent moon lit from the left.
  const SUN = ['  .|.  ', ' .#@#. ', '-@@@@@-', " '#@#' ", "  '|'  "]
  const MOON = [' .o8:', 'o8%  ', '8@   ', 'o8%  ', " 'o8:"]

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
  <!-- Local scattering falls off around the body instead of forming a sweeping spotlight. -->
  <div class={['absolute inset-0', !sky.ready && 'opacity-0']}>
    <div
      class={['sky-glow absolute inset-0 transition-opacity duration-1000', theme === 'light' ? 'opacity-100' : 'opacity-0']}
      style:background={`radial-gradient(circle at ${sky.x}px ${sky.y}px, rgb(255 229 183 / 0.18) 0, rgb(255 237 210 / 0.07) 100px, transparent 320px)`}
    ></div>
    <div
      class={['sky-glow absolute inset-0 transition-opacity duration-1000', theme === 'dark' ? 'opacity-100' : 'opacity-0']}
      style:background={`radial-gradient(circle at ${sky.x}px ${sky.y}px, rgb(205 215 229 / 0.045) 0, rgb(190 205 225 / 0.015) 60px, transparent 160px)`}
    ></div>
  </div>

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
        style:animation-play-state={reduced ? 'paused' : 'running'}
      ></span>
    {/each}
  </div>

  <!-- Both bodies share the orbit point and cross-fade with the theme: the sun sets as the moon rises. -->
  <div
    class={['absolute top-0 left-0 transition-opacity duration-700', !sky.ready && 'opacity-0']}
    style:transform={`translate3d(${sky.x}px, ${sky.y}px, 0)`}
  >
    <svg
      class={['sun absolute overflow-visible transition duration-1000', theme === 'light' ? 'opacity-100' : 'translate-y-6 opacity-0']}
      width="1"
      height="1"
    >
      <AsciiSprite rows={SUN} cell={sky.cell} />
    </svg>
    <svg
      class={['moon absolute overflow-visible transition duration-1000', theme === 'dark' ? 'opacity-100' : 'translate-y-6 opacity-0']}
      width="1"
      height="1"
    >
      <AsciiSprite rows={MOON} cell={sky.cell} />
    </svg>
  </div>
</div>

<style>
  .sun {
    --ascii-ink: #e9a72a;
    --ascii-paper: #ffffff;
    filter: drop-shadow(0 0 18px rgb(255 211 140 / 0.45));
  }

  .moon {
    --ascii-ink: #c5ced6;
    --ascii-paper: #020817;
    /* Keep the moon a quiet backdrop element; opacity is left to the theme cross-fade. */
    filter: brightness(0.85);
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

  @media (prefers-reduced-motion: reduce) {
    .sky-glow,
    .sun,
    .moon {
      transition: none;
    }
  }
</style>
