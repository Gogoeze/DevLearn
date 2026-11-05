import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'

export interface AuthResult {
  error: string | null
  /** True when sign-up succeeded but the email must be confirmed before logging in. */
  needsConfirmation?: boolean
}

export interface AuthState {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  /** Emails a link that leads to /reset-password. */
  resetPassword: (email: string) => Promise<AuthResult>
  /** Sets a new password for the signed-in user. */
  updatePassword: (password: string) => Promise<AuthResult>
}

export const AuthContext = createContext<AuthState | null>(null)