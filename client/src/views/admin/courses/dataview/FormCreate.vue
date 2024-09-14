<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
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
import { startCase } from '@/lib/misc'
import { t } from '@/shared/locales'

import { schemaCreate } from './common'

const formSchema = toTypedSchema(schemaCreate)
const form = useForm({ validationSchema: formSchema })

const isSubmitting = ref(false)

const onSubmit = form.handleSubmit((values) => {
  isSubmitting.value = true
  Course.create({ ...values, name: startCase(values.name) })
    .then(() => {
      toast.success(t('utils.form.create.success', { a: 'course' }))
      form.resetForm()
    })
    .catch(() => toast.error(t('utils.form.create.error', { a: 'course' })))
    .finally(() => (isSubmitting.value = false))
})
</script>

<template>
  <form @submit="onSubmit" class="w-full flex-col space-y-2 md:flex">
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-2/4">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>{{ t('views.datatable.course.name') }}</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full md:w-1/4">
        <FormField v-slot="{ field }" name="code">
          <FormItem>
            <FormLabel>{{ t('views.datatable.course.code') }}</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full md:w-1/4">
        <FormField name="credit">
          <FormItem>
            <FormLabel>{{ t('views.datatable.course.credit') }}</FormLabel>
            <NumberField
              :default-value="0"
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

    <div class="flex w-full justify-center pt-4">
      <Button type="submit" :disable="isSubmitting">{{ t('components.button.create') }}</Button>
    </div>
  </form>
</template>
