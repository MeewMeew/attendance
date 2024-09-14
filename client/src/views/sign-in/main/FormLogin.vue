<script lang="ts" setup>
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Separator } from '@/components/ui/separator'
import { User } from '@/database/index'
import Axios from '@/lib/axios'
import { sendPasswordResetEmailService, signInService, signOutService } from '@/lib/services'
import { cn } from '@/lib/utils'
import type { F } from '@/shared/types'
import { useNanoIDStore, useUserStore } from '@/stores'

import QRCode from './qrcode/QRcode.vue'

const { nanoid } = useNanoIDStore()
const userStore = useUserStore()
const router = useRouter()
const email = ref<string>('')
const emailReset = ref<string>('')
const password = ref<string>('')
const loading = ref<boolean>(false)
const resetLoading = ref<boolean>(false)
const isForm = ref<boolean>(true)
const passwordType = ref<string>('password')
const closeDialog = ref<HTMLElement | null>(null)

async function handleSignIn(event: Event) {
  event.preventDefault()
  loading.value = true
  let errMess = ''

  try {
    const { user } = await signInService(email.value, password.value)
    const userData = await User.read(user.uid)
    userStore.set(userData)
    if (userData) {
      const { data: ip } = await Axios.get<string>('/utils/whatismyip')
      const timeNow = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
      await User.updateLogin(user.uid, {
        time: timeNow,
        deviceName: navigator.userAgent.match(/^[^(]+\((\w+)/)![1],
        deviceId: nanoid,
        ip: ip
      })
      await router.replace(`/${userData.role}`)
      toast.success('Sign in successfully')
    } else {
      await signOutService()
      await router.push('/sign-in')
      userStore.clear()
      toast.error('Your account does not exist')
    }
  } catch (error: unknown) {
    const err = error as F.Auth.Error
    if (err.code === 'auth/student-not-found') {
      errMess = 'Your account does not exist'
    } else if (err.code === 'auth/wrong-password') {
      errMess = 'Wrong password'
    } else if (err.code === 'auth/invalid-email') {
      errMess = 'Email is invalid'
    } else if (err.code === 'auth/invalid-credential') {
      errMess = 'Invalid credential'
    } else if (err.code === 'auth/invalid-device-sign-in') {
      errMess = 'You can only log in from one device within 24 hours'
    } else {
      errMess = err.message
    }
    toast.error(errMess)
  } finally {
    loading.value = false
  }
}

async function handleResetPassword(event: Event) {
  event.preventDefault()
  if (!emailReset.value) {
    toast.error('Email is required')
    return
  }
  resetLoading.value = true

  await sendPasswordResetEmailService(emailReset.value)
    .then(() => {
      toast.success('Reset link sent successfully')
    })
    .catch((error: unknown) => {
      const err = error as F.Auth.Error
      toast.error(err.message)
    })
    .finally(() => {
      resetLoading.value = false
      closeDialog.value?.click()
    })
}

function togglePasswordVisibility() {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}
</script>

<template>
  <Card class="w-full min-w-[20rem] max-w-sm">
    <CardHeader class="space-y-1">
      <CardTitle class="text-center text-2xl font-bold">{{
        isForm ? 'Login' : 'Sync Classroom Data'
      }}</CardTitle>
      <CardDescription class="text-center">
        {{
          isForm
            ? 'Enter your credentials to login to your account.'
            : 'Please sign in to your admin account and scan the QR code below to sync classroom data'
        }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSignIn" class="space-y-4" v-if="isForm" id="loginForm">
        <div class="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            required
            type="email"
            v-model:model-value="email"
          />
        </div>
        <div class="relative space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            required
            :type="passwordType"
            v-model:model-value="password"
            placeholder="Password"
            autocomplete="off"
          />
          <button
            type="button"
            :class="
              cn(
                'absolute right-2 top-2 flex h-full items-center',
                'justify-center rounded-full hover:bg-transparent',
                'focus:outline-none'
              )
            "
            @click="togglePasswordVisibility"
          >
            <Eye v-if="passwordType === 'password'" class="size-4 text-muted-foreground" />
            <EyeOff v-else class="size-4 text-muted-foreground" />
          </button>
        </div>
        <div class="-my-2 flex w-full justify-between">
          <div class="flex items-center space-x-2">
            <Checkbox id="session" />
            <label
              for="session"
              :class="
                cn(
                  'text-sm font-medium leading-none',
                  'peer-disabled:cursor-not-allowed',
                  'peer-disabled:opacity-70'
                )
              "
            >
              Remember me
            </label>
          </div>
          <Dialog>
            <DialogTrigger as-child>
              <button class="bg-transparent text-sm hover:underline" type="button">
                Forgot password?
              </button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Forgot password</DialogTitle>
                <DialogDescription>
                  Enter your email address and we'll send you a link to reset your password.
                </DialogDescription>
              </DialogHeader>
              <div class="flex flex-col space-y-4">
                <Label for="email" class="text-left"> Email </Label>
                <Input id="email" type="email" v-model:model-value="emailReset" required />
              </div>
              <DialogFooter>
                <Button type="button" @click="handleResetPassword" :disabled="resetLoading">
                  Send reset link
                </Button>
                <DialogClose class="hidden text-sm" as-child>
                  <button type="button" ref="closeDialog" class="hidden bg-transparent" />
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Button class="w-full" type="submit" :disabled="loading">
          <Loader2 class="mr-2 h-4 w-4 animate-spin" v-if="loading" />
          {{ loading ? 'Loading...' : 'Sign In' }}
        </Button>
      </form>
      <div v-else :class="cn('mx-auto my-auto flex h-full w-full items-center', 'justify-center')">
        <QRCode />
      </div>
      <Separator orientation="horizontal" class="my-4" />
      <Button class="w-full" type="button" @click="isForm = !isForm">
        {{ isForm ? 'Sync classroom data' : 'Return to login' }}</Button
      >
    </CardContent>
  </Card>
</template>
