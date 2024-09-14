<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const devices = ref<MediaDeviceInfo[]>([])
const selectedDevice = ref<MediaDeviceInfo | null>(null)
const cameraLoading = ref<boolean>(true)

interface Data {
  rawValue: string
}

interface QRcodeScannerEmits {
  (e: 'update:scanner', data: string): void
}

const emit = defineEmits<QRcodeScannerEmits>()

onMounted(async () => {
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
    ({ kind }) => kind === 'videoinput'
  )

  if (devices.value.length > 0) {
    selectedDevice.value = devices.value[0]
  }
})

function paintOutline(detectedCodes: any, ctx: CanvasRenderingContext2D) {
  for (const detectedCode of detectedCodes) {
    const { x, y, width, height } = detectedCode.boundingBox
    const cornerLength = Math.min(width, height) * 0.1
    const cornerThickness = Math.min(width, height) * 0.02

    ctx.lineWidth = cornerThickness
    ctx.strokeStyle = 'blue'

    // Top-left corner
    ctx.beginPath()
    ctx.moveTo(x, y + cornerLength)
    ctx.lineTo(x, y)
    ctx.lineTo(x + cornerLength, y)
    ctx.stroke()

    // Top-right corner
    ctx.beginPath()
    ctx.moveTo(x + width - cornerLength, y)
    ctx.lineTo(x + width, y)
    ctx.lineTo(x + width, y + cornerLength)
    ctx.stroke()

    // Bottom-left corner
    ctx.beginPath()
    ctx.moveTo(x, y + height - cornerLength)
    ctx.lineTo(x, y + height)
    ctx.lineTo(x + cornerLength, y + height)
    ctx.stroke()

    // Bottom-right corner
    ctx.beginPath()
    ctx.moveTo(x + width - cornerLength, y + height)
    ctx.lineTo(x + width, y + height)
    ctx.lineTo(x + width, y + height - cornerLength)
    ctx.stroke()

    if (import.meta.env.DEV) {
      ctx.font = `${Math.min(width, height) * 0.1}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'blue'
      ctx.fillText(detectedCode.rawValue, x + width / 2, y + height / 2)
    }
  }
}

function onCameraOn() {
  cameraLoading.value = false
}
</script>

<template>
  <div class="flex h-full w-full items-center bg-black">
    <QrcodeStream
      @detect="(value: Data[]) => emit('update:scanner', value[0].rawValue)"
      :track="paintOutline"
      @cameraOn="onCameraOn"
    >
      <div class="z-10 h-full w-full shadow-black/50"></div>
    </QrcodeStream>
  </div>
</template>
