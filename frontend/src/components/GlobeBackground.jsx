import { useEffect, useRef, useCallback } from 'react'
import createGlobe from 'cobe'

const MARKERS = [
  { id: 'london',     location: [51.5,   -0.1],  label: 'London' },
  { id: 'newyork',   location: [40.7,  -74.0],  label: 'New York' },
  { id: 'moscow',    location: [55.75,  37.6],  label: 'Moscow' },
  { id: 'beijing',   location: [39.9,  116.4],  label: 'Beijing' },
  { id: 'kyiv',      location: [50.4,   30.5],  label: 'Kyiv' },
  { id: 'tehran',    location: [35.7,   51.4],  label: 'Tehran' },
  { id: 'dubai',     location: [25.3,   55.3],  label: 'Dubai' },
  { id: 'singapore', location: [1.3,   103.8],  label: 'Singapore' },
  { id: 'washington',location: [38.9,  -77.0],  label: 'Washington' },
]

const ARCS = [
  { id: 'lon-mos',   from: [51.5,  -0.1],  to: [55.75, 37.6] },
  { id: 'lon-nyc',   from: [51.5,  -0.1],  to: [40.7, -74.0] },
  { id: 'nyc-was',   from: [40.7, -74.0],  to: [38.9, -77.0] },
  { id: 'mos-bei',   from: [55.75, 37.6],  to: [39.9, 116.4] },
  { id: 'mos-kyi',   from: [55.75, 37.6],  to: [50.4,  30.5] },
  { id: 'teh-dub',   from: [35.7,  51.4],  to: [25.3,  55.3] },
  { id: 'bei-sin',   from: [39.9, 116.4],  to: [1.3,  103.8] },
  { id: 'lon-teh',   from: [51.5,  -0.1],  to: [35.7,  51.4] },
]

function projectMarker(lat, lon, phi, theta, canvasSize) {
  const latR = lat * Math.PI / 180
  const lonR = lon * Math.PI / 180

  const x = Math.cos(latR) * Math.cos(lonR)
  const y = Math.sin(latR)
  const z = -Math.cos(latR) * Math.sin(lonR)

  const cosPhi   = Math.cos(phi)
  const sinPhi   = Math.sin(phi)
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  const c     = cosPhi * x + sinPhi * z
  const s     = sinPhi * sinTheta * x + cosTheta * y - cosPhi * sinTheta * z
  const depth = -sinPhi * cosTheta * x + sinTheta * y + cosPhi * cosTheta * z

  return {
    x: canvasSize * (c + 1) / 2,
    y: canvasSize * (-s + 1) / 2,
    visible: depth >= 0,
    depth,
  }
}

function GlobeBackground() {
  const canvasRef = useRef(null)
  const labelEls  = useRef({})

  const pointerInteracting = useRef(null)
  const lastPointer        = useRef(null)
  const dragOffset         = useRef({ phi: 0, theta: 0 })
  const velocity           = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef       = useRef(0)
  const thetaOffsetRef     = useRef(0)
  const isPausedRef        = useRef(false)

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
    isPausedRef.current = true
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (pointerInteracting.current !== null) {
      const deltaX = e.clientX - pointerInteracting.current.x
      const deltaY = e.clientY - pointerInteracting.current.y
      dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 }
      const now = Date.now()
      if (lastPointer.current) {
        const dt  = Math.max(now - lastPointer.current.t, 1)
        const max = 0.15
        velocity.current = {
          phi:   Math.max(-max, Math.min(max, ((e.clientX - lastPointer.current.x) / dt) * 0.3)),
          theta: Math.max(-max, Math.min(max, ((e.clientY - lastPointer.current.y) / dt) * 0.08)),
        }
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current   += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
      lastPointer.current = null
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerup',   handlePointerUp,   { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup',   handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe = null
    let animationId
    let phi = 0
    const THETA = 0.2

    function updateLabels(currentPhi, currentTheta) {
      const size = canvas.offsetWidth
      MARKERS.forEach((m) => {
        const el = labelEls.current[m.id]
        if (!el) return
        const p = projectMarker(m.location[0], m.location[1], currentPhi, currentTheta, size)
        if (p.visible && p.depth > 0.05) {
          const opacity = Math.min(1, (p.depth - 0.05) / 0.3)
          el.style.left    = p.x + 'px'
          el.style.top     = p.y + 'px'
          el.style.opacity = opacity
        } else {
          el.style.opacity = '0'
        }
      })
    }

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width,
        height: width,
        phi:   0,
        theta: THETA,
        dark:  1,
        diffuse: 1.2,
        mapSamples:    16000,
        mapBrightness: 6,
        baseColor:   [0.42, 0.30, 0.12],
        markerColor: [0.88, 0.62, 0.22],
        glowColor:   [0.48, 0.34, 0.10],
        arcColor:    [0.88, 0.62, 0.22],
        markerElevation: 0.01,
        arcWidth:  0.55,
        arcHeight: 0.25,
        markers: MARKERS.map((m) => ({ location: m.location, size: 0.022, id: m.id })),
        arcs:    ARCS.map((a)    => ({ from: a.from, to: a.to, id: a.id })),
        opacity: 0.9,
      })

      function animate() {
        if (!isPausedRef.current) {
          phi += 0.003
          if (Math.abs(velocity.current.phi)   > 0.0001 ||
              Math.abs(velocity.current.theta) > 0.0001) {
            phiOffsetRef.current   += velocity.current.phi
            thetaOffsetRef.current += velocity.current.theta
            velocity.current.phi   *= 0.95
            velocity.current.theta *= 0.95
          }
          const tMin = -0.4, tMax = 0.4
          if      (thetaOffsetRef.current < tMin) thetaOffsetRef.current += (tMin - thetaOffsetRef.current) * 0.1
          else if (thetaOffsetRef.current > tMax) thetaOffsetRef.current += (tMax - thetaOffsetRef.current) * 0.1
        }

        const currentPhi   = phi + phiOffsetRef.current + dragOffset.current.phi
        const currentTheta = THETA + thetaOffsetRef.current + dragOffset.current.theta

        globe.update({ phi: currentPhi, theta: currentTheta })
        updateLabels(currentPhi, currentTheta)

        animationId = requestAnimationFrame(animate)
      }

      animate()
      setTimeout(() => canvas && (canvas.style.opacity = '1'))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) { ro.disconnect(); init() }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      <div
        style={{ width: '90vmin', height: '90vmin', position: 'relative', pointerEvents: 'auto' }}
        className="select-none"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            cursor: 'grab',
            opacity: 0,
            transition: 'opacity 1.2s ease',
            borderRadius: '50%',
            touchAction: 'none',
          }}
        />
        {MARKERS.map((m) => (
          <div
            key={m.id}
            ref={(el) => { labelEls.current[m.id] = el }}
            style={{
              position: 'absolute',
              transform: 'translate(8px, -50%)',
              pointerEvents: 'none',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '9px',
              color: 'rgba(200, 144, 58, 0.75)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
          >
            {m.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GlobeBackground
