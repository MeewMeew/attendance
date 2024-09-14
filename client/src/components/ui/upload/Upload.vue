<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { cn } from '@/lib/utils'
import type { I18n } from '@/shared/types'

const props = defineProps<{
  accept: string
  errors: string[]
}>()

const emit = defineEmits<{
  (e: 'changed', files: File[]): void
}>()

const { t } = useI18n<I18n.Schema>()
const dropZoneRef = ref<HTMLDivElement>()
const input = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])

const onDrop = (_files: File[] | null) => {
  emit('changed', (files.value = _files ?? []))
}

const onFileChange = async ($event: Event) => {
  const target = $event.target as HTMLInputElement
  emit('changed', (files.value = Array.from(target.files ?? [])))
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

const open = () => input.value?.click()
const reset = () => {
  files.value = []
  input.value!.value = ''
}

defineExpose({ open, reset })
</script>

<template>
  <div ref="dropZoneRef" class="col-span-full pb-4">
    <div
      :class="
        cn(
          'flex justify-center rounded-lg border border-dashed',
          'border-gray-900/25 px-6 py-20',
          isOverDropZone && 'border-green/25 border-2',
          errors.length > 0 ? 'border-red-600' : 'border-gray-300'
        )
      "
    >
      <div class="text-center">
        <div class="mt-4 flex text-sm leading-6">
          <input
            ref="input"
            type="file"
            :accept="accept"
            multiple
            name="file-upload"
            class="sr-only"
            @change="(e: any) => onFileChange(e)"
          />
          <label
            for="file-upload"
            :class="
              cn(
                'text-primary-400 focus-within:ring-primary-700',
                'hover:text-primary-300 relative cursor-pointer',
                'rounded-md font-semibold focus-within:outline-none',
                'focus-within:ring-2 focus-within:ring-offset-2'
              )
            "
            @click="open()"
          >
            <p class="text-md leading-5">
              <span v-if="files.length">
                {{ t('components.upload.text.selected', { a: files.length }) }}
              </span>
              <span v-else>
                {{
                  accept.length > 0 ? t('components.upload.text.accepted', { a: props.accept }) : ''
                }}
              </span>
            </p>
          </label>
        </div>
      </div>
    </div>
    <p v-if="errors.length > 0" class="w-full text-center text-xs leading-5 text-red-600">
      <span v-for="error in errors" :key="error">
        {{ error }}
        <br />
      </span>
    </p>
  </div>
</template>
