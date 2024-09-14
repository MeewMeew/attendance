<script lang="ts" setup>
import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'
import { CalendarIcon } from '@radix-icons/vue'
import { sortBy } from 'lodash-es'
import { onMounted, ref, watchEffect } from 'vue'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Schedule } from '@/database'
import { cn } from '@/lib/utils'
import type { Management } from '@/shared/types'
import { useMiscStore, useUserStore } from '@/stores'

interface DialogFilterClassEmits {
  (event: 'update:filterSchedule', value: string): void
}

const { user } = useUserStore()
const { classes, courses } = useMiscStore()

const emit = defineEmits<DialogFilterClassEmits>()
const dateValue = ref<DateValue>()
const scheduleValue = ref('')

const schedulesInitial = ref<Management.Schedule.Info[]>([])
const schedules = ref<Management.Schedule.Info[]>([])

const df = new DateFormatter('vi-VN', {
  dateStyle: 'long'
})

function toText(schedule: Management.Schedule.Info) {
  const courseName = courses.find((c) => c.courseId === schedule.courseId)
  const className = classes.find((c) => c.classId === schedule.classId)
  return `${courseName?.name} - ${className?.shortName}`
}

onMounted(() => {
  Schedule.readByInstructorId(user.docId).then((ss) => {
    schedulesInitial.value = ss
    schedules.value = sortBy(ss, 'date')
  })
})

watchEffect(() => {
  if (dateValue.value) {
    schedules.value = schedulesInitial.value.filter((s) => {
      const year = dateValue.value?.year
      const month = dateValue.value?.month.toString().padStart(2, '0')
      const day = dateValue.value?.day.toString().padStart(2, '0')
      return `${year}-${month}-${day}` === s.date
    })
  } else {
    schedules.value = schedulesInitial.value
  }

  if (scheduleValue.value) {
    emit('update:filterSchedule', scheduleValue.value)
  }
})
</script>

<template>
  <div class="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
    <div class="w-full">
      <Label>Schedule Time</Label>
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            :class="
              cn(
                'w-full justify-start text-left font-normal',
                !dateValue && 'text-muted-foreground'
              )
            "
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            {{ dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Pick a date' }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar v-model="dateValue" initial-focus />
        </PopoverContent>
      </Popover>
    </div>
    <div>
      <Label>Schedule</Label>
      <Select @update:model-value="(v) => (scheduleValue = v)">
        <SelectTrigger>
          <SelectValue placeholder="Choose one" />
        </SelectTrigger>
        <SelectContent>
          <template v-for="(s, index) in sortBy(schedules, 'date')" :key="index">
            <SelectItem :value="s.scheduleId"> {{ toText(s) }} </SelectItem>
          </template>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
