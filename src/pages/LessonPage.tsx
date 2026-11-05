import { Loader2 } from 'lucide-react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import LessonView from '../components/LessonView'
import { modules } from '../data'
import { useAuth } from '../hooks/useAuth'

export default function LessonPage() {
  const { moduleId, lessonId } = useParams()
  const { user, loading } = useAuth()
  const location = useLocation()

  const mod = modules.find((m) => m.id === moduleId)
  const index = mod ? mod.lessons.findIndex((l) => l.id === lessonId) : -1

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!mod || index === -1) return <Navigate to={user ? '/dashboard' : '/'} replace />

  const lesson = mod.lessons[index]

  // Only the free lesson is open to visitors. Everything else needs an account.
  if (!lesson.free && !user) return <Navigate to="/login" replace state={{ from: location }} />

  // Keyed so hints, code and results reset when moving between lessons.
  return <LessonView key={lesson.id} mod={mod} index={index} />
}
