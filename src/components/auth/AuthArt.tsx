import { Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import DotField from './DotField'
import FloatingTags from './FloatingTags'
import TypingCode from './TypingCode'

// The dots, tags and background fade out toward the form, so there is no hard edge.
const DISSOLVE = 'linear-gradient(to right, transparent 0%, #000 40%)'

/**
 * The right side of the auth pages. Everything moving is decorative, so it is hidden from
 * screen readers. People who prefer reduced motion get a still version, and everyone else
 * gets a pause button.
 */
export default function AuthArt() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [paused, setPaused] = useState(false)
  const animate = !prefersReducedMotion && !paused

  return (
    <div className="relative h-full overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(135deg, var(--soft), var(--accent-soft))',
          maskImage: DISSOLVE,
          WebkitMaskImage: DISSOLVE,
        }}
      >
        <DotField animate={animate} />
        <FloatingTags animate={animate} />
      </div>

      {/* The code cards sit outside the fade so they stay fully visible. */}
      <TypingCode animate={animate} />

      {!prefersReducedMotion && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="btn-outline absolute bottom-4 right-4 z-20 px-3 py-1.5 text-xs"
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {paused ? 'Play animation' : 'Pause animation'}
        </button>
      )}
    </div>
  )
}