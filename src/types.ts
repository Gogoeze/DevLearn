export type Lang = 'html' | 'css' | 'js'

/** What a challenge check can inspect after the student's code has run in the preview. */
export interface CheckContext {
  doc: Document
  win: Window
  code: string
  /** Lines printed with console.log, in order. */
  logs: string[]
}

export interface Check {
  label: string
  /** Plain-language feedback shown when the check fails. */
  failMessage: string
  test: (ctx: CheckContext) => boolean
}

export interface Challenge {
  task: string
  starterCode: string
  checks: Check[]
  hints: [string, string, string]
  solution: string
  solutionNote: string
}

export interface Lesson {
  id: string
  /** Free lessons are open to visitors without an account. */
  free?: boolean
  title: string
  summary: string
  explanation: string[]
  snippet: string
  challenge: Challenge
}

export interface CourseModule {
  id: Lang
  title: string
  description: string
  lessons: Lesson[]
}
