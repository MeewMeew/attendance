<script lang="ts" setup>
import { LoaderCircle, Settings2 } from 'lucide-vue-next'
import { computed, ref, watchEffect } from 'vue'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DialogWrapper } from '@/components/wrapper'
import { Schedule } from '@/database'
import type { Management } from '@/shared/types'

import DialogFilterSchedule from './DialogFilterSchedule.vue'

interface ChartShowOptionsEmits {
  (event: 'update:filterSchedule', value: Management.Schedule.Info): void
}

const emit = defineEmits<ChartShowOptionsEmits>()

const isLoading = ref(false)

const dislogWith = ref('')
const scheduleValue = ref('')

const isError = ref(false)
const errorTitle = ref('')
const errorMessage = ref('')

const isSchedule = computed(() => dislogWith.value === 'schedule')

function applying() {
  isLoading.value = true
  Schedule.read(scheduleValue.value)
    .then((s) => {
      if (s) {
        emit('update:filterSchedule', s)
      } else {
        isError.value = true
        errorTitle.value = 'Failed to apply filter'
        errorMessage.value = 'No schedule found'
      }
    })
    .catch((e) => {
      isError.value = true
      errorTitle.value = 'Failed to apply filter'
      errorMessage.value = e.message
      isLoading.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

watchEffect(() => {
  if (isError.value) {
    setTimeout(() => {
      isError.value = false
      errorTitle.value = ''
      errorMessage.value = ''
    }, 5000)
  }
})
</script>

<template>
  <DialogWrapper>
    <template #dropdown-menu>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="sm">
                  <Settings2 class="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Display Options</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel> Filter with contitions </DropdownMenuLabel>
            <DropdownMenuItem inset>
              <DialogTrigger @click="dislogWith = 'schedule'">
                <span>
                  Schedule
                  <span v-if="isSchedule" class="text-xs text-gray-400"> (Current) </span>
                </span>
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
    <template #dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Filter by {{ dislogWith }} </DialogTitle>
          <DialogDescription> </DialogDescription>
        </DialogHeader>
        <Alert v-if="isError" variant="destructive">
          <AlertTitle> {{ errorTitle }} </AlertTitle>
          <AlertDescription> {{ errorMessage }} </AlertDescription>
        </Alert>
        <div v-if="isSchedule" class="flex flex-col">
          <DialogFilterSchedule @update:filter-schedule="(v) => (scheduleValue = v)" />
          <Separator class="my-4" />
          <Button @click="applying" :disable="isLoading">
            <span v-if="isLoading" class="flex flex-row items-center justify-center space-x-2">
              <LoaderCircle class="h-4 w-4 animate-spin" />
              <span class="ml-2"> Applying </span>
            </span>
            <span v-else> Apply </span>
          </Button>
        </div>
      </DialogContent>
    </template>
  </DialogWrapper>
</template>
