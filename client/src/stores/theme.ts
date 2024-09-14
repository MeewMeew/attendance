import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

import type { O } from '@/shared/types'

export const useThemeStore = defineStore('theme', () => {
  const theme = useStorage(
    'theme',
    ref<O.Theme.Info>({
      dark: false,
      label: 'light',
      color: 'rose'
    })
  )

  function setColor(color: O.Theme.Color) {
    theme.value.color = color
    setTheme(theme.value.dark, theme.value.color)
  }

  function setDarkMode(value: boolean) {
    theme.value.dark = value

    setTheme(theme.value.dark, theme.value.color)
  }

  function toggleTheme() {
    setDarkMode(!theme.value.dark)
  }

  function setTheme(dark: boolean, color: O.Theme.Color) {
    theme.value.dark = dark
    theme.value.color = color
    document.documentElement.classList.toggle('dark', theme.value.dark)
    document.documentElement.dataset['theme'] = `${color}${theme.value.dark ? '-dark' : ''}`
  }

  function init() {
    setTheme(theme.value.dark, theme.value.color)
  }

  return { theme, setTheme, setDarkMode, setColor, toggleTheme, init }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot))
}
