<script setup lang="ts">
import { Versatile } from '@/components/layouts'

import FormCommon from './FormCommon.vue'
import FormCreate from './FormCreate.vue'
import FormUpload from './FormUpload.vue'
</script>

<template>
  <Versatile
    :title="{
      create: 'views.versatile.card.batch.create.title',
      update: 'views.versatile.card.batch.update.title',
      view: 'views.versatile.card.batch.view.title'
    }"
    :description="{
      create: 'views.versatile.card.batch.create.description',
      update: 'views.versatile.card.batch.update.description',
      view: 'views.versatile.card.batch.view.description'
    }"
    fallback="/admin/batches"
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
