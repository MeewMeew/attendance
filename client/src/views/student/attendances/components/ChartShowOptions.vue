<script lang="ts" setup>
import { sortBy } from 'lodash-es'
import { LoaderCircle, Settings2 } from 'lucide-vue-next'
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DialogWrapper } from '@/components/wrapper'
import { Class, Student, User } from '@/database'
import type { M } from '@/shared/types'

import DialogFilterClass from './DialogFilterClass.vue'

interface ChartShowOptionsEmits {
  (event: 'update:filterStudent', value: M.User.Info<'student'>): void
  (event: 'update:filterClasses', value: M.Class.Info[]): void
}

const emit = defineEmits<ChartShowOptionsEmits>()

const isLoading = ref(false)

const dislogWith = ref('')
const studentId = ref('')
const classIds = ref<string[]>([])

const isError = ref(false)
const errorTitle = ref('')
const errorMessage = ref('')

const isStudent = computed(() => dislogWith.value === 'student')
const isClass = computed(() => dislogWith.value === 'class')

function searchStudentId() {
  if (studentId.value === '') {
    isError.value = true
    errorTitle.value = 'Student ID is required'
    errorMessage.value = 'Please enter a student ID to search'
    return
  }
  isLoading.value = true
  Student.readByStudentId(studentId.value)
    .then((student) => {
      emit('update:filterStudent', student!)
    })
    .catch(() => {
      isError.value = true
      errorTitle.value = 'Student not found'
      errorMessage.value = 'Student ID does not exist'
    })
    .finally(() => {
      isLoading.value = false
    })
}

async function updateFilterClass() {
  isLoading.value = true
  const done = await Promise.all(classIds.value.map((classId) => Class.read(classId)))
  const classes = done.filter((c) => c !== null) as M.Class.Info[]
  isLoading.value = false
  emit('update:filterClasses', sortBy(classes, 'name'))
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

onBeforeUnmount(() => {
  studentId.value = ''
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
              <DialogTrigger @click="dislogWith = 'student'">
                <span>
                  Student
                  <span v-if="isStudent" class="text-xs text-gray-400"> (Current) </span>
                </span>
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem inset>
              <DialogTrigger @click="dislogWith = 'class'">
                <span>
                  Classes
                  <span v-if="isClass" class="text-xs text-gray-400"> (Current) </span>
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
        <div v-if="isStudent" class="flex flex-col">
          <div class="grid grid-cols-4 items-end gap-4">
            <div class="col-span-3">
              <Label> Student ID </Label>
              <Input v-model:model-value="studentId" />
            </div>
            <Button @click="searchStudentId" :disable="isLoading">
              <span v-if="isLoading" class="flex flex-row items-center justify-center space-x-2">
                <LoaderCircle class="h-4 w-4 animate-spin" />
                <span class="ml-2"> Searching </span>
              </span>
              <span v-else> Search </span>
            </Button>
          </div>
        </div>
        <div v-else-if="isClass" class="flex flex-col">
          <DialogFilterClass
            @update:filter-class="(v) => (classIds[0] = v)"
            @update:filter-classes="(v) => (classIds = v)"
          />
          <Separator class="my-4" />
          <Button @click="updateFilterClass()" :disable="isLoading">
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
