import './assets/index.css'
import '@/lib/registerSW'

import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/App.vue'
import { observeAuthState } from '@/lib/services'
import highlight from '@/plugins/highlight'
import router from '@/router'
import { i18n } from '@/shared/locales'
import { useMiscStore, useUserStore } from '@/stores'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

app.use(head)
app.use(pinia)
app.use(router)
app.use(highlight)
app.use(i18n)

const userStore = useUserStore()
const miscStore = useMiscStore()

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const unsubscribe = observeAuthState((user) => {
    if (requiresAuth && !user) {
      next('/sign-in')
      miscStore.setPreload(true)
    } else if (user) {
      const userRole = userStore.user.role
      const requiredRole = to.meta.requiresRole
      if (requiredRole && userRole !== requiredRole) {
        next(`/${userRole}`)
        miscStore.setPreload(true)
      } else {
        next()
      }
    } else {
      next()
    }
    unsubscribe()
  })
})


app.mount('#app')
