<script setup lang="ts">
import { updateProfile } from 'firebase/auth'
import { Pencil } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Storage, User } from '@/database/index'
import { currentUser } from '@/lib/services'
import { getAcronym } from '@/lib/utils'
import type { M } from '@/shared/types'
import { useUserStore } from '@/stores'

const props = defineProps<{
  user: M.User.Info
}>()
const userStore = useUserStore()

const avatarLoading = ref<boolean>(false)
const avatar = ref<HTMLInputElement | null>(null)
const acronym = computed(() => getAcronym(props.user?.displayName! || props.user?.email!))

function onAvatarChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    avatarLoading.value = true
    const file = target.files[0]
    if (!file.type.startsWith('image')) {
      toast.error('Invalid file type')
      avatarLoading.value = false
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function (readerEvent) {
      const img = new Image()
      img.src = readerEvent.target!.result as string
      img.onload = function () {
        const maxSize = 512
        const squareSize = Math.min(img.width, img.height)
        const offsetX = (img.width - squareSize) / 2
        const offsetY = (img.height - squareSize) / 2

        const canvas = document.createElement('canvas')
        canvas.width = maxSize
        canvas.height = maxSize
        const ctx = canvas.getContext('2d')
        ctx!.drawImage(img, offsetX, offsetY, squareSize, squareSize, 0, 0, maxSize, maxSize)
        canvas.toBlob((blob) => {
          if (blob) {
            Storage.uploadFile(`${props.user.docId}/images/avatar.jpg`, blob)
              .then((url) => {
                updateProfile(currentUser(), { photoURL: url }).then(() =>
                  User.updateFlattened(props.user.docId, {
                    photoURL: url
                  }).then(() => {
                    userStore.fetch()
                    toast.success('Changed avatar successfully')
                    avatarLoading.value = false
                  })
                )
              })
              .catch(() => {
                toast.error('Failed to upload avatar')
                avatarLoading.value = false
              })
          }
        })
      }
    }
  }
}

function openDialog() {
  if (avatar.value?.type !== 'file') {
    avatar.value = document.createElement('input')
    avatar.value.type = 'file'
    avatar.value.accept = 'image/*'
    avatar.value.onchange = onAvatarChange
  }
  avatar?.value?.click()
}
</script>

<template>
  <div class="group relative flex h-fit w-fit flex-row items-center lg:ml-32">
    <Avatar size="lg">
      <AvatarImage :src="userStore.user!.photoURL!" ref="avatar" v-if="userStore.user?.photoURL" />
      <AvatarFallback>{{ acronym }}</AvatarFallback>
    </Avatar>
    <Button
      class="absolute bottom-0 right-0 rounded-full opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
      variant="ghost"
      size="icon"
      aria-label="Change avatar"
      @click="openDialog"
      :disabled="avatarLoading"
    >
      <Pencil class="transition-opacity duration-300 ease-in-out" />
      <span class="sr-only">Change avatar</span>
    </Button>
    <input type="file" accept="image/*" ref="avatar" class="hidden" @change="onAvatarChange" />
  </div>
</template>

<style scoped lang="css"></style>
