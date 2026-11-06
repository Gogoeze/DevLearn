import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, CircleCheck, RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProgress } from '../hooks/useProgress'
import { useSandbox } from '../hooks/useSandbox'
import { runChecks, type CheckResult } from '../lib/checker'
import type { CourseModule } from '../types'
import CheckResults from './CheckResults'
import CodeBlock from './CodeBlock'
import CodeEditor from './CodeEditor'
import ConsolePanel from './ConsolePanel'
import HintPanel from './HintPanel'
import Preview from './Preview'
import RichText from './RichText'
import ThemeToggle from './ThemeToggle'
import LessonPicker from './LessonPicker'
import LessonRail from './LessonRail'
import Checklist from './Checklist'




interface Props {
  mod: CourseModule
  index: number
}

function PaneLabel({ children }: { children: string }) {
  return (
    <div className="border-y border-line bg-page px-3 py-1.5 font-display text-xs font-medium text-muted">
      {children}
    </div>
  )
}

export default function LessonView({ mod, index }: Props) {
  const lesson = mod.lessons[index]
  const { challenge } = lesson
  const prev = mod.lessons[index - 1]
  const next = mod.lessons[index + 1]

  const { user } = useAuth()
  const navigate = useNavigate()
  const { progress, markComplete } = useProgress()
  const [code, setCode] = useState(challenge.starterCode)
  const [hintsShown, setHintsShown] = useState(0)
  const [solutionShown, setSolutionShown] = useState(false)
  const [results, setResults] = useState<CheckResult[] | null>(null)
  const sandbox = useSandbox(code)
  const pendingCheck = useRef(false)

  const allPassed = results !== null && results.every((r) => r.passed)
  const completed = allPassed || Boolean(progress[lesson.id]?.completed)

  function evaluate() {
    const iframe = sandbox.iframeRef.current
    const win = iframe?.contentWindow
    const doc = iframe?.contentDocument
    if (!win || !doc) return
    const nextResults = runChecks(challenge.checks, { doc, win, code, logs: sandbox.getLogs() })
    setResults(nextResults)
    if (nextResults.every((r) => r.passed)) void markComplete(lesson.id, hintsShown)
  }

  function handleCheck() {
    if (sandbox.isCurrent) {
      evaluate()
    } else {
      // Wait for the preview to load the latest code, then check it.
      pendingCheck.current = true
      sandbox.flush()
    }
  }

  function handleLoad() {
    if (!pendingCheck.current) return
    pendingCheck.current = false
    // Give console messages from the freshly loaded page a moment to arrive.
    setTimeout(evaluate, 100)
  }

  function updateCode(value: string) {
    setCode(value)
    setResults(null)
  }

  const arrowClass = 'inline-flex h-9 w-9 items-center justify-center rounded-lg'

  return (
    <div className="flex min-h-screen flex-col bg-page lg:h-screen">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-line bg-surface px-4">
        <Link to={user ? '/dashboard' : '/'} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" />
          {user ? 'Dashboard' : 'Home'}
        </Link>

        <div className="flex items-center gap-1">
          {prev ? (
            <Link to={`/learn/${mod.id}/${prev.id}`} className={`${arrowClass} text-muted hover:bg-soft`} aria-label="Previous lesson">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span className={`${arrowClass} text-line`}>
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}
          <LessonPicker mod={mod} index={index} signedIn={Boolean(user)} progress={progress} />
          {next ? (
            <Link to={`/learn/${mod.id}/${next.id}`} className={`${arrowClass} text-muted hover:bg-soft`} aria-label="Next lesson">
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className={`${arrowClass} text-line`}>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!user && (
            <Link to="/signup" className="btn-primary">
              Sign up
            </Link>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 lg:min-h-0 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="bg-surface lg:overflow-y-auto min-[1400px]:flex">
          <LessonRail mod={mod} index={index} signedIn={Boolean(user)} progress={progress} />
          <article className="mx-auto min-w-0 max-w-2xl flex-1 space-y-8 p-6 lg:p-8">
            <header>
              <p className="font-display text-sm font-medium text-accent-text">{mod.title}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-fg  min-[1400px]:text-3xl">{lesson.title}</h1>
            </header>

            <section className="space-y-3 text-[15px] leading-7 text-muted  min-[1400px]:text-[17px] min-[1400px]:leading-8">
              {lesson.explanation.map((paragraph, i) => (
                <p key={i}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </section>

            <CodeBlock code={lesson.snippet} language={mod.id} />

            <section className="rounded-xl border border-accent-line bg-accent-soft p-4">
              <h2 className="text-xs font-semibold tracking-wide text-accent-text">CHALLENGE</h2>
              <p className="mt-1.5 text-fg">
                <RichText text={challenge.task} />
              </p>
            </section>
            
            <Checklist checks={challenge.checks} results={results} done={completed} />

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleCheck} className="btn-primary">
                Check my code
              </button>
              <button
                type="button"
                onClick={() => {
                  setCode(challenge.starterCode)
                  setResults(null)
                }}
                className="btn-ghost"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>


            {completed && (
              <div className="rounded-xl border border-accent-line bg-accent-soft p-4">
                <p className="flex items-center gap-2 font-display text-sm font-medium text-accent-text">
                  <CircleCheck className="h-5 w-5" />
                  Challenge complete
                </p>
                {user ? (
                  <div className="mt-3">
                    {next ? (
                      <Link to={`/learn/${mod.id}/${next.id}`} className="btn-primary">
                        Next lesson
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link to="/dashboard" className="btn-primary">
                        Back to dashboard
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-muted">
                      Create a free account to save your progress and unlock the rest of the course.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link to="/signup" className="btn-primary">
                        Create account
                      </Link>
                      <Link to="/login" className="btn-outline">
                        Log in
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            <HintPanel
              hints={challenge.hints}
              shown={hintsShown}
              onShowHint={() => setHintsShown((n) => n + 1)}
              solution={challenge.solution}
              solutionNote={challenge.solutionNote}
              solutionShown={solutionShown}
              onShowSolution={() => setSolutionShown(true)}
              onLoadSolution={() => updateCode(challenge.solution)}
            />
          </article>
        </div>

        <div className="flex h-[680px] flex-col border-t border-line bg-surface lg:h-auto lg:min-h-0 lg:border-l lg:border-t-0">
          <PaneLabel>Editor</PaneLabel>
          <div className="min-h-0 flex-1 overflow-auto">
            <CodeEditor value={code} onChange={updateCode} />
          </div>
          <PaneLabel>Preview</PaneLabel>
          <div className="min-h-0 flex-1">
            <Preview srcDoc={sandbox.srcDoc} iframeRef={sandbox.iframeRef} onLoad={handleLoad} />
          </div>
          <PaneLabel>Console</PaneLabel>
          <div className="h-24 shrink-0">
            <ConsolePanel entries={sandbox.entries} />
          </div>
        </div>
      </main>
    </div>
  )
}
