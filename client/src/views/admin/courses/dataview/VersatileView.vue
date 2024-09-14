<script lang="ts" setup>
import { Versatile } from '@/components/layouts'

import FormCommon from './FormCommon.vue'
import FormCreate from './FormCreate.vue'
import FormUpload from './FormUpload.vue'
</script>

<template>
  <Versatile
    :title="{
      create: 'views.versatile.card.course.create.title',
      update: 'views.versatile.card.course.update.title',
      view: 'views.versatile.card.course.view.title'
    }"
    :description="{
      create: 'views.versatile.card.course.create.description',
      update: 'views.versatile.card.course.update.description',
      view: 'views.versatile.card.course.view.description'
    }"
    fallback="/admin/courses"
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
