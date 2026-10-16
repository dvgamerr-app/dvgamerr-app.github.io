<script lang="ts">
  import { setupTraceway } from '@tracewayapp/svelte'

  // "<project ingest token>@<instance>/api/report"; without it the reporter stays a no-op.
  const connectionString = import.meta.env.PUBLIC_TRACEWAY_DSN
  if (connectionString) {
    try {
      setupTraceway({ connectionString, options: { recordAllSessions: true } })
    } catch (e) {
      console.warn('Traceway disabled:', e instanceof Error ? e.message : e)
    }
  }
</script>
