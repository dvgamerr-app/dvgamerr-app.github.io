<script lang="ts">
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { onMount } from 'svelte'

  import { type Lang, useTranslations } from '../i18n/utils'
  import { Globe, type GlobeMarker, type GlobeMarkerTooltipContext, TextLoop } from '../lib/motion-core'
  import { themeState } from '../lib/theme.svelte'
  import { button, pill } from '../lib/ui'
  import type { Resume } from '../types'
  import HeaderActions from './HeaderActions.svelte'

  interface Props {
    lang: Lang
    resume: Resume
    interview: boolean
  }

  let { lang, resume, interview }: Props = $props()

  const t = $derived(useTranslations(lang))

  const BANGKOK: [number, number] = [13.7563, 100.5018]

  const PALETTES = {
    dark: { base: '#0d1122', rim: '#c84b31', land: '#e0643f', marker: '#ffdc5a', rimIntensity: 1.2, glow: 1.1 },
    light: { base: '#e8edf8', rim: '#3068d8', land: '#3068d8', marker: '#ee5151', rimIntensity: 0.9, glow: 0.55 },
  }

  const palette = $derived(PALETTES[themeState.current])
  const fresnelConfig = $derived({ color: palette.base, rimColor: palette.rim, rimPower: 5, rimIntensity: palette.rimIntensity })
  const atmosphereConfig = $derived({ color: palette.rim, intensity: palette.glow, scale: 1.12 })
  const markers = $derived<GlobeMarker[]>([{ location: BANGKOK, size: 0.07, color: palette.marker, label: t('hero.location') }])

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
  const aspect = () => window.innerWidth / Math.max(1, window.innerHeight)

  // Hero: globe beside the copy (landscape) or above it (portrait).
  const heroPose = () => {
    const ratio = aspect()
    if (ratio >= 1) return { offsetX: 0.22, offsetY: 0, scale: clamp(ratio * 0.6, 0.7, 1.05) }
    const scale = clamp(ratio * 1.15, 0.45, 0.7)
    return { offsetX: 0, offsetY: 0.42 - 0.4 * scale, scale }
  }
  // Resume: the globe sinks into a dimmed planet horizon behind the content.
  const resumePose = () => (aspect() >= 1 ? { offsetX: 0.3, offsetY: -0.62, scale: 2.1 } : { offsetX: 0, offsetY: -0.6, scale: 1.3 })

  // Written by GSAP (scroll, sway, pointer parallax) and read by the globe and veil.
  const motion = $state({ offsetX: 0.22, offsetY: 0, px: 0, py: 0, scale: 1, spin: 0, sway: 0, veil: 0 })
  let reduceMotion = $state(false)

  let heroEl = $state<HTMLElement>()
  let copyEl = $state<HTMLElement>()
  let cueEl = $state<HTMLElement>()

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    // matchMedia only runs the callback while at least one condition matches, so both states are listed.
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
      const reduce = !!context.conditions?.reduce
      reduceMotion = reduce

      const scroll = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { end: 'bottom top', invalidateOnRefresh: true, scrub: reduce ? true : 0.8, start: 'top top', trigger: heroEl },
      })
      scroll
        .fromTo(
          motion,
          { offsetX: () => heroPose().offsetX, offsetY: () => heroPose().offsetY, scale: () => heroPose().scale },
          {
            duration: 1,
            ease: 'power2.inOut',
            offsetX: () => (reduce ? heroPose() : resumePose()).offsetX,
            offsetY: () => (reduce ? heroPose() : resumePose()).offsetY,
            scale: () => (reduce ? heroPose() : resumePose()).scale,
          },
          0,
        )
        .fromTo(motion, { veil: 0 }, { duration: 1, veil: 0.86 }, 0)
        .to(copyEl, { autoAlpha: 0, duration: 0.55, ease: 'power1.in', y: reduce ? 0 : -72 }, 0)
        .to(cueEl, { autoAlpha: 0, duration: 0.15 }, 0)

      if (reduce) return

      gsap.fromTo(motion, { spin: 0 }, { ease: 'none', scrollTrigger: { end: 'max', scrub: 1.2, start: 0 }, spin: -Math.PI * 1.5 })
      gsap.fromTo(motion, { sway: 0 }, { duration: 7, ease: 'sine.inOut', repeat: -1, sway: 0.24, yoyo: true })

      const parallaxX = gsap.quickTo(motion, 'px', { duration: 1.2, ease: 'power3.out' })
      const parallaxY = gsap.quickTo(motion, 'py', { duration: 1.2, ease: 'power3.out' })
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        parallaxX((event.clientX / window.innerWidth - 0.5) * 0.03)
        parallaxY((0.5 - event.clientY / window.innerHeight) * 0.03)
      }
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      return () => window.removeEventListener('pointermove', onPointerMove)
    })

    return () => mm.revert()
  })
</script>

