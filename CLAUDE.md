# Repository notes

## Project conventions

- Runtime and package manager: Bun (`packageManager` in `package.json`).
- Framework: Astro 6, TypeScript, and Tailwind CSS 4.
- Keep English and Thai output behavior aligned. English renders from `src/pages/index.astro`; Thai supplies localized resume data through `src/pages/th/index.astro`.
- Reuse `src/components/SectionShell.astro` for the standard 3/9-column section heading/content layout.
- Reuse `src/components/StatGrid.astro` for four-column summary statistics instead of duplicating card markup.
- Keep content changes in `src/i18n/*.json` and work history Markdown in `src/components/work/en|th/`.
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
