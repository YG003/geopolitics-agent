import { useEffect, useRef } from 'react'

function GlobeBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const cities = [
      { lat: 51.5, lon: -0.1, name: 'London' },
      { lat: 40.7, lon: -74, name: 'New York' },
      { lat: 48.9, lon: 2.35, name: 'Paris' },
      { lat: 55.75, lon: 37.6, name: 'Moscow' },
      { lat: 39.9, lon: 116.4, name: 'Beijing' },
      { lat: 35.7, lon: 139.7, name: 'Tokyo' },
      { lat: 28.6, lon: 77.2, name: 'Delhi' },
      { lat: -33.9, lon: 18.4, name: 'Cape Town' },
      { lat: -23.5, lon: -46.6, name: 'São Paulo' },
      { lat: 30, lon: 31.2, name: 'Cairo' },
      { lat: 1.3, lon: 103.8, name: 'Singapore' },
      { lat: 37.6, lon: 127, name: 'Seoul' },
      { lat: 41, lon: 29, name: 'Istanbul' },
      { lat: 19.4, lon: -99.1, name: 'Mexico City' },
      { lat: -34.6, lon: -58.4, name: 'Buenos Aires' },
      { lat: 35.7, lon: 51.4, name: 'Tehran' },
      { lat: 33.3, lon: 44.4, name: 'Baghdad' },
      { lat: 50.4, lon: 30.5, name: 'Kyiv' },
      { lat: 59.9, lon: 30.3, name: 'St Petersburg' },
      { lat: 25.3, lon: 55.3, name: 'Dubai' },
      { lat: 52.5, lon: 13.4, name: 'Berlin' },
      { lat: -1.3, lon: 36.8, name: 'Nairobi' },
      { lat: 6.5, lon: 3.4, name: 'Lagos' },
      { lat: -33.8, lon: 151.2, name: 'Sydney' },
    ]

    const points = [...cities]
    for (let i = 0; i < 60; i++) {
      points.push({
        lat: (Math.random() - 0.5) * 160,
        lon: (Math.random() - 0.5) * 360,
        name: null,
      })
    }

    const connections = []
    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        const dist = Math.sqrt(
          Math.pow(cities[i].lat - cities[j].lat, 2) +
          Math.pow(cities[i].lon - cities[j].lon, 2)
        )
        if (dist < 80) connections.push([i, j])
      }
    }

    const toRad = (deg) => (deg * Math.PI) / 180

    const project = (lat, lon, rotation) => {
      const phi = toRad(90 - lat)
      const theta = toRad(lon + rotation)
      const radius = Math.min(canvas.width, canvas.height) * 0.45

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)

      const visible = z > -radius * 0.1

      return {
        x: canvas.width * 0.5 + x,
        y: canvas.height * 0.5 - y,
        z,
        visible,
        depth: (z + radius) / (2 * radius),
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.15
      const rotation = time

      const centerX = canvas.width * 0.5
      const centerY = canvas.height * 0.5
      const radius = Math.min(canvas.width, canvas.height) * 0.45

      // Globe outline
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath()
        let started = false
        for (let lon = -180; lon <= 180; lon += 3) {
          const p = project(lat, lon, rotation)
          if (p.visible) {
            if (!started) { ctx.moveTo(p.x, p.y); started = true }
            else ctx.lineTo(p.x, p.y)
          } else started = false
        }
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.04)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Longitude lines
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath()
        let started = false
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = project(lat, lon, rotation)
          if (p.visible) {
            if (!started) { ctx.moveTo(p.x, p.y); started = true }
            else ctx.lineTo(p.x, p.y)
          } else started = false
        }
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.04)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Project all points
      const projected = points.map((p) => project(p.lat, p.lon, rotation))

      // Draw connections
      connections.forEach(([i, j]) => {
        const a = projected[i]
        const b = projected[j]
        if (a.visible && b.visible) {
          const alpha = Math.min(a.depth, b.depth) * 0.25
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(220, 38, 38, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()

          // Pulse along connection
          const pulse = (Math.sin(time * 0.05 + i + j) + 1) / 2
          const px = a.x + (b.x - a.x) * pulse
          const py = a.y + (b.y - a.y) * pulse
          ctx.beginPath()
          ctx.arc(px, py, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(248, 113, 113, ${alpha * 1.5})`
          ctx.fill()
        }
      })

      // Draw points and city labels
      projected.forEach((p, i) => {
        if (!p.visible) return
        const isCity = i < cities.length
        const size = isCity ? 2.5 : 1
        const alpha = p.depth * (isCity ? 0.7 : 0.3)

        // Point
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(248, 113, 113, ${alpha})`
        ctx.fill()

        // City glow and label
        if (isCity) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(220, 38, 38, ${alpha * 0.12})`
          ctx.fill()

          // Flicker effect
          const flicker = Math.sin(time * 0.08 + i * 2.7) * 0.5 + 0.5
          const labelAlpha = p.depth * 0.6 * flicker

          if (labelAlpha > 0.15) {
            const labelOffsetX = 12
            const labelOffsetY = -8
            ctx.beginPath()
            ctx.moveTo(p.x + 3, p.y - 3)
            ctx.lineTo(p.x + labelOffsetX, p.y + labelOffsetY)
            ctx.strokeStyle = `rgba(248, 113, 113, ${labelAlpha * 0.5})`
            ctx.lineWidth = 0.5
            ctx.stroke()

            ctx.font = '9px monospace'
            ctx.fillStyle = `rgba(248, 113, 113, ${labelAlpha})`
            ctx.fillText(cities[i].name.toUpperCase(), p.x + labelOffsetX + 2, p.y + labelOffsetY + 3)
          }
        }
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  )
}

export default GlobeBackground