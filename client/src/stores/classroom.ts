import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

import type { M } from '@/shared/types'
import { useNanoIDStore } from '@/stores'

export const useClassroomStore = defineStore('classroom', () => {
  const { nanoid } = useNanoIDStore()
  const unsubscribeData: M.Classroom.Info = {
    classroomId: nanoid,
    capacity: 0,
    name: '',
    used: false,
    state: '',
    location: ''
  }
  const classroomData = ref<M.Classroom.Info>(unsubscribeData)

  function setClassRoomData(value: M.Classroom.Info) {
    classroomData.value = value
  }

  return { classroomData, setClassRoomData }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useClassroomStore, import.meta.hot))
}
