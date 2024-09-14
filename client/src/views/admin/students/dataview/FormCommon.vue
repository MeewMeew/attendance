<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref, watchEffect } from 'vue'
import { toast } from 'vue-sonner'

import DropdownMenuField from '@/components/forms/DropdownMenuField.vue'
import { UVFormsLayout } from '@/components/layouts'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { User } from '@/database'
import { Axios } from '@/lib/axios'
import { nameToEmail } from '@/lib/misc'
import type { A, M, U } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { schemaUpdate } from './common'

interface FormCommonProps {
  id: string
  method: U.Views.Method
}

const props = defineProps<FormCommonProps>()

const { faculties, batches, classes: classesInit } = storeToRefs(useMiscStore())

const formSchema = toTypedSchema(schemaUpdate)
const form = useForm({ validationSchema: formSchema, initialValues: { phoneNumber: '+84' } })

const isFetching = ref(false)
const isSubmitting = ref(false)
const classes = ref<M.Class.Info[]>([])
const initialUser = ref<M.User.Info<'student'> | null>(null)
const facultyValue = ref('')
const batchValue = ref('')
const classValue = ref('')

const onSubmit = form.handleSubmit((values) => {
  let diff = false
  for (const key in values) {
    if (
      values[key as keyof typeof values] !==
      initialUser.value?.[key as keyof typeof initialUser.value]
    ) {
      diff = true
      break
    }
  }
  if (!diff) return toast.info('No changes detected.')

  isSubmitting.value = true
  Axios.put('/student', { user: values })
    .then(() => {
      toast.success('Student updated successfully.')
    })
    .catch((error: A.Error) => {
      const parse = Axios.pasreError(error)
      toast.error(parse.message || 'An error occurred.')
      console.error(error)
    })
    .finally(() => (isSubmitting.value = false))
})

onMounted(async () => {
  try {
    isFetching.value = true
    classes.value = classesInit.value
    const user = await User.read<'student'>(props.id)
    if (!user) throw new Error('User not found.')
    initialUser.value = user
    facultyValue.value = user.facultyId
    batchValue.value = user.batchId
    classValue.value = user.classId
    form.setValues(user as any)
    isFetching.value = false
  } catch (error) {
    console.log(error)
  }
})

watchEffect(() => {
  const { value: displayName } = useField<string>('displayName')
  const { value: phoneNumber } = useField<string>('phoneNumber')
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
</script>

<template>
  <UVFormsLayout
    :id="id"
    :method="method"
    :on-submit="onSubmit"
    :is-fetching="isFetching"
    :is-submitting="isSubmitting"
    route-name="students"
  >
    <template v-slot="{ readonly }">
      <div class="flex-row items-start justify-start md:flex md:space-x-6">
        <div class="w-full md:w-2/3">
          <FormField v-slot="{ field }" name="displayName">
            <FormItem>
              <FormLabel>Student name</FormLabel>
              <FormControl>
                <Input type="text" v-bind="field" :readonly="readonly" />
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
                <Input type="text" v-bind="field" :readonly="readonly" />
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
                <Input type="email" v-bind="field" :readonly="readonly" />
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
                <Input type="password" v-bind="field" :readonly="readonly" />
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
                <Input type="text" v-bind="field" :readonly="readonly" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="w-full">
          <DropdownMenuField
            name="facultyId"
            keyValue="facultyId"
            keyLabel="name"
            :array="faculties"
            :value="facultyValue"
            :readonly="readonly"
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
            keyValue="batchId"
            keyLabel="name"
            :array="batches"
            :value="batchValue"
            :readonly="readonly"
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
            keyValue="classId"
            keyLabel="name"
            :array="classes"
            :value="classValue"
            :readonly="readonly"
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
    </template>
  </UVFormsLayout>
</template>
