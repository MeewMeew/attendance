<script lang="ts" setup>
import { Versatile } from '@/components/layouts'

import FormCommon from './FormCommon.vue'
import FormCreate from './FormCreate.vue'
import FormUpload from './FormUpload.vue'
</script>

<template>
  <Versatile
    :title="{
      create: 'views.versatile.card.schedule.view.title',
      update: 'views.versatile.card.schedule.view.title',
      view: 'views.versatile.card.schedule.view.title'
    }"
    :description="{
      create: 'views.versatile.card.schedule.view.description',
      update: 'views.versatile.card.schedule.view.description',
      view: 'views.versatile.card.schedule.view.description'
    }"
    fallback="/instructor/schedules"
  >
    <template #form-common="{ method, id }">
      <FormCommon :method="method" :id="id" />
    </template>
    <template #form-create>
      <FormCreate class="w-full" />
    </template>
    <template #form-upload>
      <FormUpload class="w-full" />
    </template>
  </Versatile>
</template>
