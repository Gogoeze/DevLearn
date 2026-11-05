import { Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import { useAuth } from '../hooks/useAuth'
import { MIN_PASSWORD_LENGTH } from '../lib/validation'

/** Opened from the link in the reset email. Supabase signs the student in, then they pick a new password. */
export default function ResetPasswordPage() {
  const { user, loading, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const result = await updatePassword(password)
    setSubmitting(false)

    if (result.error) setError(result.error)
    else navigate('/dashboard', { replace: true })
  }

  if (loading) {
    return (
      <AuthLayout>
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </AuthLayout>
    )
  }

  // No session means the link was opened directly, or it has expired.
  if (!user) {
    return (
      <AuthLayout>
        <h1 className="font-display text-2xl font-medium tracking-tight text-fg">Link expired</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          This reset link is invalid or has expired. Request a new one to continue.
        </p>
        <Link to="/forgot-password" className="btn-primary mt-6 w-full rounded-full py-2.5">
          Request a new link
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-medium tracking-tight text-fg">
        Choose a new password
      </h1>
      <p className="mt-1 font-mono text-xs text-muted">You'll be signed in right after.</p>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-4" noValidate>
        <PasswordInput
          id="new-password"
          label="New password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <PasswordInput
          id="confirm-new-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full rounded-full py-2.5">
          {submitting ? 'Please wait...' : 'Save new password'}
        </button>
      </form>
    </AuthLayout>
  )
}