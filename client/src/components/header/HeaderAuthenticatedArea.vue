<script setup lang="ts">
import { AlignJustify, LogOut, Moon, Sun } from 'lucide-vue-next'
import { Cog, Languages } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { extractLabels } from '@/lib/misc'
import { signOutService } from '@/lib/services'
import { cn, getAcronym } from '@/lib/utils'
import { t } from '@/shared/locales'
import { useSidebarStore, useThemeStore, useUserStore } from '@/stores'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const sidebar = useSidebarStore()
const themeStore = useThemeStore()

async function handleSignOut() {
  await signOutService()
    .then(() => userStore.clear())
    .then(() => router.push('/sign-in'))
    .then(() => toast.success('Sign out successfully'))
}

const labels = computed(() => extractLabels(route.path))
const avatar = computed(() => userStore.user?.photoURL)
const name = computed(() => userStore.user?.displayName)
const acronym = computed(() => getAcronym(name.value || userStore.user?.email || ''))
</script>

<template>
  <header
    :class="
      cn(
        'sticky top-0 z-40 flex h-14 w-full flex-row items-center justify-between',
        'border-b bg-white px-7 shadow dark:bg-background'
      )
    "
  >
    <div class="flex flex-row items-center">
      <Button variant="ghost" size="icon" class="rounded-full xl:hidden" @click="sidebar.toggle()">
        <AlignJustify class="text-muted-foreground" />
        <span class="sr-only">{{ t('Open sidebar') }}</span>
      </Button>
      <Breadcrumb class="hidden px-8 sm:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as-child>
              <RouterLink to="/"> Home </RouterLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <template v-for="({ path, label }, _index) in labels" :key="_index">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as-child>
                <RouterLink :to="path">
                  {{ t(label) }}
                </RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </template>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <div class="flex w-fit flex-row items-center space-x-2 lg:mr-8">
      <span class="hidden font-medium lg:block">
        {{ name }}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Avatar class="m-1 h-8 w-8 cursor-pointer sm:h-10 sm:w-10">
            <AvatarImage :src="avatar!" :alt="name" v-if="avatar" />
            <AvatarFallback>{{ acronym }}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="z-[10000] w-[250px]" align="end">
          <DropdownMenuLabel class="ml-2">Tools</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem as-child>
            <RouterLink to="/settings">
              <Cog class="icon-spin mr-2 text-primary" />
              <span>{{ t('Settings') }}</span>
              <DropdownMenuShortcut><kbd>Alt+⇧+S</kbd></DropdownMenuShortcut>
            </RouterLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="themeStore.toggleTheme">
            <Sun v-if="themeStore.theme.dark" class="mr-2 text-primary" />
            <Moon v-else class="mr-2 text-primary" />
            <span>{{ t('Toggle Theme') }} </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages class="mr-2 text-primary" />
              <span>Language</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup v-model:model-value="$i18n.locale">
                  <DropdownMenuRadioItem value="en-US">
                    <span>English</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="vi-VN">
                    <span>Tiếng Việt</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleSignOut">
            <LogOut class="mr-2 text-primary" />
            <span>{{ t('Sign Out') }}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>

<style scoped lang="css">
.icon-spin {
  -webkit-animation: icon-spin 6s cubic-bezier(0.15, 1.15, 0.65, 1) infinite;
  animation: icon-spin 6s cubic-bezier(0.15, 1.15, 0.65, 1) infinite;
}

@-webkit-keyframes ripple {
  0% {
    height: 1rem;
    width: 1rem;
  }

  100% {
    height: 3.125rem;
    width: 3.125rem;
    border-color: transparent;
  }
}

@keyframes ripple {
  0% {
    height: 1rem;
    width: 1rem;
  }

  100% {
    height: 3.125rem;
    width: 3.125rem;
    border-color: transparent;
  }
}

@-webkit-keyframes icon-spin {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes icon-spin {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
