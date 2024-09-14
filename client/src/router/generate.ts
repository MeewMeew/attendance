import type { RouteMeta, RouteRecordRaw } from 'vue-router'

export const generateManagementRoutes = (path: string, parent: string = ''): RouteRecordRaw[] => {
  return [
    {
      path: path,
      name: `${parent}.${path}`,
      component: () => import(`@/views/${parent + '/'}${path}/MainView.vue`)
    },
    {
      path: `${path}/:method/:id`,
      component: () => import(`@/views/${parent + '/'}${path}/dataview/VersatileView.vue`)
    },
    {
      path: `${path}/:method`,
      component: () => import(`@/views/${parent + '/'}${path}/dataview/VersatileView.vue`)
    }
  ]
}

type GenerateRootRouteOptions = {
  path: string
  children?: RouteRecordRaw[]
  meta?: RouteMeta
}

export const generateMainRoute = (parent: string, extend: string = ''): RouteRecordRaw => {
  return {
    path: '' + extend,
    component: () => import(`@/views/${parent}/main/MainView.vue`)
  }
}

export const generateRootRoute = (options: GenerateRootRouteOptions): RouteRecordRaw => {
  return {
    path: `/${options.path === 'landing' ? '' : options.path}`,
    component: () =>
      import(
        options.children
          ? '@/components/layouts/Authenticated.vue'
          : `@/views/${options.path}/main/MainView.vue`
      ),
    children: options.children,
    meta: options.meta
  }
}

export const generateNormalRoute = (path: string, parent: string = ''): RouteRecordRaw => {
  return {
    path: path,
    component: () => import(`@/views/${parent + '/'}${path}/MainView.vue`)
  }
}

export const generateErrorRoute = (): RouteRecordRaw => {
  return {
    path: '/:pathMatch(.*)*', // Catch all
    component: () => import('@/views/errors/NotFoundView.vue')
  }
}
