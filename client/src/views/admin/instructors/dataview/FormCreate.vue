<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import { DropdownMenuField } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Axios } from '@/lib/axios'
import { nameToEmail } from '@/lib/misc'
import { useMiscStore } from '@/stores'

import { schemaCreate } from './common'

const formSchema = toTypedSchema(schemaCreate)
const form = useForm({ validationSchema: formSchema })

const { faculties } = storeToRefs(useMiscStore())

const isSubmitting = ref(false)

const facultyValue = ref('')

const { value: displayName } = useField<string>('displayName')
const { value: phoneNumber } = useField<string>('phoneNumber', undefined, {
  initialValue: '+84'
})
const onSubmit = form.handleSubmit((values) => {
  isSubmitting.value = true
  const { ...user } = values
  if (user.phoneNumber.startsWith('0')) {
    user.phoneNumber = `+84${user.phoneNumber.slice(1)}`
  }
  Axios.post('/instructor', { users: [user] })
    .then(() => {
      toast.success('Instructor created successfully.')
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

whenever(
  displayName,
  (value) => value && form.setFieldValue('email', nameToEmail(value, 'instructor.hactech.edu.vn'))
)

watch(phoneNumber, (value) => !value && form.setFieldValue('phoneNumber', '+84'))
</script>

<template>
  <form @submit="onSubmit" class="w-full flex-col space-y-2 md:flex">
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-2/4">
        <FormField v-slot="{ field }" name="displayName">
          <FormItem>
            <FormLabel>Instructor name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full md:w-1/4">
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
      <div class="w-full md:w-1/4">
        <FormField v-slot="{ field }" name="instructorId">
          <FormItem>
            <FormLabel>Instructor Identify</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-2/4">
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
      <div class="w-full md:w-1/4">
        <DropdownMenuField
          :value="facultyValue"
          :array="faculties"
          key-label="name"
          name="faculty"
          key-value="facultyId"
          @update:model-value="
            (v) => {
              facultyValue = v
              form.setFieldValue('facultyId', v)
            }
          "
        >
          <template #label> Faculty </template>
        </DropdownMenuField>
      </div>
      <div class="w-full md:w-1/4">
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
      <Button type="submit" :disable="isSubmitting">Create instructor</Button>
    </div>
  </form>
</template>
