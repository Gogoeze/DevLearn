import { Code2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import ThemeToggle from '../ThemeToggle'
import AuthArt from './AuthArt'

/** Floating form on the left, animated art on the right. The art is not loaded on small screens. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const showArt = useMediaQuery('(min-width: 1024px)')

  return (
    <div className="min-h-screen bg-page lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex min-h-screen flex-col px-6 py-6 sm:px-12">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold text-fg">
            <Code2 className="h-5 w-5 text-accent-text" />
            DevLearn
          </Link>
          <ThemeToggle />
        </header>
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          {children}
        </main>
      </div>

      {showArt && (
        <aside>
          <div className="sticky top-0 h-screen">
            <AuthArt />
          </div>
        </aside>
      )}
    </div>
  )
}