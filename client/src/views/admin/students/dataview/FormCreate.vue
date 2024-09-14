<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref, watchEffect } from 'vue'
import { toast } from 'vue-sonner'

import DropdownMenuField from '@/components/forms/DropdownMenuField.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Axios } from '@/lib/axios'
import { nameToEmail } from '@/lib/misc'
import type { M } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { schemaCreate } from './common'

const { faculties, batches, classes: classesInit } = storeToRefs(useMiscStore())

const formSchema = toTypedSchema(schemaCreate)
const form = useForm({ validationSchema: formSchema, initialValues: { phoneNumber: '+84' } })

const classes = ref<M.Class.Info[]>([])

const isSubmitting = ref(false)
const facultyValue = ref('')
const batchValue = ref('')
const classValue = ref('')

const onSubmit = form.handleSubmit((values) => {
  const { ...user } = values
  if (user.phoneNumber.startsWith('0')) {
    user.phoneNumber = `+84${user.phoneNumber.slice(1)}`
  }
  Axios.post('/student', { users: [user] })
    .then(() => {
      toast.success('Student created successfully.')
      form.resetForm()
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message || 'An error occurred.')
      console.error(error)
    })
    .finally(() => {
      isSubmitting.value = false
    })
})

const { value: displayName } = useField<string>('displayName')
const { value: phoneNumber } = useField<string>('phoneNumber')

watchEffect(() => {
  function filterClasses(value: string) {
    return classesInit.value
      .filter((c) => c.facultyId === value)
      .filter((c) => c.batchId === batchValue.value)
  }
  if (displayName.value) {
    form.setFieldValue('email', nameToEmail(displayName.value, 'student.hactech.edu.vn'))
  }
  if (!phoneNumber.value) {
    form.setFieldValue('phoneNumber', '+84')
  }
  if (facultyValue.value) {
    classes.value = filterClasses(facultyValue.value)
  }
  if (batchValue.value) {
    classes.value = filterClasses(facultyValue.value)
  }
  if (!classes.value.some((c) => c.classId === classValue.value)) {
    classValue.value = ''
  }
})

onMounted(async () => {
  classes.value = classesInit.value
})
</script>

<template>
  <form @submit="onSubmit" class="w-full flex-col space-y-2 md:flex">
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-2/3">
        <FormField v-slot="{ field }" name="displayName">
          <FormItem>
            <FormLabel>Student name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full md:w-1/3">
        <FormField v-slot="{ field }" name="phoneNumber">
          <FormItem>
            <FormLabel>Phone number</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-2/3">
        <FormField v-slot="{ field }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full md:w-1/3">
        <FormField v-slot="{ field }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full">
        <FormField v-slot="{ field }" name="studentId">
          <FormItem>
            <FormLabel>Student Identify</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full">
        <DropdownMenuField
          name="facultyId"
          :array="faculties"
          keyValue="facultyId"
          keyLabel="name"
          :value="facultyValue"
          @update:model-value="
            (v: string) => {
              facultyValue = v
              form.setFieldValue('facultyId', v)
            }
          "
        >
          <template v-slot:label> Faculty </template>
        </DropdownMenuField>
      </div>
    </div>
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full">
        <DropdownMenuField
          name="batchId"
          :array="batches"
          keyValue="batchId"
          keyLabel="name"
          :value="batchValue"
          @update:model-value="
            (v: string) => {
              batchValue = v
              form.setFieldValue('batchId', v)
            }
          "
        >
          <template v-slot:label> Batch </template>
        </DropdownMenuField>
      </div>
      <div class="w-full">
        <DropdownMenuField
          name="classId"
          :array="classes"
          keyValue="classId"
          keyLabel="name"
          :value="classValue"
          @update:model-value="
            (v: string) => {
              classValue = v
              form.setFieldValue('classId', v)
            }
          "
        >
          <template v-slot:label> Class name </template>
        </DropdownMenuField>
      </div>
    </div>
    <div class="hidden">
      <FormField v-slot="{ field }" name="role">
        <FormItem>
          <FormControl>
            <Input type="text" v-bind="field" disabled />
          </FormControl>
        </FormItem>
      </FormField>
    </div>
    <div class="flex w-full justify-center pt-4">
      <Button type="submit" :disable="isSubmitting">Create student</Button>
    </div>
  </form>
</template>
