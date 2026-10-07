<script lang="ts">
  import type { SkyState } from '../lib/orbit'
  import type { Theme } from '../lib/theme.svelte'

  interface Props {
    theme: Theme
    sky: SkyState
    reduced: boolean
  }

  let { theme, sky, reduced }: Props = $props()

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
    background: radial-gradient(circle, #fffef9 0%, #fff9e5 70%, #ffedbd 100%);
    box-shadow:
      0 0 24px 5px rgb(255 223 160 / 0.35),
      0 0 80px 20px rgb(255 211 140 / 0.12);
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
      inset -13px 5px 3px 1px rgb(2 8 23 / 0.96),
      0 0 18px 2px rgb(190 207 230 / 0.08),
      0 0 48px 10px rgb(170 192 222 / 0.025);
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

  @media (prefers-reduced-motion: reduce) {
    .sky-glow,
    .sun,
    .moon {
      transition: none;
    }
  }
</style>
