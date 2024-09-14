import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

import type { O } from '@/shared/types'

type Submenu = {
  isSubmenu: boolean
  isOpen?: boolean
  index: number
}

export const useSidebarStore = defineStore('sidebar', () => {
  const isOpen = ref<boolean>(false)
  const submenus = ref<Submenu[]>([])

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function initSubmenus(list: O.Menu.List) {
    submenus.value = []
    for (const menu of list) {
      submenus.value.push({
        isSubmenu: !!menu.children,
        isOpen: false,
        index: submenus.value.length
      })
    }
  }

  function toggleSubmenu(index: number) {
    if (!submenus.value[index].isSubmenu) return
    for (const submenu of submenus.value) {
      if (submenu.isSubmenu && submenu.isOpen && submenu.index !== index) {
        submenu.isOpen = false
      }
    }
    submenus.value[index].isOpen = !submenus.value[index].isOpen
  }

  function isSubmenuOpen(index: number) {
    return submenus.value[index].isOpen
  }

  return { isOpen, toggle, initSubmenus, toggleSubmenu, isSubmenuOpen, submenus }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSidebarStore, import.meta.hot))
}
