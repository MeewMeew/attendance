<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import DropdownMenuField from '@/components/forms/DropdownMenuField.vue'
import { UVFormsLayout } from '@/components/layouts'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Class } from '@/database'
import { startCase } from '@/lib/misc'
import { generatePath } from '@/lib/utils'
import type { M, U } from '@/shared/types'
import { useMiscStore } from '@/stores'

import { schemaUpdate } from './common'

interface FormCommonProps {
  id: string
  method: U.Views.Method
}

const router = useRouter()
const props = defineProps<FormCommonProps>()
const { fetchClasses } = useMiscStore()
const { faculties, batches, instructors } = storeToRefs(useMiscStore())
const formSchema = toTypedSchema(schemaUpdate)
const form = useForm({ validationSchema: formSchema })

const isFetching = ref(false)
const isSubmitting = ref(false)
const facultyValue = ref('')
const batchValue = ref('')
const instructorValue = ref('')
const initialValues = ref<M.Class.Info | null>(null)

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
  Class.update(props.id, values)
    .then(() => {
      toast.success('Update class successfully')
      router.push(generatePath('/admin/classes'))
      fetchClasses()
    })
    .catch(() => {
      toast.error('Failed to update class')
    })
    .finally(() => {
      isSubmitting.value = false
    })
})

onMounted(async () => {
  isFetching.value = true
  await Class.read(props.id).then((data) => {
    initialValues.value = data
    form.setValues(data!)
    facultyValue.value = data!.facultyId
    batchValue.value = data!.batchId
    instructorValue.value = data!.instructorId
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
    route-name="classes"
  >
    <template v-slot="{ readonly }">
      <div class="flex-row items-start justify-start md:flex md:space-x-6">
        <div class="w-full md:w-1/3">
          <FormField v-slot="{ field }" name="name">
            <FormItem>
              <FormLabel>Class name</FormLabel>
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
          <FormField v-slot="{ field }" name="capacity">
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input type="number" v-bind="field" :readonly="readonly" />
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
            <template v-slot:label> Batch </template>
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
            <template v-slot:label> Instructor </template>
          </DropdownMenuField>
        </div>
      </div>
    </template>
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
