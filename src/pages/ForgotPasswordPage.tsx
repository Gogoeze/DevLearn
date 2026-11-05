import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import { useAuth } from '../hooks/useAuth'
import { isValidEmail } from '../lib/validation'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return
    }

    setSubmitting(true)
    const result = await resetPassword(email.trim())
    setSubmitting(false)

    if (result.error) setError(result.error)
    else setSent(true)
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-medium tracking-tight text-fg">
        Reset your password
      </h1>

      {sent ? (
        <div role="status" className="mt-4 space-y-4">
          <p className="text-sm leading-6 text-muted">
            If an account exists for <span className="font-medium text-fg">{email.trim()}</span>, a
            link to reset your password is on its way. Check your inbox and spam folder.
          </p>
          <Link to="/login" className="btn-outline w-full rounded-full py-2.5">
            Back to log in
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-1 font-mono text-xs text-muted">
            Enter your email and we'll send you a reset link.
          </p>
          <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-4" noValidate>
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

            {error && (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full rounded-full py-2.5">
              {submitting ? 'Please wait...' : 'Send reset link'}
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-xs text-muted">
            Remembered it?{' '}
            <Link to="/login" className="text-accent-text underline hover:opacity-80">
              Log in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  )
}