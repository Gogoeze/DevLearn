import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export interface LessonProgress {
  completed: boolean
  hintsUsed: number
}

interface ProgressRow {
  lesson_id: string
  completed: boolean
  hints_used: number
}

export function useProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      // Visitors on the free lesson have no saved progress.
      setLoading(false)
      return
    }
    let cancelled = false

    supabase
      .from('progress')
      .select('lesson_id, completed, hints_used')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (cancelled) return
        const map: Record<string, LessonProgress> = {}
        ;((data ?? []) as ProgressRow[]).forEach((row) => {
          map[row.lesson_id] = { completed: row.completed, hintsUsed: row.hints_used }
        })
        setProgress(map)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const markComplete = useCallback(
    async (lessonId: string, hintsUsed: number) => {
      if (!user) return
      setProgress((prev) => ({ ...prev, [lessonId]: { completed: true, hintsUsed } }))
      const { error } = await supabase.from('progress').upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        hints_used: hintsUsed,
        updated_at: new Date().toISOString(),
      })
      if (error) console.error('Could not save progress:', error.message)
    },
    [user],
  )

  return { progress, loading, markComplete }
}
