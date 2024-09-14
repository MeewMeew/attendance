import { createI18n, type VueI18nTranslation } from 'vue-i18n'

import enUS from '@/shared/locales/en.json'
import viVN from '@/shared/locales/vi.json'
type MessageSchema = typeof enUS

export const i18n = createI18n<[MessageSchema], 'en-US' | 'vi-VN'>({
  legacy: false,
  locale: 'en-US',
  messages: {
    'en-US': enUS,
    'vi-VN': viVN
  },
  missingWarn: false,
  fallbackWarn: false
})

export const t = i18n.global.t
export const n = i18n.global.n

export type VueI18nType = VueI18nTranslation<MessageSchema>