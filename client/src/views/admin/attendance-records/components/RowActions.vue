<script lang="ts" setup>
import { DotsHorizontalIcon } from '@radix-icons/vue'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { DialogWrapper } from '@/components/wrapper'
import { Attendance } from '@/database'
import { t } from '@/shared/locales'

interface Props {
  studentId: string
  sessionId: string
}

const props = defineProps<Props>()

const note = ref('')

function saveNote() {
  Attendance.saveNote(props.sessionId, props.studentId, note.value)
    .then(() => {
      note.value = ''
      toast.success(t('Note saved'))
    })
    .catch(() => {
      toast.error(t('Failed to save note'))
    })
  note.value = ''
}
</script>

<template>
  <DialogWrapper>
    <template #dropdown-menu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost">
          <DotsHorizontalIcon class="size-4" />
          <span class="sr-only">{{ t('Open menu') }}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <DialogTrigger>
            {{ t('Update note') }}
          </DialogTrigger>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </template>
    <template #dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {{ t('Enter a note for this student') }}
          </DialogTitle>
          <DialogDescription>
            {{ t('This note will be visible to the student') }}
          </DialogDescription>
        </DialogHeader>
        <div class="flex flex-col gap-4">
          <Textarea v-model="note" />
          <div class="flex justify-end gap-4">
            <DialogClose>
              <Button variant="ghost" @click="note = ''">
                {{ t('Cancel') }}
              </Button>
            </DialogClose>
            <Button @click="saveNote">
              {{ t('Save') }}
            </Button>
          </div>
        </div>
      </DialogContent>
    </template>
  </DialogWrapper>
</template>
