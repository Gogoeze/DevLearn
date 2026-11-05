import type { CSSProperties } from 'react'

interface Tag {
  text: string
  /** Tailwind position classes. */
  position: string
  /** Font size in pixels. */
  size: number
  /** Tilt in degrees. */
  rotate: number
  /** How far it drifts, in pixels. */
  x: number
  y: number
  /** Seconds for one drift, and a negative delay so tags start at different points. */
  duration: number
  delay: number
}

// Positions, sizes, tilts and speeds are all different so nothing lines up.
const TAGS: Tag[] = [
  { text: '{ }', position: 'top-[6%] left-[7%]', size: 19, rotate: -14, x: 12, y: -10, duration: 7, delay: -2 },
  { text: '=>', position: 'top-[38%] left-[3%]', size: 14, rotate: 9, x: -8, y: 14, duration: 9, delay: -4 },
  { text: '</>', position: 'bottom-[9%] left-[9%]', size: 22, rotate: -6, x: 14, y: -12, duration: 8, delay: -1 },
  { text: '#app', position: 'bottom-[11%] right-[8%]', size: 13, rotate: -18, x: -12, y: -8, duration: 6.5, delay: -3 },
  { text: '( )', position: 'top-[47%] right-[3%]', size: 17, rotate: 20, x: -6, y: 12, duration: 10, delay: -5 },
  { text: 'const', position: 'bottom-[24%] right-[16%]', size: 12, rotate: -9, x: 10, y: 10, duration: 7.5, delay: -6 },
  { text: ';', position: 'top-[20%] left-[15%]', size: 26, rotate: 14, x: -9, y: -14, duration: 11, delay: -2.5 },
  { text: 'href=', position: 'bottom-[2%] left-[42%]', size: 11, rotate: 6, x: 14, y: -6, duration: 8.5, delay: -7 },
  { text: '.card', position: 'top-[3%] left-[46%]', size: 15, rotate: -22, x: -10, y: 12, duration: 9.5, delay: -3.5 },
  { text: 'px', position: 'top-[28%] left-[34%]', size: 13, rotate: 11, x: 8, y: 9, duration: 12, delay: -8 },
]

export default function FloatingTags({ animate }: { animate: boolean }) {
  return (
    <>
      {TAGS.map((tag) => (
        <span
          key={tag.text}
          className={`pointer-events-none absolute z-0 select-none whitespace-nowrap font-mono text-tag ${tag.position}`}
          style={
            {
              fontSize: tag.size,
              '--r': `${tag.rotate}deg`,
              '--x': `${tag.x}px`,
              '--y': `${tag.y}px`,
              animationName: 'drift',
              animationDuration: `${tag.duration}s`,
              animationTimingFunction: 'ease-in-out',
              animationDelay: `${tag.delay}s`,
              animationIterationCount: 'infinite',
              // Pausing freezes each tag where it is.
              animationPlayState: animate ? 'running' : 'paused',
            } as CSSProperties
          }
        >
          {tag.text}
        </span>
      ))}
    </>
  )
}