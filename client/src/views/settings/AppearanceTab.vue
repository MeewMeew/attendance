<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import type { O } from '@/shared/types'
import { useThemeStore } from '@/stores'

const themeStore = useThemeStore()
const theme = ref<string>(themeStore.theme.dark ? 'dark' : 'light')
const color = ref<O.Theme.Color>(themeStore.theme.color)

function onSubmit() {
  themeStore.setTheme(theme.value === 'dark', color.value)
  toast.success(`Switched to ${color.value} ${themeStore.theme.dark ? 'dark' : 'light'} theme.`)
}
</script>

<template>
  <Card class="mx-auto min-w-80 max-w-4xl">
    <CardHeader>
      <CardTitle>Appearance</CardTitle>
      <CardDescription
        >Customize the appearance of the app. Automatically switch between day and night
        themes.</CardDescription
      >
    </CardHeader>
    <Separator class="mb-4" />
    <CardContent>
      <form @submit.prevent="onSubmit">
        <div class="flex flex-col space-x-5 xl:flex-row xl:justify-between">
          <div>
            <Label for="theme">Theme</Label>
            <RadioGroup
              class="flex flex-col md:flex-row md:items-center"
              v-model:model-value="theme"
            >
              <Label
                for="theme-light"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-primary"
                :class="{
                  '[&>div]:border-primary': theme === 'light'
                }"
              >
                <RadioGroupItem value="light" class="sr-only" id="theme-light" />
                <div class="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                  <div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
                    <div class="space-y-2 rounded-md bg-white p-2 shadow-sm">
                      <div class="h-2 w-20 rounded-lg bg-[#ecedef]" />
                      <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                  </div>
                </div>
                <span class="block w-full p-2 text-center font-normal"> Light </span>
              </Label>
              <Label
                for="theme-dark"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-primary"
                :class="{
                  '[&>div]:border-primary': theme === 'dark'
                }"
              >
                <RadioGroupItem value="dark" class="sr-only" id="theme-dark" />
                <div
                  class="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground"
                >
                  <div class="space-y-2 rounded-sm bg-slate-950 p-2">
                    <div class="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div class="h-2 w-20 rounded-lg bg-slate-400" />
                      <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div class="h-4 w-4 rounded-full bg-slate-400" />
                      <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div class="h-4 w-4 rounded-full bg-slate-400" />
                      <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
                <span class="block w-full p-2 text-center font-normal"> Dark </span>
              </Label>
              <span class="block w-full space-x-2 p-2 text-center font-normal xl:hidden"
                >Toggle theme: <kbd>Shift(⇧)+Command(⌘)+X</kbd></span
              >
            </RadioGroup>
            <span class="hidden w-full p-2 text-center font-normal xl:block"
              >Toggle theme: <kbd>Shift(⇧)+Command(⌘)+X</kbd>
            </span>
          </div>
          <div>
            <Label for="color">Color</Label>
            <RadioGroup
              id="color"
              class="grid w-full grid-cols-3 gap-4 sm:w-fit sm:grid-cols-4 md:grid-cols-5"
              v-model:model-value="color"
            >
              <Label
                for="green"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#16a34a]"
                :class="{
                  '[&>div]:border-[#16a34a]': color === 'green'
                }"
              >
                <RadioGroupItem value="green" class="sr-only" id="green" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#16a34a]" />
                  <span class="block text-center text-xs font-semibold"> Green </span>
                </div>
              </Label>
              <Label
                for="blue"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#2563eb]"
                :class="{
                  '[&>div]:border-[#2563eb]': color === 'blue'
                }"
              >
                <RadioGroupItem value="blue" class="sr-only" id="blue" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#2563eb]" />
                  <span class="block text-center text-xs font-semibold"> Blue </span>
                </div>
              </Label>
              <Label
                for="red"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#b91c1c]"
                :class="{
                  '[&>div]:border-[#b91c1c]': color === 'red'
                }"
              >
                <RadioGroupItem value="red" class="sr-only" id="red" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#b91c1c]" />
                  <span class="block text-center text-xs font-semibold"> Red </span>
                </div>
              </Label>
              <Label
                for="zinc"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#3f3f46]"
                :class="{
                  '[&>div]:border-[#3f3f46]': color === 'zinc'
                }"
              >
                <RadioGroupItem value="zinc" class="sr-only" id="zinc" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#3f3f46]" />
                  <span class="block text-center text-xs font-semibold"> Zinc </span>
                </div>
              </Label>
              <Label
                for="orange"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#c2410c]"
                :class="{
                  '[&>div]:border-[#c2410c]': color === 'orange'
                }"
              >
                <RadioGroupItem value="orange" class="sr-only" id="orange" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#c2410c]" />
                  <span class="block text-center text-xs font-semibold"> Orange </span>
                </div>
              </Label>
              <Label
                for="rose"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#e11d48]"
                :class="{
                  '[&>div]:border-[#e11d48]': color === 'rose'
                }"
              >
                <RadioGroupItem value="rose" class="sr-only" id="rose" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#e11d48]" />
                  <span class="block text-center text-xs font-semibold"> Rose </span>
                </div>
              </Label>
              <Label
                for="slate"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#334155]"
                :class="{
                  '[&>div]:border-[#334155]': color === 'slate'
                }"
              >
                <RadioGroupItem value="slate" class="sr-only" id="slate" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#334155]" />
                  <span class="block text-center text-xs font-semibold"> Slate </span>
                </div>
              </Label>
              <Label
                for="stone"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#44403c]"
                :class="{
                  '[&>div]:border-[#44403c]': color === 'stone'
                }"
              >
                <RadioGroupItem value="stone" class="sr-only" id="stone" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#44403c]" />
                  <span class="block text-center text-xs font-semibold"> Stone </span>
                </div>
              </Label>
              <Label
                for="gray"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#374151]"
                :class="{
                  '[&>div]:border-[#374151]': color === 'gray'
                }"
              >
                <RadioGroupItem value="gray" class="sr-only" id="gray" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#374151]" />
                  <span class="block text-center text-xs font-semibold"> Gray </span>
                </div>
              </Label>
              <Label
                for="neutral"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#404040]"
                :class="{
                  '[&>div]:border-[#404040]': color === 'neutral'
                }"
              >
                <RadioGroupItem value="neutral" class="sr-only" id="neutral" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#404040]" />
                  <span class="block text-center text-xs font-semibold"> Neutral </span>
                </div>
              </Label>
              <Label
                for="yellow"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#a16207]"
                :class="{
                  '[&>div]:border-[#a16207]': color === 'yellow'
                }"
              >
                <RadioGroupItem value="yellow" class="sr-only" id="yellow" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#a16207]" />
                  <span class="block text-center text-xs font-semibold"> Yellow </span>
                </div>
              </Label>
              <Label
                for="violet"
                class="cursor-pointer [&:has([data-state=checked])>div]:border-[#6d28d9]"
                :class="{
                  '[&>div]:border-[#6d28d9]': color === 'violet'
                }"
              >
                <RadioGroupItem value="violet" class="sr-only" id="violet" />
                <div
                  class="inline-flex w-20 items-center justify-start space-x-1 rounded-md border-2 border-muted p-1.5 hover:border-accent"
                >
                  <div class="h-5 w-5 rounded-full bg-[#6d28d9]" />
                  <span class="block text-center text-xs font-semibold"> Violet </span>
                </div>
              </Label>
            </RadioGroup>
          </div>
        </div>
        <Button type="submit" class="mx-auto mt-4">Update preferences</Button>
      </form>
    </CardContent>
  </Card>
</template>

<style scoped lang="css"></style>
