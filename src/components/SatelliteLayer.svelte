<script lang="ts">
  import type { GlobeFrame } from '../lib/motion-core'

  import AsciiSprite from './AsciiSprite.svelte'
  import { createFleet, createUfo, incidentState, latLonPosition, satellitePosition, startIncident, stepFleet, stepUfo } from '../lib/orbit'

  interface Props {
    /** How many of the six agents fly (fewer on small screens). */
    count: number
    /** Uplink target [lat, lon]. */
    hub: [number, number]
    /** 0–1; labels fade out as the hero scrolls away. */
    labelOpacity: number
    reduced: boolean
    /** The UFO only spawns while the hero is on screen. */
    ufoActive: boolean
  }

  let { count, hub, labelOpacity, reduced, ufoActive }: Props = $props()

  const LINK_RANGE = 1.15 // world units; agents closer than this exchange data
  const UPLINK_RANGE = 0.8 // world units from the hub point
  const LOCK_BEFORE_STRIKE = 2.2 // seconds the UFO is tracked before it hits back

  const fleet = createFleet()
  const pairs = fleet.satellites.flatMap((_, i) => fleet.satellites.slice(i + 1).map((__, k) => [i, i + 1 + k] as const))

  let svg = $state<SVGSVGElement>()
  const satEls = $state<SVGGElement[]>([])
  // Satellites face their direction of travel: horizontal, falling diagonal, vertical, rising diagonal.
  const ORIENTATIONS = [['=#='], ['\\  ', ' # ', '  \\'], ['|', '#', '|'], ['  /', ' # ', '/  ']]
  const orientEls = $state<SVGGElement[][]>(fleet.satellites.map(() => []))
  const orientOf = fleet.satellites.map(() => -1)
  let cell = $state({ height: 13, width: 9 })
  const labelEls = $state<SVGTextElement[]>([])
  const beamEls = $state<SVGLineElement[]>([])
  const linkEls = $state<SVGLineElement[]>([])
  const packetEls = $state<SVGCircleElement[]>([])
  const headings = fleet.satellites.map(() => 0)
  const alphas = fleet.satellites.map(() => 0)
  const progressEls = $state<SVGCircleElement[]>([])
  const stateOf = fleet.satellites.map(() => 'ok')
  let assistEl = $state<SVGLineElement>()
  let strikeUntil = 0
  let strikeIndex = -1
  let helperIndex = -1

  const ufo = createUfo()
  let ufoEl = $state<SVGGElement>()
  // Cruise (dome, disc, blinking lights), then warp streaks to the right and to the left.
  const UFO = ['  .@.  ', '<=#8#=>', '       ']
  const UFO_LIGHTS = ['       ', '       ', ' o o o ']
  const UFO_WARP = [['---=#8#>'], ['<#8#=---']]
  const ufoModeEls = $state<SVGGElement[]>([])
  let ufoMode = 0
  let trackEl = $state<SVGLineElement>()
  let ufoPrev = { x: 0, y: 0 }

  const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
  }
  const labelText = fleet.satellites.map(() => '')

  const hide = (el?: SVGElement) => el?.setAttribute('opacity', '0')

  // Called from the globe's frame callback so every overlay point uses the same camera as the sphere.
  export function update(frame: GlobeFrame) {
    if (!svg) return
    const { width, height, radius, time } = frame
    if (cell.width !== frame.cell.width || cell.height !== frame.cell.height) cell = frame.cell
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    if (!reduced) stepFleet(fleet, frame.delta, time, count)

    const hubWorld = latLonPosition(hub[0], hub[1], radius)
    const hubScreen = frame.projectLatLon(hub[0], hub[1])
    const points = fleet.satellites.map((satellite, i) => {
      if (i >= count) return null
      const world = satellitePosition(satellite, radius)
      const screen = frame.project(world.x, world.y, world.z)
      // Fade over a band as the satellite slips behind the limb instead of popping at the silhouette:
      // `behind` ramps in as it crosses the center plane, `beside` keeps it visible while it is still clear of the disc.
      const behind = smoothstep(0, -0.35, screen.depth)
      const beside = smoothstep(0.9, 1.25, screen.planar)
      const target = 1 - behind * (1 - beside * 0.6)
      // Ease toward the target across frames so fast passes still read as a smooth fade.
      alphas[i] += (target - alphas[i]) * (reduced ? 1 : 1 - Math.exp(-frame.delta * 6))
      const alpha = alphas[i] < 0.01 ? 0 : alphas[i]
      const snapped = frame.snap(screen.x * width, screen.y * height)
      return { alpha, px: snapped.x, py: snapped.y, world }
    })

    const pose = reduced ? null : stepUfo(ufo, time, frame.delta, { height, project: frame.project, radius, width }, ufoActive)
    let tracker = -1
    if (!pose || !ufoEl) {
      hide(ufoEl)
      hide(trackEl)
    } else {
      const dx = pose.x - ufoPrev.x
      const dy = pose.y - ufoPrev.y
      if (Math.hypot(dx, dy) > 0.3) {
        const target = Math.atan2(dy, dx)
        ufo.heading += Math.atan2(Math.sin(target - ufo.heading), Math.cos(target - ufo.heading)) * 0.15
      }
      ufoPrev = { x: pose.x, y: pose.y }
      // The saucer cruises level in its cell; at warp it streaks out along its heading.
      const at = frame.snap(pose.x, pose.y)
      const mode = pose.stretch > 1.25 ? (Math.cos(ufo.heading) >= 0 ? 1 : 2) : 0
      if (mode !== ufoMode) {
        ufoModeEls.forEach((el, k) => el?.setAttribute('display', k === mode ? 'inline' : 'none'))
        ufoMode = mode
      }
      ufoEl.setAttribute('transform', `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`)
      ufoEl.setAttribute('opacity', pose.alpha.toFixed(2))

      // The nearest visible agent locks on (and stays locked) while the craft circles the globe;
      // after a short track the craft hits back once per visit and that agent starts to malfunction.
      if (ufo.state === 'orbit' && pose.alpha > 0.3 && !ufo.struck) {
        const current = ufo.lockIndex >= 0 ? points[ufo.lockIndex] : null
        if (!current || current.alpha < 0.2) {
          let best = Infinity
          ufo.lockIndex = -1
          points.forEach((point, i) => {
            if (!point || point.alpha < 0.3 || fleet.satellites[i].incident) return
            const d = Math.hypot(point.px - pose.x, point.py - pose.y)
            if (d < best) {
              best = d
              ufo.lockIndex = i
            }
          })
          ufo.lockSince = time
        }
        tracker = ufo.lockIndex
        if (tracker >= 0 && time - ufo.lockSince > LOCK_BEFORE_STRIKE) {
          startIncident(fleet.satellites[tracker], time)
          ufo.struck = true
          strikeIndex = tracker
          strikeUntil = time + 0.45
        }
      }
      const striking = time < strikeUntil
      const lockIndex = striking ? strikeIndex : tracker
      trackEl?.classList.toggle('strike', striking)
      const lock = lockIndex >= 0 ? points[lockIndex] : null
      if (lock && trackEl) {
        trackEl.setAttribute('x1', lock.px.toFixed(1))
        trackEl.setAttribute('y1', lock.py.toFixed(1))
        trackEl.setAttribute('x2', pose.x.toFixed(1))
        trackEl.setAttribute('y2', pose.y.toFixed(1))
        trackEl.setAttribute('opacity', (Math.min(lock.alpha, pose.alpha) * 0.9).toFixed(2))
      } else hide(trackEl)
    }

    const incidents = fleet.satellites.map((satellite) => incidentState(satellite, time))
    const repairing = incidents.findIndex((incident) => incident?.stage === 'debug' || incident?.stage === 'fix')
    // During debug/fix the closest healthy peer links in to help, and keeps helping until the fix is done
    // unless it slips out of view.
    const kept = helperIndex >= 0 ? points[helperIndex] : null
    if (repairing < 0 || !points[repairing]) helperIndex = -1
    else if (!kept || kept.alpha < 0.3 || incidents[helperIndex] || helperIndex === repairing) {
      let best = Infinity
      helperIndex = -1
      points.forEach((point, i) => {
        if (!point || i === repairing || point.alpha < 0.3 || incidents[i]) return
        const d = Math.hypot(
          point.world.x - points[repairing].world.x,
          point.world.y - points[repairing].world.y,
          point.world.z - points[repairing].world.z,
        )
        if (d < best) {
          best = d
          helperIndex = i
        }
      })
    }
    const assistant = helperIndex
    const helper = assistant >= 0 ? points[assistant] : null
    const patient = repairing >= 0 ? points[repairing] : null
    if (helper && patient && assistEl) {
      assistEl.setAttribute('x1', helper.px.toFixed(1))
      assistEl.setAttribute('y1', helper.py.toFixed(1))
      assistEl.setAttribute('x2', patient.px.toFixed(1))
      assistEl.setAttribute('y2', patient.py.toFixed(1))
      assistEl.setAttribute('opacity', (Math.min(helper.alpha, patient.alpha) * 0.85).toFixed(2))
    } else hide(assistEl)

    points.forEach((point, i) => {
      const group = satEls[i]
      if (!point || !group) return hide(group)
      const satellite = fleet.satellites[i]
      const incident = incidents[i]
      const state = incident?.stage ?? 'ok'
      if (state !== stateOf[i]) group.dataset.state = stateOf[i] = state
      // Glitching agents shake and flicker like a failing radio.
      const glitch = state === 'glitch'
      const jx = glitch && Math.random() < 0.3 ? Math.sign(Math.random() - 0.5) * cell.width : 0
      const jy = glitch && Math.random() < 0.3 ? Math.sign(Math.random() - 0.5) * cell.height : 0
      const flicker = glitch && Math.random() < 0.3 ? 0.25 : 1
      group.setAttribute('transform', `translate(${(point.px + jx).toFixed(1)} ${(point.py + jy).toFixed(1)})`)
      group.setAttribute('opacity', (point.alpha * flicker).toFixed(2))
      progressEls[i]?.setAttribute('stroke-dashoffset', state === 'fix' ? (100 - incident!.progress * 100).toFixed(1) : '100')

      // Point the solar panels along the screen-space direction of travel.
      const ahead = satellitePosition({ ...satellite, phase: satellite.phase + 0.05 }, radius)
      const next = frame.project(ahead.x, ahead.y, ahead.z)
      const target = Math.atan2(next.y * height - point.py, next.x * width - point.px)
      headings[i] += Math.atan2(Math.sin(target - headings[i]), Math.cos(target - headings[i])) * 0.2
      // Glitching agents tumble through every orientation.
      const orient = glitch ? Math.floor(time * 12) % 4 : ((Math.round(headings[i] / (Math.PI / 4)) % 4) + 4) % 4
      if (orient !== orientOf[i]) {
        orientEls[i].forEach((el, k) => el?.setAttribute('display', k === orient ? 'inline' : 'none'))
        orientOf[i] = orient
      }

      const faults = {
        debug: 'debugging…',
        fix: `applying fix ${Math.round((incident?.progress ?? 0) * 100)}%`,
        glitch: 'anomaly detected',
        recovered: 'recovered ✓',
      }
      const status = incident
        ? faults[incident.stage]
        : i === assistant
          ? `assisting ${fleet.satellites[repairing].name}`
          : i === tracker
            ? 'tracking UFO'
            : time < satellite.retaskUntil
              ? 'retasking'
              : satellite.role
      const text = `${satellite.name} · ${status}`
      if (labelEls[i] && text !== labelText[i]) labelEls[i].textContent = labelText[i] = text
      labelEls[i]?.setAttribute('opacity', labelOpacity.toFixed(2))

      // Uplink to the Bangkok hub while overhead.
      const beam = beamEls[i]
      const d = Math.hypot(point.world.x - hubWorld.x, point.world.y - hubWorld.y, point.world.z - hubWorld.z)
      if (beam && d < UPLINK_RANGE && point.alpha > 0 && !hubScreen.occluded) {
        beam.setAttribute('x1', point.px.toFixed(1))
        beam.setAttribute('y1', point.py.toFixed(1))
        beam.setAttribute('x2', (hubScreen.x * width).toFixed(1))
        beam.setAttribute('y2', (hubScreen.y * height).toFixed(1))
        beam.setAttribute('opacity', ((1 - d / UPLINK_RANGE) * point.alpha).toFixed(2))
      } else hide(beam)
    })

    // Agent-to-agent links with a data packet travelling along each active link.
    pairs.forEach(([a, b], k) => {
      const pa = points[a]
      const pb = points[b]
      const link = linkEls[k]
      const packet = packetEls[k]
      if (!pa || !pb || !pa.alpha || !pb.alpha || incidents[a]?.stage === 'glitch' || incidents[b]?.stage === 'glitch') {
        hide(link)
        hide(packet)
        return
      }
      const d = Math.hypot(pa.world.x - pb.world.x, pa.world.y - pb.world.y, pa.world.z - pb.world.z)
      if (d > LINK_RANGE) {
        hide(link)
        hide(packet)
        return
      }
      const strength = (1 - d / LINK_RANGE) * Math.min(pa.alpha, pb.alpha)
      link?.setAttribute('x1', pa.px.toFixed(1))
      link?.setAttribute('y1', pa.py.toFixed(1))
      link?.setAttribute('x2', pb.px.toFixed(1))
      link?.setAttribute('y2', pb.py.toFixed(1))
      link?.setAttribute('opacity', (strength * 0.8).toFixed(2))
      const t = (time * 0.45 + k * 0.37) % 1
      packet?.setAttribute('cx', (pa.px + (pb.px - pa.px) * t).toFixed(1))
      packet?.setAttribute('cy', (pa.py + (pb.py - pa.py) * t).toFixed(1))
      packet?.setAttribute('opacity', Math.min(1, strength * 1.6).toFixed(2))
    })
  }
