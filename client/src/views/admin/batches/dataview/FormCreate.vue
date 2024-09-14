<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, h, ref } from 'vue'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Batch } from '@/database'
import type { M } from '@/shared/types'

import { schemaCreate } from './common'

const formSchema = toTypedSchema(schemaCreate)
const form = useForm({ validationSchema: formSchema })

const isSubmitting = ref(false)
const currentYear = computed(() => new Date().getFullYear())
const startYear = ref(currentYear.value - 10)

const createStartYearElement = () => {
  return h(SelectGroup, {}, () => {
    return Array.from({ length: 31 }, (v, i) => {
      const year = currentYear.value - 10 + i
      return h(SelectItem, { value: year.toString() }, () => [year.toString()])
    })
  })
}

const endYearOptions = computed(() => {
  const start = startYear.value
  return Array.from({ length: 31 - (start - (currentYear.value - 10)) }, (v, i) => start + i)
})

const createEndYearElement = () => {
  return h(SelectGroup, {}, () => {
    return endYearOptions.value.map((year) => {
      return h(SelectItem, { value: year.toString() }, () => [year.toString()])
    })
  })
}
const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true
  await Batch.create(values as M.Batch.Info)
    .then(() => {
      toast.success('Created new batch successfully.')
      form.resetForm()
    })
    .catch(() => {
      toast.error('An error occurred.')
    })
    .finally(() => {
      isSubmitting.value = false
    })
})
</script>

<template>
  <form @submit="onSubmit" class="w-full flex-col space-y-2 md:flex">
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-1/3">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>Batch name</FormLabel>
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
        <FormField v-slot="{ field, value }" name="startYear">
          <FormItem>
            <FormLabel>Start year</FormLabel>
            <Select
              v-bind="field"
              :default-value="String(value)"
              @update:model-value="
                (value) => {
                  startYear = parseInt(value)
                  if (parseInt(value) > parseInt(form.values.endYear?.toString()!)) {
                    form.setFieldValue('endYear', value)
                  }
                }
              "
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue>
                    {{ value ? value : currentYear }}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <createStartYearElement />
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-full md:w-1/3">
        <FormField v-slot="{ field, value }" name="endYear">
          <FormItem>
            <FormLabel>Start year</FormLabel>
            <Select v-bind="field" :default-value="String(value)">
              <FormControl>
                <SelectTrigger>
                  <SelectValue>
                    {{ value ? value : currentYear }}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <createEndYearElement />
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
    <div class="flex w-full justify-center pt-4">
      <Button type="submit" :disable="isSubmitting">Create batch</Button>
    </div>
  </form>
</template>
