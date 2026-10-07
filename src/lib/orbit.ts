// Simulation for the hero's orbital layer: a far sun/moon and a small fleet of "AI agent" satellites.
// The agents are simple autonomous rules (retask altitude/speed, talk to close neighbours, uplink to
// the Bangkok hub), not a real model — enough to read as a self-organising multi-agent system.

export interface SkyState {
  /** Sun/moon center in CSS pixels. */
  x: number
  y: number
  /** Ray direction in pixel space (x right, y up), pointing at the globe. */
  dirX: number
  dirY: number
  width: number
  height: number
  /** False until the first globe frame has placed the bodies. */
  ready: boolean
}

export interface Satellite {
  name: string
  role: string
  inclination: number
  node: number
  altitude: number
  altitudeTarget: number
  speed: number
  speedTarget: number
  phase: number
  /** Time until which the satellite reports that it is retasking. */
  retaskUntil: number
  /** Active malfunction after UFO interference, or null. */
  incident: Incident | null
}

export type IncidentStage = 'glitch' | 'debug' | 'fix' | 'recovered'

export interface Incident {
  startedAt: number
  glitchEnd: number
  debugEnd: number
  fixEnd: number
  end: number
  /** Orbit targets before the fault, restored when the fix starts. */
  saved: { altitude: number; speed: number }
  restored: boolean
}

// Timeline of a fault: glitch → debug → fix → recovered. Debug + fix together take 5–10 s.
const INCIDENT_GLITCH = 1.6
const INCIDENT_RECOVERED = 1.2

export function startIncident(satellite: Satellite, time: number) {
  const work = 5 + Math.random() * 5
  const debug = work * (0.45 + Math.random() * 0.15)
  const glitchEnd = time + INCIDENT_GLITCH
  satellite.incident = {
    debugEnd: glitchEnd + debug,
    end: glitchEnd + work + INCIDENT_RECOVERED,
    fixEnd: glitchEnd + work,
    glitchEnd,
    restored: false,
    saved: { altitude: satellite.altitudeTarget, speed: satellite.speedTarget },
    startedAt: time,
  }
  // The hit knocks the agent into a lower, slower orbit until it patches itself.
  satellite.altitudeTarget = Math.max(1.02, satellite.altitudeTarget - 0.1)
  satellite.speedTarget *= 0.45
}

/** Current fault stage and its 0–1 progress, clearing the incident once it is over. */
export function incidentState(satellite: Satellite, time: number): { stage: IncidentStage; progress: number } | null {
  const incident = satellite.incident
  if (!incident) return null
  if (time >= incident.end) {
    satellite.incident = null
    return null
  }
  if (time >= incident.debugEnd && !incident.restored) {
    satellite.altitudeTarget = incident.saved.altitude
    satellite.speedTarget = incident.saved.speed
    incident.restored = true
  }
  const stages: [IncidentStage, number, number][] = [
    ['glitch', incident.startedAt, incident.glitchEnd],
    ['debug', incident.glitchEnd, incident.debugEnd],
    ['fix', incident.debugEnd, incident.fixEnd],
    ['recovered', incident.fixEnd, incident.end],
  ]
  const [stage, from, to] = stages.find(([, , end]) => time < end) ?? stages[3]
  return { progress: Math.min(1, Math.max(0, (time - from) / (to - from))), stage }
}

export interface Fleet {
  satellites: Satellite[]
  nextRetask: number
  seed: number
}

const ROLES = ['planner', 'retriever', 'coder', 'reviewer', 'deployer', 'monitor']
const INCLINATIONS = [0.35, -0.6, 0.95, -0.25, 0.6, -0.9]

// Low orbits keep the fleet hugging the globe instead of drifting over the hero copy.
export const ALTITUDE_RANGE: [number, number] = [1.08, 1.3]

export function createFleet(): Fleet {
  return {
    nextRetask: 4,
    satellites: ROLES.map((role, i) => {
      const altitude = ALTITUDE_RANGE[0] + ((i * 0.37) % 1) * (ALTITUDE_RANGE[1] - ALTITUDE_RANGE[0])
      const speed = 0.22 + i * 0.03
      return {
        altitude,
        altitudeTarget: altitude,
        inclination: INCLINATIONS[i],
        name: `agent-0${i + 1}`,
        node: i * 1.05,
        phase: i * 1.7,
        incident: null,
        retaskUntil: 0,
        role,
        speed,
        speedTarget: speed,
      }
    }),
    seed: 7,
  }
}

// Small deterministic PRNG so the fleet behaves the same on every visit.
const random = (fleet: Fleet) => {
  fleet.seed = (fleet.seed * 16807) % 2147483647
  return fleet.seed / 2147483647
}

