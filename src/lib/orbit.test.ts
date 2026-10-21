import { describe, expect, test } from 'bun:test'

import { createFleet, incidentState, latLonPosition, satellitePosition, startIncident, stepFleet, ALTITUDE_RANGE } from './orbit'

describe('latLonPosition', () => {
  test('puts the equator at lon 0 on the +z axis', () => {
    const p = latLonPosition(0, 0, 2)
    expect(p.x).toBeCloseTo(0)
    expect(p.y).toBeCloseTo(0)
    expect(p.z).toBeCloseTo(2)
  })

  test('puts the north pole on the +y axis', () => {
    const p = latLonPosition(90, 0, 1)
    expect(p.y).toBeCloseTo(1)
    expect(p.z).toBeCloseTo(0)
  })
})

describe('satellitePosition', () => {
  test('keeps the satellite at radius × altitude from the center', () => {
    const [satellite] = createFleet().satellites
    const p = satellitePosition(satellite, 3)
    expect(Math.hypot(p.x, p.y, p.z)).toBeCloseTo(3 * satellite.altitude)
  })
})

describe('createFleet', () => {
  test('starts every agent inside the altitude range without an incident', () => {
    for (const satellite of createFleet().satellites) {
      expect(satellite.altitude).toBeGreaterThanOrEqual(ALTITUDE_RANGE[0])
      expect(satellite.altitude).toBeLessThanOrEqual(ALTITUDE_RANGE[1])
      expect(satellite.incident).toBeNull()
    }
  })

  test('is deterministic across visits', () => {
    const a = createFleet()
    const b = createFleet()
    stepFleet(a, 0.016, 10, 6)
    stepFleet(b, 0.016, 10, 6)
    expect(a).toEqual(b)
  })
})

describe('incident timeline', () => {
  test('runs glitch → debug → fix → recovered, then clears', () => {
    const satellite = createFleet().satellites[0]
    const { altitudeTarget, speedTarget } = satellite
    startIncident(satellite, 100)

    expect(satellite.speedTarget).toBeLessThan(speedTarget)
    expect(incidentState(satellite, 100)?.stage).toBe('glitch')

    const incident = satellite.incident!
    expect(incidentState(satellite, incident.glitchEnd + 0.01)?.stage).toBe('debug')
    expect(incidentState(satellite, incident.debugEnd + 0.01)?.stage).toBe('fix')
    expect(incidentState(satellite, incident.fixEnd + 0.01)?.stage).toBe('recovered')

    // The fix restores the orbit the satellite had before the fault.
    expect(satellite.altitudeTarget).toBeCloseTo(altitudeTarget)
    expect(satellite.speedTarget).toBeCloseTo(speedTarget)

    expect(incidentState(satellite, incident.end)).toBeNull()
    expect(satellite.incident).toBeNull()
  })

  test('reports no state for a healthy satellite', () => {
    expect(incidentState(createFleet().satellites[0], 5)).toBeNull()
  })
})
