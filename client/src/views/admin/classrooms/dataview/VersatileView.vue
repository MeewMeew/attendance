<script lang="ts" setup>
import { Versatile } from '@/components/layouts'

import FormCommon from './FormCommon.vue'
import FormCreate from './FormCreate.vue'
import FormSync from './FormSync.vue'
import FormUpload from './FormUpload.vue'
</script>

<template>
  <Versatile
    :title="{
      create: 'views.versatile.card.classroom.create.title',
      update: 'views.versatile.card.classroom.update.title',
      view: 'views.versatile.card.classroom.view.title',
      sync: 'views.versatile.card.classroom.sync.title'
    }"
    :description="{
      create: 'views.versatile.card.classroom.create.description',
      update: 'views.versatile.card.classroom.update.description',
      view: 'views.versatile.card.classroom.view.description',
      sync: 'views.versatile.card.classroom.sync.description'
    }"
    fallback="/admin/classrooms"
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
    <template #form-sync="{ id }">
      <FormSync class="w-full" :id="id" />
    </template>
  </Versatile>
</template>
