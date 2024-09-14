import { type RemovableRef, useStorage } from '@vueuse/core'
import { or, where } from 'firebase/firestore'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

import { Batch, Class, Classroom, Course, Faculty, Schedule, User } from '@/database'
import type { M } from '@/shared/types'

export const useMiscStore = defineStore('misc', () => {
  const preload = ref(true)

  const faculties = useStorage('faculties', ref<M.Faculty.Info[]>([]), localStorage, {
    serializer: {
      read: (v: any) => JSON.parse(v) as M.Faculty.Info[],
      write: (v: any) => JSON.stringify(v)
    }
  }) as RemovableRef<M.Faculty.Info[]>
  const batches = useStorage('batches', ref<M.Batch.Info[]>([]), localStorage, {
    serializer: {
      read: (v: any) => JSON.parse(v) as M.Batch.Info[],
      write: (v: any) => JSON.stringify(v)
    }
  }) as RemovableRef<M.Batch.Info[]>
  const instructors = useStorage('instructors', ref<M.User.Info[]>([]), localStorage, {
    serializer: {
      read: (v: any) => JSON.parse(v) as M.User.Info[],
      write: (v: any) => JSON.stringify(v)
    }
  }) as RemovableRef<M.User.Info<'instructor'>[]>
  const classrooms = useStorage('classrooms', ref<M.Classroom.Info[]>([]), localStorage, {
    serializer: {
      read: (v: any) => JSON.parse(v) as M.Classroom.Info[],
      write: (v: any) => JSON.stringify(v)
    }
  }) as RemovableRef<M.Classroom.Info[]>
  const classes = useStorage('classes', ref<M.Class.Info[]>([]), localStorage, {
    serializer: {
      read: (v: any) => JSON.parse(v) as M.Class.Info[],
      write: (v: any) => JSON.stringify(v)
    }
  }) as RemovableRef<M.Class.Info[]>
  const courses = useStorage('courses', ref<M.Course.Info[]>([]), localStorage, {
    serializer: {
      read: (v: any) => JSON.parse(v) as M.Course.Info[],
      write: (v: any) => JSON.stringify(v)
    }
  }) as RemovableRef<M.Course.Info[]>
  const schedules = useStorage('schedules', ref<M.Schedule.Info[]>([]), localStorage, {
    serializer: {
      read: (v: any) => JSON.parse(v) as M.Schedule.Info[],
      write: (v: any) => JSON.stringify(v)
    }
  }) as RemovableRef<M.Schedule.Info[]>

  const fetchFaculties = async () => {
    const data = await Faculty.readAll().catch(() => {
      throw new Error('Failed to fetch faculties')
    })
    return (faculties.value = data || [])
  }

  const fetchBatches = async () => {
    const data = await Batch.readAll().catch(() => {
      throw new Error('Failed to fetch batches')
    })
    return (batches.value = data || [])
  }

  const fetchInstructors = async () => {
    const data = await User.readByRole('instructor').catch(() => {
      throw new Error('Failed to fetch instructors')
    })
    return (instructors.value = data || [])
  }

  const fetchClassrooms = async () => {
    const data = await Classroom.readAll(
      or(where('state', '==', 'idle'), where('state', '==', 'active')),
      where('name', '!=', '')
    ).catch(() => {
      throw new Error('Failed to fetch classrooms')
    })
    return (classrooms.value = data || [])
  }

  const fetchClasses = async () => {
    const data = await Class.readAll().catch(() => {
      throw new Error('Failed to fetch classes')
    })
    return (classes.value = data || [])
  }

  const fetchCourses = async () => {
    const data = await Course.readAll().catch(() => {
      throw new Error('Failed to fetch courses')
    })
    return (courses.value = data || [])
  }

  const fetchSchedules = async () => {
    const data = await Schedule.readAll().catch(() => {
      throw new Error('Failed to fetch schedules')
    })
    return (schedules.value = data || [])
  }

  const fetchAll = async () => {
    const response = await Promise.allSettled([
      fetchFaculties(),
      fetchBatches(),
      fetchInstructors(),
      fetchClassrooms(),
      fetchClasses(),
      fetchCourses(),
      fetchSchedules()
    ])
    const success = response.filter((res) => res.status === 'fulfilled')
    const errors = response.filter((res) => res.status === 'rejected')
    return { success, errors }
  }

  function setPreload(value: boolean) {
    preload.value = value
  }

  return {
    faculties,
    batches,
    instructors,
    classrooms,
    classes,
    courses,
    schedules,

    fetchFaculties,
    fetchBatches,
    fetchInstructors,
    fetchClassrooms,
    fetchClasses,
    fetchCourses,
    fetchSchedules,
    fetchAll,

    preload,
    setPreload
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMiscStore, import.meta.hot))
}
