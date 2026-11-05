import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import { useAuth } from '../hooks/useAuth'
import { isSupabaseConfigured } from '../lib/supabase'
import { isValidEmail, MIN_PASSWORD_LENGTH } from '../lib/validation'

interface Props {
  mode: 'login' | 'signup'
}

interface FormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

function validate(isLogin: boolean, v: FormValues): string | null {
  if (!isLogin && (!v.firstName.trim() || !v.lastName.trim())) {
    return 'Enter your first name and surname.'
  }
  if (!isValidEmail(v.email)) return 'Enter a valid email address.'
  if (v.password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  if (!isLogin && v.password !== v.confirmPassword) return 'Passwords do not match.'
  return null
}

export default function AuthPage({ mode }: Props) {
  const { user, signIn, signUp } = useAuth()
  const location = useLocation()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isLogin = mode === 'login'
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname

  if (user) return <Navigate to={from ?? '/dashboard'} replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setNotice(null)

    const problem = validate(isLogin, { firstName, lastName, email, password, confirmPassword })
    if (problem) {
      setError(problem)
      return
    }

    setSubmitting(true)
    const result = isLogin
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password, firstName.trim(), lastName.trim())
    setSubmitting(false)

    if (result.error) setError(result.error)
    else if (result.needsConfirmation) {
      setNotice('Check your email to confirm your account, then log in.')
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-medium tracking-tight text-fg">
        {isLogin ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="mt-1 font-mono text-xs text-muted">
        {isLogin ? 'Pick up where you left off.' : 'Sign up to save your progress.'}
      </p>

      {!isSupabaseConfigured && (
        <p className="mt-6 rounded-lg bg-warn-soft p-3 text-sm text-warn-text">
          Supabase is not configured. Copy <code>.env.example</code> to <code>.env</code> and add
          your project keys.
        </p>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-4" noValidate>
        {!isLogin && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first-name" className="mb-1.5 block font-mono text-xs text-fg">
                First name
              </label>
              <input
                id="first-name"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="last-name" className="mb-1.5 block font-mono text-xs text-fg">
                Surname
              </label>
              <input
                id="last-name"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-fg">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          labelAction={
            isLogin ? (
              <Link
                to="/forgot-password"
                className="font-mono text-xs text-accent-text underline hover:opacity-80"
              >
                Forgot password?
              </Link>
            ) : undefined
          }
        />

        {!isLogin && (
          <PasswordInput
            id="confirm-password"
            label="Confirm password"
            placeholder="Type it again"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />
        )}

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="text-sm text-accent-text">
            {notice}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full rounded-full py-2.5">
          {submitting ? 'Please wait...' : isLogin ? 'Log in' : 'Sign up'}
        </button>
      </form>

      <p className="mt-6 text-center font-mono text-xs text-muted">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <Link
          to={isLogin ? '/signup' : '/login'}
          state={location.state}
          className="text-accent-text underline hover:opacity-80"
        >
          {isLogin ? 'Create an account' : 'Log in'}
        </Link>
      </p>
    </AuthLayout>
  )
}