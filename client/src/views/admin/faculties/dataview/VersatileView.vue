<script setup lang="ts">
import { Versatile } from '@/components/layouts'

import FormCommon from './FormCommon.vue'
import FormCreate from './FormCreate.vue'
import FormUpload from './FormUpload.vue'
</script>

<template>
  <Versatile
    :title="{
      create: 'views.versatile.card.faculty.create.title',
      update: 'views.versatile.card.faculty.update.title',
      view: 'views.versatile.card.faculty.view.title'
    }"
    :description="{
      create: 'views.versatile.card.faculty.create.description',
      update: 'views.versatile.card.faculty.update.description',
      view: 'views.versatile.card.faculty.view.description'
    }"
    fallback="/admin/classes"
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
