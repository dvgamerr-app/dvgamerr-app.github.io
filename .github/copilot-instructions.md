# Tech Stack

- You are building an Astro portfolio application with i18n support (English and Thai).
- Use TypeScript for type safety.
- Use Astro components (.astro files) for the main structure.
- Always put source code in the src folder.
- Put pages into src/pages/ (with th/ subfolder for Thai translations)
- Put components into src/components/
- Put layouts into src/layouts/
- The main pages are src/pages/index.astro (English) and src/pages/th/index.astro (Thai)
- UPDATE the main pages to include new components when creating them. OTHERWISE, the user can NOT see any components!
- Use Bootstrap 5 for styling components and layout.
- Use Sass/SCSS for custom styling in src/styles/
- Always follow the existing file structure and naming conventions.

## Project Structure Guidelines

- **Components**: All Astro components should be in src/components/
- **Layouts**: Main layout is in src/layouts/Layout.astro
- **Pages**: English pages in src/pages/, Thai pages in src/pages/th/
- **Assets**: Images and icons in src/assets/
- **Styles**: Global styles in src/styles/ using SCSS
- **i18n**: Internationalization files in src/i18n/
- **Work Experience**: Markdown files in src/components/work/en/ and src/components/work/th/

## Available Packages and Libraries

- **Astro 5**: The main framework
- **Bootstrap 5**: For styling and layout components
- **Sass**: For custom SCSS styling
- **dayjs**: For date/time manipulation
- **numeral**: For number formatting
- **Sharp**: For image optimization
- **@astrojs/sitemap**: For sitemap generation
- **astro-robots-txt**: For robots.txt generation
- **@vite-pwa/astro**: For PWA functionality
- **charts.css**: For chart styling
- **astro-google-fonts-optimizer**: For font optimization

## Styling Guidelines

- **Primary Styling**: Use Bootstrap 5 classes for layout, components, and utilities
- **Custom Styles**: Add custom SCSS in src/styles/ following the existing pattern (\_1-header.scss, \_2-contact.scss, etc.)
- **Global Styles**: Use global.scss for site-wide styles
- **Responsive Design**: Utilize Bootstrap's responsive grid system and utilities

## i18n Guidelines

- **Language Support**: English (default) and Thai
- **Translation Files**: Use JSON files in src/i18n/ for translations
- **URL Structure**: English at root (/), Thai with /th/ prefix
- **Components**: Create language-specific content in src/components/work/en/ and src/components/work/th/

## Component Guidelines

- **Astro Components**: Use .astro file extension for components
- **TypeScript**: Use TypeScript in component scripts when needed
- **Props Interface**: Define Props interface for component properties
- **Frontmatter**: Use --- for component logic and imports
- **Styling**: Use Bootstrap classes and custom SCSS as needed

## Best Practices

- Follow the existing naming conventions (kebab-case for files)
- Maintain the current folder structure
- Use the established i18n system for any text content
- Optimize images using the Sharp integration
- Follow Bootstrap 5 conventions for responsive design
- Keep components modular and reusable
- Use semantic HTML elements
- Maintain accessibility standards
- No explain
