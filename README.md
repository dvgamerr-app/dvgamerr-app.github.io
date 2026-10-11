<div align="center">

# dvgamerr.app

**A bilingual (EN/TH) developer portfolio with a live 3D globe hero, and the source is yours to fork.**

Static Astro pages, Svelte 5 islands only where they are needed, a WebGL globe that follows your scroll, and a resume driven entirely by JSON and Markdown.

<p>
  <a href="https://github.com/dvgamerr-app/dvgamerr-app.github.io/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/dvgamerr-app/dvgamerr-app.github.io?style=for-the-badge&logo=github&color=FF5D01"></a>
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/github/license/dvgamerr-app/dvgamerr-app.github.io?style=for-the-badge&color=0F766E"></a>
  <a href="https://dvgamerr.app"><img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fdvgamerr.app&style=for-the-badge&logo=googlechrome&logoColor=white"></a>
  <br/>
  <img alt="Astro 7" src="https://img.shields.io/badge/Astro-7-FF5D01?style=for-the-badge&logo=astro&logoColor=white">
  <img alt="Svelte 5" src="https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img alt="Bun" src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white">
</p>

<p>
  <a href="https://dvgamerr.app">Live site</a>
  · <a href="https://dvgamerr.app/th/">Thai version</a>
  · <a href="#quick-start">Quick start</a>
  · <a href="#make-it-yours">Make it yours</a>
  · <a href="./README.th.md">ภาษาไทย</a>
</p>

<img src="./docs/dark-light.jpg" alt="Preview of the portfolio in dark and light themes" />

**If this saves you a weekend of building your own portfolio, a ⭐ helps other developers find it.**

</div>

---

## Why

- **A hero people remember.** A full-screen [Motion Core](https://motion-core.dev/) globe centered on Bangkok sits behind the whole page, with a sky that follows the theme (sun, moon, stars, god rays) and orbiting satellites. Scrolling spins it down into a horizon behind your resume.
- **Fast by default.** Pages are static HTML. Only three islands hydrate (`Hero` on load, profile badges on idle, the ad slot when visible). The Hero island is about 83 KB gzip, including GSAP and OGL.
- **Two languages, one codebase.** English at `/` and Thai at `/th/`, from the same components and separate JSON.
- **Content is data.** Edit JSON and Markdown, not markup. Income, stats and coding charts are derived from the data files.

## Features

|     | Feature                   | What you get                                                                                                                             |
| --- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 🌍  | **3D globe hero**         | WebGL globe (OGL) with scroll-scrubbed pose via GSAP ScrollTrigger, a rim and atmosphere light that tracks the sun or moon               |
| 🛰️  | **Satellite layer**       | Satellites that retask, link to agents and uplink to Bangkok, plus a UFO visit that triggers a glitch → debug → fix → recovered timeline |
| 🌗  | **Light and dark themes** | Theme toggle that also updates the `theme-color` meta tag                                                                                |
| 🇹🇭  | **EN/TH i18n**            | Localized resume data and UI strings; Thai drops letter-spacing on tracked labels                                                        |
| 📊  | **Coding telemetry**      | WakaTime-based charts for languages, work types, AI-assisted coding and repositories                                                     |
| 🧩  | **Reusable sections**     | `SectionShell` and `StatGrid` keep every section layout consistent                                                                       |
| 📱  | **PWA**                   | Installable via `@vite-pwa/astro`, with sitemap, robots.txt and Open Graph tags                                                          |
| 🖨️  | **Print-ready resume**    | Print styles hide the hero and globe and show print-only resume fields                                                                   |
| ♿  | **Reduced motion**        | With `prefers-reduced-motion` the globe holds its hero pose and only fades                                                               |
| 🤖  | **`llms.txt`**            | A machine-readable summary at `/llms.txt`                                                                                                |

## Quick start

You need [Bun](https://bun.sh/) 1.3.14 or newer.

```shell
git clone https://github.com/dvgamerr-app/dvgamerr-app.github.io.git
cd dvgamerr-app.github.io
bun install
bun run dev
```

Open the URL Astro prints (usually `http://localhost:4321`) for English, and `/th/` for Thai.

Build the static site into `dist/`:

```shell
bun run build
```

## Make it yours

| What                             | Where                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| Resume text, hero words (`hero`) | `src/i18n/resume.en.json`, `src/i18n/resume.th.json`                                         |
| Work history                     | `src/components/work/en/*.md`, `src/components/work/th/*.md`                                 |
| Salary-derived income figures    | `src/i18n/experience.json`                                                                   |
| Coding and AI telemetry          | `src/i18n/coding.json`, `src/i18n/telemetry.json`                                            |
| Page entry points                | `src/pages/index.astro` (EN), `src/pages/th/index.astro` (TH)                                |
| Shared section layout            | `src/components/SectionShell.svelte`, `src/components/StatGrid.svelte`                       |
| Button and pill styles           | `src/lib/ui.ts`                                                                              |
| Globe, sky and satellites        | `src/components/Hero.svelte`, `SkyLayer.svelte`, `SatelliteLayer.svelte`, `src/lib/orbit.ts` |

Replace the personal data, icons in `public/`, and the domain in `CNAME` and `astro.config.mjs`.

<details>
<summary>Refreshing the telemetry data</summary>

`bun run collector` pulls GitHub and WakaTime data through `collector/index.js`. `collector:wk` reads a WakaTime export from a local file path that is hard-coded in `package.json`, so change that path first.

</details>

## Architecture

```
 Markdown + JSON (src/i18n, src/components/work)
            │
            ▼
   Astro pages  ──►  static HTML  (/  and  /th/)
            │
            ▼
   Svelte 5 islands: Hero (load) · ProfileBadges (idle) · GoogleAd (visible)
            │
            ▼
   Motion Core globe (OGL) + GSAP ScrollTrigger + sky and satellite layers
```

Stack: Astro 7, Svelte 5, TypeScript 5/6, Tailwind CSS 4, GSAP, OGL, Bun.

> TypeScript 7 is not supported yet because `@astrojs/svelte` and typescript-eslint do not support it.

## Develop

```shell
bun run lint      # ESLint
bun run format    # Prettier check (format:fix to write)
bun run build     # static build into dist/
```

Motion Core components are vendored in `src/lib/motion-core/`. Add more with `bunx @motion-core/cli add <slug>`, and do not run `motion-core init` token sync into `global.css`. See [CLAUDE.md](./CLAUDE.md) for the local patches to re-apply after updating the globe or god-rays.

## Support the project

- ⭐ [Star the repo](https://github.com/dvgamerr-app/dvgamerr-app.github.io) if it helped you
- 🐛 [Open an issue](https://github.com/dvgamerr-app/dvgamerr-app.github.io/issues) for bugs or ideas
- 🔀 Pull requests are welcome

## License and credits

MIT. See [LICENSE](./LICENSE). If you fork it, replace the personal content (resume text, photos, work history) with your own.

Reference tools: [Mini QR Code Generator](https://mini-qr-code-generator.vercel.app/), [IconScout](https://iconscout.com/).
