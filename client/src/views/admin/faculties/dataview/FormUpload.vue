<script setup lang="ts">
import { lowerCase } from 'lodash-es'
import { LoaderCircleIcon } from 'lucide-vue-next'
import { CircleAlert } from 'lucide-vue-next'
import readExcel from 'read-excel-file'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Upload } from '@/components/ui/upload'
import { Faculty } from '@/database'
import { startCase, toShortName } from '@/lib/misc'
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
    if (errors.length) {
      console.error(errors)
      dataErrors.value = errors.map((e) => `Row ${e.row}: ${e.error}`)
      toast.error('Error while reading excel file')
      return
    }
    dataRows.value = rows
  } catch {
    toast.error('Error while reading excel file')
  } finally {
    validating.value = false
  }
}
async function onSubmit() {
  loading.value = true
  const faculties = (await Faculty.readAll()).map((faculty) => lowerCase(faculty.name))
  const response = await Promise.allSettled(
    dataRows.value.map(async (row) => {
      if (faculties.includes(lowerCase(row['Tên khoa']))) {
        toast.error(`Faculty ${row['Tên khoa']} already exists`)
        return Promise.reject()
      }
      return await Faculty.create({
        name: startCase(row['Tên khoa']),
        shortName: toShortName(row['Tên khoa'])
      })
    })
  )
  const success = response.filter((r) => r.status === 'fulfilled')
  const failed = response.filter((r) => r.status === 'rejected')
  if (failed.length || success.length) {
    if (success.length) {
      toast.success(`Created ${success.length} classrooms successfully`)
      await store.fetchClassrooms()
    } else toast.error('Some classrooms failed to create')
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="mx-auto grid w-full max-w-2xl items-center gap-2">
    <Alert>
      <CircleAlert class="h-4 w-4 text-blue-500" />
      <AlertTitle>File format</AlertTitle>
      <AlertDescription>
        <p>
          The file should have the following columns: <strong>Tên khoa</strong> |
          <strong>Mã khoa</strong>
        </p>
      </AlertDescription>
    </Alert>
    <Upload ref="upload" @changed="onFileChanged" :errors="dataErrors" accept=".xls, .xlsx" />
    <div class="flex w-full justify-center">
      <Button :type="loading || validating ? 'button' : 'submit'">
        <LoaderCircleIcon v-if="loading" class="h-5 w-5 animate-spin" />
        <span v-else-if="validating">Validating...</span>
        <span v-else>Create faculties</span>
      </Button>
    </div>
  </form>
</template>
