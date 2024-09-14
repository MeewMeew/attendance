<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { QRcode } from '@/components/qrcode'
import { useNanoIDStore } from '@/stores'
const { nanoid } = storeToRefs(useNanoIDStore())
</script>

<template>
  <QRcode :value="nanoid" />
</template>
