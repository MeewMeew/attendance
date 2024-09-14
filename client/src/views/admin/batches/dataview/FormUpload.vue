<script setup lang="ts">
import { LoaderCircleIcon } from 'lucide-vue-next'
import readExcel from 'read-excel-file'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Upload } from '@/components/ui/upload'
import { Batch } from '@/database'
import type { U } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { schema } from './schema'

type Schema = U.InferExcelSchema<typeof schema>

const store = useMiscStore()

const loading = ref(false)
const validating = ref(false)
const dataErrors = ref<string[]>([])
const dataRows = ref<Schema[]>([])

const upload = ref<InstanceType<typeof Upload> | null>(null)
async function onFileChanged(files: File[]) {
  if (!files.length) return
  validating.value = true
  try {
    const { rows, errors } = await readExcel<Schema>(files[0], {
      schema: schema as Schema
    })
    console.table(rows)
    console.table(errors)
    if (errors.length) {
      console.error(errors)
      dataErrors.value = errors.map((e) => `At ${e.row}:${e.column} get error: ${e.error}`)
      toast.error('Error while reading excel file')
      return
    }
    dataRows.value = rows
  } catch (e) {
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
      return await Batch.create(row as any)
    })
  )
  const success = response.filter((r) => r.status === 'fulfilled')
  const failed = response.filter((r) => r.status === 'rejected')
  if (failed.length || success.length) {
    if (success.length) {
      toast.success(`Created ${success.length} batches successfully`)
      await store.fetchBatches()
    } else toast.error('Some batches failed to create')
  }
  upload.value?.reset()
  loading.value = false
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="mx-auto grid w-full max-w-2xl items-center gap-2">
    <Alert>
      <AlertTitle>Create instructors</AlertTitle>
      <AlertDescription>
        Upload an excel file to create batches. The file should contain the following columns:
        <ul class="list-inside list-disc font-medium">
          <li>Tên khoa</li>
          <li>Tên viết tắt</li>
          <li>Năm bắt đầu</li>
          <li>Năm kết thúc</li>
        </ul>
      </AlertDescription>
    </Alert>
    <Upload ref="upload" @changed="onFileChanged" :errors="dataErrors" accept=".xls, .xlsx" />
    <div class="flex w-full justify-center">
      <Button :type="loading || validating ? 'button' : 'submit'">
        <LoaderCircleIcon v-if="loading" class="h-5 w-5 animate-spin" />
        <span v-else-if="validating">Validating...</span>
        <span v-else>Create batches</span>
      </Button>
    </div>
  </form>
</template>
