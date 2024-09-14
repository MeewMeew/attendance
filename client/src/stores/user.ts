import { type RemovableRef, useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

import { User } from '@/database'
import { observeAuthState } from '@/lib/services'
import type { M } from '@/shared/types'

export const useUserStore = defineStore('user', () => {
  const user = useStorage('user', ref<M.User.Info | null>(null), localStorage, {
    serializer: {
      read: (v: any) => JSON.parse(v) as M.User.Info,
      write: (v: any) => JSON.stringify(v)
    }
  }) as RemovableRef<M.User.Info>

  function set(_user: M.User.Info | null) {
    user.value = _user
  }

  async function fetch() {
    const unsubscribe = observeAuthState(async (user) => {
      if (user) {
        const data = await User.read(user.uid)
        if (data) set(data)
      }
      return unsubscribe()
    })
  }

  function clear() {
    set(null)
  }

  return { user, set, fetch, clear }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