{#snippet markerLabel({ marker }: GlobeMarkerTooltipContext)}
  <span
    class="th-label whitespace-nowrap rounded-full border border-gray-300/70 dark:border-white/15 bg-white/85 dark:bg-gray-900/70 px-2.5 py-1 text-xs font-medium text-gray-800 dark:text-gray-100 shadow-sm backdrop-blur-sm"
    style:opacity={Math.max(0, 1 - motion.veil * 2.5)}
  >
    {marker.label}
  </span>
{/snippet}

<div class="motion-backdrop pointer-events-none fixed inset-0 z-0 print:hidden" aria-hidden="true">
  <Globe
    scale={motion.scale}
    offsetX={motion.offsetX + motion.px}
    offsetY={motion.offsetY + motion.py}
    rotationOffset={motion.spin + motion.sway}
    autoRotate={false}
    focusOn={BANGKOK}
    {fresnelConfig}
    {atmosphereConfig}
    landPointColor={palette.land}
    pointCount={14000}
    pointSize={0.055}
    {markers}
    markerTooltip={markerLabel}
  />
  <div class="absolute inset-0 bg-background" style:opacity={motion.veil}></div>
</div>

<section bind:this={heroEl} class="relative z-10 flex min-h-svh flex-col print:hidden" aria-labelledby="hero-title">
  <div
    class="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-background via-background/75 to-transparent landscape:hidden"
    aria-hidden="true"
  ></div>

  <nav class="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 pt-5 md:pt-8" aria-label="Primary">
    <a
      href={lang === 'th' ? '/th/' : '/'}
      class="th-label text-lg font-semibold tracking-tight text-gray-900! dark:text-gray-100! hover:text-(--text-color-link)!"
    >
      dvgamerr<span class="text-(--text-color-link)">.</span>app
    </a>
    <HeaderActions {lang} />
  </nav>

  <div class="relative mx-auto flex w-full max-w-7xl flex-1 items-end px-4 pt-10 pb-28 landscape:items-center">
    <div bind:this={copyEl} class="max-w-xl">
      <p class="hero-rise eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-gray-600 dark:text-gray-400">
        <span class="th-label inline-flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11Z"></path>
            <circle cx="12" cy="10" r="2.5"></circle>
          </svg>
          {t('hero.location')}
        </span>
        {#if interview}
          <span class={[pill('success'), 'normal-case tracking-normal']}>
            <span class="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></span>
            {t('hero.available')}
          </span>
        {/if}
      </p>

      <h1
        id="hero-title"
        class={[
          'hero-rise th-label mt-5 text-5xl! sm:text-6xl! lg:text-7xl! font-bold uppercase tracking-tight text-gray-900 dark:text-gray-50',
          lang === 'th' ? 'leading-[1.25]!' : 'leading-[0.95]!',
        ]}
        style="--delay: 80ms"
      >
        {resume.fullname}
      </h1>

      <p class="hero-rise th-label mt-5 text-xl sm:text-2xl font-medium text-gray-700 dark:text-gray-200" style="--delay: 160ms">
        <span class="sr-only">{resume.hero.lead} {resume.hero.words.join(', ')}</span>
        <span aria-hidden="true">
          {resume.hero.lead}
          <span class="text-(--text-color-link)">
            {#if reduceMotion}{resume.hero.words[0]}{:else}<TextLoop texts={resume.hero.words} interval={2600} />{/if}
          </span>
        </span>
      </p>

      <p
        class="hero-rise mt-5 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-4 md:line-clamp-none"
        style="--delay: 240ms"
      >
        {resume.detail}
      </p>

      <div class="hero-rise mt-8 flex flex-wrap items-center gap-3" style="--delay: 320ms">
        <a href="#resume" class={button.primary}>
          {t('head.button.resume')}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 5v14M6 13l6 6 6-6"></path>
          </svg>
        </a>
        <a href="#experience" class={button.secondary}>
          {t('hero.experience')}
        </a>
      </div>
    </div>
  </div>

  <a
    bind:this={cueEl}
    href="#resume"
    class="eyebrow th-label absolute bottom-6 left-1/2 flex min-h-11 -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-medium text-gray-500! dark:text-gray-400!"
  >
    <span>{t('hero.scroll')}</span>
    <span class="relative h-10 w-px overflow-hidden bg-gray-400/40" aria-hidden="true">
      <span class="scroll-cue-dot absolute inset-x-0 top-0 h-4 bg-(--text-color-link)"></span>
    </span>
  </a>
</section>

<style>
  @media screen and (prefers-reduced-motion: no-preference) {
    .motion-backdrop {
      animation: backdrop-in 1.6s ease-out both;
    }

    .hero-rise {
      animation: hero-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
      animation-delay: var(--delay, 0ms);
    }

    .scroll-cue-dot {
      animation: scroll-cue 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
    }
  }

  @keyframes backdrop-in {
    from {
      opacity: 0;
    }
  }

  @keyframes hero-rise {
    from {
      opacity: 0;
      filter: blur(6px);
      transform: translateY(1.5rem);
    }
  }

  @keyframes scroll-cue {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(250%);
    }
  }
</style>
