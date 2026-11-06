import { Check, X } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { CheckResult } from '../lib/checker'

interface Props {
  checks: { label: string }[]
  results: CheckResult[] | null
  /** True when the lesson is already complete, so every item shows as done. */
  done: boolean
}

/** The goals for the challenge. Each one ticks off when the student checks their code. */
export default function Checklist({ checks, results, done }: Props) {
  return (
    <section aria-label="What your code needs to do">
      <h2 className="text-xs font-semibold tracking-wide text-muted">YOUR CODE SHOULD</h2>
      <ul className="mt-3 space-y-3">
        {checks.map((check, i) => {
          const result = results?.[i]
          const status = result ? (result.passed ? 'passed' : 'failed') : done ? 'passed' : 'pending'

          return (
            <li
              key={check.label}
              style={{ '--d': `${i * 70}ms` } as CSSProperties}
              className="rise flex items-start gap-3"
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                  status === 'passed'
                    ? 'border-accent bg-accent text-on-accent'
                    : status === 'failed'
                      ? 'border-danger bg-danger-soft text-danger'
                      : 'border-line bg-surface'
                }`}
              >
                {status === 'passed' && <Check className="h-3 w-3" />}
                {status === 'failed' && <X className="h-3 w-3" />}
              </span>
              <div className="text-sm leading-6">
                <p className={status === 'pending' ? 'text-muted' : 'text-fg'}>
                  {check.label}
                  <span className="sr-only">
                    {status === 'passed' ? ' (passed)' : status === 'failed' ? ' (not yet)' : ' (not checked yet)'}
                  </span>
                </p>
                {status === 'failed' && result?.message && <p className="text-muted">{result.message}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}