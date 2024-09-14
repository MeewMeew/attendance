<script lang="ts" setup>
import { sortBy } from 'lodash-es'
import { ref, watchEffect } from 'vue'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useMiscStore } from '@/stores'
interface DialogFilterClassProps {
  isChart?: boolean
}
interface DialogFilterClassEmits {
  (event: 'update:filterStudent', studentId: string, scheduleId: string): void
}

defineProps<DialogFilterClassProps>()
const emit = defineEmits<DialogFilterClassEmits>()

const { schedules, courses } = useMiscStore()
const scheduleValue = ref('')
const studentValue = ref('')

watchEffect(() => {
  if (scheduleValue.value && studentValue.value) {
    emit('update:filterStudent', studentValue.value, scheduleValue.value)
  }
})
</script>

<template>
  <div class="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-4">
    <div class="col-span-4 md:col-span-3">
      <Label>Schedule name</Label>
      <Select @update:model-value="(v) => (scheduleValue = v)">
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
    <div class="col-span-4 md:col-span-1">
      <Label> Student ID </Label>
      <Input v-model:model-value="studentValue" />
    </div>
  </div>
</template>
