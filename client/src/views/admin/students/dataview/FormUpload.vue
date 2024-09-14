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
import { Axios } from '@/lib/axios'
import { t } from '@/shared/locales'
import { useMiscStore } from '@/stores'

import { type Schema, schema } from './schema'

const { faculties, batches, classes } = storeToRefs(useMiscStore())

const loading = ref(false)
const validating = ref(false)
const dataErrors = ref<string[]>([])
const dataRows = ref<Schema[]>([])
const alertItems = ref<string[]>([
  'Mã sinh viên',
  'Họ tên',
  'Email',
  'Số điện thoại',
  'Mật khẩu',
  'Khoa',
  'Khóa',
  'Lớp'
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
      dataErrors.value = errors.map((e) => `Row ${e.row} - Column: ${e.column} ${e.error}`)
      toast.error('Error while reading excel file')
      return
    }
    dataRows.value = rows.map((row) => {
      return {
        ...row,
        role: 'student',
        facultyId: faculties.value.find((f) => validate(f.name, row.facultyId))?.facultyId || '',
        batchId: batches.value.find((b) => validate(b.name, row.batchId))?.batchId || '',
        classId: classes.value.find((c) => validate(c.name, row.classId))?.classId || ''
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
    await Axios.post('/student', { users: dataRows.value })
    toast.success('Students created successfully')
  } catch (error) {
    console.error(error)
    toast.error('Error while creating students')
  } finally {
    upload.value?.reset()
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="mx-auto grid w-full max-w-2xl items-center gap-2">
    <AlertUploadDesc :items="alertItems" />
    <Upload ref="upload" @changed="onFileChanged" :errors="dataErrors" accept=".xls, .xlsx" />
    <div class="flex w-full justify-center">
      <Button :type="loading || validating ? 'button' : 'submit'">
        <LoaderCircleIcon v-if="loading" class="h-5 w-5 animate-spin" />
        <span v-else-if="validating">{{ t('components.upload.validate.button') }}</span>
        <span v-else>{{ t('components.upload.button') }}</span>
      </Button>
    </div>
  </form>
</template>
