<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import FormsLayout from '@/components/layouts/form/FormsLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { t } from '@/shared/locales/index'
import type { Utils } from '@/shared/types'

type Type = {
  create: string
  update: string
  view: string
  sync?: string
}

interface VersatileProps {
  title: Type
  description: Type
  fallback: string
  disallowMultiple?: boolean
}

type FormCommonMethod = Extract<Utils.Views.Method, 'update' | 'view'>

const props = defineProps<VersatileProps>()

const route = useRoute()
const router = useRouter()

const method = computed(() => route.params.method as Utils.Views.Method)
const formCommonMethod = computed(() => method.value as FormCommonMethod)
const id = computed(() => route.params.id as string)

const isSync = computed(() => method.value === 'sync')
const isCreate = computed(() => method.value === 'create')
const isUpdate = computed(() => method.value === 'update')
const isView = computed(() => method.value === 'view')

const viewTitle = computed(() => {
  if (isSync.value && props.title.sync) return t(props.title.sync)
  if (isCreate.value) return t(props.title.create)
  if (isUpdate.value) return t(props.title.update)
  return t(props.title.view)
})

const viewDescription = computed(() => {
  if (isSync.value && props.description.sync) return t(props.description.sync)
  if (isCreate.value) return t(props.description.create)
  if (isUpdate.value) return t(props.description.update)
  return t(props.description.view)
})

const items = ref([
  { label: t('views.versatile.create.manual'), value: 'manual', active: true },
  { label: t('views.versatile.create.upload'), value: 'import', active: false }
])

onMounted(async () => {
  useHead({ title: viewTitle.value })
  if (!isSync.value && !isCreate.value && !isUpdate.value && !isView.value) {
    await router.replace(props.fallback)
  }
})
</script>

<template>
  <ScrollArea>
    <Card class="min-w-68 overflow-hidden">
      <CardHeader class="lg:-mb-5">
        <CardTitle>{{ viewTitle }}</CardTitle>
        <CardDescription>{{ viewDescription }}</CardDescription>
      </CardHeader>
      <CardContent>
        <template v-if="isCreate">
          <slot name="form-create" v-if="disallowMultiple" />
          <FormsLayout :items="items" v-slot="{ item }" v-else>
            <template v-if="item === 'manual'">
              <slot name="form-create" />
            </template>
            <template v-else-if="item === 'import'">
              <slot name="form-upload" />
            </template>
          </FormsLayout>
        </template>
        <div v-else-if="isSync" class="items-center justify-center md:flex">
          <slot name="form-sync" :id="id" />
        </div>
        <div v-else class="items-center justify-center md:flex">
          <slot name="form-common" :method="formCommonMethod" :id="id" />
        </div>
      </CardContent>
    </Card>
  </ScrollArea>
</template>
