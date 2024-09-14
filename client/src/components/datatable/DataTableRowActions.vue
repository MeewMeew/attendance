<script setup lang="ts">
import { DotsHorizontalIcon } from '@radix-icons/vue'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { t } from '@/shared/locales'
import type { Other } from '@/shared/types'

const clicked = ref(false)
const open = ref(false)

const props = defineProps<Other.DataTable.RowAction.Props>()
defineEmits<Other.DataTable.RowAction.Emits>()

function removeDoc() {
  return (
    props
      .remove(props.id)
      // @ts-ignore
      .then(() => toast.success(t('utils.form.delete.success', { a: props.name })))
      .catch(() => toast.error(t('utils.form.delete.error', { a: props.name })))
      .finally(() => (clicked.value = false) && (open.value = false))
  )
}

function onDeletePress() {
  document.getElementById(props.id)?.click()
}
</script>

<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon class="h-4 w-4" />
          <span class="sr-only">{{ t('Open menu') }}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-auto">
        <DropdownMenuItem class="cursor-pointer" as-child>
          <RouterLink v-if="actions.update" :to="actions.update.to">
            {{ t(actions.update.label) }}
          </RouterLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="cursor-pointer" as-child>
          <RouterLink v-if="actions.view" :to="actions.view.to">
            {{ t(actions.view.label) }}
          </RouterLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator v-if="actions.sync" />
        <DropdownMenuItem class="cursor-pointer" as-child>
          <RouterLink v-if="actions.sync" :to="actions.sync.to">
            {{ t(actions.sync.label) }}
          </RouterLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator v-if="actions.delete" />
        <DropdownMenuItem v-if="actions.delete" class="cursor-pointer" @click="onDeletePress">
          {{ t('components.button.delete') }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog>
      <AlertDialogTrigger as-child>
        <button class="hidden" :id="id" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{ t('components.alert.delete.title') }}</AlertDialogTitle>
          <AlertDialogDescription>
            {{ t('components.alert.delete.description') }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {{ t('components.button.cancel') }}
          </AlertDialogCancel>
          <AlertDialogAction as-child>
            <Button variant="destructive" @click="removeDoc" :disabled="clicked">
              {{ t('components.button.delete') }}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
