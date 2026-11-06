import { createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'
import { EditorView } from '@uiw/react-codemirror'


interface Palette {
  background: string
  foreground: string
  caret: string
  selection: string
  gutter: string
  tag: string
  attribute: string
  string: string
  comment: string
}

function makeTheme(theme: 'light' | 'dark', p: Palette) {
  return createTheme({
    theme,
    settings: {
      background: p.background,
      foreground: p.foreground,
      caret: p.caret,
      selection: p.selection,
      selectionMatch: p.selection,
      lineHighlight: 'transparent',
      gutterBackground: p.background,
      gutterForeground: p.gutter,
      gutterBorder: 'transparent',
      fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
      fontSize: '13px',
    },
    styles: [
      { tag: [t.tagName, t.angleBracket, t.keyword, t.controlKeyword, t.definitionKeyword, t.operatorKeyword], color: p.tag },
      { tag: [t.attributeName, t.propertyName], color: p.attribute },
      { tag: [t.string, t.attributeValue, t.number, t.bool, t.null], color: p.string },
      { tag: [t.className, t.typeName], color: p.tag },
      { tag: t.comment, color: p.comment, fontStyle: 'italic' },
    ],
  })
}

export const lightEditorTheme = makeTheme('light', {
  background: '#f1f5fa',
  foreground: '#0f1b2d',
  caret: '#1b6fc9',
  selection: '#cfe4fa',
  gutter: '#8a9bb4',
  tag: '#1a5fb4',
  attribute: '#2e78c7',
  string: '#b26a00',
  comment: '#7c8ca5',
})

export const darkEditorTheme = makeTheme('dark', {
  background: '#080c16',
  foreground: '#e6eeff',
  caret: '#5cc0ff',
  selection: '#17335a',
  gutter: '#4a5b7d',
  tag: '#2d9cff',
  attribute: '#8fd0ff',
  string: '#ffd166',
  comment: '#6b7c9e',
})

/** Styles the suggestion popup. It reads the site's CSS variables, so light and dark both work. */
export const autocompleteStyle = EditorView.theme({
  '.cm-tooltip.cm-tooltip-autocomplete': {
    background: 'var(--surface)',
    border: '1px solid var(--line)',
    borderRadius: '10px',
    boxShadow: '0 10px 30px -10px rgb(0 0 0 / 0.35)',
    overflow: 'hidden',
    padding: '4px',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul': {
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
    fontSize: '12px',
    maxHeight: '14em',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--line) transparent',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul > li': {
    padding: '4px 10px',
    borderRadius: '6px',
    color: 'var(--fg)',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': {
    background: 'var(--accent)',
    color: 'var(--on-accent)',
  },
  '.cm-completionIcon': { display: 'none' },
  '.cm-completionMatchedText': {
    textDecoration: 'none',
    fontWeight: '700',
    color: 'var(--accent-text)',
  },
  '.cm-tooltip-autocomplete li[aria-selected] .cm-completionMatchedText': { color: 'inherit' },
  '.cm-completionDetail': { color: 'var(--muted)', marginLeft: '0.75em' },
})