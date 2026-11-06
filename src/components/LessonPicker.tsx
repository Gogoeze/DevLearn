import { Check, ChevronDown, Lock } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { LessonProgress } from '../hooks/useProgress'
import type { CourseModule } from '../types'

interface Props {
  mod: CourseModule
  index: number
  signedIn: boolean
  progress: Record<string, LessonProgress>
}

/** A lesson menu. The options are links, so choosing one simply navigates. */
export default function LessonPicker({ mod, index, signedIn, progress }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listId = useId()
  const current = mod.lessons[index]

  // Close on a click outside, or on Escape (and hand focus back to the button).
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={listId}
        className="flex max-w-[240px] items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 font-display text-sm text-fg transition-colors hover:border-accent"
      >
        <span className="truncate">
          {index + 1}. {current.title}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          className="absolute left-1/2 z-30 mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-xl"
        >
          {mod.lessons.map((lesson, i) => {
            const isCurrent = i === index
            const done = Boolean(progress[lesson.id]?.completed)
            const locked = !signedIn && !lesson.free

            return (
              <li key={lesson.id}>
                <Link
                  to={`/learn/${mod.id}/${lesson.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                    isCurrent ? 'bg-accent-soft text-accent-text' : 'text-fg hover:bg-soft'
                  }`}
                >
                  <span className="w-5 text-center font-mono text-xs text-muted">{i + 1}</span>
                  <span className="flex-1 truncate">{lesson.title}</span>
                  {done && (
                    <>
                      <Check aria-hidden="true" className="h-4 w-4 text-accent-text" />
                      <span className="sr-only">Completed</span>
                    </>
                  )}
                  {locked && (
                    <>
                      <Lock aria-hidden="true" className="h-3.5 w-3.5 text-muted" />
                      <span className="sr-only">Sign up to unlock</span>
                    </>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}