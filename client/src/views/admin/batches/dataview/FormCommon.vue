<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, h, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

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
import { useMiscStore } from '@/stores'

import { schemaUpdate } from './common'

interface FormCommonProps {
  id: string
  method: string
}

const props = defineProps<FormCommonProps>()

const formSchema = toTypedSchema(schemaUpdate)
const form = useForm({ validationSchema: formSchema })
const { fetchBatches } = useMiscStore()
const isFetching = ref(false)
const isSubmitting = ref(false)
const initData = ref<M.Batch.Info | null>(null)
const currentYear = computed(() => new Date().getFullYear())
const startYear = ref(currentYear.value - 10) // Initialize with the earliest year

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
  let diff = false
  for (const key in values) {
    if (
      values[key as keyof typeof values] !== initData.value?.[key as keyof typeof initData.value]
    ) {
      diff = true
      break
    }
  }
  if (!diff) return toast.info('No changes detected.')

  isSubmitting.value = true
  Batch.update(values.batchId, values as M.Batch.Info)
    .then(() => {
      toast.success('Batch updated successfully.')
      fetchBatches()
    })
    .catch(() => {
      toast.error('An error occurred.')
    })
    .finally(() => {
      isSubmitting.value = false
    })
})

onMounted(async () => {
  isFetching.value = true
  await Batch.read(props.id).then((data) => {
    initData.value = data
    form.setValues(data!)
  })
  isFetching.value = false
})
</script>

<template>
  <UVFormsLayout
    :method="method"
    :id="id"
    :isFetching="isFetching"
    :onSubmit="onSubmit"
    :isSubmitting="isSubmitting"
    routeName="batches"
    v-slot="{ readonly }"
  >
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-1/3">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>Batch name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" :readonly="readonly" />
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
              <Input type="text" v-bind="field" :readonly="readonly" />
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
              :disabled="readonly"
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
            <Select v-bind="field" :default-value="String(value)" :disabled="readonly">
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
  </UVFormsLayout>
</template>
