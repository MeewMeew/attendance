import { useStorage } from '@vueuse/core'
import { nanoid as nano } from 'nanoid'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useNanoIDStore = defineStore('nanoid', () => {
  const id = localStorage.getItem('nanoid') || nano()
  const nanoid = useStorage('nanoid', ref<string>(id), localStorage)

  function setId(id: string) {
    nanoid.value = id
  }

  return { nanoid, setId }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNanoIDStore, import.meta.hot))
}
