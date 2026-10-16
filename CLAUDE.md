# Repository notes

## Stack

- Bun (`packageManager` in `package.json`), Astro 7, Svelte 5 (all UI), TypeScript, Tailwind CSS 4.
- Do not upgrade to TypeScript 7; `@astrojs/svelte` supports only 5 and 6.
- English renders from `src/pages/index.astro`; Thai passes localized resume data via `src/pages/th/index.astro`. Keep both behaviors aligned.

## Components

- UI lives in `src/components/*.svelte`. Pass `lang` as a prop and call `useTranslations(lang)`; `Astro.url` is unavailable in Svelte.
- Hydration directives work only in `.astro` files: `Hero` is `client:load`, `ProfileBadges` is `client:idle` (via the `badges` slot of `Header.svelte`). Everything else is static HTML.
- Reuse `SectionShell.svelte` (3/9-column section layout) and `StatGrid.svelte` (four-column stats) instead of duplicating markup.

## Design

- Follow the hero design language: `src/lib/ui.ts` holds the `button` and `pill(tone)` recipes; content sections stay borderless with no card backgrounds and group items with whitespace; `SectionTitle.svelte` renders headings with the accent rule.
- `.eyebrow` and `.caps` in `global.css` already handle tracking (dropped for Thai via `:lang(th)`), so never add `tracking-*` to them.
- Global `a` and `h1`–`h6` rules in `global.css` are unlayered and beat Tailwind utilities; use the `!` suffix (for example `text-white!`).

## Content and data

- Edit content in `src/i18n/*.json` (hero words under `hero` in `resume.*.json`) and work history Markdown in `src/components/work/en|th/`, compiled by `src/utils/workContent.ts` because Svelte SSR cannot await.
- Telemetry (`src/i18n/telemetry.json`) is the waka-personal export stored as-is; the monthly chart keeps the last 12 entries since the range starts and ends mid-month.
- Income comes from `experience.json`: monthly = `salary.base + salary.extra / 12`; hourly = monthly ÷ `salary.day` ÷ `salary.hour`.

## Hero and Motion Core

- Motion Core is vendored in `src/lib/motion-core/` via `bunx @motion-core/cli add <slug>` and excluded from Prettier. Never run `motion-core init` token sync; its `--background` conflicts with the HSL theme tokens.
- Re-apply local patches after re-adding: `globe/GlobeScene.svelte` and `globe/Globe.svelte` (`?url` texture import, DPR cap, mix blending for light theme, `rotationOffset`, `lightDirection` shading, `onFrame` callback with `GlobeFrame`/`GlobeLight`/`GlobePoint` types exported from the barrel) after `add globe --yes`; `god-rays/GodRaysScene.svelte` (`dpr: 1`) after `add god-rays --yes`.
- The backdrop stacks `SkyLayer.svelte` (GodRays plus CSS sun/moon/stars following the theme), the globe, and `SatelliteLayer.svelte`. `Hero.svelte` computes the far-body orbit in `onFrame`; satellite rules, the UFO visit (~20 s, then ~90 s) and the incident timeline live in `src/lib/orbit.ts`.
- Keep the `data-state` binding in `SatelliteLayer.svelte` markup; its `[data-state]` styles survive compilation only because of it.
- Motion is limited to `screen` and `prefers-reduced-motion: no-preference`; theme colors come from `src/lib/theme.svelte.ts`.

## Before handing off or opening a PR

Run `bun run lint`, `bun run format`, `bun run build`, and `git diff --check`. Fix format failures with Prettier instead of skipping them as baseline.
