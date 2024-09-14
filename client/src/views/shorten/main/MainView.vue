<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Shorten } from '@/database'
import { generatePath } from '@/lib/utils'

const route = useRoute()
const router = useRouter()

const id = route.params.id as string

onMounted(() => {
  Shorten.read(id)
    .then((data) => {
      if (data) {
        if (data.type === 'attendance') {
          return router.replace(generatePath('/student?next=:id', { id }))
        }
        if (data.type === 'room-sync') {
          return router.replace(generatePath('/admin/classrooms/sync/:id', { id }))
        }
      }
      return router.replace('/404')
    })
    .catch(() => {
      return router.replace('/404')
    })
})
</script>

<template>
  <div></div>
</template>
