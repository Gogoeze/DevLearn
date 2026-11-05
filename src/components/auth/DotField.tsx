import { useCallback, useEffect, useRef } from 'react'
import { useTheme } from '../../hooks/useTheme'

const WORDS = ['HTML', 'CSS', 'JS', 'DevLearn']
const WORD_INTERVAL_MS = 3400
const EVEN_SIZE = 1.1 // dot size on the plain page background

interface Dot {
  x: number
  y: number
  /** Current drawn size. It eases toward the target size. */
  size: number
  /** 0 to 1: how much of this dot sits inside the current word. */
  letter: number
  /** Size this dot has when it is only part of the background. */
  blob: number
  /** How much the cursor is lighting this dot up. It eases in and out. */
  glow: number
}

interface Point {
  x: number
  y: number
}

interface Props {
  /** False when paused or reduced motion is on: everything is drawn still. */
  animate: boolean
  /** Spell words and shimmer (the login art). Off for the plain page background. */
  spell?: boolean
  /** Pixels between dots. */
  gap?: number
}

/** Background dot size for the art. Dots shrink to nothing toward the edge of an uneven blob. */
function blobSize(x: number, y: number, w: number, h: number): number {
  const nx = x / w
  const ny = y / h
  const distance = Math.hypot(nx - 0.55, (ny - 0.62) * 0.9)
  const wobble =
    0.12 * Math.sin(ny * 7 + 1.3) + 0.09 * Math.sin(nx * 9 + 0.4) + 0.06 * Math.sin((nx + ny) * 14)
  const strength = 0.62 + wobble - distance
  return strength > 0 ? Math.min(1, strength * 2.4) * 1.7 : 0
}

function buildDots(w: number, h: number, gap: number, even: boolean): Dot[] {
  const dots: Dot[] = []
  for (let y = gap / 2; y < h; y += gap) {
    for (let x = gap / 2; x < w; x += gap) {
      dots.push({
        x,
        y,
        size: 0,
        letter: 0,
        glow: 0,
        blob: even ? EVEN_SIZE : blobSize(x, y, w, h),
      })
    }
  }
  return dots
}

/** Draws the word on a hidden canvas, then records how much of each dot falls inside the letters. */
function sampleWord(dots: Dot[], word: string, w: number, h: number) {
  const hidden = document.createElement('canvas')
  hidden.width = w
  hidden.height = h
  const ctx = hidden.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Shrink the font until the word fits the panel.
  let fontSize = Math.min(w * 0.36, 170)
  const applyFont = () => {
    ctx.font = `700 ${fontSize}px "Space Grotesk", sans-serif`
  }
  applyFont()
  while (ctx.measureText(word).width > w * 0.78 && fontSize > 40) {
    fontSize -= 6
    applyFont()
  }
  ctx.fillText(word, w * 0.5, h * 0.7)

  const pixels = ctx.getImageData(0, 0, w, h).data
  for (const dot of dots) {
    // Average a small neighbourhood so the letter edges look soft.
    let sum = 0
    let count = 0
    for (let dy = -2; dy <= 2; dy += 2) {
      for (let dx = -2; dx <= 2; dx += 2) {
        const px = Math.min(w - 1, Math.max(0, Math.round(dot.x + dx)))
        const py = Math.min(h - 1, Math.max(0, Math.round(dot.y + dy)))
        sum += pixels[(py * w + px) * 4]
        count++
      }
    }
    dot.letter = sum / count / 255
  }
}

function targetSize(dot: Dot): number {
  return dot.letter > 0.15 ? 1.6 + dot.letter * 2.3 : dot.blob
}

/**
 * Eases every dot toward its target size and its cursor glow.
 * Returns true while anything is still moving, so the loop knows when it can sleep.
 */
function stepDots(dots: Dot[], mouse: Point, radius: number): boolean {
  let moving = false
  for (const dot of dots) {
    const target = targetSize(dot)
    dot.size += (target - dot.size) * 0.12

    const dx = dot.x - mouse.x
    const dy = dot.y - mouse.y
    let boost = 0
    if (Math.abs(dx) < radius && Math.abs(dy) < radius) {
      const distance = Math.hypot(dx, dy)
      if (distance < radius) boost = (1 - distance / radius) * 2.2
    }
    dot.glow += (boost - dot.glow) * 0.2

    if (Math.abs(target - dot.size) > 0.01 || dot.glow > 0.01 || boost > 0) moving = true
  }
  return moving
}

