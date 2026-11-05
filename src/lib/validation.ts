export const MIN_PASSWORD_LENGTH = 6

export function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email.trim())
}