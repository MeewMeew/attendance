<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { whenever } from '@vueuse/core'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Faculty } from '@/database'
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
const form = useForm({ validationSchema: formSchema })

const { fetchFaculties } = useMiscStore()

const isFetching = ref(false)
const isSubmitting = ref(false)
const initialFaculty = ref<M.Faculty.Info | null>(null)

const onSubmit = form.handleSubmit((values) => {
  let diff = false
  for (const key in values) {
    if (
      values[key as keyof typeof values] !==
      initialFaculty.value?.[key as keyof typeof initialFaculty.value]
    ) {
      diff = true
      break
    }
  }
  if (!diff) return toast.info('No changes detected.')
  Faculty.update(props.id, values)
    .then(() => {
      toast.success('Faculty updated successfully')
      router.replace({ name: 'admin.faculties' })
      fetchFaculties()
    })
    .catch(() => {
      toast.error('Failed to update faculty')
    })
})

onMounted(async () => {
  isFetching.value = true
  await Faculty.read(props.id)
    .then((faculty) => {
      if (!faculty) {
        toast.error('Faculty not found')
        return router.replace({ name: 'admin.faculties' })
      }
      initialFaculty.value = faculty
      form.setValues(faculty)
    })
    .catch((error) => {
      toast.error('Failed to fetch faculty data')
    })
  isFetching.value = false
})

const { value: name } = useField<string>('name')

whenever(name, () => {
  if (name.value) {
    const shortName = name.value
      .split(/\s+/g)
      .map((word) => word[0].toUpperCase())
      .join('')
    form.setValues({ shortName })
  }
})
</script>

<template>
  <UVFormsLayout
    :is-fetching="isFetching"
    :is-submitting="isSubmitting"
    :on-submit="onSubmit"
    :method="props.method"
    route-name="faculties"
    v-slot="{ readonly }"
  >
    <div class="flex-row items-start justify-start md:flex md:space-x-6">
      <div class="w-full md:w-2/3">
        <FormField v-slot="{ field }" name="name">
          <FormItem>
            <FormLabel>Student name</FormLabel>
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
            <FormLabel>Phone number</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" :readonly="readonly" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
    <div class="hidden">
      <FormField v-slot="{ field }" name="facultyId">
        <FormItem>
          <FormControl>
            <Input type="text" v-bind="field" disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </UVFormsLayout>
</template>
