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
import { Attendance, Class, Schedule, Student, User } from '@/database'
import type { M } from '@/shared/types'

import DialogFilterClass from './DialogFilterClass.vue'
import DialogFilterStudent from './DialogFilterStudent.vue'

interface ChartShowOptionsProps {
  hideIcon?: boolean
  content?: string
  isChart?: boolean
}

interface ChartShowOptionsEmits {
  (event: 'update:filterStudent', value: M.User.Info<'student'>): void
  (
    event: 'update:filterStudentWithAttendance',
    value: M.User.Info<'student'>,
    schedule: M.Schedule.Info,
    attendance: M.Attendance.WithClass
  ): void
  (event: 'update:filterClasses', value: M.Class.Info[], scheduleId?: string): void
}

const props = defineProps<ChartShowOptionsProps>()
const emit = defineEmits<ChartShowOptionsEmits>()

const isLoading = ref(false)

const dislogWith = ref('')
const studentId = ref('')
const scheduleId = ref('')
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
  if (scheduleId.value === '' && !props.isChart) {
    isError.value = true
    errorTitle.value = 'Schedule ID is required'
    errorMessage.value = 'Please enter a schedule ID to search'
    return
  }
  isLoading.value = true
  if (!props.isChart) {
    Schedule.read(scheduleId.value)
      .then((schedule) => {
        if (schedule === null) {
          isError.value = true
          errorTitle.value = 'Schedule not found'
          errorMessage.value = 'Schedule ID does not exist'
          return
        }
        Attendance.readBySchedule(schedule.scheduleId)
          .then((attendance) => {
            if (attendance === null) {
              isError.value = true
              errorTitle.value = 'Attendance not found'
              errorMessage.value = 'Attendance for this schedule does not exist'
              return
            }
            User.readByStudentId(studentId.value)
              .then((student) => {
                if (student === null) {
                  isError.value = true
                  errorTitle.value = 'Student not found'
                  errorMessage.value = 'Student ID does not exist'
                  return
                }
                let sa = attendance.attendances.find((a) => a.studentId === student.docId)
                if (!sa) {
                  sa = {} as M.Attendance.WithStudent
                  sa.status = 'absent'
                  sa.time = ''
                  sa.note = ''
                  sa.studentId = student.docId
                  sa.attendanceId = ''
                  sa.scheduleId = schedule.scheduleId
                  sa.sessionId = attendance.sessionId
                }
                const cloneAttendance = { ...attendance, attendances: [sa] }
                emit('update:filterStudentWithAttendance', student, schedule, cloneAttendance)
              })
              .catch(() => {
                isError.value = true
                errorTitle.value = 'Student not found'
                errorMessage.value = 'Student ID does not exist'
              })
              .finally(() => {
                isLoading.value = false
              })
          })
          .catch(() => {
            isError.value = true
            errorTitle.value = 'Attendance not found'
            errorMessage.value = 'Attendance for this schedule does not exist'
          })
          .finally(() => {
            isLoading.value = false
          })
      })
      .catch(() => {
        isError.value = true
        errorTitle.value = 'Schedule not found'
        errorMessage.value = 'Schedule ID does not exist'
      })
      .finally(() => {
        isLoading.value = false
      })
  } else {
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
}

async function updateFilterClass() {
  isLoading.value = true
  const done = await Promise.all(classIds.value.map((classId) => Class.read(classId)))
  const classes = done.filter((c) => c !== null) as M.Class.Info[]
  isLoading.value = false
  emit('update:filterClasses', sortBy(classes, 'name'), scheduleId.value)
}

watchEffect(() => {
  if (isError.value) {
    setTimeout(() => {
      isError.value = false
      errorTitle.value = ''
      errorMessage.value = ''
    }, 8000)
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
                <Button :variant="hideIcon ? 'outline' : 'ghost'" size="sm" class="ml-2">
                  <span v-if="hideIcon"> {{ content }} </span>
                  <Settings2 class="size-5" v-else />
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
        <div v-if="isStudent" class="grid-col grid gap-4">
          <div v-if="isChart" class="flex flex-col space-y-2">
            <Label> Student ID </Label>
            <Input v-model:model-value="studentId" />
          </div>
          <DialogFilterStudent
            v-else
            @update:filter-student="
              (v, v1) => {
                studentId = v
                scheduleId = v1
              }
            "
          />
          <Button @click="searchStudentId" :disable="isLoading">
            <span v-if="isLoading" class="flex flex-row items-center justify-center space-x-2">
              <LoaderCircle class="h-4 w-4 animate-spin" />
              <span class="ml-2"> Searching </span>
            </span>
            <span v-else> Search </span>
          </Button>
        </div>
        <div v-else-if="isClass" class="flex flex-col">
          <DialogFilterClass
            :is-chart="isChart"
            @update:filter-class="
              (v, v1) => {
                scheduleId = v1!
                classIds[0] = v
              }
            "
            @update:filter-classes="
              (v, v1) => {
                scheduleId = v1!
                classIds = v
              }
            "
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
