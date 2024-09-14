<script lang="ts" setup>
import { Clock } from 'lucide-vue-next'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface TimeFieldProps {
  label: string
  value: string
  name: string
}
interface TimeFieldEmits {
  (event: 'update:modelValue', value?: any): void
}

defineProps<TimeFieldProps>()
defineEmits<TimeFieldEmits>()

function toTime(i: number, j: number) {
  return `${(i - 1).toString().padStart(2, '0')}:${((j - 1) * 15).toString().padStart(2, '0')}`
}
</script>

<template>
  <FormField :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <Popover>
        <PopoverTrigger as-child>
          <FormControl>
            <div class="relative w-full items-center">
              <Input @click="null" readonly :model-value="value" />
              <span class="absolute inset-y-0 end-0 flex items-center justify-center px-2">
                <Clock class="size-5 text-muted-foreground" />
              </span>
            </div>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent as-child>
          <ScrollArea class="h-60 w-32 rounded-md border">
            <template v-for="i in 24" :key="i">
              <template v-for="j in 4" :key="j">
                <div
                  class="cursor-pointer py-1.5 text-sm"
                  @click="$emit('update:modelValue', toTime(i, j))"
                >
                  {{ toTime(i, j) }}
                </div>
                <Separator />
              </template>
            </template>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
