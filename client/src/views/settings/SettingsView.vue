<script setup lang="ts">
import { ref } from 'vue'

import AppearanceTab from '@/views/settings/AppearanceTab.vue'
import SettingsNav from '@/views/settings/SettingsNav.vue'

const currentTab = ref<string>('appearance')
</script>

<template>
  <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
    <aside class="-mx-4 lg:w-1/5">
      <SettingsNav :current-tab="currentTab" @current-tab="(tab) => (currentTab = tab)" />
    </aside>
    <div class="flex-1">
      <div class="space-y-6">
        <AppearanceTab v-if="currentTab === 'appearance'" />
        <AccountTab v-else-if="currentTab === 'account'" />
      </div>
    </div>
  </div>
</template>
