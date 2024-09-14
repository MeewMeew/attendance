<script setup lang="ts">
import { lowerCase } from 'lodash-es'
import { LoaderCircleIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import readExcel from 'read-excel-file'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import AlertUploadDesc from '@/components/common/AlertUploadDesc.vue'
import { Button } from '@/components/ui/button'
import { Upload } from '@/components/ui/upload'
import { Class } from '@/database'
import { startCase } from '@/lib/misc'
import type { U } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { schema } from './schema'

type Schema = U.InferExcelSchema<typeof schema>

const store = useMiscStore()
const { faculties, batches, instructors, classes } = storeToRefs(store)

const loading = ref(false)
const validating = ref(false)
const dataErrors = ref<string[]>([])
const dataRows = ref<Schema[]>([])

const alertItems = ref<string[]>([
  'Tên khoa',
  'Tên khoá',
  'Tên giảng viên',
  'Tên lớp',
  'Tên viết tắt',
  'Số lượng sinh viên'
])
const upload = ref<InstanceType<typeof Upload> | null>(null)

function validate(a: string, b: string) {
  return lowerCase(a) === lowerCase(b)
}

async function onFileChanged(files: File[]) {
  if (!files.length) return
  validating.value = true
  try {
    const { rows, errors } = await readExcel<Schema>(files[0], {
      schema: schema as Schema
    })
    if (errors.length) {
      console.error(errors)
      dataErrors.value = errors.map((e) => `Row ${e.row}: ${e.error}`)
      toast.error('Error while reading excel file')
      return
    }
    dataRows.value = rows
      .map((row) => {
        return {
          ...row,
          name: startCase(row.name),
          facultyId: faculties.value.find((f) => validate(f.name, row.facultyId))?.facultyId || '',
          batchId: batches.value.find((b) => validate(b.name, row.batchId))?.batchId || '',
          instructorId:
            instructors.value.find((c) => validate(c.displayName, row.instructorId))?.docId || ''
        }
      })
      .filter(
        (r) => !classes.value.map((c) => lowerCase(c.name)).includes(lowerCase(r.name))
      ) as any
  } catch {
    toast.error('Error while reading excel file')
  } finally {
    validating.value = false
  }
}
async function onSubmit() {
  loading.value = true
  if (!dataRows.value.length) {
    toast.error('No data to create')
    loading.value = false
    return
  }
  const response = await Promise.allSettled(
    dataRows.value.map(async (row) => {
      return await Class.create(row as any)
    })
  )
  const success = response.filter((r) => r.status === 'fulfilled')
  const failed = response.filter((r) => r.status === 'rejected')
  if (failed.length || success.length) {
    if (success.length) {
      toast.success(`Created ${success.length} classes successfully`)
      await store.fetchClasses()
    } else toast.error('Some classes failed to create')
  }
  upload.value?.reset()
  loading.value = false
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="mx-auto grid w-full max-w-2xl items-center gap-2">
    <AlertUploadDesc :items="alertItems" />
    <Upload ref="upload" @changed="onFileChanged" :errors="dataErrors" accept=".xls, .xlsx" />
    <div class="flex w-full justify-center">
      <Button :type="loading || validating ? 'button' : 'submit'">
        <LoaderCircleIcon v-if="loading" class="h-5 w-5 animate-spin" />
        <span v-else-if="validating">Validating...</span>
        <span v-else>Create</span>
      </Button>
    </div>
  </form>
</template>
