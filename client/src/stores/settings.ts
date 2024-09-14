import { type RemovableRef, useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

interface Settings {
  overlay: boolean
}

export const useSettingStore = defineStore('settings', () => {
  const settings = useStorage('settings', ref<Settings>({ overlay: false }), localStorage, {
    serializer: {
      read: (v: any) => JSON.parse(v),
      write: (v: any) => JSON.stringify(v)
    }
  }) as RemovableRef<Settings>

  function set(_settings: Partial<Settings>) {
    Object.assign(settings.value, _settings)
  }

  function toggle(key: keyof Settings) {
    settings.value[key] = !settings.value[key]
  }

  return { settings, set, toggle }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
}
