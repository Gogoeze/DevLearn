import { Check, Lock } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { LessonProgress } from '../hooks/useProgress'
import type { CourseModule } from '../types'

interface Props {
  mod: CourseModule
  index: number
  signedIn: boolean
  progress: Record<string, LessonProgress>
}

/** The course outline beside the lesson. Only shown on wide screens, where there is room. */
export default function LessonRail({ mod, index, signedIn, progress }: Props) {
  const total = mod.lessons.length
  const doneCount = mod.lessons.filter((lesson) => progress[lesson.id]?.completed).length
  const percent = total ? Math.round((doneCount / total) * 100) : 0

  return (
    <nav
      aria-label="Lessons in this course"
      className="hidden w-56 shrink-0 self-start p-6 min-[1400px]:sticky min-[1400px]:top-0 min-[1400px]:block"
    >
      <p className="font-display text-sm font-medium text-accent-text">{mod.title}</p>

      {signedIn ? (
        <>
          <p className="mt-1 text-xs text-muted">
            {doneCount} of {total} complete
          </p>
          <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-soft">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </>
      ) : (
        <Link to="/signup" className="mt-1 inline-block text-xs text-accent-text hover:underline">
          Create a free account to unlock all lessons
        </Link>
      )}

      <ol className="mt-6">
        {mod.lessons.map((lesson, i) => {
          const isCurrent = i === index
          const done = Boolean(progress[lesson.id]?.completed)
          const locked = !signedIn && !lesson.free

          const nodeClass = done
            ? 'border-accent bg-accent text-on-accent'
            : isCurrent
              ? 'border-accent bg-surface text-accent-text'
              : locked
                ? 'border-line bg-soft text-muted'
                : 'border-line bg-surface text-muted'

          return (
            <li
              key={lesson.id}
              style={{ '--d': `${i * 80}ms` } as CSSProperties}
              className={`rise relative pb-5 pl-10 before:absolute before:bottom-0 before:left-3.5 before:top-7 before:w-px last:pb-0 last:before:hidden ${
                done ? 'before:bg-accent' : 'before:bg-line'
              }`}
            >
              <Link
                to={`/learn/${mod.id}/${lesson.id}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`block text-sm leading-7 ${
                  isCurrent ? 'font-medium text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border text-xs ${nodeClass} ${
                    isCurrent ? 'shadow-[0_0_0_4px_var(--accent-soft)]' : ''
                  }`}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : locked ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    i + 1
                  )}
                </span>
                {lesson.title}
                {done && <span className="sr-only"> (completed)</span>}
                {locked && <span className="sr-only"> (sign up to unlock)</span>}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}