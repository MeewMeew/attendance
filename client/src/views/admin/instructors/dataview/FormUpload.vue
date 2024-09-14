<script setup lang="ts">
import { lowerCase } from 'lodash-es'
import { LoaderCircleIcon } from 'lucide-vue-next'
import readExcel from 'read-excel-file'
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

import { AlertUploadDesc } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Upload } from '@/components/ui/upload'
import { Faculty } from '@/database'
import { Axios } from '@/lib/axios'
import type { M, U } from '@/shared/types'

import { schema } from './schema'

type Schema = U.InferExcelSchema<typeof schema>

const loading = ref(false)
const validating = ref(false)
const faculties = ref<M.Faculty.Info[]>([])
const dataErrors = ref<string[]>([])
const dataRows = ref<Schema[]>([])
const alertItems = ref([
  'Mã giảng viên',
  'Họ tên',
  'Email',
  'Số điện thoại',
  'Mật khẩu',
  'Khoa (Tên khoa)'
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
    dataRows.value = rows.map((row) => {
      return {
        ...row,
        facultyId: faculties.value.find((f) => validate(f.name, row.facultyId))?.facultyId || '',
        role: 'instructor'
      }
    }) as any
  } catch {
    toast.error('Error while reading excel file')
  } finally {
    validating.value = false
  }
}
async function onSubmit() {
  loading.value = true
  try {
    if (!dataRows.value.length) {
      toast.error('No data to upload')
      return (loading.value = false)
    }
    await Axios.post('/instructor', { users: dataRows.value })
    toast.success('Instructors created successfully')
  } catch (error) {
    console.error(error)
    toast.error('Error while creating instructors')
  } finally {
    upload.value?.reset()
    loading.value = false
  }
}

onMounted(async () => {
  await Faculty.readAll().then((data) => (faculties.value = data))
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="mx-auto grid w-full max-w-2xl items-center gap-2">
    <AlertUploadDesc :items="alertItems" />
    <Upload ref="upload" @changed="onFileChanged" :errors="dataErrors" accept=".xls, .xlsx" />
    <div class="flex w-full justify-center">
      <Button :type="loading || validating ? 'button' : 'submit'">
        <LoaderCircleIcon v-if="loading" class="h-5 w-5 animate-spin" />
        <span v-else-if="validating">Validating...</span>
        <span v-else>Create instructors</span>
      </Button>
    </div>
  </form>
</template>
