# Repository notes

## Project conventions

- Runtime and package manager: Bun (`packageManager` in `package.json`).
- Framework: Astro 7 (pages and layout), Svelte 5 (all UI components), TypeScript, and Tailwind CSS 4. Do not upgrade to TypeScript 7; `@astrojs/svelte` supports TypeScript 5 and 6 only.
- Keep English and Thai output behavior aligned. English renders from `src/pages/index.astro`; Thai supplies localized resume data through `src/pages/th/index.astro`.
- UI components are Svelte files in `src/components/`. Pass `lang` as a prop and use `useTranslations(lang)` because `Astro.url` is unavailable inside Svelte. Hydration directives only work in `.astro` files: `Hero` uses `client:load`, `ProfileBadges` uses `client:idle` through the `badges` slot of `Header.svelte`, and `GoogleAd` uses `client:visible`. Everything else stays static HTML.
- Reuse `src/components/SectionShell.svelte` for the standard 3/9-column section heading/content layout.
- Reuse `src/components/StatGrid.svelte` for four-column summary statistics instead of duplicating card markup.
- Follow the hero design language everywhere: `src/lib/ui.ts` holds the `button` (primary, secondary, icon) and `pill(tone)` class recipes; content sections (contact, stats, charts, education) stay borderless without card backgrounds and group items with whitespace; `SectionTitle.svelte` renders section headings with the accent rule; `.eyebrow` and `.caps` in `global.css` give tracked uppercase labels and drop the tracking for Thai via `:lang(th)`, so do not add `tracking-*` utilities to them.
- AI and work-type telemetry comes from the waka-personal export, stored as-is in `src/i18n/telemetry.json`, and renders through `CodingWorkType.svelte` and `CodingAssisted.svelte`. The monthly chart keeps the last 12 entries because the range starts and ends mid-month.
- Income figures derive from `experience.json`: monthly income is `salary.base + salary.extra / 12`, and the hourly rate divides that by `salary.day` and `salary.hour`.
- Keep content changes in `src/i18n/*.json` (the hero words live in `resume.*.json` under `hero`) and work history Markdown in `src/components/work/en|th/`. The page compiles that Markdown through `src/utils/workContent.ts`, because Svelte SSR cannot await it.
- Global `a` and `h1`–`h6` rules in `src/styles/global.css` are unlayered, so they override Tailwind utilities. Use the `!` suffix for link colors and heading sizes, for example `text-white!`.
- Motion Core components are vendored in `src/lib/motion-core/` through `bunx @motion-core/cli add <slug>` and excluded from Prettier. Never run `motion-core init` token sync into `global.css`, because its `--background` token conflicts with the HSL theme tokens. `globe/GlobeScene.svelte` and `globe/Globe.svelte` carry local patches (the `?url` texture import for Astro, the DPR cap, mix blending for the light theme, and the `rotationOffset` prop); re-apply them after `add globe --yes`.
- Before handing off changes, run `bun run lint`, `bun run format`, `bun run build`, and `git diff --check`.

## Optimization record — 2026-08-02

- Added `SectionShell.astro` and migrated coding daytime, coding history, coding repositories, skills, and education sections. This centralizes repeated responsive layout classes and removes one container wrapper from each migrated section.
- Added semantic `StatGrid.astro` (`dl`/`dt`/`dd`) and data-driven stat definitions. This replaces eight duplicated cards while preserving their responsive classes and displayed values.
- Removed empty hero/footer spacer elements by using explicit CSS grid start columns, and moved the `projects` anchor onto the project section to remove a nested section wrapper.
- Replaced the page's nested outer containers with one `main` element while retaining the same mobile and desktop padding values.
- Removed selectors that had no markup references, duplicate chart-cell styling, and references to undefined fade keyframes. This reduces unused CSS without changing active styles.
- Moved the Day.js `relativeTime` setup to the header component that consumes it and computes the shared social image URL once in the layout.
- Renamed ambiguous loop variables and corrected the internal `Hightlight` misspelling to make the chart code easier to maintain without changing its data mapping.
- Updated `README.md` for the current Astro version, actual content locations, shared components, and verification commands.

### Evidence and verification

- Relevant generated DOM nodes (`div`, `section`, `span`, `p`, `dl`, `dt`, `dd`) decreased from 307 to 290 per generated language page (17 fewer, about 5.5%).
- `bun run lint`: pass.
- `bun run build`: pass; generated `/index.html` and `/th/index.html`, sitemap, robots file, PWA assets, and optimized images.
- `bun run astro check`: unavailable because `@astrojs/check` is not installed; the Astro CLI requested an interactive dependency installation, so no dependency was added.
- The repository-wide `bun run format` baseline already reports eight pre-existing files. A targeted check of the refactor and documentation files outside that baseline passes Prettier; `Project.astro` remains on the baseline list and this change only adds its section anchor.
- Pre-existing working-tree change kept untouched: `package.json` pins `packageManager` from `bun` to `bun@1.3.14`.

## Motion hero and Svelte migration record — 2026-09-26

- Replaced the project section with `Hero.svelte`, a full-screen Motion Core `Globe` (OGL) centered on Bangkok with a `TextLoop` headline. The globe is a fixed backdrop for the whole page. GSAP ScrollTrigger scrubs its pose from the hero into a dimmed planet horizon behind the resume, spins it with page scroll, and fades the hero copy.
- Theme colors come from `src/lib/theme.svelte.ts`, which the header theme toggle also updates, including the `theme-color` meta tag.
- Resume blocks with `.scroll-reveal` rise in with CSS scroll-driven animations (`animation-timeline: view()`). All motion is limited to `screen` and `prefers-reduced-motion: no-preference`; with reduced motion the globe holds its hero pose and only fades.
- Migrated every `.astro` component to Svelte 5 and removed the static SVG `--bg-image` background.

### Evidence and verification

- Text from `#resume` to the end of `main` is identical to the previous build for `/` and `/th/`. The only differences are `&copy;` → `©` encoding, the inline badge script becoming an island, and one empty `span` removed from the Thai print nickname.
- Headless Chrome screenshots checked desktop and mobile, light and dark, Thai, reduced motion, and print emulation. Print still hides the hero and globe and shows the print-only resume fields.
- `bun run lint`: pass. `bun run build`: pass. `git diff --check`: pass.
- `bun run format` fails only on four pre-existing files: `.github/workflows/gh-pages.yml`, `README.md`, `src/i18n/coding.json`, and `src/utils/dateUtils.ts`.
- The `Hero` island is about 83 KB gzip (Svelte components, GSAP with ScrollTrigger, and OGL). The shared Svelte client runtime is about 18 KB gzip.
