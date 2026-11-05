import { html } from '@codemirror/lang-html'
import CodeMirror from '@uiw/react-codemirror'
import { useEditorTheme } from '../hooks/useEditorTheme'

interface Props {
  value: string
  onChange: (value: string) => void
}

/** Editable pane. The student's code is always an HTML fragment, which may embed style and script. */
export default function CodeEditor({ value, onChange }: Props) {
  const theme = useEditorTheme()

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={theme}
      extensions={[html()]}
      onChange={onChange}
      basicSetup={{ foldGutter: false, highlightActiveLine: false }}
      className="h-full"
    />
  )
}
