<script setup lang="ts">
import { Versatile } from '@/components/layouts'

import FormCommon from './FormCommon.vue'
import FormCreate from './FormCreate.vue'
import FormUpload from './FormUpload.vue'
</script>

<template>
  <Versatile
    :title="{
      create: 'views.versatile.card.student.create.title',
      update: 'views.versatile.card.student.update.title',
      view: 'views.versatile.card.student.view.title'
    }"
    :description="{
      create: 'views.versatile.card.student.create.description',
      update: 'views.versatile.card.student.update.description',
      view: 'views.versatile.card.student.view.description'
    }"
    :fallback="'/admin/students'"
  >
    <template #form-create>
      <FormCreate class="w-full" />
    </template>
    <template #form-common="{ method, id }">
      <FormCommon :method="method" :id="id" />
    </template>
    <template #form-upload>
      <FormUpload class="w-full" />
    </template>
  </Versatile>
</template>
