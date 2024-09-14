<script setup lang="ts">
import { Versatile } from '@/components/layouts'

import FormCommon from './FormCommon.vue'
import FormCreate from './FormCreate.vue'
import FormUpload from './FormUpload.vue'
</script>

<template>
  <Versatile
    :title="{
      create: 'views.versatile.card.instructor.create.title',
      update: 'views.versatile.card.instructor.update.title',
      view: 'views.versatile.card.instructor.view.title'
    }"
    :description="{
      create: 'views.versatile.card.instructor.create.description',
      update: 'views.versatile.card.instructor.update.description',
      view: 'views.versatile.card.instructor.view.description'
    }"
    fallback="/admin/instructors"
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

<style scoped lang="css"></style>
