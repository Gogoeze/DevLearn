import type { CourseModule } from '../types'
import { cssModule } from './css'
import { htmlModule } from './html'
import { jsModule } from './js'

export const modules: CourseModule[] = [htmlModule, cssModule, jsModule]
