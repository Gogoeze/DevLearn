import type { Ref } from 'react'

interface Props {
  srcDoc: string
  iframeRef: Ref<HTMLIFrameElement>
  onLoad: () => void
}

/**
 * allow-same-origin lets the challenge checks read the rendered DOM. The iframe only ever runs
 * the signed-in student's own code, so this is acceptable. Do not render code from other users here.
 */
export default function Preview({ srcDoc, iframeRef, onLoad }: Props) {
  return (
    <iframe
      ref={iframeRef}
      title="Preview"
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-same-origin"
      onLoad={onLoad}
      className="h-full w-full bg-white"
    />
  )
}
