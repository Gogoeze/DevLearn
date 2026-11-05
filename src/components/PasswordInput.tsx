import { Eye, EyeOff } from 'lucide-react'
import { useState, type ReactNode } from 'react'

interface Props {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  placeholder?: string
  /** Shown on the right of the label, for example a "Forgot password?" link. */
  labelAction?: ReactNode
}

/** Password field with an eye button. Open eye means the password is visible. */
export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  labelAction,
}: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="font-mono text-xs text-fg">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-1.5 flex w-9 items-center justify-center rounded-full text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
        >
          {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}