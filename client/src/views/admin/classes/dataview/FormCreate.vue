<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { ref, watchEffect } from 'vue'
import { toast } from 'vue-sonner'

import DropdownMenuField from '@/components/forms/DropdownMenuField.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Class } from '@/database'
import { startCase } from '@/lib/misc'
import { useMiscStore } from '@/stores'

import { schemaCreate } from './common'

const { faculties, batches, instructors } = storeToRefs(useMiscStore())
const formSchema = toTypedSchema(schemaCreate)
const form = useForm({ validationSchema: formSchema })

const isSubmitting = ref(false)
const facultyValue = ref('')
const batchValue = ref('')
const instructorValue = ref('')

const onSubmit = form.handleSubmit((values) => {
  values.name = startCase(values.name)
  isSubmitting.value = true
  Class.create(values)
    .then(() => {
      toast.success('Class created successfully')
      form.resetForm()
    })
    .catch(() => {
      toast.error('Error while creating class')
    })
    .finally(() => {
      isSubmitting.value = false
    })
})

watchEffect(() => {})
</script>

<template>
  <form @submit="onSubmit" class="w-full flex-col space-y-2 md:flex">
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-1/3">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>Class name</FormLabel>
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
            <FormLabel>Short name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full md:w-1/3">
        <FormField v-slot="{ field }" name="capacity">
          <FormItem>
            <FormLabel>Capacity</FormLabel>
            <FormControl>
              <Input type="number" v-bind="field" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
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
          <template v-slot:label> Instructor </template>
        </DropdownMenuField>
      </div>
      <div class="w-full">
        <DropdownMenuField
          name="instructorId"
          :array="instructors"
          keyValue="docId"
          keyLabel="displayName"
          :value="instructorValue"
          @update:model-value="
            (v: string) => {
              instructorValue = v
              form.setFieldValue('instructorId', v)
            }
          "
        >
          <template v-slot:label> Batch </template>
        </DropdownMenuField>
      </div>
    </div>
    <div class="flex w-full justify-center pt-4">
      <Button type="submit" :disable="isSubmitting">Create</Button>
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
