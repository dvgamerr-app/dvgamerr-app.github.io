/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_ADSENSE_CLIENT?: string
  readonly PUBLIC_ADSENSE_HOME_SLOT?: string
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
