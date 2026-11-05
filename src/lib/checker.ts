import type { Check, CheckContext } from '../types'

export interface CheckResult {
  label: string
  passed: boolean
  message?: string
}

export function runChecks(checks: Check[], ctx: CheckContext): CheckResult[] {
  return checks.map((check) => {
    let passed = false
    try {
      passed = check.test(ctx)
    } catch {
      passed = false
    }
    return { label: check.label, passed, message: passed ? undefined : check.failMessage }
  })
}

export function hasText(el: Element | null | undefined): boolean {
  return Boolean(el?.textContent?.trim())
}

/** Parses a computed `rgb(r, g, b)` colour string. */
export function parseRgb(value: string): [number, number, number] | null {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null
}
