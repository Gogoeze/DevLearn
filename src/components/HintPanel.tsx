import { Lightbulb } from 'lucide-react'
import CodeBlock from './CodeBlock'
import RichText from './RichText'

interface Props {
  hints: string[]
  shown: number
  onShowHint: () => void
  solution: string
  solutionNote: string
  solutionShown: boolean
  onShowSolution: () => void
  onLoadSolution: () => void
}

/** Reveals hints one at a time, from a nudge to a near-answer, then the full solution. */
export default function HintPanel({
  hints,
  shown,
  onShowHint,
  solution,
  solutionNote,
  solutionShown,
  onShowSolution,
  onLoadSolution,
}: Props) {
  const allHintsShown = shown >= hints.length

  return (
    <section className="space-y-3">
      {hints.slice(0, shown).map((hint, i) => (
        <div key={i} className="flex gap-3 rounded-lg bg-warn-soft p-3 text-sm text-fg">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warn-text" />
          <p>
            <span className="font-display font-medium">Hint {i + 1}. </span>
            <RichText text={hint} />
          </p>
        </div>
      ))}

      {!allHintsShown && (
        <button type="button" onClick={onShowHint} className="btn-outline">
          <Lightbulb className="h-4 w-4" />
          {shown === 0 ? 'I need a hint' : `Show hint ${shown + 1} of ${hints.length}`}
        </button>
      )}

      {allHintsShown && !solutionShown && (
        <button type="button" onClick={onShowSolution} className="btn-outline">
          Show solution
        </button>
      )}

      {solutionShown && (
        <div className="space-y-3">
          <CodeBlock code={solution} language="html" />
          <p className="text-sm text-muted">
            <RichText text={solutionNote} />
          </p>
          <button type="button" onClick={onLoadSolution} className="btn-outline">
            Load into editor
          </button>
        </div>
      )}
    </section>
  )
}
