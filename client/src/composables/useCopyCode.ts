import { useClipboard } from '@vueuse/core'
import type { Ref } from 'vue'

type CopyCodeParams = {
  code: string
  checkRef: Ref<boolean>
}

export const useCopyCode = async ({ code, checkRef }: CopyCodeParams) => {
  const { copy } = useClipboard({
    source: code
  })

  checkRef.value = false
  await copy(code)
  checkRef.value = true

  setTimeout(() => {
    checkRef.value = false
  }, 1500)
}
