<script lang="ts">
  import { onMount } from 'svelte'

  import coding from '../i18n/coding.json'
  import { pill } from '../lib/ui'

  const API = {
    githubUser: 'https://api.github.com/users/dvgamerr',
    visitor: (host: string) =>
      `https://api.visitorbadge.io/api/visitors?path=${host}&label=visitors&countColor=%2337d67a&style=flat-square`,
  }

  let followers = $state('...')
  let visitors = $state('...')

  async function updateGitHubFollowers() {
    try {
      const res = await fetch(API.githubUser)
      if (!res.ok) return
      const data = await res.json()
      if (data.followers != null) followers = String(data.followers)
    } catch (e) {
      console.warn('GitHub followers fetch failed', e)
    }
  }

  async function updateVisitorCount() {
    const host = window.location.host
    if (!host) return
    try {
      const res = await fetch(API.visitor(host), { cache: 'no-store' })
      if (!res.ok) return
      const svg = await res.text()
      const match = svg.match(/>(\d[\d,]*)<\//)
      const raw = match ? match[1].replace(/,/g, '') : ''
      visitors = raw ? Number(raw).toLocaleString('en-US') : '—'
    } catch (e) {
      console.warn('Visitor badge fetch failed', e)
    }
  }

  onMount(() => {
    updateGitHubFollowers()
    updateVisitorCount()
  })
</script>

<div class="flex gap-2 mt-3 flex-wrap items-center print:hidden">
  <a
    href="https://wakatime.com/@dvgamerr"
    target="_blank"
    rel="noopener noreferrer"
    class={[pill('info'), 'transition hover:border-blue-600/60 dark:hover:border-blue-300/60']}
    aria-label="WakaTime coding activity"
  >
    <span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden="true"></span>
    <span>WakaTime</span>
    <span class="font-semibold">{coding.wakatime}</span>
  </a>
  <a
    href="https://github.com/dvgamerr"
    target="_blank"
    rel="noopener noreferrer"
    class={[pill('warning'), 'transition hover:border-amber-600/60 dark:hover:border-amber-300/60']}
    aria-label="GitHub followers"
  >
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" class="fill-current"
      ><path
        d="M8 0C3.58 0 0 3.73 0 8.337c0 3.687 2.292 6.81 5.47 7.91.4.077.547-.177.547-.394 0-.194-.007-.71-.01-1.395-2.226.5-2.695-1.099-2.695-1.099-.364-.958-.89-1.214-.89-1.214-.727-.51.055-.5.055-.5.803.058 1.225.845 1.225.845.715 1.255 1.874.893 2.33.683.072-.534.28-.893.508-1.098-1.777-.207-3.644-.915-3.644-4.074 0-.9.31-1.636.823-2.213-.083-.207-.357-1.04.078-2.17 0 0 .672-.22 2.2.846A7.33 7.33 0 0 1 8 3.987c.68.003 1.366.094 2.005.276 1.527-1.065 2.198-.846 2.198-.846.437 1.13.163 1.963.08 2.17.513.577.822 1.313.822 2.213 0 3.167-1.87 3.864-3.652 4.067.287.257.543.764.543 1.54 0 1.112-.01 2.008-.01 2.283 0 .219.146.474.55.393 3.175-1.101 5.465-4.223 5.465-7.909C16 3.73 12.42 0 8 0Z"
      ></path></svg
    >
    <span>Github</span>
    <span class="font-semibold">{followers}</span>
  </a>
  <span class={pill('success')}>
    <span class="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true"></span>
    <span>Visitors</span>
    <span class="font-semibold">{visitors}</span>
  </span>
</div>