</script>

<svg bind:this={svg} class="satellites absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
  {#each pairs as _, k (k)}
    <line bind:this={linkEls[k]} class="link" opacity="0"></line>
  {/each}
  {#each fleet.satellites as _, i (i)}
    <line bind:this={beamEls[i]} class="beam" opacity="0"></line>
  {/each}
  {#each pairs as _, k (k)}
    <circle bind:this={packetEls[k]} class="packet" r="1.8" opacity="0"></circle>
  {/each}
  <line bind:this={assistEl} class="assist" opacity="0"></line>
  <line bind:this={trackEl} class="track" opacity="0"></line>
  <g bind:this={ufoEl} class="ufo" opacity="0">
    <g bind:this={ufoModeEls[0]}>
      <AsciiSprite rows={UFO} {cell} />
      <g class="ufo-light"><AsciiSprite rows={UFO_LIGHTS} {cell} /></g>
    </g>
    {#each UFO_WARP as rows, k (k)}
      <g bind:this={ufoModeEls[k + 1]} display="none"><AsciiSprite {rows} {cell} /></g>
    {/each}
  </g>
  {#each fleet.satellites as satellite, i (satellite.name)}
    <!-- data-state is rewritten per frame; binding it here keeps Svelte from pruning the [data-state] styles. -->
    <g bind:this={satEls[i]} class="satellite" data-state={stateOf[i]} opacity="0">
      <circle class="ping" r="8"></circle>
      <circle bind:this={progressEls[i]} class="progress" r="11" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></circle>
      {#each ORIENTATIONS as rows, k (k)}
        <g bind:this={orientEls[i][k]} display={k === 0 ? 'inline' : 'none'}>
          <AsciiSprite {rows} {cell} />
        </g>
      {/each}
      <text bind:this={labelEls[i]} x={cell.width * 2} y={-cell.height * 1.2} class="label th-label"
        >{satellite.name} · {satellite.role}</text
      >
    </g>
  {/each}
</svg>

<style>
  .satellites {
    color: var(--text-color-link);
    --ascii-paper: #ffffff;
  }

  :global(.dark) .satellites {
    --ascii-paper: #020817;
  }

  .satellite {
    --ascii-ink: currentColor;
  }

  .link {
    stroke: currentColor;
    stroke-width: 1;
    stroke-dasharray: 2 5;
  }

  .beam {
    stroke: currentColor;
    stroke-width: 1.25;
    stroke-dasharray: 1 4;
  }

  .packet {
    fill: currentColor;
  }

  .ping {
    fill: none;
    stroke: currentColor;
    stroke-width: 1;
    opacity: 0;
  }

  .label {
    fill: rgb(55 65 81);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.04em;
  }

  :global(.dark) .label {
    fill: rgb(209 213 219);
  }

  .track {
    stroke: rgb(52 211 153);
    stroke-width: 1;
    stroke-dasharray: 3 3;
  }

  .track:global(.strike) {
    stroke: rgb(248 113 113);
    stroke-width: 2;
    stroke-dasharray: none;
  }

  .assist {
    stroke: rgb(251 191 36);
    stroke-width: 1;
    stroke-dasharray: 2 3;
  }

  .progress {
    fill: none;
    stroke: rgb(52 211 153);
    stroke-width: 1.5;
    transform: rotate(-90deg);
  }

  /* The ASCII sprite and the ping follow currentColor, so each state recolors both. */
  .satellite[data-state='glitch'] {
    color: rgb(248 113 113);
  }

  .satellite[data-state='debug'] {
    color: rgb(251 191 36);
  }

  .satellite[data-state='fix'],
  .satellite[data-state='recovered'] {
    color: rgb(52 211 153);
  }

  .satellite[data-state='glitch'] .label {
    fill: rgb(248 113 113);
  }

  .satellite[data-state='debug'] .label {
    fill: rgb(217 119 6);
  }

  :global(.dark) .satellite[data-state='debug'] .label {
    fill: rgb(251 191 36);
  }

  .satellite[data-state='fix'] .label,
  .satellite[data-state='recovered'] .label {
    fill: rgb(5 150 105);
  }

  :global(.dark) .satellite[data-state='fix'] .label,
  :global(.dark) .satellite[data-state='recovered'] .label {
    fill: rgb(52 211 153);
  }

  .ufo {
    --ascii-ink: rgb(45 212 191);
    filter: drop-shadow(0 0 6px rgb(94 234 212 / 0.55));
  }

  .ufo-light {
    --ascii-ink: rgb(110 231 183);
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    .ufo-light {
      animation: blink 0.75s steps(2, jump-none) infinite;
    }

    .track,
    .assist {
      animation: flow 0.8s linear infinite;
    }

    .satellite[data-state='debug'] .ping {
      animation-duration: 0.9s;
    }

    .ping {
      animation: ping 2.8s ease-out infinite;
      transform-origin: center;
      transform-box: fill-box;
    }

    .beam,
    .link {
      animation: flow 1.2s linear infinite;
    }
  }

  @keyframes ping {
    0% {
      opacity: 0.55;
      transform: scale(0.4);
    }
    100% {
      opacity: 0;
      transform: scale(1.6);
    }
  }

  @keyframes blink {
    50% {
      opacity: 0.2;
    }
  }

  @keyframes flow {
    to {
      stroke-dashoffset: -14;
    }
  }
</style>
