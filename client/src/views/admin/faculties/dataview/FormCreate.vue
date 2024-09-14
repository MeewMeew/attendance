<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { whenever } from '@vueuse/core'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Faculty } from '@/database'
import { startCase, toShortName } from '@/lib/misc'

import { schemaCreate } from './common'

const formSchema = toTypedSchema(schemaCreate)
const form = useForm({ validationSchema: formSchema })

const isSubmitting = ref(false)

const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true
  await Faculty.create({ ...values, name: startCase(values.name) })
    .then(() => {
      toast.success('Faculty created successfully')
      form.resetForm()
    })
    .catch(() => {
      toast.error('Failed to create faculty')
    })
    .finally(() => {
      isSubmitting.value = false
    })
})

const { value: name } = useField<string>('name')
whenever(name, () => {
  if (name.value) {
    const shortName = toShortName(name.value)
    form.setValues({ shortName })
  }
})
</script>

<template>
  <form @submit="onSubmit" class="w-full flex-col space-y-2 md:flex">
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-2/3">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>Faculty name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full md:w-1/3">
        <FormField v-slot="{ field }" name="shortName">
          <FormItem>
            <FormLabel>Faculty short name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
    <div class="flex w-full justify-center pt-4">
      <Button type="submit" :disable="isSubmitting">Create faculty</Button>
    </div>
  </form>
</template>
