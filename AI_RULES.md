# AI_RULES.md

## Tech Stack Overview

- **Framework:** [Astro](https://astro.build/) for static site generation and component-based architecture.
- **Languages:** TypeScript and JavaScript for scripting; SCSS for styling.
- **Styling:** Uses [Bootstrap 5](https://getbootstrap.com/) (SCSS) and [Tailwind CSS](https://tailwindcss.com/) via utility classes.
- **Component Libraries:** 
  - [shadcn/ui](https://ui.shadcn.com/) for modern, accessible UI components.
  - [Radix UI](https://www.radix-ui.com/) for low-level, accessible UI primitives.
- **Icons:** [lucide-react](https://lucide.dev/) for iconography.
- **Date/Time:** [dayjs](https://day.js.org/) for date manipulation and formatting.
- **Data Visualization:** [charts.css](https://charts-css.org/) for simple, CSS-based charts.
- **Internationalization:** Custom i18n system using JSON files and utility functions.
- **Other Utilities:** 
  - [numeral](http://numeraljs.com/) for number formatting.
  - [pino](https://getpino.io/) for logging (in data collectors).
  - [arg](https://www.npmjs.com/package/arg) for CLI argument parsing in collectors.

## Library Usage Rules

- **UI Components:**  
  - Use `shadcn/ui` components for all new UI elements where possible.
  - Use `Radix UI` only for advanced accessibility or when shadcn/ui does not provide the needed primitive.
- **Styling:**  
  - Use Tailwind CSS utility classes for layout, spacing, and quick styling.
  - Use Bootstrap SCSS for grid and responsive layout, but prefer Tailwind for new styles.
  - Write custom SCSS only for global or reusable styles.
- **Icons:**  
  - Use `lucide-react` for all icons. Do not use other icon libraries.
- **Date/Time:**  
  - Use `dayjs` for all date and time formatting and calculations.
- **Charts:**  
  - Use `charts.css` for simple, responsive data visualizations. Do not introduce JS chart libraries unless absolutely necessary.
- **Internationalization:**  
  - Use the existing i18n utility functions and JSON files for all user-facing text.
- **Number Formatting:**  
  - Use `numeral` for formatting numbers, currencies, and statistics.
- **Data Fetching (Collectors):**  
  - Use native `fetch` and `arg` for CLI tools. Use `pino` for logging in Node scripts.
- **Do Not Use:**  
  - Do not add new UI libraries (e.g., Material UI, Ant Design).
  - Do not use jQuery or legacy JavaScript libraries.
  - Do not use other icon sets or charting libraries unless discussed and approved.

## General Guidelines

- Always prefer existing components and utilities before adding new dependencies.
- Keep all code modular, readable, and maintainable.
- Ensure all UI is responsive and accessible.
- Follow the project's code style and structure for all new files.