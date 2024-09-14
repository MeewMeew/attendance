<script lang="ts" setup>
import { computed, toRefs } from 'vue'

import { CellLoader } from '@/components/common'
import Button from '@/components/ui/button/Button.vue'
import { generatePath } from '@/lib/utils'
import { t } from '@/shared/locales'

interface LayoutProps {
  method: string
  id: string
  isFetching: boolean
  onSubmit: (
    e?: Event | undefined
  ) => Promise<string | number | undefined> | Promise<Promise<string | number | undefined>>
  isSubmitting: boolean
  routeName: string
}

const props = defineProps<LayoutProps>()

const { method, isFetching, isSubmitting } = toRefs(props)

const view = computed(() => method.value === 'view')
</script>

<template>
  <div v-show="isFetching" class="flex h-80 items-center justify-center">
    <CellLoader class="h-16 w-16" />
  </div>
  <form @submit="onSubmit" class="flex-col space-y-2 md:flex" v-show="!isFetching">
    <slot :readonly="view" />
    <div class="col-span-2 mt-4 flex w-full justify-center">
      <Button v-if="view" type="button">
        <RouterLink :to="generatePath('/admin/:routeName/update/:id', { id: id, routeName })">
          {{ t('Change information') }}
        </RouterLink>
      </Button>
      <Button v-else type="submit" :disabled="isSubmitting">{{ t('Save changes') }}</Button>
    </div>
  </form>
</template>
