<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import { Progress } from '@/components/ui/progress'

enum Transition {
  FADE_LEFT = 'fade-left',
  FADE_RIGHT = 'fade-right',
  FADE_UP = 'fade-up',
  FADE_DOWN = 'fade-down'
}

interface PreloadProps {
  loadingSpeed?: number
  overflowActive?: boolean
  transitionSpeed?: number
  transitionType?: Transition
}

interface PreloadEmits {
  (event: 'loading-is-over'): void
  (event: 'transition-is-over'): void
}

const transitionMap: Record<Transition | 'default', { transform: string }> = {
  [Transition.FADE_LEFT]: { transform: 'translate(-100%, 0)' },
  [Transition.FADE_RIGHT]: { transform: 'translate(100%, 0)' },
  [Transition.FADE_UP]: { transform: 'translate(0, -100%)' },
  [Transition.FADE_DOWN]: { transform: 'translate(0, 100%)' },
  default: { transform: 'transform(-100%, 0)' }
}

const props = withDefaults(defineProps<PreloadProps>(), {
  loadingSpeed: 15,
  overflowActive: true,
  transitionSpeed: 1500,
  transitionType: Transition.FADE_LEFT
})
const emit = defineEmits<PreloadEmits>()
const route = useRoute()

const percent = ref(0)
const percentMax = computed(() => (percent.value >= 100 ? 100 : percent.value))

const preloadTransitionSpeed = computed(() => ({
  transition: `all ${props.transitionSpeed}ms ease-in-out`
}))
const preloadTransitionType = computed(() => {
  if (percent.value >= 100) return transitionMap[props.transitionType] || transitionMap.default
  return null
})
const landingPage = computed(() => route.path === '/')
watchEffect(() => {
  if (percent.value < 100) {
    setTimeout(() => {
      percent.value += 1
    }, props.loadingSpeed)
  } else {
    loadingIsOver()
    transitionIsOver()
  }
})

onBeforeMount(() => {
  if (props.overflowActive) setOverflowHidden()
})

onMounted(() => {
  percent.value = percent.value += 1
})

function loadingIsOver() {
  emit('loading-is-over')
}

function setOverflowAuto() {
  document.body.style.overflow = 'auto'
}

function setOverflowHidden() {
  document.body.style.overflow = 'hidden'
}

function transitionIsOver() {
  setTimeout(() => {
    emit('transition-is-over')
    if (props.overflowActive) setOverflowAuto()
  }, props.transitionSpeed)
}
</script>

<template>
  <div
    v-if="!landingPage"
    :style="[preloadTransitionSpeed, preloadTransitionType]"
    class="fixed left-0 top-0 z-[99999] flex h-screen w-screen items-center justify-center bg-background"
  >
    <div class="flex w-4/6 flex-col items-center justify-center space-y-8">
      <span>{{ percent > 100 ? 100 : percent }}%</span>
      <Progress v-model="percentMax" />
    </div>
  </div>
</template>
