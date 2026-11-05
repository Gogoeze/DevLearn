import { Code2, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-fg">
          <Code2 className="h-5 w-5 text-accent-text" />
          DevLearn
        </Link>
        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-ghost">
                Dashboard
              </Link>
              <button type="button" onClick={() => void signOut()} className="btn-ghost">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
