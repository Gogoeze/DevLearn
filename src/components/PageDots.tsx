import { useMediaQuery } from '../hooks/useMediaQuery'
import DotField from './auth/DotField'

/** A dot grid behind the whole page. The dots only react when the cursor moves near them. */
export default function PageDots() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const roomy = useMediaQuery('(min-width: 768px)')

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <DotField animate={!prefersReducedMotion} spell={false} gap={roomy ? 14 : 20} />
    </div>
  )
}