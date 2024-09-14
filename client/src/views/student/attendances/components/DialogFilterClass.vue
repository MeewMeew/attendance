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
import { useMiscStore } from '@/stores'

interface DialogFilterClassEmits {
  (event: 'update:filterClass', value: string): void
  (event: 'update:filterClasses', value: string[]): void
}

const emit = defineEmits<DialogFilterClassEmits>()

const { faculties, batches, classes: classesInitial } = useMiscStore()
const classes = ref(classesInitial)
const facultyValue = ref('')
const batchValue = ref('')
const oneClass = ref(false)

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
})
</script>

<template>
  <div class="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-3">
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
    <div class="items-top flex gap-x-2">
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
    <div v-if="oneClass">
      <Label>Class name</Label>
      <Select @update:model-value="(v) => $emit('update:filterClass', v)">
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
  </div>
</template>
