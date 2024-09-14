<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import { DropdownMenuField } from '@/components/forms'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { User } from '@/database'
import { Axios } from '@/lib/axios'
import { nameToEmail } from '@/lib/misc'
import type { A, M } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { schemaUpdate } from './common'

interface FormCommonProps {
  id: string
  method: string
}

const props = defineProps<FormCommonProps>()

const { fetchFaculties, fetchInstructors } = useMiscStore()
const { faculties } = storeToRefs(useMiscStore())

const formSchema = toTypedSchema(schemaUpdate)
const form = useForm({ validationSchema: formSchema, initialValues: { phoneNumber: '+84' } })

const isFetching = ref(false)
const isSubmitting = ref(false)
const initialUser = ref<M.User.Info<'instructor'> | null>(null)

const facultyValue = ref('')

const { value: displayName } = useField<string>('displayName')
const { value: phoneNumber } = useField<string>('phoneNumber', undefined, {
  initialValue: '+84'
})
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

  if (!diff) {
    toast.info('No changes detected.')
    return
  }

  isSubmitting.value = true
  Axios.put('/instructor', { user: values })
    .then(() => {
      fetchInstructors()
      toast.success('Instructor updated successfully.')
    })
    .catch((error: A.Error) => {
      const parse = Axios.pasreError(error)
      toast.error(parse.message || 'An error occurred.')
      console.error(error)
    })
    .finally(() => (isSubmitting.value = false))
})

onMounted(async () => {
  isFetching.value = true
  await fetchFaculties()
  await User.read<'instructor'>(props.id).then((user) => {
    initialUser.value = user
    form.setValues(user as any)
    facultyValue.value = user!.facultyId
  })
  isFetching.value = false
})

whenever(
  displayName,
  (value) => value && form.setFieldValue('email', nameToEmail(value, 'instructor.hactech.edu.vn'))
)

watch(phoneNumber, (value) => !value && form.setFieldValue('phoneNumber', '+84'))
</script>

<template>
  <UVFormsLayout
    :id="props.id"
    :is-fetching="isFetching"
    :is-submitting="isSubmitting"
    :on-submit="onSubmit"
    :method="props.method"
    route-name="instructors"
    v-slot="{ readonly }"
  >
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-2/4">
        <FormField v-slot="{ field }" name="displayName">
          <FormItem>
            <FormLabel>Instructor name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" :readonly="readonly" />
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
              <Input type="text" v-bind="field" :readonly="readonly" />
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
              <Input type="text" v-bind="field" :readonly="readonly" />
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
              <Input type="email" v-bind="field" :readonly="readonly" />
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
      <FormField v-slot="{ field }" name="docId">
        <FormItem>
          <FormControl>
            <Input type="text" v-bind="field" disabled />
          </FormControl>
        </FormItem>
      </FormField>
    </div>
  </UVFormsLayout>
</template>
