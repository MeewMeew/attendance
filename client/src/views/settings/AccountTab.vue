<script lang="ts" setup>
import { updatePassword } from 'firebase/auth'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { currentUser } from '@/lib/services'
import { useUserStore } from '@/stores'

import UserAvatar from './account/UserAvatar.vue'
const userStore = useUserStore()

const password = ref<string>('')
const loading = ref<boolean>(false)

function changePassword() {
  loading.value = true
  updatePassword(currentUser(), password.value)
    .then(() => {
      toast.success('Password changed successfully')
      password.value = ''
    })
    .catch((error) => {
      toast.error(error.message)
    })
    .finally(() => (loading.value = false))
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center space-y-10 md:flex-row md:space-x-10 md:space-y-0"
  >
    <UserAvatar :user="userStore.user" />
    <div class="flex flex-col items-start justify-center space-y-2">
      <h2 class="text-2xl font-semibold">{{ userStore.user.displayName }}</h2>
      <p class="text-sm">{{ userStore.user.email }}</p>
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline"> Change password </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Make changes to your password here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div class="py-4">
            <Label for="password" class="text-right"> New password </Label>
            <Input id="password" class="col-span-3" v-model:model-value="password" />
          </div>
          <DialogFooter class="grid grid-cols-2">
            <DialogClose as-child>
              <Button variant="outline"> Close </Button>
            </DialogClose>
            <Button @click="changePassword" :disable="loading"> Save changes </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
