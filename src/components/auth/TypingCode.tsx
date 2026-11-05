import { useEffect, useState } from 'react'

type Kind = 'tag' | 'attr' | 'string' | 'text'

// The code that gets typed, split into pieces so each piece can have its own colour.
const SEGMENTS: [string, Kind][] = [
  ['<h1>', 'tag'],
  ['Hello, world', 'text'],
  ['</h1>', 'tag'],
  ['\n', 'text'],
  ['<style>', 'tag'],
  ['\n  ', 'text'],
  ['h1', 'attr'],
  [' { ', 'text'],
  ['color', 'attr'],
  [': ', 'text'],
  ['blue', 'string'],
  ['; }', 'text'],
  ['\n', 'text'],
  ['</style>', 'tag'],
]

const KIND_CLASS: Record<Kind, string> = {
  tag: 'text-accent-text',
  attr: 'text-attr',
  string: 'text-str',
  text: 'text-fg',
}

const lengthUpTo = (count: number) =>
  SEGMENTS.slice(0, count).reduce((sum, [text]) => sum + text.length, 0)

const TOTAL = lengthUpTo(SEGMENTS.length)
const AFTER_HEADING = lengthUpTo(3) // the h1 line is complete
const AFTER_CSS = lengthUpTo(12) // the colour has been set
const HOLD_TICKS = 40 // pause on the finished code before starting again
const TICK_MS = 70

export default function TypingCode({ animate }: { animate: boolean }) {
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!animate) return
    const id = window.setInterval(
      () => setTyped((n) => (n >= TOTAL + HOLD_TICKS ? 0 : n + 1)),
      TICK_MS,
    )
    return () => window.clearInterval(id)
  }, [animate])

  // When paused or reduced motion is on, show the finished code.
  const shown = animate ? Math.min(typed, TOTAL) : TOTAL

  let remaining = shown
  const pieces = SEGMENTS.flatMap(([text, kind], i) => {
    if (remaining <= 0) return []
    const part = text.slice(0, remaining)
    remaining -= part.length
    return [
      <span key={i} className={KIND_CLASS[kind]}>
        {part}
      </span>,
    ]
  })

  const card = 'rounded-xl border border-line bg-surface p-4 shadow-sm dark:shadow-none'

  return (
    <div aria-hidden="true" className="absolute right-8 top-12 z-10 flex w-[68%] max-w-md flex-col gap-3">
      <div className={`${card} h-36`}>
        <div className="whitespace-pre font-mono text-xs leading-7">
          {pieces}
          {animate && (
            <span
              className="ml-0.5 inline-block h-3.5 w-1.5 bg-accent-text align-middle"
              style={{ animation: 'blink 1s steps(1) infinite' }}
            />
          )}
        </div>
      </div>
      <div className={`${card} w-[85%] self-end`}>
        <p className="font-mono text-xs text-muted">Preview</p>
        <p
          className={`font-display text-2xl font-medium transition-colors ${
            shown >= AFTER_CSS ? 'text-accent' : 'text-fg'
          } ${shown >= AFTER_HEADING ? '' : 'invisible'}`}
        >
          Hello, world
        </p>
      </div>
    </div>
  )
}