export function stepFleet(fleet: Fleet, delta: number, time: number, count: number) {
  const ease = Math.min(1, delta * 0.8)
  for (const satellite of fleet.satellites.slice(0, count)) {
    satellite.altitude += (satellite.altitudeTarget - satellite.altitude) * ease
    satellite.speed += (satellite.speedTarget - satellite.speed) * ease
    satellite.phase += satellite.speed * delta
  }
  if (time < fleet.nextRetask) return
  // Every few seconds one agent re-plans its own orbit.
  const satellite = fleet.satellites[Math.floor(random(fleet) * count)]
  // An agent that is repairing itself keeps its recovery orbit; try again shortly.
  if (satellite.incident) {
    fleet.nextRetask = time + 1
    return
  }
  satellite.altitudeTarget = ALTITUDE_RANGE[0] + random(fleet) * (ALTITUDE_RANGE[1] - ALTITUDE_RANGE[0])
  satellite.speedTarget = 0.18 + random(fleet) * 0.26
  satellite.retaskUntil = time + 2.6
  fleet.nextRetask = time + 4.5 + random(fleet) * 3
}

/** World-space position; `radius` is the globe radius in the same units as GlobeFrame.project. */
export function satellitePosition(satellite: Satellite, radius: number) {
  const r = radius * satellite.altitude
  const x0 = Math.cos(satellite.phase) * r
  const z0 = Math.sin(satellite.phase) * r
  // Tilt the orbital plane (inclination), then spin it around the polar axis (ascending node).
  const y1 = -z0 * Math.sin(satellite.inclination)
  const z1 = z0 * Math.cos(satellite.inclination)
  return {
    x: x0 * Math.cos(satellite.node) + z1 * Math.sin(satellite.node),
    y: y1,
    z: -x0 * Math.sin(satellite.node) + z1 * Math.cos(satellite.node),
  }
}

/** Same convention as the globe's lon/lat → cartesian mapping. */
export function latLonPosition(lat: number, lon: number, radius: number) {
  const latRad = (lat * Math.PI) / 180
  const lonRad = (lon * Math.PI) / 180
  return {
    x: radius * Math.cos(latRad) * Math.sin(lonRad),
    y: radius * Math.sin(latRad),
    z: radius * Math.cos(latRad) * Math.cos(lonRad),
  }
}

// ── UFO easter egg: an unidentified craft drops in about every 90 s, circles the globe, then warps out. ──

export type UfoState = 'idle' | 'enter' | 'orbit' | 'exit'

export interface Ufo {
  state: UfoState
  startedAt: number
  nextAt: number
  /** Off-screen entry and exit points in normalized viewport space. */
  from: { x: number; y: number }
  to: { x: number; y: number }
  /** Screen position where the orbit ended, used as the start of the warp exit. */
  exitFrom: { x: number; y: number }
  inclination: number
  node: number
  phase0: number
  alpha: number
  heading: number
  /** Satellite index the craft is locked onto (sticky for the visit), or -1. */
  lockIndex: number
  lockSince: number
  /** True once this visit has already knocked out an agent. */
  struck: boolean
}

export interface UfoPose {
  /** CSS pixels. */
  x: number
  y: number
  alpha: number
  /** Degrees. */
  angle: number
  /** Motion stretch along the heading (1 = none). */
  stretch: number
}

export const UFO_TIMING = { enter: 2.4, exit: 1.1, orbit: 7 }
export const UFO_FIRST_AT = 20
export const UFO_INTERVAL = 90
const UFO_JITTER = 30
const UFO_ALTITUDE = 1.42
const UFO_ORBIT_SPEED = 1.25

export function createUfo(): Ufo {
  return {
    alpha: 0,
    exitFrom: { x: 0, y: 0 },
    from: { x: 0, y: 0 },
    heading: 0,
    inclination: 0,
    lockIndex: -1,
    lockSince: 0,
    nextAt: UFO_FIRST_AT + Math.random() * 5,
    node: 0,
    phase0: 0,
    startedAt: 0,
    state: 'idle',
    struck: false,
    to: { x: 0, y: 0 },
  }
}

