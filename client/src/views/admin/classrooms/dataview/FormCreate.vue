<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Classroom } from '@/database'
import { startCase } from '@/lib/misc'
import type { M } from '@/shared/types'

import { schemaCreate } from './common'

const formSchema = toTypedSchema(schemaCreate)
const form = useForm({ validationSchema: formSchema })

const isSubmitting = ref(false)

const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true
  const classroom = {
    ...values,
    classroomId: '',
    used: typeof values.used === 'string' ? values.used === 'true' : values.used
  } as M.Classroom.Info
  Object.keys(classroom).forEach((key) => {
    let val = classroom[key as keyof typeof classroom]
    if (typeof val === 'string') {
      classroom[key as keyof typeof classroom] = startCase(val) as never
    }
  })
  const existClassroom = await Classroom.hasClassroom(classroom.name)
  if (existClassroom) {
    toast.error('Classroom name already exists')
    isSubmitting.value = false
    return
  }
  await Classroom.create(classroom)
    .then(() => {
      toast.success('Create new classroom successfully')
      form.resetForm()
    })
    .catch(() => toast.error('Failed to create classroom'))
    .finally(() => (isSubmitting.value = false))
})
</script>

<template>
  <form @submit="onSubmit" class="w-full flex-col space-y-2 md:flex">
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-2/3">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>Classroom name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <FormField v-slot="{ field }" name="capacity">
        <FormItem>
          <FormLabel>Capacity</FormLabel>
          <FormControl>
            <Input type="number" v-bind="field" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ field }" name="used">
        <FormItem class="pb-0 md:pb-4">
          <FormLabel>Status</FormLabel>
          <FormControl class="mt-4 flex h-full items-center">
            <RadioGroup v-bind="field" class="flex h-full items-center gap-x-3 md:pt-2">
              <FormItem class="flex items-center gap-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="false" />
                </FormControl>
                <FormLabel class="font-normal"> Available </FormLabel>
              </FormItem>
              <FormItem class="flex items-center gap-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="true" />
                </FormControl>
                <FormLabel class="font-normal"> Unavailable </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    <FormField v-slot="{ field }" name="location">
      <FormItem class="w-full">
        <FormLabel>Location</FormLabel>
        <FormControl>
          <Input type="text" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="flex w-full justify-center pt-4">
      <Button type="submit" :disable="isSubmitting">Create new classroom</Button>
    </div>
  </form>
</template>

<style lang="css" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