function drawDots(
  ctx: CanvasRenderingContext2D,
  dots: Dot[],
  w: number,
  h: number,
  time: number,
  animated: boolean,
  art: boolean,
) {
  // Colours come from CSS variables, so light and dark mode work without extra code.
  const style = getComputedStyle(ctx.canvas)
  const bright = style.getPropertyValue('--dot-hi').trim()
  const dim = style.getPropertyValue('--dot-lo').trim()

  ctx.clearRect(0, 0, w, h)
  for (const dot of dots) {
    const inLetter = dot.letter > 0.15
    let size = dot.size
    let glow = 0

    if (animated) {
      glow = dot.glow
      size += glow
      if (art && (inLetter || dot.blob > 0)) {
        size += Math.sin(time / 700 + dot.x * 0.04 + dot.y * 0.05) * 0.22 // slow shimmer
      }
    }

    if (size < 0.25) continue
    ctx.beginPath()
    ctx.arc(dot.x, dot.y, Math.min(size, 4.2), 0, Math.PI * 2)

    if (inLetter) {
      ctx.globalAlpha = 1
      ctx.fillStyle = bright
    } else {
      ctx.globalAlpha = art ? 0.5 + Math.min(0.3, dot.blob * 0.2) : 0.55
      ctx.fillStyle = dim
    }
    ctx.fill()

    // The cursor highlight: draw the same dot again in the bright colour, as strong as the glow.
    if (!inLetter && glow > 0.05) {
      ctx.globalAlpha = Math.min(1, glow / 1.6)
      ctx.fillStyle = bright
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

export default function DotField({ animate, spell = true, gap = 9 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const dotsRef = useRef<Dot[]>([])
  const sizeRef = useRef({ w: 0, h: 0 })
  const wordRef = useRef(0)
  const mouseRef = useRef<Point>({ x: -999, y: -999 })
  const animateRef = useRef(animate)
  const wakeRef = useRef<() => void>(() => {})
  const radius = gap * 8 // how far the cursor highlight reaches

  useEffect(() => {
    animateRef.current = animate
  }, [animate])

  /** Draws one still frame with every dot at its final size. */
  const redrawStatic = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { w, h } = sizeRef.current
    for (const dot of dotsRef.current) {
      dot.size = targetSize(dot)
      dot.glow = 0
    }
    drawDots(ctx, dotsRef.current, w, h, 0, false, spell)
  }, [spell])

  // Build the dots, and rebuild them whenever the panel changes size.
  useEffect(() => {
    const canvas = canvasRef.current
    const panel = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !panel || !ctx) return

    const build = () => {
      const w = panel.clientWidth
      const h = panel.clientHeight
      if (!w || !h) return
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * ratio
      canvas.height = h * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      sizeRef.current = { w, h }
      dotsRef.current = buildDots(w, h, gap, !spell)
      if (spell) sampleWord(dotsRef.current, WORDS[wordRef.current], w, h)
      if (animateRef.current) wakeRef.current()
      else redrawStatic()
    }

    const observer = new ResizeObserver(build)
    observer.observe(panel)

    // The font may not be loaded yet, so sample the word again once it is.
    let cancelled = false
    if (spell) {
      void document.fonts.load('700 100px "Space Grotesk"').then(() => {
        if (!cancelled) build()
      })
    }

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [gap, spell, redrawStatic])

  // Swap to the next word every few seconds.
  useEffect(() => {
    if (!animate || !spell) return
    const id = window.setInterval(() => {
      wordRef.current = (wordRef.current + 1) % WORDS.length
      const { w, h } = sizeRef.current
      sampleWord(dotsRef.current, WORDS[wordRef.current], w, h)
    }, WORD_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [animate, spell])

  // The animation loop. The art never stops; the plain background sleeps until the cursor moves.
  // When paused, draw a single still frame instead.
  // "theme" is a dependency so the dots redraw in the new colours.
  useEffect(() => {
    if (!animate) {
      wakeRef.current = () => {}
      const id = requestAnimationFrame(redrawStatic)
      return () => cancelAnimationFrame(id)
    }

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    let frameId = 0
    const frame = (time: number) => {
      const { w, h } = sizeRef.current
      const moving = stepDots(dotsRef.current, mouseRef.current, radius)
      drawDots(ctx, dotsRef.current, w, h, time, true, spell)
      frameId = spell || moving ? requestAnimationFrame(frame) : 0
    }
    const wake = () => {
      if (!frameId) frameId = requestAnimationFrame(frame)
    }

    wakeRef.current = wake
    wake()

    return () => {
      cancelAnimationFrame(frameId)
      wakeRef.current = () => {}
    }
  }, [animate, spell, theme, radius, redrawStatic])

  // Track the cursor anywhere on the page, so the highlight works behind other content too.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      wakeRef.current()
    }
    const onLeave = () => {
      mouseRef.current = { x: -999, y: -999 }
      wakeRef.current()
    }

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}