import { useCallback, useEffect, useRef, useState } from 'react'
import { buildSrcDoc } from '../lib/sandbox'

export interface ConsoleEntry {
  kind: 'log' | 'warn' | 'error'
  text: string
}

interface BridgeMessage {
  type?: string
  kind?: ConsoleEntry['kind']
  text?: string
}

/**
 * Debounces the student's code into a preview iframe and collects its console output.
 */
export function useSandbox(code: string, delay = 400) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const entriesRef = useRef<ConsoleEntry[]>([])
  const [rendered, setRendered] = useState(code)
  const [entries, setEntries] = useState<ConsoleEntry[]>([])

  const render = useCallback((next: string) => {
    entriesRef.current = []
    setEntries([])
    setRendered(next)
  }, [])

  useEffect(() => {
    if (code === rendered) return
    const timer = setTimeout(() => render(code), delay)
    return () => clearTimeout(timer)
  }, [code, rendered, delay, render])

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return
      const data = event.data as BridgeMessage | null
      if (data?.type !== 'devlearn-console' || !data.kind) return
      entriesRef.current = [...entriesRef.current, { kind: data.kind, text: data.text ?? '' }]
      setEntries(entriesRef.current)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return {
    iframeRef,
    srcDoc: buildSrcDoc(rendered),
    entries,
    /* True when the preview already shows the latest code. */
    isCurrent: rendered === code,
    /* Renders the latest code immediately instead of waiting for the debounce. */
    flush: () => render(code),
    getLogs: () => entriesRef.current.filter((e) => e.kind === 'log').map((e) => e.text),
  }
}
