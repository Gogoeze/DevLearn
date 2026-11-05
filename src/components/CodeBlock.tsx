import CodeMirror from '@uiw/react-codemirror'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { useEditorTheme } from '../hooks/useEditorTheme'
import { languageExtension } from '../lib/languages'
import type { Lang } from '../types'

interface Props {
  code: string
  language: Lang
}

/** Read-only, syntax-highlighted snippet with a copy button. */
export default function CodeBlock({ code, language }: Props) {
  const [copied, setCopied] = useState(false)
  const theme = useEditorTheme()

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard access can be blocked; nothing useful to show.
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-soft">
      <button
        type="button"
        onClick={() => void copy()}
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 font-display text-xs font-medium text-muted hover:text-fg"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <CodeMirror
        value={code}
        editable={false}
        theme={theme}
        extensions={[languageExtension(language)]}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
        }}
        className="[&_.cm-content]:py-3 [&_.cm-content]:pr-16"
      />
    </div>
  )
}
