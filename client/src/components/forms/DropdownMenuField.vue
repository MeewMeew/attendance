<script lang="ts" setup>
import { whenever } from '@vueuse/core'
import { sortBy } from 'lodash-es'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { computed, ref, toRef } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { t } from '@/shared/locales'

type DropdownMenuFieldProps = {
  name: string
  value: unknown
  array: any[]
  keyValue: string
  keyLabel: string
  readonly?: boolean
}

type DropdownMenuFieldEmits = {
  (event: 'update:modelValue', value?: any): void
}

type DropdownMenuFieldExpose = {
  reset: () => void
}

const props = defineProps<DropdownMenuFieldProps>()
const emit = defineEmits<DropdownMenuFieldEmits>()
defineExpose<DropdownMenuFieldExpose>({
  reset: () => {
    emit('update:modelValue', '')
  }
})

const open = ref(false)
const value = toRef(props, 'value')

const label = computed(() => {
  return props.array.find((a) => a[props.keyValue] == value.value)?.[props.keyLabel]
})
whenever(value, (v) => {
  if (!props.array.find((a) => a[props.keyValue] == v)) {
    emit('update:modelValue', '')
  }
})
</script>

<template>
  <FormField :name="name">
    <FormItem>
      <FormLabel>
        <slot name="label" />
      </FormLabel>
      <FormControl v-if="readonly">
        <Input :value="label" readonly />
      </FormControl>
      <Popover v-model:open="open" v-else>
        <PopoverTrigger as-child>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              :class="cn('w-full justify-between', !value && 'text-muted-foreground')"
              :disable="readonly"
            >
              <span v-if="value" class="truncate">{{ label }}</span>
              <span v-else>{{ t('components.button.select_popover') }}</span>
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent class="max-h-56 w-full p-0">
          <Command>
            <CommandInput placeholder="Search data..." />
            <CommandEmpty>{{ t('No data found.') }}</CommandEmpty>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  v-for="a in sortBy(array, keyLabel)"
                  :key="a[keyValue]"
                  :value="a[keyValue]"
                  @select="
                    () => {
                      $emit('update:modelValue', a[keyValue])
                      open = false
                    }
                  "
                >
                  <Check
                    :class="cn('mr-2 h-4 w-4', value === a[keyValue] ? 'opacity-100' : 'opacity-0')"
                  />
                  {{ t(a[keyLabel]) }}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
