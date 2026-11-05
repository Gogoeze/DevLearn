import { Braces, Circle, CircleCheck, FileCode, Palette, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { modules } from '../data'
import { useProgress } from '../hooks/useProgress'
import type { Lang } from '../types'

const icons: Record<Lang, LucideIcon> = {
  html: FileCode,
  css: Palette,
  js: Braces,
}

export default function DashboardPage() {
  const { progress, loading } = useProgress()

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Your courses</h1>
        <p className="mt-1 text-sm text-muted">Pick any lesson and start writing code.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {modules.map((mod) => {
            const Icon = icons[mod.id]
            const done = mod.lessons.filter((l) => progress[l.id]?.completed).length
            const total = mod.lessons.length
            const target = mod.lessons.find((l) => !progress[l.id]?.completed) ?? mod.lessons[0]
            const action = done === 0 ? 'Start' : done === total ? 'Review' : 'Continue'

            return (
              <section key={mod.id} className="flex flex-col rounded-xl border border-line bg-surface p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-fg">{mod.title}</h2>
                <p className="mt-1 text-sm text-muted">{mod.description}</p>

                <div className="mt-5">
                  <div className="h-1.5 overflow-hidden rounded-full bg-soft">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${(done / total) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted">
                    {loading ? 'Loading progress...' : `${done} of ${total} lessons complete`}
                  </p>
                </div>

                <ul className="mt-4 flex-1 space-y-1">
                  {mod.lessons.map((lesson) => {
                    const complete = progress[lesson.id]?.completed
                    return (
                      <li key={lesson.id}>
                        <Link
                          to={`/learn/${mod.id}/${lesson.id}`}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-fg hover:bg-soft"
                        >
                          {complete ? (
                            <CircleCheck className="h-4 w-4 text-accent-text" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted" />
                          )}
                          {lesson.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>

                <Link to={`/learn/${mod.id}/${target.id}`} className="btn-primary mt-5">
                  {action}
                </Link>
              </section>
            )
          })}
        </div>
      </main>
    </div>
  )
}
