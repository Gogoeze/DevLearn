import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import type { Lang } from '../types'

export function languageExtension(lang: Lang) {
  switch (lang) {
    case 'css':
      return css()
    case 'js':
      return javascript()
    default:
      return html()
  }
}
