<template>
  <component :is="icon" class="svg-icon" />
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

interface SvgIconProps {
  name: string
}

const props = defineProps<SvgIconProps>()
const icon = defineAsyncComponent(() => import(`@/assets/icons/${props.name}.svg`))
</script>
