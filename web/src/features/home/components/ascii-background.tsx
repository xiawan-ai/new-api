/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useEffect, useRef } from 'react'

import { resolveThemeColor } from '@/lib/theme-color'

/**
 * ASCII wave field behind the hero, ported from the Finch website.
 *
 * - Faint brand-colored characters drift slowly; a rare accent character
 *   lands on the crests.
 * - Moving the pointer drops ripples along its path that spread and fade.
 * - `prefers-reduced-motion` renders one static frame and disables ripples.
 * - Stops drawing while off screen or while the tab is hidden.
 * - Decoration only: `aria-hidden`, and `.finch-ascii-layer` makes it ignore
 *   pointer events and thins it out behind the headline.
 */

const RAMP = [' ', ' ', '·', '·', ':', '+', '*']
const CELL = 18
const FONT =
  "12px ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
// Soft on the eyes and on the battery.
const FRAME_INTERVAL = 1000 / 16

const RIPPLE_LIFE = 1.8 // seconds a ripple lives
const RIPPLE_SPEED = 150 // px/s the ring travels outward
const RIPPLE_WAVELENGTH = 70 // px between ring crests
const RIPPLE_BAND = 110 // px of ring thickness that affects characters
const RIPPLE_STRENGTH = 2.0
const SPAWN_DISTANCE = 32 // px of pointer travel per new ripple
const MAX_DROPS = 24

// Used if the theme tokens cannot be read.
const FALLBACK_BRAND = 'rgb(63, 107, 86)'
const FALLBACK_ACCENT = 'rgb(224, 138, 77)'

interface Drop {
  x: number
  y: number
  born: number // seconds
}

interface ActiveRipple {
  x: number
  y: number
  ring: number
  energy: number
}

function field(col: number, row: number, t: number): number {
  return (
    Math.sin(col * 0.18 + t * 0.42) * Math.cos(row * 0.14 - t * 0.3) +
    Math.sin((col + row) * 0.11 + t * 0.18) * 0.8
  )
}

/** How much the ripples push the wave field at one cell, plus a brightness lift near a ring. */
function rippleAt(
  ripples: ActiveRipple[],
  x: number,
  y: number
): { push: number; boost: number } {
  let push = 0
  let boost = 0
  for (const ripple of ripples) {
    const dist = Math.hypot(x - ripple.x, y - ripple.y)
    const band = Math.abs(dist - ripple.ring)
    if (band >= RIPPLE_BAND) continue
    const envelope = (1 - band / RIPPLE_BAND) ** 2 * ripple.energy
    const wave = Math.cos(
      ((dist - ripple.ring) / RIPPLE_WAVELENGTH) * Math.PI * 2
    )
    push += wave * envelope * RIPPLE_STRENGTH
    boost += envelope * 0.07
  }
  return { push, boost }
}

export function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let raf = 0
    let last = 0
    let inViewport = true
    const brandColor = resolveThemeColor('--brand') ?? FALLBACK_BRAND
    const accentColor = resolveThemeColor('--brand-accent') ?? FALLBACK_ACCENT

    let drops: Drop[] = []
    let lastSpawnX = Number.NaN
    let lastSpawnY = Number.NaN

    const draw = (now: number) => {
      const t = now / 1000
      ctx.clearRect(0, 0, width, height)
      const cols = Math.ceil(width / CELL)
      const rows = Math.ceil(height / CELL)
      drops = drops.filter((drop) => t - drop.born < RIPPLE_LIFE)
      const ripples = drops.map((drop) => {
        const age = t - drop.born
        const decay = 1 - age / RIPPLE_LIFE
        return {
          x: drop.x,
          y: drop.y,
          ring: age * RIPPLE_SPEED,
          energy: decay * decay,
        }
      })
      for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
          const x = col * CELL + CELL / 2
          const y = row * CELL + CELL / 2
          const ripple = rippleAt(ripples, x, y)
          const value = field(col, row, t) + ripple.push
          const n = Math.min(1, Math.max(0, (value + 1.8) / 3.6))
          const ch = RAMP[Math.floor(n * (RAMP.length - 1))]
          if (ch === ' ') continue
          const alpha = 0.05 + n * 0.12 + ripple.boost
          const accent = n > 0.92 && (col * 31 + row * 17) % 29 === 0
          ctx.globalAlpha = Math.min(1, accent ? alpha + 0.05 : alpha)
          ctx.fillStyle = accent ? accentColor : brandColor
          ctx.fillText(ch, x, y)
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - last < FRAME_INTERVAL) return
      last = now
      draw(now)
    }

    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const start = () => {
      stop()
      if (reduceMotion.matches) {
        draw(0)
        return
      }
      if (!inViewport || document.hidden) return
      raf = requestAnimationFrame(loop)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = FONT
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      draw(reduceMotion.matches ? 0 : performance.now())
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver((entries) => {
      inViewport = entries[0]?.isIntersecting ?? true
      start()
    })
    intersectionObserver.observe(canvas)

    const onVisibilityChange = () => start()
    document.addEventListener('visibilitychange', onVisibilityChange)
    reduceMotion.addEventListener('change', start)

    // The canvas ignores pointer events, so listen on the window and convert
    // to canvas coordinates. One ripple per SPAWN_DISTANCE of travel.
    const onPointerMove = (event: PointerEvent) => {
      if (reduceMotion.matches) return
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (y < -40 || y > rect.height + 40) return
      const moved = Number.isNaN(lastSpawnX)
        ? Infinity
        : Math.hypot(x - lastSpawnX, y - lastSpawnY)
      if (moved < SPAWN_DISTANCE) return
      lastSpawnX = x
      lastSpawnY = y
      drops.push({ x, y, born: performance.now() / 1000 })
      if (drops.length > MAX_DROPS) drops.splice(0, drops.length - MAX_DROPS)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    resize()
    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      reduceMotion.removeEventListener('change', start)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <canvas ref={canvasRef} aria-hidden='true' className='finch-ascii-layer' />
  )
}
