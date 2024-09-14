<script setup lang="ts">
import QrCode from 'qrcode-vue3'

interface QRCodeProps {
  value: string
  size?: number
}

defineProps<QRCodeProps>()
</script>

<template>
  <qr-code
    :width="size ?? 400"
    :height="size ?? 400"
    :value="value"
    :key="value"
    :background-options="{ color: '#ffffff' }"
    :qr-options="{ errorCorrectionLevel: 'H' }"
    :image-options="{ hideBackgroundDots: true, imageSize: 0.7, margin: 10 }"
    :corners-square-options="{ type: 'square', color: '#c63437' }"
    :corners-dot-options="{ type: 'square', color: '#c63437' }"
    :dots-options="{
      type: 'dots',
      color: '#c63437'
    }"
    image="images/logo.png"
    :download="false"
  />
</template>
