<script setup lang="ts">
import { Versatile } from '@/components/layouts'

import FormCommon from './FormCommon.vue'
import FormCreate from './FormCreate.vue'
import ProcessUpload from './FormUpload.vue'
</script>

<template>
  <Versatile
    :title="{
      create: 'views.versatile.card.class.create.title',
      update: 'views.versatile.card.class.update.title',
      view: 'views.versatile.card.class.view.title'
    }"
    :description="{
      create: 'views.versatile.card.class.create.description',
      update: 'views.versatile.card.class.update.description',
      view: 'views.versatile.card.class.view.description'
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
      <ProcessUpload class="w-full" />
    </template>
  </Versatile>
</template>

<style scoped lang="css"></style>
