/** Renders text where `backtick` segments become inline code. */
export default function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split('`').map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="rounded bg-soft px-1.5 py-0.5 font-mono text-[0.85em] text-accent-text"
          >
            {part}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
