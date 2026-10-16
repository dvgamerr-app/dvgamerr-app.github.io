/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string
  readonly PUBLIC_TRACEWAY_DSN?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
