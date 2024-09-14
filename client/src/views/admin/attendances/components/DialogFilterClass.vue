<script lang="ts" setup>
import { sortBy } from 'lodash-es'
import { ref, watchEffect } from 'vue'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useMiscStore } from '@/stores'
interface DialogFilterClassProps {
  isChart?: boolean
}
interface DialogFilterClassEmits {
  (event: 'update:filterClass', value: string, scheduleId?: string): void
  (event: 'update:filterClasses', value: string[], scheduleId?: string): void
}

defineProps<DialogFilterClassProps>()
const emit = defineEmits<DialogFilterClassEmits>()

const {
  faculties,
  batches,
  classes: classesInitial,
  schedules: schedulesInitial,
  courses
} = useMiscStore()
const classes = ref(classesInitial)
const schedules = ref(schedulesInitial)
const facultyValue = ref('')
const classValue = ref('')
const batchValue = ref('')
const scheduleValue = ref('')
const oneClass = ref(true)

watchEffect(() => {
  function filterClasses() {
    return classesInitial.filter(
      (c) => c.facultyId === facultyValue.value && c.batchId === batchValue.value
    )
  }
  if (facultyValue.value || batchValue.value) {
    classes.value = filterClasses()
    if (!oneClass.value) {
      emit(
        'update:filterClasses',
        classes.value.map((c) => c.classId)
      )
    }
  }
  if (classes.value.length === 1) {
    scheduleValue.value = schedulesInitial.filter(
      (s) => s.classId === classes.value[0].classId
    )[0].scheduleId
  }
  if (scheduleValue.value) {
    emit(
      'update:filterClasses',
      classes.value.filter((c) => c.classId === classValue.value).map((c) => c.classId),
      scheduleValue.value
    )
  }
})
</script>

<template>
  <div
    :class="
      cn('grid h-full w-full grid-cols-1 gap-4', isChart ? 'lg:grid-cols-3' : 'md:grid-cols-2')
    "
  >
    <div>
      <Label>Faculty name</Label>
      <Select @update:model-value="(v) => (facultyValue = v)">
        <SelectTrigger>
          <SelectValue placeholder="Choose one" />
        </SelectTrigger>
        <SelectContent>
          <template v-for="(f, index) in sortBy(faculties, 'name')" :key="index">
            <SelectItem :value="f.facultyId">{{ f.name }}</SelectItem>
          </template>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Batch name</Label>
      <Select @update:model-value="(v) => (batchValue = v)">
        <SelectTrigger>
          <SelectValue placeholder="Choose one" />
        </SelectTrigger>
        <SelectContent>
          <template v-for="(b, index) in sortBy(batches, 'name')" :key="index">
            <SelectItem :value="b.batchId">{{ b.name }}</SelectItem>
          </template>
        </SelectContent>
      </Select>
    </div>
    <div class="items-top flex gap-x-2 md:items-center" v-if="isChart">
      <Checkbox id="one" v-model:checked="oneClass" />
      <div class="grid gap-1.5 leading-none">
        <label
          for="one"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Select one class
        </label>
      </div>
    </div>
    <div v-if="oneClass" :class="cn(isChart ? 'col-span-3' : 'col-span-1')">
      <Label>Class name</Label>
      <Select
        @update:model-value="
          (v) => {
            classValue = v
            $emit('update:filterClass', v, scheduleValue)
          }
        "
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose one" />
        </SelectTrigger>
        <SelectContent>
          <template v-for="(c, index) in sortBy(classes, 'name')" :key="index">
            <SelectItem :value="c.classId">{{ c.name }}</SelectItem>
          </template>
        </SelectContent>
      </Select>
    </div>
    <div v-if="oneClass && !isChart">
      <Label>Schedule</Label>
      <Select
        @update:model-value="
          (v) => {
            scheduleValue = v
            $emit('update:filterClass', classValue, v)
          }
        "
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose one" />
        </SelectTrigger>
        <SelectContent>
          <template v-for="(s, index) in sortBy(schedules, 'date').reverse()" :key="index">
            <SelectItem :value="s.scheduleId">
              {{ courses.find((c) => c.courseId === s.courseId)?.name }} ({{ s.date }})
            </SelectItem>
          </template>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
