import { CircleCheck, CircleX } from 'lucide-react'
import type { CheckResult } from '../lib/checker'

export default function CheckResults({ results }: { results: CheckResult[] }) {
  return (
    <ul className="space-y-2">
      {results.map((result) => (
        <li key={result.label} className="flex gap-2 text-sm">
          {result.passed ? (
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" />
          ) : (
            <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          )}
          <div>
            <p className={result.passed ? 'text-muted' : 'font-medium text-fg'}>{result.label}</p>
            {result.message && <p className="text-muted">{result.message}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}
