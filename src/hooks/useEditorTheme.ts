import { darkEditorTheme, lightEditorTheme } from '../lib/editorThemes'
import { useTheme } from './useTheme'

export function useEditorTheme() {
  const { theme } = useTheme()
  return theme === 'dark' ? darkEditorTheme : lightEditorTheme
}
