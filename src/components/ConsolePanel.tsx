import type { ConsoleEntry } from '../hooks/useSandbox'

const colors: Record<ConsoleEntry['kind'], string> = {
  log: 'text-fg',
  warn: 'text-warn-text',
  error: 'text-danger',
}

export default function ConsolePanel({ entries }: { entries: ConsoleEntry[] }) {
  return (
    <div className="h-full overflow-y-auto bg-soft px-3 py-2 font-mono text-xs">
      {entries.length === 0 ? (
        <p className="text-muted">console.log output appears here.</p>
      ) : (
        entries.map((entry, i) => (
          <p key={i} className={colors[entry.kind]}>
            {entry.text}
          </p>
        ))
      )}
    </div>
  )
}
