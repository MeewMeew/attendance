<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field'
import { Course } from '@/database'
import { generatePath } from '@/lib/utils'
import { t } from '@/shared/locales'
import type { M } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { schemaUpdate } from './common'

interface FormCommonProps {
  id: string
  method: string
}

const props = defineProps<FormCommonProps>()

const router = useRouter()

const formSchema = toTypedSchema(schemaUpdate)
const form = useForm({ validationSchema: formSchema, initialValues: { credit: 0 } })

const { fetchCourses } = useMiscStore()

const isFetching = ref(false)
const isSubmitting = ref(false)
const courseInit = ref<M.Course.Info | null>(null)

const onSubmit = form.handleSubmit((values) => {
  let diff = false
  for (const key in values) {
    const initKey = key as keyof typeof courseInit.value
    if (values[key as keyof typeof values] !== courseInit.value?.[initKey]) {
      diff = true
      break
    }
  }
  if (!diff) return toast.info(t('utils.form.update.no_change'))

  isSubmitting.value = true
  Course.update(props.id, values)
    .then(async () => {
      toast.success(t('utils.form.update.success', { a: 'course' }))
      fetchCourses()
      await router.replace(
        generatePath('/admin/courses/readonly/:id', {
          id: props.id
        })
      )
    })
    .catch(() => {
      toast.error(t('utils.form.update.error', { a: 'course' }))
    })
    .finally(() => {
      isSubmitting.value = false
    })
})

onMounted(async () => {
  isFetching.value = true
  await Course.read(props.id).then((course) => {
    courseInit.value = course
    form.setValues(course as any)
  })
  isFetching.value = false
})
</script>

<template>
  <UVFormsLayout
    :id="id"
    :is-fetching="isFetching"
    :is-submitting="isSubmitting"
    :on-submit="onSubmit"
    :method="method"
    route-name="classrooms"
    v-slot="{ readonly }"
  >
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-2/4">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>{{ t('readonlys.datatable.course.name') }}</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" :readonly="readonly" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full md:w-1/4">
        <FormField v-slot="{ field }" name="code">
          <FormItem>
            <FormLabel>{{ t('readonlys.datatable.course.code') }}</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" :readonly="readonly" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full md:w-1/4">
        <FormField name="credit">
          <FormItem>
            <FormLabel>{{ t('readonlys.datatable.course.credit') }}</FormLabel>
            <NumberField
              v-model="form.values.credit"
              :disabled="readonly"
              @update:model-value="
                (v) => {
                  if (v) form.setFieldValue('credit', v)
                }
              "
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <FormControl>
                  <NumberFieldInput />
                </FormControl>
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
  </UVFormsLayout>
</template>