const edgePoint = (side: number) => {
  const along = 0.15 + Math.random() * 0.7
  if (side === 0) return { x: -0.08, y: along } // left
  if (side === 1) return { x: 1.08, y: along } // right
  return { x: along, y: -0.1 } // top
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const smooth = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export interface UfoView {
  height: number
  project: (x: number, y: number, z: number) => { depth: number; planar: number; x: number; y: number }
  radius: number
  width: number
}

type OrbitPoint = (elapsed: number) => { depth: number; planar: number; x: number; y: number }

const makeOrbitPoint =
  (ufo: Ufo, view: UfoView): OrbitPoint =>
  (elapsed) => {
    const phase = ufo.phase0 + elapsed * UFO_ORBIT_SPEED
    const r = view.radius * UFO_ALTITUDE
    const x0 = Math.cos(phase) * r
    const z0 = Math.sin(phase) * r
    const y1 = -z0 * Math.sin(ufo.inclination)
    const z1 = z0 * Math.cos(ufo.inclination)
    return view.project(x0 * Math.cos(ufo.node) + z1 * Math.sin(ufo.node), y1, -x0 * Math.sin(ufo.node) + z1 * Math.cos(ufo.node))
  }

/** Pick a fresh flight path for the next visit. */
function beginUfoVisit(ufo: Ufo, time: number, orbitPoint: OrbitPoint) {
  const side = Math.floor(Math.random() * 3)
  ufo.from = edgePoint(side)
  ufo.to = edgePoint((side + 1 + Math.floor(Math.random() * 2)) % 3)
  ufo.inclination = (Math.random() - 0.5) * 1.6
  ufo.node = Math.random() * Math.PI * 2
  // Start the orbit on the visible side so the approach ends in front of the globe.
  ufo.phase0 = 0
  for (let k = 0; k < 12; k++) {
    ufo.phase0 = (k / 12) * Math.PI * 2
    if (orbitPoint(0).depth > 0.3) break
  }
  ufo.state = 'enter'
  ufo.startedAt = time
  ufo.lockIndex = -1
  ufo.struck = false
}

interface UfoFrame {
  px: number
  py: number
  stretch: number
  target: number
}

function stepUfoEnter(ufo: Ufo, time: number, elapsed: number, orbitPoint: OrbitPoint): UfoFrame {
  const k = easeInOut(Math.min(1, elapsed / UFO_TIMING.enter))
  const start = orbitPoint(0)
  if (elapsed >= UFO_TIMING.enter) {
    ufo.state = 'orbit'
    ufo.startedAt = time
  }
  return { px: ufo.from.x + (start.x - ufo.from.x) * k, py: ufo.from.y + (start.y - ufo.from.y) * k, stretch: 1, target: 1 }
}

function stepUfoOrbit(ufo: Ufo, time: number, elapsed: number, orbitPoint: OrbitPoint): UfoFrame {
  const point = orbitPoint(elapsed)
  // Same limb fade as the satellites.
  const behind = smooth(0, -0.35, point.depth)
  const beside = smooth(0.9, 1.25, point.planar)
  if (elapsed >= UFO_TIMING.orbit) {
    ufo.state = 'exit'
    ufo.startedAt = time
    ufo.exitFrom = { x: point.x, y: point.y }
  }
  return { px: point.x, py: point.y, stretch: 1, target: 1 - behind * (1 - beside * 0.6) }
}

function stepUfoExit(ufo: Ufo, time: number, elapsed: number): UfoFrame {
  const k = Math.min(1, elapsed / UFO_TIMING.exit)
  const warp = k * k * k
  if (elapsed >= UFO_TIMING.exit) {
    ufo.state = 'idle'
    ufo.alpha = 0
    ufo.nextAt = time + UFO_INTERVAL + (Math.random() - 0.5) * UFO_JITTER
  }
  return {
    px: ufo.exitFrom.x + (ufo.to.x - ufo.exitFrom.x) * warp,
    py: ufo.exitFrom.y + (ufo.to.y - ufo.exitFrom.y) * warp,
    stretch: 1 + warp * 3,
    target: 1,
  }
}

/**
 * Advance the UFO and return where to draw it, or null while idle.
 * `view.project` is the globe camera projection; `active` pauses spawning while the hero is scrolled away.
 */
export function stepUfo(ufo: Ufo, time: number, delta: number, view: UfoView, active: boolean): UfoPose | null {
  const orbitPoint = makeOrbitPoint(ufo, view)

  if (ufo.state === 'idle') {
    if (time < ufo.nextAt || !active) return null
    beginUfoVisit(ufo, time, orbitPoint)
  }

  const elapsed = time - ufo.startedAt
  const frame =
    ufo.state === 'enter'
      ? stepUfoEnter(ufo, time, elapsed, orbitPoint)
      : ufo.state === 'orbit'
        ? stepUfoOrbit(ufo, time, elapsed, orbitPoint)
        : stepUfoExit(ufo, time, elapsed)
  if (ufo.state === 'idle') return null

  ufo.alpha += (frame.target - ufo.alpha) * (1 - Math.exp(-delta * 6))
  return { alpha: ufo.alpha, angle: 0, stretch: frame.stretch, x: frame.px * view.width, y: frame.py * view.height }
}
