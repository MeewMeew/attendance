<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { UVFormsLayout } from '@/components/layouts'
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
import { Classroom } from '@/database'
import { startCase } from '@/lib/misc'
import { generatePath } from '@/lib/utils'
import { t } from '@/shared/locales'
import type { M } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { schemaUpdate } from './common'
interface FormCommonProps {
  id: string
  method: 'view' | 'update' | 'create'
}

const props = defineProps<FormCommonProps>()
const router = useRouter()

const { fetchClassrooms } = useMiscStore()

const isFetching = ref(false)
const isSubmitting = ref(false)
const initialValues = ref<M.Classroom.Info | null>(null)

const formSchema = toTypedSchema(schemaUpdate)
const form = useForm({ validationSchema: formSchema })

const onSubmit = form.handleSubmit((values) => {
  let diff = false
  for (const key in values) {
    if (
      values[key as keyof typeof values] !==
      initialValues.value?.[key as keyof typeof initialValues.value]
    ) {
      diff = true
      break
    }
  }
  if (!diff) return toast.info('No changes detected.')

  isSubmitting.value = true
  values.name = startCase(values.name)
  values.used = values.used === 'true'
  Classroom.update(props.id, values)
    .then(() => {
      toast.success('Update classrooms successfully')
      router.push(generatePath('/admin/classrooms'))
      fetchClassrooms()
    })
    .catch(() => {
      toast.error('Failed to update classroom')
    })
    .finally(() => {
      isSubmitting.value = false
    })
})

onMounted(async () => {
  isFetching.value = true
  await Classroom.read(props.id)
    .then((classroom) => {
      initialValues.value = classroom
      if (classroom) form.setValues(classroom as any)
    })
    .catch(() => toast.error(t('utils.fetch.error', { a: 'classroom' })))
    .finally(() => (isFetching.value = false))
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
      <div class="w-full md:w-2/3">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>Classroom name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" :readonly="readonly" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <FormField v-slot="{ field }" name="capacity">
        <FormItem>
          <FormLabel>Capacity</FormLabel>
          <FormControl>
            <Input type="number" v-bind="field" :readonly="readonly" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ field }" name="used">
        <FormItem class="pb-0 md:pb-4">
          <FormLabel>Status</FormLabel>
          <Select v-bind="field" :disabled="readonly">
            <FormControl class="mt-4 flex h-full items-center">
              <SelectTrigger>
                <SelectValue :placeholder="form.values.used ? 'Available' : 'Not available'" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true"> Available </SelectItem>
                <SelectItem value="false"> Not available </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    <FormField v-slot="{ field }" name="location">
      <FormItem class="w-full">
        <FormLabel>Location</FormLabel>
        <FormControl>
          <Input type="text" v-bind="field" :readonly="readonly" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </UVFormsLayout>
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
