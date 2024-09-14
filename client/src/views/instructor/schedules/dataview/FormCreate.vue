<script lang="ts" setup>
import {
  CalendarDate,
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  today
} from '@internationalized/date'
import { CalendarIcon } from '@radix-icons/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { toDate } from 'radix-vue/date'
import { useForm } from 'vee-validate'
import { ref, watchEffect } from 'vue'
import { toast } from 'vue-sonner'

import { DropdownMenuField, TimeField } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Attendance, Schedule, Student } from '@/database'
import { cn } from '@/lib/utils'
import { t } from '@/shared/locales'
import type { M } from '@/shared/types'
import { useMiscStore, useUserStore } from '@/stores'

import { schemaCreate } from './common'
const { user } = useUserStore()
const { faculties, batches, classes: classesInitial, classrooms, courses } = useMiscStore()

const df = new DateFormatter('vi-VN', {
  dateStyle: 'long'
})

const classes = ref(classesInitial)

const dateValue = ref<DateValue>()
const datePlaceholder = ref()
const todayDate = today('Asia/Ho_Chi_Minh')

const startTime = ref('00:00')
const endTime = ref('00:00')

const facultyValue = ref('')
const batchValue = ref('')
const classValue = ref('')
const classroomValue = ref('')
const courseValue = ref('')
const instructorValue = ref('')

const isSubmitting = ref(false)

const formSchema = toTypedSchema(schemaCreate)
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    startTime: '00:00',
    endTime: '00:00'
  }
})

const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true
  const data = { ...values, instructorId: user.docId } as M.Schedule.Info
  Schedule.create(data)
    .then((scheduleId) => {
      toast.success(t('utils.form.create.success', { a: 'schedule' }))
      form.resetForm()
      facultyValue.value = ''
      batchValue.value = ''
      classValue.value = ''
      classroomValue.value = ''
      courseValue.value = ''
      instructorValue.value = ''
      return scheduleId
    })
    .then(async (scheduleId) => {
      const count = await Student.getCountBy('classId', data.classId)
      await Attendance.init(scheduleId, count)
    })
    .catch((error) => {
      toast.error(t('utils.form.create.error', { a: 'schedule' }))
      console.error(error)
    })
    .finally(() => {
      isSubmitting.value = false
    })
})

watchEffect(() => {
  function filterClasses() {
    return classesInitial
      .filter((c) => c.facultyId === facultyValue.value)
      .filter((c) => c.batchId === batchValue.value)
  }
  if (facultyValue.value || batchValue.value) {
    classes.value = filterClasses()
  }
  if (!classes.value.some((e) => e.classId === classValue.value) && classValue.value) {
    form.setFieldValue('classId', '')
  }
})
</script>

<template>
  <form @submit="onSubmit" class="w-full flex-col space-y-2 md:flex">
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-3/5">
        <FormField v-slot="{ field, value }" name="date">
          <FormItem>
            <FormLabel>Date of schedule</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <FormControl>
                  <Button
                    variant="outline"
                    :class="
                      cn(
                        'w-full justify-start text-left font-normal',
                        !value && 'text-muted-foreground'
                      )
                    "
                  >
                    <CalendarIcon class="mr-2 h-5 w-5 opacity-50" />
                    <span v-if="value">
                      {{ df.format(toDate(dateValue!, getLocalTimeZone())) }}
                    </span>
                    <span v-else>
                      {{ 'Pick a date' }}
                    </span>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent class="p-0">
                <Calendar
                  v-model:placeholder="datePlaceholder"
                  v-model="dateValue"
                  calendar-label="Date of schedule"
                  initial-focus
                  :min-value="new CalendarDate(todayDate.year, todayDate.month, todayDate.day)"
                  @update:model-value="
                    (v) => {
                      if (v) {
                        dateValue = v
                        form.setFieldValue('date', dateValue.toString())
                      } else {
                        form.setFieldValue('date', (dateValue = undefined))
                      }
                    }
                  "
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
          <input type="hidden" v-bind="field" />
        </FormField>
      </div>
      <div class="w-full md:w-1/5">
        <TimeField
          label="Start Time"
          :value="startTime"
          name="startTime"
          @update:model-value="
            (v) => {
              startTime = v
              form.setFieldValue('startTime', v)
            }
          "
        />
      </div>
      <div class="w-full md:w-1/5">
        <TimeField
          label="End Time"
          :value="endTime"
          name="endTime"
          @update:model-value="
            (v) => {
              endTime = v
              form.setFieldValue('endTime', v)
            }
          "
        />
      </div>
    </div>
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-1/4">
        <DropdownMenuField
          name="facultyId"
          :array="faculties"
          keyValue="facultyId"
          keyLabel="name"
          :value="facultyValue"
          @update:model-value="
            (v: string) => {
              facultyValue = v
              form.setFieldValue('facultyId', v)
            }
          "
        >
          <template #label> Faculty name </template>
        </DropdownMenuField>
      </div>
      <div class="w-full md:w-1/4">
        <DropdownMenuField
          name="batchId"
          :array="batches"
          keyValue="batchId"
          keyLabel="name"
          :value="batchValue"
          @update:model-value="
            (v: string) => {
              batchValue = v
              form.setFieldValue('batchId', v)
            }
          "
        >
          <template #label> Batch name </template>
        </DropdownMenuField>
      </div>
      <div class="w-full md:w-1/4">
        <DropdownMenuField
          name="classId"
          :array="classes"
          keyValue="classId"
          keyLabel="name"
          :value="classValue"
          @update:model-value="
            (v: string) => {
              classValue = v
              form.setFieldValue('classId', v)
            }
          "
        >
          <template #label> Class name </template>
        </DropdownMenuField>
      </div>
      <div class="w-full md:w-1/4">
        <FormField v-slot="{ field }" name="method">
          <FormItem>
            <FormLabel>Method</FormLabel>
            <Select v-bind="field">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="theory">Lý thuyết</SelectItem>
                  <SelectItem value="practice">Thực hành</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div :class="cn('w-full', 'md:w-1/3')">
        <DropdownMenuField
          name="courseId"
          :array="courses"
          keyValue="courseId"
          keyLabel="name"
          :value="courseValue"
          @update:model-value="
            (v: string) => {
              courseValue = v
              form.setFieldValue('courseId', v)
            }
          "
        >
          <template #label> Course name </template>
        </DropdownMenuField>
      </div>
      <div :class="cn('w-full', 'md:w-1/3')">
        <DropdownMenuField
          name="classroomId"
          :array="classrooms"
          keyValue="classroomId"
          keyLabel="name"
          :value="classroomValue"
          @update:model-value="
            (v: string) => {
              classroomValue = v
              form.setFieldValue('classroomId', v)
            }
          "
        >
          <template #label> Classroom name </template>
        </DropdownMenuField>
      </div>
    </div>
    <div class="flex w-full justify-center pt-4">
      <Button type="submit" :disabled="isSubmitting">Create schedule</Button>
    </div>
  </form>
</template>
